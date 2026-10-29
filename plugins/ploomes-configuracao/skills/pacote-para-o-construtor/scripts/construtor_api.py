#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""O construtor de telas do Ploomes pela API: cria a tela, baixa uma versão e grava versão nova — sem a IA do Ploomes.

POR QUE ELE EXISTE: pedir à IA do construtor que escreva o código que já está pronto aqui gasta crédito e
reescreve o que não devia. A API do construtor (ai-builder) aceita o arquivo inteiro e gera a versão nova sem
passar pela IA — 0 token. Este script é o único caminho da skill até ela.

Uso:
    python -I construtor_api.py listar --env <arquivo -env.txt> [--conta <Id>]
    python -I construtor_api.py baixar --env <arquivo -env.txt> --projeto <GUID> --pasta <pasta NOVA> [--versao <id>] [--conta <Id>]
    python -I construtor_api.py criar  --env <arquivo -env.txt> --conta <Id> --nome "<nome>" (--usuarios <Ids> | --emails <e-mails>)
                                       [--icone fa-sparkles] [--permitir-mesmo-nome] [--executar --confirmo "CONFIRMO 1"]
    python -I construtor_api.py salvar --env <arquivo -env.txt> --conta <Id> --base <pasta com .construtor.json> --editado <pasta>
                                       [--pacote <pasta pacote-construtor> | --tela-existente] [--permitir-novos]
                                       [--executar --confirmo "CONFIRMO <n>"]
    python -I construtor_api.py ler-conta --env <arquivo -env.txt> --conta <Id> --saida <arquivo .json> [--tabelas <Ids>]
    python -I construtor_api.py --autoteste

A chave vem do arquivo --env, na linha UK_PLOOMES_CLIENTE=<chave> (outra variável com --variavel).

O `ler-conta` é a conferência da conta sem o MCP do Ploomes: só GET na API pública, e grava num .json a conta, os
funis com as etapas, os campos, os checklists com os itens e os modelos de documento (com --tabelas, também as
opções dessas tabelas). Com --conta, para se a chave abrir outra conta.

O `baixar` grava na --pasta o código da versão e o `.construtor.json` (projeto, versão, build, arquivos); o `salvar`
compara a pasta editada com essa base, envia só o que mudou e grava o `.construtor.json` novo na pasta editada, que
passa a ser a base da próxima rodada.

O que ele NUNCA faz:
- chama a IA do Ploomes (gasta crédito) nem publica a tela — publicar é da pessoa, pela interface do Ploomes;
- imprime ou grava a User-Key (em mensagem de erro ela sai como <USER_KEY>);
- escreve sem --executar e sem o "CONFIRMO <n>" igual ao número do plano mostrado e aprovado;
- escreve com a chave de outra conta: na escrita, --conta é obrigatório e conferido em /Account;
- envia src/main.tsx, src/lib/ ou binário (o source/content corrompe binário);
- grava o que o portão do empacotador (empacotar_importacao.conferir) reprovaria: o `salvar` roda o mesmo portão
  do .zip antes do plano — com --pacote (tela construída aqui), com --tela-existente (a referência é a base
  baixada) ou, sem nenhum dos dois, só a base intacta e as regras de código;
- grava por cima de versão que alguém salvou depois do baixar (pelo editor ou pelo chat), nem de versão que mudou
  no construtor desde a última subida da pasta editada (o .construtor.json dela aponta para outra versão que a base);
- reenvia a escrita sem resposta certa (tempo esgotado, 5xx, conexão caída) — consulta as versões e diz o que existe;
- cria tela com o nome de uma que já existe, sem --permitir-mesmo-nome.

Hosts: só https://ai-builder.ploomes.com/api e https://public-api2.ploomes.com. As variáveis CONSTRUTOR_API e
CONSTRUTOR_CRM só aceitam http://127.0.0.1:<porta> (o autoteste); qualquer outro valor para sem chamar nada.
Só a biblioteca padrão do Python 3.10+.
"""
import argparse
import contextlib
import difflib
import http.client
import io
import json
import os
import re
import shutil
import socket
import sys
import tempfile
import threading
import time
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

AI = "https://ai-builder.ploomes.com/api"
CRM = "https://public-api2.ploomes.com"
LOCAL = re.compile(r"http://127\.0\.0\.1:\d+")  # com fullmatch: o $ aceitaria um \n no fim
TEMPLATE_MODULO = "f9f2b866-f94b-435d-a58d-787e8202fccf"
EXT_BINARIAS = {".png", ".jpg", ".jpeg", ".gif", ".webp", ".ico", ".bmp", ".woff", ".woff2", ".ttf",
                ".otf", ".eot", ".pdf", ".mp4", ".webm", ".mp3", ".wav", ".zip"}
BUILD_FIM = {"ready", "failed", "error"}
META = ".construtor.json"
PAUSA_S = 0.3        # entre uma chamada e outra
INTERVALO_S = 5      # entre uma consulta de versões e outra, esperando o build
TEMPO_SAVE_S = 180   # o code/save pode demorar; passou disso, não reenvia

# O App.tsx mínimo: rota "/" com <main> vazio. É o mesmo que a IA grava para "tela em branco".
APP_EM_BRANCO = """import { Navigate, Route, Routes } from 'react-router';

function App() {
  return (
    <Routes>
      <Route path="/" element={<main className="app" />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
"""


# --------------------------------------------------------------------------- credencial, hosts e HTTP



def ler_chave(arquivo, variavel, fde=False):
    try:
        for linha in Path(arquivo).read_text(encoding="utf-8").splitlines():
            if linha.strip().startswith(f"{variavel}="):
                valor = linha.split("=", 1)[1].strip()
                if valor:
                    return valor
    except OSError:
        sys.exit(f"Não achei {arquivo}. Aponte com --env o arquivo que tem a chave (a linha {variavel}=...).")
    sys.exit(f"A {variavel} está em branco em {arquivo}. Ela sai de Administração → Integrações → Usuários de "
             "integração, na conta do cliente.")


_SEGREDOS = []


def mascarar(texto):
    texto = str(texto)
    for s in _SEGREDOS:
        texto = texto.replace(s, "<USER_KEY>").replace(urllib.parse.quote(s, safe=""), "<USER_KEY>")
    return texto


def bases():
    """(base do construtor, base do CRM). Fora da produção, só 127.0.0.1 — senão para antes de chamar qualquer coisa."""
    ai = os.environ.get("CONSTRUTOR_API") or None
    crm = os.environ.get("CONSTRUTOR_CRM") or None
    for nome, valor in (("CONSTRUTOR_API", ai), ("CONSTRUTOR_CRM", crm)):
        if valor is not None and not LOCAL.fullmatch(valor):
            sys.exit(f"PARADO: {nome}={valor!r} não é permitido (só http://127.0.0.1:<porta>, do autoteste). "
                     "Nada foi chamado.")
    # Com o construtor local, o CRM também fica local: a chave de teste nunca vai para a produção.
    return ai or AI, crm or ai or CRM


class TempoEsgotado(RuntimeError):
    pass


class FalhaHttp(RuntimeError):
    """A API respondeu com erro. Só o 4xx é recusa certa (a chamada não foi aplicada); 3xx e 5xx não dizem nada."""

    def __init__(self, mensagem, codigo):
        super().__init__(mensagem)
        self.codigo = codigo


def recusada(erro):
    """Verdadeiro só quando a API recusou com 4xx. Qualquer outra falha numa escrita é resposta incerta: pode ter
    sido aplicada (um 502 do balanceador, a conexão que caiu no meio da resposta), e repetir duplicaria."""
    return isinstance(erro, FalhaHttp) and 400 <= erro.codigo < 500


class SemRedirecionar(urllib.request.HTTPRedirectHandler):
    """Recusa todo redirecionamento: o urllib copia os cabeçalhos — a User-Key junto — para o host de destino,
    e isso furaria a lista de hosts. A resposta 3xx vira HTTPError e para o comando."""

    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None


class Api:
    def __init__(self, chave, ai, crm):
        self._chave = chave
        self.ai, self.crm = ai, crm
        _SEGREDOS.append(chave)
        self._com_proxy = urllib.request.build_opener(SemRedirecionar())
        self._sem_proxy = urllib.request.build_opener(urllib.request.ProxyHandler({}), SemRedirecionar())

    def req(self, metodo, url, corpo=None, tempo=120):
        dados = None if corpo is None else json.dumps(corpo, ensure_ascii=False).encode("utf-8")
        rota = url.split("?")[0]
        abrir = (self._sem_proxy if url.startswith("http://127.0.0.1:") else self._com_proxy).open
        for tentativa in range(4):
            time.sleep(PAUSA_S)
            r = urllib.request.Request(url, data=dados, method=metodo)
            r.add_header("User-Key", self._chave)
            r.add_header("Accept", "application/json")
            if dados is not None:
                r.add_header("Content-Type", "application/json")
            try:
                with abrir(r, timeout=tempo) as resp:
                    texto = resp.read().decode("utf-8")
                    return json.loads(texto) if texto.strip() else None
            except urllib.error.HTTPError as e:
                if e.code == 429 and tentativa < 3:  # 429 é recusa: a chamada não foi aplicada, repetir é seguro
                    time.sleep(int(e.headers.get("Retry-After") or 5))
                    continue
                if 300 <= e.code < 400:
                    raise FalhaHttp(mascarar(f"{metodo} {rota} → HTTP {e.code}, redirecionamento para "
                                             f"{e.headers.get('Location')} recusado: a chave só vai aos hosts "
                                             "permitidos. Nada foi seguido."), e.code) from None
                try:
                    corpo_erro = e.read().decode("utf-8", errors="ignore")[:400]
                except (OSError, http.client.HTTPException):
                    corpo_erro = "(corpo ilegível)"
                raise FalhaHttp(mascarar(f"{metodo} {rota} → HTTP {e.code}: {corpo_erro}"), e.code) from None
            except (TimeoutError, socket.timeout):
                raise TempoEsgotado(f"{metodo} {rota}: sem resposta em {tempo}s") from None
            except urllib.error.URLError as e:
                if isinstance(e.reason, (TimeoutError, socket.timeout)):
                    raise TempoEsgotado(f"{metodo} {rota}: sem resposta em {tempo}s") from None
                raise RuntimeError(mascarar(f"{metodo} {rota}: sem conexão ({e.reason})")) from None
            except (OSError, http.client.HTTPException) as e:
                # A conexão caiu depois do envio: sem a linha de status (RemoteDisconnected) ou no meio do corpo
                # (IncompleteRead, ConnectionResetError). O servidor pode ter aplicado.
                raise RuntimeError(mascarar(f"{metodo} {rota}: a conexão caiu antes da resposta completa "
                                            f"({type(e).__name__}: {e})")) from None
        raise FalhaHttp(f"{metodo} {rota}: a API pediu para esperar quatro vezes seguidas — pare e tente mais tarde", 429)

    def get(self, url):
        return self.req("GET", url)

    def post(self, url, corpo, tempo=120):
        return self.req("POST", url, corpo, tempo)

    def patch(self, url, corpo):
        return self.req("PATCH", url, corpo)


def valores(r):
    return r.get("value", []) if isinstance(r, dict) else (r or [])


def conferir_conta(api, esperado):
    """A conta que a chave abre. Com --conta, para se for outra — antes de qualquer escrita."""
    contas = valores(api.get(f"{api.crm}/Account?$select=Id,Name"))
    if not contas:
        raise RuntimeError("a API não devolveu a conta desta chave")
    conta = contas[0]
    if esperado is not None and conta["Id"] != esperado:
        sys.exit(f"PARADO: a chave abre a conta {conta.get('Name')} (Id {conta['Id']}), e o pedido é a conta {esperado}. "
                 "Nada foi gravado.")
    return conta


def confirmar(n, texto):
    esperado = f"CONFIRMO {n}"
    if (texto or "").strip() != esperado:
        sys.exit(f'Cancelado: a confirmação não conferiu (esperado "{esperado}"). Nada foi gravado.')


def plano(titulo, linhas, payload, executar):
    print("=" * 72)
    print(titulo)
    for k, v in linhas.items():
        print(f"  {k:.<28} {v}")
    print("  Corpo:")
    print("    " + json.dumps(payload, ensure_ascii=False, indent=2).replace("\n", "\n    "))
    print(f"  Modo {'.' * 23} {'EXECUÇÃO REAL' if executar else 'SIMULAÇÃO (nada será gravado)'}")
    print("=" * 72)


def incerta(erro):
    """O rótulo da escrita sem resposta certa."""
    return "TEMPO ESGOTADO" if isinstance(erro, TempoEsgotado) else "RESPOSTA INCERTA"


def fim_da_simulacao(n):
    print(f'Simulação concluída. Nada foi gravado. Para gravar, depois de quem pediu aprovar o plano: repita com '
          f'--executar --confirmo "CONFIRMO {n}".')


# --------------------------------------------------------------------------- arquivos (caminho longo, LF)

def longo(caminho):
    r"""O caminho absoluto; no Windows, com o prefixo \\?\ — a pasta da tela pode passar dos 260 caracteres."""
    c = str(caminho)
    if os.name != "nt":
        return os.path.abspath(c)
    if c.startswith("\\\\?\\"):
        return c
    c = os.path.abspath(c)
    return "\\\\?\\UNC\\" + c[2:] if c.startswith("\\\\") else "\\\\?\\" + c


def gravar(caminho, texto):
    alvo = longo(caminho)
    os.makedirs(os.path.dirname(alvo), exist_ok=True)
    with open(alvo, "w", encoding="utf-8", newline="") as f:
        f.write(texto)


def ler(caminho):
    """O texto com fim de linha LF — arquivo editado no Windows vem em CRLF e não pode virar diferença falsa."""
    with open(longo(caminho), encoding="utf-8", newline="") as f:
        return f.read().replace("\r\n", "\n")


def arquivos_de(pasta):
    """{'src/…': caminho} de tudo que está em <pasta>/src."""
    raiz = longo(Path(pasta) / "src")
    saida = {}
    for atual, _, nomes in os.walk(raiz):
        for nome in nomes:
            cheio = os.path.join(atual, nome)
            saida["src/" + cheio[len(raiz):].lstrip("\\/").replace("\\", "/")] = cheio
    return saida


def binario(caminho):
    return Path(caminho).suffix.lower() in EXT_BINARIAS


def protegido(caminho):
    return caminho == "src/main.tsx" or caminho.startswith("src/lib/")


def ler_meta(pasta):
    try:
        return json.loads(ler(Path(pasta) / META))
    except OSError:
        sys.exit(f"PARADO: {Path(pasta) / META} não existe. A base é a pasta que o `baixar` gravou.")


def gravar_meta(pasta, meta):
    gravar(Path(pasta) / META, json.dumps(meta, ensure_ascii=False, indent=2) + "\n")


def estado_build(status):
    return {"ready": "pronto", "failed": "falhou", "error": "falhou"}.get(status, status or "desconhecido")


def conteudo_remoto(api, projeto, versao, caminho):
    """O arquivo como a API devolve: texto, ou objeto quando é .json."""
    return api.get(f"{api.ai}/projects/{projeto}/snapshots/{versao}/source/content?path="
                   + urllib.parse.quote(caminho, safe=""))


def como_texto(remoto):
    return remoto if isinstance(remoto, str) else json.dumps(remoto, ensure_ascii=False, indent=2)


def confere(remoto, enviado):
    if isinstance(remoto, str):
        return remoto.replace("\r\n", "\n") == enviado
    try:
        return json.loads(enviado) == remoto
    except ValueError:
        return False


def mostrar_versoes(api, raiz, base):
    """Depois de tempo esgotado: o que existe em snapshots agora, sem reenviar nada."""
    try:
        agora = api.get(f"{raiz}/snapshots") or []
    except RuntimeError as e:
        print(f"  (não consegui ler as versões: {e})")
        return
    if not agora:
        print("  snapshots: nenhuma versão por enquanto.")
    for s in agora[:3]:
        marca = "(a base)" if base is not None and s["id"] == base else "(NOVA)"
        print(f"  versão {s['id']} {marca} · build {estado_build(s.get('buildStatus'))} · {s.get('createdAt')}")


def esperar_versao(api, raiz, anterior, espera_s):
    """A versão mais recente diferente de `anterior`, esperando o build terminar (pronto ou falho) até espera_s."""
    novo, fim = None, time.time() + espera_s
    while True:
        s = api.get(f"{raiz}/snapshots") or []
        if s and s[0]["id"] != anterior:
            novo = s[0]
            if novo.get("buildStatus") in BUILD_FIM:
                return novo
        if time.time() >= fim:
            return novo
        time.sleep(INTERVALO_S)


# --------------------------------------------------------------------------- leitura

def projetos_visiveis(api):
    """{id: projeto} de tudo que a chave enxerga, com o nome do modelo em _template."""
    projetos = {}
    for t in api.get(f"{api.ai}/templates") or []:
        for tela in ("true", "false"):
            for p in api.get(f"{api.ai}/projects?templateId={t['id']}&hasScreen={tela}&limit=100") or []:
                projetos[p["id"]] = dict(p, _template=t.get("name"))
    for p in api.get(f"{api.ai}/projects") or []:  # sem filtro a lista esconde projetos; com ele também — varre os dois
        projetos.setdefault(p["id"], dict(p, _template="?"))
    return projetos


def cmd_listar(api, args):
    if args.conta is not None:
        conferir_conta(api, args.conta)
    projetos = projetos_visiveis(api)
    print(f"{len(projetos)} projeto(s) visíveis para esta chave:")
    for p in sorted(projetos.values(), key=lambda x: x.get("updatedAt") or x.get("lastVersionAt") or "", reverse=True):
        try:
            m = api.get(f"{api.ai}/modules/{p['id']}")
            perm = m.get("permissionType") + (f" {m.get('allowedUsers')}" if m.get("permissionType") == "users" else "")
        except RuntimeError as e:
            perm = f"(sem acesso: {str(e)[-40:]})"
        tipo = "TELA" if p.get("hasScreen") else "chat"
        print(f"  {p['id']} | {tipo} | {p.get('name')} | {p['_template']} | publicada {p.get('deployedAt')} "
              f"| última versão {p.get('lastVersionAt')} | permissão {perm}")
    print("Tela com permissão 'users' que não inclui o usuário desta chave não aparece aqui.")
    return 0


PAGINA_CONTA = 300  # registros por página no ler-conta; a paginação é por Id, nunca $skip


def consulta(rota, **q):
    """A rota da API pública com a query OData. O espaço vai como %20: cru na URL, o http.client recusa."""
    return rota + ("?" + urllib.parse.urlencode(q, safe="$(),;='/@", quote_via=urllib.parse.quote) if q else "")


def todos_da_conta(api, rota, filtro=None, **q):
    """Todos os registros, por página: Id gt <último>, $orderby=Id. Nunca $skip, que a API trunca."""
    saida, ultimo = [], 0
    while True:
        f = f"Id gt {ultimo}" + (f" and ({filtro})" if filtro else "")
        pagina = valores(api.get(f"{api.crm}/" + consulta(rota, **{"$filter": f, "$orderby": "Id",
                                                                    "$top": str(PAGINA_CONTA)}, **q)))
        saida += pagina
        if len(pagina) < PAGINA_CONTA:
            return saida
        ultimo = pagina[-1]["Id"]


def cmd_ler_conta(api, args):
    """A conferência da conta sem o MCP: só GET, pelas mesmas rotas que o api.ts gerado usa."""
    conta = conferir_conta(api, args.conta)
    destino = Path(args.saida)
    if destino.suffix.lower() != ".json":
        sys.exit("PARADO: --saida é um arquivo .json (ex.: <pasta da tela>/conta-lida.json).")
    funis = valores(api.get(f"{api.crm}/" + consulta(
        "DealsPipelines", **{"$select": "Id,Name", "$expand": "Stages($select=Id,Name,Ordination)"})))
    filtro = None
    if args.entidades:
        filtro = " or ".join(f"EntityId eq {int(e)}" for e in args.entidades.split(",") if e.strip())
    campos = todos_da_conta(api, "Fields", filtro, **{"$select": "Id,Key,Name,EntityId,TypeId,OptionsTableId"})
    checklists = todos_da_conta(api, "Checklists", None, **{
        "$select": "Id,Name,DealStageId,DealFilterId",
        "$expand": "Fields($select=Name,Required,Ordination,FieldKey)"})
    modelos = todos_da_conta(api, "DocumentTemplates", None, **{"$select": "Id,Name"})
    opcoes = {}
    for tabela in (args.tabelas or "").split(","):
        if tabela.strip():
            opcoes[str(int(tabela))] = valores(api.get(f"{api.crm}/" + consulta(
                "Fields@OptionsTables@Options", **{"$filter": f"TableId eq {int(tabela)}", "$select": "Id,Name",
                                                   "$top": "1000"})))
    etapas = lambda f: [e.get("Name") for e in sorted(f.get("Stages") or [], key=lambda e: e.get("Ordination") or 0)]
    lido = {
        "lidoEm": datetime.now().strftime("%Y-%m-%d %H:%M"),
        "comoFoiLido": "construtor_api.py ler-conta — só GET na API pública do Ploomes",
        "conta": {"Id": conta["Id"], "Name": conta.get("Name")},
        "funis": [{"Id": f["Id"], "nome": f.get("Name"), "etapas": etapas(f),
                   "etapasComId": sorted(f.get("Stages") or [], key=lambda e: e.get("Ordination") or 0)} for f in funis],
        "campos": [{k: c.get(k) for k in ("Key", "Name", "EntityId", "TypeId", "OptionsTableId")} for c in campos],
        "checklists": checklists,
        "modelos": [{"Id": m["Id"], "nome": m.get("Name")} for m in modelos],
        "opcoes": opcoes,
    }
    gravar(destino, json.dumps(lido, ensure_ascii=False, indent=2) + "\n")
    print(f"Conta {conta.get('Name')} (Id {conta['Id']}), lida só com GET:")
    print(f"  {len(funis)} funil(is), {len(campos)} campo(s), {len(checklists)} checklist(s), {len(modelos)} modelo(s)"
          + (f", opções de {len(opcoes)} tabela(s)" if opcoes else ""))
    print(f"Gravado em {destino}. Escreva o conferencia-da-conta.json só com o que a tela usa.")
    return 0


def cmd_baixar(api, args):
    if args.conta is not None:
        conferir_conta(api, args.conta)
    destino = Path(args.pasta)
    if os.path.isfile(longo(destino)) or (os.path.isdir(longo(destino)) and os.listdir(longo(destino))):
        sys.exit(f"PARADO: {destino} já existe e tem arquivo. Dê uma pasta NOVA (nunca sobrescrevo uma base).")
    raiz = f"{api.ai}/projects/{args.projeto}"
    proj = api.get(raiz)
    snaps = api.get(f"{raiz}/snapshots") or []
    if not snaps:
        sys.exit("PARADO: o projeto não tem versão (é um chat sem tela, ou a tela ainda não gerou a primeira versão).")
    snap = next((s for s in snaps if s["id"] == args.versao), None) if args.versao else snaps[0]
    if not snap:
        sys.exit(f"PARADO: a versão {args.versao} não existe neste projeto.")
    caminhos = (api.get(f"{raiz}/snapshots/{snap['id']}/source") or {}).get("paths", [])
    estranhos = [c for c in caminhos if c.startswith(("/", "\\")) or ".." in Path(c).parts or ":" in c]
    if estranhos:
        raise RuntimeError(f"a API devolveu caminho fora da pasta da tela: {estranhos}")
    pulados = [c for c in caminhos if binario(c)]
    try:
        for c in caminhos:
            if c not in pulados:
                gravar(destino / c, como_texto(conteudo_remoto(api, args.projeto, snap["id"], c)))
        gravar_meta(destino, {
            "projeto": args.projeto, "nome": proj.get("name"), "versao": snap["id"],
            "versao_mais_recente": snaps[0]["id"],
            "versao_publicada": next((s["id"] for s in snaps if s.get("deployed")), None),
            "build": estado_build(snap.get("buildStatus")), "arquivos": caminhos,
            "binarios_nao_baixados": pulados, "gravado_em": datetime.now().isoformat(timespec="seconds")})
    except BaseException:
        shutil.rmtree(longo(destino), ignore_errors=True)  # base pela metade nunca vira base
        print(f"A pasta parcial {destino} foi apagada.", file=sys.stderr)
        raise
    print(f"Tela {proj.get('name')} — versão {snap['id']} ({'a mais recente' if snap is snaps[0] else 'ANTIGA'}).")
    print(f"{len(caminhos) - len(pulados)} arquivo(s) em {destino}. Binários não baixados: {pulados}")
    if snap is not snaps[0]:
        print("ATENÇÃO: o `salvar` só grava sobre a versão mais recente; esta pasta serve para ler, não de base.")
    print("Próximo passo: copie a pasta e edite a CÓPIA; esta fica como base do `salvar`.")
    return 0


# --------------------------------------------------------------------------- escrita

def resolver_usuarios(api, args):
    if args.usuarios:
        try:
            return [int(x) for x in args.usuarios.split(",") if x.strip()]
        except ValueError:
            sys.exit(f"PARADO: --usuarios leva Ids numéricos separados por vírgula, não {args.usuarios!r}.")
    ids = []
    for email in [e.strip() for e in args.emails.split(",") if e.strip()]:
        filtro = urllib.parse.quote("Email eq '" + email.replace("'", "''") + "'")
        achados = valores(api.get(f"{api.crm}/Users?$select=Id,Name,Email&$filter={filtro}"))
        if len(achados) != 1:
            sys.exit(f"PARADO: o e-mail {email} achou {len(achados)} usuário(s) nesta conta; precisa ser exatamente um.")
        ids.append(achados[0]["Id"])
    return ids


def cmd_criar(api, args):
    conta = conferir_conta(api, args.conta)
    eu = valores(api.get(f"{api.crm}/Self?$select=Id,Name"))[0]
    ids = resolver_usuarios(api, args)
    if eu["Id"] not in ids:
        ids.append(eu["Id"])  # sem o usuário da chave, a chave perde o acesso e não edita depois
    filtro = urllib.parse.quote(" or ".join(f"Id eq {i}" for i in ids))
    achados = {u["Id"]: u["Name"] for u in valores(api.get(f"{api.crm}/Users?$select=Id,Name&$filter={filtro}"))}
    faltam = [i for i in ids if i not in achados]
    if faltam:
        sys.exit(f"PARADO: usuário(s) {faltam} não existem nesta conta.")
    templates = {t["id"]: t.get("name") for t in api.get(f"{api.ai}/templates") or []}
    if args.template not in templates:
        sys.exit(f"PARADO: o modelo {args.template} não está em /templates: {templates}")
    # Não há rota para excluir tela: a tela de mesmo nome quase sempre é um `criar` anterior que não teve resposta.
    mesmo_nome = [p for p in projetos_visiveis(api).values()
                  if p.get("hasScreen") and (p.get("name") or "").strip().casefold() == args.nome.strip().casefold()]
    if mesmo_nome and not args.permitir_mesmo_nome:
        sys.exit(f"PARADO: já existe tela chamada {args.nome!r} nesta conta "
                 f"({', '.join(p['id'] for p in mesmo_nome)}). Se é ela, siga com ela (baixar --projeto <GUID>); "
                 "se a tela nova é outra de propósito, repita com --permitir-mesmo-nome. Nada foi gravado.")

    corpo ={"accountId": conta["Id"], "name": args.nome, "nameSource": "user", "templateId": args.template,
             "hasScreen": True, "permissionType": "users", "allowedUsers": ids, "iconClass": args.icone}
    plano("POST /projects  →  POST /projects/<nova>/code/save (src/App.tsx mínimo)",
          {"Conta": f"{conta['Name']} ({conta['Id']})", "Modelo": templates[args.template],
           "Quem pode usar": ", ".join(f"{achados[i]} ({i})" for i in ids),
           "Telas criadas": 1, "Usa a IA do Ploomes?": "NÃO (0 token)", "Publica?": "NÃO — publicar é pela interface",
           "Desfazer": "excluir a tela pela interface (não há rota de exclusão)"},
          corpo, args.executar)
    if not args.executar:
        fim_da_simulacao(1)
        return 0
    confirmar(1, args.confirmo)

    # Escrita sem resposta certa — tempo esgotado, 5xx, conexão caída, resposta ilegível — em qualquer das duas:
    # nunca reenviar. Só o 4xx é recusa certa. Não há rota para excluir tela, e um segundo `criar` deixaria duas
    # telas no CRM do cliente.
    try:
        proj = api.post(f"{api.ai}/projects", corpo, TEMPO_SAVE_S)
        pid = proj["id"]
    except Exception as e:  # noqa: BLE001 — qualquer falha que não seja recusa é incerta
        if recusada(e):
            raise
        print(f"{incerta(e)}: {mascarar(e)}. NÃO rode criar de novo agora — a tela pode ter sido criada.")
        print(f"Confira em Telas personalizadas (ou com `listar`) se já existe uma tela chamada {args.nome!r} "
              "antes de criar de novo; se existir, siga com ela.")
        return 1
    raiz = f"{api.ai}/projects/{pid}"
    print(f"Tela criada: {pid} (hasScreen {proj.get('hasScreen')})")
    if proj.get("hasScreen") is not True:
        raise RuntimeError("o projeto nasceu como chat (hasScreen false) e não vai aparecer em Telas. "
                           "Exclua pela interface e avise: o contrato da API mudou.")
    try:
        r = api.post(f"{raiz}/code/save", {"files": [{"path": "src/App.tsx", "content": APP_EM_BRANCO}]}, TEMPO_SAVE_S)
    except Exception as e:  # noqa: BLE001
        if recusada(e):
            print(f"RECUSADO: {mascarar(e)}. A tela {pid} já existe, sem versão. Não rode criar de novo: "
                  "confira em Telas e avise antes de qualquer nova tentativa.")
            return 1
        print(f"{incerta(e)}: {mascarar(e)}. NÃO reenvie — o servidor pode ter aplicado a gravação.")
        mostrar_versoes(api, raiz, None)
        print(f"Não rode criar de novo: a tela {pid} já existe — confira em Telas. Consulte as versões dela "
              "(snapshots) daqui a pouco; se a primeira versão não aparecer, avise antes de qualquer nova tentativa.")
        return 1
    print(f"Gravação: {r}")
    snap = esperar_versao(api, raiz, None, args.espera_s)
    if not snap:
        raise RuntimeError(f"a tela {pid} foi criada, mas sem primeira versão em {args.espera_s}s. "
                           "Confira na interface — não crie de novo.")
    mod = api.get(f"{api.ai}/modules/{pid}")
    if sorted(mod.get("allowedUsers") or []) != sorted(ids):
        api.patch(f"{api.ai}/modules/{pid}/permissions", {"permissionType": "users", "grantIds": ids, "iconClass": args.icone})
        mod = api.get(f"{api.ai}/modules/{pid}")
    print(f"Primeira versão: {snap['id']} (build {estado_build(snap.get('buildStatus'))})")
    print(f"Permissão: {mod.get('permissionType')} {mod.get('allowedUsers')} · ícone {mod.get('iconClass')}")
    if snap.get("buildStatus") != "ready":
        print("ATENÇÃO: o build da primeira versão não ficou pronto. Veja na interface antes de seguir.")
        return 1
    print(f"Pronto. Baixe a base com: baixar --projeto {pid} --pasta <pasta NOVA>")
    return 0


def empacotador():
    """O módulo empacotar_importacao, da mesma pasta (com python -I a pasta do script não está no sys.path)."""
    aqui = str(Path(__file__).resolve().parent)
    if aqui not in sys.path:
        sys.path.insert(0, aqui)
    import empacotar_importacao
    return empacotar_importacao


def base_local_desatualizada(emp, base):
    """Arquivos da base do construtor (main.tsx e src/lib/) em que a bancada/scaffold/src daqui difere da base baixada."""
    diferem = []
    for p in [emp.BASE / "main.tsx", *sorted((emp.BASE / "lib").rglob("*"))]:
        if not p.is_file():
            continue
        rel = "src/" + p.relative_to(emp.BASE).as_posix()
        baixado = Path(longo(Path(base) / rel))
        if not baixado.is_file() or ler(baixado) != ler(p):
            diferem.append(rel)
    return diferem


def portao(args, base, editado, arq_base):
    """O mesmo portão do .zip, antes do plano. Devolve (bloqueios, avisos); a rede nem é tocada antes dele."""
    emp = empacotador()
    original = None
    if args.tela_existente:
        original = {c[len("src/"):]: ler(p) for c, p in arq_base.items() if not binario(c)}
    else:
        diferem = base_local_desatualizada(emp, base)
        if diferem:
            return [f"a base do construtor mudou: atualize bancada/scaffold/src a partir de {base} "
                    f"(diferem da base baixada: {', '.join(diferem[:5])}{'…' if len(diferem) > 5 else ''})"], []
    pacote = Path(args.pacote).resolve() if args.pacote else None
    # O conferir lê com Path comum, que no Windows não passa dos 260 caracteres — e a pasta da tela pode passar.
    # Ele roda numa cópia do src/ numa pasta temporária curta. Path(...).resolve(), nunca o prefixo do longo(): o
    # conferir compara caminhos não resolvidos (o kit do onboarding, src/lib, src/vendor) com p.resolve().parents;
    # com prefixo, ou com nome curto 8.3 do Windows (USUARI~1, o da pasta temporária), elas deixariam de casar e o
    # portão ficaria mais fraco que o do .zip.
    try:
        with tempfile.TemporaryDirectory(prefix="portao-") as tmp:
            copia = Path(tmp).resolve() / "tela"
            shutil.copytree(longo(Path(editado) / "src"), copia / "src")
            emp.conferir(copia, pacote, original)  # os achados ficam em emp.achados
    except OSError as e:
        return [f"caminho longo demais para o Windows ({type(e).__name__}: {e}): trabalhe numa pasta curta "
                "(por exemplo, `subst`) e repita"], []
    return ([m for n, m in emp.achados if n == "BLOQUEIO"], [m for n, m in emp.achados if n == "AVISO"])


def cmd_salvar(api, args):
    base, editado = Path(args.base), Path(args.editado)
    meta = ler_meta(base)
    projeto, versao_base = meta["projeto"], meta["versao"]
    # A trava entre entregas, antes de qualquer chamada. A base nova é baixada a cada entrega; se alguém mudou a tela
    # pelo editor ou pelo chat desde a última subida, a base já traz a mudança, a trava da versão mais recente passa,
    # e o salvar gravaria a pasta editada por cima. O .construtor.json da pasta editada guarda a versão da última
    # subida dela: outra versão na base é mudança no construtor. (Pasta editada copiada da base tem a mesma versão.)
    if os.path.isfile(longo(editado / META)):
        anterior = ler_meta(editado)
        if anterior.get("projeto") == projeto and anterior.get("versao") != versao_base:
            print(f"BLOQUEIO: a tela mudou no construtor desde a sua última subida ({anterior.get('versao')} → "
                  f"{versao_base}): veja o que mudou antes de gravar por cima. Compare o src/ de {base} com o desta "
                  "pasta e traga para ela o que fica. Feito isso — ou se a versão nova é sua, de uma gravação sem "
                  f"resposta —, copie o {META} de {base} para {editado} e repita.")
            sys.exit("PARADO: 1 bloqueio. Nada foi enviado.")
    arq_base, arq_edit = arquivos_de(base), arquivos_de(editado)
    if not arq_edit:
        sys.exit(f"PARADO: {editado} não tem src/.")
    nao_baixados = set(meta.get("binarios_nao_baixados") or [])
    textos, novos, bloqueios, avisos = {}, [], [], []
    for c, p in sorted(arq_edit.items()):
        if binario(c):
            if c in nao_baixados:
                avisos.append(f"{c}: binário — fica como está na tela (não sobe pela API)")
            else:
                bloqueios.append(f"{c}: binário não sobe pela API (o source/content o corrompe) — use imagem por URL "
                                 "ou SVG inline num .tsx")
            continue
        texto = ler(p)
        if c in arq_base and texto == ler(arq_base[c]):
            continue
        if protegido(c):
            bloqueios.append(f"{c}: a base do construtor (src/main.tsx e src/lib/) não se edita — volte o arquivo ao da base")
            continue
        textos[c] = texto
        if c not in arq_base:
            novos.append(c)
    if not bloqueios:  # o portão do empacotador, o mesmo do .zip
        bloqueios, avisos_do_portao = portao(args, base, editado, arq_base)
        avisos += avisos_do_portao
    if bloqueios:
        for b in bloqueios:
            print(f"BLOQUEIO: {b}")
        sys.exit(f"PARADO: {len(bloqueios)} bloqueio(s). Nada foi enviado.")
    for c in textos:
        if c in novos:
            print(f"+++ NOVO {c} ({len(textos[c])} caracteres)")
        else:
            print("".join(difflib.unified_diff(ler(arq_base[c]).splitlines(True), textos[c].splitlines(True),
                                               f"base/{c}", f"editado/{c}")))
    sumidos = [c for c in arq_base if c not in arq_edit and not binario(c)]
    if sumidos:
        avisos.append(f"{sumidos} não estão na pasta editada; o code/save não apaga arquivo, eles continuam na tela")
    if novos and not args.permitir_novos:
        sys.exit(f"PARADO: arquivos novos {novos}. Repita com --permitir-novos se for de propósito.")
    envio = list(textos)
    if not envio:
        print("Nada mudou em relação à base.")
        return 0

    conferir_conta(api, args.conta)
    raiz = f"{api.ai}/projects/{projeto}"
    proj = api.get(raiz)
    snaps = api.get(f"{raiz}/snapshots") or []
    if not snaps or snaps[0]["id"] != versao_base:
        sys.exit(f"PARADO: a versão mais recente é {snaps[0]['id'] if snaps else '?'}, não a base {versao_base}. "
                 "Alguém salvou pelo editor ou pelo chat, ou restaurou uma versão, depois do baixar. "
                 "Baixe de novo numa pasta nova e refaça a edição sobre ela. Nada foi enviado.")
    for a in avisos:
        print(f"AVISO: {a}")
    plano("POST /projects/<tela>/code/save",
          {"Tela": proj.get("name"), "Versão base": versao_base, "Arquivos enviados": len(envio),
           "Portão do empacotador": f"APROVADO ({len(avisos)} aviso(s), acima)",
           "Usa a IA do Ploomes?": "NÃO (0 token)", "Publica?": "NÃO — gera versão nova não publicada",
           "Desfazer": "restaurar a versão base pela interface (cria versão nova)"},
          {"files": [{"path": c, "content": f"<arquivo inteiro, {len(textos[c])} caracteres, fim de linha LF>"} for c in envio]},
          args.executar)
    if not args.executar:
        fim_da_simulacao(len(envio))
        return 0
    confirmar(len(envio), args.confirmo)

    publicada_antes = proj.get("deployedAt")
    try:
        r = api.post(f"{raiz}/code/save", {"files": [{"path": c, "content": textos[c]} for c in envio]}, TEMPO_SAVE_S)
    except Exception as e:  # noqa: BLE001 — só o 4xx é recusa certa; o resto pode ter sido aplicado
        if recusada(e):
            raise
        print(f"{incerta(e)}: {mascarar(e)}. NÃO reenvie — o servidor pode ter aplicado a gravação.")
        mostrar_versoes(api, raiz, versao_base)
        print("Confira em snapshots (o histórico de versões da tela) daqui a pouco: se apareceu versão NOVA, baixe-a "
              "numa pasta nova e confira; se não apareceu, e só então, salve de novo.")
        return 1
    print(f"Gravação aceita: {r}")
    novo = esperar_versao(api, raiz, versao_base, args.espera_s)
    if not novo:
        raise RuntimeError(f"sem versão nova em {args.espera_s}s. Confira em snapshots antes de qualquer coisa — não reenvie.")
    pronto = novo.get("buildStatus") == "ready"
    problemas = []
    errados = [c for c in envio if not confere(conteudo_remoto(api, projeto, novo["id"], c), textos[c])]
    if errados:
        problemas.append(f"o conteúdo relido difere do enviado em {errados}")
    if api.get(raiz).get("deployedAt") != publicada_antes:
        problemas.append("a data de publicação mudou — verifique na interface")
    agora = api.get(f"{raiz}/snapshots") or []
    gravar_meta(editado, {
        "projeto": projeto, "nome": proj.get("name"), "versao": novo["id"],
        "versao_mais_recente": agora[0]["id"] if agora else novo["id"],
        "versao_publicada": next((s["id"] for s in agora if s.get("deployed")), None),
        "build": "pronto" if pronto else "falhou",
        "arquivos": (api.get(f"{raiz}/snapshots/{novo['id']}/source") or {}).get("paths", []),
        "binarios_nao_baixados": sorted(nao_baixados), "gravado_em": datetime.now().isoformat(timespec="seconds")})
    print(f"Versão nova: {novo['id']} (build {estado_build(novo.get('buildStatus'))}). "
          f"O {META} de {editado} aponta para ela: esta pasta é a base da próxima gravação.")
    if not pronto:
        problemas.append("o build não ficou pronto — provável erro de compilação (veja a versão na interface). "
                         "Corrija e salve de novo, com esta pasta como --base")
    if problemas:
        for p in problemas:
            print(f"ATENÇÃO: {p}")
        return 1
    print(f"Conferido: {len(envio)} arquivo(s) idênticos ao enviado; publicação inalterada. "
          "Pronto para testar e publicar pela interface.")
    return 0


# --------------------------------------------------------------------------- CLI

def montar_cli():
    ap = argparse.ArgumentParser(prog="construtor_api.py",
                                 description="O construtor de telas do Ploomes pela API, sem a IA (nunca publica).")
    sub = ap.add_subparsers(dest="cmd", required=True)

    def comum(p, escrita=False):
        p.add_argument("--env", help="arquivo -env.txt com a chave (nunca o valor da chave)")
        p.add_argument("--variavel", default="UK_PLOOMES_CLIENTE", help="a variável da chave no arquivo")
        p.add_argument("--conta", type=int, required=escrita, help="Id da conta que a chave tem de abrir")
        if escrita:
            p.add_argument("--executar", action="store_true", help="sem esta opção, só simulação")
            p.add_argument("--confirmo", help='"CONFIRMO <n>", dado por quem aprovou o plano')
            p.add_argument("--espera-s", type=int, default=180, help="quanto esperar a versão nova")
        return p

    comum(sub.add_parser("listar", help="as telas que a chave enxerga"))
    b = comum(sub.add_parser("baixar", help="o código de uma versão, numa pasta nova"))
    b.add_argument("--projeto", required=True)
    b.add_argument("--pasta", required=True, help="pasta NOVA (ou vazia)")
    b.add_argument("--versao", help="Id da versão; sem ele, a mais recente")
    c = comum(sub.add_parser("criar", help="tela nova em branco, sem a IA"), escrita=True)
    c.add_argument("--nome", required=True)
    quem = c.add_mutually_exclusive_group(required=True)
    quem.add_argument("--usuarios", help="Ids de usuário do CRM que podem abrir a tela, por vírgula")
    quem.add_argument("--emails", help="e-mails dos usuários do CRM que podem abrir a tela, por vírgula")
    c.add_argument("--icone", default="fa-sparkles")
    c.add_argument("--permitir-mesmo-nome", action="store_true",
                   help="cria mesmo havendo tela com este nome (sem ela, o criar para)")
    c.add_argument("--template", default=TEMPLATE_MODULO, help=argparse.SUPPRESS)
    lc = comum(sub.add_parser("ler-conta", help="a conferência da conta sem o MCP: só GET, grava um .json"))
    lc.set_defaults(conta_obrigatoria=True)
    lc.add_argument("--saida", required=True, help="arquivo .json (ex.: <pasta da tela>/conta-lida.json)")
    lc.add_argument("--entidades", help="só os campos destas entidades (EntityId, por vírgula); sem ela, todos")
    lc.add_argument("--tabelas", help="Ids de tabela de opções (OptionsTableId), por vírgula: grava as opções delas")
    s = comum(sub.add_parser("salvar", help="grava a pasta editada como versão nova"), escrita=True)
    s.add_argument("--base", required=True, help=f"a pasta do baixar (com o {META})")
    s.add_argument("--editado", required=True)
    modo = s.add_mutually_exclusive_group()
    modo.add_argument("--pacote", help="pasta pacote-construtor da tela construída aqui: o api.ts, o useConexao.ts e o onboarding conferem com ele")
    modo.add_argument("--tela-existente", action="store_true",
                      help="tela já em produção: a referência é a base baixada, e o que ela já tinha é herdado")
    s.add_argument("--permitir-novos", action="store_true")
    return ap


COMANDOS = {"listar": cmd_listar, "baixar": cmd_baixar, "criar": cmd_criar, "salvar": cmd_salvar,
            "ler-conta": cmd_ler_conta}


def main(argv=None):
    argv = sys.argv[1:] if argv is None else list(argv)
    if "--autoteste" in argv:
        return autoteste()
    args = montar_cli().parse_args(argv)
    if getattr(args, "conta_obrigatoria", False) and args.conta is None:
        sys.exit("Passe --conta <Id>: a leitura para se a chave abrir outra conta.")
    ai, crm = bases()
    env, fde = args.env, False
    if not env:
        sys.exit("Passe --env <arquivo com a chave> (a linha UK_PLOOMES_CLIENTE=...). A chave nunca vai na conversa.")
    api = Api(ler_chave(env, args.variavel, fde), ai, crm)
    try:
        return COMANDOS[args.cmd](api, args)
    except Exception as erro:  # noqa: BLE001 — nunca o traceback cru: o texto do erro pode trazer a chave
        tipo = "" if isinstance(erro, RuntimeError) else f"{type(erro).__name__}: "
        print(f"\nPARADO no primeiro erro: {tipo}{mascarar(erro)}", file=sys.stderr)
        return 1


# --------------------------------------------------------------------------- autoteste
# A API do construtor e a do CRM, falsas, num http.server em 127.0.0.1. Nenhuma chamada sai da máquina.

CHAVE_TESTE = "chave-de-teste-7c1e9a"
ESCAFFOLD = Path(__file__).resolve().parent.parent / "bancada" / "scaffold" / "src"
# A tela-base do teste é a base REAL da skill (bancada/scaffold/src), em texto: o portão do empacotador a confere
# contra ela, e uma base inventada reprovaria em tudo.
TEMPLATE_FALSO = {"src/" + p.relative_to(ESCAFFOLD).as_posix(): ler(p)
                  for p in sorted(ESCAFFOLD.rglob("*")) if p.is_file() and not binario(p)}
LIB_REAL = "src/lib/index.ts"
CAMINHO_FUNDO = "src/lib/PloomesBridge/hooks/" + "useConexaoComNomeBemCompridoDaPonte" * 2 + ".ts"


class ApiFalsa:
    def __init__(self):
        self.chamadas = []
        self.conta_id = 5
        self.eu_id = 99
        self.usuarios = {11: ("Ana", "ana@cliente.com"), 99: ("Integração", "int@cliente.com")}
        self.build_novo = "ready"
        self.segurar_save_s = 0
        self.segurar_criar_s = 0
        self.redirecionar_para = None  # URL: toda resposta vira 302 para ela
        self.chaves = []  # a User-Key de cada chamada recebida
        self.falhar_conteudo = None
        self.falhar_post = {}  # {rota: código HTTP}: aplica o POST e responde com o código (o 502 do balanceador)
        self.derrubar_post = {}  # {rota: "sem_resposta" | "corpo_pela_metade"}: aplica o POST e derruba a conexão
        self.ecoar_chave = False
        self.n = 0
        self.config_da_conta = {
            "/DealsPipelines": [{"Id": 1, "Name": "Vendas", "Stages": [
                {"Id": 12, "Name": "Proposta", "Ordination": 2}, {"Id": 11, "Name": "Contato", "Ordination": 1}]}],
            "/Fields": [{"Id": i, "Key": f"deal_{i}", "Name": f"Campo {i}", "EntityId": 2, "TypeId": 1,
                         "OptionsTableId": None} for i in range(1, 6)],
            "/Checklists": [{"Id": 7, "Name": "Antes da proposta", "DealStageId": 12, "DealFilterId": None,
                             "Fields": [{"Name": "Campo 1", "Required": True, "Ordination": 1, "FieldKey": "deal_1"}]}],
            "/DocumentTemplates": [{"Id": 3, "Name": "Proposta comercial"}],
            "/Fields@OptionsTables@Options": [{"Id": 31, "TableId": 30, "Name": "Sim"},
                                              {"Id": 32, "TableId": 30, "Name": "Não"},
                                              {"Id": 41, "TableId": 40, "Name": "Outra"}],
        }
        arquivos = dict(TEMPLATE_FALSO, **{"src/assets/logo.png": "corrompido", "src/config.json": '{"a": 1}',
                                           CAMINHO_FUNDO: "export const fundo = 2\n"})
        self.projetos = {"p1": {
            "proj": {"id": "p1", "name": "Mesa do vendedor", "hasScreen": True,
                     "deployedAt": "2026-10-01T10:00:00Z", "lastVersionAt": "2026-10-01T10:00:00Z"},
            "mod": {"permissionType": "users", "allowedUsers": [99], "iconClass": "fa-sparkles"},
            "snaps": [{"id": "s1", "buildStatus": "ready", "deployed": True, "createdAt": "2026-10-01T10:00:00Z",
                       "arquivos": arquivos}]}}
        falsa = self

        class Manipulador(BaseHTTPRequestHandler):
            def log_message(self, *a):
                pass

            def _tratar(self, metodo):
                n = int(self.headers.get("Content-Length") or 0)
                corpo = json.loads(self.rfile.read(n).decode("utf-8")) if n else None
                falsa.chamadas.append((metodo, self.path, corpo))
                falsa.chaves.append(self.headers.get("User-Key"))
                if falsa.redirecionar_para:
                    self.send_response(302)
                    self.send_header("Location", falsa.redirecionar_para + self.path)
                    self.send_header("Content-Length", "0")
                    self.end_headers()
                    return
                try:
                    codigo, resposta = falsa.rotear(metodo, self.path, corpo, self.headers.get("User-Key"))
                except Exception as e:  # noqa: BLE001 — a API falsa responde 500, como a de verdade
                    codigo, resposta = 500, {"message": repr(e)}
                rota = urllib.parse.urlsplit(self.path).path
                if metodo == "POST" and rota in falsa.falhar_post:
                    codigo, resposta = falsa.falhar_post[rota], {"message": "Bad Gateway"}
                derrubar = falsa.derrubar_post.get(rota) if metodo == "POST" else None
                if derrubar == "sem_resposta":  # fecha sem a linha de status: RemoteDisconnected no cliente
                    self.close_connection = True
                    return
                dados = b"" if resposta is None else json.dumps(resposta, ensure_ascii=False).encode("utf-8")
                if derrubar == "corpo_pela_metade":  # promete o corpo inteiro e manda um pedaço: IncompleteRead
                    self.close_connection = True
                    try:
                        self.send_response(codigo)
                        self.send_header("Content-Length", str(len(dados) + 100))
                        self.end_headers()
                        self.wfile.write(dados[:5])
                    except OSError:
                        pass
                    return
                try:
                    self.send_response(codigo)
                    self.send_header("Content-Type", "application/json")
                    self.send_header("Content-Length", str(len(dados)))
                    self.end_headers()
                    self.wfile.write(dados)
                except OSError:
                    pass  # o cliente desistiu (tempo esgotado)

            def do_GET(self):
                self._tratar("GET")

            def do_POST(self):
                self._tratar("POST")

            def do_PATCH(self):
                self._tratar("PATCH")

        self.servidor = ThreadingHTTPServer(("127.0.0.1", 0), Manipulador)
        self.servidor.daemon_threads = True
        self.servidor.block_on_close = False
        self.base = f"http://127.0.0.1:{self.servidor.server_address[1]}"
        threading.Thread(target=self.servidor.serve_forever, daemon=True).start()

    def fechar(self):
        self.servidor.shutdown()
        self.servidor.server_close()

    def posts(self, trecho=""):
        return [c for c in self.chamadas if c[0] == "POST" and trecho in c[1]]

    def rotear(self, metodo, caminho, corpo, chave):
        url = urllib.parse.urlsplit(caminho)
        rota, q = url.path, urllib.parse.parse_qs(url.query)
        if self.ecoar_chave:
            return 400, {"message": f"chave recusada: {chave}"}
        if rota == "/Account":
            return 200, {"value": [{"Id": self.conta_id, "Name": "Conta Teste"}]}
        if rota == "/Self":
            return 200, {"value": [{"Id": self.eu_id, "Name": "Integração"}]}
        if rota == "/Users":
            filtro = q.get("$filter", [""])[0]
            m = re.match(r"^Email eq '(.*)'$", filtro)
            if m:
                email = m.group(1).replace("''", "'")
                return 200, {"value": [{"Id": i, "Name": n, "Email": e} for i, (n, e) in self.usuarios.items() if e == email]}
            ids = [int(x) for x in re.findall(r"Id eq (\d+)", filtro)]
            return 200, {"value": [{"Id": i, "Name": self.usuarios[i][0]} for i in ids if i in self.usuarios]}
        if rota in self.config_da_conta:
            if metodo != "GET":
                return 405, {"message": "só leitura"}
            regs = self.config_da_conta[rota]
            filtro = q.get("$filter", [""])[0]
            m = re.match(r"^Id gt (\d+)", filtro)
            if m:
                regs = [r for r in regs if r["Id"] > int(m.group(1))]
            m = re.search(r"TableId eq (\d+)", filtro)
            if m:
                regs = [r for r in regs if r.get("TableId") == int(m.group(1))]
            if "$top" in q:
                regs = regs[:int(q["$top"][0])]
            return 200, {"value": regs}
        if rota == "/templates":
            return 200, [{"id": TEMPLATE_MODULO, "name": "ploomes-ai-builder-module-scaffold"}]
        if rota == "/projects" and metodo == "GET":
            tela = q.get("hasScreen", [None])[0]
            return 200, [p["proj"] for p in self.projetos.values()
                         if tela is None or str(p["proj"]["hasScreen"]).lower() == tela]
        if rota == "/projects" and metodo == "POST":
            if self.segurar_criar_s:
                time.sleep(self.segurar_criar_s)
            self.n += 1
            pid = f"p-novo-{self.n}"
            self.projetos[pid] = {
                "proj": {"id": pid, "name": corpo["name"], "hasScreen": corpo.get("hasScreen", False), "deployedAt": None},
                "mod": {"permissionType": corpo["permissionType"], "allowedUsers": corpo["allowedUsers"],
                        "iconClass": corpo.get("iconClass")},
                "snaps": []}
            return 201, self.projetos[pid]["proj"]
        m = re.match(r"^/(projects|modules)/([^/]+)(/.*)?$", rota)
        if not m or m.group(2) not in self.projetos:
            return 404, {"message": "não achei"}
        p, resto = self.projetos[m.group(2)], m.group(3) or ""
        if m.group(1) == "modules":
            if resto == "/permissions" and metodo == "PATCH":
                p["mod"]["allowedUsers"] = corpo["grantIds"]
                return 204, None
            return 200, p["mod"]
        if resto == "":
            return 200, p["proj"]
        if resto == "/snapshots":
            return 200, [{k: v for k, v in s.items() if k != "arquivos"} for s in p["snaps"]]
        m2 = re.match(r"^/snapshots/([^/]+)/source(/content)?$", resto)
        if m2:
            snap = next((s for s in p["snaps"] if s["id"] == m2.group(1)), None)
            if snap is None:
                return 404, {"message": "versão não existe"}
            if not m2.group(2):
                return 200, {"paths": sorted(snap["arquivos"])}
            c = q["path"][0]
            if c == self.falhar_conteudo:
                return 500, {"message": "falha forçada"}
            v = snap["arquivos"][c]
            return 200, json.loads(v) if c.endswith(".json") else v
        if resto == "/code/save" and metodo == "POST":
            if self.segurar_save_s:
                time.sleep(self.segurar_save_s)
            arquivos = dict(p["snaps"][0]["arquivos"]) if p["snaps"] else dict(TEMPLATE_FALSO)
            arquivos.update({f["path"]: f["content"] for f in corpo["files"]})
            self.n += 1
            p["snaps"].insert(0, {"id": f"s-nova-{self.n}", "buildStatus": self.build_novo, "deployed": False,
                                  "createdAt": "2026-10-28T12:00:00Z", "arquivos": arquivos})
            return 202, {"status": "accepted", "runId": f"r{self.n}"}
        return 404, {"message": "rota desconhecida"}


def _rodar(argv, falsa=None, **amb):
    """Roda o main() aqui dentro, contra a API falsa. Devolve (código de saída, tudo que saiu na tela)."""
    if falsa is not None:
        amb = {"CONSTRUTOR_API": falsa.base, "CONSTRUTOR_CRM": falsa.base, **amb}
    antes = {k: os.environ.get(k) for k in amb}
    os.environ.update(amb)
    saida = io.StringIO()
    try:
        with contextlib.redirect_stdout(saida), contextlib.redirect_stderr(saida):
            try:
                codigo = main([str(a) for a in argv])
            except SystemExit as e:
                codigo = e.code if isinstance(e.code, int) else (0 if e.code is None else 1)
                if isinstance(e.code, str):
                    print(e.code)
    finally:
        for k, v in antes.items():
            if v is None:
                os.environ.pop(k, None)
            else:
                os.environ[k] = v
    return codigo, saida.getvalue()


def _env(tmp):
    arq = Path(tmp) / "x-12345678-env.txt"
    arq.write_text(f"UK_PLOOMES=nao-e-esta\nUK_PLOOMES_CLIENTE={CHAVE_TESTE}\n", encoding="utf-8")
    return arq


def _meta(pasta):
    return json.loads(Path(longo(Path(pasta) / ".construtor.json")).read_text(encoding="utf-8"))


def _base_e_copia(falsa, tmp):
    """Baixa a p1 para <tmp>/base e copia para <tmp>/editado — o que se faz antes de editar."""
    cod, out = _rodar(["baixar", "--env", _env(tmp), "--projeto", "p1", "--pasta", Path(tmp) / "base"], falsa)
    assert cod == 0, f"o baixar da base falhou: {out}"
    shutil.copytree(longo(Path(tmp) / "base"), longo(Path(tmp) / "editado"))
    return Path(tmp) / "base", Path(tmp) / "editado"


def _escrever(pasta, caminho, texto):
    gravar(Path(pasta) / caminho, texto)  # cria as pastas que faltam


def caso_simulacao_nao_escreve(tmp, falsa):
    cod, out = _rodar(["criar", "--env", _env(tmp), "--conta", 5, "--nome", "Tela X", "--emails", "ana@cliente.com"], falsa)
    assert cod == 0, out
    assert not falsa.posts(), f"a simulação fez POST: {falsa.posts()}"
    assert "SIMULAÇÃO" in out and "Ana (11)" in out, out


def caso_confirmacao_errada(tmp, falsa):
    cod, out = _rodar(["criar", "--env", _env(tmp), "--conta", 5, "--nome", "Tela X", "--usuarios", "11",
                       "--executar", "--confirmo", "CONFIRMO 2"], falsa)
    assert cod != 0, out
    assert not falsa.posts(), f"POST com a confirmação errada: {falsa.posts()}"


def caso_conta_divergente(tmp, falsa):
    falsa.conta_id = 7
    cod, out = _rodar(["criar", "--env", _env(tmp), "--conta", 5, "--nome", "Tela X", "--usuarios", "11",
                       "--executar", "--confirmo", "CONFIRMO 1"], falsa)
    assert cod != 0 and "7" in out, out
    assert not falsa.posts(), f"POST com a chave de outra conta: {falsa.posts()}"


def caso_criar(tmp, falsa):
    cod, out = _rodar(["criar", "--env", _env(tmp), "--conta", 5, "--nome", "Tela X", "--usuarios", "11",
                       "--executar", "--confirmo", "CONFIRMO 1"], falsa)
    assert cod == 0, out
    posts = falsa.posts()
    assert [c[1] for c in posts] == ["/projects", "/projects/p-novo-1/code/save"], posts
    corpo = posts[0][2]
    assert corpo["hasScreen"] is True and sorted(corpo["allowedUsers"]) == [11, 99], corpo
    assert [f["path"] for f in posts[1][2]["files"]] == ["src/App.tsx"], posts[1][2]
    # Nenhuma rota que gasta crédito ou que publica existe no código (as agulhas se montam por partes,
    # para este próprio teste não casar com elas).
    codigo = Path(__file__).read_text(encoding="utf-8")
    proibido = re.compile(r"send" + "_message|\\b(dep" + "loy|pub" + "lish)\\b", re.IGNORECASE)
    achados = proibido.findall(codigo)
    assert not achados, f"o código cita rota proibida: {achados}"


def caso_baixar_pula_binario(tmp, falsa):
    pasta = Path(tmp) / "tela"
    cod, out = _rodar(["baixar", "--env", _env(tmp), "--projeto", "p1", "--pasta", pasta], falsa)
    assert cod == 0, out
    assert not os.path.exists(longo(pasta / "src/assets/logo.png")), "baixou o binário"
    assert not [c for c in falsa.chamadas if "logo.png" in c[1]], "pediu o binário à API"
    assert Path(longo(pasta / "src/App.tsx")).read_text(encoding="utf-8") == TEMPLATE_FALSO["src/App.tsx"]
    meta = _meta(pasta)
    assert meta["versao"] == "s1" and meta["versao_mais_recente"] == "s1" and meta["versao_publicada"] == "s1", meta
    assert meta["binarios_nao_baixados"] == ["src/assets/logo.png"] and meta["build"] == "pronto", meta
    assert set(meta) >= {"projeto", "nome", "versao", "versao_mais_recente", "versao_publicada", "build",
                         "arquivos", "binarios_nao_baixados", "gravado_em"}, meta


def caso_baixar_pasta_existente(tmp, falsa):
    pasta = Path(tmp) / "tela"
    pasta.mkdir()
    (pasta / "anotacao.txt").write_text("não apague", encoding="utf-8")
    cod, out = _rodar(["baixar", "--env", _env(tmp), "--projeto", "p1", "--pasta", pasta], falsa)
    assert cod != 0, out
    assert (pasta / "anotacao.txt").read_text(encoding="utf-8") == "não apague"
    assert sorted(os.listdir(pasta)) == ["anotacao.txt"], os.listdir(pasta)
    assert not [c for c in falsa.chamadas if "/content" in c[1]], "baixou numa pasta com arquivo"


def caso_trava_de_versao(tmp, falsa):
    base, editado = _base_e_copia(falsa, tmp)
    _escrever(editado, "src/App.tsx", "export default function App() {\n  return <main />\n}\n")
    snaps = falsa.projetos["p1"]["snaps"]  # alguém salvou pelo editor depois do baixar
    snaps.insert(0, dict(snaps[0], id="s-editor", deployed=False))
    cod, out = _rodar(["salvar", "--env", _env(tmp), "--conta", 5, "--base", base, "--editado", editado,
                       "--executar", "--confirmo", "CONFIRMO 1"], falsa)
    assert cod != 0 and "s-editor" in out and "aixe de novo" in out, out
    assert not falsa.posts(), f"gravou por cima da versão de outra pessoa: {falsa.posts()}"


def caso_recusa_base_e_lib(tmp, falsa):
    base, editado = _base_e_copia(falsa, tmp)
    _escrever(editado, "src/App.tsx", "export default function App() {\n  return <main />\n}\n")
    for caminho in ("src/main.tsx", "src/lib/x.ts"):
        _escrever(editado, caminho, "// mexido\n")
        cod, out = _rodar(["salvar", "--env", _env(tmp), "--conta", 5, "--base", base, "--editado", editado,
                           "--permitir-novos", "--executar", "--confirmo", "CONFIRMO 2"], falsa)
        assert cod != 0 and "BLOQUEIO" in out and caminho in out, out
        os.remove(longo(Path(editado) / caminho))
        if caminho == "src/main.tsx":
            shutil.copy(longo(Path(base) / caminho), longo(Path(editado) / caminho))
    assert not falsa.posts(), f"enviou a base do construtor: {falsa.posts()}"


def caso_crlf(tmp, falsa):
    base, editado = _base_e_copia(falsa, tmp)
    _escrever(editado, "src/App.tsx", "export default function App() {\r\n  return <main />\r\n}\r\n")
    _escrever(editado, LIB_REAL, TEMPLATE_FALSO[LIB_REAL].replace("\n", "\r\n"))  # só o fim de linha
    cod, out = _rodar(["salvar", "--env", _env(tmp), "--conta", 5, "--base", base, "--editado", editado,
                       "--executar", "--confirmo", "CONFIRMO 1"], falsa)
    assert cod == 0, out
    enviados = falsa.posts("/code/save")[0][2]["files"]
    assert [f["path"] for f in enviados] == ["src/App.tsx"], enviados
    assert "\r" not in enviados[0]["content"], "enviou CRLF"
    assert "Conferido" in out, out
    meta = _meta(editado)
    assert meta["versao"] != "s1" and meta["build"] == "pronto", meta


def caso_build_falhou(tmp, falsa):
    base, editado = _base_e_copia(falsa, tmp)
    _escrever(editado, "src/App.tsx", "export default function App() {\n  return <main\n}\n")
    falsa.build_novo = "failed"
    cod, out = _rodar(["salvar", "--env", _env(tmp), "--conta", 5, "--base", base, "--editado", editado,
                       "--executar", "--confirmo", "CONFIRMO 1"], falsa)
    assert cod != 0, out
    meta = _meta(editado)
    assert meta["build"] == "falhou" and meta["versao"] == falsa.projetos["p1"]["snaps"][0]["id"], meta


def caso_chave_nao_vaza(tmp, falsa):
    falsa.ecoar_chave = True
    cod, out = _rodar(["listar", "--env", _env(tmp)], falsa)
    assert cod != 0 and "<USER_KEY>" in out, out
    assert CHAVE_TESTE not in out, "a chave apareceu na saída"
    falsa.chamadas.clear()
    # Com --conta, sem a trava o script iria primeiro ao CRM (local) — e a API falsa registraria.
    cod, out = _rodar(["listar", "--env", _env(tmp), "--conta", 5], falsa, CONSTRUTOR_API="https://outro.host")
    assert cod != 0 and "Nada foi chamado" in out, out
    assert not falsa.chamadas, f"chamou com host fora da lista: {falsa.chamadas}"


def caso_caminho_longo(tmp, falsa):
    if os.name != "nt":
        return "pulado: só no Windows"
    fundo = Path(tmp) / ("a" * 70) / ("b" * 70) / ("c" * 70)
    try:
        pasta = fundo / "tela"
        assert len(str(pasta / CAMINHO_FUNDO)) > 260, len(str(pasta / CAMINHO_FUNDO))
        cod, out = _rodar(["baixar", "--env", _env(tmp), "--projeto", "p1", "--pasta", pasta], falsa)
        assert cod == 0, out
        assert os.path.isfile(longo(pasta / CAMINHO_FUNDO)), "não gravou o arquivo do caminho longo"
        assert _meta(pasta)["versao"] == "s1"
        falsa.falhar_conteudo = CAMINHO_FUNDO  # falha no meio: App.tsx e config.json já foram gravados
        parcial = fundo / "tela2"
        cod, out = _rodar(["baixar", "--env", _env(tmp), "--projeto", "p1", "--pasta", parcial], falsa)
        assert cod != 0, out
        assert not os.path.exists(longo(parcial)), "a pasta parcial ficou"
    finally:
        shutil.rmtree(longo(Path(tmp) / ("a" * 70)), ignore_errors=True)


def caso_tempo_esgotado(tmp, falsa):
    global TEMPO_SAVE_S
    base, editado = _base_e_copia(falsa, tmp)
    _escrever(editado, "src/App.tsx", "export default function App() {\n  return <main />\n}\n")
    falsa.segurar_save_s = 1.5
    antes, TEMPO_SAVE_S = TEMPO_SAVE_S, 0.4
    try:
        cod, out = _rodar(["salvar", "--env", _env(tmp), "--conta", 5, "--base", base, "--editado", editado,
                           "--executar", "--confirmo", "CONFIRMO 1"], falsa)
    finally:
        TEMPO_SAVE_S = antes
    assert cod != 0, out
    assert len(falsa.posts("/code/save")) == 1, f"reenviou: {falsa.posts('/code/save')}"
    assert "snapshots" in out, out


def caso_redirecionamento_recusado(tmp, falsa):
    outra = ApiFalsa()  # o host para onde o redirecionamento manda — não pode receber a chave
    try:
        falsa.redirecionar_para = outra.base.replace("127.0.0.1", "localhost")
        cod, out = _rodar(["listar", "--env", _env(tmp)], falsa)
        assert cod != 0 and "recusado" in out, out
        assert CHAVE_TESTE not in out, "a chave apareceu na saída"
        assert not outra.chamadas and CHAVE_TESTE not in outra.chaves, f"a chave chegou ao outro host: {outra.chamadas}"
        assert len(falsa.chamadas) == 1, f"seguiu ou repetiu: {falsa.chamadas}"
    finally:
        outra.fechar()


def _criar_com_tempo_curto(tmp, falsa):
    global TEMPO_SAVE_S
    antes, TEMPO_SAVE_S = TEMPO_SAVE_S, 0.4
    try:
        return _rodar(["criar", "--env", _env(tmp), "--conta", 5, "--nome", "Tela X", "--usuarios", "11",
                       "--executar", "--confirmo", "CONFIRMO 1"], falsa)
    finally:
        TEMPO_SAVE_S = antes


def caso_criar_tempo_esgotado_no_projeto(tmp, falsa):
    falsa.segurar_criar_s = 1.5
    cod, out = _criar_com_tempo_curto(tmp, falsa)
    assert cod != 0, out
    assert len(falsa.posts("/projects")) == 1 and falsa.posts()[0][1] == "/projects", f"reenviou: {falsa.posts()}"
    assert not falsa.posts("/code/save"), "seguiu para o code/save sem saber o Id da tela"
    assert "Telas personalizadas" in out and "Tela X" in out and "NÃO rode criar de novo" in out, out


def caso_criar_tempo_esgotado_no_save(tmp, falsa):
    falsa.segurar_save_s = 1.5
    cod, out = _criar_com_tempo_curto(tmp, falsa)
    assert cod != 0, out
    posts = [c[1] for c in falsa.posts()]
    assert posts == ["/projects", "/projects/p-novo-1/code/save"], f"reenviou: {posts}"
    i = falsa.chamadas.index(falsa.posts("/code/save")[0])
    assert any(c[0] == "GET" and c[1] == "/projects/p-novo-1/snapshots" for c in falsa.chamadas[i + 1:]),         "não consultou snapshots depois do tempo esgotado"
    assert "Não rode criar de novo" in out and "p-novo-1" in out and "Telas" in out, out


def _criar_executando(tmp, falsa, nome="Tela X", *extra):
    return _rodar(["criar", "--env", _env(tmp), "--conta", 5, "--nome", nome, "--usuarios", "11", *extra,
                   "--executar", "--confirmo", "CONFIRMO 1"], falsa)


def _posts_de_projeto(falsa):
    return [c for c in falsa.posts() if c[1] == "/projects"]


def caso_criar_502_no_projeto(tmp, falsa):
    falsa.falhar_post = {"/projects": 502}  # a API aplica e o balanceador responde 502
    cod, out = _criar_executando(tmp, falsa)
    assert cod != 0 and "Traceback" not in out, out
    assert len(_posts_de_projeto(falsa)) == 1 and not falsa.posts("/code/save"), f"reenviou: {falsa.posts()}"
    assert "RESPOSTA INCERTA" in out and "NÃO rode criar de novo" in out and "Telas personalizadas" in out, out
    # Quem roda de novo mesmo assim para na tela de mesmo nome, sem segundo POST.
    falsa.falhar_post = {}
    cod, out = _criar_executando(tmp, falsa)
    assert cod != 0 and "já existe tela chamada 'Tela X'" in out and "p-novo-1" in out, out
    assert len(_posts_de_projeto(falsa)) == 1, f"criou a segunda tela: {falsa.posts()}"


def _criar_conexao_cai_no_save(tmp, falsa, modo):
    falsa.derrubar_post = {"/projects/p-novo-1/code/save": modo}
    cod, out = _criar_executando(tmp, falsa)
    assert cod != 0 and "Traceback" not in out, out
    posts = [c[1] for c in falsa.posts()]
    assert posts == ["/projects", "/projects/p-novo-1/code/save"], f"reenviou: {posts}"
    i = falsa.chamadas.index(falsa.posts("/code/save")[0])
    assert any(c[0] == "GET" and c[1] == "/projects/p-novo-1/snapshots" for c in falsa.chamadas[i + 1:]), \
        "não consultou snapshots depois da conexão caída"
    assert "RESPOSTA INCERTA" in out and "Não rode criar de novo" in out and "p-novo-1" in out, out
    assert CHAVE_TESTE not in out, "a chave apareceu na saída"


def caso_criar_conexao_cai_no_save(tmp, falsa):
    _criar_conexao_cai_no_save(tmp, falsa, "sem_resposta")


def caso_criar_corpo_pela_metade_no_save(tmp, falsa):
    _criar_conexao_cai_no_save(tmp, falsa, "corpo_pela_metade")


def caso_criar_mesmo_nome_bloqueia(tmp, falsa):
    cod, out = _criar_executando(tmp, falsa, " mesa do VENDEDOR ")  # a p1 se chama "Mesa do vendedor"
    assert cod != 0 and "já existe tela chamada" in out and "p1" in out and "--permitir-mesmo-nome" in out, out
    assert not falsa.posts(), f"POST com tela de mesmo nome: {falsa.posts()}"


def caso_criar_mesmo_nome_permitido(tmp, falsa):
    cod, out = _criar_executando(tmp, falsa, "Mesa do vendedor", "--permitir-mesmo-nome")
    assert cod == 0, out
    assert [c[1] for c in falsa.posts()] == ["/projects", "/projects/p-novo-1/code/save"], falsa.posts()


def _salvar(tmp, falsa, base, editado, n=1):
    return _rodar(["salvar", "--env", _env(tmp), "--conta", 5, "--base", base, "--editado", editado,
                   "--executar", "--confirmo", f"CONFIRMO {n}"], falsa)


def _primeira_entrega(tmp, falsa):
    """Baixa, edita, salva; devolve a pasta editada, que agora carrega o .construtor.json da versão salva."""
    base, editado = _base_e_copia(falsa, tmp)
    _escrever(editado, "src/App.tsx", "export default function App() {\n  return <main />\n}\n")
    cod, out = _salvar(tmp, falsa, base, editado)
    assert cod == 0, f"a primeira entrega falhou: {out}"
    return editado


def _baixar(tmp, falsa, nome):
    pasta = Path(tmp) / nome
    cod, out = _rodar(["baixar", "--env", _env(tmp), "--projeto", "p1", "--pasta", pasta], falsa)
    assert cod == 0, out
    return pasta


def caso_trava_entre_entregas(tmp, falsa):
    editado = _primeira_entrega(tmp, falsa)
    salva = _meta(editado)["versao"]
    snaps = falsa.projetos["p1"]["snaps"]  # alguém mudou pelo editor depois da entrega
    snaps.insert(0, dict(snaps[0], id="s-editor", deployed=False))
    base2 = _baixar(tmp, falsa, "base2")  # a base nova, a cada entrega, já traz a mudança do editor
    _escrever(editado, "src/App.tsx", "export default function App() {\n  return <main className=\"x\" />\n}\n")
    antes = len(falsa.chamadas)
    cod, out = _salvar(tmp, falsa, base2, editado)
    assert cod != 0 and "a tela mudou no construtor desde a sua última subida" in out, out
    assert f"({salva} → s-editor)" in out, out
    assert len(falsa.chamadas) == antes, f"chamou a API antes da trava: {falsa.chamadas[antes:]}"
    assert len(falsa.posts("/code/save")) == 1, f"gravou por cima do editor: {falsa.posts('/code/save')}"


def caso_segunda_entrega_aprovada(tmp, falsa):
    editado = _primeira_entrega(tmp, falsa)
    base2 = _baixar(tmp, falsa, "base2")  # ninguém mexeu: a base nova é a versão da primeira entrega
    assert _meta(base2)["versao"] == _meta(editado)["versao"]
    _escrever(editado, "src/App.tsx", "export default function App() {\n  return <main className=\"x\" />\n}\n")
    cod, out = _salvar(tmp, falsa, base2, editado)
    assert cod == 0 and "Conferido" in out, out
    assert len(falsa.posts("/code/save")) == 2, falsa.posts("/code/save")


def caso_portao_caminho_longo(tmp, falsa):
    # 1. Qualquer OSError no portão vira BLOQUEIO, sem traceback e sem chamar a API.
    base, editado = _base_e_copia(falsa, tmp)
    _escrever(editado, "src/App.tsx", "export default function App() {\n  return <main />\n}\n")
    emp = empacotador()
    original = emp.conferir

    def quebra(*a, **k):
        raise OSError(206, "O nome do arquivo ou a extensão é muito grande")
    emp.conferir = quebra
    antes = len(falsa.chamadas)
    try:
        cod, out = _salvar(tmp, falsa, base, editado)
    finally:
        emp.conferir = original
    assert cod != 0 and "BLOQUEIO: caminho longo demais para o Windows" in out and "subst" in out, out
    assert len(falsa.chamadas) == antes and not falsa.posts(), f"chamou a API: {falsa.chamadas[antes:]}"
    # 2. No Windows, a pasta editada com mais de 260 caracteres passa pelo portão (ele roda numa cópia curta).
    if os.name != "nt":
        return "parte 2 pulada: só no Windows"
    fundo = Path(tmp) / ("a" * 70) / ("b" * 70) / ("c" * 70)
    try:
        cod, out = _rodar(["baixar", "--env", _env(tmp), "--projeto", "p1", "--pasta", fundo / "base"], falsa)
        assert cod == 0, out
        shutil.copytree(longo(fundo / "base"), longo(fundo / "editado"))
        assert len(str(fundo / "editado" / CAMINHO_FUNDO)) > 260
        _escrever(fundo / "editado", "src/App.tsx", "export default function App() {\n  return <main />\n}\n")
        cod, out = _salvar(tmp, falsa, fundo / "base", fundo / "editado")
        assert cod == 0 and "Conferido" in out, out
    finally:
        shutil.rmtree(longo(Path(tmp) / ("a" * 70)), ignore_errors=True)


def caso_portao_bloqueia(tmp, falsa):
    base, editado = _base_e_copia(falsa, tmp)
    _escrever(editado, "src/App.tsx", "export default function App() {\n  fetch('/x')\n  return <main />\n}\n")
    antes = len(falsa.chamadas)
    cod, out = _rodar(["salvar", "--env", _env(tmp), "--conta", 5, "--base", base, "--editado", editado,
                       "--executar", "--confirmo", "CONFIRMO 1"], falsa)
    assert cod != 0 and "BLOQUEIO" in out and "src/App.tsx" in out and "só src/ploomes/api.ts fala com a API" in out, out
    assert len(falsa.chamadas) == antes, f"chamou a API antes do portão: {falsa.chamadas[antes:]}"
    assert not falsa.posts(), f"gravou com o portão reprovado: {falsa.posts()}"


def caso_base_local_desatualizada(tmp, falsa):
    # A base do construtor mudou na tela do CRM e a bancada/scaffold/src daqui ficou para trás.
    falsa.projetos["p1"]["snaps"][0]["arquivos"][LIB_REAL] += "export const maisNova = 1\n"
    base, editado = _base_e_copia(falsa, tmp)
    _escrever(editado, "src/App.tsx", "export default function App() {\n  return <main />\n}\n")
    antes = len(falsa.chamadas)
    cod, out = _rodar(["salvar", "--env", _env(tmp), "--conta", 5, "--base", base, "--editado", editado,
                       "--executar", "--confirmo", "CONFIRMO 1"], falsa)
    assert cod != 0 and f"a base do construtor mudou: atualize bancada/scaffold/src a partir de {base}" in out, out
    assert len(falsa.chamadas) == antes and not falsa.posts(), f"chamou a API: {falsa.chamadas[antes:]}"


KIT_ONBOARDING = Path(__file__).resolve().parent.parent.parent / "onboarding-de-tela" / "kit"
PACOTE_EXEMPLO = Path(__file__).resolve().parent.parent / "exemplo" / "pacote-construtor"
ROTEIRO_TESTE = ("import type { Roteiro } from './kit';\n"
                 "export const roteiro: Roteiro = { tela: 't', versao: '1', nome: 'T', boasVindas: [], "
                 "tour: [{ id: 'p1', alvo: 'quadro', titulo: 'Q', texto: 'q' }], "
                 "primeirosPassos: [{ id: 'abrir', titulo: 'Abra' }], dicas: {} };\n")
APP_COM_ONBOARDING = (
    "import { Navigate, Route, Routes } from 'react-router';\n"
    "import { OnboardingProvider, useOnboarding } from './onboarding/kit';\n"
    "import { roteiro } from './onboarding/roteiro';\n"
    "function T() { const o = useOnboarding(); return <main className=\"app\"><div data-onboarding=\"quadro\" "
    "onClick={() => o.marcar('abrir')} /></main>; }\n"
    "export default function App() { return <OnboardingProvider roteiro={roteiro} usuarioId={0} pronto><Routes>"
    "<Route path=\"/\" element={<T />} /><Route path=\"*\" element={<Navigate to=\"/\" replace />} /></Routes>"
    "</OnboardingProvider>; }\n")
APP_SEM_PROVIDER = (
    "import { Navigate, Route, Routes } from 'react-router';\n"
    "import { roteiro } from './onboarding/roteiro';\n"
    "export default function App() { return <Routes><Route path=\"/\" element={<main className=\"app\" "
    "data-onboarding=\"quadro\" />} /><Route path=\"*\" element={<Navigate to=\"/\" replace />} /></Routes>; }\n"
    "void roteiro\n")


def _com_onboarding(editado, provider=True, ploomes=False):
    """O que quem edita acrescenta: kit real, roteiro e App; com ploomes=True, também o api.ts e o useConexao.ts do pacote."""
    for p in KIT_ONBOARDING.rglob("*"):
        if p.is_file() and p.name != "LEIA-ME.md":
            _escrever(editado, "src/onboarding/kit/" + p.relative_to(KIT_ONBOARDING).as_posix(), ler(p))
    _escrever(editado, "src/onboarding/roteiro.ts", ROTEIRO_TESTE)
    _escrever(editado, "src/App.tsx", APP_COM_ONBOARDING if provider else APP_SEM_PROVIDER)
    if ploomes:
        for nome in ("api.ts", "useConexao.ts"):
            _escrever(editado, "src/ploomes/" + nome, ler(PACOTE_EXEMPLO / "src" / "ploomes" / nome))


def _salvar_modo(tmp, falsa, base, editado, *modo):
    n = len(_arquivos_novos(base, editado))  # o número do CONFIRMO é o de arquivos enviados
    return _rodar(["salvar", "--env", _env(tmp), "--conta", 5, "--base", base, "--editado", editado, *modo,
                   "--permitir-novos", "--executar", "--confirmo", f"CONFIRMO {n}"], falsa)


def caso_tela_existente_aprovada(tmp, falsa):
    base, editado = _base_e_copia(falsa, tmp)
    _com_onboarding(editado)
    cod, out = _salvar_modo(tmp, falsa, base, editado, "--tela-existente")
    assert cod == 0, out
    enviados = [f["path"] for f in falsa.posts("/code/save")[0][2]["files"]]
    assert "src/onboarding/roteiro.ts" in enviados and "src/App.tsx" in enviados, enviados
    assert all(c == "src/App.tsx" or c.startswith("src/onboarding/") for c in enviados), enviados


def _arquivos_novos(base, editado):
    """Quantos arquivos o salvar vai enviar: os que diferem da base (o número do CONFIRMO)."""
    a, b = arquivos_de(base), arquivos_de(editado)
    return [c for c in b if not binario(c) and (c not in a or ler(a[c]) != ler(b[c]))]


def caso_tela_existente_arquivo_novo_fora_do_onboarding(tmp, falsa):
    base, editado = _base_e_copia(falsa, tmp)
    _com_onboarding(editado)
    _escrever(editado, "src/extra.ts", "export const x = 1\n")
    cod, out = _salvar_modo(tmp, falsa, base, editado, "--tela-existente")
    assert cod != 0 and "BLOQUEIO" in out and "src/extra.ts é novo" in out, out
    assert not falsa.posts(), f"gravou com o portão reprovado: {falsa.posts()}"


def caso_tela_existente_sem_provider(tmp, falsa):
    base, editado = _base_e_copia(falsa, tmp)
    _com_onboarding(editado, provider=False)
    cod, out = _salvar_modo(tmp, falsa, base, editado, "--tela-existente")
    assert cod != 0 and "o OnboardingProvider não envolve a tela" in out, out
    assert not falsa.posts(), f"gravou com o portão reprovado: {falsa.posts()}"


def caso_pacote_aprovado(tmp, falsa):
    base, editado = _base_e_copia(falsa, tmp)
    _com_onboarding(editado, ploomes=True)
    cod, out = _salvar_modo(tmp, falsa, base, editado, "--pacote", PACOTE_EXEMPLO)
    assert cod == 0, out
    enviados = [f["path"] for f in falsa.posts("/code/save")[0][2]["files"]]
    assert "src/ploomes/api.ts" in enviados and "src/onboarding/kit/OnboardingProvider.tsx" in enviados, enviados


def caso_pacote_api_diferente(tmp, falsa):
    base, editado = _base_e_copia(falsa, tmp)
    _com_onboarding(editado, ploomes=True)
    _escrever(editado, "src/ploomes/api.ts", ler(PACOTE_EXEMPLO / "src" / "ploomes" / "api.ts") + "// mexido\n")
    cod, out = _salvar_modo(tmp, falsa, base, editado, "--pacote", PACOTE_EXEMPLO)
    assert cod != 0 and "src/ploomes/api.ts da tela é diferente do gerado pelo pacote" in out, out
    assert not falsa.posts(), f"gravou com o portão reprovado: {falsa.posts()}"


def caso_pacote_sem_provider(tmp, falsa):
    base, editado = _base_e_copia(falsa, tmp)
    _com_onboarding(editado, provider=False, ploomes=True)
    cod, out = _salvar_modo(tmp, falsa, base, editado, "--pacote", PACOTE_EXEMPLO)
    assert cod != 0 and "o OnboardingProvider não envolve a tela" in out, out
    assert not falsa.posts(), f"gravou com o portão reprovado: {falsa.posts()}"


def caso_ler_conta(tmp, falsa):
    global PAGINA_CONTA
    antes, PAGINA_CONTA = PAGINA_CONTA, 2  # 5 campos em páginas de 2: a paginação por Id tem de juntar as três
    try:
        saida = Path(tmp) / "conta-lida.json"
        cod, out = _rodar(["ler-conta", "--env", _env(tmp), "--conta", 5, "--saida", saida, "--tabelas", "30"], falsa)
    finally:
        PAGINA_CONTA = antes
    assert cod == 0, out
    lido = json.loads(saida.read_text(encoding="utf-8"))
    assert lido["conta"]["Id"] == 5 and lido["funis"][0]["etapas"] == ["Contato", "Proposta"], lido["funis"]
    assert [c["Key"] for c in lido["campos"]] == [f"deal_{i}" for i in range(1, 6)], lido["campos"]
    assert lido["checklists"][0]["Fields"][0]["FieldKey"] == "deal_1" and lido["modelos"][0]["nome"] == "Proposta comercial"
    assert [o["Name"] for o in lido["opcoes"]["30"]] == ["Sim", "Não"], lido["opcoes"]
    assert all(c[0] == "GET" for c in falsa.chamadas), [c[:2] for c in falsa.chamadas if c[0] != "GET"]
    assert not any("$skip" in c[1] for c in falsa.chamadas), "paginou com $skip"
    assert CHAVE_TESTE not in out and CHAVE_TESTE not in saida.read_text(encoding="utf-8"), "a chave vazou"


def caso_ler_conta_outra_conta(tmp, falsa):
    falsa.conta_id = 7
    saida = Path(tmp) / "conta-lida.json"
    cod, out = _rodar(["ler-conta", "--env", _env(tmp), "--conta", 5, "--saida", saida], falsa)
    assert cod != 0 and "7" in out and not saida.exists(), out
    cod, out = _rodar(["ler-conta", "--env", _env(tmp), "--saida", saida], falsa)
    assert cod != 0 and "--conta" in out and not saida.exists(), out


CASOS = [caso_simulacao_nao_escreve, caso_confirmacao_errada, caso_conta_divergente, caso_criar,
         caso_baixar_pula_binario, caso_baixar_pasta_existente, caso_trava_de_versao, caso_recusa_base_e_lib,
         caso_crlf, caso_build_falhou, caso_chave_nao_vaza, caso_caminho_longo, caso_tempo_esgotado,
         caso_redirecionamento_recusado, caso_criar_tempo_esgotado_no_projeto, caso_criar_tempo_esgotado_no_save,
         caso_criar_502_no_projeto, caso_criar_conexao_cai_no_save, caso_criar_corpo_pela_metade_no_save,
         caso_criar_mesmo_nome_bloqueia, caso_criar_mesmo_nome_permitido, caso_trava_entre_entregas,
         caso_segunda_entrega_aprovada, caso_portao_caminho_longo, caso_portao_bloqueia, caso_base_local_desatualizada, caso_tela_existente_aprovada,
         caso_tela_existente_arquivo_novo_fora_do_onboarding, caso_tela_existente_sem_provider,
         caso_pacote_aprovado, caso_pacote_api_diferente, caso_pacote_sem_provider, caso_ler_conta,
         caso_ler_conta_outra_conta]


def autoteste():
    global PAUSA_S, INTERVALO_S
    PAUSA_S, INTERVALO_S = 0, 0.02
    falhas = 0
    for caso in CASOS:
        falsa = ApiFalsa()
        with tempfile.TemporaryDirectory(ignore_cleanup_errors=True) as tmp:
            try:
                nota = caso(tmp, falsa)
                print(f"✓ {caso.__name__}" + (f" ({nota})" if nota else ""))
            except Exception as e:  # noqa: BLE001 — o caso que quebra conta como falha, não derruba os outros
                falhas += 1
                print(f"✗ {caso.__name__}: {type(e).__name__}: {e}")
            finally:
                falsa.fechar()
    if falhas:
        print(f"FALHOU ({falhas} de {len(CASOS)} casos)")
        return 1
    print(f"PASSOU ({len(CASOS)} casos)")
    return 0


if __name__ == "__main__":
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    sys.exit(main())
