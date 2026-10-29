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
