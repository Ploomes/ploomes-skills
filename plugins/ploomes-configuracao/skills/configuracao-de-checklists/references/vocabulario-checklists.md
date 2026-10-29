# Vocabulário e regras — checklists

Fontes: `business-docs` (`se-checklists.txt`, `rc-checklists.txt`,
`rc-regras-de-filtragem.txt`), artigo oficial de suporte (*Checklists*).

---

## O que um checklist é

Uma lista de campos que precisam ser preenchidos **numa etapa** para que o
negócio avance. Não é formulário, não é tarefa, não é aprovação: é **condição de
avanço**.

Uma etapa pode ter **mais de um** checklist, e eles podem aparecer
**condicionalmente**.

## A regra que mais reprova indicação: só três entidades

Um item de checklist aponta para um campo de **uma destas três**, e nada além:

| Entidade | Condição |
|---|---|
| **Negócio** | sempre disponível |
| **Cliente** | se o negócio tiver cliente vinculado |
| **Contato** | se o negócio tiver contato vinculado (só **um** principal) |

Não existe item de checklist sobre Proposta, Produto, Venda, Tarefa ou Usuário.
Se a regra precisa olhar para a proposta, o instrumento é **fluxo de aprovação**;
se precisa olhar para a tarefa, é **automação**.

> O contato do negócio é **um só**. Checklist que dependa de "os contatos" no
> plural não é configurável.

## Condição de avanço — não é só "preenchido"

O erro comum é tratar checklist como obrigatoriedade de campo. A condição aceita
os **8 operadores** do mecanismo de filtro:

`Igual a` · `Diferente de` · `Maior que` · `Maior ou igual a` · `Menor que` ·
`Menor ou igual a` · `Contém` · `Não contém`

Então dá para exigir:

- *só avança com o CNPJ preenchido* → `CNPJ` **Diferente de** vazio
- *só avança se o valor passar de 10 mil* → `Valor` **Maior que** 10000
- *só avança se a análise foi aprovada* → `Análise aprovada?` **Igual a** Sim

E um item pode existir **sem condição de avanço** — aparece só para o usuário
poder preencher ali, sem travar nada. É uma escolha legítima e subusada: coleta
o dado no momento certo sem transformar o processo em pedágio.

## Checklist condicional

O checklist inteiro pode ter um **filtro**. Satisfeito o filtro, ele aparece.

```
Checklist "Dados de pessoa jurídica"
  aparece quando: Cliente → Tipo  Igual a  Empresa
```

Dois pontos que mudam o desenho:

1. **O filtro parte sempre do negócio** e navega por **field-path**. Sem
   field-path entre negócio e a entidade do campo, o filtro não existe.
2. **A reavaliação é em tempo real.** Preencher um item pode fazer um novo
   checklist aparecer na mesma tela. Isso é comportamento esperado, não efeito
   colateral — dá para desenhar entrevistas progressivas com ele.

A validação roda no backend, mas o frontend precisa espelhar a mesma lógica.

## O padrão de aprovação sem fluxo de aprovação

Da documentação, e vale saber que existe:

> Etapa "Análise de crédito", checklist com o campo "Análise aprovada?", e a
> **edição desse campo permitida só para a Equipe Financeira**.

Isso é uma aprovação construída com checklist + permissão de campo, sem usar
fluxo de aprovação. Serve para aprovar **avanço de processo** — enquanto o fluxo
de aprovação serve para aprovar **documento**. São instrumentos diferentes para
problemas diferentes, e confundir os dois é erro comum.

## Parâmetros de configuração

1. **Estágio de funil** — a que etapa pertence
2. **Título do checklist**
3. **Texto informativo** — apoio a quem preenche (tooltip)
4. **Filtros** — opcionais; tornam o checklist condicional
5. **Itens**, cada um com:
   - **descrição** — o que o usuário deve fazer, em linguagem de instrução
   - **campo vinculado** — de negócio, cliente ou contato
   - **condição de avanço** — opcional
6. **Ordenação dos itens** — a API devolve na ordem definida, então a ordem é
   a experiência de preenchimento

> A **descrição** não é o nome do campo. Campo: `CNPJ`. Descrição:
> *"Preencha o CNPJ do cliente"*. É o que o usuário lê.

## Armadilha de field-path

**Campo dinâmico dos tipos Usuário, Produto e Cliente não gera field-path.** Um
checklist que tente condicionar por dado alcançado através de um campo
personalizado desses tipos não funciona — precisa de segunda requisição na API ou
campo acumulador.

## Contrato do CSV

18 colunas, cabeçalho exato:

```
Descrição do item,N° do Checklist,Nome do Checklist,Funil,Etapa do funil,Entidade do Item,EntityId,Campo do item,Dynamic(true/false),FieldId,Required (true/false),Operador lógico,OperationId,Valor,Type,TypeId,OptionsTable,OptionsTable@Options
```

Uma linha **por item**, não por checklist. Itens do mesmo checklist repetem
`N° do Checklist`, `Nome do Checklist`, `Funil` e `Etapa do funil`.

Regras do contrato:

- `Dynamic=true` (campo novo) ⇒ `Campo do item` **igual** a `Descrição do item`,
  e `FieldId` vazio
- `Dynamic=false` (campo nativo ou já existente) ⇒ `FieldId` preenchido
- `Dynamic=true` **e** `TypeId=7` (seleção) ⇒ `OptionsTable` e
  `OptionsTable@Options` obrigatórios, opções separadas por `;` sem espaço
- `Required=true` ⇒ há condição de avanço, logo `Operador lógico` e `OperationId`
  preenchidos e coerentes com o tipo do campo
- `OperationId` de 1 a 8, na ordem dos operadores acima
