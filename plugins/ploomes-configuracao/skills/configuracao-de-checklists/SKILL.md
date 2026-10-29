---
name: configuracao-de-checklists
description: "Indica os checklists de cada etapa de uma conta Ploomes — que informação a operação precisa capturar em cada etapa, e o que trava o avanço se faltar — e grava o checklists.csv, mais o racional de cada item. Lê o etapas.csv e o funis.csv que a configuracao-de-funis gravou na pasta de trabalho, o escopo vendido ao cliente e o que se sabe do processo. Não escreve na conta: o CSV é a especificação, e quem a aplica é você ou outra ferramenta. Não redesenha funil nem escreve automação. Use para \"quais checklists cada etapa da [empresa] precisa?\", \"o que trava o avanço do negócio na etapa [etapa]?\", \"monta os checklists do funil de vendas da [empresa]\"."
---

# Indicação de checklists

> **Antes de rodar, leia [o protocolo comum](../_nucleo/protocolo-de-indicacao.md).**
> Ele define o dossiê de entrada, as três fases da consulta ao acervo, o contrato
> de saída (CSV + racional + lacunas) e a disciplina do portão. O que está aqui é
> só o que é desta peça.

## 0. Por onde ela entra, e onde grava

🔴 **Onde ler e onde gravar está no [modo de trabalho](../_nucleo/modo-de-trabalho.md)** — leia-o
antes de começar.
O que é desta peça:

🔴 **Ela lê o `etapas.csv` e o `funis.csv` da `arquivos-de-configuracao/`**, que a
`configuracao-de-funis` gravou, e grava o checklist na mesma pasta:

| Esta skill grava, na pasta de entrega | Arquivo |
|---|---|
| os checklists | `arquivos-de-configuracao/checklists.csv` |


## O que esta skill decide

**Que informação a operação precisa capturar em cada etapa, e o que trava o
avanço se faltar.**

É a peça que transforma processo em dado. Sem checklist, o funil registra que o
negócio andou; com checklist, registra *por quê*, e o dado existe depois para
análise.

E é também a peça que mais irrita o usuário quando mal calibrada. Cada item
obrigatório é um pedágio. A pergunta certa nunca é "que campos seria bom ter" —
é **"que decisão essa etapa toma, e sem qual dado ela não pode ser tomada"**.

---

## A regra que mais reprova indicação

Um item de checklist aponta para campo de **três entidades, e nada além**:

**Negócio · Cliente do negócio · Contato do negócio**

Não existe checklist sobre proposta, produto, venda, tarefa ou usuário. Quando a
regra precisa olhar para a proposta, o instrumento é **fluxo de aprovação**;
quando precisa olhar para tarefa, é **automação**. Indicar item fora dessas três
entidades é a forma mais comum de entregar linha que não configura.

E o contato do negócio é **um só** — checklist que dependa de "os contatos" no
plural não existe.

---

## Entradas

| Insumo | Origem | Obrigatório |
|---|---|---|
| `etapas.csv` + `funis.csv` | skill de funis | **sim** |
| `O que acontece aqui` por etapa | skill de funis | **sim** |
| escopo / proposta comercial | o que foi vendido | **sim** |
| campos existentes | nativos + campos já indicados | sim |
| metadados do cliente | segmento, MOC (modelo de operação comercial da empresa), tipo de venda | sim (filtro do acervo) |

**Portão de entrada:** sem o desenho de funis, pare. Checklist mora em etapa e
não cria etapa. Se a etapa não existe, o pedido é para a skill de funis.

---

## Roteiro

### 1. Ler o vocabulário

[references/vocabulario-checklists.md](references/vocabulario-checklists.md) — as
três entidades, os 8 operadores, checklist condicional, o contrato do CSV.

### 2. Consultar o acervo

Aplique as três fases do [protocolo](../_nucleo/protocolo-de-indicacao.md#2-consulta-ao-acervo):
o perfil do cliente, que pesa e marca o que é comparável, a busca e a leitura com higiene. Nesta peça, leia os
documentos `tipo: checklist` — trazem a etapa, a instrução ao usuário, os itens com entidade e tipo de campo, e a condição de aparecimento.

```bash
python "${CLAUDE_PLUGIN_ROOT}/skills/_nucleo/consultar_acervo.py" \
       --tipo checklist --segmento <segmento> --moc "<moc>" \
       --tipo-venda "<tipo de venda>" --busca "<o que procura>"
```

### 3. Para cada etapa, fazer a pergunta certa

Percorra `O que acontece aqui` etapa por etapa e pergunte, nesta ordem:

1. **Que decisão se toma nesta etapa?**
2. **Sem qual dado essa decisão não pode ser tomada?** — esses são os candidatos
   a item com condição de avanço.
3. **Que dado é melhor capturar aqui do que depois?** — esses são candidatos a
   item **sem** condição, que aparecem para preencher e não travam.
4. O campo existe, ou precisa ser criado?
5. A condição é "preenchido", ou é uma comparação de verdade?

**Nem toda etapa precisa de checklist.** Etapa de transição técnica, ou que só
espera evento externo, não captura nada. Dizer isso é uma resposta legítima —
inventar seis itens para ela é pedágio sem contrapartida.

### 4. Escolher a condição de avanço

O erro comum é tratar tudo como "campo obrigatório". A condição aceita os 8
operadores:

| Intenção | Condição |
|---|---|
| só avança com o CNPJ preenchido | `CNPJ` **Diferente de** vazio |
| só avança se passar de 10 mil | `Valor` **Maior que** 10000 |
| só avança se aprovado | `Análise aprovada?` **Igual a** Sim |
| captura sem travar | *sem condição* |

### 5. Considerar checklist condicional

Um checklist inteiro pode aparecer só quando um filtro é satisfeito — e o filtro
parte **do negócio**, navegando por field-path.

```
Checklist "Dados de pessoa jurídica"  →  Cliente › Tipo  Igual a  Empresa
```

Isso permite **entrevista progressiva**: preencher um item faz outro checklist
aparecer na mesma tela, em tempo real. Bem usado, substitui um formulário
gigante por um caminho curto.

### 6. Reconhecer o padrão de aprovação por checklist

Existe uma aprovação que **não** usa fluxo de aprovação: campo `Análise
aprovada?` num checklist, com **edição permitida só a uma equipe**.

- aprovar **avanço de processo** → checklist + permissão de campo
- aprovar **documento** → fluxo de aprovação

Confundir os dois é erro recorrente. Se a etapa exige alguém autorizando a
passagem, é aqui — não na skill de aprovação.

### 7. Emitir o CSV

18 colunas, cabeçalho exato, **uma linha por item** (não por checklist):

```
Descrição do item,N° do Checklist,Nome do Checklist,Funil,Etapa do funil,Entidade do Item,EntityId,Campo do item,Dynamic(true/false),FieldId,Required (true/false),Operador lógico,OperationId,Valor,Type,TypeId,OptionsTable,OptionsTable@Options
```

| Regra do contrato | |
|---|---|
| `Dynamic=true` | `Campo do item` **=** `Descrição do item`, `FieldId` vazio |
| `Dynamic=false` | `FieldId` preenchido |
| `Dynamic=true` + `TypeId=7` | `OptionsTable` e `OptionsTable@Options` obrigatórios, opções separadas por `;` sem espaço |
| `Required=true` | exige `Operador lógico` + `OperationId` |
| `OperationId` | 1 a 8, coerente com o operador escrito |

**A descrição não é o nome do campo.** Campo `CNPJ`, descrição *"Preencha o CNPJ
do cliente"*. É o que o usuário lê, e a ordem dos itens é a experiência de
preenchimento.

### 8. Passar no portão

```bash
python scripts/validar_checklists.py checklists.csv --etapas etapas.csv
```

### 9. Entregar o racional

```
Checklist 3 — Qualificação (funil Vendas Diretas)
  Decisão da etapa: seguir para proposta ou descartar
  Trava: "Orçamento aprovado?" (Igual a Sim) — sem isso a proposta vira
    retrabalho; foi a dor nº 2 da imersão
  Sem trava: "Concorrente citado" — coleta aqui porque depois ninguém lembra
  Campos novos: 1 (Orçamento aprovado?, seleção Sim/Não)
  Precedente: <N> contas do acervo travam qualificação por orçamento
```

---

## O que NUNCA fazer

- **Item fora de Negócio, Cliente ou Contato.**
- **Criar etapa ou funil.** Se não está no `etapas.csv`, não existe.
- **Tratar todo item como obrigatório.** Item sem condição é uma escolha, não um
  descuido.
- **Encher etapa de transição** só para cumprir cota de itens.
- **Descrição igual ao nome do campo** quando isso não instrui nada.
- **Campo novo de seleção sem a lista de opções.**
- **Usar checklist para aprovar documento** — isso é fluxo de aprovação.
- **Depender de "os contatos"** no plural.

## Declarar lacuna

```
LACUNA — a etapa "Análise de crédito" precisa do limite disponível do cliente,
  que hoje só existe no ERP. Checklist só alcança campo de Negócio, Cliente ou
  Contato. Caminhos: trazer o limite para um campo do Cliente por integração, ou
  campo com fórmula externa consultando o ERP. Até existir, a trava nao e
  configuravel.
```

Outra recorrente: dado alcançado por **campo dinâmico dos tipos Usuário, Produto
ou Cliente** — esses **não geram field-path**, então não servem de filtro de
checklist condicional.

---

## Arquivos

- [references/vocabulario-checklists.md](references/vocabulario-checklists.md)
- [scripts/validar_checklists.py](scripts/validar_checklists.py)

Fontes: `business-docs` (`se-checklists.txt`, `rc-checklists.txt`,
`rc-regras-de-filtragem.txt`), artigo oficial de suporte, e o acervo.
