"""Portao da INDICACAO DE TELA.

Confere a pasta telas/ da pasta de entrega nas duas fases que gravam:

  fase A — o candidatos-de-tela.md: no maximo tres candidatos, cada um com slug,
           sinal de S1 a S5 (S6 sozinho nao abre), evidencia, trava nativa e
           veredito. "PEDIDO" e veredito valido: a tela segue sem trava, por
           pedido de quem pede, com aviso;
  fase C — para cada candidato com "Segue: sim", a pasta <slug>/ com os tres
           arquivos, o prototipo com camada de dados isolada, sem chave de API
           fixa, sem host externo e sem URL de webhook, com as cores pelos tokens
           da base do construtor; a especificacao com as partes a, b, c (e d,
           com aviso); e o requisitos-da-cadeia.csv com as quatro colunas e os
           cinco tipos.

O arquivo e lido como se escreve de fato numa tela que foi para o ar: titulo
numerado, "Sinal(is)", negrito no valor, evidencia em subitens e secoes de nota
("## Notas", "## Nao indicadas", "## Fora ...") que nao sao candidato.

Os cabecalhos valem nas duas formas: a neutra ("Veredito: PEDIDO" e
"### Decisao de quem pede") e a antiga ("PEDIDO DO FDE" e "### Decisao do FDE"),
para que os arquivos ja gravados continuem passando.

    python validar_telas.py <pasta telas/> [--fase A|C]

Sem --fase, confere o que existir: sem decisao gravada, so a fase A.
"""
from __future__ import annotations

import argparse
import csv
import re
import unicodedata
from dataclasses import dataclass, field
from pathlib import Path

SINAIS_TRAVA = {"S1", "S2", "S3", "S4", "S5"}
SINAIS = SINAIS_TRAVA | {"S6"}
# "pedido" cobre tambem a forma antiga, "PEDIDO DO FDE".
VEREDITOS = ("recomendada", "opcional", "pedido")
# Titulo da secao de decisao (fase B), na forma neutra e na antiga.
TITULOS_DE_DECISAO = ("decisao de quem pede", "decisao do fde")
# Titulos de secao que nao sao candidato: o portao nao le.
SECOES_DE_NOTA = ("notas", "nota", "nao indicad", "fora d", "fontes", "resumo")
# Chaves com outro nome no arquivo real.
SINONIMOS = {"sinal(is)": "sinais", "sinal": "sinais", "evidencias": "evidencia"}
# Cor fixa: acima disto, fora dos blocos de token, o portao avisa.
MAX_HEX_SOLTO = 12
WEBHOOK = re.compile(r"https?://[^\s\"'<>]*(?:flows-api|/webhook|hooks?\.)[^\s\"'<>]*", re.I)
CABECALHO_REQ = ["Tipo", "Nome", "Funil", "Por quê"]
TIPOS_REQ = {"funil", "etapa", "modelo", "motivo-de-perda", "campo"}
MAX_CANDIDATOS = 3
HOSTS_LIVRES = ("fonts.googleapis.com", "fonts.gstatic.com")


def norm(texto: str) -> str:
    texto = unicodedata.normalize("NFD", str(texto or ""))
    texto = "".join(c for c in texto if unicodedata.category(c) != "Mn")
    return re.sub(r"\s+", " ", texto).strip().lower()


@dataclass
class Achado:
    onde: str
    regra: str
    detalhe: str
    severidade: str = "bloqueio"

    def __str__(self) -> str:
        return f"  [{self.severidade}/{self.regra}] {self.onde}: {self.detalhe}"


@dataclass
class Candidato:
    titulo: str
    campos: dict = field(default_factory=dict)
    decisao: dict = field(default_factory=dict)

    @property
    def segue(self) -> bool:
        return norm(self.decisao.get("segue", "")) in {"sim", "s", "true"}


def _limpo(valor: str) -> str:
    return re.sub(r"[*`]", "", valor).strip()


def _item(linha: str) -> tuple[str, str] | None:
    """Item de primeiro nivel ("- Chave: valor"), com ou sem negrito na chave."""
    if linha.startswith((" ", "\t")):
        return None
    m = re.match(r"^-\s*\**([^:*]+?)\**\s*:\s*(.*)$", linha.strip())
    if not m:
        return None
    chave = norm(m.group(1))
    return SINONIMOS.get(chave, chave), _limpo(m.group(2))


def _subitem(linha: str) -> str | None:
    """Subitem indentado ("  - ASIS-088 ..."): continua o valor da chave anterior."""
    m = re.match(r"^[ \t]+-\s+(.*)$", linha)
    return _limpo(m.group(1)) if m else None


def ler_candidatos(texto: str) -> tuple[list[Candidato], bool]:
    """Devolve os candidatos e se a secao 'Nenhuma tela indicada' existe."""
    candidatos: list[Candidato] = []
    nenhuma = False
    atual: Candidato | None = None
    na_decisao = False
    ultima: str | None = None
    for linha in texto.splitlines():
        if linha.startswith("## "):
            titulo = re.sub(r"^\d+[.)]\s*", "", linha[3:].strip())
            ultima = None
            if norm(titulo).startswith("nenhuma tela indicada"):
                nenhuma, atual = True, None
                continue
            if norm(titulo).startswith(SECOES_DE_NOTA) or re.search(r"nao (e )?candidato", norm(titulo)):
                atual = None
                continue
            atual = Candidato(titulo)
            candidatos.append(atual)
            na_decisao = False
            continue
        if linha.startswith("### ") and atual is not None:
            na_decisao = norm(linha[4:]).startswith(TITULOS_DE_DECISAO)
            ultima = None
            continue
        if atual is None:
            continue
        alvo = atual.decisao if na_decisao else atual.campos
        par = _item(linha)
        if par:
            alvo[par[0]] = par[1]
            ultima = par[0]
            continue
        sub = _subitem(linha)
        if sub and ultima:
            alvo[ultima] = (alvo[ultima] + " " + sub).strip()
    return candidatos, nenhuma


def validar_fase_a(candidatos: list[Candidato], nenhuma: bool) -> list[Achado]:
    achados: list[Achado] = []
    arq = "candidatos-de-tela.md"
    if not candidatos and not nenhuma:
        achados.append(Achado(arq, "sem-resultado",
                              "nao ha candidato nem a secao '## Nenhuma tela indicada'"))
    if candidatos and nenhuma:
        achados.append(Achado(arq, "resultado-contraditorio",
                              "ha candidatos e tambem a secao '## Nenhuma tela indicada'"))
    if len(candidatos) > MAX_CANDIDATOS:
        achados.append(Achado(arq, "candidatos-demais",
                              f"{len(candidatos)} candidatos; o teto e {MAX_CANDIDATOS} — "
                              f"sinal de que o desenho nativo nao foi tentado"))
    slugs: set[str] = set()
    por_papel: dict[str, list[str]] = {}
    for c in candidatos:
        onde = f"{arq} · {c.titulo!r}"
        # O veredito pode vir seguido de explicacao ("OPCIONAL. So vale se...").
        veredito = next((v for v in VEREDITOS
                         if norm(c.campos.get("veredito", "")).startswith(v)), "")
        pedido = veredito == "pedido"
        obrigatorios = (("slug", "veredito") if pedido else
                        ("slug", "sinais", "evidencia", "trava nativa", "veredito"))
        for chave in obrigatorios:
            if not c.campos.get(chave):
                achados.append(Achado(onde, "campo-obrigatorio-vazio", f"falta '{chave}'"))
        if pedido:
            achados.append(Achado(onde, "pedido", severidade="aviso",
                                  detalhe="segue por pedido de quem pede, sem a trava nativa da "
                                          "indicacao — declare isso na entrega"))
        papel = norm(c.campos.get("quem usa", ""))
        if papel:
            por_papel.setdefault(papel, []).append(c.titulo)
        slug = c.campos.get("slug", "")
        if slug:
            if not re.fullmatch(r"[a-z0-9]+(-[a-z0-9]+)*", slug):
                achados.append(Achado(onde, "slug-invalido",
                                      f"{slug!r} nao e kebab-case sem acento"))
            if slug in slugs:
                achados.append(Achado(onde, "slug-repetido", f"{slug!r} ja usado"))
            slugs.add(slug)
        # Os sinais podem vir numa frase ("S1 (S6 como sintoma)"): vale cada Sn citado.
        sinais = set(re.findall(r"\bS\d+\b", c.campos.get("sinais", "").upper()))
        fora = sinais - SINAIS
        if fora:
            achados.append(Achado(onde, "sinal-desconhecido",
                                  f"{', '.join(sorted(fora))} fora de S1–S6"))
        if sinais and not (sinais & SINAIS_TRAVA) and not pedido:
            achados.append(Achado(onde, "sem-trava-nativa",
                                  "so S6 (planilha paralela) — sintoma sem trava nao abre "
                                  "candidato; a indicacao provavelmente e nativa"))
        if c.campos.get("veredito") and not veredito:
            achados.append(Achado(onde, "veredito-invalido",
                                  f"{c.campos['veredito']!r}; use RECOMENDADA, OPCIONAL "
                                  f"ou PEDIDO"))
    for papel, titulos in por_papel.items():
        if len(titulos) > 1:
            achados.append(Achado(arq, "mesmo-papel", severidade="aviso",
                                  detalhe=f"{', '.join(titulos)} sao do mesmo papel — considere "
                                          f"uma mesa com uma aba por tarefa"))
    return achados


def validar_prototipo(caminho: Path, onde: str) -> list[Achado]:
    achados: list[Achado] = []
    html = caminho.read_text(encoding="utf-8", errors="replace")
    if not re.search(r"\bconst\s+api\s*=\s*\{", html):
        achados.append(Achado(onde, "sem-camada-de-dados",
                              "nao ha 'const api = {...}' — a tela nao tem camada de dados "
                              "isolada e nao se troca o exemplo pela API sem reescrever"))
    if re.search(r"User-Key['\"]?\s*[:=]\s*['\"][A-Za-z0-9]{16,}", html):
        achados.append(Achado(onde, "chave-fixa",
                              "User-Key com valor literal — login e pelas credenciais do usuario"))
    for url in re.findall(r"<(?:script|link)[^>]+(?:src|href)=[\"'](https?://[^\"']+)", html, re.I):
        if not url.split("/")[2].endswith(HOSTS_LIVRES):
            achados.append(Achado(onde, "host-externo",
                                  f"{url} — artifact bloqueia host externo; embuta"))
    achados.extend(_webhooks(html, onde))
    # Cores: os blocos :root/.dark (os tokens copiados da base) podem ter hex; o resto nao.
    estilo = " ".join(re.findall(r"<style[^>]*>(.*?)</style>", html, re.S | re.I))
    sem_tokens = re.sub(r"(?::root|\.dark)[^{]*\{[^}]*\}", "", estilo)
    if "var(--color-" not in estilo:
        achados.append(Achado(onde, "sem-tokens-da-base", severidade="aviso",
                              detalhe="nenhum var(--color-*) — use os tokens da base do construtor "
                                      "(whitelabel e modo escuro dependem deles)"))
    soltos = len(re.findall(r"#[0-9a-fA-F]{3,8}\b", sem_tokens))
    if soltos > MAX_HEX_SOLTO:
        achados.append(Achado(onde, "cor-fixa", severidade="aviso",
                              detalhe=f"{soltos} cores em hex fora dos blocos de token — o "
                                      f"construtor copia este CSS"))
    return achados


def _webhooks(texto: str, onde: str) -> list[Achado]:
    return [Achado(onde, "webhook-no-frontend",
                   f"{url[:80]} — integracao vai por registro no Ploomes e automacao, nunca por "
                   f"URL de webhook no navegador")
            for url in sorted(set(WEBHOOK.findall(texto)))]


def validar_especificacao(caminho: Path, onde: str) -> list[Achado]:
    bruto = caminho.read_text(encoding="utf-8", errors="replace")
    texto = norm(bruto)
    achados = _webhooks(bruto, onde)
    faltam = [p for p in ("## a.", "## b.", "## c.") if p not in texto]
    if faltam:
        achados.append(Achado(onde, "especificacao-incompleta",
                              f"faltam as secoes {', '.join(faltam)} (macro, entidades e campos, "
                              f"roteiro de configuracao)"))
    if "## d." not in texto:
        achados.append(Achado(onde, "sem-dependencias", severidade="aviso",
                              detalhe="falta '## d. Dependencias e fases' — o que espera "
                                      "integracao ou flow, e o que a tela mostra ate la"))
    if "## e." not in texto:
        achados.append(Achado(onde, "sem-onboarding", severidade="aviso",
                              detalhe="falta '## e. Onboarding' — boas-vindas, tour, primeiros passos, dicas e "
                                      "estados vazios para quem vai usar a tela"))
    if "rota" not in texto:
        achados.append(Achado(onde, "sem-rotas", severidade="aviso",
                              detalhe="a especificacao nao fala de rota — cada aba e cada "
                                      "registro aberto tem a sua na base do construtor"))
    return achados


def validar_requisitos(caminho: Path, onde: str) -> list[Achado]:
    achados: list[Achado] = []
    linhas = caminho.read_text(encoding="utf-8-sig").splitlines()
    if not linhas:
        return [Achado(onde, "requisitos-vazio", "arquivo vazio — sem cabecalho")]
    cab = next(csv.reader([linhas[0]]))
    if [norm(c) for c in cab] != [norm(c) for c in CABECALHO_REQ]:
        return [Achado(onde, "cabecalho-invalido",
                       f"esperado {CABECALHO_REQ}, veio {cab}")]
    for i, r in enumerate(csv.DictReader(linhas), start=2):
        tipo = norm(r.get("Tipo", ""))
        if tipo not in TIPOS_REQ:
            achados.append(Achado(f"{onde} linha {i}", "tipo-invalido",
                                  f"{r.get('Tipo')!r}; use {', '.join(sorted(TIPOS_REQ))}"))
        if not (r.get("Nome") or "").strip():
            achados.append(Achado(f"{onde} linha {i}", "nome-vazio", "requisito sem nome"))
        if tipo == "etapa" and not (r.get("Funil") or "").strip():
            achados.append(Achado(f"{onde} linha {i}", "etapa-sem-funil",
                                  "requisito de etapa precisa do funil"))
        if not (r.get("Por quê") or "").strip():
            achados.append(Achado(f"{onde} linha {i}", "sem-motivo", "falta 'Por quê'",
                                  severidade="aviso"))
    return achados


def validar_fase_c(pasta: Path, candidatos: list[Candidato]) -> list[Achado]:
    achados: list[Achado] = []
    for c in candidatos:
        if not c.decisao:
            achados.append(Achado(f"candidatos-de-tela.md · {c.titulo!r}", "sem-decisao",
                                  "fase C sem '### Decisao de quem pede' gravada — a fase B "
                                  "nao rodou"))
            continue
        if not c.segue:
            continue
        if not c.decisao.get("opera o registro"):
            achados.append(Achado(f"candidatos-de-tela.md · {c.titulo!r}", "sem-opera-o-registro",
                                  severidade="aviso",
                                  detalhe="a decisao nao diz se a tela opera o registro ou so "
                                          "mostra — e o que mais muda depois"))
        slug = c.campos.get("slug", "")
        base = pasta / slug
        for nome, fn in (("prototipo.html", validar_prototipo),
                         ("especificacao.md", validar_especificacao),
                         ("requisitos-da-cadeia.csv", validar_requisitos)):
            arq = base / nome
            if not arq.exists():
                achados.append(Achado(f"{slug}/", "arquivo-faltando", f"falta {nome}"))
            else:
                achados.extend(fn(arq, f"{slug}/{nome}"))
    return achados


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("pasta", type=Path, help="a pasta telas/ da pasta de entrega")
    ap.add_argument("--fase", choices=["A", "C"])
    args = ap.parse_args()

    print(f"INDICACAO DE TELA — {args.pasta}\n")
    arq = args.pasta / "candidatos-de-tela.md"
    if not arq.exists():
        print("  [bloqueio/sem-candidatos] falta candidatos-de-tela.md — a fase A nao rodou")
        print("\n[BLOQUEADO] 1 bloqueio(s), 0 aviso(s).")
        return 1

    candidatos, nenhuma = ler_candidatos(arq.read_text(encoding="utf-8"))
    achados = validar_fase_a(candidatos, nenhuma)
    fase = args.fase or ("C" if any(c.decisao for c in candidatos) else "A")
    if fase == "C":
        achados += validar_fase_c(args.pasta, candidatos)
    print(f"  fase conferida: {fase} · candidatos: {len(candidatos)} · "
          f"seguem: {sum(c.segue for c in candidatos)}\n")

    bloqueios = [a for a in achados if a.severidade == "bloqueio"]
    avisos = [a for a in achados if a.severidade == "aviso"]
    if not achados:
        print("[OK] a indicacao de tela passa.")
        return 0
    for a in achados:
        print(a)
    print()
    if bloqueios:
        print(f"[BLOQUEADO] {len(bloqueios)} bloqueio(s), {len(avisos)} aviso(s).")
        return 1
    print(f"[OK com ressalva] 0 bloqueios, {len(avisos)} aviso(s).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
