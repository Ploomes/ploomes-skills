"""Hook PostToolUse: a tela do construtor mudou — lembre de perguntar se o onboarding se atualiza.

POR QUE ELE EXISTE: o onboarding de uma tela envelhece sem sintoma. Num cliente, uma tela andou treze versões com
o tour igual, e uma etapa dele passou a ensinar uma regra que não vale mais. A regra "pergunte se atualiza o
onboarding" só funciona se alguém lembrar dela; este hook lembra.

Quando o Claude edita (Edit, Write, MultiEdit) um arquivo dentro do src/ de uma tela do construtor — a pasta que
tem src/App.tsx e src/lib/ (a base do construtor) —, o hook injeta no contexto:
  - tela COM onboarding (src/onboarding/roteiro.ts): perguntar, ao fim da rodada, se atualiza o onboarding;
  - tela SEM onboarding: oferecer criar, porque toda tela do construtor sai com onboarding.
Uma vez por tela e por sessão. Não dispara para o próprio onboarding (src/onboarding/, src/treinamento/), para a
base (src/lib/) nem para o código-fonte deste plugin.

O texto cita a skill pelo nome curto, onboarding-de-tela, sem o nome do plugin: o mesmo hook vai em plugins com nomes
diferentes, e o nome errado mandaria o Claude para uma skill que não existe.

Nunca bloqueia e nunca falha: qualquer erro sai em silêncio.
Autoteste: python onboarding_lembrete.py --autoteste
"""
import hashlib
import json
import os
import sys
import tempfile
from pathlib import Path

FERRAMENTAS = {"Edit", "Write", "MultiEdit"}
PROPRIOS = ("onboarding/", "treinamento/", "lib/", "assets/")


def tela_de(caminho):
    """(raiz da tela, caminho relativo ao src/) ou None."""
    p = Path(caminho)
    for pai in list(p.parents)[:10]:
        src = pai / "src"
        if (src / "App.tsx").is_file() and (src / "lib").is_dir():
            try:
                return pai, p.relative_to(src).as_posix()
            except ValueError:
                return None
    return None


def lembrete(entrada, pasta_marcas):
    if entrada.get("tool_name") not in FERRAMENTAS:
        return None
    caminho = (entrada.get("tool_input") or {}).get("file_path") or ""
    norm = caminho.replace("\\", "/").lower()
    if not caminho or ("/plugins/" in norm and "/skills/" in norm):
        return None
    achada = tela_de(caminho)
    if not achada:
        return None
    raiz, rel = achada
    if rel.startswith(PROPRIOS):
        return None
    marca = Path(pasta_marcas) / ("onboarding-lembrete-" + hashlib.sha1(
        (str(entrada.get("session_id")) + "|" + str(raiz).lower()).encode("utf-8")).hexdigest()[:16])
    if marca.exists():
        return None
    marca.write_text(str(raiz), encoding="utf-8")
    if (raiz / "src" / "onboarding" / "roteiro.ts").is_file():
        texto = (f"A tela em '{raiz.name}' mudou (src/{rel}) e ela tem onboarding. Ao terminar esta rodada de mudanças, "
                 "pergunte ao usuário, numa linha: \"Quer que eu atualize o onboarding desta tela?\". Se ele disser que sim, "
                 "use a skill onboarding-de-tela, na ação atualizar: rode o conferir_onboarding.py "
                 "e ajuste o roteiro — passo que entrar ou mudar de sentido sobe a versão e leva `desde`. "
                 "Não pergunte de novo nesta sessão para esta tela.")
    else:
        texto = (f"A tela em '{raiz.name}' não tem onboarding (falta src/onboarding/roteiro.ts). Toda tela do construtor "
                 "sai com onboarding para quem vai usá-la: ao terminar esta rodada, ofereça ao usuário criá-lo, pela skill "
                 "onboarding-de-tela. Não ofereça de novo nesta sessão para esta tela.")
    return {"hookSpecificOutput": {"hookEventName": "PostToolUse", "additionalContext": texto}}


def autoteste():
    ok = True

    def caso(nome, cond):
        nonlocal ok
        print(("✓ " if cond else "✗ ") + nome)
        ok = ok and cond

    with tempfile.TemporaryDirectory() as tmp:
        t = Path(tmp)
        tela = t / "clientes" / "x-12345678" / "telas" / "mesa"
        (tela / "src" / "lib").mkdir(parents=True)
        (tela / "src" / "App.tsx").write_text("x", encoding="utf-8")
        (tela / "src" / "mesa").mkdir()
        marcas = t / "marcas"
        marcas.mkdir()
        ent = lambda arq, sessao="s1", ferr="Edit": {"session_id": sessao, "tool_name": ferr, "tool_input": {"file_path": str(arq)}}
        r = lembrete(ent(tela / "src" / "mesa" / "Mesa.tsx"), marcas)
        caso("tela sem onboarding: oferece criar", r and "não tem onboarding" in r["hookSpecificOutput"]["additionalContext"])
        caso("cita a skill pelo nome curto, sem o nome do plugin",
             r and "skill onboarding-de-tela" in r["hookSpecificOutput"]["additionalContext"]
             and "ploomes-" not in r["hookSpecificOutput"]["additionalContext"])
        caso("uma vez por tela e por sessão", lembrete(ent(tela / "src" / "App.tsx"), marcas) is None)
        (tela / "src" / "onboarding").mkdir()
        (tela / "src" / "onboarding" / "roteiro.ts").write_text("x", encoding="utf-8")
        r = lembrete(ent(tela / "src" / "App.tsx", "s2"), marcas)
        caso("tela com onboarding: pergunta se atualiza", r and "Quer que eu atualize o onboarding" in r["hookSpecificOutput"]["additionalContext"])
        caso("na atualização, também sem o nome do plugin",
             r and "skill onboarding-de-tela" in r["hookSpecificOutput"]["additionalContext"]
             and "ploomes-" not in r["hookSpecificOutput"]["additionalContext"])
        caso("editar o próprio roteiro não dispara", lembrete(ent(tela / "src" / "onboarding" / "roteiro.ts", "s3"), marcas) is None)
        caso("editar a base (src/lib) não dispara", lembrete(ent(tela / "src" / "lib" / "x.ts", "s4"), marcas) is None)
        caso("Read não dispara", lembrete(ent(tela / "src" / "App.tsx", "s5", "Read"), marcas) is None)
        caso("arquivo fora de tela não dispara", lembrete(ent(t / "outro" / "a.ts", "s6"), marcas) is None)
        plugin = t / "plugins" / "um-plugin" / "skills" / "pacote" / "scaffold"
        (plugin / "src" / "lib").mkdir(parents=True)
        (plugin / "src" / "App.tsx").write_text("x", encoding="utf-8")
        caso("o código-fonte do plugin não dispara", lembrete(ent(plugin / "src" / "App.tsx", "s7"), marcas) is None)
    return 0 if ok else 1


def main():
    if "--autoteste" in sys.argv:
        sys.stdout.reconfigure(encoding="utf-8")
        return autoteste()
    try:
        entrada = json.loads(sys.stdin.read() or "{}")
        saida = lembrete(entrada, Path(tempfile.gettempdir()))
        if saida:
            sys.stdout.reconfigure(encoding="utf-8")
            print(json.dumps(saida, ensure_ascii=False))
    except Exception:  # noqa: BLE001 — hook de lembrete nunca derruba a ferramenta
        pass
    return 0


if __name__ == "__main__":
    sys.exit(main())
