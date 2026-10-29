#!/usr/bin/env python3
"""Portão do pacote para o construtor de telas.

Uso: python validar_pacote.py <pasta pacote-construtor/>

A pasta precisa ter: contrato-de-dados.json, conferencia-da-conta.json,
src/ploomes/api.ts (gerado) e PEDIDO.md. Opcional: ../requisitos-da-cadeia.csv
(da indicacao-de-tela), que transforma "falta na conta" de BLOQUEIO em AVISO
quando o item ainda vai ser criado pela cadeia.

Saída: uma linha por achado, BLOQUEIO ou AVISO. Código 1 se houver bloqueio.
"""
import csv
import os
import json
import re
import sys
from pathlib import Path

AQUI = Path(__file__).resolve().parent
ROTAS = AQUI.parent / "references" / "rotas-api.txt"
sys.path.insert(0, str(AQUI))
from gerar_api import COLUNA_POR_TYPEID, MARCADOR, gerar, hash_contrato  # noqa: E402

SECOES_PEDIDO = [
    "## 1. O que é esta tela",
    "## 2. Regras do trabalho",
    "## 3. Estrutura de arquivos",
    "## 4. Telas e comportamentos",
    "## 5. Critérios de aceite",
    "## 6. Dúvidas em aberto",
]
IDENT = re.compile(r"^[a-z][A-Za-z0-9]*$")
SLUG = re.compile(r"^[a-z0-9]+(-[a-z0-9]+)*$")
FIELDKEY = re.compile(r"^[a-z]+(_[a-z]+)*_[A-Za-z0-9-]+$")
ID_LITERAL = re.compile(r"\b(\w*Id)\s+(eq|ne|gt|lt|ge|le)\s+(\d{4,})\b|\b(\w*Id)\s+in\s+\(([^)]*\d{4,}[^)]*)\)")
CHAVE_LONGA = re.compile(r"(?i)user-?key['\"]?\s*[:=]\s*['\"][A-Za-z0-9]{20,}")
ACOES = {"Win", "Lose", "Reopen", "Finish", "ValidateChecklist", "GetApplicableChecklists"}
# Campos que a API devolve e que são segredo: URL e chave de webhook, chave de integração e o
# corpo das ações de automação (pode levar URL e token). Vistos na API real em 2026-10-20.
SEGREDOS_POR_ROTA = {
    "Webhooks": ["CallbackUrl", "ValidationKey"],
    "AccountIntegrations": ["Key", "IntegrationUserKey", "IntegrationUserId"],
    "Automations": ["RequestBody"],
}
SEGREDOS_POR_EXPAND = {"Actions": ["RequestBody", "BigStringValue"]}
# Nomes que o api.ts gerado já usa: leitura ou escrita com um deles não compila (2026-10-20,
# "funis" e "modelos" na tela do mapa do processo).
RESERVADOS = {"configurar", "ctx", "iniciar", "iniciado", "exigirInicio", "usuarioAtual", "http", "literal", "norm",
              "traduzir", "funis", "modelos", "opcoes", "opcoesPorCampo", "opcoesDaTabela", "metadadosDosCampos",
              "idFunil", "idEtapa", "idModelo", "idOpcao", "etapasDoFunil", "regrasDoFunil", "textosDoFunil",
              "ler", "lerNome", "montarOutros", "conferirNativos", "checklistsDaEtapa", "camposDeChecklist",
              "salvarItemDoChecklist", "validarChecklist", "motivosDePerda", "campoDisponivel"}
# Leitura agregada ($apply): medida e agrupamento só com propriedade nativa.
IDENT_AGREGADO = re.compile(r"^[A-Za-z][A-Za-z0-9]*$")
MEDIDA = re.compile(r"^[A-Za-z][A-Za-z0-9/]* with (sum|average|min|max|countdistinct)$")
CAMPO_AGRUPADO = re.compile(r"^[A-Za-z][A-Za-z0-9]*(/[A-Za-z][A-Za-z0-9]*)*$")

achados = []


def bloqueio(msg):
    achados.append(("BLOQUEIO", msg))


def aviso(msg):
    achados.append(("AVISO", msg))


def carregar_rotas():
    rotas = set()
    for linha in ROTAS.read_text(encoding="utf-8").splitlines():
        if linha and not linha.startswith("#"):
            metodo, rota = linha.split(" ", 1)
            rotas.add((metodo, rota.replace("@", "")))
    return rotas


def carregar_requisitos(pasta: Path):
    arq = pasta.parent / "requisitos-da-cadeia.csv"
    req = set()
    if arq.exists():
        with arq.open(encoding="utf-8-sig", newline="") as f:
            for r in csv.DictReader(f):
                req.add(((r.get("Tipo") or "").strip().lower(), (r.get("Nome") or "").strip().lower()))
    return req


def validar_contrato(c: dict, rotas: set):
    for k in ("versao", "tela", "campos", "leituras", "escritas"):
        if k not in c:
            bloqueio(f"contrato sem a chave '{k}'")
    tela = c.get("tela", {})
    if not tela.get("nome"):
        bloqueio("contrato sem tela.nome")
    if not SLUG.match(tela.get("slug", "")):
        bloqueio(f"tela.slug inválido: '{tela.get('slug')}' (kebab-case)")

    campos, funis, modelos = c.get("campos", {}), c.get("funis", {}), c.get("modelos", {})
    for chave, d in campos.items():
        if not IDENT.match(chave):
            bloqueio(f"chave de campo '{chave}' não é camelCase")
        # Campo por nome (2026-10-20): a chave de campo não se escolhe na criação e muda de conta para
        # conta; tela genérica acha o campo pelo nome em iniciar(). "opcional": a falta não trava a tela.
        pn = d.get("porNome")
        if pn is not None:
            if d.get("fieldKey"):
                bloqueio(f"campo '{chave}': use 'fieldKey' ou 'porNome', não os dois")
            if not isinstance(pn, dict) or not isinstance(pn.get("entidade"), int) or not str(pn.get("nome", "")).strip():
                bloqueio(f"campo '{chave}': 'porNome' precisa de {{\"entidade\": <EntityId>, \"nome\": \"<nome exato>\"}}")
        elif not FIELDKEY.match(d.get("fieldKey", "")):
            bloqueio(f"campo '{chave}': FieldKey inválido '{d.get('fieldKey')}'")
        if not d.get("coluna") and d.get("typeId") not in COLUNA_POR_TYPEID:
            bloqueio(f"campo '{chave}': typeId {d.get('typeId')} sem coluna conhecida — declare 'coluna' (campo dinâmico: ContactValueId, UserValueId, ProductValueId)")
        if d.get("opcoes") and d.get("typeId") != 7:
            aviso(f"campo '{chave}': 'opcoes' só faz sentido em TypeId 7")

    def conferir_marcadores(onde, filtro, params):
        for m in MARCADOR.finditer(filtro):
            if m.group(0) == "{usuario}":
                continue
            tipo, arg = m.group(1), m.group(2)
            if tipo == "funil" and arg not in funis:
                bloqueio(f"{onde}: {{funil:{arg}}} não declarado em 'funis'")
            elif tipo == "etapa":
                f, _, e = arg.partition(".")
                if e not in funis.get(f, {}).get("etapas", {}):
                    bloqueio(f"{onde}: {{etapa:{arg}}} não declarada")
            elif tipo == "modelo" and arg not in modelos:
                bloqueio(f"{onde}: {{modelo:{arg}}} não declarado")
            elif tipo == "opcao":
                cp, _, _o = arg.partition(".")
                if not campos.get(cp, {}).get("opcoes"):
                    bloqueio(f"{onde}: {{opcao:{arg}}} exige o campo '{cp}' com \"opcoes\": true")
            elif tipo == "campo" and arg not in campos:
                bloqueio(f"{onde}: {{campo:{arg}}} não está em 'campos'")
            elif tipo == "campo" and campos[arg].get("porNome"):
                bloqueio(f"{onde}: {{campo:{arg}}} é campo por nome — a chave só existe na abertura da tela, e o filtro é montado antes")
            elif tipo == "param" and arg not in params:
                bloqueio(f"{onde}: {{param:{arg}}} não está em 'parametros'")
        for m in ID_LITERAL.finditer(filtro):
            bloqueio(f"{onde}: ID fixo no filtro ('{m.group(0)}') — use marcador e resolva por nome")
        if re.search(r"\{[^}]*\}", MARCADOR.sub("", filtro)):
            bloqueio(f"{onde}: marcador desconhecido em '{filtro}'")

    for nome, l in c.get("leituras", {}).items():
        onde = f"leitura '{nome}'"
        if nome in RESERVADOS:
            bloqueio(f"{onde}: '{nome}' já é nome do api.ts gerado — escolha outro (ex.: '{nome}DaConta')")
        if not IDENT.match(nome):
            bloqueio(f"{onde}: nome não é camelCase")
        if ("GET", l.get("rota", "")) not in rotas:
            bloqueio(f"{onde}: GET {l.get('rota')} não existe no catálogo de rotas")
        for cp in l.get("outrosCampos", []):
            if cp not in campos:
                bloqueio(f"{onde}: outrosCampos cita '{cp}', que não está em 'campos'")
        pagina = int(l.get("pagina", 50))
        if pagina > 1000:
            bloqueio(f"{onde}: pagina {pagina} acima do MaxTop (1000)")
        elif pagina > 300:
            aviso(f"{onde}: pagina {pagina} — a tela deve carregar sob demanda, não a base inteira")
        if l.get("ordem", "Id") != "Id":
            aviso(f"{onde}: ordem '{l['ordem']}' desliga a paginação por cursor — só a primeira página vem")
        texto = json.dumps(l)
        if "$skip" in texto:
            bloqueio(f"{onde}: $skip não é usado — a paginação é por cursor (api-docs)")
        for p, t in l.get("parametros", {}).items():
            if t not in ("number", "string", "date", "boolean"):
                bloqueio(f"{onde}: parâmetro '{p}' com tipo '{t}'")
        conferir_marcadores(onde, l.get("filtro", ""), l.get("parametros", {}))
        # Segredo nunca chega ao navegador: a tela roda com o perfil de quem abre (2026-10-20).
        rota = l.get("rota", "")
        sel = set(l.get("select", []))
        if rota in SEGREDOS_POR_ROTA:
            if not sel and not l.get("agregar"):
                bloqueio(f"{onde}: {rota} sem 'select' traz {', '.join(SEGREDOS_POR_ROTA[rota])} — liste só o que a tela mostra")
            for s in sel & set(SEGREDOS_POR_ROTA[rota]):
                bloqueio(f"{onde}: '{s}' é segredo de {rota} e não vai para a tela")
        for x in l.get("expand", []):
            nav = x.split("(")[0]
            if nav in SEGREDOS_POR_EXPAND and "$select=" not in x:
                bloqueio(f"{onde}: $expand={nav} sem $select traz {', '.join(SEGREDOS_POR_EXPAND[nav])} — liste os campos")
            for s in SEGREDOS_POR_EXPAND.get(nav, []):
                if re.search(rf"\b{s}\b", x):
                    bloqueio(f"{onde}: '{s}' em $expand={nav} é segredo e não vai para a tela")
        ag = l.get("agregar")
        if ag is not None:
            if l.get("umRegistro"):
                bloqueio(f"{onde}: 'agregar' e 'umRegistro' não se combinam")
            if not isinstance(ag.get("medidas"), dict) or not ag["medidas"]:
                bloqueio(f"{onde}: 'agregar' sem 'medidas'")
            for alias, m in (ag.get("medidas") or {}).items():
                if not IDENT_AGREGADO.match(alias):
                    bloqueio(f"{onde}: medida '{alias}' — o nome é um identificador (Quantidade, Valor)")
                if m != "$count" and not MEDIDA.match(m):
                    bloqueio(f"{onde}: medida '{alias}' = '{m}' — use '$count' ou '<Campo> with sum|average|min|max|countdistinct'")
            for campo in ag.get("por", []):
                if not CAMPO_AGRUPADO.match(campo) or campo.startswith("OtherProperties"):
                    bloqueio(f"{onde}: agrupar por '{campo}' — só propriedade nativa (a API recusa OtherProperties no groupby)")
            if not l.get("filtro") and rota in ("Deals", "Contacts", "Tasks", "InteractionRecords"):
                aviso(f"{onde}: agregado sem filtro em {rota} — a API materializa tudo em memória; recorte por status ou data")

    for nome, e in c.get("escritas", {}).items():
        onde = f"escrita '{nome}'"
        if nome in RESERVADOS:
            bloqueio(f"{onde}: '{nome}' já é nome do api.ts gerado — escolha outro")
        if not IDENT.match(nome):
            bloqueio(f"{onde}: nome não é camelCase")
        rota = e.get("rota", "")
        if e.get("acao"):
            acao = e["acao"]
            metodo = "GET" if acao in ("ValidateChecklist", "GetApplicableChecklists") else "POST"
            if acao not in ACOES:
                aviso(f"{onde}: ação '{acao}' fora das conhecidas ({', '.join(sorted(ACOES))})")
            if (metodo, f"{rota}/{{key}}/{acao}") not in rotas:
                bloqueio(f"{onde}: {metodo} {rota}({{id}})/{acao} não existe no catálogo")
            continue
        metodo = e.get("metodo")
        alvo = rota if metodo == "POST" else f"{rota}/{{key}}"
        if metodo not in ("POST", "PATCH"):
            bloqueio(f"{onde}: metodo '{metodo}' — use POST, PATCH ou 'acao'")
        elif (metodo, alvo) not in rotas:
            bloqueio(f"{onde}: {metodo} {alvo} não existe no catálogo")
        for cp in e.get("campos", []):
            if cp not in campos:
                bloqueio(f"{onde}: campo '{cp}' não está em 'campos'")
        if "OtherProperties" in e.get("nativos", []):
            bloqueio(f"{onde}: OtherProperties não é nativo — liste as chaves em 'campos'")


def validar_conferencia(c: dict, conf: dict, requisitos: set):
    if not conf.get("conferidoEm"):
        bloqueio("conferencia-da-conta.json sem 'conferidoEm'")
    campos_conta = {k.lower(): v for k, v in conf.get("campos", {}).items()}
    funis_conta = {k.strip().lower(): [e.strip().lower() for e in v] for k, v in conf.get("funis", {}).items()}
    modelos_conta = {m.strip().lower() for m in conf.get("modelos", [])}

    def faltou(tipo, nome, msg):
        if (tipo, nome.strip().lower()) in requisitos:
            aviso(msg + " — está no requisitos-da-cadeia.csv; confira de novo depois que a cadeia criar")
        else:
            bloqueio(msg)

    por_nome_conta = {k.strip().lower(): v for k, v in conf.get("camposPorNome", {}).items()}
    for chave, d in c.get("campos", {}).items():
        if d.get("porNome"):
            nome = str(d["porNome"].get("nome", ""))
            conta = por_nome_conta.get(nome.strip().lower())
            if conta is None:
                (aviso if d.get("opcional") else lambda m: faltou("campo", nome, m))(
                    f"campo '{chave}' (\"{nome}\") não foi conferido na conta — registre em camposPorNome")
            elif conta.get("typeId") != d.get("typeId") or conta.get("entidade") != d["porNome"].get("entidade"):
                bloqueio(f"campo '{chave}': typeId/entidade {d.get('typeId')}/{d['porNome'].get('entidade')} no contrato, "
                         f"{conta.get('typeId')}/{conta.get('entidade')} na conta")
            continue
        conta = campos_conta.get(d.get("fieldKey", "").lower())
        if conta is None:
            faltou("campo", d.get("nome", chave), f"campo '{chave}' ({d.get('fieldKey')}) não foi conferido na conta")
        elif conta.get("typeId") != d.get("typeId"):
            bloqueio(f"campo '{chave}': typeId {d.get('typeId')} no contrato, {conta.get('typeId')} na conta")
    for chave, f in c.get("funis", {}).items():
        etapas = funis_conta.get(f["nome"].strip().lower())
        if etapas is None:
            faltou("funil", f["nome"], f"funil '{f['nome']}' não foi conferido na conta")
            continue
        for ce, nome in f.get("etapas", {}).items():
            if nome.strip().lower() not in etapas:
                faltou("etapa", nome, f"etapa '{nome}' não existe no funil '{f['nome']}' da conta")
    for chave, m in c.get("modelos", {}).items():
        if m["nome"].strip().lower() not in modelos_conta:
            faltou("modelo", m["nome"], f"modelo '{m['nome']}' não foi conferido na conta")


def validar_api(pasta: Path, texto_contrato: str, contrato: dict):
    api = pasta / "src" / "ploomes" / "api.ts"
    if not api.exists():
        bloqueio("falta src/ploomes/api.ts — rode gerar_api.py")
        return
    atual = api.read_text(encoding="utf-8")
    esperado = gerar(contrato, hash_contrato(texto_contrato)) + "\n"
    if atual != esperado:
        bloqueio("api.ts não bate com o contrato atual — foi editado à mão ou o contrato mudou; gere de novo")
    conexao = pasta / "src" / "ploomes" / "useConexao.ts"
    modelo = AQUI / "modelos" / "useConexao.ts"
    if not conexao.exists():
        bloqueio("falta src/ploomes/useConexao.ts — rode gerar_api.py (ele gera os dois)")
    elif conexao.read_text(encoding="utf-8").replace("\r\n", "\n") != modelo.read_text(encoding="utf-8").replace("\r\n", "\n"):
        bloqueio("useConexao.ts foi editado à mão — gere de novo")


def validar_pedido(pasta: Path):
    arq = pasta / "PEDIDO.md"
    if not arq.exists():
        bloqueio("falta PEDIDO.md")
        return ""
    t = arq.read_text(encoding="utf-8")
    for s in SECOES_PEDIDO:
        if s not in t:
            bloqueio(f"PEDIDO.md sem a seção '{s}'")
    if "src/ploomes/api.ts" not in t:
        bloqueio("PEDIDO.md não manda usar o src/ploomes/api.ts anexado")
    if "useConexao(" not in t and ("configurar(" not in t or "iniciar(" not in t):
        bloqueio("PEDIDO.md não diz como a tela se conecta — mande usar `useConexao()` (de src/ploomes/useConexao.ts)")
    for regra, termo in (("rotas do react-router", "react-router"), ("camada pelo viewport overlay", "useViewportOverlay"),
                         ("tokens de cor", "var(--color-"), ("base intacta", "src/lib/")):
        if termo not in t:
            aviso(f"PEDIDO.md não traz a regra da base do construtor sobre {regra} — copie a seção 2 do modelo inteira")
    # Onboarding (2026-10-21): toda tela tem o roteiro para quem vai usá-la, montado com o kit da skill.
    if not re.search(r"(?m)^#{3,4} Onboarding", t):
        bloqueio("PEDIDO.md sem a subseção '### Onboarding' na seção 4 — boas-vindas, tour, primeiros passos, dicas e estados vazios (modelo-do-pedido.md)")
    for termo, o_que in (("OnboardingProvider", "envolver a tela com o OnboardingProvider"), ("onboarding/roteiro.ts", "escrever o src/onboarding/roteiro.ts"),
                         ("data-onboarding", "marcar os alvos com data-onboarding"), ("kits/onboarding", "copiar o kit de onboarding sem alterar")):
        if termo not in t:
            bloqueio(f"PEDIDO.md não manda {o_que} — copie a regra 14 do modelo")
    if len(t) > 30000:
        aviso(f"PEDIDO.md com {len(t)} caracteres — acima de 30 mil, o agente do construtor relê caro")
    if re.search(r"(?m)^\s*- \[ \]", t) is None:
        aviso("PEDIDO.md sem critérios de aceite em checklist (- [ ])")
    return t


def validar_pedido_contra_api(pasta: Path, pedido: str, contrato: dict):
    """O PEDIDO só pode citar função que o api.ts exporta, e tem de citar as que as boas práticas exigem."""
    api = pasta / "src" / "ploomes" / "api.ts"
    if not api.exists() or not pedido:
        return
    exportadas = set(re.findall(r"export (?:async )?function (\w+)", api.read_text(encoding="utf-8")))
    trechos = "\n".join(re.findall(r"`[^`\n]+`", pedido))
    # Método depois de ponto (JSON.stringify, conexao.tentarDeNovo) não é função do api.ts.
    citadas = set(re.findall(r"(?<![.\w])([a-z][A-Za-z0-9]*)\(", trechos))
    conexao = pasta / "src" / "ploomes" / "useConexao.ts"
    if conexao.exists():
        exportadas |= set(re.findall(r"export (?:async )?function (\w+)", conexao.read_text(encoding="utf-8")))
    # Nomes da base do construtor, do React e do react-router que o PEDIDO cita como regra, não como api.ts.
    da_base = {"fetch", "usePloomesBridge", "useViewportOverlay", "useNavigate", "useSearchParams", "useParams",
               "useLocation", "createPortal", "navigate", "configurar", "iniciar", "var", "tentarDeNovo",
               # kit de onboarding
               "useOnboarding", "marcar", "iniciarTour", "realcar", "abrirPainel"}
    for nome in sorted(citadas - exportadas - da_base):
        bloqueio(f"PEDIDO.md cita `{nome}(`, que o api.ts não exporta — o agente vai inventar ou travar")
    escritas = contrato.get("escritas", {}).values()
    move = any("StageId" in e.get("nativos", []) for e in escritas)
    acoes = {e.get("acao") for e in escritas}
    if move or "Win" in acoes:
        for f in ("checklistsDaEtapa", "validarChecklist", "regrasDoFunil"):
            if f not in citadas:
                bloqueio(f"a tela move ou ganha negócio, mas o PEDIDO não cita `{f}(` — boas práticas do construtor")
    if "Lose" in acoes and "motivosDePerda" not in citadas:
        bloqueio("a tela perde negócio, mas o PEDIDO não cita `motivosDePerda(` — perder exige motivo")
    if acoes & {"Win", "Lose"} and "textosDoFunil" not in citadas:
        aviso("a tela ganha ou perde negócio: use `textosDoFunil(` para o verbo e a unidade que a conta define")


def varrer_segredos(pasta: Path):
    for arq in pasta.rglob("*"):
        if arq.is_file() and arq.suffix in (".md", ".json", ".ts", ".tsx", ".html", ".csv", ".txt"):
            if CHAVE_LONGA.search(arq.read_text(encoding="utf-8", errors="ignore")):
                bloqueio(f"{arq.relative_to(pasta)}: parece conter uma User-Key literal")


def main() -> int:
    if len(sys.argv) != 2:
        print(__doc__)
        return 2
    pasta = Path(os.path.abspath(sys.argv[1]))
    arq_c, arq_conf = pasta / "contrato-de-dados.json", pasta / "conferencia-da-conta.json"
    if not arq_c.exists():
        print("BLOQUEIO  falta contrato-de-dados.json")
        return 1
    texto = arq_c.read_text(encoding="utf-8")
    try:
        contrato = json.loads(texto)
    except json.JSONDecodeError as e:
        print(f"BLOQUEIO  contrato-de-dados.json não é JSON válido: {e}")
        return 1
    validar_contrato(contrato, carregar_rotas())
    if arq_conf.exists():
        validar_conferencia(contrato, json.loads(arq_conf.read_text(encoding="utf-8")), carregar_requisitos(pasta))
    else:
        bloqueio("falta conferencia-da-conta.json — confira campos, funis e modelos na conta pelo MCP")
    if not any(n == "BLOQUEIO" for n, _ in achados):
        validar_api(pasta, texto, contrato)
    pedido = validar_pedido(pasta)
    validar_pedido_contra_api(pasta, pedido, contrato)
    varrer_segredos(pasta)

    for nivel, msg in achados:
        print(f"{nivel:9} {msg}")
    b = sum(1 for n, _ in achados if n == "BLOQUEIO")
    a = len(achados) - b
    print(f"\n{'REPROVADO' if b else 'APROVADO'} — {b} bloqueio(s), {a} aviso(s).")
    return 1 if b else 0


if __name__ == "__main__":
    sys.exit(main())
