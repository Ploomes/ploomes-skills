"""Portao do CSV de AUTOMACOES.

Tudo que aqui e verificado sai do prompt. O modelo nao precisa lembrar de 12
colunas, de aspas, de quais gatilhos exigem etapa nem de quais acoes exigem
corpo: isso e conferido, nao pedido.

Uso:
    python validar_automacoes.py automacoes.csv [--etapas etapas.csv]
                                 [--integracoes Neppo,Meetime]
"""
from __future__ import annotations

import argparse
import csv
import io
import json
import re
import sys
import unicodedata
from dataclasses import dataclass
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
VOCAB = RAIZ / "references" / "vocabulario-automacoes.json"

CABECALHO = [
    "N°", "Tipo", "Descrição", "Entidade", "Gatilho", "Filtro",
    "Ação 1", "Detalhamento 1", "Ação 2", "Detalhamento 2", "Ação 3", "Detalhamento 3",
]
# Confirmados pelo artigo oficial: "Automacoes de funil" e "Automacoes gerais".
TIPOS_VALIDOS = {"Funil", "Geral"}

# Cadastros que aceitam automacao geral (artigo oficial, secao Automacoes gerais).
ENTIDADES_OFICIAIS = {
    "cliente", "clientes",
    "negocio", "negocios", "card", "cards",
    "venda", "vendas",
    "proposta", "propostas",
    "produto", "produtos",
    "tarefa", "tarefas",
    "usuario", "usuarios",
    "registro de interacao", "registros de interacao",
    "documento", "documentos",
    "produto do cliente", "produtos do cliente",
}

TETO_POR_ETAPA = 100      # artigo: ate 100 automacoes por estagio
TETO_POR_ENTIDADE = 100   # artigo: ate 100 por cadastro — contestado pelo dado real

# Formas de "Editar dados" (artigo): valor fixo | puxar de campo | formula.
RE_FORMA_EDICAO = re.compile(
    r"valor fixo|f[oó]rmula|←|<-|puxa|copia|de outro campo|do campo", re.I)


def norm(texto: str) -> str:
    texto = unicodedata.normalize("NFD", str(texto or ""))
    texto = "".join(c for c in texto if unicodedata.category(c) != "Mn")
    return re.sub(r"\s+", " ", texto).strip().lower()


@dataclass
class Erro:
    linha: int
    regra: str
    detalhe: str
    severidade: str = "bloqueio"  # "bloqueio" | "aviso"

    def __str__(self) -> str:
        onde = f"linha {self.linha}" if self.linha else "arquivo"
        return f"  [{self.severidade}/{self.regra}] {onde}: {self.detalhe}"


def nomes_do_desenho(caminho: Path) -> set[str]:
    """Nomes de funil e etapa que o desenho declara.

    Aceita as duas formas: o etapas.csv da skill de funis (fonte primaria) ou um
    BPMN, quando existir. O CSV e mais confiavel — no XML todo name= entra, o que
    inclui tarefa e raia e deixa a checagem frouxa."""
    if caminho.suffix.lower() == ".csv":
        nomes: set[str] = set()
        linhas = list(csv.reader(io.StringIO(caminho.read_text(encoding="utf-8-sig"))))
        if not linhas:
            return nomes
        cab = linhas[0]
        indices = [cab.index(c) for c in ("Funil", "Etapa") if c in cab]
        for celulas in linhas[1:]:
            for i in indices:
                if i < len(celulas) and celulas[i].strip():
                    nomes.add(norm(celulas[i]))
        return nomes
    texto = caminho.read_text(encoding="utf-8", errors="ignore")
    return {norm(n) for n in re.findall(r'name="([^"]+)"', texto)}


def validar(caminho_csv: Path, nomes_do_funil: set[str] | None,
            integracoes: set[str]) -> list[Erro]:
    vocab = json.loads(VOCAB.read_text(encoding="utf-8"))
    gatilhos = {norm(g["nome"]): g for g in vocab["gatilhos"]}
    acoes = {norm(a["nome"]): a for a in vocab["acoes"]}
    so_negocio = {norm(n) for n in vocab["acoes_so_para_negocio"]}
    dependentes = {norm(k): v for k, v in vocab["acoes_que_dependem_de_integracao"].items()}

    bruto = caminho_csv.read_text(encoding="utf-8-sig")
    erros: list[Erro] = []

    # ---------------------------------------------------------------- formato
    linhas = list(csv.reader(io.StringIO(bruto)))
    if not linhas:
        return [Erro(0, "vazio", "o arquivo nao tem linhas")]

    if linhas[0] != CABECALHO:
        erros.append(Erro(1, "cabecalho",
                          f"esperado exatamente {CABECALHO}, veio {linhas[0]}"))
        return erros  # sem cabecalho certo, o resto nao faz sentido

    # aspas: toda celula nao vazia deve estar citada no texto cru
    for i, linha_crua in enumerate(bruto.splitlines()[1:], start=2):
        if linha_crua.strip() and not linha_crua.lstrip().startswith('"'):
            erros.append(Erro(i, "aspas", "a linha nao comeca com aspas duplas"))

    # ---------------------------------------------------------------- conteudo
    numeros: list[int] = []
    por_etapa: dict[str, int] = {}
    por_entidade: dict[str, int] = {}
    for i, celulas in enumerate(linhas[1:], start=2):
        if len(celulas) != len(CABECALHO):
            erros.append(Erro(i, "colunas",
                              f"{len(celulas)} colunas, esperado {len(CABECALHO)}"))
            continue

        (numero, tipo, descricao, entidade, gatilho, filtro,
         a1, d1, a2, d2, a3, d3) = celulas

        if numero.strip().isdigit():
            numeros.append(int(numero.strip()))
        else:
            erros.append(Erro(i, "numero", f"N° nao numerico: {numero!r}"))

        if tipo.strip() not in TIPOS_VALIDOS:
            erros.append(Erro(i, "tipo",
                              f"Tipo deve ser um de {sorted(TIPOS_VALIDOS)}, veio {tipo!r}"))

        if not descricao.strip():
            erros.append(Erro(i, "descricao", "Descrição vazia"))

        if norm(entidade) not in ENTIDADES_OFICIAIS:
            erros.append(Erro(i, "entidade-inexistente",
                              f"{entidade!r} nao esta entre os cadastros que aceitam "
                              f"automacao (artigo oficial)"))

        if tipo.strip() == "Funil":
            por_etapa[norm(filtro)] = por_etapa.get(norm(filtro), 0) + 1
        else:
            por_entidade[norm(entidade)] = por_entidade.get(norm(entidade), 0) + 1

        # ---- gatilho
        g = gatilhos.get(norm(gatilho))
        if not g:
            erros.append(Erro(i, "gatilho-inexistente",
                              f"{gatilho!r} nao esta no vocabulario da plataforma"))
        else:
            restrita = g.get("entidade_restrita")
            if restrita and norm(entidade) != norm(restrita):
                erros.append(Erro(i, "entidade-incompativel",
                                  f"gatilho {gatilho!r} so aceita entidade {restrita!r}, "
                                  f"veio {entidade!r}"))
            if g["exige_etapa"]:
                if not filtro.strip():
                    erros.append(Erro(i, "etapa-obrigatoria",
                                      f"gatilho {gatilho!r} exige funil e etapa no Filtro"))
                if tipo.strip() != "Funil":
                    erros.append(Erro(i, "tipo-incoerente",
                                      f"gatilho {gatilho!r} e de etapa: Tipo deve ser 'Funil'"))
                if nomes_do_funil is not None and filtro.strip():
                    citados = [t.strip() for t in re.split(r"[>|/;,]", filtro) if t.strip()]
                    for termo in citados:
                        if len(norm(termo)) >= 4 and norm(termo) not in nomes_do_funil:
                            erros.append(Erro(i, "fora-do-desenho",
                                              f"{termo!r} nao aparece no desenho de funis"))

        # ---- acoes
        pares = [(a1, d1, "1"), (a2, d2, "2"), (a3, d3, "3")]
        preenchidas = [p for p in pares if p[0].strip()]
        if not preenchidas:
            erros.append(Erro(i, "sem-acao", "nenhuma Ação preenchida"))
        for k, (acao, _, ordem) in enumerate(pares):
            if not acao.strip() and any(p[0].strip() for p in pares[k + 1:]):
                erros.append(Erro(i, "buraco-na-acao",
                                  f"Ação {ordem} vazia com Ação posterior preenchida"))

        for acao, detalhe, ordem in preenchidas:
            a = acoes.get(norm(acao))
            if not a:
                erros.append(Erro(i, "acao-inexistente",
                                  f"Ação {ordem} {acao!r} nao esta no vocabulario"))
                continue
            if a["exige_detalhamento"] and not detalhe.strip():
                erros.append(Erro(i, "detalhamento-obrigatorio",
                                  f"Ação {ordem} {acao!r} exige Detalhamento {ordem}"))
            # "Editar dados" tem tres formas (valor fixo | de outro campo | formula):
            # sem dizer qual, quem configura fica no escuro.
            if norm(acao) == "editar dados" and not RE_FORMA_EDICAO.search(detalhe):
                erros.append(Erro(i, "forma-de-edicao", severidade="aviso",
                                  detalhe=f"Ação {ordem} 'Editar dados' nao declara a forma "
                                          f"(valor fixo, puxar de campo ou fórmula)"))
            if norm(acao) in so_negocio and norm(entidade) != "negocio":
                erros.append(Erro(i, "acao-so-negocio",
                                  f"Ação {ordem} {acao!r} so se aplica a Negócio, "
                                  f"a linha e de {entidade!r}"))
            dependencia = dependentes.get(norm(acao))
            if dependencia and norm(dependencia) not in {norm(x) for x in integracoes}:
                erros.append(Erro(i, "integracao-ausente",
                                  f"Ação {ordem} {acao!r} depende de {dependencia}, "
                                  f"que nao consta como contratada — vire LACUNA"))

    # ---- numeracao
    if numeros and numeros != list(range(1, len(numeros) + 1)):
        erros.append(Erro(0, "numeracao",
                          f"N° deve ir de 1 a {len(numeros)} sem buraco nem repeticao"))

    # ---- tetos declarados no artigo oficial
    for etapa, n in por_etapa.items():
        if n > TETO_POR_ETAPA:
            erros.append(Erro(0, "teto-por-etapa",
                              f"{n} automacoes para a etapa {etapa!r}; o teto e "
                              f"{TETO_POR_ETAPA} por estagio"))
    for entidade, n in por_entidade.items():
        if n > TETO_POR_ENTIDADE:
            erros.append(Erro(0, "teto-por-entidade", severidade="aviso",
                              detalhe=f"{n} automacoes gerais em {entidade!r}; o artigo declara "
                                      f"teto de {TETO_POR_ENTIDADE}, mas conta em producao "
                                      f"observada passa disso — ver limites-e-divergencias.md"))

    return erros


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("csv", type=Path)
    parser.add_argument("--etapas", type=Path, default=None,
                        help="etapas.csv da skill de funis (ou um BPMN), para conferir "
                             "se funil/etapa citados existem")
    parser.add_argument("--integracoes", default="",
                        help="integracoes contratadas na conta, separadas por virgula")
    args = parser.parse_args()

    nomes = nomes_do_desenho(args.etapas) if args.etapas else None
    integracoes = {x.strip() for x in args.integracoes.split(",") if x.strip()}

    erros = validar(args.csv, nomes, integracoes)
    bloqueios = [e for e in erros if e.severidade == "bloqueio"]
    avisos = [e for e in erros if e.severidade == "aviso"]

    if not erros:
        print(f"[OK] {args.csv.name} passou no portao.")
        return 0

    for erro in erros:
        print(erro)
    print()
    if bloqueios:
        print(f"[BLOQUEADO] {len(bloqueios)} bloqueio(s), {len(avisos)} aviso(s).")
        return 1
    print(f"[OK com ressalva] 0 bloqueios, {len(avisos)} aviso(s) — revise antes de entregar.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
