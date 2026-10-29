// Teste de fumaça do api.ts contra a API real do Ploomes. SÓ LEITURA.
//
// Uso (no terminal de quem tem a chave; ela nunca vai para arquivo):
//   PLOOMES_API_URL=https://public-api2.ploomes.com/  PLOOMES_USER_KEY=...  [PLOOMES_DEAL_ID=<negócio de teste>]
//   node testar_na_conta.ts <pasta pacote-construtor>
//
// Roda iniciar() e as duas primeiras páginas de cada leitura sem parâmetro obrigatório.
// Qualquer requisição que não seja GET é barrada antes de sair da máquina.
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const pasta = process.argv[2];
const apiUrl = process.env.PLOOMES_API_URL;
const userKey = process.env.PLOOMES_USER_KEY?.trim().replace(/^["']|["']$/g, '');
if (!pasta || !apiUrl || !userKey) {
  console.error('Uso: PLOOMES_API_URL=... PLOOMES_USER_KEY=... node testar_na_conta.ts <pasta pacote-construtor>');
  process.exit(2);
}

// A chave só segue para um host do Ploomes por https (ou para a própria máquina, na bancada), e nunca
// por redirecionamento: o fetch do Node repassaria o cabeçalho User-Key a outro host.
const confiavel = (u: string) => { try { const x = new URL(u); return (x.protocol === 'https:' && (x.hostname === 'ploomes.com' || x.hostname.endsWith('.ploomes.com'))) || (x.protocol === 'http:' && ['127.0.0.1', 'localhost', '[::1]'].includes(x.hostname)); } catch { return false; } };
if (!confiavel(apiUrl)) { console.error(`PLOOMES_API_URL só aceita host do Ploomes por https ou a própria máquina: ${apiUrl}`); process.exit(2); }

const fetchReal = globalThis.fetch;
const chamadas: string[] = [];
globalThis.fetch = (async (url: string, init: any = {}) => {
  const metodo = (init.method ?? 'GET').toUpperCase();
  if (metodo !== 'GET') throw new Error(`Barrado: ${metodo} ${url} — este teste é só leitura.`);
  if (!confiavel(String(url))) throw new Error(`Barrado: ${url} — a chave só vai para o Ploomes.`);
  chamadas.push(decodeURIComponent(String(url).replace(apiUrl, '')));
  const r = await fetchReal(url, { ...init, redirect: 'manual' });
  if (r.status >= 300 && r.status < 400) throw new Error(`Barrado: ${url} respondeu com redirecionamento, e a chave não segue para outro endereço.`);
  return r;
}) as typeof fetch;

const contrato = JSON.parse(await (await import('node:fs/promises')).readFile(resolve(pasta, 'contrato-de-dados.json'), 'utf-8'));
const api: any = await import(pathToFileURL(resolve(pasta, 'src/ploomes/api.ts')).href);

let falhas = 0;
const ok = (m: string) => console.log('  OK     ' + m);
const erro = (m: string) => { falhas++; console.log('  FALHOU ' + m); };

console.log('\n1. iniciar() — resolve funis, etapas, modelos e opções pelo nome');
api.configurar({ apiUrl, userKey, userId: Number(process.env.PLOOMES_USER_ID ?? 0) });
try {
  await api.iniciar();
  for (const f of Object.keys(contrato.funis ?? {})) ok(`funil ${f}: ${api.etapasDoFunil(f).length} etapas, regras ${JSON.stringify(api.regrasDoFunil(f))}`);
  for (const [c, d] of Object.entries<any>(contrato.campos ?? {})) if (d.opcoes) ok(`opções de ${c}: ${api.opcoes(c).length}`);
} catch (e: any) {
  erro(`${e.name}: ${e.message}`);
  if (e.status === 404 || e.status === 401) console.log('         → a public-api2 responde 404 para chave inválida: confira se a User-Key é desta conta e está inteira.');
}

console.log('\n2. Leituras — duas páginas, sem repetir registro');
for (const [nome, l] of Object.entries<any>(contrato.leituras ?? {})) {
  const params = Object.keys(l.parametros ?? {});
  // Parâmetro de etapa ("StageId eq {param:x}"): roda uma vez por etapa do funil citado no filtro.
  const pEtapa = params.find((x) => (l.filtro ?? '').includes(`StageId eq {param:${x}}`));
  const funilDoFiltro = (l.filtro ?? '').match(/\{funil:(\w+)\}/)?.[1];
  if (l.umRegistro) { console.log(`  PULADA ${nome} (umRegistro: testada na etapa 3, com PLOOMES_DEAL_ID)`); continue; }
  // Agregada ($apply): data vira "há 90 dias" (janela típica de indicador); sem parâmetro, roda direto.
  if (l.agregar) {
    if (params.some((x) => l.parametros[x] !== 'date')) { console.log(`  PULADA ${nome} (agregada com parâmetro sem valor de teste)`); continue; }
    try {
      const desde = new Date(Date.now() - 90 * 864e5);
      const linhas = await api[nome](Object.fromEntries(params.map((x) => [x, desde])));
      const faltam = Object.keys(l.agregar.medidas).filter((m) => linhas.length && !(m in linhas[0]));
      if (!Array.isArray(linhas)) erro(`${nome}: não devolveu lista`);
      else if (faltam.length) erro(`${nome}: a linha veio sem ${faltam.join(', ')}`);
      else ok(`${nome}${params.length ? ` (${params.join(', ')} = há 90 dias)` : ''}: ${linhas.length} grupo(s)${linhas[0] ? ' — ' + JSON.stringify(linhas[0]) : ''}`);
    } catch (e: any) { erro(`${nome}: ${e.message}`); }
    continue;
  }
  // Parâmetros só de data: testa com "hoje + 7 dias" (janela típica de agenda).
  const soDatas = params.length > 0 && params.every((x) => l.parametros[x] === 'date');
  if (soDatas) {
    const ate = new Date(Date.now() + 7 * 864e5);
    try {
      const r = await api[nome](Object.fromEntries(params.map((x) => [x, ate])));
      ok(`${nome} (${params.join(', ')} = hoje + 7 dias): ${r.itens.length} itens`);
    } catch (e: any) { erro(`${nome}: ${e.message}`); }
    continue;
  }
  if (params.length && !(params.length === 1 && pEtapa && funilDoFiltro)) { console.log(`  PULADA ${nome} (parâmetro sem valor de teste)`); continue; }
  if (pEtapa && funilDoFiltro) {
    try {
      for (const e of api.etapasDoFunil(funilDoFiltro)) {
        const r = await api[nome]({ [pEtapa]: e.id });
        const outrosOk = !(l.outrosCampos ?? []).length || !r.itens.length || r.itens[0].OtherProperties;
        if (!outrosOk) erro(`${nome} / ${e.nome}: pediu outrosCampos mas veio sem OtherProperties`);
        else ok(`${nome} / ${e.nome}: ${r.itens.length} itens${r.proximoCursor ? ' (há mais páginas)' : ''}`);
      }
    } catch (e: any) { erro(`${nome}: ${e.message}`); }
    continue;
  }
  if (contrato.leituras[nome].filtro?.includes('{usuario}') && !process.env.PLOOMES_USER_ID) { console.log(`  PULADA ${nome} (usa {usuario}; defina PLOOMES_USER_ID)`); continue; }
  try {
    const p1 = await api[nome]({});
    let detalhe = `${p1.itens.length} itens`;
    if (p1.proximoCursor !== null) {
      const p2 = await api[nome]({}, p1.proximoCursor);
      const ids = new Set(p1.itens.map((x: any) => x.Id));
      const repetidos = p2.itens.filter((x: any) => ids.has(x.Id)).length;
      if (repetidos) { erro(`${nome}: ${repetidos} registro(s) repetido(s) entre as páginas`); continue; }
      detalhe += ` + ${p2.itens.length} na página 2`;
    }
    const semOutros = (l.outrosCampos ?? []).length && p1.itens.length && !p1.itens[0].OtherProperties;
    if (semOutros) erro(`${nome}: pediu outrosCampos mas o registro veio sem OtherProperties`);
    else ok(`${nome}: ${detalhe}`);
  } catch (e: any) {
    erro(`${nome}: ${e.message}`);
  }
}

const dealId = Number(process.env.PLOOMES_DEAL_ID ?? 0);
if (dealId && typeof api.checklistsDaEtapa === 'function') {
  console.log(`\n3. Checklists do negócio ${dealId}`);
  try {
    const v = await api.validarChecklist(dealId);
    ok(`validarChecklist: valido=${v.valido}${v.pendentes.length ? ' — pendentes: ' + v.pendentes.join(', ') : ''}`);
    for (const c of await api.checklistsDaEtapa(dealId)) {
      ok(`checklist "${c.nome}": ${c.itens.length} itens`);
      for (const i of c.itens) console.log(`           · ${i.nome} [TypeId ${i.typeId}] ${i.pendente ? 'PENDENTE' : 'ok'} — valor: ${i.nomeDoValor || '—'}`);
    }
    for (const [nome, l] of Object.entries<any>(contrato.leituras ?? {})) if (l.umRegistro) {
      const r = await api[nome](dealId);
      if (r) ok(`${nome}(${dealId}): "${r.Title}"`); else erro(`${nome}(${dealId}) voltou vazio`);
    }
  } catch (e: any) { erro(`checklists: ${e.message}`); }
}
for (const f of Object.keys(contrato.funis ?? {})) {
  try { ok(`textosDoFunil(${f}): ${JSON.stringify(api.textosDoFunil?.(f))}`); } catch { /* api.ts de gerador antigo */ }
}

// 4. Configuração dos checklists das etapas usadas. Não é defeito do pacote, mas faz a tela parecer quebrada:
//    obrigatório sem condição = etapa travada para sempre; "igual a vazio" = só passa com o campo vazio.
console.log('\n4. Configuração dos checklists das etapas');
const OPS: Record<number, string> = { 1: 'igual a', 2: 'diferente de', 3: 'maior que', 4: 'maior ou igual a', 5: 'menor que', 6: 'menor ou igual a', 7: 'contém', 8: 'não contém' };
const valorDe = (c: any) => ['StringValue', 'BigStringValue', 'IntegerValue', 'DecimalValue', 'DateTimeValue', 'BoolValue'].map((k) => c[k]).find((v) => v !== null && v !== undefined);
let problemas = 0;
for (const f of Object.keys(contrato.funis ?? {})) {
  let etapas: any[] = [];
  try { etapas = api.etapasDoFunil(f); } catch { continue; }
  for (const e of etapas) {
    const r = await fetch(`${apiUrl}Checklists?$filter=DealStageId eq ${e.id}&$select=Id,Name&$expand=Fields($select=Id,Name,Required;$expand=Conditions($select=OperationId,StringValue,BigStringValue,IntegerValue,DecimalValue,DateTimeValue,BoolValue))`,
      { headers: { 'User-Key': userKey, Accept: 'application/json' } });
    if (!r.ok) { erro(`checklists da etapa ${e.nome}: HTTP ${r.status}`); continue; }
    for (const c of (await r.json()).value ?? []) for (const i of c.Fields ?? []) {
      if (!i.Required) continue;
      const conds = i.Conditions ?? [];
      if (!conds.length) { problemas++; console.log(`  TRAVA  ${e.nome} › "${c.Name}" › "${i.Name}": obrigatório SEM condição — nenhum valor libera a etapa`); continue; }
      const invertida = conds.every((x: any) => x.OperationId === 1 && valorDe(x) === undefined);
      if (invertida) { problemas++; console.log(`  INVERT ${e.nome} › "${c.Name}" › "${i.Name}": condição "igual a vazio" — só passa com o campo VAZIO`); }
      else ok(`${e.nome} › "${i.Name}": ${conds.map((x: any) => `${OPS[x.OperationId] ?? x.OperationId} ${valorDe(x) ?? 'vazio'}`).join(' ou ')}`);
    }
  }
}
if (problemas) console.log(`  → ${problemas} item(ns) de checklist mal configurado(s) na conta. Corrija no Ploomes (condição "diferente de" vazio = preenchido) antes de testar a tela.`);

console.log('\nChamadas feitas:');
for (const c of chamadas) console.log('  GET ' + c);
console.log(`\n${falhas ? 'FALHOU' : 'PASSOU'} — ${falhas} falha(s), ${chamadas.length} chamada(s), nenhuma escrita.`);
process.exit(falhas ? 1 : 0);
