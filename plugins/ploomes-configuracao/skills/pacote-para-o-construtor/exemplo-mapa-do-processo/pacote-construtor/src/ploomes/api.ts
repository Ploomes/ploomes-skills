// GERADO por gerar_api.py a partir de contrato-de-dados.json (contrato a91b8497ae25f9af).
// NÃO EDITE À MÃO: mude o contrato e gere de novo. Toda chamada à API do Ploomes passa por aqui.
// Tela: Mapa do processo comercial
/* eslint-disable */

export type Contexto = { apiUrl: string; userKey: string; userId: number };
export type Pagina<T> = { itens: T[]; proximoCursor: number | null };

export class ErroApi extends Error {
  status: number;
  constructor(status: number, mensagem: string) { super(mensagem); this.name = 'ErroApi'; this.status = status; }
}
export class ErroConfiguracao extends Error {
  faltando: string[];
  constructor(faltando: string[]) {
    super('A conta não tem o que esta tela precisa: ' + faltando.join('; ') + '.');
    this.name = 'ErroConfiguracao';
    this.faltando = faltando;
  }
}

let ctx: Contexto | null = null;

/** Chame com o config que a ponte (@ploomescrm/bridge) entregou no host:init:
 *  configurar({ apiUrl: config.apiUrls.apiUrl, userKey: config.userKey, userId: config.userId }) */
export function configurar(c: Contexto): void {
  if (!c?.apiUrl || !c?.userKey) throw new ErroApi(0, 'Configuração da conta indisponível.');
  ctx = { ...c, apiUrl: c.apiUrl.endsWith('/') ? c.apiUrl : c.apiUrl + '/' };
}
export function usuarioAtual(): number {
  if (!ctx) throw new ErroApi(0, 'Sem conexão com a conta.');
  return ctx.userId;
}

// Mensagens reais da API (vistas em 2026-09-30). O Ploomes usa 401 também para regra de negócio.
const MENSAGENS: [RegExp, string][] = [
  [/pending checklist/i, 'Há item obrigatório do checklist pendente nesta etapa.'],
  [/MayWinDeals is false/i, 'Este funil não permite ganhar.'],
  [/MayLoseDeals is false/i, 'Este funil não permite perder.'],
  [/permission|permiss/i, 'Seu perfil não tem permissão para esta ação.'],
];

function traduzir(status: number, msg: string): string {
  for (const [re, pt] of MENSAGENS) if (re.test(msg)) return pt;
  if (status === 401 || status === 403) return 'Seu perfil não tem permissão para esta ação.' + (msg ? ' (' + msg + ')' : '');
  if (status === 404) return 'Registro não encontrado. Ele pode ter sido excluído.';
  if (status === 429) return 'Muitas requisições em pouco tempo. Tente de novo em instantes.';
  if (status >= 500) return 'O Ploomes não respondeu como esperado. Tente de novo.';
  return msg || 'Não foi possível concluir a operação.';
}

async function http<T>(metodo: string, caminho: string, corpo?: unknown, tentativa = 0): Promise<T> {
  if (!ctx) throw new ErroApi(0, 'Sem conexão com a conta: a ponte do Ploomes ainda não entregou a configuração.');
  const headers: Record<string, string> = { 'User-Key': ctx.userKey, Accept: 'application/json' };
  if (corpo !== undefined) headers['Content-Type'] = 'application/json';
  let r: Response;
  try {
    r = await fetch(ctx.apiUrl + caminho, { method: metodo, headers, body: corpo === undefined ? undefined : JSON.stringify(corpo) });
  } catch (e: any) {
    // Falha antes de a API responder (rede, DNS, certificado, CORS): diga a causa em vez de "fetch failed".
    // Nunca repita e.message: em erro de cabeçalho ela traz o valor da User-Key.
    const cabecalho = e?.cause?.code === 'UND_ERR_INVALID_ARG' || /Headers\.append|header/i.test(String(e?.message ?? ''));
    if (cabecalho) throw new ErroApi(0, 'A User-Key tem um caractere que não pode ir na requisição (espaço, quebra de linha ou acento).');
    throw new ErroApi(0, `Sem conexão com o Ploomes (${e?.cause?.code ?? 'erro de rede'}). Confira a rede e tente de novo.`);
  }
  if (r.status === 429 && tentativa < 3) {
    const s = Number(r.headers.get('Retry-After')) || 2 ** (tentativa + 1);
    await new Promise((ok) => setTimeout(ok, s * 1000));
    return http<T>(metodo, caminho, corpo, tentativa + 1);
  }
  if (!r.ok) {
    let msg = '';
    // A API real responde { value: "mensagem" }; a documentação mostra { error: { message } }. Lê os dois.
    try { const j = await r.json(); msg = j?.error?.message ?? (typeof j?.value === 'string' ? j.value : '') ?? ''; } catch { /* corpo sem JSON */ }
    throw new ErroApi(r.status, traduzir(r.status, msg));
  }
  const texto = await r.text();
  return (texto ? JSON.parse(texto) : undefined) as T;
}

function literal(v: unknown): string {
  if (v === null || v === undefined) return 'null';
  if (v instanceof Date) return v.toISOString();
  if (typeof v === 'number' || typeof v === 'boolean') return String(v);
  return "'" + String(v).replace(/'/g, "''") + "'";
}

// ---- O que a tela precisa da conta, POR NOME. Os IDs saem de iniciar().
const FUNIS: Record<string, { readonly nome: string; readonly etapas: Readonly<Record<string, string>> }> = {};
const MODELOS: Record<string, string> = {};
export const CAMPOS = {"asIs": {"fieldKey": "", "coluna": "BigStringValue", "multiplo": false, "opcoes": false, "porNome": {"entidade": 15, "nome": "Mapeamento as-is (tela)"}, "opcional": true}} as const;

export type ChaveCampo = keyof typeof CAMPOS;
/** A chave de cada campo nesta conta. Fica FORA de CAMPOS de propósito: o build minificado trata CAMPOS como
 *  constante e dobra `CAMPOS.x.fieldKey` para o valor do contrato — o campo por nome achado no iniciar() sumia
 *  (visto em 2026-10-20: campoDisponivel virou `return false`). Aqui a chave só existe em tempo de execução. */
const CHAVES: Record<string, string> = {};
for (const [k, d] of Object.entries(CAMPOS) as [string, any][]) CHAVES[k] = d.fieldKey;
function chaveDo(campo: string): string { return CHAVES[campo] ?? ''; }
/** mayWinDeals/mayLoseDeals ficam sempre true: a API pública devolve MayWinDeals=false e mesmo assim o Win passa
 *  (visto em 2026-09-30). Quem decide é o servidor no Win/Lose — mostre a mensagem do ErroApi se recusar. */
export type RegrasDoFunil = { mustPassAllStages: boolean; forbiddenStageReturn: boolean; mayWinDeals: boolean; mayLoseDeals: boolean; winDealOnLastStage: boolean };
export type Etapa = { id: number; nome: string; ordem: number };
/** Textos que a conta define para o funil — use-os na tela em vez de fixar "Ganhar"/"Perder"/"Negócio". */
export type TextosDoFunil = { unidade: string; unidades: string; verboGanhar: string; verboPerder: string };
type FunilResolvido = { id: number; regras: RegrasDoFunil; textos: TextosDoFunil; etapas: Record<string, number>; ordem: Etapa[] };

const funis: Record<string, FunilResolvido> = {};
const modelos: Record<string, number> = {};
const opcoesPorCampo: Record<string, { id: number; nome: string }[]> = {};
let iniciado = false;

/** Opções de uma tabela. Rota vista respondendo 200 em tela publicada (vista em 2026-09-30); a opção não tem ordem própria. */
async function opcoesDaTabela(tabela: number): Promise<{ id: number; nome: string }[]> {
  const o = await http<{ value: any[] }>('GET', `Fields@OptionsTables@Options?$filter=TableId eq ${tabela}&$select=Id,Name&$top=1000`);
  return (o.value ?? []).map((x: any) => ({ id: x.Id, nome: x.Name }));
}

const norm = (s: string) => (s ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase();

/** Resolve funis, etapas, modelos e opções pelo nome. Chame uma vez, logo depois de configurar().
 *  Se a conta não tiver algo, lança ErroConfiguracao com a lista — mostre isso na tela, não quebre calado. */
export async function iniciar(): Promise<void> {
  iniciado = false;
  const faltando: string[] = [];
  for (const [chave, def] of Object.entries(FUNIS)) {
    const f = `Name eq ${literal(def.nome)}`;
    const r = await http<{ value: any[] }>('GET', `DealsPipelines?$filter=${encodeURIComponent(f)}&$select=Id,Name,MustPassAllStages,ForbiddenStageReturn,MayWinDeals,MayLoseDeals,WinDealOnLastStage,SingularUnitName,PluralUnitName&$expand=Stages($select=Id,Name,Ordination),WinVerb($select=Name),LoseVerb($select=Name)`);
    const p = (r.value ?? [])[0];
    if (!p) { faltando.push(`funil "${def.nome}"`); continue; }
    const ordem: Etapa[] = (p.Stages ?? []).map((s: any) => ({ id: s.Id, nome: s.Name, ordem: s.Ordination })).sort((a: Etapa, b: Etapa) => a.ordem - b.ordem);
    const etapas: Record<string, number> = {};
    for (const [ce, nomeEtapa] of Object.entries(def.etapas as Record<string, string>)) {
      const e = ordem.find((x) => norm(x.nome) === norm(nomeEtapa));
      if (e) etapas[ce] = e.id; else faltando.push(`etapa "${nomeEtapa}" no funil "${def.nome}"`);
    }
    funis[chave] = { id: p.Id, etapas, ordem, regras: { mustPassAllStages: !!p.MustPassAllStages, forbiddenStageReturn: !!p.ForbiddenStageReturn, mayWinDeals: true, mayLoseDeals: true, winDealOnLastStage: !!p.WinDealOnLastStage },
      textos: { unidade: p.SingularUnitName || 'Negócio', unidades: p.PluralUnitName || 'Negócios', verboGanhar: p.WinVerb?.Name || 'Ganhar', verboPerder: p.LoseVerb?.Name || 'Perder' } };
  }
  for (const [chave, nome] of Object.entries(MODELOS)) {
    const f = `Name eq ${literal(nome)}`;
    const r = await http<{ value: any[] }>('GET', `DocumentTemplates?$filter=${encodeURIComponent(f)}&$select=Id,Name`);
    const m = (r.value ?? [])[0];
    if (m) modelos[chave] = m.Id; else faltando.push(`modelo "${nome}"`);
  }
  // Campo por nome: a chave muda de conta para conta. Opcional que falta não trava a tela (campoDisponivel).
  for (const [chave, def] of Object.entries(CAMPOS) as [string, any][]) {
    if (!def.porNome) continue;
    const f = `EntityId eq ${def.porNome.entidade} and Name eq ${literal(def.porNome.nome)}`;
    const r = await http<{ value: any[] }>('GET', `Fields?$filter=${encodeURIComponent(f)}&$select=Key,TypeId`);
    CHAVES[chave] = (r.value ?? [])[0]?.Key ?? '';
    if (!CHAVES[chave] && !def.opcional) faltando.push(`campo "${def.porNome.nome}"`);
  }
  for (const [chave, def] of Object.entries(CAMPOS) as [string, any][]) {
    if (!def.opcoes || !chaveDo(chave)) continue;
    const f = `Key eq ${literal(chaveDo(chave))}`;
    const r = await http<{ value: any[] }>('GET', `Fields?$filter=${encodeURIComponent(f)}&$select=Key,OptionsTableId`);
    const tabela = (r.value ?? [])[0]?.OptionsTableId;
    if (!tabela) { faltando.push(`tabela de opções do campo ${chaveDo(chave)}`); continue; }
    opcoesPorCampo[chave] = await opcoesDaTabela(tabela);
  }
  if (faltando.length) throw new ErroConfiguracao(faltando);
  iniciado = true;
}

function exigirInicio(): void { if (!iniciado) throw new ErroApi(0, 'Chame iniciar() antes de usar a API da tela.'); }
export function idFunil(chave: string): number { exigirInicio(); const f = funis[chave]; if (!f) throw new ErroApi(0, `Funil desconhecido: ${chave}`); return f.id; }
export function idEtapa(funil: string, etapa: string): number { const id = funis[funil]?.etapas[etapa]; if (id === undefined) throw new ErroApi(0, `Etapa desconhecida: ${funil}.${etapa}`); return id; }
export function etapasDoFunil(funil: string): Etapa[] { idFunil(funil); return funis[funil].ordem; }
export function regrasDoFunil(funil: string): RegrasDoFunil { idFunil(funil); return funis[funil].regras; }
export function textosDoFunil(funil: string): TextosDoFunil { idFunil(funil); return funis[funil].textos; }
export function idModelo(chave: string): number { exigirInicio(); const id = modelos[chave]; if (id === undefined) throw new ErroApi(0, `Modelo desconhecido: ${chave}`); return id; }
export function opcoes(campo: ChaveCampo): { id: number; nome: string }[] { exigirInicio(); return opcoesPorCampo[campo as string] ?? []; }
/** O campo existe nesta conta? Falso para campo por nome opcional que a conta ainda não tem. */
export function campoDisponivel(campo: ChaveCampo): boolean { exigirInicio(); return !!chaveDo(campo as string); }
export function idOpcao(campo: ChaveCampo, nome: string): number { const o = opcoes(campo).find((x) => norm(x.nome) === norm(nome)); if (!o) throw new ErroApi(0, `Opção "${nome}" não existe no campo ${String(campo)}`); return o.id; }

// ---- Campos personalizados (OtherProperties)
/** Lê o valor de um campo personalizado de um registro que veio com OtherProperties. */
export function ler(registro: any, campo: ChaveCampo): any {
  const def: any = CAMPOS[campo];
  const achados = (registro?.OtherProperties ?? []).filter((x: any) => (x.FieldKey ?? '').toLowerCase() === chaveDo(campo as string).toLowerCase());
  const valor = (x: any) => x?.[def.coluna] ?? x?.ObjectValueId ?? (/ValueId$/.test(def.coluna) ? x?.IntegerValue : undefined) ?? null;
  return def.multiplo ? achados.map(valor) : valor(achados[0]);
}
/** Nome de exibição de um campo de opção, cliente, usuário ou produto. */
export function lerNome(registro: any, campo: ChaveCampo): string {
  const x = (registro?.OtherProperties ?? []).find((y: any) => (y.FieldKey ?? '').toLowerCase() === chaveDo(campo as string).toLowerCase());
  return x?.ObjectValueName ?? x?.ContactValueName ?? x?.UserValueName ?? x?.ProductValueName ?? x?.StringValue ?? '';
}
function montarOutros(valores: Partial<Record<ChaveCampo, unknown>> | undefined, permitidos: readonly string[]): any[] {
  const out: any[] = [];
  for (const [chave, v] of Object.entries(valores ?? {})) {
    if (!permitidos.includes(chave)) throw new ErroApi(0, `Campo não combinado para esta escrita: ${chave}`);
    const def: any = (CAMPOS as any)[chave];
    if (!chaveDo(chave)) throw new ErroApi(0, `O campo ${def.porNome?.nome ?? chave} não existe nesta conta.`);
    const lista = def.multiplo && Array.isArray(v) ? v : [v];
    for (const item of lista) out.push({ FieldKey: chaveDo(chave), [def.coluna]: item instanceof Date ? item.toISOString() : (item ?? null) });
  }
  return out;
}
function conferirNativos(nativos: Record<string, unknown> | undefined, permitidos: readonly string[]): Record<string, unknown> {
  for (const k of Object.keys(nativos ?? {})) if (!permitidos.includes(k)) throw new ErroApi(0, `Propriedade não combinada para esta escrita: ${k}`);
  return { ...(nativos ?? {}) };
}

// ---- Leituras
/** DealsPipelines — paginação por cursor (Id), 100 por página. */
export async function funisDaConta(p: Record<string, never> = {}, cursor = 0): Promise<Pagina<any>> {
  void p;
  const base = ``;
  const filtro = base ? `(${base}) and Id gt ${cursor}` : `Id gt ${cursor}`;
  const q = `$select=Id,Name,MustPassAllStages,ForbiddenStageReturn,WinDealOnLastStage&$expand=Stages($select=Id,Name,Ordination)` + (filtro ? `&$filter=${encodeURIComponent(filtro)}` : '') + `&$orderby=Id&$top=100`;
  const itens = (await http<{ value: any[] }>('GET', `DealsPipelines?${q}`)).value ?? [];
  return { itens, proximoCursor: itens.length === 100 ? itens[itens.length - 1].Id : null };
}

/** Deals — agregado no servidor ($apply): uma linha por grupo (PipelineId, StageId), sem paginação. */
export async function abertosPorEtapa(p: Record<string, never> = {}): Promise<any[]> {
  void p;
  const base = `StatusId eq 1`;
  const apply = (base ? `filter(${base})/` : '') + `groupby((PipelineId,StageId),aggregate($count as Quantidade,Amount with sum as Valor,DaysInStage with average as DiasMedios))`;
  const linhas = (await http<{ value: any[] }>('GET', `Deals?$apply=${encodeURIComponent(apply)}`)).value ?? [];
  return linhas.map(({ ['@odata.id']: _id, ...r }) => r);
}

/** Deals — agregado no servidor ($apply): uma linha por grupo (PipelineId, StageId), sem paginação. */
export async function abertosPorEtapaDoResponsavel(p: { responsavelId: number }): Promise<any[]> {
  void p;
  const base = `StatusId eq 1 and OwnerId eq ${literal(p.responsavelId)}`;
  const apply = (base ? `filter(${base})/` : '') + `groupby((PipelineId,StageId),aggregate($count as Quantidade,Amount with sum as Valor,DaysInStage with average as DiasMedios))`;
  const linhas = (await http<{ value: any[] }>('GET', `Deals?$apply=${encodeURIComponent(apply)}`)).value ?? [];
  return linhas.map(({ ['@odata.id']: _id, ...r }) => r);
}

/** Deals — agregado no servidor ($apply): uma linha por grupo (PipelineId, StageId, StatusId), sem paginação. */
export async function fechadosPorEtapa(p: { desde: Date | string }): Promise<any[]> {
  void p;
  const base = `StatusId ne 1 and FinishDate ge ${literal(p.desde)}`;
  const apply = (base ? `filter(${base})/` : '') + `groupby((PipelineId,StageId,StatusId),aggregate($count as Quantidade,Amount with sum as Valor))`;
  const linhas = (await http<{ value: any[] }>('GET', `Deals?$apply=${encodeURIComponent(apply)}`)).value ?? [];
  return linhas.map(({ ['@odata.id']: _id, ...r }) => r);
}

/** Deals — agregado no servidor ($apply): uma linha por grupo (PipelineId, StageId, StatusId), sem paginação. */
export async function fechadosPorEtapaDoResponsavel(p: { desde: Date | string; responsavelId: number }): Promise<any[]> {
  void p;
  const base = `StatusId ne 1 and FinishDate ge ${literal(p.desde)} and OwnerId eq ${literal(p.responsavelId)}`;
  const apply = (base ? `filter(${base})/` : '') + `groupby((PipelineId,StageId,StatusId),aggregate($count as Quantidade,Amount with sum as Valor))`;
  const linhas = (await http<{ value: any[] }>('GET', `Deals?$apply=${encodeURIComponent(apply)}`)).value ?? [];
  return linhas.map(({ ['@odata.id']: _id, ...r }) => r);
}

/** DealsStagesHistory — agregado no servidor ($apply): uma linha por grupo (StageId, Advanced, Won, Lost), sem paginação. */
export async function passagensPorEtapa(p: { desde: Date | string }): Promise<any[]> {
  void p;
  const base = `CreateDate ge ${literal(p.desde)} and StageId ne 1`;
  const apply = (base ? `filter(${base})/` : '') + `groupby((StageId,Advanced,Won,Lost),aggregate($count as Quantidade,Days with average as DiasMedios))`;
  const linhas = (await http<{ value: any[] }>('GET', `DealsStagesHistory?$apply=${encodeURIComponent(apply)}`)).value ?? [];
  return linhas.map(({ ['@odata.id']: _id, ...r }) => r);
}

/** DealsStagesHistory — agregado no servidor ($apply): uma linha por grupo (StageId, Advanced, Won, Lost), sem paginação. */
export async function passagensPorEtapaDoResponsavel(p: { desde: Date | string; responsavelId: number }): Promise<any[]> {
  void p;
  const base = `CreateDate ge ${literal(p.desde)} and StageId ne 1 and Deal/OwnerId eq ${literal(p.responsavelId)}`;
  const apply = (base ? `filter(${base})/` : '') + `groupby((StageId,Advanced,Won,Lost),aggregate($count as Quantidade,Days with average as DiasMedios))`;
  const linhas = (await http<{ value: any[] }>('GET', `DealsStagesHistory?$apply=${encodeURIComponent(apply)}`)).value ?? [];
  return linhas.map(({ ['@odata.id']: _id, ...r }) => r);
}

/** Deals — paginação por cursor (Id), 30 por página. */
export async function negociosDaEtapa(p: { etapaId: number }, cursor = 0): Promise<Pagina<any>> {
  void p;
  const base = `StageId eq ${literal(p.etapaId)} and StatusId eq 1`;
  const filtro = base ? `(${base}) and Id gt ${cursor}` : `Id gt ${cursor}`;
  const q = `$select=Id,Title,Amount,DaysInStage,StageId,OwnerId&$expand=Contact($select=Id,Name),Owner($select=Id,Name)` + (filtro ? `&$filter=${encodeURIComponent(filtro)}` : '') + `&$orderby=Id&$top=30`;
  const itens = (await http<{ value: any[] }>('GET', `Deals?${q}`)).value ?? [];
  return { itens, proximoCursor: itens.length === 30 ? itens[itens.length - 1].Id : null };
}

/** Deals — paginação por cursor (Id), 30 por página. */
export async function negociosDaEtapaDoResponsavel(p: { etapaId: number; responsavelId: number }, cursor = 0): Promise<Pagina<any>> {
  void p;
  const base = `StageId eq ${literal(p.etapaId)} and StatusId eq 1 and OwnerId eq ${literal(p.responsavelId)}`;
  const filtro = base ? `(${base}) and Id gt ${cursor}` : `Id gt ${cursor}`;
  const q = `$select=Id,Title,Amount,DaysInStage,StageId,OwnerId&$expand=Contact($select=Id,Name),Owner($select=Id,Name)` + (filtro ? `&$filter=${encodeURIComponent(filtro)}` : '') + `&$orderby=Id&$top=30`;
  const itens = (await http<{ value: any[] }>('GET', `Deals?${q}`)).value ?? [];
  return { itens, proximoCursor: itens.length === 30 ? itens[itens.length - 1].Id : null };
}

/** Automations — paginação por cursor (Id), 200 por página. */
export async function automacoes(p: Record<string, never> = {}, cursor = 0): Promise<Pagina<any>> {
  void p;
  const base = ``;
  const filtro = base ? `(${base}) and Id gt ${cursor}` : `Id gt ${cursor}`;
  const q = `$select=Id,Name,EntityId,TriggerId,TriggerDealStageId,Enabled,DisabledDueToError,LastRunTime&$expand=Actions($select=Id,ActionId,DealStageId,FieldKey,ShouldGenerateDocument,TaskDaysFromNow)` + (filtro ? `&$filter=${encodeURIComponent(filtro)}` : '') + `&$orderby=Id&$top=200`;
  const itens = (await http<{ value: any[] }>('GET', `Automations?${q}`)).value ?? [];
  return { itens, proximoCursor: itens.length === 200 ? itens[itens.length - 1].Id : null };
}

/** AutomationsTriggers — paginação por cursor (Id), 100 por página. */
export async function gatilhos(p: Record<string, never> = {}, cursor = 0): Promise<Pagina<any>> {
  void p;
  const base = ``;
  const filtro = base ? `(${base}) and Id gt ${cursor}` : `Id gt ${cursor}`;
  const q = `$select=Id,Name` + (filtro ? `&$filter=${encodeURIComponent(filtro)}` : '') + `&$orderby=Id&$top=100`;
  const itens = (await http<{ value: any[] }>('GET', `AutomationsTriggers?${q}`)).value ?? [];
  return { itens, proximoCursor: itens.length === 100 ? itens[itens.length - 1].Id : null };
}

/** AutomationsActionsActions — paginação por cursor (Id), 100 por página. */
export async function tiposDeAcao(p: Record<string, never> = {}, cursor = 0): Promise<Pagina<any>> {
  void p;
  const base = ``;
  const filtro = base ? `(${base}) and Id gt ${cursor}` : `Id gt ${cursor}`;
  const q = `$select=Id,Name` + (filtro ? `&$filter=${encodeURIComponent(filtro)}` : '') + `&$orderby=Id&$top=100`;
  const itens = (await http<{ value: any[] }>('GET', `AutomationsActionsActions?${q}`)).value ?? [];
  return { itens, proximoCursor: itens.length === 100 ? itens[itens.length - 1].Id : null };
}

/** Checklists — paginação por cursor (Id), 200 por página. */
export async function checklists(p: Record<string, never> = {}, cursor = 0): Promise<Pagina<any>> {
  void p;
  const base = ``;
  const filtro = base ? `(${base}) and Id gt ${cursor}` : `Id gt ${cursor}`;
  const q = `$select=Id,Name,DealStageId&$expand=Fields($select=Id,Name,Required)` + (filtro ? `&$filter=${encodeURIComponent(filtro)}` : '') + `&$orderby=Id&$top=200`;
  const itens = (await http<{ value: any[] }>('GET', `Checklists?${q}`)).value ?? [];
  return { itens, proximoCursor: itens.length === 200 ? itens[itens.length - 1].Id : null };
}

/** DocumentTemplates — paginação por cursor (Id), 200 por página. */
export async function modelosDeDocumento(p: Record<string, never> = {}, cursor = 0): Promise<Pagina<any>> {
  void p;
  const base = ``;
  const filtro = base ? `(${base}) and Id gt ${cursor}` : `Id gt ${cursor}`;
  const q = `$select=Id,Name,EntityId` + (filtro ? `&$filter=${encodeURIComponent(filtro)}` : '') + `&$orderby=Id&$top=200`;
  const itens = (await http<{ value: any[] }>('GET', `DocumentTemplates?${q}`)).value ?? [];
  return { itens, proximoCursor: itens.length === 200 ? itens[itens.length - 1].Id : null };
}

/** Webhooks — paginação por cursor (Id), 200 por página. */
export async function webhooks(p: Record<string, never> = {}, cursor = 0): Promise<Pagina<any>> {
  void p;
  const base = ``;
  const filtro = base ? `(${base}) and Id gt ${cursor}` : `Id gt ${cursor}`;
  const q = `$select=Id,Name,EntityId,ActionId,Active,IsNativeIntegration` + (filtro ? `&$filter=${encodeURIComponent(filtro)}` : '') + `&$orderby=Id&$top=200`;
  const itens = (await http<{ value: any[] }>('GET', `Webhooks?${q}`)).value ?? [];
  return { itens, proximoCursor: itens.length === 200 ? itens[itens.length - 1].Id : null };
}

/** WebhooksActions — paginação por cursor (Id), 100 por página. */
export async function acoesDeWebhook(p: Record<string, never> = {}, cursor = 0): Promise<Pagina<any>> {
  void p;
  const base = ``;
  const filtro = base ? `(${base}) and Id gt ${cursor}` : `Id gt ${cursor}`;
  const q = `$select=Id,Name` + (filtro ? `&$filter=${encodeURIComponent(filtro)}` : '') + `&$orderby=Id&$top=100`;
  const itens = (await http<{ value: any[] }>('GET', `WebhooksActions?${q}`)).value ?? [];
  return { itens, proximoCursor: itens.length === 100 ? itens[itens.length - 1].Id : null };
}

/** AccountIntegrations — paginação por cursor (Id), 100 por página. */
export async function integracoesDaConta(p: Record<string, never> = {}, cursor = 0): Promise<Pagina<any>> {
  void p;
  const base = ``;
  const filtro = base ? `(${base}) and Id gt ${cursor}` : `Id gt ${cursor}`;
  const q = `$select=Id,IntegrationId,Enabled,StatusId` + (filtro ? `&$filter=${encodeURIComponent(filtro)}` : '') + `&$orderby=Id&$top=100`;
  const itens = (await http<{ value: any[] }>('GET', `AccountIntegrations?${q}`)).value ?? [];
  return { itens, proximoCursor: itens.length === 100 ? itens[itens.length - 1].Id : null };
}

/** Integrations — paginação por cursor (Id), 200 por página. */
export async function catalogoDeIntegracoes(p: Record<string, never> = {}, cursor = 0): Promise<Pagina<any>> {
  void p;
  const base = ``;
  const filtro = base ? `(${base}) and Id gt ${cursor}` : `Id gt ${cursor}`;
  const q = `$select=Id,Name` + (filtro ? `&$filter=${encodeURIComponent(filtro)}` : '') + `&$orderby=Id&$top=200`;
  const itens = (await http<{ value: any[] }>('GET', `Integrations?${q}`)).value ?? [];
  return { itens, proximoCursor: itens.length === 200 ? itens[itens.length - 1].Id : null };
}

/** Users — paginação por cursor (Id), 100 por página. */
export async function usuarios(p: Record<string, never> = {}, cursor = 0): Promise<Pagina<any>> {
  void p;
  const base = `Suspended ne true`;
  const filtro = base ? `(${base}) and Id gt ${cursor}` : `Id gt ${cursor}`;
  const q = `$select=Id,Name` + (filtro ? `&$filter=${encodeURIComponent(filtro)}` : '') + `&$orderby=Id&$top=100`;
  const itens = (await http<{ value: any[] }>('GET', `Users?${q}`)).value ?? [];
  return { itens, proximoCursor: itens.length === 100 ? itens[itens.length - 1].Id : null };
}

/** Account — paginação por cursor (Id), 1 por página. */
export async function contaComAsIs(p: Record<string, never> = {}, cursor = 0): Promise<Pagina<any>> {
  void p;
  const base = ``;
  const filtro = base ? `(${base}) and Id gt ${cursor}` : `Id gt ${cursor}`;
  const q = `$select=Id,Name&$expand=OtherProperties` + (filtro ? `&$filter=${encodeURIComponent(filtro)}` : '') + `&$orderby=Id&$top=1`;
  const itens = (await http<{ value: any[] }>('GET', `Account?${q}`)).value ?? [];
  return { itens, proximoCursor: itens.length === 1 ? itens[itens.length - 1].Id : null };
}

// ---- Escritas e ações
/** PATCH Account({id}) — nativos: —; campos: asIs */
export async function salvarAsIs(id: number, dados: { nativos?: Record<string, unknown>; campos?: Partial<Record<ChaveCampo, unknown>> }): Promise<void> {
  const corpo: any = conferirNativos(dados.nativos, []);
  const outros = montarOutros(dados.campos, ["asIs"]);
  if (outros.length) corpo.OtherProperties = outros;
  await http('PATCH', `Account(${id})`, corpo);
}

// ---- Checklists (sempre gerados quando a tela usa Deals — boas práticas do construtor)
const COLUNA_POR_TYPEID: Record<number, string> = { 1: 'StringValue', 2: 'BigStringValue', 4: 'IntegerValue', 5: 'DecimalValue', 6: 'DecimalValue', 7: 'IntegerValue', 8: 'DateTimeValue', 9: 'DateTimeValue', 10: 'BoolValue', 11: 'StringValue', 12: 'StringValue', 13: 'DecimalValue', 17: 'StringValue', 18: 'StringValue', 19: 'IntegerValue', 20: 'StringValue', 21: 'StringValue', 22: 'BigStringValue', 23: 'DecimalValue', 24: 'StringValue' };
export type ItemDeChecklist = { nome: string; obrigatorio: boolean; fieldKey: string;
  /** De quem é o campo: do negócio ou do cliente do negócio. A gravação vai para o lugar certo sozinha. */ entidade: 'negocio' | 'cliente'; contatoId: number | null; typeId: number | null; coluna: string | null; valor: any; nomeDoValor: string; preenchido: boolean;
  /** Veredito do servidor (ValidateChecklist): o item bloqueia avanço e ganho. Use este, não `preenchido`. */ pendente: boolean; opcoes: { id: number; nome: string }[] | null };
export type Checklist = { id: number; nome: string; itens: ItemDeChecklist[] };
export type Validacao = { valido: boolean; pendentes: string[]; chavesPendentes: string[]; bruto: unknown };
const camposDeChecklist: Record<string, { typeId: number; nome: string; opcoes: { id: number; nome: string }[] | null }> = {};

async function metadadosDosCampos(chaves: string[]): Promise<void> {
  const faltam = [...new Set(chaves.map((k) => k.toLowerCase()))].filter((k) => !camposDeChecklist[k]);
  for (let i = 0; i < faltam.length; i += 20) {
    const f = faltam.slice(i, i + 20).map((k) => `Key eq ${literal(k)}`).join(' or ');
    const r = await http<{ value: any[] }>('GET', `Fields?$filter=${encodeURIComponent(f)}&$select=Key,Name,TypeId,OptionsTableId`);
    for (const c of r.value ?? []) {
      let opcoes: { id: number; nome: string }[] | null = null;
      if (c.OptionsTableId) {
        opcoes = await opcoesDaTabela(c.OptionsTableId);
      }
      camposDeChecklist[String(c.Key).toLowerCase()] = { typeId: c.TypeId, nome: c.Name, opcoes };
    }
  }
}

/** Checklists da etapa atual do negócio, com o valor atual de cada item já lido na coluna certa.
 *  Mostre-os sempre: o cliente pode criar checklist depois que a tela existir. */
export async function checklistsDaEtapa(dealId: number): Promise<Checklist[]> {
  // Pela API pública os itens (Fields) só vêm com $expand — conferido na API real em 2026-09-30.
  const EXPANDIR = '$expand=Fields($expand=Field($select=Id,Key,Name,TypeId))';
  let r: any;
  try { r = await http('GET', `Deals(${dealId})/GetApplicableChecklists?${EXPANDIR}`); }
  catch (e: any) { if (e?.status !== 400) throw e; r = await http('GET', `Deals(${dealId})/GetApplicableChecklists`); }
  const lista: any[] = Array.isArray(r) ? r : r?.value ?? [];
  for (const c of lista) {
    if (Array.isArray(c.Fields)) continue;
    // A função não aceitou o $expand: busca os itens pelo próprio checklist.
    const x = await http<{ value: any[] }>('GET', `Checklists?$filter=Id eq ${c.Id}&$select=Id&${EXPANDIR}`);
    c.Fields = (x.value ?? [])[0]?.Fields ?? [];
  }
  const brutos = lista.map((c: any) => ({ id: c.Id, nome: c.Name ?? '', itens: (c.Fields ?? c.Items ?? []).slice().sort((a: any, b: any) => (a.Ordination ?? 0) - (b.Ordination ?? 0)) }));
  const chaves = brutos.flatMap((c) => c.itens.map((i: any) => i.FieldKey).filter(Boolean));
  if (!chaves.length) return brutos.map((c) => ({ id: c.id, nome: c.nome, itens: [] }));
  for (const c of brutos) for (const i of c.itens) {
    // GetApplicableChecklists já traz Field.TypeId: guarda para não consultar /Fields à toa
    const k = String(i.FieldKey).toLowerCase();
    if (i.Field?.TypeId && !camposDeChecklist[k] && i.Field.TypeId !== 7) camposDeChecklist[k] = { typeId: i.Field.TypeId, nome: i.Field.Name ?? i.Name, opcoes: null };
  }
  await metadadosDosCampos(chaves);
  const validacao = await validarChecklist(dealId);
  // O item pode apontar para campo do NEGÓCIO (deal_…) ou do CLIENTE do negócio (contact_…): lê de cada um.
  const d = await http<{ value: any[] }>('GET', `Deals?$filter=Id eq ${dealId}&$select=Id,ContactId&$expand=OtherProperties,Contact($select=Id;$expand=OtherProperties)&$top=1`);
  const negocio = (d.value ?? [])[0] ?? {};
  return brutos.map((c) => ({ id: c.id, nome: c.nome, itens: c.itens.map((i: any) => {
    const meta = camposDeChecklist[String(i.FieldKey).toLowerCase()];
    const coluna = meta ? COLUNA_POR_TYPEID[meta.typeId] ?? null : null;
    const entidade: 'negocio' | 'cliente' = String(i.FieldKey).toLowerCase().startsWith('contact_') ? 'cliente' : 'negocio';
    const outros: any[] = (entidade === 'cliente' ? negocio.Contact?.OtherProperties : negocio.OtherProperties) ?? [];
    const op = outros.find((x) => String(x.FieldKey).toLowerCase() === String(i.FieldKey).toLowerCase());
    const valor = op && coluna ? op[coluna] ?? (meta?.typeId === 7 ? op.ObjectValueId : null) ?? null : null;
    const nomeDoValor = op?.ObjectValueName ?? op?.ContactValueName ?? op?.UserValueName ?? op?.ProductValueName ?? (valor ?? '').toString();
    return { nome: i.Name ?? meta?.nome ?? i.FieldKey, obrigatorio: i.Required !== false, fieldKey: i.FieldKey, entidade, contatoId: negocio.ContactId ?? null, typeId: meta?.typeId ?? null, coluna, valor,
      nomeDoValor, preenchido: valor !== null && valor !== undefined && valor !== '',
      pendente: validacao.chavesPendentes.includes(String(i.FieldKey).toLowerCase()), opcoes: meta?.opcoes ?? null };
  }) }));
}

/** Grava o valor de um item de checklist da etapa atual. Recusa campo que não esteja num checklist aplicável. */
export async function salvarItemDoChecklist(dealId: number, fieldKey: string, valor: unknown): Promise<void> {
  const aplicaveis = await checklistsDaEtapa(dealId);
  const item = aplicaveis.flatMap((c) => c.itens).find((i) => i.fieldKey.toLowerCase() === fieldKey.toLowerCase());
  if (!item) throw new ErroApi(0, `O campo ${fieldKey} não está nos checklists desta etapa.`);
  if (!item.coluna) throw new ErroApi(0, `Tipo do campo ${fieldKey} desconhecido — não dá para gravar com segurança.`);
  const corpo = { OtherProperties: [{ FieldKey: item.fieldKey, [item.coluna]: valor instanceof Date ? valor.toISOString() : (valor ?? null) }] };
  if (item.entidade === 'cliente') {
    if (!item.contatoId) throw new ErroApi(0, 'Este item é do cliente, mas o negócio não tem cliente vinculado.');
    await http('PATCH', `Contacts(${item.contatoId})`, corpo);   // o campo é do cliente do negócio
  } else {
    await http('PATCH', `Deals(${dealId})`, corpo);
  }
}

/** Valida os checklists obrigatórios — libere "Ganhar" e o avanço de etapa só quando `valido`.
 *  Formato real (conferido na API em 2026-09-30): `value` é a LISTA dos itens pendentes
 *  (ChecklistField: Id, Name, FieldKey, Required…); lista vazia = válido. */
export async function validarChecklist(dealId: number): Promise<Validacao> {
  const r: any = await http('GET', `Deals(${dealId})/ValidateChecklist`);
  const lista: any[] = Array.isArray(r?.value) ? r.value : Array.isArray(r) ? r : [];
  return { valido: lista.length === 0, pendentes: lista.map((p: any) => p?.Name ?? p?.FieldKey ?? String(p)),
    chavesPendentes: lista.map((p: any) => String(p?.FieldKey ?? '').toLowerCase()).filter(Boolean), bruto: r };
}

