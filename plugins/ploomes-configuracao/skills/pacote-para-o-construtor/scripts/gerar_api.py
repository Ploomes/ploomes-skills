#!/usr/bin/env python3
"""Gera o api.ts de uma tela a partir do contrato-de-dados.json.

Uso: python gerar_api.py <contrato-de-dados.json> <saida/api.ts>

Nenhum modelo escreve a camada de dados: ela sai daqui, igual para toda tela.
O arquivo gerado leva no cabeçalho o hash do contrato — o validar_pacote.py
recusa api.ts que não tenha saído do contrato atual.
"""
import hashlib
import json
import re
import sys
from pathlib import Path

# TypeId -> coluna do valor em OtherProperties (api-docs, 07-fields-and-entities).
COLUNA_POR_TYPEID = {
    1: "StringValue", 2: "BigStringValue", 4: "IntegerValue", 5: "DecimalValue",
    6: "DecimalValue", 7: "IntegerValue", 8: "DateTimeValue", 9: "DateTimeValue",
    10: "BoolValue", 11: "StringValue", 12: "StringValue", 13: "DecimalValue",
    17: "StringValue", 18: "StringValue", 19: "IntegerValue", 20: "StringValue",
    21: "StringValue", 22: "BigStringValue", 23: "DecimalValue", 24: "StringValue",
}
TIPO_TS = {"number": "number", "string": "string", "date": "Date | string", "boolean": "boolean"}
ACOES_GET = {"ValidateChecklist", "GetApplicableChecklists"}
MARCADOR = re.compile(r"\{(funil|etapa|modelo|opcao|param|campo):([^}]+)\}|\{usuario\}")


MODELO_CONEXAO = Path(__file__).resolve().parent / "modelos" / "useConexao.ts"


def hash_contrato(texto: str) -> str:
    return hashlib.sha256(texto.encode("utf-8")).hexdigest()[:16]


def js(valor) -> str:
    return json.dumps(valor, ensure_ascii=False)


def filtro_ts(filtro: str, campos: dict) -> str:
    """Converte o filtro com marcadores numa template string TS."""
    partes, pos = [], 0
    for m in MARCADOR.finditer(filtro):
        partes.append(filtro[pos:m.start()].replace("\\", "\\\\").replace("`", "\\`").replace("${", "\\${"))
        tipo, arg = m.group(1), m.group(2)
        if m.group(0) == "{usuario}":
            partes.append("${usuarioAtual()}")
        elif tipo == "funil":
            partes.append(f"${{idFunil({js(arg)})}}")
        elif tipo == "etapa":
            f, e = arg.split(".", 1)
            partes.append(f"${{idEtapa({js(f)}, {js(e)})}}")
        elif tipo == "modelo":
            partes.append(f"${{idModelo({js(arg)})}}")
        elif tipo == "opcao":
            c, o = arg.split(".", 1)
            partes.append(f"${{idOpcao({js(c)}, {js(o)})}}")
        elif tipo == "param":
            partes.append(f"${{literal(p.{arg})}}")
        elif tipo == "campo":
            partes.append("'" + campos[arg]["fieldKey"] + "'")
        pos = m.end()
    partes.append(filtro[pos:].replace("\\", "\\\\").replace("`", "\\`").replace("${", "\\${"))
    return "`" + "".join(partes) + "`"


def gerar(contrato: dict, h: str) -> str:
    campos = contrato.get("campos", {})
    funis = contrato.get("funis", {})
    modelos = contrato.get("modelos", {})
    leituras = contrato.get("leituras", {})
    escritas = contrato.get("escritas", {})
    usa_deals = any(x.get("rota") == "Deals" for x in list(leituras.values()) + list(escritas.values()))

    defs_campos = {}
    for chave, c in campos.items():
        coluna = c.get("coluna") or COLUNA_POR_TYPEID.get(c.get("typeId"))
        defs_campos[chave] = {"fieldKey": c.get("fieldKey", ""), "coluna": coluna,
                              "multiplo": bool(c.get("multiplo")), "opcoes": bool(c.get("opcoes"))}
        if c.get("porNome"):
            # a chave muda de conta para conta: sai do iniciar(), pelo nome (2026-10-20)
            defs_campos[chave]["porNome"] = {"entidade": c["porNome"]["entidade"], "nome": c["porNome"]["nome"]}
            defs_campos[chave]["opcional"] = bool(c.get("opcional"))

    L = []
    w = L.append
    w(f"// GERADO por gerar_api.py a partir de contrato-de-dados.json (contrato {h}).")
    w("// NÃO EDITE À MÃO: mude o contrato e gere de novo. Toda chamada à API do Ploomes passa por aqui.")
    w(f"// Tela: {contrato['tela']['nome']}")
    w("/* eslint-disable */")
    w("")
    w("export type Contexto = { apiUrl: string; userKey: string; userId: number };")
    w("export type Pagina<T> = { itens: T[]; proximoCursor: number | null };")
    w("")
    w("export class ErroApi extends Error {")
    w("  status: number;")
    w("  constructor(status: number, mensagem: string) { super(mensagem); this.name = 'ErroApi'; this.status = status; }")
    w("}")
    w("export class ErroConfiguracao extends Error {")
    w("  faltando: string[];")
    w("  constructor(faltando: string[]) {")
    w("    super('A conta não tem o que esta tela precisa: ' + faltando.join('; ') + '.');")
    w("    this.name = 'ErroConfiguracao';")
    w("    this.faltando = faltando;")
    w("  }")
    w("}")
    w("")
    w("let ctx: Contexto | null = null;")
    w("")
    w("/** Chame com o config que a ponte (@ploomescrm/bridge) entregou no host:init:")
    w(" *  configurar({ apiUrl: config.apiUrls.apiUrl, userKey: config.userKey, userId: config.userId }) */")
    w("export function configurar(c: Contexto): void {")
    w("  if (!c?.apiUrl || !c?.userKey) throw new ErroApi(0, 'Configuração da conta indisponível.');")
    w("  ctx = { ...c, apiUrl: c.apiUrl.endsWith('/') ? c.apiUrl : c.apiUrl + '/' };")
    w("}")
    w("export function usuarioAtual(): number {")
    w("  if (!ctx) throw new ErroApi(0, 'Sem conexão com a conta.');")
    w("  return ctx.userId;")
    w("}")
    w("")
    w("// Mensagens reais da API (vistas em 2026-09-30). O Ploomes usa 401 também para regra de negócio.")
    w("const MENSAGENS: [RegExp, string][] = [")
    w("  [/pending checklist/i, 'Há item obrigatório do checklist pendente nesta etapa.'],")
    w("  [/MayWinDeals is false/i, 'Este funil não permite ganhar.'],")
    w("  [/MayLoseDeals is false/i, 'Este funil não permite perder.'],")
    w("  [/permission|permiss/i, 'Seu perfil não tem permissão para esta ação.'],")
    w("];")
    w("")
    w("function traduzir(status: number, msg: string): string {")
    w("  for (const [re, pt] of MENSAGENS) if (re.test(msg)) return pt;")
    w("  if (status === 401 || status === 403) return 'Seu perfil não tem permissão para esta ação.' + (msg ? ' (' + msg + ')' : '');")
    w("  if (status === 404) return 'Registro não encontrado. Ele pode ter sido excluído.';")
    w("  if (status === 429) return 'Muitas requisições em pouco tempo. Tente de novo em instantes.';")
    w("  if (status >= 500) return 'O Ploomes não respondeu como esperado. Tente de novo.';")
    w("  return msg || 'Não foi possível concluir a operação.';")
    w("}")
    w("")
    w("async function http<T>(metodo: string, caminho: string, corpo?: unknown, tentativa = 0): Promise<T> {")
    w("  if (!ctx) throw new ErroApi(0, 'Sem conexão com a conta: a ponte do Ploomes ainda não entregou a configuração.');")
    w("  const headers: Record<string, string> = { 'User-Key': ctx.userKey, Accept: 'application/json' };")
    w("  if (corpo !== undefined) headers['Content-Type'] = 'application/json';")
    w("  let r: Response;")
    w("  try {")
    w("    r = await fetch(ctx.apiUrl + caminho, { method: metodo, headers, body: corpo === undefined ? undefined : JSON.stringify(corpo) });")
    w("  } catch (e: any) {")
    w("    // Falha antes de a API responder (rede, DNS, certificado, CORS): diga a causa em vez de \"fetch failed\".")
    w("    // Nunca repita e.message: em erro de cabeçalho ela traz o valor da User-Key.")
    w("    const cabecalho = e?.cause?.code === 'UND_ERR_INVALID_ARG' || /Headers\\.append|header/i.test(String(e?.message ?? ''));")
    w("    if (cabecalho) throw new ErroApi(0, 'A User-Key tem um caractere que não pode ir na requisição (espaço, quebra de linha ou acento).');")
    w("    throw new ErroApi(0, `Sem conexão com o Ploomes (${e?.cause?.code ?? 'erro de rede'}). Confira a rede e tente de novo.`);")
    w("  }")
    w("  if (r.status === 429 && tentativa < 3) {")
    w("    const s = Number(r.headers.get('Retry-After')) || 2 ** (tentativa + 1);")
    w("    await new Promise((ok) => setTimeout(ok, s * 1000));")
    w("    return http<T>(metodo, caminho, corpo, tentativa + 1);")
    w("  }")
    w("  if (!r.ok) {")
    w("    let msg = '';")
    w("    // A API real responde { value: \"mensagem\" }; a documentação mostra { error: { message } }. Lê os dois.")
    w("    try { const j = await r.json(); msg = j?.error?.message ?? (typeof j?.value === 'string' ? j.value : '') ?? ''; } catch { /* corpo sem JSON */ }")
    w("    throw new ErroApi(r.status, traduzir(r.status, msg));")
    w("  }")
    w("  const texto = await r.text();")
    w("  return (texto ? JSON.parse(texto) : undefined) as T;")
    w("}")
    w("")
    w("function literal(v: unknown): string {")
    w("  if (v === null || v === undefined) return 'null';")
    w("  if (v instanceof Date) return v.toISOString();")
    w("  if (typeof v === 'number' || typeof v === 'boolean') return String(v);")
    w("  return \"'\" + String(v).replace(/'/g, \"''\") + \"'\";")
    w("}")
    w("")
    # ---- definições resolvidas por nome
    w("// ---- O que a tela precisa da conta, POR NOME. Os IDs saem de iniciar().")
    # Vazio (tela genérica, que não usa funil nem modelo por nome): `{} as const` vira `{}` e o
    # Object.entries dele dá `unknown` — o tsc não compila (2026-10-20, mapa do processo).
    if funis:
        w(f"const FUNIS = {js({k: {'nome': v['nome'], 'etapas': v.get('etapas', {})} for k, v in funis.items()})} as const;")
    else:
        w("const FUNIS: Record<string, { readonly nome: string; readonly etapas: Readonly<Record<string, string>> }> = {};")
    if modelos:
        w(f"const MODELOS = {js({k: v['nome'] for k, v in modelos.items()})} as const;")
    else:
        w("const MODELOS: Record<string, string> = {};")
    if defs_campos:
        w(f"export const CAMPOS = {js(defs_campos)} as const;")
    else:
        w("export const CAMPOS: Record<string, { readonly fieldKey: string; readonly typeId: number; readonly coluna: string; readonly multiplo?: boolean; readonly opcoes?: boolean }> = {};")
    w("")
    w("export type ChaveCampo = keyof typeof CAMPOS;")
    w("/** A chave de cada campo nesta conta. Fica FORA de CAMPOS de propósito: o build minificado trata CAMPOS como")
    w(" *  constante e dobra `CAMPOS.x.fieldKey` para o valor do contrato — o campo por nome achado no iniciar() sumia")
    w(" *  (visto em 2026-10-20: campoDisponivel virou `return false`). Aqui a chave só existe em tempo de execução. */")
    w("const CHAVES: Record<string, string> = {};")
    w("for (const [k, d] of Object.entries(CAMPOS) as [string, any][]) CHAVES[k] = d.fieldKey;")
    w("function chaveDo(campo: string): string { return CHAVES[campo] ?? ''; }")
    w("/** mayWinDeals/mayLoseDeals ficam sempre true: a API pública devolve MayWinDeals=false e mesmo assim o Win passa")
    w(" *  (visto em 2026-09-30). Quem decide é o servidor no Win/Lose — mostre a mensagem do ErroApi se recusar. */")
    w("export type RegrasDoFunil = { mustPassAllStages: boolean; forbiddenStageReturn: boolean; mayWinDeals: boolean; mayLoseDeals: boolean; winDealOnLastStage: boolean };")
    w("export type Etapa = { id: number; nome: string; ordem: number };")
    w("/** Textos que a conta define para o funil — use-os na tela em vez de fixar \"Ganhar\"/\"Perder\"/\"Negócio\". */")
    w("export type TextosDoFunil = { unidade: string; unidades: string; verboGanhar: string; verboPerder: string };")
    w("type FunilResolvido = { id: number; regras: RegrasDoFunil; textos: TextosDoFunil; etapas: Record<string, number>; ordem: Etapa[] };")
    w("")
    w("const funis: Record<string, FunilResolvido> = {};")
    w("const modelos: Record<string, number> = {};")
    w("const opcoesPorCampo: Record<string, { id: number; nome: string }[]> = {};")
    w("let iniciado = false;")
    w("")
    w("/** Opções de uma tabela. Rota vista respondendo 200 em tela publicada (vista em 2026-09-30); a opção não tem ordem própria. */")
    w("async function opcoesDaTabela(tabela: number): Promise<{ id: number; nome: string }[]> {")
    w("  const o = await http<{ value: any[] }>('GET', `Fields@OptionsTables@Options?$filter=TableId eq ${tabela}&$select=Id,Name&$top=1000`);")
    w("  return (o.value ?? []).map((x: any) => ({ id: x.Id, nome: x.Name }));")
    w("}")
    w("")
    w("const norm = (s: string) => (s ?? '').normalize('NFD').replace(/[\\u0300-\\u036f]/g, '').trim().toLowerCase();")
    w("")
    w("/** Resolve funis, etapas, modelos e opções pelo nome. Chame uma vez, logo depois de configurar().")
    w(" *  Se a conta não tiver algo, lança ErroConfiguracao com a lista — mostre isso na tela, não quebre calado. */")
    w("export async function iniciar(): Promise<void> {")
    w("  iniciado = false;")
    w("  const faltando: string[] = [];")
    w("  for (const [chave, def] of Object.entries(FUNIS)) {")
    w("    const f = `Name eq ${literal(def.nome)}`;")
    w("    const r = await http<{ value: any[] }>('GET', `DealsPipelines?$filter=${encodeURIComponent(f)}&$select=Id,Name,MustPassAllStages,ForbiddenStageReturn,MayWinDeals,MayLoseDeals,WinDealOnLastStage,SingularUnitName,PluralUnitName&$expand=Stages($select=Id,Name,Ordination),WinVerb($select=Name),LoseVerb($select=Name)`);")
    w("    const p = (r.value ?? [])[0];")
    w("    if (!p) { faltando.push(`funil \"${def.nome}\"`); continue; }")
    w("    const ordem: Etapa[] = (p.Stages ?? []).map((s: any) => ({ id: s.Id, nome: s.Name, ordem: s.Ordination })).sort((a: Etapa, b: Etapa) => a.ordem - b.ordem);")
    w("    const etapas: Record<string, number> = {};")
    w("    for (const [ce, nomeEtapa] of Object.entries(def.etapas as Record<string, string>)) {")
    w("      const e = ordem.find((x) => norm(x.nome) === norm(nomeEtapa));")
    w("      if (e) etapas[ce] = e.id; else faltando.push(`etapa \"${nomeEtapa}\" no funil \"${def.nome}\"`);")
    w("    }")
    w("    funis[chave] = { id: p.Id, etapas, ordem, regras: { mustPassAllStages: !!p.MustPassAllStages, forbiddenStageReturn: !!p.ForbiddenStageReturn, mayWinDeals: true, mayLoseDeals: true, winDealOnLastStage: !!p.WinDealOnLastStage },")
    w("      textos: { unidade: p.SingularUnitName || 'Negócio', unidades: p.PluralUnitName || 'Negócios', verboGanhar: p.WinVerb?.Name || 'Ganhar', verboPerder: p.LoseVerb?.Name || 'Perder' } };")
    w("  }")
    w("  for (const [chave, nome] of Object.entries(MODELOS)) {")
    w("    const f = `Name eq ${literal(nome)}`;")
    w("    const r = await http<{ value: any[] }>('GET', `DocumentTemplates?$filter=${encodeURIComponent(f)}&$select=Id,Name`);")
    w("    const m = (r.value ?? [])[0];")
    w("    if (m) modelos[chave] = m.Id; else faltando.push(`modelo \"${nome}\"`);")
    w("  }")
    w("  // Campo por nome: a chave muda de conta para conta. Opcional que falta não trava a tela (campoDisponivel).")
    w("  for (const [chave, def] of Object.entries(CAMPOS) as [string, any][]) {")
    w("    if (!def.porNome) continue;")
    w("    const f = `EntityId eq ${def.porNome.entidade} and Name eq ${literal(def.porNome.nome)}`;")
    w("    const r = await http<{ value: any[] }>('GET', `Fields?$filter=${encodeURIComponent(f)}&$select=Key,TypeId`);")
    w("    CHAVES[chave] = (r.value ?? [])[0]?.Key ?? '';")
    w("    if (!CHAVES[chave] && !def.opcional) faltando.push(`campo \"${def.porNome.nome}\"`);")
    w("  }")
    w("  for (const [chave, def] of Object.entries(CAMPOS) as [string, any][]) {")
    w("    if (!def.opcoes || !chaveDo(chave)) continue;")
    w("    const f = `Key eq ${literal(chaveDo(chave))}`;")
    w("    const r = await http<{ value: any[] }>('GET', `Fields?$filter=${encodeURIComponent(f)}&$select=Key,OptionsTableId`);")
    w("    const tabela = (r.value ?? [])[0]?.OptionsTableId;")
    w("    if (!tabela) { faltando.push(`tabela de opções do campo ${chaveDo(chave)}`); continue; }")
    w("    opcoesPorCampo[chave] = await opcoesDaTabela(tabela);")
    w("  }")
    w("  if (faltando.length) throw new ErroConfiguracao(faltando);")
    w("  iniciado = true;")
    w("}")
    w("")
    w("function exigirInicio(): void { if (!iniciado) throw new ErroApi(0, 'Chame iniciar() antes de usar a API da tela.'); }")
    w("export function idFunil(chave: string): number { exigirInicio(); const f = funis[chave]; if (!f) throw new ErroApi(0, `Funil desconhecido: ${chave}`); return f.id; }")
    w("export function idEtapa(funil: string, etapa: string): number { const id = funis[funil]?.etapas[etapa]; if (id === undefined) throw new ErroApi(0, `Etapa desconhecida: ${funil}.${etapa}`); return id; }")
    w("export function etapasDoFunil(funil: string): Etapa[] { idFunil(funil); return funis[funil].ordem; }")
    w("export function regrasDoFunil(funil: string): RegrasDoFunil { idFunil(funil); return funis[funil].regras; }")
    w("export function textosDoFunil(funil: string): TextosDoFunil { idFunil(funil); return funis[funil].textos; }")
    w("export function idModelo(chave: string): number { exigirInicio(); const id = modelos[chave]; if (id === undefined) throw new ErroApi(0, `Modelo desconhecido: ${chave}`); return id; }")
    w("export function opcoes(campo: ChaveCampo): { id: number; nome: string }[] { exigirInicio(); return opcoesPorCampo[campo as string] ?? []; }")
    w("/** O campo existe nesta conta? Falso para campo por nome opcional que a conta ainda não tem. */")
    w("export function campoDisponivel(campo: ChaveCampo): boolean { exigirInicio(); return !!chaveDo(campo as string); }")
    w("export function idOpcao(campo: ChaveCampo, nome: string): number { const o = opcoes(campo).find((x) => norm(x.nome) === norm(nome)); if (!o) throw new ErroApi(0, `Opção \"${nome}\" não existe no campo ${String(campo)}`); return o.id; }")
    w("")
    w("// ---- Campos personalizados (OtherProperties)")
    w("/** Lê o valor de um campo personalizado de um registro que veio com OtherProperties. */")
    w("export function ler(registro: any, campo: ChaveCampo): any {")
    w("  const def: any = CAMPOS[campo];")
    w("  const achados = (registro?.OtherProperties ?? []).filter((x: any) => (x.FieldKey ?? '').toLowerCase() === chaveDo(campo as string).toLowerCase());")
    # 2026-10-09: na API real a referência (ProductValueId, ContactValueId…) pode vir em IntegerValue — só leitura; a escrita não muda
    w("  const valor = (x: any) => x?.[def.coluna] ?? x?.ObjectValueId ?? (/ValueId$/.test(def.coluna) ? x?.IntegerValue : undefined) ?? null;")
    w("  return def.multiplo ? achados.map(valor) : valor(achados[0]);")
    w("}")
    w("/** Nome de exibição de um campo de opção, cliente, usuário ou produto. */")
    w("export function lerNome(registro: any, campo: ChaveCampo): string {")
    w("  const x = (registro?.OtherProperties ?? []).find((y: any) => (y.FieldKey ?? '').toLowerCase() === chaveDo(campo as string).toLowerCase());")
    w("  return x?.ObjectValueName ?? x?.ContactValueName ?? x?.UserValueName ?? x?.ProductValueName ?? x?.StringValue ?? '';")
    w("}")
    w("function montarOutros(valores: Partial<Record<ChaveCampo, unknown>> | undefined, permitidos: readonly string[]): any[] {")
    w("  const out: any[] = [];")
    w("  for (const [chave, v] of Object.entries(valores ?? {})) {")
    w("    if (!permitidos.includes(chave)) throw new ErroApi(0, `Campo não combinado para esta escrita: ${chave}`);")
    w("    const def: any = (CAMPOS as any)[chave];")
    w("    if (!chaveDo(chave)) throw new ErroApi(0, `O campo ${def.porNome?.nome ?? chave} não existe nesta conta.`);")
    w("    const lista = def.multiplo && Array.isArray(v) ? v : [v];")
    w("    for (const item of lista) out.push({ FieldKey: chaveDo(chave), [def.coluna]: item instanceof Date ? item.toISOString() : (item ?? null) });")
    w("  }")
    w("  return out;")
    w("}")
    w("function conferirNativos(nativos: Record<string, unknown> | undefined, permitidos: readonly string[]): Record<string, unknown> {")
    w("  for (const k of Object.keys(nativos ?? {})) if (!permitidos.includes(k)) throw new ErroApi(0, `Propriedade não combinada para esta escrita: ${k}`);")
    w("  return { ...(nativos ?? {}) };")
    w("}")
    w("")

    # ---- leituras
    if leituras:
        w("// ---- Leituras")
    for nome, l in leituras.items():
        params = l.get("parametros", {})
        assin = "p: { " + "; ".join(f"{k}: {TIPO_TS[t]}" for k, t in params.items()) + " }" if params else "p: Record<string, never> = {}"
        select = ",".join(l.get("select", []) or ["Id"])
        if "Id" not in select.split(","):
            select = "Id," + select
        expand = list(l.get("expand", []))
        if l.get("outrosCampos"):
            expand.append("OtherProperties")
        ordem = l.get("ordem", "Id")
        pagina = int(l.get("pagina", 50))
        cursor = ordem == "Id"
        filtro = l.get("filtro", "")
        if l.get("agregar"):
            # Agregado no servidor ($apply, conferido na API real em 2026-10-20): uma linha por grupo,
            # sem baixar os registros. O resultado não pagina: o filtro tem de recortar o conjunto.
            ag = l["agregar"]
            medidas = ",".join(("$count" if m == "$count" else m) + f" as {alias}" for alias, m in ag["medidas"].items())
            transf = (f"groupby(({','.join(ag['por'])}),aggregate({medidas}))" if ag.get("por") else f"aggregate({medidas})")
            w(f"/** {l['rota']} — agregado no servidor ($apply): uma linha por grupo ({', '.join(ag.get('por', [])) or 'total'}), sem paginação. */")
            w(f"export async function {nome}({assin}): Promise<any[]> {{")
            w("  void p;")
            base = filtro_ts(filtro, campos) if filtro else "``"
            w(f"  const base = {base};")
            w(f"  const apply = (base ? `filter(${{base}})/` : '') + `{transf}`;")
            w(f"  const linhas = (await http<{{ value: any[] }}>('GET', `{l['rota']}?$apply=${{encodeURIComponent(apply)}}`)).value ?? [];")
            w("  return linhas.map(({ ['@odata.id']: _id, ...r }) => r);")
            w("}")
            w("")
            continue
        if l.get("umRegistro"):
            partes = [f"$select={select}"] + (["$expand=" + ",".join(expand)] if expand else [])
            w(f"/** {l['rota']} — um registro pelo Id (null se não existir ou se o perfil não puder vê-lo). */")
            w(f"export async function {nome}(id: number): Promise<any | null> {{")
            w(f"  const q = `{'&'.join(partes)}&$filter=Id eq ${{id}}&$top=1`;")
            w(f"  return ((await http<{{ value: any[] }}>('GET', `{l['rota']}?${{q}}`)).value ?? [])[0] ?? null;")
            w("}")
            w("")
            continue
        w(f"/** {l['rota']} — {'paginação por cursor (Id)' if cursor else 'página única, ordenada por ' + ordem}, {pagina} por página. */")
        w(f"export async function {nome}({assin}{', cursor = 0' if cursor else ''}): Promise<Pagina<any>> {{")
        w("  void p;")
        base = filtro_ts(filtro, campos) if filtro else "``"
        w(f"  const base = {base};")
        if cursor:
            w("  const filtro = base ? `(${base}) and Id gt ${cursor}` : `Id gt ${cursor}`;")
        else:
            w("  const filtro = base;")
        partes = [f"$select={select}"]
        if expand:
            partes.append("$expand=" + ",".join(expand))
        consulta = "&".join(partes)
        w(f"  const q = `{consulta}` + (filtro ? `&$filter=${{encodeURIComponent(filtro)}}` : '') + `&$orderby={'Id' if cursor else ordem}&$top={pagina}`;")
        w(f"  const itens = (await http<{{ value: any[] }}>('GET', `{l['rota']}?${{q}}`)).value ?? [];")
        if cursor:
            w(f"  return {{ itens, proximoCursor: itens.length === {pagina} ? itens[itens.length - 1].Id : null }};")
        else:
            w("  return { itens, proximoCursor: null };")
        w("}")
        w("")

    # ---- escritas
    if escritas or usa_deals:
        w("// ---- Escritas e ações")
    for nome, e in escritas.items():
        rota = e["rota"]
        if e.get("acao"):
            acao = e["acao"]
            metodo = "GET" if acao in ACOES_GET else "POST"
            w(f"/** {metodo} {rota}({{id}})/{acao} */")
            if metodo == "GET":
                w(f"export async function {nome}(id: number): Promise<any> {{ return http('GET', `{rota}(${{id}})/{acao}`); }}")
            else:
                w(f"export async function {nome}(id: number, corpo: Record<string, unknown> = {{}}): Promise<any> {{ return http('POST', `{rota}(${{id}})/{acao}`, corpo); }}")
            w("")
            continue
        nat = js(e.get("nativos", []))
        cps = js(e.get("campos", []))
        tipo = "{ nativos?: Record<string, unknown>; campos?: Partial<Record<ChaveCampo, unknown>> }"
        corpo = (f"  const corpo: any = conferirNativos(dados.nativos, {nat});\n"
                 f"  const outros = montarOutros(dados.campos, {cps});\n"
                 "  if (outros.length) corpo.OtherProperties = outros;")
        if e["metodo"] == "POST":
            w(f"/** POST {rota} — nativos: {', '.join(e.get('nativos', [])) or '—'}; campos: {', '.join(e.get('campos', [])) or '—'} */")
            w(f"export async function {nome}(dados: {tipo}): Promise<any> {{")
            w(corpo)
            w(f"  const r = await http<any>('POST', `{rota}`, corpo);")
            w("  return r?.value?.[0] ?? r;")
            w("}")
        else:
            w(f"/** PATCH {rota}({{id}}) — nativos: {', '.join(e.get('nativos', [])) or '—'}; campos: {', '.join(e.get('campos', [])) or '—'} */")
            w(f"export async function {nome}(id: number, dados: {tipo}): Promise<void> {{")
            w(corpo)
            w(f"  await http('PATCH', `{rota}(${{id}})`, corpo);")
            w("}")
        w("")
    if any(e.get("acao") == "Lose" for e in escritas.values()):
        w("/** Motivos de perda que valem para o funil (os do funil e os gerais). Perder exige um deles. */")
        w("export async function motivosDePerda(funil: string): Promise<{ id: number; nome: string }[]> {")
        w("  const f = `PipelineId eq ${idFunil(funil)} or PipelineId eq null`;")
        w("  const r = await http<{ value: any[] }>('GET', `DealsLossReasons?$filter=${encodeURIComponent(f)}&$select=Id,Name&$orderby=Name&$top=1000`);")
        w("  return (r.value ?? []).map((x: any) => ({ id: x.Id, nome: x.Name }));")
        w("}")
        w("")
    if usa_deals:
        w((Path(__file__).resolve().parent / "modelos" / "checklists.ts").read_text(encoding="utf-8"))
    return "\n".join(L)


def main() -> int:
    if len(sys.argv) != 3:
        print(__doc__)
        return 2
    origem, destino = Path(sys.argv[1]), Path(sys.argv[2])
    texto = origem.read_text(encoding="utf-8")
    contrato = json.loads(texto)
    destino.parent.mkdir(parents=True, exist_ok=True)
    destino.write_text(gerar(contrato, hash_contrato(texto)) + "\n", encoding="utf-8")
    # Ao lado, o hook que liga a camada de dados à ponte do construtor (usePloomesBridge).
    conexao = destino.parent / "useConexao.ts"
    conexao.write_text(MODELO_CONEXAO.read_text(encoding="utf-8"), encoding="utf-8")
    print(f"api.ts e useConexao.ts gerados em {destino.parent} (contrato {hash_contrato(texto)})")
    return 0


if __name__ == "__main__":
    sys.exit(main())
