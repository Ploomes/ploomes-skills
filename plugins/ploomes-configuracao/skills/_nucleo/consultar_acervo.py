"""Consulta ao acervo — as tres fases do protocolo, executaveis.

  Fase 1  perfil do cliente     — segmento, MOC (modelo de operação comercial da empresa), tipo de venda e porte definem as contas
                                  COMPARAVEIS (o "N de M" do racional) e pesam na ordem;
                                  com --estrito, viram filtro que descarta o resto
  Fase 2  busca                 — BM25 por campo sobre um indice montado na carga
                                  (radical em portugues, sinonimos do dominio, texto sem os
                                  payloads JSON); havendo o reordenador ao lado deste script,
                                  os 30 primeiros sao reordenados por ele
  Fase 3  higiene               — configuracao desligada nao e precedente

O filtro duro por segmento, com poucas contas, zerava consulta — por isso o perfil
pesa, e cada resultado diz se veio de conta comparavel.

SEM O ACERVO a consulta nao quebra: sem a pasta acervo/ ao lado deste script, ela
diz "acervo nao distribuido" e sai com codigo 0; a indicacao segue, e o campo
Precedente do racional sai "sem precedente (acervo nao disponivel)".

A fase 3 e DEFAULT, nao opcao: so `--incluir-mortos` traz configuracao desligada.

A saida traz o que o racional exige: o documento, a conta de origem, e a contagem
`N de M contas comparaveis` — nunca "e comum".

    python consultar_acervo.py --tipo automacao \\
           --segmento industria --moc "bens intermediarios" --busca "cobranca de proposta"
    python consultar_acervo.py --autoteste
"""
from __future__ import annotations

import argparse
import json
import math
import re
import sys
import time
import unicodedata
from collections import Counter, defaultdict
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

# O acervo, quando distribuido, fica ao lado deste script (a pasta acervo/). Sem ela, a
# consulta diz que o acervo nao foi distribuido e sai sem erro. `--acervo` so e preciso
# para apontar uma extracao local ainda nao publicada.
ACERVO_PADRAO = Path(__file__).resolve().parent / "acervo"
SEM_ACERVO = ("ACERVO NÃO DISTRIBUÍDO — esta instalação não traz o acervo de contas implantadas.\n"
              "  A indicação segue sem precedente: no racional, o campo Precedente de cada linha sai\n"
              "  \"sem precedente (acervo não disponível)\".")


def _reordenador():
    """O reordenador (reordenar_jev.py), importado so quando ha o que reordenar. Sem o
    arquivo ao lado deste script, devolve None, e a lista fica na ordem do BM25."""
    try:
        import reordenar_jev
    except ImportError:
        return None
    return reordenar_jev

TIPOS = {"funil", "checklist", "automacao", "regra", "webhook",
         "modelo_documento", "estrutura_cpq"}
LISTA_CURTA = 30   # o que o JEV reordena

# Palavras que nao discriminam nada numa busca sobre configuracao de CRM.
PARADAS = {
    "de", "da", "do", "das", "dos", "e", "o", "a", "os", "as", "um", "uma", "em",
    "no", "na", "nos", "nas", "por", "para", "com", "sem", "que", "se", "ao",
    "aos", "quando", "onde", "qual", "quais", "ser", "ter", "the", "of", "nao", "seu", "sua",
}

# Radicais que o consultor usa como a mesma coisa. Curto de proposito: sinonimo
# a mais e ruido a mais.
PEDIDO = {"pedid", "vend"}
SINONIMOS = [
    {"orcament", "cotaca", "propost"},
    {"negoci", "oportunidad", "card"},
    {"alcad", "aprovaca", "aprov"},
    {"follow", "cobr", "retorn", "lembret"},
    {"lead", "prospect", "suspect"},
    PEDIDO,
    {"desconto", "abatiment"},
    {"posvend", "pos", "implantaca", "onboard"},
    {"inativ", "reativaca", "churn"},
]
_GRUPO = {r: f"§{i}" for i, g in enumerate(SINONIMOS) for r in g}
SUFIXOS = ("amentos", "imentos", "amento", "imento", "acoes", "icoes", "acao", "icao", "ncias",
           "ncia", "mente", "idades", "idade", "ivos", "ivas", "ivo", "iva", "ados", "adas",
           "idos", "idas", "ado", "ada", "ido", "ida", "ar", "er", "ir", "es", "s", "a", "o", "e")


def norm(texto: str) -> str:
    texto = unicodedata.normalize("NFD", str(texto or ""))
    texto = "".join(c for c in texto if unicodedata.category(c) != "Mn")
    return re.sub(r"\s+", " ", texto).strip().lower()


def radical(p: str) -> str:
    """Radical grosseiro do portugues: o bastante para cobrar e cobranca cairem juntos."""
    for suf in SUFIXOS:
        if p.endswith(suf) and len(p) - len(suf) >= 4:
            return p[: -len(suf)]
    return p


def termos(texto: str) -> list[str]:
    out = []
    for p in re.split(r"[^\w]+", norm(texto)):
        if len(p) <= 2 or p in PARADAS or p.isdigit():
            continue
        r = radical(p)
        out.append(r)
        for chave, g in _GRUPO.items():
            if r.startswith(chave):
                out.append(g)
                break
    return out


def limpar(texto: str) -> str:
    """O texto sem os payloads JSON das acoes e sem os marcadores de anonimizacao —
    chaves como DateTime e RepeatIntervalUnitId eram so ruido na busca."""
    t = re.sub(r"payload:\s*\{.*", "", texto or "")
    t = re.sub(r"\{[^{}]{40,}\}", " ", t)
    return re.sub(r"\[(PESSOA|EMPRESA|TELEFONE|EMAIL|CPF|CNPJ)\]", " ", t)


# --------------------------------------------------------------- fase 3: higiene


def esta_vivo(doc: dict) -> bool:
    """Configuracao desligada nao e precedente — e tentativa que nao funcionou."""
    e = doc.get("estrutura") or {}
    f = doc.get("facetas") or {}
    if e.get("DisabledDueToError"):
        return False
    if e.get("Enabled") is False or f.get("ativa") is False:
        return False
    if e.get("Archived") or f.get("arquivado"):
        return False
    if e.get("Active") is False or f.get("ativo") is False:
        return False
    return True


# ------------------------------------------------------- fase 1: perfil do cliente


def casa_metadado(meta: dict, filtros: dict) -> bool:
    for chave, alvo in filtros.items():
        if not alvo:
            continue
        valor = meta.get(chave)
        if isinstance(valor, list):
            if not any(norm(alvo) in norm(v) for v in valor):
                return False
        elif valor is None or norm(alvo) not in norm(valor):
            return False
    return True


def parecido(meta: dict, filtros: dict) -> float:
    """0 a 1: quanto a conta se parece com o perfil pedido, faceta a faceta."""
    pesos = {"segmento": 0.35, "moc_tags": 0.30, "tipos_venda_tags": 0.20, "porte": 0.15, "cnae_divisao": 0.10}
    total = soma = 0.0
    for chave, alvo in filtros.items():
        if not alvo or chave not in pesos:
            continue
        total += pesos[chave]
        if casa_metadado(meta, {chave: alvo}):
            soma += pesos[chave]
    return soma / total if total else 0.0


def carregar(acervo: Path) -> list[dict]:
    contas = []
    ilegiveis = []
    for pasta in sorted(p for p in acervo.iterdir() if p.is_dir()):
        conta = pasta / "conta.json"
        docs = pasta / "documentos.json"
        if not (conta.exists() and docs.exists()):
            continue
        # Extracao incompleta (arquivo vazio ou JSON quebrado) nao e conta
        # comparavel: nao pode derrubar a consulta inteira, mas TEM de ser
        # declarada — ela sai do denominador do "N de M contas comparaveis".
        try:
            meta = json.loads(conta.read_text(encoding="utf-8"))
            documentos = json.loads(docs.read_text(encoding="utf-8"))
        except (json.JSONDecodeError, UnicodeDecodeError) as erro:
            ilegiveis.append(f"{pasta.name} ({erro.__class__.__name__})")
            continue
        contas.append({
            "conta_id": pasta.name,
            "meta": meta,
            "documentos": documentos,
        })
    if ilegiveis:
        print(
            f"AVISO: {len(ilegiveis)} conta(s) fora do acervo por extracao "
            f"ilegivel: {', '.join(ilegiveis)}",
            file=sys.stderr,
        )
    return contas


# ------------------------------------------------------------------- fase 2


def indexar(contas: list[dict], tipo: str | None, incluir_mortos: bool) -> tuple[list[dict], int]:
    """Os documentos do tipo pedido, com os termos contados por campo (titulo pesa
    o dobro). Devolve tambem quantos a higiene descartou."""
    docs, mortos = [], 0
    for c in contas:
        for d in c["documentos"]:
            if tipo and d.get("tipo") != tipo:
                continue
            if not incluir_mortos and not esta_vivo(d):
                mortos += 1
                continue
            facetas = " ".join(str(v) for v in (d.get("facetas") or {}).values() if isinstance(v, (str, int)))
            tf = Counter()
            for t in termos(d.get("titulo") or ""):
                tf[t] += 2.0
            corpo = termos(limpar(d.get("texto") or "") + " " + facetas)
            for t in corpo:
                tf[t] += 1.0
            docs.append({"conta": c["conta_id"], "doc": d, "tf": tf, "len": sum(tf.values())})
    return docs, mortos


def bm25(docs: list[dict], consulta: list[str], k1: float = 1.2, b: float = 0.75) -> list[float]:
    if not consulta or not docs:
        return [1.0 if not consulta else 0.0] * len(docs)
    df = Counter()
    for d in docs:
        for t in d["tf"]:
            df[t] += 1
    n, media = len(docs), sum(d["len"] for d in docs) / len(docs)
    q = Counter(consulta)
    notas = []
    for d in docs:
        s = 0.0
        for t, qtf in q.items():
            tf = d["tf"].get(t)
            if not tf:
                continue
            idf = math.log(1 + (n - df[t] + 0.5) / (df[t] + 0.5))
            s += idf * tf * (k1 + 1) / (tf + k1 * (1 - b + b * d["len"] / media)) * min(qtf, 2)
        notas.append(s)
    return notas


def consultar(contas: list[dict], tipo: str | None, filtros: dict, busca: str, incluir_mortos: bool,
              limite: int, estrito: bool = False, usar_jev: bool = True) -> dict:
    comparaveis = [c for c in contas if casa_metadado(c["meta"], filtros)]
    ids_comparaveis = {c["conta_id"] for c in comparaveis}
    universo = comparaveis if estrito else contas
    meta = {c["conta_id"]: c["meta"] for c in contas}

    docs, mortos = indexar(universo, tipo, incluir_mortos)
    notas = bm25(docs, termos(busca))
    topo = max(notas) if notas else 0.0
    achados = []
    for d, s in zip(docs, notas):
        if s <= 0:
            continue
        peso = 0.75 + 0.25 * parecido(meta[d["conta"]], filtros)
        achados.append({"nota": round(s / topo * peso, 3) if topo else 0.0, "conta": d["conta"], "doc": d["doc"],
                        "comparavel": d["conta"] in ids_comparaveis})
    achados.sort(key=lambda x: -x["nota"])

    reordenacao = "sem JEV, o reordenador semântico (pedido --sem-jev)"
    if usar_jev and achados:
        curta = achados[:LISTA_CURTA]
        cliente = {k: v for k, v in filtros.items() if v}
        t = time.perf_counter()
        reordenar_jev = _reordenador()
        try:
            if reordenar_jev is None:
                raise ImportError("reordenador não distribuído")
            probs, motivo = reordenar_jev.reordenar(
                busca, cliente, [{"titulo": a["doc"].get("titulo"), "texto": limpar(a["doc"].get("texto") or "")}
                                 for a in curta])
        except ImportError as e:
            probs, motivo = None, str(e)
        except Exception as e:  # o JEV nunca derruba a consulta, nem por defeito dele
            probs, motivo = None, f"JEV com defeito ({e.__class__.__name__})"
        if probs is None:
            reordenacao = f"sem JEV, o reordenador semântico — {motivo}; ordem do BM25"
        else:
            for a, p in zip(curta, probs):
                a["jev"] = round(p, 3)
            curta = [a for _, a in sorted(enumerate(curta), key=lambda ia: (-ia[1]["jev"], ia[0]))]
            achados = curta + achados[LISTA_CURTA:]
            reordenacao = (f"JEV, o reordenador semântico ({reordenar_jev.MODELO}), sobre os {len(curta)} primeiros do BM25, "
                           f"{time.perf_counter() - t:.1f} s")

    # PRECEDENTE conta conta comparavel com candidato de verdade: julgado util pelo JEV
    # (p >= 0,5) ou, sem ele, entre os primeiros da lista curta — e nao qualquer conta
    # que divida uma palavra com a busca, que com sinonimos seria sempre "todas"
    curta = achados[:LISTA_CURTA]
    if any("jev" in a for a in curta):
        contas_com_achado = {a["conta"] for a in curta if a["comparavel"] and a.get("jev", 0) >= 0.5}
        criterio = "julgado útil pelo JEV (o reordenador semântico)"
    else:
        contas_com_achado = {a["conta"] for a in curta if a["comparavel"]}
        criterio = f"entre os {LISTA_CURTA} primeiros da busca"
    return {
        "criterio_precedente": criterio,
        "total_contas": len(contas),
        "contas_comparaveis": len(comparaveis),
        "contas_com_achado": len(contas_com_achado),
        "quais_contas": sorted(contas_com_achado),
        "descartados_por_higiene": mortos,
        "reordenacao": reordenacao,
        "estrito": estrito,
        "achados": achados[:limite],
    }


def relatar(r: dict, filtros: dict, tipo: str | None, busca: str) -> str:
    L = ["CONSULTA AO ACERVO"]
    recorte = ", ".join(f"{k}={v}" for k, v in filtros.items() if v) or "nenhum"
    L.append(f"  Recorte: {recorte}{' (estrito: so contas comparaveis)' if r['estrito'] else ''}")
    L.append(f"  Tipo: {tipo or 'todos'}   Busca: {busca or '(sem termo)'}")
    L.append("")
    L.append(f"  Fase 1 — {r['contas_comparaveis']} de {r['total_contas']} contas "
             f"comparaveis pelo perfil")
    L.append(f"  Fase 3 — {r['descartados_por_higiene']} documento(s) descartado(s) "
             f"por estarem desligados")
    L.append(f"  Ordem — {r['reordenacao']}")
    L.append("")

    if r["estrito"] and r["contas_comparaveis"] == 0:
        L.append("  Nenhuma conta comparável. Afrouxe o recorte — e diga no racional")
        L.append("  que a indicação saiu SEM precedente.")
        return "\n".join(L)

    L.append(f"  PRECEDENTE: {r['contas_com_achado']} de {r['contas_comparaveis']} "
             f"contas comparáveis ({r['criterio_precedente']})  →  {', '.join(r['quais_contas']) or '—'}")
    if r["contas_comparaveis"] < 3:
        L.append("  ATENÇÃO: menos de 3 contas comparáveis. Isso é anedota, não")
        L.append("  frequência. Declare o tamanho da amostra no racional.")
    L.append("")

    for i, a in enumerate(r["achados"], 1):
        d = a["doc"]
        origem = "comparável" if a["comparavel"] else "outra operação"
        jev = f"  reordenador JEV {a['jev']:.2f}" if "jev" in a else ""
        L.append(f"  [{i}] {a['nota']:.2f}{jev}  {a['conta']} ({origem})  ·  {d.get('tipo')}")
        for linha in (d.get("texto") or "").split("\n")[:6]:
            L.append(f"        {linha}")
        L.append("")
    if not r["achados"]:
        L.append("  Nenhum documento casa com a busca.")
    return "\n".join(L)


# ------------------------------------------------------------------- autoteste


def autoteste() -> int:
    import tempfile
    casos = []
    contas = [
        {"conta_id": "T1", "meta": {"segmento": "Industria", "moc_tags": ["bens intermediarios"]}, "documentos": [
            {"doc_id": "T1:a", "tipo": "automacao", "titulo": "Follow Up - 2 dias",
             "texto": "Automacao: Follow Up\nGatilho: Negocio entrou em Proposta enviada\n  Acao 1: Criar tarefa cobrar retorno",
             "facetas": {}},
            {"doc_id": "T1:b", "tipo": "automacao", "titulo": "Desligada", "texto": "cobrar proposta",
             "facetas": {"ativa": False}}]},
        {"conta_id": "T2", "meta": {"segmento": "Distribuicao"}, "documentos": [
            {"doc_id": "T2:a", "tipo": "automacao", "titulo": "Lembrete de cotacao",
             "texto": "Automacao: lembrete\nGatilho: periodicamente\n  Acao 1: Enviar e-mail sobre a cotacao sem resposta",
             "facetas": {}},
            {"doc_id": "T2:b", "tipo": "checklist", "titulo": "Dados", "texto": "CNPJ obrigatorio", "facetas": {}}]},
    ]
    filtros = {"segmento": "industria"}
    r = consultar(contas, "automacao", filtros, "cobrar retorno da proposta enviada", False, 8, usar_jev=False)
    casos.append(("acha o precedente e descarta o desligado",
                  [a["doc"]["doc_id"] for a in r["achados"]][:1] == ["T1:a"] and r["descartados_por_higiene"] == 1))
    casos.append(("sinonimo: cotacao casa com proposta", any(a["doc"]["doc_id"] == "T2:a" for a in r["achados"])))
    casos.append(("conta fora do perfil entra marcada, e nao conta no N de M",
                  r["contas_comparaveis"] == 1 and r["quais_contas"] == ["T1"]
                  and any(not a["comparavel"] for a in r["achados"])))
    re_ = consultar(contas, "automacao", filtros, "cobrar retorno da proposta enviada", False, 8, estrito=True,
                    usar_jev=False)
    casos.append(("--estrito descarta a conta fora do perfil", all(a["comparavel"] for a in re_["achados"])))
    # sem o acervo: diz que nao foi distribuido e sai 0; com --acervo apontando pasta que nao existe, e erro
    import contextlib
    import io
    global ACERVO_PADRAO
    original_padrao = ACERVO_PADRAO
    with tempfile.TemporaryDirectory() as t:
        try:
            ACERVO_PADRAO = Path(t) / "acervo"
            saida = io.StringIO()
            with contextlib.redirect_stdout(saida):
                with contextlib.redirect_stderr(io.StringIO()) as erro:
                    cod = main(["--tipo", "automacao", "--busca", "cobranca de proposta"])
            casos.append(("sem o acervo: 'acervo não distribuído', código 0 e o Precedente do racional",
                          cod == 0 and "ACERVO NÃO DISTRIBUÍDO" in saida.getvalue()
                          and "Reinstale" not in erro.getvalue()
                          and "sem precedente (acervo não disponível)" in saida.getvalue()))
            saida = io.StringIO()
            with contextlib.redirect_stdout(saida):
                cod = main(["--acervo", str(Path(t) / "outra"), "--busca", "x"])
            casos.append(("--acervo para pasta que não existe: erro, não 'não distribuído'",
                          cod == 2 and "NÃO DISTRIBUÍDO" not in saida.getvalue()))
        finally:
            ACERVO_PADRAO = original_padrao
    # sem o reordenador ao lado do script: a lista fica na ordem do BM25, e a saida diz por que
    original_reordenador = globals()["_reordenador"]
    globals()["_reordenador"] = lambda: None
    try:
        rn = consultar(contas, "automacao", filtros, "cobrar retorno da proposta enviada", False, 8)
        casos.append(("sem o reordenador: ordem do BM25, e diz por que",
                      rn["achados"][0]["doc"]["doc_id"] == "T1:a" and "não distribuído" in rn["reordenacao"]))
    finally:
        globals()["_reordenador"] = original_reordenador
    with tempfile.TemporaryDirectory() as t:
        for c in contas:
            p = Path(t) / c["conta_id"]
            p.mkdir()
            (p / "conta.json").write_text(json.dumps(c["meta"]), encoding="utf-8")
            (p / "documentos.json").write_text(json.dumps(c["documentos"]), encoding="utf-8")
        (Path(t) / "T3").mkdir()
        (Path(t) / "T3" / "conta.json").write_text("{}", encoding="utf-8")
        (Path(t) / "T3" / "documentos.json").write_text("", encoding="utf-8")
        casos.append(("extracao ilegivel fica fora, sem derrubar a carga", len(carregar(Path(t))) == 2))
    for nome, ok in casos:
        print(("ok   " if ok else "FALHA ") + nome)
    falhas = sum(1 for _, ok in casos if not ok)
    print(f"{len(casos) - falhas} de {len(casos)} casos")
    return 1 if falhas else 0


def main(argv: list[str] | None = None) -> int:
    argv = sys.argv[1:] if argv is None else argv
    if argv == ["--autoteste"]:
        return autoteste()
    ap = argparse.ArgumentParser()
    ap.add_argument("--acervo", type=Path, default=None,
                    help="pasta do acervo anonimo (padrao: a pasta acervo/ ao lado deste script)")
    ap.add_argument("--tipo", choices=sorted(TIPOS), default=None)
    ap.add_argument("--busca", default="")
    ap.add_argument("--segmento", default="")
    ap.add_argument("--moc", default="")
    ap.add_argument("--tipo-venda", default="")
    ap.add_argument("--porte", default="")
    ap.add_argument("--cnae", default="")
    ap.add_argument("--incluir-mortos", action="store_true",
                    help="inclui configuração desligada — use só para estudar o que falhou")
    ap.add_argument("--estrito", action="store_true",
                    help="só contas que casam com o recorte inteiro (o comportamento anterior)")
    ap.add_argument("--sem-jev", action="store_true", help="não reordena com o JEV, o reordenador semântico")
    ap.add_argument("--limite", type=int, default=8)
    ap.add_argument("--json", type=Path, default=None)
    args = ap.parse_args(argv)

    filtros = {
        "segmento": args.segmento,
        "moc_tags": args.moc,
        "tipos_venda_tags": args.tipo_venda,
        "porte": args.porte,
        "cnae_divisao": args.cnae,
    }
    if args.acervo is None:
        # sem a pasta padrao, o acervo nao veio nesta instalacao: nao e erro, e a peca segue
        if not ACERVO_PADRAO.is_dir():
            print(SEM_ACERVO)
            return 0
        args.acervo = ACERVO_PADRAO
    elif not args.acervo.is_dir():
        print(f"[!] {args.acervo} não é uma pasta. Confira o --acervo.")
        return 2
    contas = carregar(args.acervo)
    if not contas:
        print(f"[!] nenhuma conta em {args.acervo}. O acervo está vazio — "
              f"toda indicação sai sem precedente.")
        return 2

    r = consultar(contas, args.tipo, filtros, args.busca, args.incluir_mortos, args.limite,
                  estrito=args.estrito, usar_jev=not args.sem_jev)
    print(relatar(r, filtros, args.tipo, args.busca))
    if args.json:
        args.json.write_text(json.dumps(r, ensure_ascii=False, indent=1, default=str), encoding="utf-8")
    return 0


if __name__ == "__main__":
    for fluxo in (sys.stdout, sys.stderr):
        try:
            fluxo.reconfigure(encoding="utf-8", errors="replace")   # a seta do relatorio quebrava no console do Windows
        except AttributeError:
            pass
    raise SystemExit(main())
