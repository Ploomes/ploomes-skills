# O que a produção ensinou

Cada regra da skill marcada com **(produção)** vem de uma tela que a indicação gerou e que depois
foi para o ar. Aqui fica o motivo de cada uma, para quem for mexer na regra saber de onde ela veio.
O caso fica sem cliente: o que importa é o que aconteceu e a regra que saiu.

**Como a comparação se faz.** De um lado, o que a skill gravou em `telas/`: o
`candidatos-de-tela.md` da fase A, as especificações e os protótipos da fase C e o pedido que foi ao
construtor. Do outro, o código da tela no ar, exportado do construtor. A diferença entre os dois é
a lição.

## 1. A indicação apontou uma tela e foi para o ar outra

- Numa tela em produção, a fase A indicou os candidatos pelas travas e disse que o painel do dia de
  quem usa **não** era candidato, porque o nativo o resolvia.
- Quem pedia escolheu o painel **contra o veredito**, e uma segunda tela entrou depois, por pedido,
  sem passar pela fase A. Pouco depois as duas viraram uma tela só, com abas: a estação de trabalho
  daquele papel.
- O `candidatos-de-tela.md` escrito à mão **reprovava no portão** da própria skill: títulos
  numerados, `Sinal(is)`, evidência em subitens, seções de nota, decisão gravada fora do formato.

➜ **Regras que saíram daqui:**
- a indicação pensa por **papel**: quando os candidatos têm o mesmo "Quem usa", a proposta é uma
  mesa com uma aba por tarefa, não várias telas soltas;
- o pedido fora da indicação é registrado no formato, com `Veredito: PEDIDO`: vira aviso e não some
  do arquivo;
- o portão aceita o jeito como o arquivo é escrito de fato.

## 2. A tela opera o registro, não só mostra

- A especificação dizia "a tela não move etapa, não ganha e não perde", e cada clique levava ao
  card nativo.
- No ar, a tela faz tudo: ganhar, validando o checklist antes; perder com motivo; reabrir; duplicar;
  avançar etapa com a jornada de checklists; trocar o responsável; pedir ajuda; gerar a proposta pelo
  modelo com o PDF; e lançar o pedido no ERP. Quem usa não sai da tela.

➜ **Regra:** a fase B pergunta, para cada tela, se ela **opera o registro do começo ao fim** ou
só mostra e manda para o nativo. Operando, as regras do funil e dos checklists entram na
especificação inteiras, e o roteiro lista ganhar, perder, reabrir e duplicar.

## 3. "Sistema externo: nenhum" não durou

- Na fase B, a resposta foi "nenhum, só Ploomes".
- No ar, a tela dependia de várias integrações: o WhatsApp, o ERP, um serviço de cotação externo e
  flows do Ploomes Flows.
- Parte dos blocos foi ao ar como **"aguardando a integração"**.

➜ **Regras:**
- a fase A lê o que se sabe das integrações do cliente antes de indicar;
- a fase B pergunta por integração e por flow, não por "sistema externo";
- a especificação ganha a seção **d. Dependências e fases**: cada bloco que espera uma integração
  diz qual, e a tela abre com o estado "aguardando" em vez de esperar a integração para ir ao ar.

## 4. A camada de dados foi reescrita à mão

A camada de dados gerada pela `pacote-para-o-construtor` não foi usada: a tela foi ao ar com uma
escrita à mão, e ela trazia estes riscos:

| Risco | O que acontece |
|---|---|
| Leituras truncadas | a lista de negócios lida com `$top` fixo, sem paginação e sem filtro de status: os indicadores do mês saem de uma amostra |
| Recarga pesada | o catálogo de produtos inteiro relido a cada recarga curta |
| Sem 429 | nem 429 nem nova tentativa, numa tela que recarrega sozinha |
| Datas erradas | `LastUpdateDate` usado como data de fechamento e de "parado na etapa" |

Uma escolha do código de produção foi melhor que a nossa: ele lê campo personalizado **pelo nome**,
pela `Fields`, e não por FieldKey fixo. Na fase C, os campos que a cadeia ainda ia criar estavam no
contrato como `TOBE0001…`, chave que não existe na conta.

➜ **Regras:**
- a especificação diz, **por bloco**, quanto dado se espera e como pagina;
- a especificação diz o que precisa de data de fechamento;
- 🔴 **integração disparada pela tela é escrita no Ploomes** — um campo, uma tarefa ou um registro
  de interação — **que uma automação leva ao flow; URL de flow nunca vai ao código da tela.** O
  código da tela chega ao navegador de todo usuário que a abre, e quem tem a URL dispara o flow sem
  passar pelo Ploomes: sem a permissão do perfil, sem o registro de quem fez e sem as regras do funil;
- o campo é nomeado pelo **nome exato**, que é o que a cadeia cria.

## 5. O visual do protótipo foi copiado inteiro, e sem os tokens

- A folha de estilo do protótipo foi para o ar minificada, numa linha só.
- O CSS tinha dezenas de cores em hex e nenhum `var(--color-*)`.
- Não havia modo escuro: o CSS forçava `color-scheme: light`.
- A conta whitelabel não recoloria nada.

➜ **Regra:** o protótipo usa os tokens da base em branco do construtor
(`pacote-para-o-construtor/bancada/scaffold/src/index.css`), e o portão avisa cor fixa. O que o
protótipo define, o construtor copia.

## 6. Os ajustes da revisão eram padrão, não gosto

A revisão da tela no ar pediu uma série de ajustes. Os que valem para qualquer tela viraram regra do
protótipo:

- um seletor de contexto só (a unidade), com o filtro de responsável e o período agrupados no
  cabeçalho, no mesmo lugar em todas as abas;
- a ajuda do campo num ícone com tooltip, e não numa legenda que se confunde com o rótulo;
- campo de número que só aceita número, com teclado numérico no celular;
- campo de texto livre com sugestões do que já foi usado;
- campo com valor fixo (o "Tipo de chamado: Comercial") gravado sem aparecer;
- ação destrutiva em vermelho;
- vários registros abertos em paralelo, em abas, com uma lista lateral com busca para escolher.

## 7. O que mudou entre a indicação e o ar

| | Indicação | No ar |
|---|---|---|
| Telas | duas, soltas | uma mesa com abas, mais a ficha do registro |
| Ajuste | — | muitas rodadas de ajuste no construtor, depois uma revisão e mais alterações |
| Ações | finalizar e criar tarefa | ganhar, perder, reabrir, duplicar, avançar etapa, gerar proposta, lançar o pedido no ERP, trocar responsável |
| Integrações | nenhuma | WhatsApp, ERP, cotação externa e flows |
| Código | dois protótipos de arquivo único | milhares de linhas, com uma só aba maior que os dois protótipos juntos |
