"""Portao dos CSVs de FUNIS e ETAPAS.

Esta e a peca upstream: checklist e automacao citam etapa pelo NOME. Um nome
inconsistente aqui quebra as duas skills seguintes em silencio — por isso o
portao e mais duro com nomes do que com qualquer outra coisa.

    python validar_funis.py funis.csv etapas.csv [--modelos modelos.txt]
"""
from __future__ import annotations

import argparse
import csv
import io
import re
import unicodedata
from dataclasses import dataclass
from pathlib import Path

CAB_FUNIS = [
    "N°", "Nome do Funil", "Objetivo", "Familia", "Tipo de visibilidade", "Quem vê",
    "Passar por todas as etapas", "Proibido voltar", "Ganhar só na última etapa",
    "Cria venda ao ganhar", "Pode ganhar", "Pode perder", "Usuário de automação",
    "Gera proposta", "Gera venda", "Gera documento", "Modelos permitidos",
    "Unidade singular", "Unidade plural", "Verbo ganhar", "Verbo perder",
    "Motivos de perda",
]
CAB_ETAPAS = ["N°", "Funil", "Ordem", "Etapa", "O que acontece aqui", "Responsável"]

FAMILIAS = {
    "vendas", "licitacoes", "vendas complexas", "renovacao de contratos",
    "implantacao", "pos-venda", "chamados tecnicos", "outro",
}
VISIBILIDADE = {"usuario", "perfil", "equipe", "todos"}
SIM_NAO = {"sim", "nao"}

LIMITE_NOME_FUNIL = 100


def norm(texto: str) -> str:
    texto = unicodedata.normalize("NFD", str(texto or ""))
    texto = "".join(c for c in texto if unicodedata.category(c) != "Mn")
    return re.sub(r"\s+", " ", texto).strip().lower()


@dataclass
class Achado:
    arquivo: str
    linha: int
    regra: str
    detalhe: str
    severidade: str = "bloqueio"

    def __str__(self) -> str:
        onde = f"{self.arquivo} linha {self.linha}" if self.linha else self.arquivo
        return f"  [{self.severidade}/{self.regra}] {onde}: {self.detalhe}"


def ler(caminho: Path, cabecalho: list[str], achados: list[Achado]) -> list[list[str]]:
    bruto = caminho.read_text(encoding="utf-8-sig")
    linhas = list(csv.reader(io.StringIO(bruto)))
    if not linhas:
        achados.append(Achado(caminho.name, 0, "vazio", "arquivo sem linhas"))
        return []
    if linhas[0] != cabecalho:
        achados.append(Achado(caminho.name, 1, "cabecalho",
                              f"esperado {cabecalho}, veio {linhas[0]}"))
        return []
    for i, crua in enumerate(bruto.splitlines()[1:], start=2):
        if crua.strip() and not crua.lstrip().startswith('"'):
            achados.append(Achado(caminho.name, i, "aspas",
                                  "a linha nao comeca com aspas duplas"))
    return linhas[1:]


def validar(p_funis: Path, p_etapas: Path, modelos: set[str] | None) -> list[Achado]:
    achados: list[Achado] = []
    funis = ler(p_funis, CAB_FUNIS, achados)
    etapas = ler(p_etapas, CAB_ETAPAS, achados)
    if not funis:
        return achados

    nomes_funil: dict[str, dict] = {}

    # ------------------------------------------------------------------ funis
    for i, c in enumerate(funis, start=2):
        if len(c) != len(CAB_FUNIS):
            achados.append(Achado(p_funis.name, i, "colunas",
                                  f"{len(c)} colunas, esperado {len(CAB_FUNIS)}"))
            continue
        d = dict(zip(CAB_FUNIS, c))
        nome = d["Nome do Funil"].strip()

        if not nome:
            achados.append(Achado(p_funis.name, i, "nome", "Nome do Funil vazio"))
            continue
        if len(nome) > LIMITE_NOME_FUNIL:
            achados.append(Achado(p_funis.name, i, "nome-longo",
                                  f"{len(nome)} caracteres; o limite e {LIMITE_NOME_FUNIL}"))
        if norm(nome) in nomes_funil:
            achados.append(Achado(p_funis.name, i, "funil-repetido", f"{nome!r} ja apareceu"))
        nomes_funil[norm(nome)] = d

        if not d["Objetivo"].strip():
            achados.append(Achado(p_funis.name, i, "objetivo",
                                  "sem Objetivo — um funil sem proposito declarado "
                                  "vira Kanban"))
        if norm(d["Familia"]) not in FAMILIAS:
            achados.append(Achado(p_funis.name, i, "familia", severidade="aviso",
                                  detalhe=f"Familia {d['Familia']!r} fora da lista conhecida"))
        if norm(d["Tipo de visibilidade"]) not in VISIBILIDADE:
            achados.append(Achado(p_funis.name, i, "visibilidade",
                                  f"Tipo de visibilidade deve ser usuario, perfil, equipe "
                                  f"ou todos; veio {d['Tipo de visibilidade']!r}"))
        elif norm(d["Tipo de visibilidade"]) != "todos" and not d["Quem vê"].strip():
            achados.append(Achado(p_funis.name, i, "visibilidade-sem-lista",
                                  "tipo de visibilidade restrito exige a lista em 'Quem vê'"))

        for coluna in ("Passar por todas as etapas", "Proibido voltar",
                       "Ganhar só na última etapa", "Cria venda ao ganhar",
                       "Pode ganhar", "Pode perder", "Usuário de automação",
                       "Gera proposta", "Gera venda", "Gera documento"):
            if norm(d[coluna]) not in SIM_NAO:
                achados.append(Achado(p_funis.name, i, "sim-nao",
                                      f"{coluna!r} deve ser Sim ou Não; veio {d[coluna]!r}"))

        # Todo funil precisa de ao menos um motivo de perda (regra de integridade).
        if norm(d["Pode perder"]) == "sim" and not d["Motivos de perda"].strip():
            achados.append(Achado(p_funis.name, i, "motivo-de-perda",
                                  "funil que pode perder negocio exige ao menos um "
                                  "motivo de perda"))

        # Coerencia interna das regras.
        if norm(d["Ganhar só na última etapa"]) == "sim" and norm(d["Pode ganhar"]) == "nao":
            achados.append(Achado(p_funis.name, i, "regra-incoerente",
                                  "'Ganhar só na última etapa' = Sim com 'Pode ganhar' = Não"))
        if norm(d["Cria venda ao ganhar"]) == "sim" and norm(d["Pode ganhar"]) == "nao":
            achados.append(Achado(p_funis.name, i, "regra-incoerente",
                                  "'Cria venda ao ganhar' = Sim com 'Pode ganhar' = Não"))
        if d["Modelos permitidos"].strip() and all(
                norm(d[k]) == "nao" for k in ("Gera proposta", "Gera venda", "Gera documento")):
            achados.append(Achado(p_funis.name, i, "modelo-sem-geracao",
                                  "lista modelos permitidos mas o funil nao gera "
                                  "proposta, venda nem documento"))
        if modelos is not None and d["Modelos permitidos"].strip():
            for m in [x.strip() for x in d["Modelos permitidos"].split(";") if x.strip()]:
                if norm(m) not in modelos:
                    achados.append(Achado(p_funis.name, i, "modelo-inexistente",
                                          f"{m!r} nao esta entre os modelos indicados. "
                                          f"Modelos de PVD sao configurados ANTES do funil"))

    # ----------------------------------------------------------------- etapas
    ordens: dict[str, list[int]] = {}
    etapas_por_funil: dict[str, set[str]] = {}
    for i, c in enumerate(etapas, start=2):
        if len(c) != len(CAB_ETAPAS):
            achados.append(Achado(p_etapas.name, i, "colunas",
                                  f"{len(c)} colunas, esperado {len(CAB_ETAPAS)}"))
            continue
        d = dict(zip(CAB_ETAPAS, c))
        funil = norm(d["Funil"])
        if funil not in nomes_funil:
            achados.append(Achado(p_etapas.name, i, "funil-inexistente",
                                  f"{d['Funil']!r} nao esta em {p_funis.name}"))
            continue
        nome_etapa = d["Etapa"].strip()
        if not nome_etapa:
            achados.append(Achado(p_etapas.name, i, "etapa-sem-nome", "Etapa vazia"))
            continue
        etapas_por_funil.setdefault(funil, set())
        if norm(nome_etapa) in etapas_por_funil[funil]:
            achados.append(Achado(p_etapas.name, i, "etapa-repetida",
                                  f"{nome_etapa!r} ja existe neste funil — checklist e "
                                  f"automacao citam etapa pelo nome"))
        etapas_por_funil[funil].add(norm(nome_etapa))

        if not d["O que acontece aqui"].strip():
            achados.append(Achado(p_etapas.name, i, "etapa-sem-conteudo", severidade="aviso",
                                  detalhe=f"{nome_etapa!r} sem descricao — a skill de "
                                          f"checklist depende disso"))
        try:
            ordens.setdefault(funil, []).append(int(d["Ordem"]))
        except ValueError:
            achados.append(Achado(p_etapas.name, i, "ordem",
                                  f"Ordem nao numerica: {d['Ordem']!r}"))

    for funil, lista in ordens.items():
        esperado = list(range(1, len(lista) + 1))
        if sorted(lista) != esperado:
            achados.append(Achado(p_etapas.name, 0, "ordem-das-etapas",
                                  f"funil {funil!r}: ordens {sorted(lista)}, esperado {esperado}"))

    for nome, d in nomes_funil.items():
        qtd = len(etapas_por_funil.get(nome, ()))
        if qtd == 0:
            achados.append(Achado(p_etapas.name, 0, "funil-sem-etapa",
                                  f"{d['Nome do Funil']!r} nao tem nenhuma etapa"))
        elif qtd < 3:
            achados.append(Achado(p_etapas.name, 0, "funil-raso", severidade="aviso",
                                  detalhe=f"{d['Nome do Funil']!r} tem {qtd} etapa(s) — "
                                          f"confirme se e processo ou so um status"))

    return achados


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("funis", type=Path)
    parser.add_argument("etapas", type=Path)
    parser.add_argument("--modelos", type=Path, default=None,
                        help="modelos de PVD indicados (um por linha)")
    args = parser.parse_args()

    modelos = None
    if args.modelos:
        modelos = {norm(l) for l in args.modelos.read_text(encoding="utf-8").splitlines() if l.strip()}

    achados = validar(args.funis, args.etapas, modelos)
    bloqueios = [a for a in achados if a.severidade == "bloqueio"]
    avisos = [a for a in achados if a.severidade == "aviso"]

    if not achados:
        print("[OK] funis e etapas passaram no portao.")
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
