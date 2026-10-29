"""Autoteste do portao da indicacao de tela: rode depois de mexer no validar_telas.py.

    python scripts/autoteste.py

Monta cinco pastas telas/ numa pasta temporaria dentro da skill (o Python do
Windows nem sempre enxerga o temp do sistema) e confere o veredito de cada uma:

  ok             — formato novo, escrito como se escreve de fato: passa;
  pedido-neutro  — "Veredito: PEDIDO" e "### Decisao de quem pede": passa, com aviso;
  pedido-antigo  — "PEDIDO DO FDE" e "### Decisao do FDE", como nos arquivos ja
                   gravados: passa, com aviso;
  ruim           — so S6, etapa sem funil, URL de webhook e cor fixa: reprova;
  vazio          — sem candidatos-de-tela.md: reprova.
"""
from __future__ import annotations

import shutil
import subprocess
import sys
from pathlib import Path

SK = Path(__file__).resolve().parent.parent
PORTAO = SK / "scripts" / "validar_telas.py"
TMP = SK / ".autoteste-tmp"

CASOS = {
    "ok": {
        "candidatos-de-tela.md": """# Candidatos de tela — Teste

## 1. Mesa do vendedor
- Slug: mesa-do-vendedor
- Sinal(is): **S1, S2** (S6 como sintoma)
- Evidência:
  - ASIS-053 confere estoque e preço
  - notas da visita, 01:40:44
- Trava nativa: série no tempo (md-formularios-e-campos.txt)
- Abas: Meu dia (/), Atendimentos (/atendimentos)
- Quem usa: Vendedor
- Veredito: **RECOMENDADA**. Abre o dia do vendedor.

### Decisão do FDE
- Segue: sim
- Opera o registro: sim — ganhar, perder, reabrir

## Notas
- o painel de gestão o nativo resolve
""",
        "mesa-do-vendedor/especificacao.md": """## a. Especificação macro
| Rota | Aba |
|---|---|
| / | Meu dia |
## b. Entidades e campos
## c. Roteiro de configuração
## d. Dependências e fases
Nenhuma.
## e. Onboarding
Boas-vindas, tour e primeiros passos.
""",
        "mesa-do-vendedor/prototipo.html": """<html><style>
:root { --color-brand: #7e33e6; --color-font: #1b102c; }
.dark { --color-brand: #9d6bff; }
body { color: var(--color-font); }
</style><script>const api = { negocios() { /* GET Deals — ~300 abertos; 50 por página */ return []; } };</script></html>
""",
        "mesa-do-vendedor/requisitos-da-cadeia.csv": "Tipo,Nome,Funil,Por quê\nfunil,Atendimento,,a mesa lê\n",
    },
    "ruim": {
        "candidatos-de-tela.md": """# Candidatos

## Painel
- Slug: painel
- Sinais: S6
- Evidência: planilha
- Trava nativa: nenhuma
- Quem usa: Vendedor
- Veredito: OPCIONAL

### Decisão do FDE
- Segue: sim
""",
        "painel/especificacao.md": "## a. Macro\nchama https://flows.exemplo.invalid/webhook/abc/sync\n## b. x\n## c. y\n",
        "painel/prototipo.html": "<html><style>" + "".join(
            f"x{i}{{color:#{i:03x}}}" for i in range(13)) + "</style><script>const api = {}</script></html>",
        "painel/requisitos-da-cadeia.csv": "Tipo,Nome,Funil,Por quê\netapa,Cotação,,x\n",
    },
    "vazio": {},
}

# Os dois casos de pedido usam os mesmos arquivos da tela; muda so o cabecalho.
_ARQUIVOS_DA_TELA = {k.replace("mesa-do-vendedor", "treino"): v for k, v in CASOS["ok"].items()
                     if k != "candidatos-de-tela.md"}
_PEDIDO = """# Candidatos de tela — Teste

## Treino do processo
- Slug: treino
- Veredito: {veredito}
- Trava nativa: nenhuma — o nativo não ensina o processo desta conta
- Quem usa: Vendedor

{decisao}
- Segue: sim
- Opera o registro: não
"""
CASOS["pedido-neutro"] = {"candidatos-de-tela.md": _PEDIDO.format(
    veredito="PEDIDO", decisao="### Decisão de quem pede"), **_ARQUIVOS_DA_TELA}
CASOS["pedido-antigo"] = {"candidatos-de-tela.md": _PEDIDO.format(
    veredito="PEDIDO DO FDE", decisao="### Decisão do FDE"), **_ARQUIVOS_DA_TELA}

ESPERA = {
    "ok": (0, ["[OK] a indicacao de tela passa."]),
    "pedido-neutro": (0, ["seguem: 1", "aviso/pedido", "[OK com ressalva]"]),
    "pedido-antigo": (0, ["seguem: 1", "aviso/pedido", "[OK com ressalva]"]),
    "ruim": (1, ["sem-trava-nativa", "webhook-no-frontend", "etapa-sem-funil", "aviso/cor-fixa",
                 "aviso/sem-tokens-da-base", "aviso/sem-dependencias", "aviso/sem-opera-o-registro"]),
    "vazio": (1, ["sem-candidatos"]),
}


def main() -> int:
    falhas = 0
    shutil.rmtree(TMP, ignore_errors=True)
    try:
        for nome, arquivos in CASOS.items():
            pasta = TMP / nome
            pasta.mkdir(parents=True)
            for rel, conteudo in arquivos.items():
                (pasta / rel).parent.mkdir(parents=True, exist_ok=True)
                (pasta / rel).write_text(conteudo, encoding="utf-8")
            r = subprocess.run([sys.executable, str(PORTAO), str(pasta), "--fase", "C"],
                               capture_output=True, text=True, encoding="utf-8",
                               env={"PYTHONIOENCODING": "utf-8", **__import__("os").environ})
            codigo, trechos = ESPERA[nome]
            faltam = [t for t in trechos if t not in r.stdout]
            if r.returncode != codigo or faltam:
                falhas += 1
                print(f"  FALHOU {nome}: saída {r.returncode} (esperada {codigo}); faltou {faltam}")
                print(r.stdout + r.stderr)
            else:
                print(f"  OK     {nome}")
    finally:
        shutil.rmtree(TMP, ignore_errors=True)
    print(f"\n{'FALHOU' if falhas else 'PASSOU'} — {falhas} falha(s).")
    return 1 if falhas else 0


if __name__ == "__main__":
    raise SystemExit(main())
