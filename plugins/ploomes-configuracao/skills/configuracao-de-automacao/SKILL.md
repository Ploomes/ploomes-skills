---
name: configuracao-de-automacao
description: "Indica as automações de uma conta Ploomes — o que o sistema faz sozinho quando o negócio muda de etapa ou quando o tempo passa — e grava o automacoes.csv, mais o racional de cada uma, conferido contra o vocabulário de gatilhos e ações da plataforma. Lê o etapas.csv e o funis.csv que a configuracao-de-funis gravou na pasta de trabalho, o escopo vendido ao cliente e as integrações contratadas. Não escreve na conta: o CSV é a especificação, e quem a aplica é você ou outra ferramenta. Não decide o processo, não cria funil e não escreve fluxo de aprovação. Use para \"que automações a [empresa] precisa?\", \"automatiza a cobrança de proposta sem retorno\", \"o que dá para automatizar neste funil?\"."
---

# Indicação de automação

> **Antes de rodar, leia [o protocolo comum](../_nucleo/protocolo-de-indicacao.md).**
> Ele define o dossiê de entrada, as três fases da consulta ao acervo, o contrato
> de saída (CSV + racional + lacunas) e a disciplina do portão. O que está aqui é
> só o que é desta peça.

## 0. Por onde ela entra, e onde grava

🔴 **Onde ler e onde gravar está no [modo de trabalho](../_nucleo/modo-de-trabalho.md)** — leia-o
antes de começar.
O que é desta peça:

🔴 **Ela lê o `etapas.csv` e o `funis.csv` da `arquivos-de-configuracao/`**, que a
`configuracao-de-funis` gravou, e grava as automações na mesma pasta:

| Esta skill grava, na pasta de entrega | Arquivo |
|---|---|
| as automações | `arquivos-de-configuracao/automacoes.csv` |


## O que esta skill é

A terceira peça da cadeia do to-be. Ela **não** decide o processo: recebe os funis
e etapas já desenhados e responde uma pergunta só — *o que o sistema faz sozinho,
em qual momento, e por quê*.

O que ela acrescenta em relação a pedir automações a um modelo:

1. **Vocabulário fechado.** Gatilho e ação saem das tabelas de dicionário da
   própria API, geradas por script. Automação com nome inventado não é ambição, é
   uma linha que o implantador não consegue configurar. Atenção: a lista de
   **ações** varia por conta (integração e módulo contratados) — use a união do
   acervo, não a de uma conta.
2. **Precedente real.** A indicação vem do acervo de referência, com a
   operação parecida pesando na ordem — não de plausibilidade.
3. **Portão determinístico.** Formato, coerência gatilho/entidade/etapa e
   obrigatoriedade de detalhamento são conferidos por código, não pedidos no prompt.

---

## Entradas

| Insumo | Origem | Obrigatório |
|---|---|---|
| `etapas.csv` + `funis.csv` | saída da skill de funis | **sim** |
| `O que acontece aqui` por etapa | coluna do `etapas.csv` | **sim** |
| `escopo` / proposta comercial | o que foi vendido | **sim** |
| `metadados do cliente` | segmento, MOC (modelo de operação comercial da empresa), tipo de venda, porte | sim (filtro do acervo) |
| `integracoes contratadas` | ex.: Neppo, Meetime | não (sem isso, ação dependente vira LACUNA) |

**Portão de entrada:** sem o desenho de funis, pare. Esta skill não desenha funil nem
infere etapa — se o desenho não existe, o pedido é para a skill de funis.

---

## Roteiro

### 1. Ler o vocabulário

Abra [references/vocabulario-automacoes.md](references/vocabulario-automacoes.md).
As duas regras que mais reprovam linha:

- gatilho com **Exige etapa** obriga funil e etapa no `Filtro`, e essa etapa tem
  de existir no desenho;
- gatilho com **entidade restrita** não aceita outra entidade.

### 2. Consultar o acervo

Aplique as três fases do [protocolo](../_nucleo/protocolo-de-indicacao.md#2-consulta-ao-acervo):
o perfil do cliente, que pesa e marca o que é comparável, a busca e a leitura com higiene. Nesta peça, leia os
documentos `tipo: automacao` — trazem gatilho, etapa, condição, ações com parâmetro, se está ligada e quando rodou.

```bash
python "${CLAUDE_PLUGIN_ROOT}/skills/_nucleo/consultar_acervo.py" \
       --tipo automacao --segmento <segmento> --moc "<moc>" \
       --tipo-venda "<tipo de venda>" --busca "<o que procura>"
```

### 3. Indicar

Para cada etapa do `etapas.csv`, lendo `O que acontece aqui`, pergunte nesta ordem:

1. O que a etapa exige que o sistema faça sozinho? (avanço, cobrança, registro,
   notificação, cálculo, integração)
2. Existe precedente no acervo para operação parecida? Quantas contas fazem isso?
3. O gatilho que isso pede existe? A ação existe? A entidade bate?
4. O escopo da proposta cobre? Fora do escopo não entra, por mais óbvio que seja.

**Ordem importa.** Automações na mesma etapa executam na ordem de `N°`. Quando
uma depende do efeito da outra (editar campo e depois mover etapa), a dependência
tem de aparecer na numeração.

**Uma automação, um propósito.** Três ações na mesma linha costuma ser sinal de
que são duas automações — confira contra a distribuição de ações por automação
das contas comparáveis que a consulta devolveu, e diga o tamanho da amostra.

### 4. Emitir o CSV

Cabeçalho exato, 12 colunas, todas as células entre aspas duplas, `"` interno
escapado como `""`:

```
N°,Tipo,Descrição,Entidade,Gatilho,Filtro,Ação 1,Detalhamento 1,Ação 2,Detalhamento 2,Ação 3,Detalhamento 3
```

| Coluna | Como preencher |
|---|---|
| `N°` | sequencial de 1 a N, sem buraco. É também a ordem de execução |
| `Tipo` | `Funil` quando o gatilho é de etapa; `Geral` nos demais. São as duas funcionalidades distintas do artigo oficial — ver [limites-e-divergencias.md](references/limites-e-divergencias.md) |
| `Descrição` | o que ela faz, em uma frase, na linguagem da operação |
| `Entidade` | Negócio, Cliente, Proposta, Venda, Tarefa, Lead, Documento |
| `Gatilho` | **literal** da tabela de gatilhos |
| `Filtro` | a condição; com gatilho de etapa, nomear funil e etapa |
| `Ação N` | **literal** da tabela de ações |
| `Detalhamento N` | os parâmetros. Obrigatório quando a ação exige corpo |

**`Editar dados` tem três formas e o `Detalhamento` precisa dizer qual** — valor
fixo, puxar de outro campo, ou fórmula JavaScript. É de longe a ação mais usada, e
sair sem declarar a forma deixa quem configura no escuro:

```
Campo "Data de envio" = fórmula: data de hoje
Campo "Segmento" = valor fixo "Indústria"
Campo "E-mail do contato" ← campo "E-mail" do Cliente
```

### 5. Passar no portão

```bash
python scripts/validar_automacoes.py automacoes.csv --etapas etapas.csv --integracoes "Neppo,Meetime"
```

Bloqueio não é sugestão: corrija e rode de novo. Não entregue CSV que não passou.

### 6. Entregar o racional junto

O CSV vai para ingestão; o racional vai para quem configura a conta. Uma linha por automação:

```
N° 7 — Cobrança de proposta sem retorno em D+3
  Origem: etapa "Proposta enviada" do funil Vendas Diretas (etapas.csv)
  Precedente: 4 contas do acervo, 3 de bens intermediários B2B (C001, C009, C010)
  Escopo: coberto pelo item 4.2 da proposta
  Observação: 1 conta do acervo tem essa automação desligada por erro
```

Sem procedência, é palpite com aparência de método.

---

## O que NUNCA fazer

- **Inventar gatilho ou ação.** Fora das duas tabelas não existe.
- **Indicar automação fora do escopo** da proposta comercial, mesmo que o acervo
  mostre que todo mundo faz.
- **Citar funil ou etapa que não está no `etapas.csv`.** Esta skill não cria processo.
- **Usar automação desligada do acervo como precedente.**
- **Indicar ação que depende de integração não contratada.** Vira LACUNA nomeada,
  com o nome da integração e o que ela custaria.
- **Entregar CSV que não passou no portão.**

## Declarar lacuna

Quando a etapa pede algo que a plataforma não faz com os 23 gatilhos e 14 ações
disponíveis, **diga isso** em vez de aproximar. Uma linha inventada custa uma
reunião de implantação; uma lacuna declarada vira escopo.

```
LACUNA — etapa "Análise de crédito": exige consultar bureau externo e decidir.
  Sem gatilho nativo. Caminhos: campo com fórmula externa, ou integração via
  webhook. Confirmar com o time de Produto antes de cotar.
```

---

## Arquivos

- [references/vocabulario-automacoes.md](references/vocabulario-automacoes.md) — gatilhos, ações, regras duras, uso real
- `references/vocabulario-automacoes.json` — a mesma coisa, lida pelo portão
- [references/limites-e-divergencias.md](references/limites-e-divergencias.md) — tetos, entidades oficiais, e onde o artigo público diverge da conta em produção
- [scripts/validar_automacoes.py](scripts/validar_automacoes.py) — o portão

O vocabulário é **gerado**, não escrito: `tools/gerar_vocabulario_automacoes.py`
no extrator o refaz a partir da API. Quando a Ploomes lançar um gatilho novo,
rode o gerador — não edite o markdown.
