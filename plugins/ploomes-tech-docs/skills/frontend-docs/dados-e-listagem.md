# Carregar dado e listar

## Nenhuma coleção é carregada de uma vez

Toda tela que lista registros usa uma das duas estratégias — nunca "traz tudo":

- **Paginação numerada** — páginas com Primeira/Anterior/N/Próxima/Última e o
  resumo "Mostrando X – Y de TOTAL". Padrão para tabela administrativa, relatório
  e lista de seleção.
- **Rolagem infinita** — carrega o próximo lote ao chegar no fim, com indicador.
  Padrão para feed e lista contínua.

**Armadilhas:**
- Pedir a coleção inteira numa requisição.
- Subir `$top` para "trazer tudo de uma vez". Há teto de `MaxTop = 1000` no
  servidor, e mesmo abaixo dele o lote é dimensionado para a página visível, não
  para a coleção.

## `$orderby` estável é obrigatório

O lote avança com `$top` + `$skip`, e a ordenação **precisa terminar em `Id`** —
`Id asc`, `CreateDate desc,Id`, etc.

Sem o desempate por `Id`, registros com valor igual na coluna ordenada trocam de
posição entre requisições: a rolagem infinita **repete linha e pula linha**, e a
paginação mostra o mesmo registro em duas páginas. É um bug que só aparece com
dado real, com empate — por isso passa fácil em teste.

Contrato completo em [`../api-docs/03-odata-reference.md`](../api-docs/03-odata-reference.md) §5.

## Ordenação de lista

- **Coleções de registro** (Contatos, Negócios, Propostas, Vendas, Documentos,
  Produtos) seguem a ordenação da Visão. Sem configuração explícita, o padrão do
  módulo — Negócios, por exemplo, ordena por Estágio dentro do Funil.
- **Listas configuráveis** (Origens, Motivos, Classes, Tipos de Tarefa, Estágios)
  seguem **a ordem definida pela Conta**. Nunca reordene alfabeticamente por conta
  própria: a ordem é uma decisão do administrador e costuma ter significado
  (etapas de um processo, prioridade de motivos).
- **Seleção de Usuário/Contato**: alfabética por nome de exibição, com comparação
  **sensível ao idioma**. Em pt-BR acento e maiúscula são equiparados — `Ângela`
  aparece entre `Andre` e `Antonio`, não no fim da lista.

## Busca e opções

- **Busca em lista de opções**: debounce de **300 ms**. Cada nova digitação
  cancela a busca anterior, e a resposta de uma busca já superada é descartada em
  vez de aplicada — sem isso a lista pisca com o resultado de um texto que o
  usuário não está mais digitando.
- **Carregamento de opções é sempre assíncrono**, mesmo quando a fonte já está em
  memória — o resultado vem encapsulado em promessa. Não escreva dois caminhos.
- **Paginação de opções**: **20 itens por lote**. O lote seguinte é pedido quando
  a rolagem se aproxima do fim da lista; a lista para de pedir quando um lote
  volta incompleto. Toda busca nova volta ao primeiro lote.
- **Cache compartilhado**: várias instâncias apontando para a mesma fonte de
  opções compartilham cache. Quem mantém o cache é o consumidor; os campos apenas
  notificam e consultam. Vale a pena em tela com filtro na listagem **e** o mesmo
  campo na ficha.

## Selecionar um registro: Contato, Usuário, Produto

Campo ou filtro que aponta para um registro da Conta **nunca** oferece a coleção
inteira — a Conta tem milhares de Contatos e centenas de Usuários. O padrão é o
mesmo em todos eles, e tem três partes que andam juntas.

**A busca acontece no servidor.** O texto digitado vira consulta; a lista exibida
é sempre um recorte, nunca a coleção filtrada em memória. Em Contato a busca casa
mais de uma propriedade — `Name`, `LegalName`, `Email` e `Register`. Documento e
telefone são normalizados para dígitos antes da comparação, e um texto que pode
ser CNPJ é normalizado como CNPJ.

**Três formas de casamento, em ordem de relevância.** A mesma busca dispara
consulta por igualdade (um único resultado), por prefixo e por conteúdo. Os
resultados entram nessa ordem e são **deduplicados por Id**: é o que faz o
registro exato aparecer no topo quando o usuário digita o nome inteiro ou cola um
documento. Busca por e-mail é a exceção e fica de fora.

**Lote de 20 com rolagem infinita**, como na seção acima. O tamanho do lote é
dimensionado para a lista visível; não é um parâmetro que se aumenta para evitar
paginar.

**O que identifica o registro na linha.** Nome sozinho não basta: Conta com
homônimos torna a escolha um chute.

| Registro | Além do nome |
|---|---|
| Usuário | **a imagem do usuário** (`AvatarUrl`) e o e-mail como linha secundária |
| Contato | ícone de Pessoa ou Empresa conforme o Tipo; razão social e documento (CPF/CNPJ formatados) como linhas secundárias |
| Outros registros | as propriedades que distinguem dois homônimos naquela entidade — código, família, responsável, data |

O trecho que casou com a busca aparece **destacado** no texto da linha, e a
ordenação é alfabética sensível ao idioma (ver a seção de ordenação acima).

**Criar o registro sem sair do campo** faz parte do padrão em Contato: quando a
busca não encontra, a lista oferece criar um Contato — Pessoa ou Empresa — com o
texto digitado como nome, respeitando a permissão do Perfil.

## Alternância de visualização

A mesma coleção costuma ter mais de uma visualização — tabela, cartões, quadro por
estágio, calendário, mapa. A escolha **persiste por usuário** e pelo recorte atual
(por exemplo, por funil): ao voltar ao módulo, reabre na última usada. Persistir
essa preferência é parte do padrão, não um extra.

## Quadro por estágio

Quando a entidade tem máquina de estados por estágio (Negócio no Funil), a
visualização em quadro traz colunas por estágio com cartões arrastáveis e
**totalizador por coluna**. Arrastar um cartão é uma mudança de estágio — está
sujeita às regras da máquina de estados, não é só reposicionamento visual. Ver
`ploomes-tech-docs:business-docs`.

## Seleção em massa

Ao selecionar múltiplos registros, aparece uma barra de ações com a contagem de
selecionados e os botões aplicáveis ao conjunto. Ações destrutivas em massa passam
por confirmação — ver [`estados-e-feedback.md`](./estados-e-feedback.md).
