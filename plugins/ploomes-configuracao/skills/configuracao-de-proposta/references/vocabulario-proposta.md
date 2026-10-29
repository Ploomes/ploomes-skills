# Vocabulário e regras — propostas, vendas e documentos (PVD)

Fontes: `business-docs` (`ep-propostas-vendas-e-documentos.txt`,
`se-modelos-de-proposta-vendas-documentos.txt`,
`rc-modelos-de-proposta-vendas-e-documentos.txt`, `se-opcionais.txt`),
artigo oficial de suporte (*Propostas, Vendas e Documentos*).

---

## As quatro coisas que podem ser um modelo

| Tipo de modelo | Vínculo obrigatório | Tem revisão? |
|---|---|---|
| **Proposta** | **sempre** a um negócio | **sim** — guarda versões anteriores |
| **Venda** | negócio **ou** cliente direto | não — só edita |
| **Documento do Negócio** | negócio | não |
| **Documento do Cliente** | cliente | não |

**Um modelo serve a um tipo só.** Não existe modelo que atenda proposta e venda,
e modelo de documento de cliente é separado de documento de negócio. Indicar
"um modelo que serve para os dois" é a indicação mais comum que não configura.

**Só proposta tem revisão.** Se o cliente precisa guardar o histórico de versões
do que mandou, é proposta — mesmo que ele chame de "orçamento" ou "contrato".
Venda e documento sobrescrevem: a versão anterior desaparece.

**Venda tem campo nativo `Estágio`**, com opções personalizáveis. Serve para
acompanhar o pedido depois de fechado sem precisar de funil próprio.

---

## A hierarquia de quatro níveis

Todo PVD tem a mesma estrutura, e o formulário se divide nela:

```
PVD                    ← o "cabeçalho": cliente, validade, condição de pagamento
 └── Bloco             ← agrupa produtos (ex.: um bloco de produtos, outro de serviços)
      └── Produto      ← o item na proposta, com preço daquela proposta
           └── Opcional ← acessório/parte vinculada ao produto
```

Campo indicado sem dizer o nível não configura. "Prazo de entrega" é do PVD, do
bloco ou do produto? A resposta muda o documento inteiro.

Blocos podem ser pré-fixados ou adicionados pelo usuário na hora.

---

## Os limites que decidem o desenho

### O limite de produtos é uma fórmula, não um número

> 150 produtos por PVD **se cada produto tiver 4 campos ou menos**. A cada campo
> novo, o limite cai **8 produtos**. Garantido em máquina com 8 GB de RAM.

Então:

| Campos por produto | Teto de produtos |
|---:|---:|
| 4 | 150 |
| 5 | 142 |
| 8 | 118 |
| 10 | 102 |
| 15 | 62 |

**Isso torna "quantos campos por produto" uma decisão de capacidade, não de
conforto.** Cliente que monta proposta com 80 itens não pode ter 12 campos por
produto. Pergunte o tamanho típico da proposta antes de indicar campos de produto.

### Só existem três fórmulas nativas

Com o módulo *Automação de propostas e documentos*, e só estas:

1. **Total do produto** = Quantidade × Valor unitário − Desconto (%)
2. **Total do bloco** = soma dos Totais do bloco − Desconto do bloco (%)
3. **Valor do PVD** = soma dos Totais dos blocos − Desconto (%)

Desconto é **sempre em porcentagem**, e o desconto do bloco altera só o total do
bloco — não mexe no preço dos produtos dentro dele.

Qualquer cálculo além desses três exige **fórmulas de CPQ**, que é outro módulo:
cálculo em JavaScript, fórmula condicional, consulta a API externa, ou planilha
Excel/Google Sheets como motor de cálculo.

### A tabela de parcelas é fechada

Nativa, mas **não é configurável**:

- não dá para criar propriedade na parcela (forma de pagamento por parcela, por exemplo)
- o cálculo é sempre Valor ÷ número de parcelas, e não se altera
- as datas são preenchidas manualmente

Cliente que precisa de forma de pagamento por parcela precisa de outra estrutura.

### Outros limites

- **200.000** propostas, **200.000** vendas, **200.000** documentos
- **A4 retrato, sempre.** Nunca paisagem
- Sem sumário e sem numeração automática de capítulos

---

## Seções — o que quase ninguém acerta de primeira

O modelo é feito de **uma ou mais seções**. Cada uma tem nome, margens (superior,
inferior, lateral, em mm), **cabeçalho HTML** e **rodapé HTML**.

Três comportamentos que mudam o desenho:

1. **Seção nova sempre começa em página nova.** Seção não é divisão lógica: é
   quebra de página. Querer "duas seções na mesma folha" não existe.
2. **No PDF, cabeçalho e rodapé repetem em toda página daquela seção.** No HTML,
   aparecem uma vez. O mesmo modelo lê diferente nos dois formatos.
3. **Bloco, produto, opcional e parcela só entram no conteúdo da seção** — nunca
   em cabeçalho ou rodapé.

O conteúdo aceita exibição condicional: mostrar um trecho de HTML só quando um
campo estiver preenchido com determinado valor.

---

## Opcionais (CPQ)

Produto filho de produto — "opcional" ou "parte". Ao inserir o pai na proposta,
os opcionais podem vir junto.

- um produto pode ter vários filhos, e ser filho de vários
- **todo vínculo exige uma categoria**, e exatamente uma
- o vínculo aceita campos próprios (ex.: preço especial quando A é filho de B)
- entre vínculos do mesmo pai existem três relações: **inserir**, **bloquear**
  e **sugerir**

Também dá para tornar um **grupo de produtos** ou um **marcador** filho de um
produto — não só produto individual.

---

## Compartilhamento

- **PDF** para download
- **E-mail** com o PDF anexo e link (exige integração de e-mail habilitada)
- **Link Web** — cliente vê online, aceita ou recusa, comenta; o criador é
  notificado a cada abertura e comentário. **O aceite não tem validade jurídica**
- **WhatsApp** — abre o chat com o link

Cada PVD tem comentário interno, comentário externo, acompanhamento do fluxo de
aprovação e uma timeline própria (gerada, acessada, aceita, aprovada/recusada).

---

## Dependências de ordem

Modelos de PVD vêm **antes dos funis** na ordem de configuração — o funil
referencia o modelo padrão e a lista de modelos permitidos.

E vêm **antes dos fluxos de aprovação**, que agem sobre o PVD gerado.

> **Configuração de modelo é feita só na interface administrativa do Ploomes.**
> Nunca exposta ao usuário final.
