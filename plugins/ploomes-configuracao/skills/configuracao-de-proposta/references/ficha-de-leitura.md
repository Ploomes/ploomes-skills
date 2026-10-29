# Ficha de leitura — da proposta atual do cliente para o modelo no Ploomes

A proposta que o cliente usa hoje é um PDF, um Word ou uma planilha. O modelo do
Ploomes é uma estrutura de **quatro níveis** com **seções**. Esta ficha é a
tradução entre os dois, e é onde a skill ganha ou perde.

Preencha na ordem. Cada bloco termina numa decisão, não numa observação.

---

## 1. Quantas propostas diferentes existem?

Antes de modelar uma, conte quantas são. O sinal de que são **modelos separados**:

- o **documento muda de estrutura**, não só de conteúdo (uma tem tabela de
  medição, outra não)
- o **público é outro** (proposta técnica para engenharia, comercial para compras)
- o **cálculo é outro** (uma é por metro, outra por peça)
- **quem assina é outro**

Não é modelo separado quando muda só logo, cor ou texto de abertura — isso é
exibição condicional dentro do mesmo modelo.

> Cada modelo serve a **um** tipo: Proposta, Venda, Documento do Negócio ou
> Documento do Cliente. Se a mesma peça precisa virar pedido depois, são dois
> modelos, não um.

**Decisão:** lista de modelos, com tipo e finalidade de cada um.

---

## 2. Onde o documento quebra de página?

No Ploomes, **seção = quebra de página**. Não existe duas seções na mesma folha.

Percorra o PDF marcando:

| No PDF do cliente | No modelo |
|---|---|
| capa com logo e título, sozinha na folha | seção "Capa" |
| corpo que corre por várias páginas | seção "Corpo" |
| anexo, termos, condições gerais em folha própria | seção própria |
| faixa que se repete no topo de toda página | **cabeçalho** da seção |
| faixa que se repete no rodapé de toda página | **rodapé** da seção |

**Cuidado com a diferença entre PDF e HTML:** cabeçalho e rodapé repetem em toda
página no PDF, mas aparecem **uma vez** no HTML da tela. Se o cliente conta com o
rodapé para algo que precisa ser lido sempre (validade, contato), isso fica fraco
na versão web.

**Decisão:** lista de seções, na ordem, com o que vai em cabeçalho e rodapé.

> Capa separada custa uma folha sempre. Se a proposta típica tem 2 páginas, a
> capa consome metade do documento.

---

## 3. O que aparece uma vez, e o que se repete?

Esta é a pergunta que resolve o nível de cada campo.

| Comportamento no PDF | Nível |
|---|---|
| aparece **uma vez**, no topo ou no fim | **PVD** — número, data, validade, cliente, condição de pagamento, total geral |
| **agrupa** itens sob um título ("Materiais", "Serviços", "Lote 1") | **Bloco** |
| é **linha de tabela** que se repete por item | **Produto** |
| é **sub-item indentado** sob um produto, ou acessório que vem junto | **Opcional** |

Dois erros comuns:

- **tratar bloco como produto.** Se o cliente soma subtotais por grupo, existe
  bloco. Se não há subtotal por grupo, provavelmente não há.
- **tratar opcional como produto.** Se o item só existe vinculado a outro e
  desaparece quando o pai sai, é opcional.

**Decisão:** cada campo identificado no documento, com seu nível.

---

## 4. Como o produto é apresentado?

Transcreva as **colunas da tabela de itens**, na ordem, exatamente como estão:

```
Item | Código | Descrição | Un | Qtd | Preço unit. | Desc% | IPI | Total
```

Depois conte. **O número de campos por produto define o teto de itens da proposta:**

| Campos por produto | Teto de itens |
|---:|---:|
| 4 | 150 |
| 6 | 134 |
| 9 | 110 |
| 12 | 86 |

E pergunte ao cliente: **qual a maior proposta que vocês já fizeram?** Se a
resposta passar do teto, a conversa muda — ou corta campo de produto, ou a
proposta grande vira mais de um documento.

**Decisão:** colunas do produto, quantidade típica e máxima de itens, e o veredito
sobre o teto.

---

## 5. De onde vem cada número?

Para cada valor calculado no documento, descubra quem calcula hoje:

| Hoje | No Ploomes |
|---|---|
| a planilha multiplica qtd × preço e tira o desconto | **fórmula nativa** — Total do produto |
| soma dos itens de um grupo, menos desconto do grupo | **fórmula nativa** — Total do bloco |
| soma dos grupos, menos desconto geral | **fórmula nativa** — Valor do PVD |
| qualquer outra conta | **CPQ** — add-on pago, só a partir do plano Avançado |
| o vendedor consulta o ERP e digita | **integração**, ou continua manual |
| uma planilha de engenharia calcula | motor de planilha, ou fórmula externa |

**Só existem três fórmulas nativas.** Imposto, frete calculado, comissão, preço por
faixa, conversão de moeda, medição — tudo isso é CPQ. Contar quantos cálculos
passam das três é medir **quanto o projeto depende do add-on CPQ**, e isso entra
no orçamento, não na especificação.

**Cuidado com parcelas:** a tabela nativa não aceita propriedade nova e o cálculo
é sempre Valor ÷ nº de parcelas. Se o cliente tem forma de pagamento por parcela,
ou valores diferentes por parcela, isso **não é a tabela nativa**.

**Decisão:** cada cálculo, com o mecanismo que o resolve, e a lista do que exige CPQ.

---

## 6. O que da identidade visual sobrevive

O HTML do modelo aceita CSS, então logo, cor, tipografia e espaçamento
atravessam. O que **não** atravessa:

- **paisagem** — o Ploomes gera A4 retrato, sempre
- **sumário e numeração automática de capítulos** — não existem
- fonte que dependa de arquivo externo: prefira fonte com fallback seguro
- layout que dependa de altura fixa de página

Levante do material do cliente: **logo** (arquivo e versão), **cores** (hex),
**tipografia**, e uma **página de exemplo** que sirva de alvo visual.

**Decisão:** o que é replicável, o que precisa adaptação e o que se perde.

---

## 7. O que a proposta pede que o cliente ainda não tem

Toda variável do documento precisa existir como campo em algum nível. Marque cada
uma como:

- **nativo** — já existe no Ploomes
- **novo** — precisa ser criado
- **vem de outra entidade** — exige **field-path** confirmado. E lembre: campo
  dinâmico dos tipos Produto, Cliente e Usuário **não gera field-path**
- **não existe em lugar nenhum** — vira LACUNA nomeada

**Decisão:** a lista de campos a criar, por nível — que é o que vai para o
`campos-modelo.csv` e, antes dele, para a configuração de campos.

---

## Saída da ficha

Com os sete blocos preenchidos, saem os dois CSVs:

- `modelos.csv` — um por modelo, com tipo, seções, parcelas, visibilidade
- `campos-modelo.csv` — um por campo, com nível, origem, se aparece no HTML e qual cálculo

mais três coisas que não cabem em CSV e vão no racional:

1. **o veredito do teto de produtos**
2. **a lista do que exige CPQ** — com o custo a confirmar
3. **as lacunas** — dado que a proposta usa e a operação não tem
