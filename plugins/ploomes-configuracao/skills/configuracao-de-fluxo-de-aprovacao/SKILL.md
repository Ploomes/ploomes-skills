---
name: configuracao-de-fluxo-de-aprovacao
description: "Indica os fluxos de aprovação de uma conta Ploomes — onde a política comercial do cliente vira trava no sistema, com que alçadas, níveis e aprovadores — e grava o fluxos.csv e o niveis.json, mais o racional. A entrada obrigatória é a política comercial (desconto, prazo, margem), contada na conversa ou nos documentos da pasta de trabalho; lê também o funis.csv que a configuracao-de-funis gravou. Não inventa alçada: o que o cliente não disse vira pergunta. Não escreve na conta: os arquivos são a especificação, e quem a aplica é você ou outra ferramenta. Use para \"monta a alçada de desconto da [empresa]\", \"quem aprova proposta acima de [percentual]?\", \"transforma a política comercial em fluxo de aprovação\"."
---

# Indicação de fluxo de aprovação

> **Antes de rodar, leia [o protocolo comum](../_nucleo/protocolo-de-indicacao.md).**
> Ele define o dossiê de entrada, as três fases da consulta ao acervo, o contrato
> de saída (CSV + racional + lacunas) e a disciplina do portão. O que está aqui é
> só o que é desta peça.

## 0. Por onde ela entra, e onde grava

🔴 **Onde ler e onde gravar está no [modo de trabalho](../_nucleo/modo-de-trabalho.md)** — leia-o
antes de começar.
O que é desta peça:

🔴 **Ela lê o desenho de funis — o `funis.csv` (o `xml_funis`) da `arquivos-de-configuracao/`**,
que a `configuracao-de-funis` gravou — e grava o fluxo de aprovação na mesma pasta:

| Esta skill grava, na pasta de entrega | Arquivo |
|---|---|
| os fluxos de aprovação | `arquivos-de-configuracao/fluxos.csv` |
| o anexo de níveis e aprovadores | `arquivos-de-configuracao/niveis.json` |


## O que esta skill decide

Uma coisa só: **onde a política comercial do cliente vira trava no sistema, e de
que tipo**. Não é uma pergunta técnica — é onde o cliente escolhe entre
autonomia do vendedor e controle da margem, e a skill existe para tornar essa
escolha explícita em vez de acidental.

As três ações custam coisas diferentes:

| Ação | Custa |
|---|---|
| **Bloqueio** | autonomia — o vendedor simplesmente não consegue |
| **Fluxo de aprovação** | tempo de ciclo — a proposta congela até alguém decidir |
| **Alerta** | cumprimento — avisa e deixa passar |

Toda indicação tem de dizer qual dos três custos o cliente está aceitando.

---

## Antes de indicar o primeiro fluxo, declare este custo

> Configurar **qualquer** fluxo de aprovação desliga a **modificação visual** de
> documento na conta inteira, para todos os usuários.

Não é por fluxo — é por conta, e é irreversível enquanto existir um fluxo. Se o
cliente ajusta o PDF à mão antes de enviar, isso entra em conflito direto com
qualquer alçada, e a decisão é dele.

E no **modo offline** travas e validações de fluxo não disparam: operação de campo
sem sinal não é protegida pela alçada.

Esses dois avisos entram na entrega, sempre — não na implantação.

---

## Entradas

| Insumo | Origem | Obrigatório |
|---|---|---|
| política comercial | escopo, proposta, transcrição da imersão | **sim** |
| `xml_funis` | arquitetura de funis | sim |
| campos disponíveis | lista de campos nativos + campos do to-be | **sim** |
| metadados do cliente | segmento, MOC (modelo de operação comercial da empresa), tipo de venda | sim (filtro do acervo) |
| estrutura de aprovação | quem aprova o quê, por equipe/perfil | não (sem isso, o anexo fica incompleto) |

**Portão de entrada:** sem política comercial declarada — um número, um limite,
uma regra — pare. Esta skill não inventa alçada; ela traduz política em
configuração. Se ninguém disse qual é o limite de desconto, a resposta é uma
pergunta ao cliente, não um palpite.

---

## Roteiro

### 1. Ler o vocabulário

[references/vocabulario-aprovacao.md](references/vocabulario-aprovacao.md) — as três
ações, os 8 operadores, os 8 parâmetros de configuração e o uso real do acervo.

Duas regras duras que saem de lá:

- **Só Proposta, Venda e Documento.** Regra sobre avanço de negócio é checklist
  ou regra de funil, não fluxo de aprovação.
- **Não existe operador "entre".** Faixa se faz com duas condições no mesmo campo:
  `Desconto Maior que 28 E Desconto Menor que 33`.

### 2. Consultar o acervo

Aplique as três fases do [protocolo](../_nucleo/protocolo-de-indicacao.md#2-consulta-ao-acervo):
o perfil do cliente, que pesa e marca o que é comparável, a busca e a leitura com higiene. Nesta peça, leia os
documentos `tipo: regra` — trazem ação, condições com operador e valor, número de níveis e aprovadores por nível.

```bash
python "${CLAUDE_PLUGIN_ROOT}/skills/_nucleo/consultar_acervo.py" \
       --tipo regra --segmento <segmento> --moc "<moc>" \
       --tipo-venda "<tipo de venda>" --busca "<o que procura>"
```

### 3. Traduzir política em regra

Para cada política declarada, responda nesta ordem:

1. Qual documento ela protege — proposta, venda ou documento?
2. Qual campo carrega o número? Ele existe, ou precisa ser criado antes?
3. Qual operador, e qual valor? Faixa exige duas condições.
4. Qual ação — travar, escalar ou avisar? **Justifique a escolha pelo custo.**
5. Se escalar: quantos níveis, quem aprova cada um?

**Ancore no acervo, e diga o tamanho da amostra.** Consulte a distribuição real
de ações e de níveis no recorte que você usou. Cada nível de aprovação é um dia a
mais de ciclo: indicar três onde as contas comparáveis usam um exige justificativa
explícita. Nunca apresente frequência sem dizer de quantas contas ela saiu.

### 4. Emitir o CSV

Cabeçalho exato, 7 colunas, todas as células entre aspas duplas:

```
Nome do Fluxo,Tipo,Condição,Aviso,Ação,Campo nativo?,Conteúdo do campo
```

| Coluna | Como preencher |
|---|---|
| `Nome do Fluxo` | único; nomeie pela política, não pelo número |
| `Tipo` | `Proposta`, `Venda` ou `Documento` |
| `Condição` | campo + operador + valor. Faixa vira duas linhas de condição |
| `Aviso` | **obrigatório** — é o texto que o vendedor lê ao esbarrar na regra |
| `Ação` | `Bloqueio`, `Fluxo de aprovação` ou `Alerta` |
| `Campo nativo?` | `Sim` ou `Não` |
| `Conteúdo do campo` | obrigatório quando o campo não é nativo |

### 5. Emitir o anexo de níveis

**O CSV de 7 colunas não expressa níveis, aprovadores nem notificação** — três dos
oito parâmetros que a configuração exige. Enquanto o contrato não mudar, esses
três vão num JSON anexo:

```json
{
  "Aprovação de desconto acima de 20%": {
    "niveis": [
      {"aprovadores": ["Gerente comercial"]},
      {"aprovadores": ["Diretor comercial"]}
    ],
    "notificar_email": true,
    "destinatarios": "todos os aprovadores"
  }
}
```

### 6. Passar no portão

```bash
python scripts/validar_fluxos.py fluxos.csv --niveis niveis.json --campos-nativos campos.txt
```

### 7. Entregar o racional

```
Aprovação de desconto acima de 20%
  Política: "vendedor dá até 20%, acima disso o gerente aprova" (imersão, 12/03)
  Custo escolhido: tempo de ciclo — alerta não seguraria, bloqueio mataria negócio
  Precedente: 5 contas do acervo, 4 com 1 nível único
  Campo: "Desconto adicional" (nativo) — existe
  Atenção: primeiro fluxo da conta, desliga a modificação visual de documento
```

---

## O que NUNCA fazer

- **Indicar fluxo fora de Proposta, Venda ou Documento.**
- **Inventar o limite.** Sem política declarada, pergunte.
- **Cravar nome de pessoa na condição.** É o anti-padrão observado em produção:
  funciona até a pessoa sair da empresa e então a alçada para de valer em
  silêncio. Condicione por equipe, perfil ou campo — ou pelo campo nativo
  `Criador` comparado a um usuário.
- **Deixar o `Aviso` vazio.** A mensagem é obrigatória e é o único lugar onde o
  vendedor descobre por que travou.
- **Usar operador que não existe.** São oito, e "entre" não é um deles.
- **Entregar níveis sem aprovador nomeado.**
- **Esquecer de declarar o custo da modificação visual.**

## Declarar lacuna

Quando a política depende de um dado que a proposta não tem — margem calculada
por fora, limite de crédito de um ERP, histórico de inadimplência — diga. A regra
só existe se o número estiver num campo da entidade, e **campo dinâmico dos tipos
Produto, Cliente e Usuário não gera field-path**, então nem sempre dá para
alcançá-lo.

```
LACUNA — "aprovar quando a margem ficar abaixo de 18%": a margem nao e campo
  da proposta hoje. Caminhos: campo calculado por fórmula de CPQ, ou trazer do
  ERP por integração. Ate existir, a regra nao e configurável.
```

---

## Arquivos

- [references/vocabulario-aprovacao.md](references/vocabulario-aprovacao.md)
- [scripts/validar_fluxos.py](scripts/validar_fluxos.py)

Fontes: artigo oficial de suporte (*Fluxos de aprovação*), `business-docs`
(`rc-fluxos-de-aprovacao.txt`), e o acervo de contas implantadas.
