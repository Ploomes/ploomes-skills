#!/usr/bin/env python3
"""Confere a tela construída aqui e gera o .zip da versão: a cópia local, no formato do export do construtor.

Uso: python empacotar_importacao.py <pasta da tela> <saída.zip> [--pacote <pasta pacote-construtor>]
     python empacotar_importacao.py <pasta da tela> <saída.zip> --tela-existente <export original>

O nome da saída é <slug>-AAAAMMDD-HHMM.zip, e ela nunca se sobrescreve: arquivo que já existe é BLOQUEIO.
Importar o .zip no construtor é a última rota de subida (passo 9 da skill pacote-para-o-construtor).

`--tela-existente` é para a tela que já está em produção e ganha o onboarding (preparada por
`preparar_tela_existente.py`; o export original é a pasta `original/` dele, ou o .zip do construtor).
Nesse modo a referência é o export, não a base daqui: `main.tsx`, `src/lib/` (se veio) e o início do
`index.css` têm de ser os do export; nenhum arquivo do export pode sumir; arquivo novo só em
`src/onboarding/`; as regras de código valem só para o que mudou (o que o export já tinha é herdado);
o onboarding é obrigatório; e o zip repete a forma do export (a pasta raiz dele, sem a `src/lib/` que
serviu só para compilar). Lista os arquivos do export que mudaram, com as linhas, e avisa o que perdeu linhas.

O zip tem o mesmo formato do export do construtor: só `src/`, com os caminhos `src/...`.
O construtor tem o próprio package.json, vite e tsconfig — o que vai é só o código.

Reprova (BLOQUEIO) quando:
- a base do construtor foi alterada (`src/main.tsx` e `src/lib/**` têm de ser idênticos aos da base);
- o início de `src/index.css` (os tokens do design system) foi mexido — acrescentar embaixo pode;
- a tela importa pacote que o construtor não tem (só react, react-dom, react-router, @ploomescrm/bridge,
  @ploomescrm/api-types, motion e lucide-react existem lá);
- há `fetch`, `XMLHttpRequest` ou `User-Key` fora de `src/ploomes/api.ts` — a única exceção é o
  `src/onboarding/kit/registro.ts` igual ao do kit, que manda o evento do onboarding ao webhook do flow, sem User-Key
  (o registro no Usuário, regra da skill onboarding-de-tela);
- há `BrowserRouter` ou `HashRouter` (a navegação é do `PloomesRouter`, com `MemoryRouter`);
- com `--pacote`: o `api.ts` ou o `useConexao.ts` da tela não é o que o pacote gerou;
- `src/vendor/<biblioteca>/` não é cópia exata de `bancada/vendor/<biblioteca>/` (biblioteca embutida,
  como o React Flow: compilada aqui, com as licenças, e fora das outras checagens porque é conferida
  arquivo a arquivo — os comentários dela citam o pacote original e o CSS padrão tem cor fixa).
- com `--pacote`: a tela não tem onboarding — o kit (`src/onboarding/kit/`, cópia exata de
  `kit/` da skill onboarding-de-tela), o roteiro (`src/onboarding/roteiro.ts`) e o `OnboardingProvider`.
Avisa (AVISO) sobre cor fixa em vez de token, falta da rota `*`, camada fixa sem `useViewportOverlay`
e alvo do roteiro que nenhum `data-onboarding` marca.
"""
import difflib
import json
import re
import sys
import zipfile
from pathlib import Path

AQUI = Path(__file__).resolve().parent
BASE = AQUI.parent / "bancada" / "scaffold" / "src"
VENDOR = AQUI.parent / "bancada" / "vendor"
KIT_ONBOARDING = AQUI.parent.parent / "onboarding-de-tela" / "kit"  # o kit é da skill onboarding-de-tela
# "motion" (motion/react): não está na base em branco, mas uma tela em produção o importa
# (export de 19/10/2026) — o construtor o tem. A versão de lá não é conhecida; a base daqui fixa 12.43.0.
# "lucide-react": duas telas em produção o importam — uma After Sales e um onboarding com simulador (outubro de 2026).
PACOTES_DO_CONSTRUTOR = {"react", "react-dom", "react-router", "@ploomescrm/bridge", "@ploomescrm/api-types", "motion", "lucide-react"}
EXTENSOES = {".ts", ".tsx", ".css", ".svg", ".png", ".jpg", ".jpeg", ".gif", ".webp", ".json", ".woff", ".woff2"}
IMPORT = re.compile(r"""(?:^|\s)(?:import|export)\s[^'"]*?from\s*['"]([^'"]+)['"]|import\s*\(\s*['"]([^'"]+)['"]\s*\)|^\s*import\s*['"]([^'"]+)['"]""", re.M)

achados = []
bloqueio = lambda m: achados.append(("BLOQUEIO", m))
aviso = lambda m: achados.append(("AVISO", m))


def ler(p: Path) -> str:
    return p.read_text(encoding="utf-8", errors="replace").replace("\r\n", "\n")


def pacote_de(espec: str) -> str | None:
    if espec.startswith((".", "/")):
        return None
    partes = espec.split("/")
    return "/".join(partes[:2]) if espec.startswith("@") else partes[0]


def conferir(tela: Path, pacote: Path | None, original: dict[str, str] | None = None):
    """`original` (modo --tela-existente): {caminho a partir de src/: texto} do export da tela em produção."""
    achados.clear()  # sem resíduo de uma chamada anterior (o construtor_api.py chama `conferir` mais de uma vez)
    src = tela / "src"
    if not src.is_dir():
        bloqueio(f"não achei {src}")
        return []

    # 1. A base do construtor fica intacta. Na tela em produção, a referência é o export dela, não a base
    #    daqui: a base de lá pode ser de outra versão, e o export costuma vir sem src/lib/.
    if original is None:
        for base in [BASE / "main.tsx", *sorted((BASE / "lib").rglob("*"))]:
            if not base.is_file():
                continue
            rel = base.relative_to(BASE)
            alvo = src / rel
            if not alvo.exists():
                bloqueio(f"src/{rel.as_posix()} sumiu — é arquivo da base do construtor")
            elif ler(alvo) != ler(base):
                bloqueio(f"src/{rel.as_posix()} foi alterado — é da base do construtor e não se edita")
        css_base, css = ler(BASE / "index.css"), (ler(src / "index.css") if (src / "index.css").exists() else "")
        if not css.startswith(css_base.rstrip()):
            bloqueio("o início de src/index.css (tokens do design system) foi alterado — acrescente regras embaixo, ou num CSS próprio")
    else:
        lib_no_export = any(o.startswith("lib/") for o in original)
        for rel, texto in sorted(original.items()):
            alvo = src / rel
            if not alvo.exists():
                bloqueio(f"src/{rel} sumiu — é da tela em produção; o onboarding só acrescenta")
            elif (rel == "main.tsx" or rel.startswith("lib/")) and ler(alvo) != texto:
                bloqueio(f"src/{rel} foi alterado — é da base do construtor (como veio no export) e não se edita")
            elif rel == "index.css" and not ler(alvo).startswith(texto.rstrip()):
                bloqueio("o início de src/index.css foi alterado em relação ao export — acrescente regras embaixo, ou num CSS próprio")
        for p in sorted(src.rglob("*")):
            rel = p.relative_to(src).as_posix()
            if not p.is_file() or rel in original or rel.startswith("onboarding/") or (rel.startswith("lib/") and not lib_no_export):
                continue
            bloqueio(f"src/{rel} é novo — na tela em produção, o que entra vai em src/onboarding/; o resto só ganha as marcas")

    # 1b. Biblioteca embutida: cada src/vendor/<x>/ é cópia exata de bancada/vendor/<x>/ (2026-10-20, React Flow).
    vendor = (src / "vendor").resolve()
    if vendor.is_dir():
        for pasta in sorted(p for p in vendor.iterdir() if p.is_dir()):
            ref = VENDOR / pasta.name
            if not ref.is_dir():
                bloqueio(f"src/vendor/{pasta.name}/ não é biblioteca conhecida — só as de bancada/vendor/ ({', '.join(sorted(x.name for x in VENDOR.iterdir() if x.is_dir())) if VENDOR.is_dir() else 'nenhuma'})")
                continue
            nomes_ref = {p.relative_to(ref).as_posix() for p in ref.rglob("*") if p.is_file() and p.name != "LEIA-ME.md"}
            nomes = {p.relative_to(pasta).as_posix() for p in pasta.rglob("*") if p.is_file()}
            for n in sorted(nomes_ref - nomes):
                bloqueio(f"src/vendor/{pasta.name}/{n} falta — copie a pasta inteira de bancada/vendor/{pasta.name}/")
            for n in sorted(nomes - nomes_ref):
                bloqueio(f"src/vendor/{pasta.name}/{n} não existe em bancada/vendor/{pasta.name}/ — a biblioteca embutida não se edita")
            for n in sorted(nomes & nomes_ref):
                if ler(pasta / n) != ler(ref / n):
                    bloqueio(f"src/vendor/{pasta.name}/{n} foi alterado — é cópia de bancada/vendor/{pasta.name}/ e não se edita")
        for p in vendor.iterdir():
            if p.is_file():
                bloqueio(f"src/vendor/{p.name} solto — biblioteca embutida vai numa pasta, cópia de bancada/vendor/")

    # 2. Imports, rede e roteamento.
    arquivos = [p for p in src.rglob("*") if p.is_file()]
    api_ts = (src / "ploomes" / "api.ts").resolve()
    lib = (src / "lib").resolve()
    conferidos = lambda p: lib in p.resolve().parents or vendor in p.resolve().parents
    for p in arquivos:
        # src/lib é a base do construtor e src/vendor a biblioteca embutida, já conferidas arquivo a arquivo
        # acima (os comentários delas citam BrowserRouter e o pacote original).
        if p.suffix not in (".ts", ".tsx") or conferidos(p):
            continue
        texto = ler(p)
        rel = p.relative_to(tela).as_posix()
        # Na tela em produção, o que já estava no export é herdado: a regra vale só para o que a mudança traz.
        antes = (original or {}).get(p.relative_to(src).as_posix())
        if antes == texto:
            continue
        ja_importava = {pacote_de(next(g for g in m.groups() if g)) for m in IMPORT.finditer(antes or "")}
        conta = lambda padrao, t: len(re.findall(padrao, t or ""))
        for m in IMPORT.finditer(texto):
            espec = next(g for g in m.groups() if g)
            nome = pacote_de(espec)
            if nome and nome not in PACOTES_DO_CONSTRUTOR and nome not in ja_importava:
                bloqueio(f"{rel} importa '{espec}' — o construtor não tem esse pacote (só {', '.join(sorted(PACOTES_DO_CONSTRUTOR))})")
            if "tipos-locais" in espec:
                bloqueio(f"{rel} importa '{espec}' — tipos-locais é só do build daqui")
        rede = r"\bfetch\s*\(|XMLHttpRequest|User-Key"
        registro_do_kit = (p.resolve() == (src / "onboarding" / "kit" / "registro.ts").resolve()
                           and (KIT_ONBOARDING / "registro.ts").exists() and texto == ler(KIT_ONBOARDING / "registro.ts"))
        if p.resolve() != api_ts and not registro_do_kit and conta(rede, texto) > conta(rede, antes):
            bloqueio(f"{rel} chama a rede ou cita User-Key — só src/ploomes/api.ts fala com a API"
                     + (" (o onboarding não acrescenta chamada)" if original is not None else ""))
        if conta(r"\b(BrowserRouter|HashRouter)\b", texto) > conta(r"\b(BrowserRouter|HashRouter)\b", antes):
            bloqueio(f"{rel} usa BrowserRouter/HashRouter — a navegação é a do PloomesRouter (MemoryRouter + URL do CRM)")
        if antes is None and p.suffix == ".tsx" and re.search(r"position:\s*['\"]?fixed", texto) and "useViewportOverlay" not in texto:
            aviso(f"{rel} tem camada position: fixed sem useViewportOverlay — o modal pararia na borda do frame")
    app = src / "App.tsx"
    if original is None and app.exists() and 'path="*"' not in ler(app):
        aviso("App.tsx sem a rota path=\"*\" — rota desconhecida (link antigo) renderizaria nada")
    for p in arquivos:
        if p.suffix in (".css", ".tsx") and p.name != "index.css" and not conferidos(p):
            antes = (original or {}).get(p.relative_to(src).as_posix(), "")
            cores = set(re.findall(r"#[0-9a-fA-F]{6}\b", ler(p))) - set(re.findall(r"#[0-9a-fA-F]{6}\b", antes))
            if cores:
                aviso(f"{p.relative_to(tela).as_posix()} fixa cor ({', '.join(sorted(cores)[:4])}…) — use os tokens var(--color-…), que seguem o whitelabel e o modo escuro")

    # 3. A camada de dados é a que o pacote gerou.
    if pacote:
        for nome in ("api.ts", "useConexao.ts"):
            gerado, usado = pacote / "src" / "ploomes" / nome, src / "ploomes" / nome
            if not gerado.exists():
                bloqueio(f"o pacote não tem src/ploomes/{nome} — rode gerar_api.py")
            elif not usado.exists():
                bloqueio(f"a tela não tem src/ploomes/{nome}")
            elif ler(gerado) != ler(usado):
                bloqueio(f"src/ploomes/{nome} da tela é diferente do gerado pelo pacote — copie de novo, sem editar")

    # 4. Onboarding (2026-10-21): toda tela entregue tem o kit, sem edição, e o roteiro dela.
    kit = src / "onboarding" / "kit"
    if kit.is_dir():
        ref = {p.relative_to(KIT_ONBOARDING).as_posix() for p in KIT_ONBOARDING.rglob("*") if p.is_file() and p.name != "LEIA-ME.md"}
        tem = {p.relative_to(kit).as_posix() for p in kit.rglob("*") if p.is_file() and p.name != "LEIA-ME.md"}
        for n in sorted(ref - tem):
            bloqueio(f"src/onboarding/kit/{n} falta — copie a pasta inteira do kit/ da skill onboarding-de-tela")
        for n in sorted(tem - ref):
            bloqueio(f"src/onboarding/kit/{n} não existe no kit — o kit não se edita; o que é da tela vai em src/onboarding/roteiro.ts")
        for n in sorted(ref & tem):
            if ler(kit / n) != ler(KIT_ONBOARDING / n):
                bloqueio(f"src/onboarding/kit/{n} foi alterado — é cópia do kit/ da skill onboarding-de-tela e não se edita")
    roteiro = src / "onboarding" / "roteiro.ts"
    if pacote or original is not None:
        if not kit.is_dir():
            bloqueio("a tela não tem onboarding — copie o kit/ da skill onboarding-de-tela para src/onboarding/kit/ e escreva src/onboarding/roteiro.ts")
        elif not roteiro.exists():
            bloqueio("falta src/onboarding/roteiro.ts — o roteiro do onboarding é da tela")
        else:
            todo = "\n".join(ler(p) for p in arquivos if p.suffix in (".ts", ".tsx") and not conferidos(p) and kit not in p.resolve().parents)
            if "OnboardingProvider" not in todo:
                bloqueio("o OnboardingProvider não envolve a tela — sem ele o roteiro não aparece")
            r = ler(roteiro)
            alvos = set(re.findall(r"alvo:\s*['\"]([^'\"]+)['\"]", r))
            marcados = set(re.findall(r"data-onboarding=\{?['\"`]([^'\"`]+)['\"`]", todo)) | {"ajuda"}
            if re.search(r"data-onboarding=\{\s*[A-Za-z_]", todo):
                # alvo por expressão (data-onboarding={data.alvo}): vale o nome que a tela atribui fora do roteiro
                fora_do_roteiro = "\n".join(ler(p) for p in arquivos if p.suffix in (".ts", ".tsx") and not conferidos(p)
                                             and kit not in p.resolve().parents and p.resolve() != roteiro.resolve())
                marcados |= set(re.findall(r"\balvo\??:\s*['\"]([^'\"]+)['\"]", fora_do_roteiro))
            for a in sorted(alvos - marcados):
                aviso(f"roteiro.ts aponta o alvo '{a}', que nenhum data-onboarding da tela marca — o passo cai no centro")
            for tarefa in sorted(set(re.findall(r"\bmarcar\(\s*['\"]([^'\"]+)['\"]", todo)) - set(re.findall(r"id:\s*['\"]([^'\"]+)['\"]", r))):
                aviso(f"a tela marca a tarefa '{tarefa}', que o roteiro não tem")

    estranhos = [p for p in arquivos if p.suffix.lower() not in EXTENSOES and not conferidos(p)]
    for p in estranhos:
        aviso(f"{p.relative_to(tela).as_posix()}: extensão fora do comum numa tela — confira se deve ir")
    if original is not None and not any(o.startswith("lib/") for o in original):
        # o export veio sem src/lib/: a da base daqui serviu só para compilar e não volta no zip
        arquivos = [p for p in arquivos if lib not in p.resolve().parents]
    return arquivos


def mudancas(tela: Path, original: dict[str, str]) -> list[str]:
    """Resumo do que mudou nos arquivos da tela em produção (o onboarding só deveria acrescentar)."""
    linhas = []
    for rel, antes in sorted(original.items()):
        alvo = tela / "src" / rel
        if not alvo.exists() or not rel.endswith((".ts", ".tsx", ".css")):
            continue
        depois = ler(alvo)
        if depois == antes:
            continue
        mais = menos = 0
        for d in difflib.ndiff(antes.splitlines(), depois.splitlines()):
            mais += d.startswith("+ ")
            menos += d.startswith("- ")
        linhas.append(f"  src/{rel}: +{mais} -{menos}")
        if menos > 5:
            aviso(f"src/{rel} perdeu {menos} linhas do export — o onboarding só acrescenta marcas; confira que o comportamento não mudou")
    return linhas


def main() -> int:
    try:  # console do Windows (cp1252) não imprime → e −; com python -I o PYTHONIOENCODING não vale
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except (AttributeError, ValueError):
        pass
    args = sys.argv[1:]
    if len(args) < 2:
        print(__doc__)
        return 2
    tela, saida = Path(args[0]).absolute(), Path(args[1]).absolute()
    if saida.exists():
        # Cada .zip é a cópia de uma versão: sobrescrever apagaria a de uma entrega anterior.
        print(f"BLOQUEIO  {saida} já existe — o .zip de uma versão não se sobrescreve. Dê o nome com a data e a "
              "hora de agora: <slug>-AAAAMMDD-HHMM.zip.")
        print("\nREPROVADO — 1 bloqueio(s). Nenhum zip gerado.")
        return 1
    pacote =Path(args[args.index("--pacote") + 1]).absolute() if "--pacote" in args else None
    original, prefixo = None, ""
    if "--tela-existente" in args:
        if pacote:
            print("use --pacote (tela construída aqui) ou --tela-existente (tela em produção), não os dois")
            return 2
        sys.path.insert(0, str(AQUI))
        from preparar_tela_existente import prefixo_e_arquivos
        origem = Path(args[args.index("--tela-existente") + 1]).absolute()
        prefixo, brutos = prefixo_e_arquivos(origem)
        forma = origem / "forma.json"
        if forma.is_file():  # a pasta original/ do preparar_tela_existente.py guarda a raiz do export
            prefixo = json.loads(forma.read_text(encoding="utf-8"))["prefixo"]
        original = {n: b.decode("utf-8", "replace").replace("\r\n", "\n") for n, b in brutos.items()}
    arquivos = conferir(tela, pacote, original)
    resumo = mudancas(tela, original) if original is not None else []

    for nivel, msg in achados:
        print(f"{nivel:9} {msg}")
    if resumo:
        print("\nArquivos do export que mudaram:")
        print("\n".join(resumo))
    b = sum(1 for n, _ in achados if n == "BLOQUEIO")
    if b:
        print(f"\nREPROVADO — {b} bloqueio(s). Nenhum zip gerado.")
        return 1
    saida.parent.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(saida, "w", zipfile.ZIP_DEFLATED) as z:
        for p in sorted(arquivos):
            # na tela em produção, o zip repete a forma do export (a pasta raiz dele, se houver)
            z.write(p, prefixo + p.relative_to(tela).as_posix())
    kb = saida.stat().st_size / 1024
    print(f"\nAPROVADO — {len(arquivos)} arquivos de src/ em {saida.name} ({kb:.0f} KB), {len(achados)} aviso(s).")
    print("É a cópia local desta versão. A subida vai pelo passo 9 da skill pacote-para-o-construtor (a API, ou o "
          "editor); importar este .zip no construtor só se a API e o editor falharem.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
