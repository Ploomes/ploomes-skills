# O que vem da Conta

O Ploomes é multi-tenant e altamente configurável. Quase tudo que parece constante
é, na verdade, decisão de uma Conta específica. **Fixar no código qualquer coisa
desta página é bug em outra Conta** — e costuma passar despercebido porque funciona
na Conta em que foi testado.

## Nunca fixe no código

| O que | Onde vem |
|---|---|
| Id de estágio, funil, origem, motivo, tipo de tarefa, status configurável | Carregado do servidor por Conta |
| Lista, ordem, seção e **largura** dos campos de um formulário | Configuração de campos da Conta |
| Colunas de uma tabela | Preferência do usuário/Visão |
| Idioma e moeda | Conta e registro |
| Cor de um status | Administrador da Conta |
| Marca, logo e cor principal | Whitelabel da Conta |

Os únicos enums estáveis são os **fixos de produto** — por exemplo o Status de
Negócio (`1 Em andamento`, `2 Ganho`, `3 Perdido`). A distinção entre enum fixo e
lista configurável está em
`ploomes-tech-docs:business-docs`.

## O formulário é montado pela configuração, não pela tela

Quais campos aparecem, em que ordem, dentro de que seção e **com que largura** é
configuração da Conta. A largura é declarada em número de colunas de uma grade de
quatro: **metade é o padrão**, linha inteira é a exceção declarada, e um quarto ou
três quartos existem só quando a Conta os configura. Um formulário com largura
fixada por campo diverge da mesma tela em outra Conta — e o desalinhamento é
visível na primeira linha com dois campos.

### A visibilidade de campo é por usuário, e o sinal é o `Hidden`

O metadata de campos é resolvido **para o usuário autenticado**. A lista não muda de
tamanho: o campo restrito na exibição **continua vindo**, com `Hidden = true` para
quem está fora do escopo da permissão e `false` para quem está dentro — e Perfil
administrador está sempre dentro. Vale igual para campo personalizado e para
propriedade nativa, porque as duas coisas são campos no metadata.

Consequências para qualquer superfície que exiba campos de uma entidade:

- **O que decide a renderização é o `Hidden` do campo, não a presença dele.**
  Verificar se o campo existe no metadata não detecta restrição nenhuma, porque ele
  sempre existe. Campo com `Hidden` não é renderizado — nem como rótulo vazio, nem
  desabilitado, nem mascarado. Ver
  `ploomes-tech-docs:business-docs`.
- **Mostre só os campos que o metadata entrega com `Hidden = false`.** A tela não decide
  por conta própria quais campos exibir.
- **Lista de campos fixada no código não tem como respeitar a permissão.** Ela foi
  decidida antes de existir um usuário; o que muda por usuário é o `Hidden`.
- **A mesma tela mostrando colunas diferentes para dois usuários é o comportamento
  certo**, não inconsistência a corrigir. Layout que só fecha com um número fixo de
  colunas quebra no primeiro usuário restrito.

## Cor de status não é sua decisão

Estágio de funil, status de proposta, prioridade de tarefa: quando o valor vem de
lista configurável, **a cor é responsabilidade do administrador**. Não pinte de
verde "porque é positivo" nem de vermelho "porque parece ruim" — a Conta pode ter
semântica oposta.

Quando não há cor configurada, use o fallback neutro do design system. Escolher uma
cor semântica por conta própria é o erro; deixar neutro não é.

## Idioma e formatação

Idiomas oficiais: **pt-BR** (primário e fallback), pt-PT, es, es-MX, en. O idioma da
Conta determina o formato.

**Todo texto visível passa pelo sistema de tradução** — nunca fixe string no
código, nem "só esse rótulo".

Formatos canônicos em pt-BR:

| Caso | Formato | Exemplo |
|---|---|---|
| Data | `DD/MM/AAAA` | `15/05/2026` |
| Data curta | `DD/MM/AA` | `15/05/26` |
| Data com mês por extenso | `DD [de] MMMM` | `15 de maio` |
| Data completa | `DD [de] MMMM [de] AAAA` | `15 de maio de 2026` |
| Data + hora | `DD/MM/AAAA [às] HH:mm` | `15/05/2026 às 14:30` |
| Hora | `HH:mm` (24h) | `14:30` |
| Data relativa | "Hoje", "Amanhã", "Ontem"; "há 3 dias", "há 2 horas" | — |
| Moeda (BRL) | `R$ 1.234,56` — milhar `.`, decimal `,`, espaço não separável após o símbolo | — |
| Decimal | milhar `.`, decimal `,` | `1.234,56` |
| Percentual | `12,5%` — sem espaço antes do símbolo | — |
| CPF · CNPJ · CEP | `000.000.000-00` · `00.000.000/0000-00` · `00000-000` | — |
| Telefone BR | `(DD) NNNNN-NNNN` celular · `(DD) NNNN-NNNN` fixo | — |

Telefone de Contato de outro país usa a máscara cadastrada daquele país; país
desconhecido, exiba sem máscara.

## Fuso horário

A regra que mais causa erro de um dia:

- **Data sem hora** é "data local do usuário" — **não converta para UTC**. Uma data
  de aniversário ou de vencimento não muda porque o usuário viajou.
- **Data com hora** segue UTC e é convertida no display.

## Ordenação sensível ao idioma

Comparação alfabética usa as regras do idioma, não a tabela de bytes. Em pt-BR,
acento e maiúscula são equiparados: `Ângela` fica entre `Andre` e `Antonio`.

Listas configuráveis **não** são ordenadas alfabeticamente — seguem a ordem da
Conta. Ver [`dados-e-listagem.md`](./dados-e-listagem.md).

## Permissão

O que o usuário vê e pode fazer depende do Perfil dele. Duas consequências
práticas:

- **Ação indisponível não é erro** — é estado. Uma tela sem permissão mostra estado
  próprio, não um erro de carregamento. Ver
  [`estados-e-feedback.md`](./estados-e-feedback.md).
- **Somente-leitura é exceção explícita**, não o padrão. Um registro editável abre
  editável; sem permissão de escrita, abre em leitura com a razão clara.

Modelo completo em `ploomes-tech-docs:business-docs`.

## Whitelabel

Conta com whitelabel tem marca própria — cor, logo e nome vêm da Conta. Não assuma
o roxo do Ploomes nem o logo do Ploomes em tela que pode rodar sob whitelabel.
