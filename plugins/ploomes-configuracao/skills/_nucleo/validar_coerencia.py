"""Portao de COERENCIA ENTRE as pecas da cadeia de indicacao.

Cada peca tem o seu portao, e nenhum deles ve a costura. Os defeitos que passam
sao sempre os mesmos, e sao silenciosos:

  - o funil permite um modelo de PVD que nao existe;
  - o fluxo de aprovacao condiciona por um campo que nenhuma peca cria;
  - a automacao perde negocio por um motivo que o funil nao cadastrou;
  - a tela propria (indicacao-de-tela) usa funil, etapa, modelo ou motivo
    que a cadeia nao criou.

Nos quatro casos o CSV passa no portao proprio e a linha nao configura.

As telas moram na pasta IRMA da dos CSVs: <pasta>/../telas/<slug>/
requisitos-da-cadeia.csv. So entram as telas com "Segue: sim" no
candidatos-de-tela.md.

    python validar_coerencia.py <pasta-com-os-csvs>

Roda com o que existir na pasta: serve no fim da cadeia e entre dois passos.
"""
from __future__ import annotations

import argparse
import csv
import re
import unicodedata
from dataclasses import dataclass
from pathlib import Path

# Os 8 operadores, ordenados do mais longo para o mais curto: "maior ou igual a"
# tem de casar antes de "maior que", senao o nome do campo sai truncado.
OPERADORES = [
    "maior ou igual a", "menor ou igual a", "diferente de", "nao contem",
    "maior que", "menor que", "igual a", "contem",
]


def norm(texto: str) -> str:
    texto = unicodedata.normalize("NFD", str(texto or ""))
    texto = "".join(c for c in texto if unicodedata.category(c) != "Mn")
    return re.sub(r"\s+", " ", texto).strip().lower()


@dataclass
class Achado:
    peca: str
    regra: str
    detalhe: str
    severidade: str = "bloqueio"

    def __str__(self) -> str:
        return f"  [{self.severidade}/{self.regra}] {self.peca}: {self.detalhe}"


def ler(caminho: Path) -> list[dict]:
    if not caminho.exists():
        return []
    return list(csv.DictReader(caminho.read_text(encoding="utf-8-sig").splitlines()))


def lista(celula: str) -> list[str]:
    return [p.strip() for p in (celula or "").split(";") if p.strip()]


# Campos que o proprio documento do Ploomes tem, e que por isso nenhuma peca cria.
# Um fluxo que distingue dois modelos de documento (ex.: pedido e nota de venda) condiciona por eles.
NATIVOS_DO_DOCUMENTO = {"modelo"}


def campo_da_condicao(condicao: str) -> str:
    """O nome do campo e tudo que vem ANTES do operador."""
    n = norm(condicao)
    for op in OPERADORES:
        i = n.find(" " + op + " ")
        if i > 0:
            return condicao[:i].strip().strip('"').strip()
    return ""


def campos_da_condicao(condicao: str) -> list[str]:
    """Um campo por clausula: a condicao junta clausulas com ' E ' ou ' OU ' antes
    de aspas, em qualquer caixa."""
    clausulas = re.split(r'\s+(?:E|OU)\s+(?=")', condicao or "", flags=re.I)
    return [c for c in (campo_da_condicao(cl) for cl in clausulas) if c]


def telas_que_seguem(pasta_telas: Path) -> list[str]:
    """Slugs com 'Segue: sim' no candidatos-de-tela.md (formato da indicacao-de-tela)."""
    arq = pasta_telas / "candidatos-de-tela.md"
    if not arq.exists():
        return []
    slugs, slug, na_decisao = [], "", False
    for linha in arq.read_text(encoding="utf-8").splitlines():
        if linha.startswith("## "):
            slug, na_decisao = "", False
        elif linha.startswith("### "):
            # A secao da decisao, na forma neutra e na antiga (arquivos ja gravados).
            na_decisao = norm(linha[4:]).startswith(("decisao de quem pede", "decisao do fde"))
        m = re.match(r"^\s*-\s*([^:]+):\s*(.*)$", linha)
        if not m:
            continue
        chave, valor = norm(m.group(1)), m.group(2).strip()
        if chave == "slug" and not na_decisao:
            slug = valor
        elif chave == "segue" and na_decisao and norm(valor) in {"sim", "s", "true"} and slug:
            slugs.append(slug)
    return slugs


def validar(pasta: Path) -> list[Achado]:
    modelos = ler(pasta / "modelos.csv")
    campos_modelo = ler(pasta / "campos-modelo.csv")
    funis = ler(pasta / "funis.csv")
    checklists = ler(pasta / "checklists.csv")
    automacoes = ler(pasta / "automacoes.csv")
    fluxos = ler(pasta / "fluxos.csv")

    achados: list[Achado] = []

    # ── universo de campos que ALGUMA peca cria ────────────────────────────
    campos = {norm(r["Campo do item"]) for r in checklists if r.get("Campo do item")}
    campos |= {norm(r["Campo"]) for r in campos_modelo if r.get("Campo")}

    # ── A · modelo permitido pelo funil tem de existir ─────────────────────
    if funis and modelos:
        nomes = {norm(r["Nome do Modelo"]) for r in modelos if r.get("Nome do Modelo")}
        for r in funis:
            for m in lista(r.get("Modelos permitidos", "")):
                if norm(m) not in nomes:
                    achados.append(Achado(
                        "funis.csv x modelos.csv", "modelo-inexistente",
                        f"funil {r['Nome do Funil']!r} permite o modelo {m!r}, "
                        f"que nao esta em modelos.csv"))
    elif funis and not modelos:
        if any(lista(r.get("Modelos permitidos", "")) for r in funis):
            achados.append(Achado(
                "funis.csv", "modelos-sem-fonte",
                "ha funil com 'Modelos permitidos' preenchido e nao existe "
                "modelos.csv na pasta — a peca de proposta roda ANTES da de funis"))

    # ── B · campo condicionado por fluxo tem de existir em alguma peca ─────
    for r in fluxos:
        if norm(r.get("Campo nativo?", "")) in {"sim", "true", "s"}:
            continue
        for campo in campos_da_condicao(r.get("Condição", "")):
            if norm(campo) in campos or norm(campo) in NATIVOS_DO_DOCUMENTO:
                continue
            achados.append(Achado(
                "fluxos.csv", "campo-sem-peca-que-o-cria",
                f"o fluxo {r['Nome do Fluxo']!r} condiciona por {campo!r}, que nao "
                f"aparece em checklists.csv nem em campos-modelo.csv. Sem peca que o "
                f"crie, a regra nao configura"))

    # ── C · motivo de perda usado por automacao tem de estar no funil ──────
    if automacoes and funis:
        motivos = set()
        for r in funis:
            motivos |= {norm(m) for m in lista(r.get("Motivos de perda", ""))}
        for r in automacoes:
            for col in ("Detalhamento 1", "Detalhamento 2", "Detalhamento 3"):
                texto = r.get(col) or ""
                for m in re.findall(r"[Mm]otivo de perda:\s*[\"']?([^\"';]+)", texto):
                    if norm(m) not in motivos:
                        achados.append(Achado(
                            "automacoes.csv x funis.csv", "motivo-de-perda-inexistente",
                            f"a automacao {r['N°']} perde negocio com o motivo {m.strip()!r}, "
                            f"que nao esta cadastrado em nenhum funil"))

    # ── D · o que a automacao cita entre aspas e ninguem reconhece ─────────
    if automacoes:
        valores = set()
        for r in checklists:
            valores |= {norm(v) for v in lista(r.get("OptionsTable@Options", ""))}
            valores.add(norm(r.get("OptionsTable", "")))
        for r in funis:
            for col in ("Motivos de perda", "Quem vê", "Nome do Funil",
                        "Unidade singular", "Unidade plural"):
                valores |= {norm(v) for v in lista(r.get(col, ""))}
        for r in ler(pasta / "etapas.csv"):
            valores.add(norm(r.get("Etapa", "")))
        for r in modelos:
            valores.add(norm(r.get("Nome do Modelo", "")))

        # E · etapa de DESTINO citada no detalhamento tem de existir.
        # Nenhum validador confere isso: o portao de automacoes so olha o Filtro
        # do gatilho, e "Alterar estagio" / "Duplicar negocio" nomeiam o destino
        # no Detalhamento. Destino com erro de digitacao nao para nada hoje.
        etapas_rows = ler(pasta / "etapas.csv")
        nomes_funil = {norm(r.get("Funil", "")) for r in etapas_rows}
        nomes_etapa = {norm(r.get("Etapa", "")) for r in etapas_rows}

        desconhecidos: dict[str, list[str]] = {}
        for r in automacoes:
            texto = " ".join(r.get(c) or "" for c in
                             ("Filtro", "Detalhamento 1", "Detalhamento 2", "Detalhamento 3"))
            for t in re.findall(r'"([^"]{3,60})"', texto):
                k = norm(t)
                if not k:
                    continue
                if ">" in t and etapas_rows:          # referencia funil > etapa
                    fu, _, et = t.partition(">")
                    if norm(fu) not in nomes_funil:
                        achados.append(Achado(
                            "automacoes.csv x etapas.csv", "funil-de-destino-inexistente",
                            f"a automacao {r['N°']} aponta para o funil {fu.strip()!r}, "
                            f"que nao esta no desenho"))
                    if norm(et) not in nomes_etapa:
                        achados.append(Achado(
                            "automacoes.csv x etapas.csv", "etapa-de-destino-inexistente",
                            f"a automacao {r['N°']} aponta para a etapa {et.strip()!r}, "
                            f"que nao esta no desenho"))
                    continue
                if k not in campos and k not in valores:
                    desconhecidos.setdefault(t, []).append(r["N°"])
        for t, ns in sorted(desconhecidos.items()):
            achados.append(Achado(
                "automacoes.csv", "citacao-nao-reconhecida", severidade="aviso",
                detalhe=f"{t!r} (automacao {', '.join(ns)}) nao bate com campo de "
                        f"nenhuma peca nem com valor de opcao conhecido — confirme se e "
                        f"valor literal ou campo que falta criar"))

    # ── F · o que a tela propria exige tem de existir na cadeia ────────────
    # A indicacao-de-tela roda ANTES do passo 1 e declara, por tela, o que
    # ela usa pelo nome. Nenhuma peca da cadeia le esse arquivo: sem esta
    # checagem, a tela chega na construcao apontando para funil que nao existe.
    pasta_telas = pasta.parent / "telas"
    etapas_f = ler(pasta / "etapas.csv")
    funis_f = {norm(r.get("Nome do Funil", "")) for r in funis}
    etapas_por_funil = {(norm(r.get("Funil", "")), norm(r.get("Etapa", ""))) for r in etapas_f}
    modelos_f = {norm(r.get("Nome do Modelo", "")) for r in modelos}
    motivos_f = set()
    for r in funis:
        motivos_f |= {norm(m) for m in lista(r.get("Motivos de perda", ""))}
    for slug in telas_que_seguem(pasta_telas):
        req = pasta_telas / slug / "requisitos-da-cadeia.csv"
        if not req.exists():
            achados.append(Achado(
                f"telas/{slug}", "tela-sem-requisitos",
                "a tela segue e nao tem requisitos-da-cadeia.csv — a fase C da "
                "indicacao-de-tela nao terminou"))
            continue
        peca = f"telas/{slug} x arquivos-de-configuracao"
        for r in ler(req):
            tipo, nome = norm(r.get("Tipo", "")), (r.get("Nome") or "").strip()
            funil = (r.get("Funil") or "").strip()
            if not nome:
                continue
            if tipo == "funil" and funis and norm(nome) not in funis_f:
                achados.append(Achado(peca, "tela-funil-inexistente",
                    f"a tela usa o funil {nome!r}, que nao esta em funis.csv — volta ao passo 2 (configuracao-de-funis)"))
            elif tipo == "etapa" and etapas_f and (norm(funil), norm(nome)) not in etapas_por_funil:
                achados.append(Achado(peca, "tela-etapa-inexistente",
                    f"a tela usa a etapa {funil!r} > {nome!r}, que nao esta em etapas.csv "
                    f"— volta ao passo 2 (configuracao-de-funis)"))
            elif tipo == "modelo" and modelos and norm(nome) not in modelos_f:
                achados.append(Achado(peca, "tela-modelo-inexistente",
                    f"a tela usa o modelo {nome!r}, que nao esta em modelos.csv — volta ao passo 1 (configuracao-de-proposta)"))
            elif tipo == "motivo-de-perda" and funis and norm(nome) not in motivos_f:
                achados.append(Achado(peca, "tela-motivo-inexistente",
                    f"a tela usa o motivo de perda {nome!r}, que nenhum funil cadastra "
                    f"— volta ao passo 2 (configuracao-de-funis)"))
            elif tipo == "campo" and norm(nome) not in campos:
                achados.append(Achado(peca, "tela-campo-fora-da-cadeia", severidade="aviso",
                    detalhe=f"a tela usa o campo {nome!r}, que nenhuma peca da cadeia cria "
                            f"— fica no roteiro da tela (parte c) e se declara na entrega"))

    return achados


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("pasta", type=Path)
    args = ap.parse_args()

    presentes = [p.name for p in sorted(args.pasta.glob("*.csv"))]
    print(f"COERENCIA ENTRE AS PECAS — {args.pasta}")
    print(f"  pecas na pasta: {', '.join(presentes) if presentes else '(nenhuma)'}\n")

    achados = validar(args.pasta)
    bloqueios = [a for a in achados if a.severidade == "bloqueio"]
    avisos = [a for a in achados if a.severidade == "aviso"]

    if not achados:
        print("[OK] as pecas costuram entre si.")
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
