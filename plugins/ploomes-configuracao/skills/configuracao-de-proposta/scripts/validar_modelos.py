"""Portao dos CSVs de MODELOS de PVD e CAMPOS DO MODELO.

A regra mais util aqui nao e de formato: e o teto de produtos por PVD, que nao e
um numero fixo e sim funcao de quantos campos o produto tem. Cliente que monta
proposta com 80 itens nao pode ter 12 campos por produto — e ninguem descobre
isso lendo a tela.

    python validar_modelos.py modelos.csv campos-modelo.csv
"""
from __future__ import annotations

import argparse
import csv
import io
import re
import unicodedata
from collections import Counter, defaultdict
from dataclasses import dataclass
from pathlib import Path

CAB_MODELOS = [
    "N°", "Nome do Modelo", "Tipo", "Finalidade", "Tipo de visibilidade", "Quem vê",
    "Tem paginação", "Nome do PDF personalizado", "Nome do PDF",
    "Usa parcelas", "Campo de total das parcelas", "Usa revisão",
    "Seções", "Produtos típicos por PVD",
]
CAB_CAMPOS = [
    "N°", "Modelo", "Nível", "Campo", "Tipo do campo", "Obrigatório",
    "Origem", "Aparece no HTML", "Cálculo",
]

TIPOS_MODELO = {
    "proposta": "Proposta",
    "venda": "Venda",
    "documento do negocio": "Documento do Negócio",
    "documento do cliente": "Documento do Cliente",
}
NIVEIS = {"pvd", "bloco", "produto", "opcional"}
VISIBILIDADE = {"usuario", "equipe", "empresa"}
ORIGENS = {"nativo", "novo"}
SIM_NAO = {"sim", "nao"}

# As tres unicas formulas do modulo de Automacao de propostas e documentos.
FORMULAS_NATIVAS = {
    "total do produto", "total do bloco", "valor do pvd", "valor da proposta",
    "", "-", "nao",
}

# 150 produtos com ate 4 campos; cada campo alem disso tira 8.
BASE_PRODUTOS = 150
CAMPOS_FRANQUIA = 4
PRODUTOS_POR_CAMPO = 8


def teto_de_produtos(campos_por_produto: int) -> int:
    excedente = max(0, campos_por_produto - CAMPOS_FRANQUIA)
    return max(0, BASE_PRODUTOS - PRODUTOS_POR_CAMPO * excedente)


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


def validar(p_mod: Path, p_cam: Path) -> list[Achado]:
    achados: list[Achado] = []
    modelos = ler(p_mod, CAB_MODELOS, achados)
    campos = ler(p_cam, CAB_CAMPOS, achados)
    if not modelos:
        return achados

    por_nome: dict[str, dict] = {}

    for i, c in enumerate(modelos, start=2):
        if len(c) != len(CAB_MODELOS):
            achados.append(Achado(p_mod.name, i, "colunas",
                                  f"{len(c)} colunas, esperado {len(CAB_MODELOS)}"))
            continue
        d = dict(zip(CAB_MODELOS, c))
        nome = d["Nome do Modelo"].strip()

        if not nome:
            achados.append(Achado(p_mod.name, i, "nome", "Nome do Modelo vazio"))
            continue
        if norm(nome) in por_nome:
            achados.append(Achado(p_mod.name, i, "modelo-repetido", f"{nome!r} ja apareceu"))
        por_nome[norm(nome)] = d

        tipo = norm(d["Tipo"])
        if tipo not in TIPOS_MODELO:
            achados.append(Achado(p_mod.name, i, "tipo",
                                  f"Tipo deve ser um de {sorted(TIPOS_MODELO.values())}; "
                                  f"veio {d['Tipo']!r}"))

        if not d["Finalidade"].strip():
            achados.append(Achado(p_mod.name, i, "finalidade",
                                  "sem Finalidade — para que serve este modelo?"))

        if norm(d["Tipo de visibilidade"]) not in VISIBILIDADE:
            achados.append(Achado(p_mod.name, i, "visibilidade",
                                  f"deve ser usuario, equipe ou empresa; veio "
                                  f"{d['Tipo de visibilidade']!r}"))
        elif norm(d["Tipo de visibilidade"]) != "empresa" and not d["Quem vê"].strip():
            achados.append(Achado(p_mod.name, i, "visibilidade-sem-lista",
                                  "visibilidade restrita exige a lista em 'Quem vê'"))

        for coluna in ("Tem paginação", "Nome do PDF personalizado", "Usa parcelas",
                       "Usa revisão"):
            if norm(d[coluna]) not in SIM_NAO:
                achados.append(Achado(p_mod.name, i, "sim-nao",
                                      f"{coluna!r} deve ser Sim ou Não; veio {d[coluna]!r}"))

        # Revisao so existe em proposta.
        if norm(d["Usa revisão"]) == "sim" and tipo != "proposta":
            achados.append(Achado(p_mod.name, i, "revisao-inexistente",
                                  f"só Proposta tem revisão; {d['Tipo']!r} apenas edita e "
                                  f"a versão anterior desaparece"))

        if norm(d["Nome do PDF personalizado"]) == "sim" and not d["Nome do PDF"].strip():
            achados.append(Achado(p_mod.name, i, "nome-pdf",
                                  "'Nome do PDF personalizado' = Sim sem 'Nome do PDF'"))
        if norm(d["Usa parcelas"]) == "sim" and not d["Campo de total das parcelas"].strip():
            achados.append(Achado(p_mod.name, i, "parcelas-sem-campo",
                                  "modelo com parcelas exige o campo que guarda o valor "
                                  "a ser parcelado"))
        if not d["Seções"].strip():
            achados.append(Achado(p_mod.name, i, "sem-secao",
                                  "um modelo é feito de uma ou mais seções"))

        if d["Produtos típicos por PVD"].strip() and not d["Produtos típicos por PVD"].strip().isdigit():
            achados.append(Achado(p_mod.name, i, "produtos-tipicos",
                                  f"'Produtos típicos por PVD' deve ser número; veio "
                                  f"{d['Produtos típicos por PVD']!r}"))

    # ------------------------------------------------------------------ campos
    campos_por_modelo_nivel: dict[tuple[str, str], list[str]] = defaultdict(list)
    for i, c in enumerate(campos, start=2):
        if len(c) != len(CAB_CAMPOS):
            achados.append(Achado(p_cam.name, i, "colunas",
                                  f"{len(c)} colunas, esperado {len(CAB_CAMPOS)}"))
            continue
        d = dict(zip(CAB_CAMPOS, c))
        modelo = norm(d["Modelo"])
        if modelo not in por_nome:
            achados.append(Achado(p_cam.name, i, "modelo-inexistente",
                                  f"{d['Modelo']!r} nao esta em {p_mod.name}"))
            continue

        nivel = norm(d["Nível"])
        if nivel not in NIVEIS:
            achados.append(Achado(p_cam.name, i, "nivel",
                                  f"Nível deve ser PVD, Bloco, Produto ou Opcional; "
                                  f"veio {d['Nível']!r}"))
            continue
        if not d["Campo"].strip():
            achados.append(Achado(p_cam.name, i, "campo-vazio", "Campo vazio"))
            continue
        campos_por_modelo_nivel[(modelo, nivel)].append(d["Campo"].strip())

        if norm(d["Origem"]) not in ORIGENS:
            achados.append(Achado(p_cam.name, i, "origem",
                                  f"Origem deve ser nativo ou novo; veio {d['Origem']!r}"))
        for coluna in ("Obrigatório", "Aparece no HTML"):
            if norm(d[coluna]) not in SIM_NAO:
                achados.append(Achado(p_cam.name, i, "sim-nao",
                                      f"{coluna!r} deve ser Sim ou Não; veio {d[coluna]!r}"))

        calculo = norm(d["Cálculo"])
        if calculo and calculo not in FORMULAS_NATIVAS:
            achados.append(Achado(p_cam.name, i, "formula-fora-do-nativo", severidade="aviso",
                                  detalhe=f"{d['Cálculo']!r} nao e uma das tres fórmulas "
                                          f"nativas (Total do produto, Total do bloco, "
                                          f"Valor do PVD) — exige o módulo de CPQ"))

        # Campo que nao aparece no HTML e nao e obrigatorio: por que existe?
        if norm(d["Aparece no HTML"]) == "nao" and norm(d["Obrigatório"]) == "nao":
            achados.append(Achado(p_cam.name, i, "campo-sem-uso", severidade="aviso",
                                  detalhe=f"{d['Campo']!r} nao aparece no HTML nem e "
                                          f"obrigatório — confirme para que serve"))

    # ------------------------------- teto de produtos: funcao dos campos, nao fixo
    for (modelo, nivel), lista in campos_por_modelo_nivel.items():
        if nivel != "produto":
            continue
        d = por_nome[modelo]
        n_campos = len(lista)
        teto = teto_de_produtos(n_campos)
        tipicos = d["Produtos típicos por PVD"].strip()
        detalhe_base = (f"{d['Nome do Modelo']!r}: {n_campos} campos por produto "
                        f"⇒ teto de {teto} produtos por PVD")
        if tipicos.isdigit():
            if int(tipicos) > teto:
                achados.append(Achado(p_cam.name, 0, "teto-de-produtos",
                                      f"{detalhe_base}, mas o modelo declara "
                                      f"{tipicos} produtos típicos. Reduza campos do "
                                      f"produto ou divida em mais de um PVD"))
            elif int(tipicos) > teto * 0.8:
                achados.append(Achado(p_cam.name, 0, "teto-de-produtos", severidade="aviso",
                                      detalhe=f"{detalhe_base}; declara {tipicos} — "
                                              f"a menos de 20% do teto"))
        elif n_campos > CAMPOS_FRANQUIA:
            achados.append(Achado(p_cam.name, 0, "teto-de-produtos", severidade="aviso",
                                  detalhe=f"{detalhe_base}. Preencha 'Produtos típicos "
                                          f"por PVD' para conferir"))

    # ------------------------------------------------ modelo sem nenhum campo
    for modelo, d in por_nome.items():
        if not any(chave[0] == modelo for chave in campos_por_modelo_nivel):
            achados.append(Achado(p_cam.name, 0, "modelo-sem-campo",
                                  f"{d['Nome do Modelo']!r} nao tem nenhum campo. O HTML "
                                  f"sairia com buracos"))

    return achados


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("modelos", type=Path)
    parser.add_argument("campos", type=Path)
    args = parser.parse_args()

    achados = validar(args.modelos, args.campos)
    bloqueios = [a for a in achados if a.severidade == "bloqueio"]
    avisos = [a for a in achados if a.severidade == "aviso"]

    if not achados:
        print("[OK] modelos e campos passaram no portao.")
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
