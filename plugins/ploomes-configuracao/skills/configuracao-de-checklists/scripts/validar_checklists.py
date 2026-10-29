"""Portao do CSV de CHECKLISTS (18 colunas).

Substitui por codigo as regras que hoje vivem num prompt de 53 mil caracteres:
entidade permitida, coerencia Dynamic/FieldId, obrigatoriedade de OptionsTable
em campo de selecao, operador dentro da lista, e referencia a funil/etapa que
existem no desenho.

    python validar_checklists.py checklists.csv [--etapas etapas.csv]
"""
from __future__ import annotations

import argparse
import csv
import io
import re
import unicodedata
from collections import defaultdict
from dataclasses import dataclass
from pathlib import Path

CABECALHO = [
    "Descrição do item", "N° do Checklist", "Nome do Checklist", "Funil",
    "Etapa do funil", "Entidade do Item", "EntityId", "Campo do item",
    "Dynamic(true/false)", "FieldId", "Required (true/false)", "Operador lógico",
    "OperationId", "Valor", "Type", "TypeId", "OptionsTable", "OptionsTable@Options",
]

# Um item de checklist so aponta para campo destas tres entidades.
ENTIDADES = {"negocio", "cliente", "contato"}

# Os 8 operadores do mecanismo de filtro, na ordem dos OperationId.
OPERADORES = {
    1: "igual a",
    2: "diferente de",
    3: "maior que",
    4: "maior ou igual a",
    5: "menor que",
    6: "menor ou igual a",
    7: "contem",
    8: "nao contem",
}
TYPEID_SELECAO = 7
BOOLS = {"true", "false"}


def norm(texto: str) -> str:
    texto = unicodedata.normalize("NFD", str(texto or ""))
    texto = "".join(c for c in texto if unicodedata.category(c) != "Mn")
    return re.sub(r"\s+", " ", texto).strip().lower()


@dataclass
class Achado:
    linha: int
    regra: str
    detalhe: str
    severidade: str = "bloqueio"

    def __str__(self) -> str:
        onde = f"linha {self.linha}" if self.linha else "arquivo"
        return f"  [{self.severidade}/{self.regra}] {onde}: {self.detalhe}"


def etapas_do_desenho(caminho: Path) -> set[tuple[str, str]]:
    """(funil, etapa) do CSV de etapas produzido pela skill de funis."""
    pares: set[tuple[str, str]] = set()
    linhas = list(csv.reader(io.StringIO(caminho.read_text(encoding="utf-8-sig"))))
    if not linhas:
        return pares
    cab = linhas[0]
    try:
        i_funil, i_etapa = cab.index("Funil"), cab.index("Etapa")
    except ValueError:
        return pares
    for c in linhas[1:]:
        if len(c) > max(i_funil, i_etapa):
            pares.add((norm(c[i_funil]), norm(c[i_etapa])))
    return pares


def validar(caminho: Path, etapas: set[tuple[str, str]] | None) -> list[Achado]:
    bruto = caminho.read_text(encoding="utf-8-sig")
    linhas = list(csv.reader(io.StringIO(bruto)))
    achados: list[Achado] = []

    if not linhas:
        return [Achado(0, "vazio", "arquivo sem linhas")]
    if linhas[0] != CABECALHO:
        return [Achado(1, "cabecalho", f"esperado {CABECALHO}, veio {linhas[0]}")]

    for i, crua in enumerate(bruto.splitlines()[1:], start=2):
        if crua.strip() and not crua.lstrip().startswith('"'):
            achados.append(Achado(i, "aspas", "a linha nao comeca com aspas duplas"))

    # agrupamento por checklist, para conferir coerencia entre itens
    grupos: dict[str, list[tuple[int, dict]]] = defaultdict(list)

    for i, c in enumerate(linhas[1:], start=2):
        if len(c) != len(CABECALHO):
            achados.append(Achado(i, "colunas",
                                  f"{len(c)} colunas, esperado {len(CABECALHO)}"))
            continue
        d = dict(zip(CABECALHO, c))
        grupos[d["N° do Checklist"].strip()].append((i, d))

        descricao = d["Descrição do item"].strip()
        campo = d["Campo do item"].strip()

        if not descricao:
            achados.append(Achado(i, "descricao", "Descrição do item vazia — e o texto "
                                                  "que o usuario le"))
        if not d["Nome do Checklist"].strip():
            achados.append(Achado(i, "nome-checklist", "Nome do Checklist vazio"))

        # ---- entidade
        if norm(d["Entidade do Item"]) not in ENTIDADES:
            achados.append(Achado(i, "entidade-proibida",
                                  f"{d['Entidade do Item']!r}: item de checklist so aponta "
                                  f"para campo de Negócio, Cliente ou Contato"))
        if not d["EntityId"].strip():
            achados.append(Achado(i, "entityid", "EntityId vazio"))

        # ---- Dynamic x FieldId x descricao
        dyn = norm(d["Dynamic(true/false)"])
        if dyn not in BOOLS:
            achados.append(Achado(i, "dynamic", f"Dynamic deve ser true ou false; veio "
                                                f"{d['Dynamic(true/false)']!r}"))
        elif dyn == "true":
            if norm(campo) != norm(descricao):
                achados.append(Achado(i, "campo-dinamico-difere",
                                      f"campo novo (Dynamic=true) exige 'Campo do item' "
                                      f"igual a 'Descrição do item'; veio {campo!r} vs "
                                      f"{descricao!r}"))
            if d["FieldId"].strip():
                achados.append(Achado(i, "fieldid-em-dinamico",
                                      "campo novo nao tem FieldId — deixe vazio"))
        else:
            if not d["FieldId"].strip():
                achados.append(Achado(i, "fieldid-ausente",
                                      "campo existente (Dynamic=false) exige FieldId"))

        # ---- selecao exige tabela de opcoes
        tipo_id = d["TypeId"].strip()
        if tipo_id.isdigit() and int(tipo_id) == TYPEID_SELECAO and dyn == "true":
            if not d["OptionsTable"].strip() or not d["OptionsTable@Options"].strip():
                achados.append(Achado(i, "opcoes-obrigatorias",
                                      "campo novo de seleção (TypeId=7) exige OptionsTable "
                                      "e OptionsTable@Options preenchidos"))
            elif " ;" in d["OptionsTable@Options"] or "; " in d["OptionsTable@Options"]:
                achados.append(Achado(i, "opcoes-com-espaco", severidade="aviso",
                                      detalhe="separe as opções por ';' sem espaço"))

        # ---- condicao de avanco
        req = norm(d["Required (true/false)"])
        op_id = d["OperationId"].strip()
        if req not in BOOLS:
            achados.append(Achado(i, "required", f"Required deve ser true ou false; veio "
                                                 f"{d['Required (true/false)']!r}"))
        elif req == "true" and not op_id:
            achados.append(Achado(i, "condicao-ausente",
                                  "item obrigatório precisa de condição de avanço "
                                  "(Operador lógico + OperationId)"))

        if op_id:
            if not op_id.isdigit() or int(op_id) not in OPERADORES:
                achados.append(Achado(i, "operationid",
                                      f"OperationId deve ser de 1 a 8; veio {op_id!r}"))
            else:
                esperado = OPERADORES[int(op_id)]
                if norm(d["Operador lógico"]) != esperado:
                    achados.append(Achado(i, "operador-incoerente",
                                          f"OperationId {op_id} e {esperado!r}, mas "
                                          f"'Operador lógico' diz "
                                          f"{d['Operador lógico']!r}"))

        # ---- referencia ao desenho
        if etapas is not None:
            par = (norm(d["Funil"]), norm(d["Etapa do funil"]))
            if par not in etapas:
                achados.append(Achado(i, "etapa-fora-do-desenho",
                                      f"{d['Funil']!r} > {d['Etapa do funil']!r} nao existe "
                                      f"no CSV de etapas. Checklist nao cria etapa"))

    # ---- coerencia dentro de cada checklist
    for numero, itens in grupos.items():
        nomes = {norm(d["Nome do Checklist"]) for _, d in itens}
        locais = {(norm(d["Funil"]), norm(d["Etapa do funil"])) for _, d in itens}
        if len(nomes) > 1:
            achados.append(Achado(itens[0][0], "checklist-inconsistente",
                                  f"N° {numero}: itens com nomes diferentes {sorted(nomes)}"))
        if len(locais) > 1:
            achados.append(Achado(itens[0][0], "checklist-espalhado",
                                  f"N° {numero}: itens em etapas diferentes {sorted(locais)}"))
        if not any(norm(d["Required (true/false)"]) == "true" for _, d in itens):
            achados.append(Achado(itens[0][0], "checklist-sem-trava", severidade="aviso",
                                  detalhe=f"N° {numero}: nenhum item trava o avanço — "
                                          f"confirme se e coleta opcional de proposito"))

    return achados


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("csv", type=Path)
    parser.add_argument("--etapas", type=Path, default=None,
                        help="etapas.csv da skill de funis, para conferir as referências")
    args = parser.parse_args()

    etapas = etapas_do_desenho(args.etapas) if args.etapas else None
    achados = validar(args.csv, etapas)
    bloqueios = [a for a in achados if a.severidade == "bloqueio"]
    avisos = [a for a in achados if a.severidade == "aviso"]

    if not achados:
        print(f"[OK] {args.csv.name} passou no portao.")
        return 0
    for a in achados:
        print(a)
    print()
    if bloqueios:
        print(f"[BLOQUEADO] {len(bloqueios)} bloqueio(s), {len(avisos)} aviso(s).")
        return 1
    print(f"[OK com ressalva] 0 bloqueios, {len(avisos)} aviso(s).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
