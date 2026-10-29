"""Analisa os modelos de proposta de uma conta: formato, variaveis e memorial.

Responde quatro perguntas que so o HTML e os campos juntos respondem:

  1. QUAIS MODELOS RODAM     — e nao apenas quais existem
  2. COMO O DOCUMENTO E FEITO — secoes, cabecalho, rodape, onde entram os niveis
  3. QUAIS SAO AS VARIAVEIS   — e de que entidade cada uma vem
  4. ONDE O CALCULO ACONTECE  — dentro do Ploomes, ou numa consulta ao ERP

E monta o GRAFO DE DEPENDENCIA entre variaveis. As arestas nao sao inferidas do
texto: saem de `Fields.FormulaVariables`, onde cada variavel declara o campo de
origem (`VariableFieldKey`) e o campo que ela alimenta (`FieldKey`).

    python analisar_proposta.py <pasta-da-conta> [--uso uso.json]
                                [--grafo dependencias.mmd] [--json saida.json]
"""
from __future__ import annotations

import argparse
import json
import re
from collections import Counter, defaultdict
from pathlib import Path
from urllib.parse import urlsplit

# Sintaxe de referencia a campo no HTML do modelo: [Entidade.Campo].
# O field-path aparece na propria entidade, separado por " / ":
#   [Negócio / Usuário.Nome]  →  do negocio, navega ate o usuario, pega o Nome
RE_REF = re.compile(r"\[([^\[\]\n]{2,120})\]")

# Os quatro niveis da hierarquia de um PVD.
NIVEIS = {
    "proposta": "PVD", "venda": "PVD", "documento": "PVD",
    "bloco": "Bloco",
    "produto da proposta": "Produto", "produto da venda": "Produto",
    "opcionais": "Opcional", "parte do produto": "Opcional",
    "vinculo de produto da proposta": "Opcional",
}



def sem_parametros(url):
    """A URL de fórmula externa sem query string nem fragmento: ali pode ir um token."""
    if not url:
        return url
    p = urlsplit(url)
    return f"{p.scheme}://{p.netloc}{p.path}" if p.scheme else p.path

def norm(texto: str) -> str:
    import unicodedata
    texto = unicodedata.normalize("NFD", str(texto or ""))
    texto = "".join(c for c in texto if unicodedata.category(c) != "Mn")
    return re.sub(r"\s+", " ", texto).strip().lower()


def nivel_de(entidade: str) -> str:
    base = norm(entidade.split("/")[0])
    return NIVEIS.get(base, "Vinculada")


def carregar(pasta: Path, nome: str):
    caminho = pasta / f"{nome}.json"
    return json.loads(caminho.read_text(encoding="utf-8")) if caminho.exists() else []


# --------------------------------------------------------------------- formato


def analisar_formato(modelo: dict, html: dict) -> dict:
    paginas = html.get("Pages") or []
    secoes = []
    for i, pg in enumerate(paginas, 1):
        corpo = pg.get("BodySourceCode") or ""
        refs = [r for r in RE_REF.findall(corpo) if "." in r]
        niveis = Counter(nivel_de(r.split(".", 1)[0]) for r in refs)
        secoes.append({
            "ordem": pg.get("Ordination", i),
            "nome": pg.get("Name") or f"Seção {i}",
            "tamanho_corpo": len(corpo),
            "tem_cabecalho": bool(pg.get("HeaderSourceCode")),
            "tem_rodape": bool(pg.get("FooterSourceCode")),
            "qtd_referencias": len(refs),
            "niveis_presentes": dict(niveis),
            "tem_produtos": niveis.get("Produto", 0) > 0,
            "tem_opcionais": niveis.get("Opcional", 0) > 0,
            "tem_blocos": niveis.get("Bloco", 0) > 0,
        })

    corpo_solto = html.get("BodySourceCode") or ""
    return {
        "id": modelo.get("Id"),
        "nome": modelo.get("Name"),
        "entidade": (modelo.get("Entity") or {}).get("Name"),
        "formato_novo": modelo.get("NewFormat"),
        "padrao_do_funil": modelo.get("Default"),
        "tem_capa": modelo.get("HasCoverPage"),
        "tem_paginacao": modelo.get("HasPaging"),
        "modelo_externo": modelo.get("ExternalTemplate"),
        "qtd_secoes": len(secoes),
        "secoes": secoes,
        "html_fora_de_secao": len(corpo_solto),
        "queries_customizadas": [k for k, v in (modelo.get("Query") or {}).items()
                                 if v and k != "Id"],
        "ultima_alteracao": modelo.get("LastUpdateDate"),
    }


# ------------------------------------------------------------------- variaveis


def analisar_variaveis(paginas_html: str) -> dict:
    refs = [r for r in RE_REF.findall(paginas_html) if "." in r]
    por_variavel = Counter(refs)
    por_entidade = Counter(r.split(".", 1)[0].strip() for r in refs)
    com_field_path = {r for r in refs if "/" in r.split(".", 1)[0]}
    return {
        "total_referencias": len(refs),
        "variaveis_distintas": len(por_variavel),
        "por_entidade": dict(por_entidade.most_common()),
        "por_nivel": dict(Counter(nivel_de(r.split(".", 1)[0]) for r in refs)),
        "mais_usadas": por_variavel.most_common(20),
        "que_usam_field_path": sorted(com_field_path),
    }


# ----------------------------------------------------------- memorial de calculo


def analisar_calculo(campos: list[dict]) -> dict:
    """Classifica cada campo calculado por ONDE a conta acontece."""
    por_chave = {c.get("Key"): c for c in campos if c.get("Key")}
    nos: dict[str, dict] = {}
    arestas: list[dict] = []

    for c in campos:
        chave = c.get("Key")
        if not chave:
            continue
        interna = bool(c.get("InternalFormula"))
        externa = bool(c.get("ExternalFormulaUrl"))
        gerada = bool(c.get("GeneratedFormula"))
        variaveis = c.get("FormulaVariables") or []
        if not (interna or externa or gerada or variaveis):
            continue

        if externa:
            onde = "consulta externa (API/ERP)"
        elif interna:
            onde = "fórmula JavaScript no Ploomes"
        elif gerada:
            onde = "fórmula nativa gerada"
        else:
            onde = "referência de campo"

        nos[chave] = {
            "chave": chave,
            "nome": c.get("Name"),
            "entidade": (c.get("Entity") or {}).get("Name"),
            "onde_calcula": onde,
            "url_externa": sem_parametros(c.get("ExternalFormulaUrl")),
            "metodo_externo": c.get("ExternalFormulaMethod"),
            "qtd_variaveis": len(variaveis),
            "formula": (c.get("InternalFormula") or "")[:600],
        }

        # A aresta sai do dado declarado, nao de leitura do texto da formula.
        for v in variaveis:
            origem = v.get("VariableFieldKey")
            if not origem:
                continue
            arestas.append({
                "de": origem,
                "para": chave,
                "rotulo": v.get("VariableName") or "",
                "propriedade": v.get("VariableProperty"),
                "field_path": v.get("FieldPathId"),
                "obrigatoria": bool(v.get("Required")),
            })

    # entradas = campos que so alimentam e nao sao calculados
    calculados = set(nos)
    origens = {a["de"] for a in arestas}
    entradas = sorted(origens - calculados)
    folhas = sorted(calculados - {a["de"] for a in arestas})

    return {
        "todos_os_campos": {
            k: {"nome": c.get("Name"), "entidade": (c.get("Entity") or {}).get("Name")}
            for k, c in por_chave.items()
        },
        "campos_calculados": len(nos),
        "onde_calcula": dict(Counter(n["onde_calcula"] for n in nos.values())),
        "nos": nos,
        "arestas": arestas,
        "entradas_manuais": [
            {"chave": k,
             "nome": (por_chave.get(k) or {}).get("Name") or k,
             "entidade": ((por_chave.get(k) or {}).get("Entity") or {}).get("Name") or "?"}
            for k in entradas
        ],
        "resultados_finais": [
            {"chave": k, "nome": nos[k]["nome"], "entidade": nos[k]["entidade"]}
            for k in folhas
        ],
        "consultas_externas": [
            {"nome": n["nome"], "entidade": n["entidade"], "url": n["url_externa"],
             "metodo": n["metodo_externo"]}
            for n in nos.values() if n["url_externa"]
        ],
    }


def mermaid(calculo: dict, limite: int = 60) -> str:
    """Grafo de dependencia entre variaveis, em Mermaid."""
    nos, arestas = calculo["nos"], calculo["arestas"][:limite]
    usados = {a["de"] for a in arestas} | {a["para"] for a in arestas}

    catalogo = calculo.get("todos_os_campos", {})

    def rotulo(chave: str) -> str:
        n = nos.get(chave) or catalogo.get(chave)
        if n and n.get("nome"):
            return f"{n.get('entidade') or '?'}.{n['nome']}"
        return chave

    def ident(chave: str) -> str:
        return "n" + re.sub(r"[^A-Za-z0-9]", "_", chave)

    linhas = ["graph LR"]
    for chave in sorted(usados):
        texto = rotulo(chave).replace('"', "'")
        n = nos.get(chave)
        if n and n["url_externa"]:
            linhas.append(f'  {ident(chave)}["{texto}"]:::externo')
        elif n:
            linhas.append(f'  {ident(chave)}["{texto}"]:::calculado')
        else:
            linhas.append(f'  {ident(chave)}("{texto}"):::entrada')
    for a in arestas:
        linhas.append(f'  {ident(a["de"])} --> {ident(a["para"])}')
    linhas += [
        "  classDef entrada fill:#eef,stroke:#88a;",
        "  classDef calculado fill:#efe,stroke:#8a8;",
        "  classDef externo fill:#fee,stroke:#a88;",
    ]
    if len(calculo["arestas"]) > limite:
        linhas.append(f'  %% {len(calculo["arestas"]) - limite} arestas omitidas')
    return "\n".join(linhas)


# ---------------------------------------------------------------------- saida


def relatorio(d: dict) -> str:
    L = [f"MODELOS DE PVD — {d['conta']}", ""]

    L.append(f"MODELOS ({d['qtd_modelos']} no total, {len(d['modelos_ativos'])} com uso declarado)")
    for m in d["formato"]:
        marca = "ATIVO" if m["nome"] in d["modelos_ativos"] else "  ?  "
        L.append(f"  [{marca}] {m['nome']}  ({m['entidade']}, {m['qtd_secoes']} seção(ões))")
        for s in m["secoes"]:
            partes = []
            if s["tem_blocos"]:
                partes.append("blocos")
            if s["tem_produtos"]:
                partes.append("produtos")
            if s["tem_opcionais"]:
                partes.append("opcionais")
            if s["tem_cabecalho"]:
                partes.append("cabeçalho")
            if s["tem_rodape"]:
                partes.append("rodapé")
            L.append(f"        · {s['nome']:<22} {s['qtd_referencias']:3d} variáveis"
                     f"   {', '.join(partes) or '—'}")
        if m["queries_customizadas"]:
            L.append(f"        consultas OData próprias: {', '.join(m['queries_customizadas'])}")

    v = d["variaveis"]
    L += ["", f"VARIÁVEIS — {v['total_referencias']} referências, "
              f"{v['variaveis_distintas']} distintas", "  Por nível:"]
    for nivel, n in sorted(v["por_nivel"].items(), key=lambda x: -x[1]):
        L.append(f"    {n:4d}  {nivel}")
    L.append("  Por entidade (top 12):")
    for ent, n in list(v["por_entidade"].items())[:12]:
        L.append(f"    {n:4d}  {ent}")
    if v["que_usam_field_path"]:
        L.append(f"  Usam field-path ({len(v['que_usam_field_path'])}): "
                 + ", ".join(v["que_usam_field_path"][:6]) + " …")

    c = d["calculo"]
    L += ["", f"MEMORIAL DE CÁLCULO — {c['campos_calculados']} campos calculados",
          "  Onde a conta acontece:"]
    for onde, n in sorted(c["onde_calcula"].items(), key=lambda x: -x[1]):
        L.append(f"    {n:4d}  {onde}")

    if c["consultas_externas"]:
        L += ["", f"  CONSULTAS EXTERNAS ({len(c['consultas_externas'])}) — o cálculo sai do Ploomes:"]
        for e in c["consultas_externas"][:12]:
            L.append(f"    {e['entidade']}.{e['nome']}  {e['metodo'] or 'GET'}  {e['url']}")

    L += ["", f"  Entradas manuais ({len(c['entradas_manuais'])}) — alguém preenche:"]
    for e in c["entradas_manuais"][:12]:
        L.append(f"    {e['entidade']}.{e['nome']}")
    L += ["", f"  Resultados finais ({len(c['resultados_finais'])}) — ninguém consome depois:"]
    for e in c["resultados_finais"][:12]:
        L.append(f"    {e['entidade']}.{e['nome']}")

    return "\n".join(L)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("pasta", type=Path, help="pasta da conta extraída")
    ap.add_argument("--uso", type=Path, default=None,
                    help="JSON {nome do modelo: qtd de PVDs gerados} para separar o que roda")
    ap.add_argument("--grafo", type=Path, default=None, help="saída Mermaid do grafo")
    ap.add_argument("--json", type=Path, default=None)
    args = ap.parse_args()

    modelos = carregar(args.pasta, "DocumentTemplates")
    htmls = {h.get("Id"): h for h in carregar(args.pasta, "DocumentTemplates_HTML")}
    campos = carregar(args.pasta, "Fields")

    uso = json.loads(args.uso.read_text(encoding="utf-8")) if args.uso else {}
    ativos = {nome for nome, n in uso.items() if n and int(n) > 0}

    formato = [analisar_formato(m, htmls.get(m.get("Id"), {})) for m in modelos]
    todo_html = "".join(
        (pg.get(k) or "")
        for h in htmls.values() for pg in (h.get("Pages") or [])
        for k in ("BodySourceCode", "HeaderSourceCode", "FooterSourceCode")
    )

    dados = {
        "conta": args.pasta.name,
        "qtd_modelos": len(modelos),
        "modelos_ativos": sorted(ativos),
        "formato": formato,
        "variaveis": analisar_variaveis(todo_html),
        "calculo": analisar_calculo(campos),
    }

    print(relatorio(dados))
    if args.grafo:
        args.grafo.write_text(mermaid(dados["calculo"]), encoding="utf-8")
        print(f"\n[ok] grafo em {args.grafo}")
    if args.json:
        args.json.write_text(json.dumps(dados, ensure_ascii=False, indent=1), encoding="utf-8")
        print(f"[ok] estrutura em {args.json}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
