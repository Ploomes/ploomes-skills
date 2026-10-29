// Bancada local: imita o Ploomes para testar uma tela antes de ela ir ao construtor.
//
//   node servidor.mjs --pacote <pasta pacote-construtor> --tela <pasta dist da tela>
//
//   http://localhost:8780/        CRM falso (host): abre a tela num iframe e fala o protocolo da ponte
//   http://localhost:8780/api/    Ploomes falso (API OData mínima), com as regras de negócio que a tela
//                                 precisa respeitar: etapa de negócio fechado, volta de etapa, checklist,
//                                 ganhar só na última etapa, motivo de perda
//   http://localhost:8781/        a tela (build estático), em outra origem, como no Ploomes real
//
// Dados: <pacote>/dados-de-teste.json. Sem dependências: só Node 18+.
import http from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join, extname, resolve, dirname, sep } from 'node:path';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const args = Object.fromEntries(process.argv.slice(2).reduce((a, v, i, l) => (v.startsWith('--') ? [...a, [v.slice(2), l[i + 1]]] : a), []));
if (!args.tela || (!args.pacote && !args['api-real'])) { console.error('Uso: node servidor.mjs --pacote <pasta> --tela <dist>'); process.exit(2); }
const PORTA_HOST = Number(args['porta-host'] ?? 8780), PORTA_TELA = Number(args['porta-tela'] ?? 8781);
let CHAVE = 'chave-da-bancada';
const AQUI = dirname(fileURLToPath(import.meta.url));
const PACOTE = args.pacote ? resolve(args.pacote) : null, TELA = resolve(args.tela);
// Procura o @ploomescrm/bridge: --bridge, ou subindo de --tela (dist/) até achar node_modules.
function acharBridge() {
  if (args.bridge) return existsSync(args.bridge) ? args.bridge : null;
  for (let d = TELA; ; d = dirname(d)) {
    const arq = join(d, 'node_modules', '@ploomescrm', 'bridge', 'dist', 'index.mjs');
    if (existsSync(arq)) return arq;
    if (dirname(d) === d) return null;
  }
}
// Modo API real: --api-real <url>. A chave vem SÓ da variável PLOOMES_USER_KEY do terminal; o browser
// recebe a chave falsa e o proxy troca. Só leitura, salvo --permitir-escrita (use só em conta de teste).
const API_REAL = args['api-real'] ? args['api-real'].replace(/\/?$/, '/') : null;
// A chave real só segue para um host do Ploomes por https (ou para a própria máquina), e nunca por
// redirecionamento: o fetch do Node repassaria o cabeçalho User-Key a outro host.
const hostConfiavel = (u) => { try { const x = new URL(u); return (x.protocol === 'https:' && (x.hostname === 'ploomes.com' || x.hostname.endsWith('.ploomes.com'))) || (x.protocol === 'http:' && ['127.0.0.1', 'localhost', '[::1]'].includes(x.hostname)); } catch { return false; } };
if (API_REAL && !hostConfiavel(API_REAL)) { console.error(`--api-real só aceita host do Ploomes por https ou a própria máquina: ${API_REAL}`); process.exit(2); }
// No modo API real a chave falsa é sorteada a cada execução: com ela fixa, qualquer página aberta no
// navegador poderia usar o proxy, que troca a chave falsa pela real.
if (API_REAL) CHAVE = 'bancada-' + randomUUID();
const ESCRITA = process.argv.includes('--permitir-escrita');
// --escrita-so-em <Rota> (2026-10-20): libera escrita SÓ na rota dita (ex.: Account, para o as-is no campo da conta).
const ESCRITA_SO = args['escrita-so-em'] ?? null;
if (process.env.PLOOMES_USER_KEY) process.env.PLOOMES_USER_KEY = process.env.PLOOMES_USER_KEY.trim().replace(/^["']|["']$/g, '');
if (API_REAL && !process.env.PLOOMES_USER_KEY) { console.error('Modo API real exige a variável PLOOMES_USER_KEY.'); process.exit(2); }

// ------------------------------------------------------------------ documentos gerados (2026-10-06)
// Proposta, venda e documento criados na bancada ganham DocumentUrl = /_bancada/documento/<quote|order|document>/<id>,
// que devolve o HTML do modelo (pasta --modelos; padrão <pacote>/../../../modelos/html) com o que for simples preenchido.
const MODELOS_HTML = args.modelos ? resolve(args.modelos) : PACOTE ? resolve(PACOTE, '..', '..', '..', 'modelos', 'html') : null;
const urlDoDocumento = (tipo, id) => `http://localhost:${PORTA_HOST}/_bancada/documento/${tipo}/${id}`;
// O arquivo do modelo: <slug do nome do modelo>.html na pasta de modelos ("Pedido de venda" → pedido-de-venda.html),
// ou o que a lista abaixo disser para os nomes que não seguem o slug.
let ARQUIVO_DO_MODELO = [];
const slugDoModelo = (nome) => String(nome).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '.html';
function documentoHtml(tipo, id) {
  const col = { quote: 'Quotes', order: 'Orders', document: 'Documents' }[tipo];
  const r = col && db[col]?.find((x) => x.Id === id);
  if (!r) return null;
  const modelo = db.DocumentTemplates.find((m) => m.Id === r.TemplateId)?.Name ?? 'Documento';
  const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const cliente = db.Contacts.find((c) => c.Id === r.ContactId)?.Name ?? '';
  const negocio = db.Deals.find((d) => d.Id === r.DealId);
  const item = (r.Products ?? r.Sections?.[0]?.Products ?? negocio?.Products ?? [])[0];
  const produto = db.Products.find((p) => p.Id === item?.ProductId)?.Name ?? '';
  const data = new Date(r.Date ?? r.CreateDate ?? Date.now()).toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' });
  const numero = r.QuoteNumber ?? r.OrderNumber ?? r.DocumentNumber ?? r.Id;
  const arq = ARQUIVO_DO_MODELO.find(([re]) => re.test(modelo))?.[1] ?? slugDoModelo(modelo);
  let html = arq && MODELOS_HTML && existsSync(join(MODELOS_HTML, arq)) ? readFileSync(join(MODELOS_HTML, arq), 'utf-8') : null;
  const faixa = `<div style="max-width:210mm;margin:0 auto 10px;background:#FFF6D6;border:1px solid #E7D28A;border-radius:6px;padding:8px 12px;font:13px Arial,sans-serif;color:#1A1A1A">Bancada · <b>${esc(modelo)}</b> nº ${esc(numero)} · gerado em ${esc(new Date(r.CreateDate ?? Date.now()).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }))}${cliente ? ' · ' + esc(cliente) : ''}${negocio ? ' · negócio ' + esc(negocio.Title) : ''}</div>`;
  if (!html) return `<!doctype html><meta charset="utf-8"><title>${esc(modelo)}</title><body style="font:14px Arial,sans-serif;padding:24px">${faixa}<p>O modelo HTML de "${esc(modelo)}" não foi encontrado em ${esc(MODELOS_HTML ?? '(sem pasta de modelos)')}.</p></body>`;
  // preenche o que é simples: [Entidade.Campo] → valor do registro quando o nome do campo bate
  const valor = (campo) => {
    const c = campo.toLowerCase();
    if (/^(comprador|cliente)$/.test(c)) return cliente;
    if (/^produto$/.test(c)) return produto;
    if (/^quantidade/.test(c) && item?.Quantity != null) return Number(item.Quantity).toLocaleString('pt-BR');
    if (/^valor unit/.test(c) && item?.UnitPrice != null) return Number(item.UnitPrice).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
    if (/^data( da ordem| da proposta| do documento| de emiss[aã]o)?$/.test(c)) return data;
    if (/^n[uú]mero( da proposta| do documento)?$/.test(c)) return String(numero);
    return null;
  };
  html = html.replace(/(<field\b[^>]*>)\[([^\].]+)\.([^\]]+)\](<\/field>)/g, (m, a, _ent, campo, b) => { const v = valor(campo.trim()); return v ? a + esc(v) + b : m; });
  return html.replace(/<body([^>]*)>/i, (m) => m + faixa);
}

// ------------------------------------------------------------------ dados
const COLUNA = { 1: 'StringValue', 2: 'BigStringValue', 4: 'IntegerValue', 5: 'DecimalValue', 6: 'DecimalValue', 7: 'IntegerValue', 8: 'DateTimeValue', 9: 'DateTimeValue', 10: 'BoolValue', 11: 'StringValue', 12: 'StringValue', 13: 'DecimalValue', 17: 'StringValue', 18: 'StringValue', 19: 'IntegerValue', 20: 'StringValue', 21: 'StringValue', 22: 'BigStringValue', 23: 'DecimalValue', 24: 'StringValue' };
let db, avisos, registro, falhas, temporizadores = [];
// quem pode alterar o próprio usuário (PATCH Users) sem ser administrador — fica fora do registro, que a API devolve
let permissaoPropria = new Map();
// as FieldKeys que o flow do registro do onboarding grava (/_bancada/flow/onboarding)
let flowDoOnboarding = null;

function carregar() {
  const s = JSON.parse(readFileSync(join(PACOTE, 'dados-de-teste.json'), 'utf-8'));
  neppo = null;
  let seq = 100000;
  const id = () => ++seq;
  db = { Users: [], Contacts: [], DealsPipelines: [], DocumentTemplates: [], Fields: [], FieldsOptionsTables: [], FieldsOptionsTablesOptions: [], Checklists: [], Deals: [], DealsLossReasons: [],
    // coleções opcionais (2026-10-05): agenda, vendas, mix de produtos, propostas e conta
    Teams: [], TasksTypes: [], Tasks: [], InteractionRecords: [], Orders: [], ContactsClasses: [], Products: [], ProductsGroups: [], ContactsProducts: [], DealsContactsProducts: [], Quotes: [],
    // documentos (2026-10-06): registros do modelo "Documento" (relatório, contrato, ficha…)
    Documents: [],
    // moedas (2026-10-06): os Ids da API real — 1 BRL, 2 USD, 3 EUR
    Currencies: [{ Id: 1, Code: 'BRL', Symbol: 'R$' }, { Id: 2, Code: 'USD', Symbol: 'US$' }, { Id: 3, Code: 'EUR', Symbol: '€' }], Account: [{ Id: 1, Name: s.conta?.nome ?? 'Conta da bancada', OtherProperties: [] }] };
  // perfis de usuário (2026-10-27): "perfis": [{ "id": 1, "nome": "Administrador", "administrador": true }] e "usuarios[].perfil" (o nome).
  // "usuarios[].podeAlterarOProprioUsuario": false simula o perfil que recebe 403 no PATCH Users (o onboarding da conta grava ali).
  db.UsersProfiles = (s.perfis ?? []).map((x) => ({ Id: x.id ?? id(), Name: x.nome, Administrator: !!x.administrador }));
  permissaoPropria = new Map();
  flowDoOnboarding = s.flowDoOnboarding ?? null;
  for (const u of s.usuarios) {
    const perfil = u.perfil ? db.UsersProfiles.find((x) => x.Name === u.perfil) ?? erroSeed(`perfil ${u.perfil}`) : null;
    const novo = { Id: id(), Name: u.nome, Email: u.email ?? null, ProfileId: perfil?.Id ?? null, OtherProperties: [] };
    db.Users.push(novo); permissaoPropria.set(novo.Id, u.podeAlterarOProprioUsuario !== false);
  }
  for (const n of s.classes ?? []) db.ContactsClasses.push({ Id: id(), Name: n });
  for (const n of s.tiposDeTarefa ?? []) db.TasksTypes.push({ Id: id(), Name: n });
  // grupos de produto (2026-10-06): "gruposDeProduto": ["…"], e "produtos" aceita { nome, grupo }
  for (const n of s.gruposDeProduto ?? []) db.ProductsGroups.push({ Id: id(), Name: n });
  // produtos (2026-10-07): aceitam também "codigo" (nativo Code = CODPROD do Sankhya), "unidadeMedida" e "campos" (product_…)
  for (const p of s.produtos ?? []) { const o = typeof p === 'string' ? { nome: p } : p; db.Products.push({ Id: id(), Name: o.nome, Code: o.codigo ?? null, MeasurementUnit: o.unidadeMedida ?? null, GroupId: o.grupo ? (db.ProductsGroups.find((g) => g.Name === o.grupo) ?? erroSeed(`grupo de produto ${o.grupo}`)).Id : null, OtherProperties: [] }); }
  const porNome = (col, n, o) => (n ? db[col].find((x) => x.Name === n) ?? erroSeed(`${o} ${n}`) : null);
  for (const c of s.clientes ?? []) db.Contacts.push({ Id: id(), Name: c.nome, TypeId: c.tipo === 'pessoa' ? 2 : 1, OwnerId: c.responsavel ? porNome('Users', c.responsavel, 'usuário').Id : null, ClassId: c.classe ? porNome('ContactsClasses', c.classe, 'classe').Id : null, StatusId: 1, Email: c.email ?? null, CompanyId: null, OtherProperties: [] });
  // contato de PJ (2026-10-07): { "tipo": "pessoa", "empresa": "<nome da empresa>" } vira CompanyId (como o flow F4 grava)
  for (const c of s.clientes ?? []) if (c.empresa) db.Contacts.find((y) => y.Name === c.nome).CompanyId = (db.Contacts.find((y) => y.Name === c.empresa && y.TypeId === 1) ?? erroSeed(`empresa ${c.empresa}`)).Id;
  for (const e of s.equipes ?? []) db.Teams.push({ Id: id(), Name: e.nome, Users: (e.usuarios ?? []).map((n) => ({ UserId: porNome('Users', n, 'usuário').Id })) });
  for (const f of s.funis) {
    const r = f.regras ?? {};
    db.DealsPipelines.push({ Id: id(), Name: f.nome, MustPassAllStages: !!r.mustPassAllStages, ForbiddenStageReturn: !!r.forbiddenStageReturn, MayWinDeals: r.mayWinDeals !== false, MayLoseDeals: r.mayLoseDeals !== false, WinDealOnLastStage: !!r.winDealOnLastStage, SingularUnitName: f.unidade ?? null, PluralUnitName: f.unidades ?? null, WinVerb: { Name: f.verboGanhar ?? 'Ganhar' }, LoseVerb: { Name: f.verboPerder ?? 'Perder' },
      Stages: f.etapas.map((n, i) => ({ Id: id(), Name: n, Ordination: i + 1 })) });
  }
  for (const m of s.modelos ?? []) db.DocumentTemplates.push({ Id: id(), Name: m });
  for (const m of s.motivosDePerda ?? []) db.DealsLossReasons.push({ Id: id(), Name: m, PipelineId: null });
  for (const c of s.campos) {
    let OptionsTableId = null;
    if (c.opcoes) { OptionsTableId = id(); const t = { Id: OptionsTableId, Options: c.opcoes.map((n) => ({ Id: id(), Name: n })) }; db.FieldsOptionsTables.push(t); for (const o of t.Options) db.FieldsOptionsTablesOptions.push({ ...o, TableId: t.Id }); }
    // EntityId pelo prefixo da chave (2026-10-20): a tela genérica acha campo por nome + entidade
    const ENTIDADE = { deal: 2, contact: 1, quote: 7, order: 4, task: 12, product: 10, account: 15, interaction_record: 36, document: 66, contact_product: 75, user: 24 };
    db.Fields.push({ Id: id(), Key: c.fieldKey, Name: c.nome, TypeId: c.typeId, EntityId: c.entidade ?? ENTIDADE[c.fieldKey.replace(/_[A-Za-z0-9-]+$/, '')] ?? null, OptionsTableId, Coluna: c.coluna ?? null });
  }
  // campos do CLIENTE (contact_…): "clientes": [{ "nome": …, "campos": { fieldKey: valor } }]
  // valor em lista = campo de opção múltipla (ex.: Papel = ["Comprador", "Fornecedor"]): uma entrada por opção, como a API real
  for (const c of s.clientes ?? []) { const x = db.Contacts.find((y) => y.Name === c.nome); for (const [fk, v] of Object.entries(c.campos ?? {})) for (const item of Array.isArray(v) ? v : [v]) x.OtherProperties.push(valorDeCampo(fk, item)); }
  for (const p of s.produtos ?? []) if (typeof p === 'object' && p.campos) { const x = db.Products.find((y) => y.Name === p.nome); for (const [fk, v] of Object.entries(p.campos)) for (const item of Array.isArray(v) ? v : [v]) x.OtherProperties.push(valorDeCampo(fk, item)); }
  const funil = (n) => db.DealsPipelines.find((p) => p.Name === n) ?? erroSeed(`funil ${n}`);
  const etapa = (f, n) => funil(f).Stages.find((e) => e.Name === n) ?? erroSeed(`etapa ${n} em ${f}`);
  const usuario = (n) => (n ? db.Users.find((u) => u.Name === n) ?? erroSeed(`usuário ${n}`) : db.Users[0]);
  const cliente = (n) => (n ? db.Contacts.find((c) => c.Name === n) ?? erroSeed(`cliente ${n}`) : null);
  for (const c of s.checklists ?? []) {
    db.Checklists.push({ Id: id(), Name: c.nome, DealStageId: etapa(c.funil, c.etapa).Id,
      Fields: c.itens.map((it, i) => ({ Id: id(), Name: it.nome, Required: it.obrigatorio !== false, FieldKey: it.fieldKey, Ordination: i + 1,
      // condição real de "preenchido": diferente de vazio (OperationId 2); "condicao": "invertida" | "nenhuma" simula conta mal configurada
      Conditions: it.obrigatorio === false ? [] : it.condicao === 'nenhuma' ? [] : [{ OperationId: it.condicao === 'invertida' ? 1 : 2 }] })) });
  }
  const STATUS = { aberto: 1, ganho: 2, perdido: 3 };
  const novoDeal = (n) => {
    const f = funil(n.funil), e = etapa(n.funil, n.etapa), c = cliente(n.cliente), u = usuario(n.responsavel);
    const d = { Id: id(), Title: n.titulo, PipelineId: f.Id, StageId: e.Id, StatusId: STATUS[n.status ?? 'aberto'], ContactId: c?.Id ?? null, OwnerId: u.Id, Amount: n.valor ?? 0, CreateDate: new Date().toISOString(), DaysInStage: n.diasNaEtapa ?? 0,
      // negócio ganho/perdido no seed: "finalizadoEm" vira FinishDate (2026-10-06)
      FinishDate: (n.status ?? 'aberto') === 'aberto' ? null : new Date(n.finalizadoEm ?? Date.now()).toISOString(), CurrencyId: { BRL: 1, USD: 2, EUR: 3 }[n.moeda] ?? 1,
      CollaboratingUsers: (n.colaboradores ?? []).map((x) => ({ UserId: usuario(x).Id })),
      Products: (n.produtos ?? []).map((p) => ({ Id: id(), ProductId: porNome('Products', p.produto, 'produto').Id, Quantity: p.quantidade ?? 0 })),
      ContactProductId: null, ContactsProducts: [], OtherProperties: [] };
    for (const [fk, v] of Object.entries(n.campos ?? {})) d.OtherProperties.push(valorDeCampo(fk, v));
    db.Deals.push(d);
  };
  for (const n of s.negocios ?? []) novoDeal(n);
  for (const g of s.gerar ?? []) for (let i = 1; i <= g.quantidade; i++) novoDeal({ ...g.modelo, titulo: `${g.modelo.titulo} ${String(i).padStart(3, '0')}`, etapa: g.etapas[i % g.etapas.length] });
  // coleções opcionais — datas em ISO UTC, para o filtro comparar como a API
  const iso = (v) => (v ? new Date(v).toISOString() : null);
  const negocio = (t) => (t ? db.Deals.find((d) => d.Title === t) ?? erroSeed(`negócio ${t}`) : null);
  for (const t of s.tarefas ?? []) db.Tasks.push({ Id: id(), Title: t.titulo, TypeId: porNome('TasksTypes', t.tipo, 'tipo de tarefa')?.Id ?? null, DateTime: iso(t.data), NoTime: !!t.semHorario,
    Finished: !!t.finalizada, FinishDate: iso(t.finalizadaEm), ContactId: cliente(t.cliente)?.Id ?? null, DealId: negocio(t.negocio)?.Id ?? null, InteractionRecordId: null,
    Users: [{ UserId: usuario(t.responsavel).Id }], CreateDate: iso(t.criadaEm ?? t.data), Description: t.descricao ?? null,
    OtherProperties: Object.entries(t.campos ?? {}).map(([fk, v]) => valorDeCampo(fk, v)), __neppo: t.envio ?? null });
  for (const c of s.clientes ?? []) if (c.telefone) db.Contacts.find((y) => y.Name === c.nome).Phones = [{ PhoneNumber: c.telefone }];
  const novaInteracao = (r, data) => {
    const x = { Id: Math.max(0, ...db.InteractionRecords.map((y) => y.Id), seq) + 1, Content: r.conteudo, Date: data, ContactId: cliente(r.cliente)?.Id ?? null, DealId: negocio(r.negocio)?.Id ?? null,
      OwnerId: r.responsavel ? usuario(r.responsavel).Id : null, OtherProperties: [] };
    seq = Math.max(seq, x.Id);
    for (const [fk, v] of Object.entries(r.campos ?? {})) x.OtherProperties.push(valorDeCampo(fk, v));
    db.InteractionRecords.push(x);
  };
  for (const r of s.interacoes ?? []) novaInteracao(r, iso(r.data));
  // mensagens "ao vivo": entram sozinhas N segundos depois de carregar (simula a Neppo gravando a conversa)
  for (const t of temporizadores) { clearTimeout(t); clearInterval(t); }
  temporizadores = (s.mensagensAoVivo ?? []).map((r) => setTimeout(() => novaInteracao(r, new Date().toISOString()), (r.aposSegundos ?? 30) * 1000));
  // vendas (2026-10-06): aceitam "negocio", "campos" e "produtos" — é como a nota de venda vinda do Sankhya chega
  for (const v of s.vendas ?? []) { const oid = id(); db.Orders.push({ Id: oid, OrderNumber: db.Orders.length + 1, Date: iso(v.data), CreateDate: iso(v.criadaEm ?? v.data ?? new Date()), Amount: v.valor ?? 0, CurrencyId: { BRL: 1, USD: 2, EUR: 3 }[v.moeda] ?? 1, OwnerId: usuario(v.responsavel).Id, ContactId: cliente(v.cliente)?.Id ?? null, TemplateId: porNome('DocumentTemplates', v.modelo, 'modelo')?.Id ?? null,
    DealId: negocio(v.negocio)?.Id ?? null, OtherProperties: Object.entries(v.campos ?? {}).map(([fk, x]) => valorDeCampo(fk, x)),
    // "semDocumento": true simula venda sem PDF gerado (DocumentUrl vazio): a tela abre o registro nativo
    DocumentUrl: v.semDocumento ? null : urlDoDocumento('order', oid),
    Products: (v.produtos ?? []).map((p) => ({ Id: id(), ProductId: porNome('Products', p.produto, 'produto').Id, Quantity: p.quantidade ?? 0, UnitPrice: p.preco ?? null })) }); }
  // documentos (2026-10-06): "documentos": [{ "nome", "modelo", "negocio", "cliente", "criadoEm", "campos" }]
  for (const d of s.documentos ?? []) { const did = id(); db.Documents.push({ Id: did, DocumentNumber: db.Documents.length + 1, Name: d.nome ?? null, Date: iso(d.criadoEm ?? new Date()), CreateDate: iso(d.criadoEm ?? new Date()),
    TemplateId: porNome('DocumentTemplates', d.modelo, 'modelo').Id, DealId: negocio(d.negocio)?.Id ?? null, ContactId: cliente(d.cliente)?.Id ?? null, OwnerId: usuario(d.responsavel).Id,
    DocumentUrl: urlDoDocumento('document', did), OtherProperties: Object.entries(d.campos ?? {}).map(([fk, x]) => valorDeCampo(fk, x)) }); }
  for (const o of s.mixDeProdutos ?? []) {
    const cp = { Id: id(), Name: o.nome, ContactId: cliente(o.cliente)?.Id ?? null, ProductId: porNome('Products', o.produto, 'produto')?.Id ?? null, CreateDate: iso(o.criadoEm ?? new Date()), OtherProperties: [] };
    for (const [fk, v] of Object.entries(o.campos ?? {})) cp.OtherProperties.push(valorDeCampo(fk, v));
    db.ContactsProducts.push(cp);
    if (o.negocio) negocio(o.negocio).ContactsProducts.push({ ContactProductId: cp.Id });
  }
  for (const [fk, v] of Object.entries(s.conta?.campos ?? {})) db.Account[0].OtherProperties.push(valorDeCampo(fk, v));
  carregarProcesso(s, { id, funil, etapa, iso });
  sincronizarVinculos();
  // ---- Neppo simulada (2026-10-05): conversas do chat embarcado e a lógica do flow F1 (um registro de interação por conversa)
  camposF1 = s.camposF1 ?? null;
  db.NeppoConversas = [];
  for (const cv of s.conversasNeppo ?? []) {
    const cli = cliente(cv.cliente);
    const reg = { Id: id(), Content: `Conversa de WhatsApp (Neppo) · protocolo ${cv.protocolo}`, Date: iso(cv.inicio ?? new Date()), ContactId: cli.Id, DealId: null, OtherProperties: [] };
    db.InteractionRecords.push(reg);
    const conv = { sessionId: String(cv.sessao), protocolo: cv.protocolo, telefone: cv.telefone ?? cli.Phones?.[0]?.PhoneNumber ?? '', cliente: cli.Name, clienteId: cli.Id, registroId: reg.Id, mensagens: [],
      status: cv.status ?? 'EM_ANDAMENTO', grupo: cv.grupo ?? (s.gruposNeppo ?? ['Atendimento'])[0] };
    db.NeppoConversas.push(conv);
    if (camposF1) for (const [k, v] of [['canal', 'WhatsApp'], ['sessao', conv.sessionId], ['protocolo', conv.protocolo], ['telefone', conv.telefone], ['statusSessao', 'OPEN']]) if (camposF1[k]) gravarOP(reg, camposF1[k], v);
    for (const m of cv.mensagens ?? []) aplicarMensagemF1(conv, papelDe(m.de), m.texto, iso(m.quando));
  }
  for (const r of s.neppoAoVivo ?? []) temporizadores.push(setTimeout(() => { const c = db.NeppoConversas.find((x) => x.sessionId === String(r.sessao)); try { if (c) aplicarMensagemF1(c, papelDe(r.de), r.texto, new Date().toISOString()); } catch (e) { avisos.push(`neppoAoVivo (sessão ${r.sessao}): ${e.message}`); console.warn('aviso:', e.message); } }, (r.aposSegundos ?? 30) * 1000));
  // F2 simulado (legado): tarefa "WhatsApp a enviar…" é enviada pela "Neppo" 5 s depois de criada
  temporizadores.push(setInterval(() => {
    for (const t of db.Tasks) {
      if (t.Finished || !/^WhatsApp a enviar/i.test(t.Title ?? '') || Date.now() - new Date(t.CreateDate ?? 0).getTime() < 5000) continue;
      const c = db.NeppoConversas.find((x) => x.clienteId === t.ContactId);
      Object.assign(t, { Finished: true, FinishDate: new Date().toISOString() });
      if (c) aplicarMensagemF1(c, 'vendedor', '[Modelo] ' + (t.Description || t.Title.replace(/^WhatsApp a enviar\s*[—-]?\s*/i, '')), new Date().toISOString());
      else avisos.push(`F2 simulado: cliente ${t.ContactId} sem conversa na Neppo — modelo "${t.Title}" não enviado`);
    }
  }, 2000));
  // ---- integração NATIVA Ploomes × Neppo (2026-10-06): automação "Enviar mensagem de WhatsApp via Neppo"
  // "automacoesNeppo": [{ "tipoTarefa": "WhatsApp · …", "modelo": "<nome do modelo>" }]; "modelosNeppo": [{ "nome", "texto" com {parametro} }]
  // "parametrosNeppo": { "<parametro>": "<fieldKey da tarefa>" | "cliente" | "vendedor" }; "limiteEnvios": { "total": N, "usados": M }
  neppo = { modelos: s.modelosNeppo ?? [], grupos: s.gruposNeppo ?? ['Atendimento'], automacoes: s.automacoesNeppo ?? [], parametros: Object.fromEntries(Object.entries(s.parametrosNeppo ?? {}).map(([p, f]) => [p, papelDe(f)])),
    limite: { total: s.limiteEnvios?.total ?? 500, usados: s.limiteEnvios?.usados ?? 0 }, envios: [], f3: s.camposF3 ?? null };
  for (const t of db.Tasks) if (t.__neppo === 'enviado') neppo.envios.push({ tarefaId: t.Id, clienteId: t.ContactId, modelo: tipoDaAutomacao(t)?.modelo ?? '', status: 'enviado', quando: t.CreateDate });
  temporizadores.push(setInterval(processarAutomacoesNeppo, 1500));
  avisos = []; registro = []; falhas = [];
}
let neppo = null;
// Dados de teste gravados antes de o papel se chamar "vendedor" usam "corretor": lidos como "vendedor".
function papelDe(x) { return x === 'corretor' ? 'vendedor' : x; }
function tipoDaAutomacao(t) { const tipo = db.TasksTypes.find((x) => x.Id === t.TypeId)?.Name; return neppo?.automacoes.find((a) => a.tipoTarefa === tipo) ?? null; }
function textoDoCampo(reg, fk) { const op = (reg.OtherProperties ?? []).find((x) => x.FieldKey === fk); if (!op) return ''; if (op.IntegerValue != null && db.Fields.find((f) => f.Key === fk)?.OptionsTableId) return nomeDeOpcao(op.IntegerValue) ?? '';
  if (op.DateTimeValue) return new Date(op.DateTimeValue).toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' });
  const v = Object.entries(op).find(([k]) => k !== 'FieldKey')?.[1]; return v == null ? '' : typeof v === 'number' ? v.toLocaleString('pt-BR') : String(v); }
function conversaDe(clienteId, criarComo) {
  let c = db.NeppoConversas.filter((x) => x.clienteId === clienteId && x.status !== 'ENCERRADA').slice(-1)[0];
  if (c || !criarComo) return c ?? null;
  const cli = db.Contacts.find((x) => x.Id === clienteId); if (!cli) return null;
  const sid = String(70000 + db.NeppoConversas.length + Math.floor(Math.random() * 9000));
  const reg = { Id: Math.max(0, ...db.InteractionRecords.map((y) => y.Id)) + 1, Content: `Conversa de WhatsApp (Neppo) · protocolo WA${sid.padStart(11, '0')}`, Date: new Date().toISOString(), ContactId: cli.Id, DealId: null, OtherProperties: [] };
  db.InteractionRecords.push(reg);
  c = { sessionId: sid, protocolo: `WA${sid.padStart(11, '0')}`, telefone: cli.Phones?.[0]?.PhoneNumber ?? '', cliente: cli.Name, clienteId: cli.Id, registroId: reg.Id, mensagens: [], status: criarComo, grupo: neppo.grupos[0] };
  db.NeppoConversas.push(c);
  if (camposF1) for (const [k, v] of [['canal', 'WhatsApp'], ['sessao', c.sessionId], ['protocolo', c.protocolo], ['telefone', c.telefone], ['statusSessao', 'OPEN']]) if (camposF1[k]) gravarOP(reg, camposF1[k], v);
  return c;
}
// envio ativo: valida destinatário, parâmetros e limitador como a ação nativa; bloqueio vira registro de interação
function envioAtivo({ clienteId, modelo, valores, origem, tarefaId, dealId }) {
  const m = neppo.modelos.find((x) => x.nome === modelo);
  const cli = db.Contacts.find((x) => x.Id === clienteId);
  const bloquear = (motivo) => {
    db.InteractionRecords.push({ Id: Math.max(0, ...db.InteractionRecords.map((y) => y.Id)) + 1, Content: `Envio ativo de WhatsApp bloqueado (${origem}) — modelo "${modelo}": ${motivo}`, Date: new Date().toISOString(), ContactId: clienteId, DealId: dealId ?? null, OtherProperties: [] });
    neppo.envios.push({ tarefaId, clienteId, modelo, status: 'bloqueado', motivo, quando: new Date().toISOString() });
    return { ok: false, motivo };
  };
  if (!m) return bloquear('modelo não existe na Neppo');
  const fone = String(cli?.Phones?.[0]?.PhoneNumber ?? '').replace(/\D/g, '');
  if (fone.length < 12) return bloquear('destinatário sem telefone com DDI + DDD');
  if (neppo.limite.usados >= neppo.limite.total) return bloquear('limite de envios atingido');
  const vazio = (m.texto.match(/\{(\w+)\}/g) ?? []).map((x) => x.slice(1, -1)).find((p) => !String(valores[p] ?? '').trim());
  if (vazio) return bloquear(`parâmetro {${vazio}} vazio`);
  const texto = m.texto.replace(/\{(\w+)\}/g, (_, p) => valores[p]);
  const c = conversaDe(clienteId, 'ATIVO');
  aplicarMensagemF1(c, 'vendedor', texto, new Date().toISOString());
  neppo.limite.usados++;
  neppo.envios.push({ tarefaId, clienteId, modelo, status: 'enviado', quando: new Date().toISOString(), sessionId: c.sessionId });
  return { ok: true, sessionId: c.sessionId };
}
function processarAutomacoesNeppo() {
  for (const t of db.Tasks) {
    if (t.__neppo || t.Finished) continue;
    const a = tipoDaAutomacao(t); if (!a) continue;
    if (Date.now() - new Date(t.CreateDate ?? 0).getTime() < 4000) continue;   // a automação roda logo depois da criação
    const cli = db.Contacts.find((x) => x.Id === t.ContactId), dono = db.Users.find((u) => u.Id === t.Users?.[0]?.UserId);
    const valores = {};
    for (const [p, fonte] of Object.entries(neppo.parametros)) valores[p] = fonte === 'cliente' ? cli?.Name ?? '' : fonte === 'vendedor' ? dono?.Name ?? '' : textoDoCampo(t, fonte);
    const r = envioAtivo({ clienteId: t.ContactId, modelo: a.modelo, valores, origem: `automação da tarefa ${t.Id}`, tarefaId: t.Id, dealId: t.DealId });
    t.__neppo = r.ok ? 'enviado' : 'bloqueado';
  }
}
// F3 simulado (leitor de cotação): mensagem do fornecedor com preço, a quem o usuário pediu oferta, vira "Cotação do dia" sugerida
function lerCotacaoF3(conv, texto) {
  const F = neppo?.f3; if (!F) return;
  const tipoPedido = db.TasksTypes.find((x) => x.Name === F.tipoTarefaPedido)?.Id;
  const pedido = db.Tasks.filter((t) => t.TypeId === tipoPedido && t.ContactId === conv.clienteId && !t.Finished).slice(-1)[0];
  if (!pedido) return;
  const p = texto.match(/(R\$|US\$|USD|€)\s*([\d.]+(?:,\d+)?)/i); if (!p) return;
  const moeda = /us|usd/i.test(p[1]) ? 'US$' : p[1] === '€' ? '€' : 'R$';
  const preco = Number(p[2].replace(/\./g, '').replace(',', '.'));
  const inc = texto.match(/\b(FOB|CIF|FCA|CFR|EXW|DAP)\b\s*([A-ZÁ-Ú][\wÀ-ú]+(?:\s[A-ZÁ-Ú][\wÀ-ú]+)?)?/);
  const val = texto.match(/validade\s*(?:até\s*)?(\d{1,2})\/(\d{1,2})/i);
  const vol = texto.match(/([\d.]+)\s*t\b/);
  const nomeProduto = textoDoCampo(pedido, F.produtoDaTarefa) || null;
  const produto = db.Products.find((x) => x.Name === nomeProduto) ?? (pedido.DealId ? db.Products.find((x) => x.Id === db.Deals.find((d) => d.Id === pedido.DealId)?.Products?.[0]?.ProductId) : null);
  if (!produto) { avisos.push(`F3 simulado: pedido ${pedido.Id} sem produto reconhecível — cotação não sugerida`); return; }
  const hoje = new Date();
  const cp = { Id: Math.max(0, ...db.ContactsProducts.map((x) => x.Id)) + 1, Name: `Cotação sugerida — ${conv.cliente} — ${produto.Name} — ${hoje.toLocaleDateString('pt-BR')}`, ContactId: conv.clienteId, ProductId: produto.Id, CreateDate: hoje.toISOString(), OtherProperties: [] };
  // 2026-10-09: o valor lido (ex.: símbolo "R$") é casado com as opções reais do campo; opção inexistente vira aviso, nunca derruba a bancada
  const grava = (k, v) => {
    if (!F[k] || v == null || v === '') return;
    try { cp.OtherProperties.push(valorDeCampo(F[k], k === 'moeda' ? opcaoDeMoeda(F[k], v) : v)); }
    catch (e) { avisos.push(`F3 simulado: ${e.message} — campo "${k}" não gravado`); }
  };
  grava('tipo', 'Cotação do dia'); grava('situacao', 'Sugerida pela IA'); grava('moeda', moeda); grava('preco', preco);
  if (inc) { grava('incoterm', inc[1].toUpperCase()); grava('praca', inc[2] ?? null); }
  if (val) grava('validade', new Date(Date.UTC(hoje.getUTCFullYear(), Number(val[2]) - 1, Number(val[1]), 12)).toISOString());
  if (vol) grava('volume', Number(vol[1].replace(/\./g, '')));
  grava('data', hoje.toISOString()); grava('origem', 'IA (WhatsApp)'); grava('mensagem', texto.slice(0, 1000));
  db.ContactsProducts.push(cp);
  if (pedido.DealId) { const d = db.Deals.find((x) => x.Id === pedido.DealId); if (d) { d.ContactsProducts = [...(d.ContactsProducts ?? []), { ContactProductId: cp.Id }]; sincronizarVinculos(); } }
}
// símbolo/código de moeda → nome da opção do campo (Real, Dólar, Euro…); se o campo não é de opção ou nada casa, devolve o valor como veio
const SINONIMOS_MOEDA = { 'R$': ['Real', 'BRL', 'R$'], 'US$': ['Dólar', 'Dolar', 'USD', 'US$'], '€': ['Euro', 'EUR', '€'] };
function opcaoDeMoeda(fk, v) {
  const f = db.Fields.find((x) => x.Key === fk); if (!f?.OptionsTableId) return v;
  const ops = db.FieldsOptionsTables.find((t) => t.Id === f.OptionsTableId)?.Options ?? [];
  if (ops.some((o) => o.Name === v)) return v;
  const cand = (SINONIMOS_MOEDA[v] ?? [v]).map((s) => s.toLowerCase());
  return ops.find((o) => cand.some((c) => o.Name.toLowerCase() === c || o.Name.toLowerCase().startsWith(c)))?.Name ?? v;
}
function erroSeed(o) { throw new Error(`dados-de-teste.json cita ${o}, que não foi declarado`); }
let camposF1 = null;
function gravarOP(reg, fk, v) {
  const op = v === null ? { FieldKey: fk, [COLUNA[db.Fields.find((f) => f.Key === fk)?.TypeId] ?? 'StringValue']: null } : valorDeCampo(fk, v);
  reg.OtherProperties = (reg.OtherProperties ?? []).filter((x) => x.FieldKey !== fk).concat([op]);
}
// a mesma regra do flow F1: direção, última mensagem, "aguardando resposta desde" e a janela de 24 h
function aplicarMensagemF1(conv, de, texto, quando) {
  conv.mensagens.push({ de, texto, quando });
  if (de === 'cliente') { if (conv.status === 'ATIVO' || conv.status === 'ENCERRADA') conv.status = 'EM_ANDAMENTO'; lerCotacaoF3(conv, texto); }
  if (!camposF1) return;
  const reg = db.InteractionRecords.find((r) => r.Id === conv.registroId);
  const F = camposF1, recebida = de === 'cliente';
  const aguardando = (reg.OtherProperties ?? []).find((x) => x.FieldKey === F.aguardandoDesde)?.DateTimeValue ?? null;
  gravarOP(reg, F.direcao, recebida ? 'Recebida' : 'Enviada');
  gravarOP(reg, F.ultimaMensagem, String(texto).slice(0, 1000));
  gravarOP(reg, F.ultimaMensagemEm, quando);
  gravarOP(reg, F.aguardandoDesde, recebida ? (aguardando || quando) : null);
  if (recebida) gravarOP(reg, F.ultimaDoClienteEm, quando);
}
// DealsContactsProducts é a coleção de vínculo negócio ↔ produto do cliente; deriva de Deal.ContactsProducts
function sincronizarVinculos() {
  const antigos = new Map(db.DealsContactsProducts.map((x) => [`${x.DealId}:${x.ContactProductId}`, x.Id]));
  let seq = Math.max(900000, ...db.DealsContactsProducts.map((x) => x.Id));
  db.DealsContactsProducts = db.Deals.flatMap((d) => (d.ContactsProducts ?? []).map((v) => ({ Id: antigos.get(`${d.Id}:${v.ContactProductId}`) ?? ++seq, DealId: d.Id, ContactProductId: v.ContactProductId })));
}
function valorDeCampo(fk, v) {
  const f = db.Fields.find((x) => x.Key === fk) ?? erroSeed(`campo ${fk}`);
  if (f.OptionsTableId && typeof v === 'string') {
    const o = db.FieldsOptionsTables.find((t) => t.Id === f.OptionsTableId).Options.find((x) => x.Name === v) ?? erroSeed(`opção ${v} de ${fk}`);
    return { FieldKey: fk, IntegerValue: o.Id };
  }
  // campo de referência a Cliente (coluna ContactValueId): o seed pode passar o nome do cliente
  if (f.Coluna === 'ContactValueId') { const c = typeof v === 'string' ? db.Contacts.find((x) => x.Name === v) ?? erroSeed(`cliente ${v} (campo ${fk})`) : db.Contacts.find((x) => x.Id === v); return { FieldKey: fk, ContactValueId: c?.Id ?? null }; }
  return { FieldKey: fk, [f.Coluna ?? COLUNA[f.TypeId]]: v };
}

// ------------------------------------------------------------------ o processo da conta (2026-10-20)
// Para telas que mostram a configuração: automações, histórico de etapas, webhooks e integrações.
// Os catálogos do sistema (gatilhos, tipos de ação, ações de webhook, integrações) são iguais em toda
// conta e vêm de catalogos-do-sistema.json, baixado da API real só com Id e Name.
const CATALOGOS = JSON.parse(readFileSync(join(AQUI, 'catalogos-do-sistema.json'), 'utf-8'));
const GATILHO = { entrou: 1, ganho: 2, perdido: 3, reaberto: 4, criado: 5, editado: 6, 'negocio-ganho': 8, 'negocio-perdido': 9, 'tarefa-finalizada': 11, periodico: 17, 'editado-na-etapa': 25 };
const ACAO = { editar: 1, 'alterar-etapa': 2, duplicar: 3, email: 4, tarefa: 5, 'criar-negocio': 7, interacao: 8, perder: 10, ganhar: 11, whatsapp: 12, 'finalizar-tarefas': 14, 'produto-do-cliente': 16 };
function carregarProcesso(s, { id, funil, etapa, iso }) {
  Object.assign(db, structuredClone(CATALOGOS), { Automations: [], DealsStagesHistory: [], Webhooks: [], AccountIntegrations: [] });
  // "automacoes": [{ "nome", "gatilho": "entrou", "funil", "etapa", "ativa", "comErro", "acoes": [{ "tipo": "tarefa" | "alterar-etapa" | …, "destino": { "funil", "etapa" }, "modelo", "campo" }] }]
  for (const a of s.automacoes ?? []) {
    const aid = id();
    db.Automations.push({ Id: aid, Name: a.nome, EntityId: a.entidade ?? 2, TriggerId: GATILHO[a.gatilho ?? 'entrou'] ?? erroSeed(`gatilho ${a.gatilho}`),
      TriggerDealStageId: a.etapa ? etapa(a.funil, a.etapa).Id : null, Enabled: a.ativa !== false, DisabledDueToError: !!a.comErro, LastRunTime: iso(a.ultimaExecucao),
      Actions: (a.acoes ?? []).map((x) => ({ Id: id(), AutomationId: aid, ActionId: ACAO[x.tipo] ?? erroSeed(`ação ${x.tipo}`), FieldKey: x.campo ?? null,
        DealStageId: x.destino ? etapa(x.destino.funil, x.destino.etapa).Id : null, EmailTemplateId: null, LossReasonId: null,
        ShouldGenerateDocument: !!x.modelo, TaskDaysFromNow: x.dias ?? null,
        // como a API real: o corpo pode levar URL e token — a tela não deve pedir este campo
        RequestBody: x.tipo === 'tarefa' ? JSON.stringify({ Title: x.titulo ?? 'Tarefa', TypeId: 1 }) : null, BigStringValue: null })) });
  }
  // "webhooks": [{ "entidade": 2, "acao": "Win", "ativo": true, "nativa": false }] — CallbackUrl e ValidationKey existem, como na API
  const acaoWh = (n) => db.WebhooksActions.find((w) => w.Name === n) ?? erroSeed(`ação de webhook ${n}`);
  for (const w of s.webhooks ?? []) db.Webhooks.push({ Id: id(), EntityId: w.entidade ?? 2, SecondaryEntityId: null, ActionId: acaoWh(w.acao ?? 'Create').Id, Name: w.nome ?? null,
    CallbackUrl: 'https://segredo.bancada.invalid/hook', ValidationKey: 'segredo-da-bancada', Active: w.ativo !== false, UserWebhook: false, IsNativeIntegration: !!w.nativa });
  // "integracoes": [{ "nome": "Neppo", "ativa": true }] — o nome tem de existir no catálogo Integrations
  for (const n of s.integracoes ?? []) { const o = typeof n === 'string' ? { nome: n } : n; const cat = db.Integrations.find((i) => i.Name === o.nome) ?? erroSeed(`integração ${o.nome}`);
    db.AccountIntegrations.push({ Id: id(), AccountId: 1, IntegrationId: cat.Id, Key: 'segredo-da-bancada', IntegrationUserId: null, IntegrationUserKey: 'segredo-da-bancada', Enabled: o.ativa !== false, StatusId: 3 }); }
  // Histórico de etapas, como a API real: uma linha por passagem por uma etapa. A primeira entra pela
  // etapa 1 (StageId 1, "criação"); cada etapa deixada tem NewStageId, Advanced e Days; a atual fica
  // com NewStageId null; a do fechamento, Won ou Lost. Datas espalhadas pelos últimos 120 dias.
  let semente = 7;
  const sorte = () => ((semente = (semente * 48271) % 2147483647) / 2147483647);
  for (const d of db.Deals) {
    const p = db.DealsPipelines.find((x) => x.Id === d.PipelineId);
    const ordem = [...p.Stages].sort((a, b) => a.Ordination - b.Ordination);
    const ate = ordem.findIndex((e) => e.Id === d.StageId);
    let quando = Date.now() - (30 + Math.floor(sorte() * 90)) * 864e5;
    db.DealsStagesHistory.push({ Id: id(), DealId: d.Id, StageId: 1, NewStageId: ordem[0].Id, Advanced: true, Won: false, Lost: false, Days: 0, Undone: false, CreateDate: new Date(quando).toISOString() });
    for (let i = 0; i <= ate; i++) {
      const dias = Math.floor(sorte() * 12);
      const atual = i === ate;
      const fecha = atual && d.StatusId !== 1;
      db.DealsStagesHistory.push({ Id: id(), DealId: d.Id, StageId: ordem[i].Id, NewStageId: atual ? null : ordem[i + 1].Id, Advanced: !atual, Won: fecha && d.StatusId === 2, Lost: fecha && d.StatusId === 3,
        Days: atual && !fecha ? null : dias, Undone: false, CreateDate: new Date(quando).toISOString() });
      quando += dias * 864e5;
    }
    if (d.StatusId === 1) d.DaysInStage = d.DaysInStage || Math.max(0, Math.round((Date.now() - quando) / 864e5));
  }
}

// Filtro por navegação (Contact/OwnerId, Deal/OwnerId): avalia sobre uma cópia com o registro ligado.
// Deal/… no histórico de etapas foi conferido na API real em 2026-10-20.
function navegacoes(filtro) {
  const navs = [];
  if (/\bContact\//.test(filtro)) navs.push((r) => ({ ...r, Contact: db.Contacts.find((c) => c.Id === r.ContactId) ?? null }));
  if (/\bDeal\//.test(filtro)) navs.push((r) => ({ ...r, Deal: db.Deals.find((d) => d.Id === r.DealId) ?? null }));
  return (r) => navs.reduce((x, n) => n(x), r);
}

// $apply mínimo: filter(...)/groupby((a,b),aggregate(...)) ou aggregate(...), como a API real devolve.
function aplicar(itens, apply) {
  let resto = apply.trim();
  const fm = resto.match(/^filter\((.*)\)\/(groupby|aggregate)\(/s);
  if (fm) {
    let d = 0, i = 7; for (; i < resto.length; i++) { if (resto[i] === '(') d++; if (resto[i] === ')') { if (d === 0) break; d--; } }
    const texto = resto.slice(7, i), f = compilar(texto), comNav = navegacoes(texto);
    itens = itens.filter((r) => f(comNav(r)));
    resto = resto.slice(i + 2);
  }
  const corpo = (s, nome) => { if (!s.startsWith(nome + '(') || !s.endsWith(')')) throw new Error(`$apply não entendido: ${s.slice(0, 40)}`); return s.slice(nome.length + 1, -1); };
  let por = [], medidas = [];
  if (resto.startsWith('groupby(')) {
    const partes = dividir(corpo(resto, 'groupby'));
    por = partes[0].replace(/^\(|\)$/g, '').split(',').map((x) => x.trim());
    if (partes[1]) medidas = dividir(corpo(partes[1], 'aggregate'));
  } else medidas = dividir(corpo(resto, 'aggregate'));
  if (por.some((p) => p.startsWith('OtherProperties'))) throw new Error('The query specified in the URI is not valid. groupby by collection property is not supported.');
  const grupos = new Map();
  for (const r of itens) { const k = JSON.stringify(por.map((p) => pegar(r, p.split('/')))); if (!grupos.has(k)) grupos.set(k, []); grupos.get(k).push(r); }
  if (!por.length && !grupos.size) grupos.set('[]', []);
  return [...grupos.entries()].map(([k, rs]) => {
    const linha = { '@odata.id': null }; JSON.parse(k).forEach((v, i) => (linha[por[i]] = v));
    for (const m of medidas) {
      const mm = m.match(/^\$count as (\w+)$/) ?? m.match(/^([\w/]+) with (sum|average|min|max|countdistinct) as (\w+)$/);
      if (!mm) throw new Error(`aggregate não entendido: ${m}`);
      if (mm.length === 2) { linha[mm[1]] = rs.length; continue; }
      const vs = rs.map((r) => pegar(r, mm[1].split('/'))).filter((v) => v != null);
      linha[mm[3]] = { sum: vs.reduce((a, b) => a + b, 0), average: vs.length ? vs.reduce((a, b) => a + b, 0) / vs.length : null, min: vs.length ? Math.min(...vs) : null, max: vs.length ? Math.max(...vs) : null, countdistinct: new Set(vs).size }[mm[2]];
    }
    return linha;
  });
}

// ------------------------------------------------------------------ OData mínimo
function tokens(s) {
  const re = /\s*(?:('(?:[^']|'')*')|(\d{4}-\d{2}-\d{2}T[\d:.]+Z?)|(-?\d+(?:\.\d+)?)|([A-Za-z_]\w*(?:\/[A-Za-z_]\w*)*)|(\(|\)|,|:))/y;
  const out = []; let m;
  while (re.lastIndex < s.length && (m = re.exec(s))) {
    if (m[1]) out.push({ t: 'val', v: m[1].slice(1, -1).replace(/''/g, "'") });
    else if (m[2]) out.push({ t: 'val', v: m[2] });
    else if (m[3]) out.push({ t: 'val', v: Number(m[3]) });
    else if (m[4]) out.push(['true', 'false', 'null'].includes(m[4]) ? { t: 'val', v: JSON.parse(m[4]) } : { t: 'id', v: m[4] });
    else out.push({ t: m[5] });
  }
  if (re.lastIndex < s.trim().length && s.slice(re.lastIndex).trim()) throw new Error(`filtro não entendido perto de: ${s.slice(re.lastIndex, re.lastIndex + 30)}`);
  return out;
}
function compilar(filtro) {
  const tk = tokens(filtro); let i = 0;
  const olha = () => tk[i], anda = () => tk[i++];
  const espera = (t) => { const x = anda(); if (!x || x.t !== t) throw new Error(`filtro: esperava "${t}"`); return x; };
  const ehPalavra = (w) => olha()?.t === 'id' && olha().v.toLowerCase() === w;
  const ou = () => { let e = e_(); while (ehPalavra('or')) { anda(); const a = e, b = e_(); e = (r, c) => a(r, c) || b(r, c); } return e; };
  const e_ = () => { let e = nao(); while (ehPalavra('and')) { anda(); const a = e, b = nao(); e = (r, c) => a(r, c) && b(r, c); } return e; };
  const nao = () => { if (ehPalavra('not')) { anda(); const a = nao(); return (r, c) => !a(r, c); } return prim(); };
  const prim = () => {
    if (olha()?.t === '(') { anda(); const e = ou(); espera(')'); return e; }
    const cam = espera('id').v;
    if (/^contains$/i.test(cam) && olha()?.t === '(') {
      anda(); const campo = espera('id').v; espera(','); const val = String(espera('val').v).toLowerCase(); espera(')');
      return (r, c) => String(pegar(r, campo.split('/'), c) ?? '').toLowerCase().includes(val);
    }
    if (/\/any$/i.test(cam)) {
      const col = cam.split('/').slice(0, -1);
      espera('('); const v = espera('id').v; espera(':'); const corpo = ou(); espera(')');
      return (r, c) => (pegar(r, col, c) ?? []).some((el) => corpo(r, { ...c, [v]: el }));
    }
    const op = espera('id').v.toLowerCase();
    if (op === 'in') { espera('('); const vs = []; while (olha()?.t !== ')') { vs.push(espera('val').v); if (olha()?.t === ',') anda(); } espera(')'); return (r, c) => vs.includes(pegar(r, cam.split('/'), c)); }
    const val = espera('val').v;
    const cmp = { eq: (a, b) => a === b || (a != null && b != null && String(a) === String(b)), ne: (a, b) => !(a === b), gt: (a, b) => a > b, ge: (a, b) => a >= b, lt: (a, b) => a < b, le: (a, b) => a <= b }[op];
    if (!cmp) throw new Error(`filtro: operador ${op} não suportado na bancada`);
    return (r, c) => { const a = pegar(r, cam.split('/'), c); return cmp(typeof a === 'string' && typeof val === 'string' ? a.toLowerCase() : a, typeof a === 'string' && typeof val === 'string' ? val.toLowerCase() : val); };
  };
  const e = ou(); if (i < tk.length) throw new Error('filtro: sobrou texto no fim');
  return e;
}
function pegar(r, cam, c = {}) { let o = c[cam[0]] !== undefined ? c[cam[0]] : r[cam[0]]; for (const p of cam.slice(1)) o = o?.[p]; return o; }
function dividir(s) { const out = []; let d = 0, cur = ''; for (const ch of s) { if (ch === '(') d++; if (ch === ')') d--; if (ch === ',' && d === 0) { out.push(cur); cur = ''; } else cur += ch; } if (cur) out.push(cur); return out.map((x) => x.trim()); }
function selecionar(o, sel) { if (!sel) return o; const k = sel.split(',').map((x) => x.trim()); return Object.fromEntries(Object.entries(o).filter(([c]) => k.includes(c))); }
function nomeDeOpcao(opId) { for (const t of db.FieldsOptionsTables) { const o = t.Options.find((x) => x.Id === opId); if (o) return o.Name; } return null; }

function expandir(col, item, exp) {
  const out = { ...item };
  const pedidos = exp ? dividir(exp) : [];
  const navs = {};
  // opções da navegação separadas por ';' só no nível de fora: Contact($select=Id,Name;$expand=OtherProperties) dentro de outro $expand (2026-10-07)
  const porPontoEVirgula = (s) => { const out = []; let d = 0, cur = ''; for (const ch of s) { if (ch === '(') d++; if (ch === ')') d--; if (ch === ';' && d === 0) { out.push(cur); cur = ''; } else cur += ch; } if (cur) out.push(cur); return out; };
  for (const p of pedidos) { const m = p.match(/^(\w+)(?:\((.*)\))?$/); const sub = Object.fromEntries((m[2] ? porPontoEVirgula(m[2]) : []).map((x) => x.split('=')).map(([k, ...v]) => [k.trim(), v.join('=')])); navs[m[1]] = sub; }
  delete out.Stages; delete out.Options; delete out.Fields; delete out.OtherProperties; delete out.WinVerb; delete out.LoseVerb;
  for (const nav of ['WinVerb', 'LoseVerb']) if (navs[nav] && item[nav]) out[nav] = selecionar(item[nav], navs[nav].$select);
  if (navs.Stages && item.Stages) out.Stages = item.Stages.map((s) => selecionar(s, navs.Stages.$select));
  if (navs.Options && item.Options) out.Options = item.Options.map((s) => selecionar(s, navs.Options.$select));
  if (navs.Fields && item.Fields) out.Fields = item.Fields;
  if (navs.OtherProperties && item.OtherProperties) out.OtherProperties = item.OtherProperties.map((op) => (op.IntegerValue != null && db.Fields.find((f) => f.Key === op.FieldKey)?.OptionsTableId ? { ...op, ObjectValueId: op.IntegerValue, ObjectValueName: nomeDeOpcao(op.IntegerValue) }
    : op.ContactValueId != null ? { ...op, ContactValueName: db.Contacts.find((c) => c.Id === op.ContactValueId)?.Name ?? null } : op));
  for (const [nav, idCampo, alvo] of [['Contact', 'ContactId', 'Contacts'], ['Owner', 'OwnerId', 'Users'], ['Profile', 'ProfileId', 'UsersProfiles'], ['Type', 'TypeId', 'TasksTypes'], ['Deal', 'DealId', 'Deals'],
    ['Class', 'ClassId', 'ContactsClasses'], ['Product', 'ProductId', 'Products'], ['ContactProduct', 'ContactProductId', 'ContactsProducts'], ['Group', 'GroupId', 'ProductsGroups'], ['Company', 'CompanyId', 'Contacts']]) {
    if (navs[nav]) {
      const x = db[alvo].find((y) => y.Id === item[idCampo]);
      // navegação com $expand aninhado (ex.: ContactProduct($expand=Contact,Product,OtherProperties)) expande de novo
      out[nav] = x ? (navs[nav].$expand ? selecionar(expandir(alvo, x, navs[nav].$expand).out, navs[nav].$select ? navs[nav].$select + ',' + dividir(navs[nav].$expand).map((p) => p.match(/^\w+/)[0]).join(',') : null) : selecionar(x, navs[nav].$select)) : null;
    }
  }
  // coleção dentro do registro (ex.: Deal.Products): devolve como está, expandindo cada item
  for (const nav of Object.keys(navs)) if (Array.isArray(item[nav]) && !['OtherProperties', 'Stages', 'Options', 'Fields'].includes(nav)) out[nav] = item[nav].map((el) => selecionar(navs[nav].$expand ? expandir(nav, el, navs[nav].$expand).out : el, navs[nav].$select));
  return { out, navs: Object.keys(navs) };
}

function listar(col, q) {
  if (!db[col]) return [404, { error: { message: `Rota ${col} não existe na bancada` } }];
  if (q.has('$skip')) avisos.push(`${col}: usou $skip — a api-docs manda paginar por cursor`);
  let itens = db[col];
  if (q.has('$apply')) {
    for (const s of ['CallbackUrl', 'ValidationKey', 'IntegrationUserKey', 'RequestBody']) if ((q.get('$apply') ?? '').includes(s)) avisos.push(`${col}: $apply cita ${s}, que é segredo`);
    try { return [200, { value: aplicar(itens, q.get('$apply')) }]; } catch (e) { return [400, { error: { message: e.message } }]; }
  }
  if (q.get('$filter')) {
    try {
      const f = compilar(q.get('$filter'));
      // filtro por navegação (ex.: Contact/OwnerId): avalia sobre uma cópia com o registro ligado
      const comNav = navegacoes(q.get('$filter'));
      itens = itens.filter((r) => f(comNav(r)));
    } catch (e) { return [400, { error: { message: e.message } }]; }
  }
  // segredo pedido pela tela (2026-10-20): sem $select, ou com o campo no $select/$expand
  const SEGREDO = { Webhooks: ['CallbackUrl', 'ValidationKey'], AccountIntegrations: ['Key', 'IntegrationUserKey'], Automations: ['RequestBody'] }[col];
  if (SEGREDO) {
    const pedido = (q.get('$select') ?? '') + ' ' + (q.get('$expand') ?? '');
    if (!q.get('$select')) avisos.push(`${col}: sem $select — a resposta traz ${SEGREDO.join(', ')}`);
    for (const s of SEGREDO) if (new RegExp(`\\b${s}\\b`).test(pedido)) avisos.push(`${col}: pediu ${s}, que é segredo`);
    if (col === 'Automations' && /\bActions\b/.test(q.get('$expand') ?? '') && !/Actions\(\$select=/.test(q.get('$expand') ?? '')) avisos.push('Automations: $expand=Actions sem $select traz RequestBody');
  }
  const ord = q.get('$orderby');
  if (ord) { const [campo, dir] = ord.split(' '); itens = [...itens].sort((a, b) => (a[campo] > b[campo] ? 1 : -1) * (dir === 'desc' ? -1 : 1)); }
  const top = Number(q.get('$top') ?? 1000);
  if (top > 1000) return [400, { error: { message: 'The limit of 1000 for Top query has been exceeded' } }];
  itens = itens.slice(Number(q.get('$skip') ?? 0), Number(q.get('$skip') ?? 0) + top);
  return [200, { value: itens.map((i) => { const { out, navs } = expandir(col, i, q.get('$expand')); const sel = q.get('$select'); return sel ? selecionar(out, sel + ',' + navs.join(',')) : out; }) }];
}

// ------------------------------------------------------------------ regras de escrita
const erro = (s, m) => [s, { error: { message: m } }];
const erroReal = (s, m) => [s, { value: m }];   // formato que a API real usa (visto em 2026-09-30)
function aplicarOutros(d, lista = []) {
  for (const op of lista) {
    const f = db.Fields.find((x) => x.Key === op.FieldKey);
    if (!f) return erro(400, `FieldKey ${op.FieldKey} não existe`);
    const colunas = Object.keys(op).filter((k) => k !== 'FieldKey');
    if (colunas.length !== 1) return erro(400, `OtherProperties de ${op.FieldKey} precisa de exatamente uma coluna de valor`);
    if (colunas[0] !== COLUNA[f.TypeId]) avisos.push(`${f.Name}: gravado em ${colunas[0]}, mas o TypeId ${f.TypeId} lê ${COLUNA[f.TypeId]} — no Ploomes real o valor fica invisível`);
    d.OtherProperties = d.OtherProperties.filter((x) => x.FieldKey !== op.FieldKey).concat([op]);
  }
  return null;
}
function pendenciasDoChecklist(d) {
  const lista = db.Checklists.filter((c) => c.DealStageId === d.StageId);
  const faltando = [];
  for (const c of lista) for (const it of c.Fields) {
    if (!it.Required) continue;
    const dono = it.FieldKey.startsWith('contact_') ? db.Contacts.find((c) => c.Id === d.ContactId) : d;   // item pode ser campo do cliente
    const op = (dono?.OtherProperties ?? []).find((x) => x.FieldKey === it.FieldKey);
    const v = op && Object.entries(op).find(([k]) => k !== 'FieldKey')?.[1];
    if (v === undefined || v === null || v === '') faltando.push({ Id: it.Id, ChecklistId: c.Id, Name: it.Name, Required: true, FieldKey: it.FieldKey, Ordination: it.Ordination });
  }
  return faltando;
}
function escrever(metodo, col, idReg, acao, corpo) {
  // "Sua empresa" (2026-10-20): só campo personalizado, como o mapa do processo grava o as-is.
  if (col === 'Account' && metodo === 'PATCH' && idReg && !acao) {
    const a = db.Account.find((x) => x.Id === idReg); if (!a) return erro(404, 'Registro não encontrado');
    const { OtherProperties, ...nativos } = corpo;
    if (Object.keys(nativos).length) return erro(403, `Barrado pela bancada: a tela não altera dado nativo da conta (${Object.keys(nativos).join(', ')})`);
    const e = aplicarOutros(a, OtherProperties); if (e) return e;
    return [200, {}];
  }
  if (col === 'Contacts' && metodo === 'PATCH' && idReg && !acao) {
    const c = db.Contacts.find((x) => x.Id === idReg); if (!c) return erro(404, 'Registro não encontrado');
    const { OtherProperties, ...nativos } = corpo; const e = aplicarOutros(c, OtherProperties); if (e) return e;
    Object.assign(c, nativos); return [200, {}];
  }
  // ---- agenda: tarefas e registros de interação
  if (col === 'Tasks') {
    if (metodo === 'POST' && !idReg) {
      if (!corpo.Title) return erro(400, 'Tarefa sem título.');
      if (corpo.DateTime && new Date(corpo.DateTime) < new Date(new Date().toDateString())) avisos.push('Tarefa criada com data no passado');
      const { OtherProperties, ...nat } = corpo;
      const t = { Id: Math.max(0, ...db.Tasks.map((x) => x.Id)) + 1, Finished: false, FinishDate: null, InteractionRecordId: null, NoTime: false, Users: [], CreateDate: new Date().toISOString(), ...nat, OtherProperties: [] };
      const eo = aplicarOutros(t, OtherProperties); if (eo) return eo;
      if (t.TypeId != null && !db.TasksTypes.some((x) => x.Id === t.TypeId)) return erro(400, `TypeId ${t.TypeId} não existe`);
      t.DateTime = t.DateTime ? new Date(t.DateTime).toISOString() : null;
      if (!t.Users?.length) return erro(400, 'Tarefa sem responsável (Users).');
      db.Tasks.push(t); return [200, { value: [t] }];
    }
    const t = db.Tasks.find((x) => x.Id === idReg); if (!t) return erro(404, 'Registro não encontrado');
    if (acao === 'Finish') {
      if (t.Finished) return erro(400, 'A tarefa já está finalizada.');
      const ir = { Id: Math.max(0, ...db.InteractionRecords.map((x) => x.Id)) + 1, Content: '', Date: new Date().toISOString(), ContactId: t.ContactId, DealId: t.DealId };
      db.InteractionRecords.push(ir);
      Object.assign(t, { Finished: true, FinishDate: new Date().toISOString(), InteractionRecordId: ir.Id }); return [200, { value: [t] }];
    }
    if (metodo === 'PATCH' && !acao) { const { OtherProperties, ...nat } = corpo; t.OtherProperties ??= []; const eo = aplicarOutros(t, OtherProperties); if (eo) return eo; Object.assign(t, nat); return [200, {}]; }
    return erro(404, `Ação ${acao} não simulada na bancada`);
  }
  if (col === 'InteractionRecords' && metodo === 'PATCH' && idReg && !acao) {
    const r = db.InteractionRecords.find((x) => x.Id === idReg); if (!r) return erro(404, 'Registro não encontrado');
    Object.assign(r, corpo); return [200, {}];
  }
  // ---- mix de produtos (produtos do cliente) e propostas
  if (col === 'ContactsProducts') {
    if (metodo === 'POST' && !idReg) {
      // produto do cliente pode existir sem cliente (business-docs) — é a referência de mercado da cotação do dia
      if (!corpo.ProductId || !db.Products.some((x) => x.Id === corpo.ProductId)) return erro(400, 'Produto do cliente sem produto válido (ProductId).');
      if (corpo.ContactId != null && !db.Contacts.some((x) => x.Id === corpo.ContactId)) return erro(400, `ContactId ${corpo.ContactId} não existe`);
      const { OtherProperties, ...nativos } = corpo;
      const cp = { Id: Math.max(0, ...db.ContactsProducts.map((x) => x.Id)) + 1, CreateDate: new Date().toISOString(), ContactId: null, OtherProperties: [], ...nativos };
      const e = aplicarOutros(cp, OtherProperties); if (e) return e;
      db.ContactsProducts.push(cp); return [200, { value: [cp] }];
    }
    if (metodo === 'PATCH' && idReg && !acao) {
      const cp = db.ContactsProducts.find((x) => x.Id === idReg); if (!cp) return erro(404, 'Registro não encontrado');
      const { OtherProperties, ...nativos } = corpo; const e = aplicarOutros(cp, OtherProperties); if (e) return e;
      Object.assign(cp, nativos); return [200, {}];
    }
  }
  if (col === 'Quotes' && metodo === 'POST' && !idReg) {
    const d = db.Deals.find((x) => x.Id === corpo.DealId); if (!d) return erro(400, 'Proposta sem negócio válido (DealId).');
    if (!db.DocumentTemplates.some((m) => m.Id === corpo.TemplateId)) return erro(400, 'TemplateId inválido.');
    const { OtherProperties, ...nativos } = corpo;
    const qid = Math.max(0, ...db.Quotes.map((x) => x.Id)) + 1;
    const q = { Id: qid, QuoteNumber: db.Quotes.length + 1, CreateDate: new Date().toISOString(), DocumentUrl: urlDoDocumento('quote', qid), OtherProperties: [], ...nativos };
    if (OtherProperties?.length) { const f0 = db.Fields.find((f) => f.Key === OtherProperties[0].FieldKey); if (!f0) return erro(400, `FieldKey ${OtherProperties[0].FieldKey} não existe`); }
    q.OtherProperties = OtherProperties ?? [];
    db.Quotes.push(q); return [200, { value: [q] }];
  }
  // ---- vendas (ordem de venda) e documentos gerados pela tela (2026-10-06): o registro nasce com DocumentUrl da bancada
  if ((col === 'Orders' || col === 'Documents') && metodo === 'POST' && !idReg) {
    if (!db.DocumentTemplates.some((m) => m.Id === corpo.TemplateId)) return erro(400, 'TemplateId inválido.');
    if (corpo.DealId != null && !db.Deals.some((x) => x.Id === corpo.DealId)) return erro(400, `DealId ${corpo.DealId} não existe`);
    if (corpo.ContactId != null && !db.Contacts.some((x) => x.Id === corpo.ContactId)) return erro(400, `ContactId ${corpo.ContactId} não existe`);
    const { OtherProperties, Products, ...nativos } = corpo;
    const nid = Math.max(0, ...db.Orders.map((x) => x.Id), ...db.Documents.map((x) => x.Id), 500000) + 1;
    const agora = new Date().toISOString();
    const r = { Id: nid, CreateDate: agora, Date: agora, OwnerId: db.Users[0]?.Id ?? null, ContactId: null, DealId: null, OtherProperties: [], ...nativos };
    if (col === 'Orders') {
      if (Products !== undefined && !Array.isArray(Products)) return erro(400, 'Products precisa ser uma lista de { ProductId, Quantity, UnitPrice }.');
      for (const p of Products ?? []) if (!db.Products.some((x) => x.Id === p.ProductId)) return erro(400, `ProductId ${p.ProductId} não existe`);
      Object.assign(r, { OrderNumber: db.Orders.length + 1, CurrencyId: r.CurrencyId ?? 1, Amount: r.Amount ?? 0, Products: (Products ?? []).map((p, i) => ({ Id: nid * 10 + i, ...p })) });
    } else Object.assign(r, { DocumentNumber: db.Documents.length + 1 });
    r.Date = r.Date ? new Date(r.Date).toISOString() : agora;
    const e = aplicarOutros(r, OtherProperties); if (e) return e;
    r.DocumentUrl = urlDoDocumento(col === 'Orders' ? 'order' : 'document', nid);
    db[col].push(r); return [200, { value: [r] }];
  }
  if ((col === 'Orders' || col === 'Documents' || col === 'Quotes') && metodo === 'PATCH' && idReg && !acao) {
    const r = db[col].find((x) => x.Id === idReg); if (!r) return erro(404, 'Registro não encontrado');
    const { OtherProperties, ...nativos } = corpo; r.OtherProperties ??= []; const e = aplicarOutros(r, OtherProperties); if (e) return e;
    Object.assign(r, nativos); return [200, {}];
  }
  if (col !== 'Deals') return erro(405, `Escrita em ${col} não simulada na bancada`);
  if (metodo === 'POST' && !idReg) {
    const p = db.DealsPipelines.find((x) => x.Id === corpo.PipelineId);
    if (!p) return erro(400, 'PipelineId inválido');
    const d = { Id: Math.max(...db.Deals.map((x) => x.Id), 0) + 1, StatusId: 1, StageId: corpo.StageId ?? p.Stages[0].Id, OwnerId: corpo.OwnerId ?? db.Users[0].Id, CreateDate: new Date().toISOString(), OtherProperties: [], ...corpo, };
    d.OtherProperties = []; const e = aplicarOutros(d, corpo.OtherProperties); if (e) return e;
    db.Deals.push(d); return [200, { value: [d] }];
  }
  const d = db.Deals.find((x) => x.Id === idReg);
  if (!d) return erro(404, 'Registro não encontrado');
  const p = db.DealsPipelines.find((x) => x.Id === d.PipelineId);
  const ordem = (sid) => p.Stages.find((s) => s.Id === sid)?.Ordination;
  if (metodo === 'PATCH' && !acao) {
    if (corpo.StageId !== undefined && corpo.StageId !== d.StageId) {
      if (d.StatusId !== 1) return erro(400, 'Não é possível alterar a etapa de um negócio ganho ou perdido.');
      if (!ordem(corpo.StageId)) return erro(400, 'StageId não pertence ao funil do negócio.');
      if (p.ForbiddenStageReturn && ordem(corpo.StageId) < ordem(d.StageId)) return erro(400, 'Este funil não permite voltar etapa.');
      if (p.MustPassAllStages && ordem(corpo.StageId) > ordem(d.StageId) + 1) return erro(400, 'Este funil exige passar por todas as etapas.');
      if (ordem(corpo.StageId) > ordem(d.StageId) && pendenciasDoChecklist(d).length) return erroReal(401, 'There is a pending checklist to be completed');
    }
    const { OtherProperties, ...nativos } = corpo;
    const e = aplicarOutros(d, OtherProperties); if (e) return e;
    if (nativos.ContactsProducts !== undefined) {
      // a coleção substitui os vínculos (comportamento a confirmar na API real: substitui ou acrescenta)
      if (!Array.isArray(nativos.ContactsProducts)) return erro(400, 'ContactsProducts precisa ser uma lista de { ContactProductId }.');
      for (const v of nativos.ContactsProducts) if (!db.ContactsProducts.some((x) => x.Id === v.ContactProductId)) return erro(400, `ContactProductId ${v.ContactProductId} não existe`);
      if ((d.ContactsProducts ?? []).some((v) => !nativos.ContactsProducts.some((n) => n.ContactProductId === v.ContactProductId))) avisos.push(`Negócio ${d.Id}: o PATCH de ContactsProducts tirou vínculos que existiam — mande a lista inteira`);
    }
    if (nativos.ContactProductId && !db.ContactsProducts.some((x) => x.Id === nativos.ContactProductId)) return erro(400, `ContactProductId ${nativos.ContactProductId} não existe`);
    Object.assign(d, nativos); if (nativos.ContactsProducts !== undefined) sincronizarVinculos(); return [200, {}];
  }
  // como a API pública real: os itens (Fields) só vêm quando a consulta pede $expand=Fields
  if (acao === 'GetApplicableChecklists' && !/Fields/.test(corpo.__expand ?? '')) return [200, { value: db.Checklists.filter((c) => c.DealStageId === d.StageId).map(({ Fields, ...c }) => c) }];
  if (acao === 'GetApplicableChecklists') return [200, { value: db.Checklists.filter((c) => c.DealStageId === d.StageId).map((c) => ({ ...c, Fields: c.Fields.map((f) => { const x = db.Fields.find((y) => y.Key === f.FieldKey); return { ...f, ChecklistId: c.Id, Field: x ? { Id: x.Id, Key: x.Key, Name: x.Name, TypeId: x.TypeId } : null, Conditions: [] }; }) })) }];
  // formato real (conferido em 2026-09-30): lista dos ChecklistFields pendentes; vazia = válido
  if (acao === 'ValidateChecklist') return [200, { value: pendenciasDoChecklist(d) }];
  if (acao === 'Win') {
    if (d.StatusId !== 1) return erro(400, 'Só negócio em aberto pode ser ganho.');
    if (!p.MayWinDeals) return erro(401, 'MayWinDeals is false: cannot win deals on this pipeline.');
    if (p.WinDealOnLastStage && ordem(d.StageId) !== Math.max(...p.Stages.map((s) => s.Ordination))) return erro(400, 'Este funil só permite ganhar na última etapa.');
    if (pendenciasDoChecklist(d).length) return erroReal(401, 'There is a pending checklist to be completed');
    d.StatusId = 2; d.FinishDate = new Date().toISOString(); return [200, { value: [d] }];
  }
  if (acao === 'Lose') {
    if (d.StatusId !== 1) return erro(400, 'Só negócio em aberto pode ser perdido.');
    if (!p.MayLoseDeals) return erro(401, 'MayLoseDeals is false: cannot lose deals on this pipeline.');
    if (!corpo.LossReasonId) return erro(400, 'Negócio perdido exige motivo de perda (LossReasonId).');
    d.StatusId = 3; d.FinishDate = new Date().toISOString(); d.LossReasonId = corpo.LossReasonId; return [200, { value: [d] }];
  }
  if (acao === 'Reopen') { if (d.StatusId === 1) return erro(400, 'O negócio já está em aberto.'); d.StatusId = 1; return [200, { value: [d] }]; }
  return erro(404, `Ação ${acao} não simulada na bancada`);
}

// ------------------------------------------------------------------ servidor do host + API
const CORS = { 'Access-Control-Allow-Origin': `http://localhost:${PORTA_TELA}`, Vary: 'Origin', 'Access-Control-Allow-Headers': 'User-Key, Content-Type, Accept', 'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS', 'Access-Control-Expose-Headers': 'Retry-After' };
const json = (res, s, o, h = {}) => { res.writeHead(s, { 'Content-Type': 'application/json; charset=utf-8', ...CORS, ...h }); res.end(JSON.stringify(o)); };
const corpoDe = (req) => new Promise((ok) => { let b = ''; req.on('data', (c) => (b += c)); req.on('end', () => { try { ok(b ? JSON.parse(b) : {}); } catch { ok({ __invalido: true }); } }); });

// Só atende a própria máquina: o proxy do modo API real fala com a chave de quem roda.
const daMaquina = (req) => ['127.0.0.1', '::1', '::ffff:127.0.0.1'].includes(req.socket.remoteAddress);

http.createServer(async (req, res) => {
  if (!daMaquina(req)) { res.writeHead(403); return res.end(); }
  const url = new URL(req.url, `http://localhost:${PORTA_HOST}`);
  if (req.method === 'OPTIONS') { res.writeHead(204, CORS); return res.end(); }
  // /contact/<id> e /deal/<id>: a ficha nativa simulada (é para onde abrirCliente/abrirNegocio da tela levam)
  if (url.pathname === '/' || url.pathname === '/index.html' || /^\/(contact|deal)\/\d+$/.test(url.pathname)) {
    const html = readFileSync(join(AQUI, 'host.html'), 'utf-8').replace('__TELA__', `http://localhost:${PORTA_TELA}/`).replace('__API__', `http://localhost:${PORTA_HOST}/api/`).replace('__CHAVE__', CHAVE);
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }); return res.end(html);
  }
  // /quote|order|document/<id>: o registro nativo simulado é o próprio documento gerado
  const nativo = url.pathname.match(/^\/(quote|order|document)\/(\d+)$/);
  if (nativo) { res.writeHead(302, { Location: urlDoDocumento(nativo[1], Number(nativo[2])) }); return res.end(); }
  const doc = url.pathname.match(/^\/_bancada\/documento\/(quote|order|document)\/(\d+)$/);
  if (doc) {
    const html = db ? documentoHtml(doc[1], Number(doc[2])) : null;
    res.writeHead(html ? 200 : 404, { 'Content-Type': 'text/html; charset=utf-8' });
    return res.end(html ?? '<!doctype html><meta charset="utf-8"><p>Documento não encontrado na bancada.</p>');
  }
  // O host real da ponte: o @ploomescrm/bridge instalado na TELA (npm install dela). Não vem na skill
  // (pacote proprietário, não se redistribui) — por isso a bancada usa o da tela, ou o de --bridge.
  if (url.pathname === '/_bancada/bridge.mjs') {
    const arq = acharBridge();
    if (!arq) { res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }); return res.end('Não achei @ploomescrm/bridge: rode npm install na pasta da tela, ou passe --bridge <caminho do index.mjs>.'); }
    res.writeHead(200, { 'Content-Type': 'application/javascript; charset=utf-8', 'Cache-Control': 'no-store' });
    return res.end(readFileSync(arq));
  }
  if (url.pathname.startsWith('/_bancada/')) {
    const cmd = url.pathname.slice(10), b = req.method === 'POST' ? await corpoDe(req) : {};
    if (cmd === 'estado') { let tela = null; try { tela = JSON.parse(readFileSync(join(PACOTE, 'contrato-de-dados.json'), 'utf-8')).tela?.nome ?? null; } catch { /* sem contrato */ }
      return json(res, 200, { tela, registro: registro.slice(-200), avisos, funis: db.DealsPipelines.map((p) => p.Name),
        usuarios: db.Users.map((u) => ({ id: u.Id, nome: u.Name, perfil: db.UsersProfiles?.find((x) => x.Id === u.ProfileId)?.Name ?? null,
          campos: Object.fromEntries((u.OtherProperties ?? []).map((op) => [db.Fields.find((f) => f.Key === op.FieldKey)?.Name ?? op.FieldKey, Object.entries(op).find(([k]) => k !== 'FieldKey')?.[1] ?? null])) })) }); }
    // O flow do registro do onboarding da conta (2026-10-27): o webhook que, no Ploomes Flows, grava no Usuário com a
    // chave de integração. "flowDoOnboarding": { "assistiu", "consultou", "concluiu", "ultimaConclusao" } (as FieldKeys).
    if (cmd === 'flow/onboarding') {
      const k = flowDoOnboarding, u = db.Users.find((x) => x.Id === Number(b.usuarioId));
      const linha = { quando: new Date().toISOString().slice(11, 19), metodo: 'POST', rota: 'flow/onboarding', corpo: JSON.stringify(b).slice(0, 300) };
      registro.push(linha);
      if (!k) { linha.status = 404; return json(res, 404, { ok: false, motivo: 'sem "flowDoOnboarding" no dados-de-teste.json' }); }
      if (!u || !['abriu', 'concluiu'].includes(b.evento)) { linha.status = 400; return json(res, 400, { ok: false, motivo: 'usuário ou evento inválido' }); }
      const valor = (chave, col) => u.OtherProperties.find((op) => op.FieldKey === chave)?.[col];
      const gravar = (chave, col, v) => { u.OtherProperties = u.OtherProperties.filter((op) => op.FieldKey !== chave).concat([{ FieldKey: chave, [col]: v }]); };
      if (b.evento === 'abriu') {
        if (typeof valor(k.concluiu, 'BoolValue') === 'boolean') gravar(k.consultou, 'IntegerValue', (valor(k.consultou, 'IntegerValue') ?? 0) + 1);
        else gravar(k.concluiu, 'BoolValue', false);
      } else {
        gravar(k.assistiu, 'IntegerValue', (valor(k.assistiu, 'IntegerValue') ?? 0) + 1);
        gravar(k.concluiu, 'BoolValue', true);
        gravar(k.ultimaConclusao, 'DateTimeValue', new Date().toISOString());
      }
      linha.status = 200; return json(res, 200, { ok: true });
    }
    if (cmd === 'reiniciar') { carregar(); return json(res, 200, { ok: true }); }
    if (cmd === 'neppo') return json(res, 200, {
      conversas: (db.NeppoConversas ?? []).map((c) => ({ ...c, aguardando: c.mensagens.length > 0 && c.mensagens[c.mensagens.length - 1].de === 'cliente' })),
      envios: (neppo?.envios ?? []).map((e) => ({ ...e, cliente: db.Contacts.find((x) => x.Id === e.clienteId)?.Name ?? '' })),
      modelos: neppo?.modelos ?? [], grupos: neppo?.grupos ?? [], limite: neppo?.limite ?? null,
      contatos: db.Contacts.filter((c) => c.Phones?.length).map((c) => ({ id: c.Id, nome: c.Name, telefone: c.Phones[0].PhoneNumber })) });
    if (cmd === 'neppo/enviar') {
      const c = (db.NeppoConversas ?? []).find((x) => x.sessionId === String(b.sessionId));
      if (!c || !String(b.texto ?? '').trim()) return json(res, 400, { ok: false });
      if (b.de !== 'cliente' && c.status === 'ENCERRADA') return json(res, 400, { ok: false, motivo: 'sessão encerrada: use envio ativo' });
      aplicarMensagemF1(c, b.de === 'cliente' ? 'cliente' : 'vendedor', String(b.texto).trim(), new Date().toISOString());
      return json(res, 200, { ok: true });
    }
    // envio ativo manual pelo modal do chat embarcado (Cliente · Grupo de atendimento · Canal · Mensagem)
    if (cmd === 'neppo/ativo') { const r = envioAtivo({ clienteId: Number(b.clienteId), modelo: b.modelo, valores: b.valores ?? {}, origem: 'chat embarcado' }); return json(res, r.ok ? 200 : 400, r); }
    if (cmd === 'neppo/finalizar') { const c = (db.NeppoConversas ?? []).find((x) => x.sessionId === String(b.sessionId)); if (c) { c.status = 'ENCERRADA'; const reg = db.InteractionRecords.find((r) => r.Id === c.registroId); if (reg && camposF1?.statusSessao) gravarOP(reg, camposF1.statusSessao, 'CLOSED'); } return json(res, c ? 200 : 404, { ok: !!c }); }
    if (cmd === 'falhar') { falhas.push({ status: Number(b.status), vezes: Number(b.vezes ?? 1) }); return json(res, 200, { ok: true }); }
    if (cmd === 'renomear-funil') { const p = db.DealsPipelines.find((x) => x.Name === b.de); if (p) p.Name = b.para; return json(res, p ? 200 : 404, { ok: !!p }); }
    if (cmd === 'renomear-etapa') { let ok = false; for (const p of db.DealsPipelines) for (const s of p.Stages) if (s.Name === b.de) { s.Name = b.para; ok = true; } return json(res, ok ? 200 : 404, { ok }); }
    return json(res, 404, { erro: 'comando desconhecido' });
  }
  if (!url.pathname.startsWith('/api/')) { res.writeHead(404); return res.end(); }
  const rota = decodeURIComponent(url.pathname.slice(5));
  const linha = { quando: new Date().toISOString().slice(11, 19), metodo: req.method, rota: rota + (url.search ? decodeURIComponent(url.search) : '') };
  registro.push(linha); const inicio = Date.now();
  // A chave da bancada leva o usuário logado (chave-da-bancada:<id>, 2026-10-27): é ele o Self e o dono do PATCH no próprio usuário.
  const chaveRecebida = String(req.headers['user-key'] ?? '');
  if (chaveRecebida !== CHAVE && !chaveRecebida.startsWith(CHAVE + ':')) { linha.status = 401; return json(res, 401, { error: { message: 'User-Key ausente ou inválida' } }); }
  const logado = Number(chaveRecebida.split(':')[1]) || null;
  if (API_REAL) {
    const liberada = ESCRITA || (ESCRITA_SO && (rota === ESCRITA_SO || rota.startsWith(ESCRITA_SO + '(')));
    if (req.method !== 'GET' && !liberada) { linha.status = 403; return json(res, 403, { error: { message: `Barrado pela bancada (modo só leitura): ${req.method} ${rota}` } }); }
    const corpo = req.method === 'GET' ? undefined : JSON.stringify(await corpoDe(req));
    if (corpo) linha.corpo = corpo.slice(0, 300);
    try {
      const r = await fetch(API_REAL + rota + url.search, { redirect: 'manual', method: req.method, headers: { 'User-Key': process.env.PLOOMES_USER_KEY, Accept: 'application/json', ...(corpo ? { 'Content-Type': 'application/json' } : {}) }, body: corpo });
      if (r.status >= 300 && r.status < 400) { linha.status = 502; return json(res, 502, { error: { message: 'Proxy: a API respondeu com redirecionamento, e a chave não segue para outro endereço.' } }); }
      const texto = await r.text(); linha.status = r.status; linha.ms = Date.now() - inicio;
      if (!r.ok) linha.corpo = (linha.corpo ? linha.corpo + ' → ' : '') + texto.slice(0, 300);
      res.writeHead(r.status, { 'Content-Type': 'application/json; charset=utf-8', ...CORS, ...(r.headers.get('retry-after') ? { 'Retry-After': r.headers.get('retry-after') } : {}) });
      return res.end(texto);
    } catch (e) { linha.status = 502; return json(res, 502, { error: { message: 'Proxy: ' + e.message } }); }
  }
  const f = falhas[0];
  if (f) { if (--f.vezes <= 0) falhas.shift(); linha.status = f.status; return json(res, f.status, { error: { message: f.status === 429 ? '120 requests per minute exceeded' : f.status === 401 ? "Your profile doesn't have permission" : 'Erro simulado pela bancada' } }, f.status === 429 ? { 'Retry-After': '1' } : {}); }
  // Self e o próprio usuário (2026-10-27): o onboarding da conta lê quem abriu e grava no cadastro dele.
  const eu = db.Users.find((u) => u.Id === logado) ?? db.Users[0];
  if (rota === 'Self' && req.method === 'GET') {
    const q = new URLSearchParams(url.searchParams); q.set('$filter', `Id eq ${eu.Id}`);
    const r = listar('Users', q); linha.status = r[0]; return json(res, r[0], r[1]);
  }
  if (req.method === 'PATCH' && /^Users\(\d+\)$/.test(rota)) {
    const b = await corpoDe(req); linha.corpo = JSON.stringify(b).slice(0, 300);
    const alvo = db.Users.find((u) => u.Id === Number(rota.slice(6, -1)));
    const adm = !!db.UsersProfiles.find((x) => x.Id === eu.ProfileId)?.Administrator;
    const r = !alvo ? erro(404, 'Registro não encontrado')
      : !adm && (alvo.Id !== eu.Id || !permissaoPropria.get(eu.Id)) ? erro(403, "Your profile doesn't have permission")
      : Object.keys(b).some((k) => k !== 'OtherProperties') ? erro(403, 'Barrado pela bancada: a tela só grava campo personalizado do usuário')
      : aplicarOutros(alvo, b.OtherProperties ?? []) ?? [200, {}];
    linha.status = r[0]; return json(res, r[0], r[1]);
  }
  const m = rota.match(/^([A-Za-z@]+)(?:\((\d+)\))?(?:\/(\w+))?$/);
  if (!m) { linha.status = 404; return json(res, 404, { error: { message: `Rota ${rota} não existe na bancada` } }); }
  const col = m[1].replace(/@/g, ''), idReg = m[2] ? Number(m[2]) : null, acao = m[3] ?? null;
  let r;
  if (req.method === 'GET' && !idReg) r = listar(col, url.searchParams);
  else if (req.method === 'GET' && acao) r = escrever('GET', col, idReg, acao, { __expand: url.searchParams.get('$expand') ?? '' });
  else if (req.method === 'GET') { const x = db[col]?.find((y) => y.Id === idReg); r = x ? [200, { value: [expandir(col, x, url.searchParams.get('$expand')).out] }] : erro(404, 'Registro não encontrado'); }
  else { const b = await corpoDe(req); r = b.__invalido ? erro(400, 'Corpo não é JSON') : escrever(req.method, col, idReg, acao, b); if (req.method !== 'GET') linha.corpo = JSON.stringify(b).slice(0, 300); }
  linha.status = r[0];
  return json(res, r[0], r[1]);
}).listen(PORTA_HOST, () => console.log(`CRM falso e API: http://localhost:${PORTA_HOST}/`));

// ------------------------------------------------------------------ servidor da tela (outra origem)
const TIPOS = { '.html': 'text/html; charset=utf-8', '.js': 'application/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.json': 'application/json', '.woff2': 'font/woff2' };
http.createServer((req, res) => {
  if (!daMaquina(req)) { res.writeHead(403); return res.end(); }
  let p = join(TELA, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (!p.startsWith(TELA.endsWith(sep) ? TELA : TELA + sep) || !existsSync(p) || statSync(p).isDirectory()) p = join(TELA, 'index.html');
  res.writeHead(200, { 'Content-Type': TIPOS[extname(p)] ?? 'application/octet-stream', 'Cache-Control': 'no-store' });
  res.end(readFileSync(p));
}).listen(PORTA_TELA, () => console.log(`Tela: http://localhost:${PORTA_TELA}/`));

if (API_REAL) {
  // o painel (Neppo, contatos) lê Contacts e NeppoConversas também no modo API real
  db = { Users: [], DealsPipelines: [], Deals: [], Checklists: [], Contacts: [], NeppoConversas: [] }; avisos = []; registro = []; falhas = [];
  try {
    const r = await fetch(API_REAL + 'Self?$select=Id,Name', { redirect: 'manual', headers: { 'User-Key': process.env.PLOOMES_USER_KEY, Accept: 'application/json' } });
    const u = (await r.json())?.value?.[0];
    if (!r.ok || !u) throw new Error(`Self respondeu ${r.status}`);
    db.Users.push({ Id: u.Id, Name: u.Name });
  } catch (e) { console.error('Não consegui ler o usuário da chave (GET Self): ' + e.message); process.exit(1); } console.log(`MODO API REAL → ${API_REAL} (${ESCRITA ? 'ESCRITA PERMITIDA' : ESCRITA_SO ? 'escrita só em ' + ESCRITA_SO : 'só leitura'})`); }
else carregar();
if (!API_REAL) console.log(`Dados: ${db.Deals.length} negócios, ${db.DealsPipelines.length} funil(is), ${db.Checklists.length} checklist(s).`);
