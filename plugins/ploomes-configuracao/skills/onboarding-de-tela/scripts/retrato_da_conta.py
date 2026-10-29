# -*- coding: utf-8 -*-
"""O retrato da conta do cliente que alimenta o onboarding — só leitura na API do Ploomes.

POR QUE ELE EXISTE: o bloco do mapa e do simulador mostra os funis do cliente como eles estão configurados — etapas,
checklists com o filtro de cada um, campos com as opções, automações e as passagens entre funis. Ler isso à mão
a cada mudança erra em silêncio; este script lê, e o gerar_dados.py transforma em código.

Grava em <saida>/: conta.json, funis.json, checklists.json, campos.json, automacoes.json, perfis_de_usuario.json e
campos_do_usuario.json. Depois:
    python gerar_dados.py --retrato <saida> --tela <pasta da tela>

USO:
    python retrato_da_conta.py --env <arquivo -env.txt> --saida <pasta> [--conta <Id esperado>]
    python retrato_da_conta.py --autoteste

A chave é a linha UK_PLOOMES_CLIENTE=<chave> do arquivo --env — nunca a que passa no tráfego do navegador, e nunca
na conversa. Com --conta, a rodada PARA se a chave abrir outra conta. Só GET, com paginação por Id (nada de $skip)
e pausa entre as chamadas.

Host: só https://public-api2.ploomes.com/. Redirecionamento é recusado (o urllib levaria a User-Key junto para o
host de destino), e a chave nunca sai em mensagem de erro: aparece como <USER_KEY>.
"""
import argparse
import http.client
import json
import re
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

BASE = "https://public-api2.ploomes.com/"
LOCAL = re.compile(r"http://127\.0\.0\.1:\d+/")  # só o autoteste, com fullmatch
PAGINA = 300
PAUSA_S = 0.3




def ler_chave(arquivo):
    try:
        for linha in Path(arquivo).read_text(encoding="utf-8").splitlines():
            if linha.strip().startswith("UK_PLOOMES_CLIENTE="):
                valor = linha.split("=", 1)[1].strip()
                if valor:
                    return valor
    except OSError:
        sys.exit(f"Não achei {arquivo}. Aponte com --env o arquivo que tem a chave (a linha UK_PLOOMES_CLIENTE=...).")
    sys.exit(f"A UK_PLOOMES_CLIENTE está em branco em {arquivo}. Ela sai de Administração → Integrações → Usuários de integração, na conta do cliente.")


class Recusado(Exception):
    """Redirecionamento recusado. Não é RuntimeError de propósito: as leituras com alternativa (os perfis, as opções
    dos campos) seguem sem o dado num erro da API, mas um redirecionamento para o retrato inteiro."""


class SemRedirecionar(urllib.request.HTTPRedirectHandler):
    """Recusa todo redirecionamento: o urllib copia os cabeçalhos — a User-Key junto — para o host de destino. A
    resposta 3xx vira HTTPError e para o retrato."""

    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None


class Ploomes:
    def __init__(self, chave, base=BASE):
        if base != BASE and not LOCAL.fullmatch(base):
            raise ValueError(f"host não permitido: {base!r} (só {BASE})")
        self.chave, self.base = chave, base
        handlers = [SemRedirecionar()] + ([urllib.request.ProxyHandler({})] if base != BASE else [])
        self._abrir = urllib.request.build_opener(*handlers).open

    def mascarar(self, texto):
        texto = str(texto)
        return texto.replace(self.chave, "<USER_KEY>").replace(urllib.parse.quote(self.chave, safe=""), "<USER_KEY>")

    def get(self, rota, **q):
        # O espaço NÃO entra no safe: o filtro ("Id gt 0") vai como %20. Cru na URL, o http.client recusa (InvalidURL).
        url = self.base + rota + ("?" + urllib.parse.urlencode(q, safe="$(),;='/", quote_via=urllib.parse.quote) if q else "")
        for tentativa in range(4):
            try:
                req = urllib.request.Request(url, headers={"User-Key": self.chave})
                with self._abrir(req, timeout=120) as r:
                    return json.load(r).get("value", [])
            except urllib.error.HTTPError as e:
                if e.code == 429 and tentativa < 3:
                    time.sleep(int(e.headers.get("Retry-After") or 5))
                    continue
                if 300 <= e.code < 400:
                    raise Recusado(self.mascarar(f"HTTP {e.code} em {rota}: redirecionamento para {e.headers.get('Location')} "
                                                 "recusado — a chave só vai ao host da API. Nada foi seguido.")) from None
                try:
                    corpo = e.read().decode("utf-8", "replace")[:300]
                except (OSError, http.client.HTTPException):
                    corpo = "(corpo ilegível)"
                raise RuntimeError(self.mascarar(f"HTTP {e.code} em {rota}: {corpo}")) from None
            except urllib.error.URLError as e:
                raise RuntimeError(self.mascarar(f"{rota}: sem conexão ({e.reason})")) from None
            except (OSError, http.client.HTTPException) as e:
                raise RuntimeError(self.mascarar(f"{rota}: a conexão caiu ({type(e).__name__}: {e})")) from None
        raise RuntimeError(f"{rota}: a API pediu para esperar quatro vezes seguidas — pare e tente mais tarde")

    def todos(self, rota, filtro=None, **q):
        """Paginação por Id (Id gt <último>, $orderby=Id), nunca $skip."""
        saida, ultimo = [], 0
        while True:
            f = f"Id gt {ultimo}" + (f" and ({filtro})" if filtro else "")
            pagina = self.get(rota, **{**q, "$filter": f, "$orderby": "Id", "$top": str(PAGINA)})
            saida += pagina
            if len(pagina) < PAGINA:
                return saida
            ultimo = pagina[-1]["Id"]
            time.sleep(PAUSA_S)


def tirar(api, avisos):
    conta = api.get("Account", **{"$select": "Id,Name"})[0]
    try:
        funis = api.get("Deals@Pipelines", **{"$expand": "Stages"})
    except RuntimeError:
        funis = api.get("DealsPipelines", **{"$expand": "Stages"})
    time.sleep(PAUSA_S)
    checklists = api.todos("Checklists", None, **{
        "$select": "Id,Name,DealStageId,DealFilterId",
        "$expand": "Fields($select=Name,Required,Ordination,FieldKey),DealFilter($select=Id,Name,Url)",
    })
    time.sleep(PAUSA_S)
    sel = "Id,Key,Name,EntityId,TypeId,OptionsTableId"
    try:
        campos = api.todos("Fields", "EntityId eq 1 or EntityId eq 2", **{"$select": sel, "$expand": "OptionsTable($expand=Options)"})
    except RuntimeError as e:
        avisos.append(f"as opções dos campos de lista não vieram ({e}) — o simulador sugere só os valores dos filtros")
        campos = api.todos("Fields", "EntityId eq 1 or EntityId eq 2", **{"$select": sel})
    time.sleep(PAUSA_S)
    automacoes = api.todos("Automations", "EntityId eq 2", **{
        "$select": "Id,Name,EntityId,TriggerId,TriggerDealStageId,TriggerFilterId,Enabled,DisabledDueToError",
        "$expand": "Actions($select=ActionId,DealStageId,RequestBody,ObjectValueName,FieldKey),TriggerFilter($select=Id,Name,Url)",
    })
    # O corpo da ação só serve nas de tarefa (5) e de registro (7); nas outras ele pode levar o token de um
    # webhook ou de uma integração, e não vai para o disco.
    for a in automacoes:
        for x in a.get("Actions") or []:
            if x.get("ActionId") not in (5, 7):
                x.pop("RequestBody", None)
    # O onboarding (2026-10-27): os perfis de usuário (para combinar as trilhas com quem pede) e os campos do
    # Usuário — as FieldKeys dos quatro campos do registro de quem assistiu, consultou e concluiu, que o flow grava.
    time.sleep(PAUSA_S)
    try:
        perfis = api.todos("UsersProfiles", None, **{"$select": "Id,Name,Administrator"})
    except RuntimeError as e:
        avisos.append(f"os perfis de usuário não vieram ({e}) — as trilhas por papel se combinam com quem pede sem a lista de perfis")
        perfis = []
    time.sleep(PAUSA_S)
    campos_do_usuario = api.todos("Fields", "EntityId eq 24", **{"$select": sel})
    return conta, funis, checklists, campos, automacoes, perfis, campos_do_usuario


def main():
    sys.stdout.reconfigure(encoding="utf-8")
    if "--autoteste" in sys.argv:
        sys.exit(autoteste())
    ap = argparse.ArgumentParser()
    ap.add_argument("--env", help="arquivo com a linha UK_PLOOMES_CLIENTE=<chave> (nunca o valor da chave)")
    ap.add_argument("--saida", required=True)
    ap.add_argument("--conta", type=int)
    a = ap.parse_args()
    env = a.env
    if not env:
        sys.exit("Passe --env <arquivo com a chave> (a linha UK_PLOOMES_CLIENTE=...). A chave nunca vai na conversa.")
    api = Ploomes(ler_chave(env))
    avisos = []
    try:
        conta, funis, checklists, campos, automacoes, perfis, campos_do_usuario = tirar(api, avisos)
    except (RuntimeError, Recusado) as e:
        sys.exit(f"PARADO, nada foi gravado: {api.mascarar(e)}")
    if a.conta and conta["Id"] != a.conta:
        sys.exit(f"PARE: a chave abre a conta {conta['Id']} ({conta['Name']}), e o projeto é a {a.conta}. Nada foi gravado.")
    saida = Path(a.saida)
    saida.mkdir(parents=True, exist_ok=True)
    agora = datetime.now()
    for nome, dados in [("conta", {"Id": conta["Id"], "Name": conta["Name"], "retratoEm": agora.strftime("%d/%m/%Y"),
                                   "lidoEm": agora.isoformat(timespec="seconds")}),
                        ("funis", funis), ("checklists", checklists), ("campos", campos), ("automacoes", automacoes),
                        ("perfis_de_usuario", perfis), ("campos_do_usuario", campos_do_usuario)]:
        (saida / f"{nome}.json").write_text(json.dumps(dados, ensure_ascii=False, indent=1), encoding="utf-8")
    print(json.dumps({
        "conta": f"{conta['Id']} · {conta['Name']}", "gravado_em": str(saida),
        "funis": len([f for f in funis if not f.get("Archived")]), "checklists": len(checklists),
        "campos": len(campos), "automacoes": len(automacoes), "perfis_de_usuario": len(perfis),
        "campos_do_usuario": len(campos_do_usuario), "avisos": avisos,
    }, ensure_ascii=False, indent=1))


def autoteste():
    """Contra uma API falsa em 127.0.0.1: o redirecionamento recusado, a chave mascarada no erro, o host fora da
    lista recusado e o retrato inteiro só com GET, paginado por Id e sem $skip. Não toca conta nenhuma."""
    global PAGINA, PAUSA_S
    PAGINA, PAUSA_S = 2, 0
    falhas = []

    def caso(nome, cond, visto=""):
        print(("  OK     " if cond else "  FALHOU ") + nome + ("" if cond else f" — {visto}"))
        if not cond:
            falhas.append(nome)

    chave = "chave-de-teste-0123456789abcdef"
    pedidos = []
    itens = [{"Id": i, "Name": f"item {i}"} for i in range(1, 6)]

    class Falsa(BaseHTTPRequestHandler):
        def log_message(self, *a):
            pass

        def responder(self, codigo, corpo, extra=None):
            dados = json.dumps(corpo).encode("utf-8")
            self.send_response(codigo)
            for k, v in (extra or {}).items():
                self.send_header(k, v)
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(dados)))
            self.end_headers()
            self.wfile.write(dados)

        def do_GET(self):
            pedidos.append((self.command, self.path, self.headers.get("User-Key")))
            partes = urllib.parse.urlsplit(self.path)
            q = dict(urllib.parse.parse_qsl(partes.query))
            rota = urllib.parse.unquote(partes.path)
            if rota == "/desvio":
                return self.responder(302, {}, {"Location": f"http://127.0.0.1:{porta}/capturou"})
            if rota == "/eco":
                return self.responder(500, {"erro": "recebi " + (self.headers.get("User-Key") or "")})
            if rota == "/capturou":
                return self.responder(200, {"value": []})
            if rota == "/Account":
                return self.responder(200, {"value": [{"Id": 7, "Name": "Conta de teste"}]})
            if rota == "/Deals@Pipelines":
                return self.responder(200, {"value": [{"Id": 1, "Name": "Vendas", "Stages": []}]})
            m = re.match(r"Id gt (\d+)", q.get("$filter", ""))
            ultimo = int(m.group(1)) if m else 0
            return self.responder(200, {"value": [i for i in itens if i["Id"] > ultimo][:int(q.get("$top", "300"))]})

        def do_POST(self):
            pedidos.append((self.command, self.path, None))
            self.responder(405, {})

        do_PATCH = do_PUT = do_DELETE = do_POST

    srv = ThreadingHTTPServer(("127.0.0.1", 0), Falsa)
    porta = srv.server_address[1]
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    local = f"http://127.0.0.1:{porta}/"
    try:
        try:
            Ploomes(chave, local).get("desvio")
            caso("redirecionamento é recusado", False, "seguiu sem erro")
        except Recusado as e:
            caso("redirecionamento é recusado", "recusado" in str(e), str(e))
        caso("o destino do redirecionamento nunca recebe a chave", not any(p[1].startswith("/capturou") for p in pedidos), pedidos)
        try:
            Ploomes(chave, local).get("eco")
            caso("erro com a chave no corpo sai mascarado", False, "não deu erro")
        except RuntimeError as e:
            caso("erro com a chave no corpo sai mascarado", chave not in str(e) and "<USER_KEY>" in str(e), str(e))
        for base in ("https://exemplo.invalid/", "http://127.0.0.1:1/\n", "http://localhost:80/"):
            try:
                Ploomes(chave, base)
                caso(f"host fora da lista recusado ({base!r})", False)
            except ValueError:
                caso(f"host fora da lista recusado ({base!r})", True)
        pedidos.clear()
        avisos = []
        conta, funis, checklists, campos, automacoes, perfis, campos_do_usuario = tirar(Ploomes(chave, local), avisos)
        caso("o retrato lê a conta e pagina por Id até o fim", conta["Id"] == 7 and len(checklists) == 5 and len(perfis) == 5,
             (conta, len(checklists), len(perfis)))
        caso("só GET, sem $skip e sempre com a chave no cabeçalho",
             all(m == "GET" and "skip" not in caminho and k == chave for m, caminho, k in pedidos), pedidos[:3])
        caso("sem aviso no caminho feliz", avisos == [], avisos)
    finally:
        srv.shutdown()
    print(f"\n{'FALHOU' if falhas else 'PASSOU'} — {len(falhas)} falha(s).")
    return 1 if falhas else 0


if __name__ == "__main__":
    main()
