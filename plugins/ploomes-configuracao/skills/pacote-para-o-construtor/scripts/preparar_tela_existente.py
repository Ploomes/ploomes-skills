#!/usr/bin/env python3
"""Prepara uma tela que JÁ ESTÁ EM PRODUÇÃO no construtor para ganhar o onboarding.

Uso: python preparar_tela_existente.py <export do construtor (.zip ou pasta)> <pasta de trabalho>

Recebe o export da tela (Ploomes IA → Telas personalizadas → exportar) e monta, na pasta de trabalho:
- `original/`      o export como veio, intocado — é contra ele que o empacotador (`--tela-existente`)
                   confere o que mudou, e é a forma dele (pasta raiz, arquivos) que o zip final repete;
- `tela/`          a base daqui (package.json, vite, tsconfig) com o `src/` do export por cima, o kit
                   de onboarding em `src/onboarding/kit/` e, se o export não trouxer `src/lib/` (o
                   construtor costuma não exportar), a `src/lib/` da base — só para compilar aqui;
                   ela não volta no zip;
- `inventario.md`  rotas, arquivos, pacotes e o que já tem de onboarding — o ponto de partida do roteiro.

Não sobrescreve: se a pasta de trabalho já tiver `original/` ou `tela/`, para. Lê o export só como
dado: nada dele é executado aqui.
"""
import json
import re
import shutil
import sys
import zipfile
from pathlib import Path, PurePosixPath

AQUI = Path(__file__).resolve().parent
SCAFFOLD = AQUI.parent / "bancada" / "scaffold"
KIT = AQUI.parent.parent / "onboarding-de-tela" / "kit"  # o kit é da skill onboarding-de-tela
IMPORT = re.compile(r"""from\s*['"]([^'"]+)['"]|import\s*\(\s*['"]([^'"]+)['"]\s*\)|^\s*import\s*['"]([^'"]+)['"]""", re.M)


def prefixo_e_arquivos(origem: Path) -> tuple[str, dict[str, bytes]]:
    """Devolve a pasta raiz do export (ex.: 'minha-tela/') e {caminho a partir de src/: bytes}."""
    if origem.is_dir():
        srcs = [p for p in origem.rglob("src") if p.is_dir() and "node_modules" not in p.parts]
        if not srcs:
            sys.exit(f"não achei src/ em {origem}")
        src = min(srcs, key=lambda p: len(p.parts))
        prefixo = src.parent.relative_to(origem).as_posix()
        prefixo = "" if prefixo == "." else prefixo + "/"
        return prefixo, {p.relative_to(src).as_posix(): p.read_bytes() for p in src.rglob("*") if p.is_file()}
    with zipfile.ZipFile(origem) as z:
        nomes = [n for n in z.namelist() if not n.endswith("/")]
        prefixo = None
        arquivos = {}
        for n in nomes:
            partes = PurePosixPath(n).parts
            if ".." in partes or n.startswith("/") or ":" in partes[0]:
                sys.exit(f"o zip tem um caminho perigoso ({n}) — não abro")
            if "src" not in partes:
                continue
            i = partes.index("src")
            p = "/".join(partes[:i]) + "/" if i else ""
            if prefixo is None:
                prefixo = p
            elif p != prefixo:
                sys.exit(f"o zip tem mais de uma pasta src/ ({prefixo}src e {p}src) — exporte uma tela por vez")
            arquivos["/".join(partes[i + 1:])] = z.read(n)
        if prefixo is None:
            sys.exit("o zip não tem src/ — é o export de uma tela do construtor?")
        return prefixo, arquivos


def inventario(arquivos: dict[str, bytes], prefixo: str, sem_lib: bool) -> str:
    texto = {n: b.decode("utf-8", "replace") for n, b in arquivos.items() if n.endswith((".ts", ".tsx"))}
    rotas = sorted({m for t in texto.values() for m in re.findall(r"""path=\{?['"]([^'"]+)['"]""", t)})
    pacotes = sorted({(e.split("/")[0] if not e.startswith("@") else "/".join(e.split("/")[:2]))
                      for t in texto.values() for m in IMPORT.finditer(t) for e in [next(g for g in m.groups() if g)]
                      if not e.startswith((".", "/"))})
    ja = sorted({m for t in texto.values() for m in re.findall(r"""data-onboarding=\{?['"`]([^'"`]+)""", t)})
    titulos = []
    for n, t in sorted(texto.items()):
        for m in re.findall(r"<h[1-3][^<]*?>\s*([A-Za-zÀ-ú][^<{}\n]{2,60})<", t):
            titulos.append(f"{n}: {m.strip()}")
    botoes = []
    for n, t in sorted(texto.items()):
        for m in re.findall(r"<button\b[^<]*?>\s*([A-Za-zÀ-ú][^<{}\n]{2,40})<", t):
            botoes.append(f"{n}: {m.strip()}")
    linhas = [
        "# Inventário da tela em produção", "",
        f"- pasta raiz do export: `{prefixo or '(nenhuma)'}` — o zip final repete essa forma",
        f"- arquivos em src/: {len(arquivos)}" + (" (sem `src/lib/` — a base veio daqui, só para compilar)" if sem_lib else ""),
        f"- pacotes importados: {', '.join(pacotes) or 'nenhum'}",
        f"- já usa motion: {'sim' if 'motion' in pacotes else 'não — o kit traz'}",
        f"- já tem onboarding: {'sim (' + ', '.join(ja) + ')' if ja else 'não'}"
        + (" · OnboardingProvider presente" if any("OnboardingProvider" in t for t in texto.values()) else ""),
        "", "## Rotas", "", *([f"- `{r}`" for r in rotas] or ["- (nenhuma `path=` achada — tela de uma vista só, ou rotas montadas por código)"]),
        "", "## Títulos (candidatos a passo do tour)", "", *([f"- {x}" for x in titulos[:40]] or ["- (nenhum)"]),
        "", "## Botões com texto (candidatos a tarefa dos primeiros passos)", "", *([f"- {x}" for x in botoes[:60]] or ["- (nenhum)"]),
        "", "## Arquivos", "", *[f"- `src/{n}` ({len(b) // 1024 or 1} KB)" for n, b in sorted(arquivos.items())], "",
    ]
    return "\n".join(linhas)


def main() -> int:
    try:  # console do Windows (cp1252) não imprime → e −; com python -I o PYTHONIOENCODING não vale
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except (AttributeError, ValueError):
        pass
    if len(sys.argv) != 3:
        print(__doc__)
        return 2
    origem, destino = Path(sys.argv[1]).absolute(), Path(sys.argv[2]).absolute()
    if (destino / "original").exists() or (destino / "tela").exists():
        sys.exit(f"{destino} já tem original/ ou tela/ — não sobrescrevo; use outra pasta")
    prefixo, arquivos = prefixo_e_arquivos(origem)

    orig_src = destino / "original" / prefixo / "src"
    for n, b in arquivos.items():
        (orig_src / n).parent.mkdir(parents=True, exist_ok=True)
        (orig_src / n).write_bytes(b)
    (destino / "original" / "forma.json").write_text(json.dumps({"prefixo": prefixo, "origem": origem.name}, ensure_ascii=False, indent=2), encoding="utf-8")

    tela = destino / "tela"
    shutil.copytree(SCAFFOLD, tela, ignore=shutil.ignore_patterns("node_modules", "dist", "src"))
    sem_lib = not any(n.startswith("lib/") for n in arquivos)
    if sem_lib:
        shutil.copytree(SCAFFOLD / "src" / "lib", tela / "src" / "lib")
    for n, b in arquivos.items():
        (tela / "src" / n).parent.mkdir(parents=True, exist_ok=True)
        (tela / "src" / n).write_bytes(b)
    kit = tela / "src" / "onboarding" / "kit"
    if kit.exists():
        shutil.rmtree(kit)  # a tela já tinha onboarding: o kit vai na versão de agora
    shutil.copytree(KIT, kit, ignore=shutil.ignore_patterns("LEIA-ME.md"))

    (destino / "inventario.md").write_text(inventario(arquivos, prefixo, sem_lib), encoding="utf-8")
    print(f"original: {orig_src.parent}  ({len(arquivos)} arquivos, raiz '{prefixo or '-'}')")
    print(f"tela:     {tela}" + ("  (src/lib da base daqui, só para compilar)" if sem_lib else ""))
    print(f"kit:      {kit}")
    print(f"inventário: {destino / 'inventario.md'}")
    print("\nPróximo: npm install na tela (PowerShell), escrever src/onboarding/roteiro.ts, marcar os alvos e")
    print(f"empacotar com --tela-existente \"{destino / 'original'}\".")
    return 0


if __name__ == "__main__":
    sys.exit(main())
