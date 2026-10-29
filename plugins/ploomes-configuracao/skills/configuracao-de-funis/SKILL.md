---
name: configuracao-de-funis
description: "Indica os funis de uma conta Ploomes — quantos, quais, com que etapas e sob quais regras — e grava os CSVs de funis e de etapas, mais o racional de cada decisão. Lê o processo atual (o as-is em BPMN, ou o processo descrito num processo.md ou na conversa), o escopo vendido ao cliente e as notas da sua equipe, na pasta de trabalho, e decide onde o trabalho muda de dono, e portanto de funil. É a peça de que dependem checklists, automações e fluxos de aprovação, que citam a etapa pelo nome que ela definir. Não escreve na conta: os CSVs são a especificação, e quem a aplica é você ou outra ferramenta. Não escreve checklist, automação nem fluxo de aprovação. Use para \"quantos funis a [empresa] precisa?\", \"desenha a arquitetura de funis da [empresa]\", \"transforma este processo em funis e etapas do Ploomes\"."
---

# Indicação de funis

> **Antes de rodar, leia [o protocolo comum](../_nucleo/protocolo-de-indicacao.md).**
> Ele define o dossiê de entrada, as três fases da consulta ao acervo, o contrato
> de saída (CSV + racional + lacunas) e a disciplina do portão. O que está aqui é
> só o que é desta peça.

## 0. Por onde ela entra, e onde grava

🔴 **Onde ler e onde gravar está no [modo de trabalho](../_nucleo/modo-de-trabalho.md)** — leia-o
antes de começar.
O que é desta peça:

| Esta skill grava, na pasta de entrega | Arquivo |
|---|---|
| os funis | `arquivos-de-configuracao/funis.csv` |
| as etapas | `arquivos-de-configuracao/etapas.csv` |

É a mesma `arquivos-de-configuracao/` onde as outras quatro peças da cadeia de configuração gravam;
o `modelos.csv`/`campos-modelo.csv` da skill de proposta, quando já existirem, moram ali.

## O que esta skill decide

Duas coisas, e as duas são caras de errar:

1. **Quantos funis existem** — onde um processo termina e outro começa.
2. **Quais regras cada funil liga** — se pode pular etapa, voltar, ganhar fora da
   última, gerar proposta.

Tudo o mais é consequência. Checklist mora em etapa; automação de funil mora em
etapa; fluxo de aprovação só vale para documento que o funil permite gerar.

**E o nome da etapa é contrato.** As duas skills seguintes citam etapa por nome.
Renomear depois não quebra com erro — quebra em silêncio.

---

## O erro que esta skill existe para evitar

> "Embora essa entidade se chame 'Negócios', ela é, na realidade, um cadastro de
> **fluxos de trabalho**."

O reflexo é modelar um funil de vendas e pendurar tudo nele: pós-venda vira
etapa, implantação vira etapa, chamado vira etapa. O resultado é um funil de
dezoito etapas onde quatro times não conseguem ver a própria fila.

**Regra de corte:** quando a etapa seguinte é executada por **outra equipe**, com
**outro ritmo** e **outro critério de sucesso**, são dois funis conectados por
automação — não duas etapas.

Sinais de que falta separar:
- a etapa tem responsável diferente de todas as anteriores
- o tempo típico da etapa é de outra ordem de grandeza (horas vs. semanas)
- "ganhar" significa coisas diferentes em dois pontos do mesmo funil
- o cliente descreve a passagem como "aí manda pro time X"

Sinais de que separou demais:
- um funil com uma ou duas etapas — provavelmente é status, não processo
- funis que sempre andam juntos, sem decisão entre eles
- ninguém responderia "quantos itens tenho aqui agora?" sobre aquele funil

---

## Entradas

| Insumo | Origem | Obrigatório |
|---|---|---|
| as-is em BPMN | o XML que o cliente ou o consultor desenhou | **sim**, ou a descrição do processo atual (ver o portão abaixo) |
| transcrições / entrevista | completam o que o desenho não diz | sim |
| escopo / proposta comercial | o que foi vendido | **sim** |
| quem faz o quê | equipes, responsáveis por etapa | sim |
| modelos de PVD indicados | skill de proposta | não (sem isso, não restrinja modelos) |
| metadados do cliente | segmento, MOC (modelo de operação comercial da empresa), tipo de venda | sim (filtro do acervo) |

**Portão de entrada:** sem as-is nem descrição do processo atual, pare. Esta
skill redesenha um processo existente; não inventa um do zero.

---

## Roteiro

### 0. Ler o as-is

⚠️ **Sem BPMN, este passo não roda:** a evidência de raia, de decisão e de passagem de bastão sai
da descrição do processo atual — o `processo.md` ou o que a pessoa contou —, citada no racional, e
o que ela não disser vira pergunta antes do passo 3.

O BPMN do cliente chega como XML. **Não leia o XML cru** — é milhares de linhas
onde a geometria ocupa mais espaço que o processo, e o que interessa some.

```bash
python scripts/ler_asis.py as-is-<cliente>.bpmn --json as-is.json
```

Sai três coisas:

**Trabalho por raia** — quem faz o quê. Repare que *não* é a ordem do processo:
com gateways e ramos paralelos não existe uma sequência única, e fingir que
existe produz leitura errada.

**Pontos de decisão** — os gateways, com o nome da pergunta que cada um faz
("Crédito Aprovado?", "Nacional ou Exportação?"). São eles que apontam onde o
processo se divide, e frequentemente onde nasce um funil separado.

**Passagens de bastão** — as arestas em que o dono muda, agrupadas por par de
raias. Esta é a leitura mais densa, e se lê assim:

| Padrão | O que sugere |
|---|---|
| par com **muitas** passagens | mesmo processo, dois papéis conversando — **um** funil |
| par com **uma ou duas** | entrega de trabalho — **candidato a fronteira de funil** |
| par que só vai, nunca volta | passagem definitiva — fronteira forte |
| par que vai e volta | ida e volta dentro do mesmo processo |

O script **não decide**. Ele produz a evidência; o corte é dos passos 3 e 5,
confrontando com ritmo, critério de sucesso e escopo da proposta.

> Se o relatório apontar elementos **sem nome**, o as-is está incompleto nesses
> pontos — vale perguntar antes de desenhar em cima.

### 1. Ler o vocabulário

[references/vocabulario-funis.md](references/vocabulario-funis.md) — as seis
famílias de funil, os parâmetros de configuração, as oito regras que codificam o
processo e os limites herdados.

### 2. Consultar o acervo

Aplique as três fases do [protocolo](../_nucleo/protocolo-de-indicacao.md#2-consulta-ao-acervo):
o perfil do cliente, que pesa e marca o que é comparável, a busca e a leitura com higiene. Nesta peça, leia os
documentos `tipo: funil` — trazem as flags ligadas, a sequência de etapas e os motivos de perda.

```bash
python "${CLAUDE_PLUGIN_ROOT}/skills/_nucleo/consultar_acervo.py" \
       --tipo funil --segmento <segmento> --moc "<moc>" \
       --tipo-venda "<tipo de venda>" --busca "<o que procura>"
```

### 3. Cortar os funis

Percorra o as-is procurando **mudança de dono**. Para cada candidato a funil:

- qual é o **objetivo** dele em uma frase? (sem isso, é Kanban)
- qual é a **família**? (vendas, licitação, renovação, implantação, chamados…)
- quem **vê**? por usuário, perfil ou equipe — e a lista
- como ele **começa** e como **termina**?
- o que o liga ao funil anterior e ao seguinte?

### 4. Nomear as etapas

Nome de etapa é o que as próximas duas skills vão citar. Três regras:

- **estado, não tarefa** — "Proposta enviada", não "Enviar proposta"
- **único dentro do funil** — duas etapas com o mesmo nome quebram a referência
- **estável** — trate como contrato; mudar depois exige refazer checklist e automação

### 5. Ligar as regras — e justificar cada uma

As oito regras não são preferência, são política:

| Regra | A pergunta que responde |
|---|---|
| Passar por todas as etapas | o processo é obrigatório ou orientativo? |
| Proibido voltar | erro se corrige voltando, ou seguindo? |
| Ganhar só na última etapa | ganho é decisão ou chegada? |
| Cria venda ao ganhar | a venda nasce sozinha? |
| Pode ganhar / Pode perder | este funil tem desfecho? |
| Usuário de automação | quem assina o que o sistema faz? |
| Gera proposta / venda / documento | o que nasce dentro do negócio? |
| Limitar modelos | quais modelos valem aqui? |

**Cada Sim tem custo.** "Passar por todas as etapas" aumenta a qualidade do dado
e irrita o vendedor que pulou uma reunião. Declare o custo junto com a indicação.

### 6. Fechar o obrigatório

- **Motivo de perda**: todo funil que pode perder precisa de pelo menos um.
  Motivo de perda é o dado que mais rende análise depois — vale caprichar na
  lista, e não usar "Outro" como muleta.
- **Nomenclatura da unidade**: num funil de chamados, "negócio" é ruído.
- **Verbo dos botões**: "concluir" em vez de "ganhar" onde fizer sentido.

### 7. Emitir os dois CSVs

`funis.csv` — 22 colunas, uma linha por funil:

```
N°,Nome do Funil,Objetivo,Familia,Tipo de visibilidade,Quem vê,Passar por todas as etapas,Proibido voltar,Ganhar só na última etapa,Cria venda ao ganhar,Pode ganhar,Pode perder,Usuário de automação,Gera proposta,Gera venda,Gera documento,Modelos permitidos,Unidade singular,Unidade plural,Verbo ganhar,Verbo perder,Motivos de perda
```

`etapas.csv` — 6 colunas, uma linha por etapa:

```
N°,Funil,Ordem,Etapa,O que acontece aqui,Responsável
```

Listas internas (`Quem vê`, `Modelos permitidos`, `Motivos de perda`) separadas
por `;`. Todas as células entre aspas duplas.

A coluna **`O que acontece aqui`** não é enfeite: é dela que a skill de checklist
deriva o que precisa ser preenchido, e a de automação deriva o que o sistema faz
sozinho. Etapa sem descrição trava as duas.

### 8. Passar no portão

```bash
python scripts/validar_funis.py funis.csv etapas.csv --modelos modelos.txt
```

Ele confere formato, coerência entre regras (ganhar só na última com pode ganhar
= Não), motivo de perda obrigatório, ordem das etapas sem buraco, nome de etapa
único por funil, e que modelo citado exista.

### 9. Entregar o racional

```
Funil 2 — Implantação
  Por que separado de Vendas: muda de dono (comercial → técnica), ritmo de
    semanas contra dias, e "concluir" ali não é "ganhar"
  Entrada: automação no ganho do funil Vendas
  Regras ligadas: passar por todas as etapas (Sim) — o cliente exige vistoria
    antes de instalar; proibido voltar (Não) — retrabalho acontece
  Custo declarado: vendedor não consegue pular a vistoria nem em urgência
  Precedente: <N> contas do acervo com funil de implantação separado
```

---

## O que NUNCA fazer

- **Um funil para tudo.** Se muda de dono, muda de funil.
- **Funil de uma ou duas etapas** sem justificar por que não é um campo de status.
- **Etapa nomeada como tarefa** ("Enviar proposta" em vez de "Proposta enviada").
- **Nome de etapa repetido** dentro do mesmo funil.
- **Funil que pode perder sem motivo de perda cadastrado.**
- **Restringir modelos de PVD que ainda não foram indicados** — modelos vêm antes
  do funil na ordem de configuração.
- **Ligar regra sem declarar o custo dela.**
- **Renomear etapa depois** que checklist ou automação já a citou.

## Declarar lacuna

Quando o processo exige algo que o funil não faz, diga em vez de aproximar:

```
LACUNA — o cliente quer numeração própria por processo ("OS-001" no funil de
  chamados). O código sequencial do Ploomes e GLOBAL, compartilhado por todos os
  funis, e nao configuravel. Caminhos: campo próprio preenchido por automação
  com fórmula, ou numeração vinda do ERP.
```

Outra recorrente: **SLA em dias úteis**. O contador nativo "dias no estágio" conta
dias corridos e não é configurável.

---

## Arquivos

- [references/vocabulario-funis.md](references/vocabulario-funis.md)
- [scripts/ler_asis.py](scripts/ler_asis.py) — transforma o BPMN do cliente em trabalho por raia, decisões e passagens de bastão
- [scripts/validar_funis.py](scripts/validar_funis.py) — o portão
- [exemplos/referencia-funis.csv](exemplos/referencia-funis.csv) e
  [exemplos/referencia-etapas.csv](exemplos/referencia-etapas.csv) — três funis
  conectados (vendas → implantação, e suporte em paralelo), preenchidos como se
  espera. Passam no portão. Use como alvo de formato, **não** como gabarito de
  conteúdo: nome de etapa e motivo de perda saem da operação do cliente.

Fontes: `business-docs` (`se-funis.txt`, `rc-funis.txt`), artigo oficial de
suporte, e o acervo de contas implantadas.
