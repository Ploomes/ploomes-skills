"""Portao do CSV de FLUXOS de aprovacao.

Cabecalho legado (7 colunas), mantido para compatibilidade com a ingestao:

    Nome do Fluxo,Tipo,Condição,Aviso,Ação,Campo nativo?,Conteúdo do campo

Esse cabecalho NAO expressa niveis de aprovacao, aprovadores nem notificacao —
tres dos oito parametros que a configuracao exige. O portao cobra esses tres num
arquivo anexo (--niveis), para que a indicacao fique completa mesmo enquanto o
CSV nao mudar. Ver ANEXO no fim deste arquivo.
"""
from __future__ import annotations

import argparse
import csv
import io
import json
import re
import unicodedata
from dataclasses import dataclass
from pathlib import Path

CABECALHO = [
    "Nome do Fluxo", "Tipo", "Condição", "Aviso", "Ação",
    "Campo nativo?", "Conteúdo do campo",
]

# So estas tres entidades tem fluxo de aprovacao (artigo oficial + business-docs).
ENTIDADES = {"proposta", "venda", "documento"}

ACOES = {"fluxo de aprovacao", "bloqueio", "alerta"}
ACAO_COM_NIVEL = "fluxo de aprovacao"

OPERADORES = {
    "igual a", "diferente de", "maior que", "maior ou igual a",
    "menor que", "menor ou igual a", "contem", "nao contem",
}

SIM_NAO = {"sim", "nao", "true", "false", "s", "n"}

# Nome de pessoa cravado na condicao: anti-padrao observado em producao.
# O operador vem em qualquer caixa ("Contém", "contem"); o NOME tem de continuar
# sensível a caixa, senão qualquer texto depois do operador vira suspeita.
RE_NOME_PROPRIO = re.compile(
    r"\b(?i:cont[eé]m|igual a|diferente de)\s+[\"']?"
    r"([A-ZÁÂÃÀÉÊÍÓÔÕÚÇ][a-záâãàéêíóôõúç]+"
    r"(?:\s+[A-ZÁÂÃÀÉÊÍÓÔÕÚÇ][a-záâãàéêíóôõúç.]+){1,4})", re.U)


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


def validar(caminho: Path, niveis: dict | None, campos_nativos: set[str] | None) -> list[Achado]:
    bruto = caminho.read_text(encoding="utf-8-sig")
    linhas = list(csv.reader(io.StringIO(bruto)))
    achados: list[Achado] = []

    if not linhas:
        return [Achado(0, "vazio", "arquivo sem linhas")]
    if linhas[0] != CABECALHO:
        return [Achado(1, "cabecalho", f"esperado {CABECALHO}, veio {linhas[0]}")]

    for i, linha_crua in enumerate(bruto.splitlines()[1:], start=2):
        if linha_crua.strip() and not linha_crua.lstrip().startswith('"'):
            achados.append(Achado(i, "aspas", "a linha nao comeca com aspas duplas"))

    nomes_vistos: set[str] = set()
    com_aprovacao: list[str] = []

    for i, celulas in enumerate(linhas[1:], start=2):
        if len(celulas) != len(CABECALHO):
            achados.append(Achado(i, "colunas",
                                  f"{len(celulas)} colunas, esperado {len(CABECALHO)}"))
            continue

        nome, tipo, condicao, aviso, acao, nativo, conteudo = celulas

        if not nome.strip():
            achados.append(Achado(i, "nome", "Nome do Fluxo vazio"))
        elif norm(nome) in nomes_vistos:
            achados.append(Achado(i, "nome-repetido", f"{nome!r} ja apareceu"))
        else:
            nomes_vistos.add(norm(nome))

        if norm(tipo) not in ENTIDADES:
            achados.append(Achado(i, "entidade",
                                  f"Tipo deve ser Proposta, Venda ou Documento; veio {tipo!r}. "
                                  f"Fluxo de aprovacao nao existe em outra entidade"))

        if norm(acao) not in ACOES:
            achados.append(Achado(i, "acao",
                                  f"Ação deve ser 'Fluxo de aprovação', 'Bloqueio' ou "
                                  f"'Alerta'; veio {acao!r}"))

        # A mensagem e obrigatoria na configuracao.
        if not aviso.strip():
            achados.append(Achado(i, "mensagem-obrigatoria",
                                  "Aviso vazio — a mensagem de aprovação é obrigatória "
                                  "na configuração e é o que o usuário lê"))

        if not condicao.strip():
            achados.append(Achado(i, "condicao-vazia",
                                  "sem condição, a regra dispara sempre"))
        else:
            if not any(op in norm(condicao) for op in OPERADORES):
                achados.append(Achado(i, "operador", severidade="aviso",
                                      detalhe=f"a Condição nao usa nenhum dos 8 operadores "
                                              f"do Ploomes: {condicao!r}"))
            achado_nome = RE_NOME_PROPRIO.search(condicao)
            if achado_nome:
                achados.append(Achado(i, "nome-de-pessoa-na-condicao",
                                      f"{achado_nome.group(1)!r} parece nome de pessoa. "
                                      f"Condicione por equipe, perfil ou campo — nome "
                                      f"digitado quebra em silêncio quando a pessoa sai"))

        if norm(nativo) not in SIM_NAO:
            achados.append(Achado(i, "campo-nativo",
                                  f"'Campo nativo?' deve ser Sim ou Não; veio {nativo!r}"))
        elif norm(nativo) in {"nao", "false", "n"} and not conteudo.strip():
            achados.append(Achado(i, "conteudo-do-campo",
                                  "campo nao nativo exige 'Conteúdo do campo' preenchido"))

        if campos_nativos is not None and norm(nativo) in {"sim", "true", "s"}:
            citados = re.findall(r'"([^"]+)"', condicao) or [condicao.split()[0]]
            for termo in citados:
                if norm(termo) not in campos_nativos:
                    achados.append(Achado(i, "campo-nativo-inexistente",
                                          f"{termo!r} marcado como nativo mas nao esta na "
                                          f"lista de campos nativos"))

        if norm(acao) == ACAO_COM_NIVEL:
            com_aprovacao.append(nome.strip())

    # ------------------------------------------------------------------ anexo
    if com_aprovacao:
        if niveis is None:
            achados.append(Achado(0, "anexo-de-niveis-ausente",
                                  f"{len(com_aprovacao)} fluxo(s) com ação 'Fluxo de aprovação' "
                                  f"e nenhum arquivo --niveis. O CSV de 7 colunas nao expressa "
                                  f"niveis, aprovadores nem notificação"))
        else:
            for nome in com_aprovacao:
                spec = niveis.get(nome)
                if not spec:
                    achados.append(Achado(0, "niveis-faltando",
                                          f"{nome!r} exige aprovação e nao esta no anexo"))
                    continue
                camadas = spec.get("niveis") or []
                if not camadas:
                    achados.append(Achado(0, "niveis-vazios",
                                          f"{nome!r}: ao menos um nível é obrigatório"))
                for k, nivel in enumerate(camadas, 1):
                    if not (nivel.get("aprovadores") or []):
                        achados.append(Achado(0, "aprovador-faltando",
                                              f"{nome!r} nível {k} sem aprovador"))
                if "notificar_email" not in spec:
                    achados.append(Achado(0, "notificacao-nao-declarada", severidade="aviso",
                                          detalhe=f"{nome!r}: declare notificar_email (sim/não)"))
                elif spec["notificar_email"] and not spec.get("destinatarios"):
                    achados.append(Achado(0, "destinatarios-faltando",
                                          f"{nome!r}: notificação ligada sem destinatários"))

    return achados


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("csv", type=Path)
    parser.add_argument("--niveis", type=Path, default=None,
                        help="JSON com niveis/aprovadores/notificacao por nome de fluxo")
    parser.add_argument("--campos-nativos", type=Path, default=None,
                        help="lista de campos nativos (um por linha) para conferir a coluna")
    args = parser.parse_args()

    niveis = json.loads(args.niveis.read_text(encoding="utf-8")) if args.niveis else None
    nativos = None
    if args.campos_nativos:
        nativos = {norm(l) for l in args.campos_nativos.read_text(encoding="utf-8").splitlines() if l.strip()}

    achados = validar(args.csv, niveis, nativos)
    bloqueios = [a for a in achados if a.severidade == "bloqueio"]
    avisos = [a for a in achados if a.severidade == "aviso"]

    if not achados:
        print(f"[OK] {args.csv.name} passou no portao.")
        return 0
    for achado in achados:
        print(achado)
    print()
    if bloqueios:
        print(f"[BLOQUEADO] {len(bloqueios)} bloqueio(s), {len(avisos)} aviso(s).")
        return 1
    print(f"[OK com ressalva] 0 bloqueios, {len(avisos)} aviso(s).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())


# ---------------------------------------------------------------------- ANEXO
# Formato do --niveis (JSON), um objeto por nome de fluxo:
#
# {
#   "Aprovação de desconto acima de 20%": {
#     "niveis": [
#       {"aprovadores": ["Gerente comercial"]},
#       {"aprovadores": ["Diretor comercial"]}
#     ],
#     "notificar_email": true,
#     "destinatarios": "todos os aprovadores"
#   }
# }
