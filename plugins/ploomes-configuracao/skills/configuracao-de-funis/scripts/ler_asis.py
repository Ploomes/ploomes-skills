"""Le o BPMN do as-is e devolve o processo em forma estruturada.

O XML cru nao e insumo utilizavel: e milhares de linhas onde a geometria ocupa
mais espaco que o processo. Este script extrai so o que decide corte de funil —
quem faz o que, onde o processo decide, e em que arestas o dono muda.

Nao existe "a sequencia" do processo quando ha gateway e ramo paralelo: por isso
o trabalho sai agrupado por raia, e nao numa lista ordenada que seria mentira.

Ele NAO decide nada. Corte de funil e decisao da skill; aqui sai a evidencia.

    python ler_asis.py as-is-<cliente>.bpmn [--json saida.json]
"""
from __future__ import annotations

import argparse
import json
import re
import unicodedata
import xml.etree.ElementTree as ET
from collections import Counter, defaultdict
from pathlib import Path

BPMN = "{http://www.omg.org/spec/BPMN/20100524/MODEL}"

# Tipos que representam trabalho, e nao decoracao ou controle de fluxo.
TIPOS_TRABALHO = {
    "task", "userTask", "serviceTask", "manualTask", "scriptTask",
    "sendTask", "receiveTask", "businessRuleTask", "callActivity", "subProcess",
    # extensoes do Ploomes: um to-be gerado tambem volta por aqui
    "funnelSubProcess", "automationTask", "approvalTask", "integrationTask",
    "applicationTask",
}
TIPOS_DECISAO = {"exclusiveGateway", "inclusiveGateway", "parallelGateway",
                 "eventBasedGateway", "complexGateway"}
TIPOS_EVENTO = {"startEvent", "endEvent", "intermediateCatchEvent",
                "intermediateThrowEvent", "boundaryEvent"}


def sem_ns(tag: str) -> str:
    return tag.split("}", 1)[-1] if "}" in tag else tag


def norm(texto: str) -> str:
    texto = unicodedata.normalize("NFD", str(texto or ""))
    texto = "".join(c for c in texto if unicodedata.category(c) != "Mn")
    return re.sub(r"\s+", " ", texto).strip().lower()


def ler(caminho: Path) -> dict:
    raiz = ET.parse(caminho).getroot()

    # ---------------------------------------------------------------- pools
    pools: dict[str, str] = {}      # processRef -> nome do pool
    for part in raiz.iter(f"{BPMN}participant"):
        ref = part.get("processRef")
        if ref:
            pools[ref] = part.get("name") or "(pool sem nome)"

    elementos: dict[str, dict] = {}
    raia_do_elemento: dict[str, str] = {}
    fluxos: list[tuple[str, str, str]] = []   # origem, destino, condicao

    for processo in raiz.iter(f"{BPMN}process"):
        nome_pool = pools.get(processo.get("id"), processo.get("name") or "(processo)")

        for raia in processo.iter(f"{BPMN}lane"):
            nome_raia = raia.get("name") or "(raia sem nome)"
            for ref in raia.iter(f"{BPMN}flowNodeRef"):
                if ref.text:
                    raia_do_elemento[ref.text.strip()] = nome_raia

        for filho in processo.iter():  # inclui plm:* dentro do processo
            tipo = sem_ns(filho.tag)
            ident = filho.get("id")
            if not ident:
                continue
            if tipo == "sequenceFlow":
                cond = ""
                for c in filho.iter(f"{BPMN}conditionExpression"):
                    cond = (c.text or "").strip()
                fluxos.append((filho.get("sourceRef"), filho.get("targetRef"), cond))
                continue
            if tipo in TIPOS_TRABALHO | TIPOS_DECISAO | TIPOS_EVENTO:
                doc = ""
                for d in filho.iter(f"{BPMN}documentation"):
                    doc = (d.text or "").strip()
                elementos[ident] = {
                    "id": ident,
                    "tipo": tipo,
                    "nome": (filho.get("name") or "").strip(),
                    "documentacao": doc,
                    "pool": nome_pool,
                }

    # O as-is desenha um pool por jornada, e a passagem de uma jornada para a
    # seguinte e message flow ("Segue em" -> "Vem de"): sem ele, a fronteira
    # entre pools some.
    ligados = set()
    for msg in raiz.iter(f"{BPMN}messageFlow"):
        fluxos.append((msg.get("sourceRef"), msg.get("targetRef"), ""))
        ligados.add(msg.get("sourceRef"))

    # Sem message flow (a revisao no PAM, o Ploomes Architecture Mapper, pode apaga-lo), a passagem ainda se le
    # pelo nome: "Segue em X" no pool da jornada A casa com "Vem de A" no pool
    # da jornada X.
    def _n(t):
        import unicodedata
        t = unicodedata.normalize("NFD", str(t or "")).lower()
        return "".join(c for c in t if unicodedata.category(c) != "Mn").strip()

    def _jornada(pool):
        pool = pool.split(" · ", 1)[0]
        return _n(pool.split(":", 1)[1] if ":" in pool else pool)

    vem = {}
    for i, e in elementos.items():
        if e["tipo"] == "startEvent" and e["nome"].startswith("Vem de "):
            vem[(_jornada(e["pool"]), _n(e["nome"][7:]))] = i
    for i, e in elementos.items():
        if e["tipo"] == "endEvent" and e["nome"].startswith("Segue em ") and i not in ligados:
            par = vem.get((_n(e["nome"][9:]), _jornada(e["pool"])))
            if par:
                fluxos.append((i, par, ""))

    for ident, dados in elementos.items():
        dados["raia"] = raia_do_elemento.get(ident, "(sem raia)")

    # ------------------------------------------------- ordem topologica simples
    saida = defaultdict(list)
    entrada = Counter()
    for origem, destino, _ in fluxos:
        if origem in elementos and destino in elementos:
            saida[origem].append(destino)
            entrada[destino] += 1

    ordem: list[str] = []
    visitados: set[str] = set()
    inicio = [i for i in elementos if entrada[i] == 0]
    pilha = sorted(inicio) or sorted(elementos)
    while pilha:
        atual = pilha.pop(0)
        if atual in visitados:
            continue
        visitados.add(atual)
        ordem.append(atual)
        for prox in saida.get(atual, []):
            if prox not in visitados:
                pilha.append(prox)
    for i in elementos:
        if i not in visitados:
            ordem.append(i)

    # ------------------------------------------- fronteiras: onde o dono muda
    #
    # Fronteira e ARESTA, nao vizinhanca na travessia. Com gateway e evento no
    # meio, tarefa->gateway->tarefa continua sendo uma passagem de bastao — entao
    # atravessamos o que nao e trabalho ate achar a proxima tarefa.
    trabalho = [elementos[i] for i in ordem if elementos[i]["tipo"] in TIPOS_TRABALHO]

    def proximas_tarefas(ident: str, visto: set[str] | None = None) -> list[str]:
        visto = visto or set()
        achadas: list[str] = []
        for destino in saida.get(ident, []):
            if destino in visto:
                continue
            visto.add(destino)
            if elementos[destino]["tipo"] in TIPOS_TRABALHO:
                achadas.append(destino)
            else:
                achadas.extend(proximas_tarefas(destino, visto))
        return achadas

    fronteiras = []
    pares = Counter()
    for origem in elementos:
        if elementos[origem]["tipo"] not in TIPOS_TRABALHO:
            continue
        a = elementos[origem]
        for destino in proximas_tarefas(origem):
            b = elementos[destino]
            mudou_pool = norm(a["pool"]) != norm(b["pool"])
            mudou_raia = norm(a["raia"]) != norm(b["raia"])
            if not (mudou_pool or mudou_raia):
                continue
            pares[(a["raia"], b["raia"])] += 1
            fronteiras.append({
                "de": a["nome"] or "(sem nome)",
                "raia_de": a["raia"],
                "para": b["nome"] or "(sem nome)",
                "raia_para": b["raia"],
                "muda_pool": mudou_pool,
            })

    decisoes = [elementos[i] for i in ordem if elementos[i]["tipo"] in TIPOS_DECISAO]
    eventos = [elementos[i] for i in ordem if elementos[i]["tipo"] in TIPOS_EVENTO]

    return {
        "arquivo": caminho.name,
        "pools": sorted(set(e["pool"] for e in elementos.values())),
        "raias": sorted(set(e["raia"] for e in elementos.values())),
        "qtd_elementos": len(elementos),
        "qtd_trabalho": len(trabalho),
        "qtd_decisoes": len(decisoes),
        "qtd_eventos": len(eventos),
        "trabalho": [
            {"ordem": n, "nome": e["nome"], "tipo": e["tipo"], "raia": e["raia"],
             "pool": e["pool"], "documentacao": e["documentacao"]}
            for n, e in enumerate(trabalho, 1)
        ],
        "decisoes": [{"nome": e["nome"], "raia": e["raia"], "pool": e["pool"]}
                     for e in decisoes],
        "eventos": [{"nome": e["nome"], "tipo": e["tipo"], "raia": e["raia"]}
                    for e in eventos],
        "fronteiras_candidatas": fronteiras,
        "passagens_por_par_de_raia": [
            {"de": de, "para": para, "vezes": n}
            for (de, para), n in pares.most_common()
        ],
        "trabalho_por_raia": {
            raia: [e["nome"] or "(sem nome)" for e in trabalho if e["raia"] == raia]
            for raia in sorted(set(e["raia"] for e in trabalho))
        },
        "sem_nome": [e["id"] for e in elementos.values() if not e["nome"]],
    }


def relatorio(d: dict) -> str:
    linhas = [
        f"AS-IS: {d['arquivo']}",
        f"  {d['qtd_elementos']} elementos — {d['qtd_trabalho']} de trabalho, "
        f"{d['qtd_decisoes']} decisões, {d['qtd_eventos']} eventos",
        f"  Pools ({len(d['pools'])}): " + ", ".join(d["pools"]),
        f"  Raias ({len(d['raias'])}): " + ", ".join(d["raias"][:12])
        + (" …" if len(d["raias"]) > 12 else ""),
        "",
        "TRABALHO POR RAIA  (quem faz o quê — não é a ordem do processo)",
    ]
    for raia, tarefas in d["trabalho_por_raia"].items():
        linhas.append(f"  {raia} ({len(tarefas)})")
        for nome in tarefas:
            linhas.append(f"      - {nome}")

    if d["decisoes"]:
        linhas += ["", "PONTOS DE DECISÃO"]
        for g in d["decisoes"]:
            linhas.append(f"  - [{g['raia']}] {g['nome'] or '(sem nome)'}")

    linhas += ["", "PASSAGENS DE BASTÃO  (arestas reais em que o dono muda)",
               "  Par de raias com muitas passagens = mesmo processo, dois papéis.",
               "  Par com uma ou duas = provável fronteira de funil. Confirme contra",
               "  ritmo e critério de sucesso antes de separar."]
    for p in d["passagens_por_par_de_raia"]:
        linhas.append(f"  {p['vezes']:3d}x  {p['de']}  →  {p['para']}")

    linhas += ["", f"  Detalhe ({len(d['fronteiras_candidatas'])} passagens):"]
    for f in d["fronteiras_candidatas"][:25]:
        marca = "POOL" if f["muda_pool"] else "raia"
        linhas.append(f"    [{marca}] {f['de']} → {f['para']}")
    if len(d["fronteiras_candidatas"]) > 25:
        linhas.append(f"    … e mais {len(d['fronteiras_candidatas']) - 25}")

    if d["sem_nome"]:
        linhas += ["", f"ATENÇÃO: {len(d['sem_nome'])} elemento(s) sem nome no desenho — "
                       f"o as-is está incompleto nesses pontos."]
    return "\n".join(linhas)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("bpmn", type=Path)
    parser.add_argument("--json", type=Path, default=None)
    args = parser.parse_args()

    dados = ler(args.bpmn)
    print(relatorio(dados))
    if args.json:
        args.json.write_text(json.dumps(dados, ensure_ascii=False, indent=1), encoding="utf-8")
        print(f"\n[ok] estrutura salva em {args.json}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
