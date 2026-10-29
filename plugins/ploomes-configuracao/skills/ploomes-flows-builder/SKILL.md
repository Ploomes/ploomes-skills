---
name: "ploomes-flows-builder"
description: "Gera o JSON de importação de um flow do Ploomes Flows a partir de um pedido em linguagem natural — por padrão em modo genérico, sem valor de conta embutido, que importa limpo e falha no primeiro disparo listando o que falta preencher. Traz o catálogo das peças (Ploomes, Sankhya e utilitários), as regras do motor que quebram flows, a arquitetura de referência e exige gerador por script, checagem estática e simulação dos steps de código antes da entrega. Não altera o schema da conta e não embute senha. Use para \"cria um flow que, a cada proposta criada no Ploomes, cria um orçamento no Sankhya\", \"monta o template de importação desse flow\" ou \"revisa este export de flow\"."
---

# Construtor de flows do Ploomes Flows

Gera o template de importação (`.json`) do **Ploomes Flows** — o Activepieces embarcado no
Ploomes. Tudo aqui foi lido de **exportação real da
plataforma** ou confirmado em execução, em 18/09/2026, salvo o que está explicitamente
marcado como vindo de documentação (§6.1). Revisto em 21/09/2026.

**Regra que governa a skill inteira:** o que não está neste arquivo é DESCONHECIDO. Não
complete por analogia — nem nome de ação, nem prop, nem rota. Os nomes de ação da plataforma
**não seguem padrão único**: convivem `snake_case`, `camelCase`, `kebab-case` e nomes em
português com rótulo em inglês (`Win Deal` → `ganhar_negocio`). Deduzir erra. Copie das
tabelas de §5 ou descubra (§10).

---

## 1. Gate de geração

Antes de qualquer coisa, decida em qual dos dois modos o pedido está. **O default é o
genérico.**

**Modo genérico — default.** O pedido descreve um comportamento, não um ambiente: "a cada
Proposta criada no Ploomes, criar um Orçamento no Sankhya". Ninguém nomeou conta, conexão
nem constante. Aqui a skill **gera** — não bloqueia, não interroga constante por constante.
Todo valor de ambiente vira placeholder inerte (§1.1) e o template sai **importável e
não-executável**: ele falha no primeiro disparo listando exatamente o que falta preencher.

**Modo conta conhecida.** O usuário nomeou a conta e tem os valores em mãos, ou colou um
export daquela conta. Os valores entram literalmente e a guarda de destino (§8.2) vira
parada dura de verdade.

Nos dois modos, gere sem perguntar quando o flow usar apenas o que está catalogado em §5 —
os gatilhos, os utilitários, as ações do Ploomes e as ações do Sankhya listadas — mais os
nós nativos **Código**, **Roteador** e **Loop em itens**. Qualquer peça, ação ou prop fora
de §5 → §10 antes de gerar.

**O que não tem default seguro.** Antes de virar placeholder, todo valor de ambiente passa
pelo teste de §1.2 — **resolver em runtime vem primeiro, perguntar vem segundo, placeholder é
o último recurso**. Os candidatos habituais:

- **ids de conexão** (§5.1) — nunca resolvíveis; sempre placeholder de conexão;
- **FieldKeys** dos campos personalizados envolvidos — quase sempre resolvíveis em runtime
  por `/Fields`, inclusive criando o campo quando ele não existe;
- no Sankhya, as constantes obrigatórias do Sankhya
  (`CODEMP`, `CODTIPOPER`, `CODTIPVENDA`, `CODVEND`, `CODLOCALORIG`, `CODCID`) — algumas são
  resolvíveis a partir do próprio registro de origem, outras não; §1.2 decide caso a caso.

**O que NÃO entra por padrão: guarda de conta de destino.** Não gere, por iniciativa própria,
nós que leiam `GET /Account` para comparar `Id` ou `Name` com um valor declarado. Quem importa
o template importa na própria conta, e é a **conexão** escolhida no editor que determina onde
o flow escreve — a comparação não acrescenta segurança, e cobra dois placeholders a mais e uma
parada dura no primeiro disparo em troca disso. Inclua a guarda **apenas** se o usuário pedir,
e então trate os dois valores como valores de ambiente comuns.

> **Proibição que vale nos dois modos.** Valor de ambiente de UMA conta nunca vira default,
> exemplo ou sugestão para OUTRA. Id de conexão, Account Id/Name, `CODEMP`, `CODTIPOPER`,
> FieldKey e afins lidos de um export anterior pertencem àquela conta e a mais nenhuma.
> Oferecer "reuso" do id de outra conta é pior do que deixar o campo vazio: o template
> importa, roda e escreve no lugar errado, sem erro nenhum. Export de outra conta serve para
> descobrir **contrato** (§10) — nome de prop, forma de payload —, nunca **valor**.

### 1.1 Convenção de placeholder

| O que | Forma |
|---|---|
| escalar de ambiente | `<<PREENCHER:CODEMP>>` |
| id de conexão | `{{connections['PREENCHER_ID_CONEXAO_PLOOMES']}}` |
| FieldKey | string vazia `""` |

Três regras, e são elas que separam template genérico de flow quebrado:

1. **Placeholder é inerte, nunca plausível.** `0`, `1`, `1001`, `UN`, datas e nomes de
   exemplo estão proibidos como valor de partida — o flow roda com eles e produz lançamento
   errado em silêncio. `<<PREENCHER:...>>` não roda.
   O critério por trás da regra é **como o erro aparece**: um valor de partida só é aceitável
   quando estar errado **falha ruidosamente** (nome de entidade que o gateway recusa com
   `$error`, rota que devolve 404). Quando estar errado **grava em silêncio** — um código de
   cidade, de empresa, de operação, uma coluna `*Value` — não existe valor de partida
   aceitável: ou o flow resolve, ou você pergunta.
2. **Um nó de parâmetros valida e lança.** O primeiro nó `CODE` do flow recebe todos os
   valores de ambiente como `input` e lança listando os que continuam vazios ou com o
   prefixo `<<PREENCHER`. É isso que torna o template seguro: importa limpo, falha no
   primeiro disparo, com a lista exata do que preencher.
3. **Placeholder só no nó de parâmetros.** Nenhum outro nó carrega valor de ambiente; todos
   leem `{{step_N.<campo>}}` daquele nó. Um lugar para preencher, um lugar para conferir.

Conexão com placeholder não resolve no import e o editor pede ao usuário que escolha uma —
é o comportamento desejado, não um defeito.

Quando a coluna de gravação de um campo personalizado depender do tipo dele
(`StringValue` × `IntegerValue` × …), ela também é parâmetro validado: coluna errada é
gravada em silêncio e o valor não aparece na tela.

### 1.2 Valor de ambiente: resolver, perguntar, e só então placeholder

Placeholder é dívida: alguém tem de descobrir o valor, digitar certo e manter atualizado. Antes
de criar um, percorra esta escada **nesta ordem** e pare no primeiro degrau que funcionar.

**Degrau 1 — o flow resolve sozinho.** Pergunte-se de onde um humano tiraria esse valor. Se a
resposta for "olhando outro dado que o flow já tem ou já pode ler", o flow faz o mesmo:

- do **registro que disparou** o flow ou de uma leitura dele (a cidade do Cliente, a moeda da
  Proposta, o vendedor do Negócio);
- de uma **leitura de cadastro no sistema de destino** casando por um atributo que o registro
  de origem carrega (`CODCID` pelo nome da cidade e a UF; `CODVEND` pelo apelido do vendedor);
- de **metadados da própria plataforma** (`/FieldsEntities`, `/Fields`, `/FieldsTypes`, ou
  `GET /gateway/metadata/{Entidade}` no Sankhya);
- de um **campo personalizado** que a operação já preenche no CRM.

Resolver em runtime tem três regras inegociáveis:

1. **Sem fallback silencioso.** Se a busca devolver zero ou mais de um resultado, o nó de
   código **lança**, com a mensagem dizendo o que procurou, onde, e o que fazer. Cair num
   valor "padrão" quando o de-para não resolveu é exatamente como se cria lançamento no
   lugar errado.
2. **Resolva só no caminho que precisa.** Quando o valor só é usado na criação, a busca fica
   no ramo de criação (um loop de 0 ou 1 item), não no topo do flow: quem só atualiza não
   paga a chamada.
3. **O relatório final diz o que foi resolvido e de onde.** Valor descoberto em runtime que
   não aparece no relatório é valor que ninguém consegue auditar depois.

**Degrau 2 — pergunte a quem pediu o flow.** Se não houver caminho **confirmado** de
resolução — nenhum dado de origem serve de chave, ou a rota/entidade necessária não está em
§5, em §6/§7 ou nas skills de conhecimento —, **não gere ainda**. Pergunte, e ofereça as
saídas reais:

- o usuário **informa o valor agora** (vira literal; o template passa a ser de conta conhecida
  e isso é dito na entrega);
- o campo **não é enviado**, e o sistema de destino recusa se exigir — o erro do ERP é a
  resposta, e é uma escolha legítima quando ninguém sabe o valor;
- o usuário **aponta onde o valor mora** (um campo, um cadastro, uma rota), e aí você volta
  ao degrau 1 e resolve.

Perguntar vale também quando existe um caminho **plausível mas não confirmado**: diga que ele
é plausível, diga o que não está confirmado, e deixe o usuário decidir entre confirmar o
identificador, aceitar a tentativa com parada dura, ou seguir por outra saída.

**Degrau 3 — placeholder.** Só depois de a pergunta ter sido feita e o usuário ter escolhido
essa saída, ou quando ele não está presente para responder. Nesse último caso, a entrega diz,
em texto, **qual pergunta ficou sem resposta** — não basta listar o campo a preencher.

Nunca pule direto para o degrau 3 porque é mais rápido. Um template cheio de placeholders é um
template que ninguém consegue importar sem uma segunda conversa.

### 1.3 O flow não altera o schema da conta

Resolver em runtime (§1.2, degrau 1) é **ler**. Nunca escrever estrutura. Um flow não cria,
não edita e não apaga campo personalizado, formulário, funil, etapa, tipo, marcador ou
qualquer outro objeto de configuração — nem "só se não existir". Concretamente, estas rotas
**não entram num flow**: `POST`/`PATCH`/`DELETE` em `/Fields`, `/FormsFields`, `/Forms`,
`/FieldsEntities`, `/DealsPipelines`, `/DealsStages`, `/ContactsTypes`.

O motivo decisivo é concorrência, e não estilo. O gatilho é por registro: dois registros
criados no mesmo instante disparam duas execuções que leem "o campo não existe" antes de
qualquer uma escrever, e as duas criam. `POST /Fields` não é idempotente, a doc é explícita
que um segundo POST gera duplicata, e não há como fechar essa janela de dentro do flow.
Detectar a duplicidade na execução seguinte não adianta: o schema da conta já foi sujo.

Os outros custos vêm junto: DDL a cada disparo contra um teto de ~120 req/min compartilhado;
a conexão precisando de permissão de schema pela vida inteira do flow em vez de só escrita de
dado; um campo aparecendo na conta sem nenhum admin ver de onde veio; e a recuperação de
falha parcial — campo criado, chave perdida, "não reexecute" — caindo sobre quem só queria
que o flow rodasse.

**O que fazer no lugar.** O objeto de configuração é criado **antes**, uma vez, fora do flow —
pela tela, por MCP, ou pelas chamadas da skill `ploomes-tech-docs:api-docs`. O flow então:

- **resolve por leitura** o identificador que precisa (`GET /Fields?$filter=Name eq '<nome>'`,
  desempatando pelo prefixo de entidade da `Key`), e **para** com mensagem acionável se não
  achar; ou
- recebe a chave por parâmetro, quando o usuário preferir zero chamadas.

Prefira resolver por leitura sempre que o valor **grava em silêncio** quando errado (§1.1) —
e `FieldKey` é exatamente esse caso: chave ou coluna errada em `OtherProperties` é aceita com
HTTP 200, o valor entra no banco e não aparece na tela. Parâmetro cru ali é uma falha muda.

Quando a geração depender de um objeto que ainda não existe, a entrega traz **as chamadas de
criação prontas para rodar uma vez**, separadas do template, e o changelog abre dizendo que
elas são pré-requisito.

---

## 2. Envelope do template

```json
{
  "name": "...", "type": "SHARED", "summary": "", "description": "",
  "tags": [], "blogUrl": "",
  "metadata": { "externalId": "<nanoid de 21 chars>" },
  "author": "...", "categories": [],
  "pieces": ["@activepieces/piece-manual-trigger", "@activepieces/piece-ploomes"],
  "flows": [{ "displayName": "...", "trigger": { ... }, "valid": true,
              "schemaVersion": "21", "notes": [] }],
  "status": "PUBLISHED"
}
```

- `pieces[]` lista **exatamente** as peças usadas. Declarar peça inexistente derruba o import
  com `FST_ERR_VALIDATION` / `body/ Invalid input`.
- `schemaVersion` é a string `"21"`.
- Gravar **UTF-8 sem BOM**. Com BOM o arquivo não é aceito.
- `status` reflete o estado real do flow na hora da exportação.

---

## 3. Os cinco tipos de nó

Todo nó carrega `name`, `type`, `valid: true`, `displayName`, `lastUpdatedDate` (ISO) e
`settings`. `name` é `step_N`, único no flow; o gatilho chama-se `trigger`.

| `type` | chaves de `settings` |
|---|---|
| `PIECE_TRIGGER` | `pieceName` · `pieceVersion` · `triggerName` · `input` · `propertySettings` |
| `PIECE` | `pieceName` · `pieceVersion` · `actionName` · `input` · `propertySettings` · `errorHandlingOptions` |
| `CODE` | `input` · `sourceCode` · `errorHandlingOptions` |
| `LOOP_ON_ITEMS` | `items` (+ `firstLoopAction` fora de `settings`) |
| `ROUTER` | `branches` · `executionType` (+ `children` fora de `settings`) |

`errorHandlingOptions` existe **só** em `PIECE` e `CODE` — nunca no gatilho, no loop ou no
roteador. `propertySettings` é `{}` na maioria dos nós.

### CODE

```json
{ "name": "step_1", "type": "CODE", "valid": true,
  "settings": { "input": { "chave": "valor ou {{step_N.campo}}" },
    "sourceCode": { "code": "export const code = async (inputs) => { ... };",
                    "packageJson": "{\"dependencies\":{}}" },
    "errorHandlingOptions": { "retryOnFailure": { "value": false },
                              "continueOnFailure": { "value": false } } },
  "displayName": "...", "lastUpdatedDate": "..." }
```

Funções auxiliares podem viver no topo do módulo, antes do `export`. `fetch()` não está
disponível no sandbox — se precisar de HTTP dentro do código, declare `axios` em
`packageJson`; melhor ainda, use um nó HTTP ou a peça do sistema.

### LOOP_ON_ITEMS

```json
{ "name": "step_6", "type": "LOOP_ON_ITEMS", "valid": true,
  "settings": { "items": "{{step_5.paginas}}" },
  "firstLoopAction": { ...um nó... },
  "displayName": "...", "lastUpdatedDate": "..." }
```

`items` aceita expressão **ou string JSON literal**: `"[{\"id\":1},{\"id\":2}]"`.

### ROUTER

```json
{ "name": "step_19", "type": "ROUTER", "valid": true,
  "settings": {
    "executionType": "EXECUTE_FIRST_MATCH",
    "branches": [
      { "branchName": "Tem o que criar", "branchType": "CONDITION",
        "conditions": [[
          { "operator": "NUMBER_IS_GREATER_THAN", "firstValue": "{{step_18.total}}", "secondValue": "0" }
        ]] },
      { "branchName": "Otherwise", "branchType": "FALLBACK" } ] },
  "children": [ { ...nó do ramo 0... }, null ],
  "displayName": "...", "lastUpdatedDate": "..." }
```

- `children` é **posicional** e tem o mesmo comprimento de `branches`, **contando o ramo
  `FALLBACK`**. Ramo sem ação é `null`.
- `conditions` é **lista de listas**: a externa é OU, a interna é E.
- `caseSensitive` só aparece nos operadores de texto.
- O ramo `FALLBACK` não tem `conditions`.
- Operadores vistos em exportação: `TEXT_CONTAINS`, `TEXT_EXACTLY_MATCHES`,
  `NUMBER_IS_GREATER_THAN`, `DATE_IS_AFTER`. Outros: DESCONHECIDOS.
- `executionType` confirmado: `EXECUTE_FIRST_MATCH`.

### Encadeamento

Sequência por `nextAction` aninhado. Dentro de um loop, por `firstLoopAction` e daí
`nextAction`. Dentro de um ramo, por `children[i]` e daí `nextAction`.

---

## 4. Regras do motor — a parte que quebra flows

**4.1 Um step dentro de um loop não enxerga a saída da volta anterior.** `{{step_X}}` de um
irmão do mesmo loop resolve para a iteração **atual**, que ainda não rodou. Chega vazio.
Esquema de "olhar a página anterior para decidir se continua" **não funciona** e vira
`continuar: true` para sempre.

➜ Consequência de projeto: **feche o número de voltas ANTES do loop.** Faça uma sondagem,
calcule o plano de páginas em um nó de código e passe a lista pronta para `items`. Nada de
guarda de parada dentro do loop.

**4.2 Saídas de dentro do loop lidas de fora: `{{step_LOOP.iterations}}`.** Devolve um array
com `{ index, item, <nomeDoStep>: <saída> }` por iteração. Só é confiável **depois** que o
loop terminou — pedir de dentro do próprio loop devolve array incompleto.

**4.3 Nunca coloque um roteador dentro de um loop.** A saída do step de leitura fica
aninhada sob o ramo e a profundidade em `iterations` deixa de ser previsível. O step de
leitura deve ser o `firstLoopAction` **direto**, para que a saída fique em
`iterations[i].step_X`.

**4.4 Expressões por tipo de prop:**

| Prop | Expressão? | Observado |
|---|---|---|
| `url.url` | **sim** | `/Products({{step_34.item.ProductId}})` funciona |
| `body.data` | **sim** | `{{step_30.item}}` resolve para objeto |
| `queryParams.*` | **sim** | `$skip`, `$top` |
| `offsetPage` (numérico) | **sim** | `{{step_11.item}}` funciona |
| `method` (enum) | **NÃO** | mantenha literal. Precisa de dois métodos? dois ramos, cada um com o seu |
| prop de lista (`fields`, `filters`, `cabecalho`, `itens`) | **não confirmado** | expressão resolvendo para array não foi vista em export real — se usar, declare como ponto em aberto |

**4.5 `{{step_N.item}}` e `{{step_N.index}}`** só de dentro do loop `step_N`. O `index` é
1-based.

**4.6 Props dinâmicas: o filho só existe depois do pai.** Campo condicional não é
serializado enquanto o campo pai não tiver o valor que o habilita. Definir o pai primeiro, e
nunca emitir o filho sem o pai — o motor descarta.

| Peça | Pai | Valor | Filho |
|---|---|---|---|
| `piece-http` | `authType` | `BASIC` | `authFields` {`username`,`password`} |
| `piece-http` | `use_proxy` | `true` | `proxy_settings` {`proxy_host`,`proxy_port`,`proxy_username`,`proxy_password`} |
| `piece-webhook` (gatilho) | `authType` | `basic` | `authFields` {`username`,`password`} |

**4.7 Três mecanismos de falha diferentes, não confundir:** `errorHandlingOptions` (do nó,
vale para qualquer PIECE/CODE) · `failsafe` booleano (peças Ploomes e Sankhya) ·
`failureMode` enum (peça HTTP genérica). Coexistem no mesmo flow.

**4.8 Forma de saída não é contrato.** A saída de `query_records`, dos gatilhos e das ações
de leitura **não está confirmada em export**. Nó de código que consome leitura deve
normalizar antes de usar: aceitar array puro, `value`, `items`, `records`, `data`, `result`
e envelope `body` aninhado, e tratar registro único que vem como objeto em vez de array. É
barato e evita a classe inteira de falha "veio no formato de sempre, menos desta vez".

---

## 5. Catálogo de peças — copiar, nunca deduzir

### 5.1 Conexão

Toda ação e todo gatilho de Ploomes e Sankhya têm a prop `auth`:

```json
"auth": "{{connections['ID_DA_CONEXAO']}}"
```

O que está entre aspas é o **Id da conexão**, não o nome. É específico da conta e da conexão.
**Nunca inventar e nunca importar de outra conta** (§1): ou vem de um export da própria
conta / do usuário, ou é placeholder (§1.1). As peças de utilitário (§5.5) não têm `auth`.

O header de autorização é injetado pela conexão. **Nunca** escrever `client_secret`,
`X-Token`, Bearer ou senha em texto claro em nó, log ou resposta — ver §11.

### 5.2 Gatilhos

| Peça | Versão | `triggerName` | `input` |
|---|---|---|---|
| `piece-manual-trigger` | 0.0.7 | `manual_trigger` | `{}` · `propertySettings: {"markdown":{"type":"MANUAL"}}` |
| `piece-webhook` | 0.1.41 | `catch_webhook` | `authType` (`none`/`basic`/header/hmac), `authFields` |
| `piece-schedule` | 0.1.22 | `every_x_minutes` | `minutes` (inteiro 1–59) — única prop |
| `piece-schedule` | 0.1.22 | `every_day` | `timezone`, `hour_of_the_day`, `run_on_weekends` |
| `piece-ploomes` | 0.0.7 | `record_event` | `auth`, `entity` (chave em inglês: `Contacts`, `Deals`, `Products`, `Quotes`, `Orders`, `Tasks`, `Leads`…), `event` (**número**: 1 Created · 2 Updated · 3 Deleted) |

A peça Sankhya **não tem gatilho**.

> **A forma da saída de `record_event` não está confirmada em export real, e o payload de
> saída do webhook do Ploomes não está documentado em lugar nenhum** — verificado na
> `ploomes-tech-docs:api-docs` em 22/09/2026: a doc cobre o cadastro do webhook
> (`/Webhooks`, `CallbackUrl`, `ActionId`) e a supressão (`?webhooks=false`), e **não** traz
> nenhuma chave do corpo do callback, nem onde fica o `Id`, nem se o formato muda entre
> Created, Updated e Deleted. Relatos de campo dizem que o registro chega aninhado sob `New`;
> isso é relato, não contrato, e não deve ser tratado como tal.
>
> Por isso, **nunca amarre a leitura do gatilho a um caminho único** — nem `{{trigger.Id}}`,
> nem `{{trigger.New.Id}}`. Use a sonda de §5.2.1.

#### 5.2.1 Sonda de gatilho — obrigatória em todo flow com gatilho de evento

Um caminho único de gatilho é a falha mais cara do template: importa limpo, passa na checagem
estática, e só morre em execução com o valor chegando vazio. Pior, a correção é por tentativa
e erro, uma execução de cada vez.

A sonda troca isso por **uma** execução que já diz a resposta. O nó de parâmetros recebe o
objeto bruto do gatilho **e** os caminhos candidatos, todos de uma vez:

```json
"gatilhoBruto":     "{{trigger}}",
"idTrigger":        "{{trigger.Id}}",
"idTriggerNew":     "{{trigger.New.Id}}",
"idTriggerBodyNew": "{{trigger.body.New.Id}}",
"idTriggerBody":    "{{trigger.body.Id}}"
```

O código do nó:

1. percorre os candidatos **na ordem** e fica com o primeiro que for inteiro positivo;
2. **descarta o que voltar como texto contendo `{{`** — é expressão que o motor não resolveu,
   não é valor;
3. se nenhum resolver, faz uma busca **conservadora** no objeto bruto: só sob chaves de
   contêiner conhecidas (`New`, `Record`, `Entity`, `Data`, `body`), profundidade máxima 2, e
   o objeto encontrado precisa ter `Id`. Nunca varra o payload atrás de qualquer `Id` — você
   acha o `Id` do dono, do funil ou da etapa e escreve no registro errado;
4. se ainda assim nada resolver, **lança** imprimindo o que chegou em cada slot (truncado) e
   as chaves de topo do objeto bruto. É esse texto que fecha a questão de uma vez;
5. devolve, junto do Id, **qual caminho resolveu**, e o relatório final publica isso.

Depois da sonda, o flow não precisa ser editado quando o formato variar entre contas ou
mudar de versão: o resolvedor acha sozinho. E quando o payload real for capturado, o caminho
confirmado vira o primeiro candidato — a sonda continua como rede.

**A rede de segurança que torna isso seguro:** o step seguinte relê o registro por
`Id eq <resolvido>` e lança se não encontrar. Um Id errado morre ali, antes de qualquer
escrita. Todo flow com sonda de gatilho precisa dessa releitura — sem ela, a sonda vira
adivinhação com poder de gravar.

> **Entidade criada nem sempre nasce completa.** No Ploomes, Proposta, Venda e Negócio são
> criados como esqueleto e recebem itens e campos depois, pela tela. Gatilho no evento
> `1 Created` dispara no instante do esqueleto. Quando o flow depende dos filhos, isso
> precisa de tratamento explícito — atraso, campo de controle marcado pelo usuário, evento
> `2 Updated` com guarda, ou agenda — e o desenho escolhido tem de ser dito ao usuário, com
> o custo de cada um.

### 5.3 Peça Ploomes — `@activepieces/piece-ploomes` v0.0.7

32 ações. Rótulo do catálogo em inglês; sete `actionName` em português.

| Rótulo | `actionName` | `input` (além de `auth`) |
|---|---|---|
| Create Contact | `create_contact` | `name`, `email`, `phone`, `typeId`, `ownerId`, `originId`, `companyId`, `customFields` |
| Find Contacts | `find_contact` | `id`, `name`, `top`, `advancedFilter`, `customFieldFilters` |
| Update Contact | `update_contact` | `contactId`, `name`, `email`, `ownerId`, `originId`, `customFields` |
| Delete Contact | `delete_contact` | `contactId` |
| Create Deal | `create_deal` | `title`, `amount`, `contactId`, `ownerId`, `originId`, `pipelineId`, `stageId`, `currencyId`, `customFields` |
| Find Deals | `find_deal` | `id`, `title`, `top`, `advancedFilter`, `customFieldFilters` |
| Update Deal | `update_deal` | `dealId`, `title`, `amount`, `ownerId`, `pipelineId`, `stageId`, `customFields` |
| Delete Deal | `delete_deal` | `dealId` |
| Win Deal | **`ganhar_negocio`** | `dealId` |
| Lose Deal | **`perder_negocio`** | `dealId`, `lossReasonId` |
| Reopen Deal | **`reabrir_negocio`** | `dealId` |
| Create Task | `create_task` | `title`, `typeId`, `dateTime`, `dealId`, `contactId`, `userIds[]`, `ownerIds[]` |
| Find Tasks | `find_task` | `title`, `dealId`, `top` |
| Find Task by Id | **`get_task`** | `taskId` |
| Update Task | `update_task` | `taskId`, `title`, `dateTime` |
| Delete Task | `delete_task` | `taskId` |
| Complete Task | `complete_task` | `taskId` |
| Create Product | `create_product` | `name`, `code`, `price`, `groupId`, `currencyId`, `customFields` |
| Find Products | `find_product` | `id`, `name`, `top`, `advancedFilter`, `customFieldFilters` |
| Update Product | `update_product` | `productId`, `name`, `price`, `customFields` |
| Delete Product | `delete_product` | `productId` |
| Create Quote | `create_quote` | `dealId`, `documentTemplateId`, `currencyId`, `customFields` |
| Find Quotes | `find_quote` | `id`, `dealId`, `top`, `advancedFilter`, `customFieldFilters` |
| Update Quote | `update_quote` | `quoteId`, `currencyId`, `customFields` |
| Delete Quote | `delete_quote` | `quoteId` |
| Add Product to Quote | `add_product_to_quote` | `quoteId`, `productId`, `quantity`, `unitPrice`, `sectionName` |
| Create Sale | **`create_venda`** | `dealId`, `contactId`, `date`, `stageId`, `discount`, `orderNumber`, `currencyId`, `documentTemplateId`, `customFields` |
| Find Sales | **`find_venda`** | `id`, `dealId`, `top`, `advancedFilter`, `customFieldFilters` |
| Update Sale | **`update_venda`** | `vendaId`, `stageId`, `discount`, `currencyId`, `customFields` |
| Delete Sale | **`delete_venda`** | `vendaId` |
| Query Records (OData) | `query_records` | `resource`, `filter`, `select`, `expand`, `orderBy`, `top`, `skip`, `count` |
| Custom API Call | `custom_api_call` | `url`, `method`, `headers`, `queryParams`, `body`, `body_type`, `timeout`, `failsafe`, `followRedirects`, `response_is_binary` |

**`customFields` e `customFieldFilters`** são mapa plano `{"<FieldKey>": valor}` — não é
`OtherProperties`. O prefixo é a entidade: `deal_`, `product_`, `contact_`, `quote_`,
`order_`. As chaves mudam por conta: pergunte ou deixe placeholder, nunca invente.

**`query_records`** é a leitura de coleção de primeira classe. `skip` e `top` são props
numéricas próprias — paginação sem montar querystring e sem esbarrar no 405 do
`/Products/GetV2` (§6).

**`custom_api_call`:**

```json
{ "url": { "url": "/Products" },
  "auth": "{{connections['<id>']}}",
  "body": { "data": { "Name": "..." } },
  "method": "POST",
  "headers": { "Content-Type": "application/json" },
  "queryParams": {}, "body_type": "json",
  "timeout": 30, "failsafe": false,
  "followRedirects": true, "response_is_binary": false }
```

- `url` é **objeto aninhado**. String plana é descartada em silêncio e o campo volta ao
  default `https://api2.ploomes.com`.
- `body` é `{}` com `body_type: "none"`; é `{"data": {...}}` com `body_type: "json"`.
- `method`: `GET`, `POST`, `PATCH`, `PUT`, `DELETE`, `HEAD` — literal, nunca expressão.
- Resposta: `{ status, headers, body }`, às vezes o corpo direto. Trate os dois.

**Não coberto por ação dedicada:** Leads, registro de interação, anexo, produto do cliente,
lista de produtos, usuário, marcador, campo/formulário. Os `update_*` também são parciais —
`update_contact` não altera `phone`, `companyId` nem `typeId`; `update_product` não altera
`code`, `groupId` nem `currencyId`.

### 5.4 Peça Sankhya — `@activepieces/piece-sankhya` v0.0.2

16 ações. **Não tem gatilho e não tem nenhuma ação de exclusão.** A entidade é **fixa por
ação** — não existe prop de entidade. Todas têm `auth` e `environment`
(`production` | `sandbox`).

| Rótulo | `actionName` | `input` (além de `auth` e `environment`) |
|---|---|---|
| Criar Parceiro | `create_parceiro` | `fieldValues[]` |
| Editar Parceiro | `edit_parceiro` | `pk[]`, `fieldValues[]` |
| Ler Parceiro | `read_parceiro` | `fields[]`, `filters[]`, `offsetPage` |
| Criar Contato de Cliente | `create_contato_cliente` | `fieldValues[]` |
| Editar Contato de Cliente | `edit_contato_cliente` | `pk[]`, `fieldValues[]` |
| Ler Contato de Cliente | `read_contato_cliente` | `fields[]`, `filters[]`, `offsetPage` |
| Criar Produto | `create_produto` | `fieldValues[]` |
| Editar Produto | `edit_produto` | `pk[]`, `fieldValues[]` |
| Ler Produto | `read_produto` | `fields[]`, `filters[]`, `offsetPage` |
| Criar Grupo de Produto | `create_grupo_produto` | `fieldValues[]` |
| Editar Grupo de Produto | `edit_grupo_produto` | `pk[]`, `fieldValues[]` |
| Ler Grupo de Produto | `read_grupo_produto` | `fields[]`, `filters[]`, `offsetPage` |
| Ler Cabeçalho de Nota | `read_cabecalho_nota` | `fields[]`, `filters[]`, `offsetPage` |
| Ler Item de Nota | `read_item_nota` | `fields[]`, `filters[]`, `offsetPage` |
| Criar Documento | `criar_documento` | `cabecalho[]`, `itens[]`, `informarPreco` |
| Custom API Call | `custom_api_call` | igual ao Ploomes, mas com **URL absoluta** |

Formas dos arrays — a peça abstrai o `f0..fN` posicional com `{"$": v}` da API crua:

```json
"fieldValues": [{"field":"NOMEPARC","value":"..."}, {"field":"ATIVO","value":"S"}]
"pk":          [{"field":"CODPARC","value":"99001"}]
"fields":      [{"field":"CODPROD"}, {"field":"DESCRPROD"}]
"filters":     [{"field":"ATIVO","operator":"=","value":"S","type":"S"}]
```

- `filters[].operator`: `=`, `<>`, `>`, `<`, `LIKE`. **Não há `IN`** — casar uma lista de
  chaves exige uma leitura por chave, ou trazer o conjunto e filtrar em memória.
- `filters[].type`: **só** `S` (texto) e `I` (número). Não há tipo de data — data vai como
  texto.
- **`offsetPage` é a única prop de paginação. Não existe tamanho de página** — quem decide é
  o servidor (observado: 50). O plano de páginas só sai do `total` mais o tamanho
  **observado** na primeira leitura.
- `criar_documento` tem duas metades com formatos diferentes: `cabecalho` é lista de
  `{field, value}`; `itens` é lista de **objetos crus** com o nome da coluna como chave
  (`{"CODPROD":"70001","QTDNEG":"2","VLRUNIT":"150.50","CODVOL":"UN","CODLOCALORIG":"101"}`).
  Data no cabeçalho como texto `DD/MM/AAAA`. Se a peça injeta ou não o `NUNOTA` vazio e o
  `DHTIPOPER` do envelope cru **não está confirmado em export** — declare como ponto em
  aberto e trate como primeiro suspeito quando o lançamento falhar.

**Forma da resposta de leitura:**

```json
{ "status": "1",
  "responseBody": { "entities": {
      "total": "294", "hasMoreResult": "true",
      "entity": [ { "f0": { "$": "123" }, "f1": { "$": "Produto" } } ] } } }
```

- Campos vêm **posicionais** (`f0..fN`), na ordem do `fields` configurado. Escalares vêm
  embrulhados em `{ "$": valor }`.
- `entity` pode vir como objeto único quando há um só registro — normalize para array.
- **O Sankhya responde HTTP 200 com erro no corpo.** Cheque `status !== "1"`,
  `statusMessage` e `$error` sempre.

### 5.5 Utilitários

Sem `auth`. Nomes de ação sem padrão único — copiar literalmente.

| Peça | Versão | `actionName` → `input` |
|---|---|---|
| `piece-delay` | 0.3.34 | `delayFor` → `delayFor`, `unit` (`seconds`/`minutes`/`hours`/`days`) · `delay_until` → `delayUntilTimestamp` |
| `piece-http` | 0.11.19 | `send_request` → `url`, `method`, `headers`, `queryParams`, `body`, `body_type`, `authType`, `authFields`, `timeout`, `followRedirects`, `failureMode`, `response_is_binary`, `use_proxy`, `proxy_settings` |
| `piece-webhook` | 0.1.41 | `return_response` → `fields`{`status`,`headers`,`body`}, `respond`, `responseType` |
| `piece-store` | 0.6.20 | `put` · `get` · `remove_value` · `append` · `add_to_list` · `remove_from_list` → `key`, `value`, `store_scope` (rótulo "Project" ⇒ valor `COLLECTION`), mais `defaultValue`/`separator`/`ignore_if_exists` conforme a ação |
| `piece-text-helper` | 0.6.5 | `concat` · `replace` · `split` · `find` · `find_all` · `markdown_to_html` · `html_to_markdown` · **`stripHtml`** · `slugify` · **`defaultValue`** · `json_to_ascii_table` · `extract_from_html` |
| `piece-date-helper` | 0.1.34 | `get_current_date` · `format_date` · `extract_date_parts` · `date_difference` · `add_subtract_date` · `next_day_of_week` · `next_day_of_year` · `first_day_of_previous_month` · `last_day_of_previous_month` |
| `piece-math-helper` | 0.0.30 | `addition_math` · `subtraction_math` · `multiplication_math` · `division_math` · `modulo_math` · **`generateRandom_math`** → `first_number`, `second_number` |
| `piece-csv` | 0.4.21 | `convert_csv_to_json` · `convert_json_to_csv` · `convert_excel_to_csv` |
| `piece-json` | 0.1.12 | `convert_json_to_text` · `convert_text_to_json` · `run_jsonata_query` · `merge_json` |
| `piece-xml` | 0.1.20 | **`convert-json-to-xml`** · **`convert-xml-to-json`** (kebab-case) |
| `piece-file-helper` | 0.1.30 | `read_file` → `file`, `readOptions` (`text`/`base64`) |

> ⚠️ **`piece-store` é contestado.** Um flow exportado em 14/09/2026 registra que declarar
> `piece-store` em `pieces[]` derrubou o import com `FST_ERR_VALIDATION`, e conclui que
> storage não existe na plataforma. O catálogo acima vem de 18/09/2026. Enquanto o conflito
> não for resolvido por um import bem-sucedido, **não apoie idempotência nem estado
> persistido só no store**: prefira gravar o estado numa entidade do próprio CRM (campo
> personalizado com o Id do documento externo), que além de não depender da peça deixa o
> vínculo visível para o usuário.

Enums confirmados: HTTP `method` `GET/POST/PATCH/PUT/DELETE/HEAD` · HTTP `authType`
**maiúsculo** (`BASIC`) enquanto o gatilho webhook usa **minúsculo** (`basic`) · HTTP
`body_type` `none`/`form_data`/`json`/`raw` · webhook `responseType` `json`/`raw`/`redirect`.

---

## 6. API do Ploomes — roteamento e correções

**Ordem de escolha, sempre nesta sequência:**

1. **ação dedicada** da peça (§5.3), quando existir;
2. **`query_records`** para leitura de coleção — tem `filter`, `select`, `expand`, `orderBy`,
   `top`, `skip` e `count` como props próprias;
3. **`custom_api_call`** para todo o resto: escrita fora das ações dedicadas, rota especial,
   `PATCH` em campo que a ação dedicada não cobre.

Antes de escrever uma chamada em `custom_api_call`, validar rota e método na skill
`ploomes-tech-docs:api-docs` e, se preciso, na documentação pública
(https://developers.ploomes.com/). Não improvisar rota.

Correções comprovadas em execução, que **prevalecem** sobre a referência interna:

| Fato | Detalhe |
|---|---|
| `PATCH /Products({Id})` **existe** | O `endpoints/_index.md` lista `/Products` só com GET/POST/DELETE — está incompleto. O `data-models/product.md` marca os campos como `Editable: Yes`, a doc pública documenta o método, e a execução confirmou |
| `/Products/GetV2` recusa `$skip` → **HTTP 405** | Rota de "simple view", só serve à 1ª página. Mesmo comportamento de `/Deals/LossReasons`. **Para paginar produto use `/Products`** ou `query_records` |
| Contagem leve | `GET /<Set>?$count=true&$select=Id&$top=0` → `{ "@odata.count": N, "value": [] }`. Use para fechar o plano de páginas |
| Paginação | `$orderby=Id asc` + `$top` + `$skip`. Nunca `@odata.nextLink` |
| `GET /Account` | É requisição de coleção: a conta está em `value[0]` |
| `OtherProperties` | Na API crua é array, com uma única coluna `*Value` por entrada casando com o `NativeType`; `FieldKey` na escrita, `FieldId` no `$filter`. **Nas ações dedicadas da peça, use `customFields` (mapa plano)** |
| `$select` | Use sempre. Reduz payload e é o que permite detectar divergência |

### 6.1 Documentado na `api-docs`, não confirmado em execução

Marcado à parte de propósito: veio de leitura de documentação, não de export nem de
execução. Use, mas trate divergência como possível.

| Fato | Detalhe |
|---|---|
| Leitura de um registro | Use `$filter=Id eq {id}`, **não** a forma com parênteses. Parênteses valem para escrita (`PATCH`/`DELETE`) e sub-rotas |
| Itens de proposta | Conjunto próprio `/QuotesProducts` (`GET`, `PATCH`), consultado por `$filter=QuoteId eq {id}`. `/Quotes@Products` **não é rota** |
| `QuoteProduct.ProductCode` | O código do produto vem **denormalizado na própria linha** — de-para com sistema externo por código não custa chamada extra |
| `QuoteProduct.Discount` | Existe um único campo `Discount`, e **não está documentado** se é percentual ou valor. Não repasse cegamente para campo percentual de outro sistema: derive o unitário líquido de `Total / Quantity` |
| Unidade de medida | `QuoteProduct` **não tem** campo de unidade; só o catálogo tem (`Product.MeasurementUnit`) |
| `PATCH /Quotes({Id})` | **Regenera o documento por padrão.** Use `?generateDocument=false` quando só gravar dado. Pode também devolver a proposta para aprovação em conta com regra de aprovação |
| Coleções aninhadas em `PATCH` | `Sections`/`Products`/`Parts`/`Installments` têm semântica de **substituição**: filho não reenviado é apagado. A raiz e `OtherProperties` são delta (merge por `FieldKey`) |
| CNPJ/CPF do cliente | `Contact` tem `CNPJ`, `CPF` e `Register` como campos separados; **formato de armazenamento não documentado** — normalize para dígitos antes de casar com sistema externo |
| Rate limit | Dimensione por ~120 req/min. Em `429`, respeite `Retry-After` |

---

## 7. Sankhya — roteamento e conhecimento de entidade

1. **ação dedicada** da peça (§5.4), quando a entidade estiver entre as seis cobertas;
2. **`custom_api_call`** para qualquer outra entidade e para **toda exclusão** — a peça não
   tem ação de delete.

O conhecimento de entidade, coluna, chave, domínio, `serviceName`, erro e pré-condição vem do
Guia de Integração público do Sankhya. Consulte-o antes de montar qualquer payload de
`custom_api_call`
(https://developer.sankhya.com.br/reference/guia-integracao).

As regras que valem aqui sem exceção: nunca inventar `serviceName`; nunca
deduzir tabela ou coluna por semelhança; nunca preencher `CODTIPOPER`, `CODEMP`,
`CODTIPVENDA`, `CODVEND` ou `CODLOCALORIG` com valor de exemplo; nunca usar campo `AD_*` sem
confirmar no metadata do ambiente; nunca emitir SQL para o ERP.

**Efeito colateral que o agente é obrigado a avisar:** a TOP informada decide o que o
documento faz. Se ela reserva estoque (`ATUALEST = 'R'`), um flow que cria documentos em
massa reserva estoque do cliente sem que ninguém tenha pedido. Diga isso ao usuário antes de
entregar, inclusive no modo genérico — ali como item a conferir antes de publicar.

---

## 8. Arquitetura de referência

Siga esta ordem. Ela existe porque cada peça dela pegou um erro real.

1. **Parâmetros** — um nó de código no topo com tudo que é configurável: FieldKeys, constantes
   de ambiente que sobraram do degrau 3 de §1.2, tamanhos de página, tetos. Valida e lança se
   faltar, inclusive contra os placeholders de §1.1. Nada de número mágico espalhado pelo
   flow, e **nenhum valor de ambiente fora deste nó**.
2. **Resolução em runtime** — os nós que descobrem, durante a execução, o que §1.2 mandou
   resolver em vez de pedir: metadados, de-para de cadastro, campo do registro de origem.
   Cada um com parada dura em zero ou em ambiguidade, e cada um posicionado no ramo que
   realmente usa o valor. Resolver é **ler**: nenhum desses nós escreve estrutura (§1.3).
   Quando o flow tem gatilho de evento, o passo zero é a sonda de §5.2.1 no nó de parâmetros,
   seguida da releitura do registro por `Id eq`.
3. **Leitura paginada** — sondagem da página 0 → nó de código que fecha o plano de páginas →
   loop com o step de leitura como `firstLoopAction` → nó de código que consolida lendo
   `{{loop.iterations}}`.
4. **Paradas duras antes de escrever.** No mínimo: última página do Sankhya ainda com
   `hasMoreResult=true`; registros lidos do Ploomes abaixo da contagem; contagem não
   confiável; qualquer item do lote sem de-para resolvido. Gravar com leitura incompleta é o
   que cria duplicata; gravar um lote parcial costuma ser pior que não gravar.
5. **Escrita** — um nó de código monta a lista de operações **com o corpo pronto**, e o loop
   só dispara. Método literal por ramo.
6. **Relatório final** — números, listas de exceção e um array `avisos`, com `ok` = sem
   avisos. É o que torna a execução auditável sem abrir log.

**Roteador é para decisão de negócio; falha é `throw`.** Ramo de roteador serve ao caso
legítimo de "não fazer" (já processado, nada a processar). Erro — dependência ausente,
de-para incompleto, sistema de destino recusando — deve **lançar** no nó de código, com a
mensagem já traduzida. Execução vermelha com motivo é sinal; ramo silencioso não é. Isso
também evita aninhar roteador dentro de roteador, o que empurra o relatório final para fora
do caminho de exceção.

**Número que o relatório afirma é o número efetivamente enviado.** Se o payload leva valor
arredondado, o total do relatório se calcula sobre o valor arredondado — senão o relatório
afirma um resultado que o sistema de destino não produz. Divergência de arredondamento é
`aviso`, não exceção.

Enriquecimento que não é essencial (descrição de grupo, por exemplo) roda **tolerante a
falha** e degrada: o flow segue sem ele e o relatório diz que faltou.

**Tolerar falha só com contabilidade.** `continueOnFailure: true` (ou `failsafe: true`)
apenas em leitura opcional ou em escrita cujo contrato ainda não é certo — e **sempre** com
um nó de código depois contando sucessos e falhas e levando isso ao relatório. Tolerar falha
sem contabilizar é como um erro vira silêncio. Caso especial: quando a escrita tolerada é a
que fecha a guarda de idempotência, o relatório tem de dizer, em texto, que a guarda ficou
sem efeito para aquele registro.

---

## 9. Reconciliação

Case por uma chave estável, nunca por nome, quando houver chave. `Code` do Ploomes é o lugar
natural do código do sistema de origem. Quando a entidade de destino não tiver campo de
código externo — `ProductGroup` só tem `Id`, `Name`, `FamilyId`, `FixedPrice` —, o nome
normalizado é a única saída: **declare isso como limitação no relatório**, porque renomear na
origem passa a criar registro novo no destino.

Para idempotência entre sistemas, a chave anda no sentido inverso: grave o identificador do
documento criado no destino (`NUNOTA`, número do pedido) de volta num campo do registro de
origem, e leia esse campo como guarda antes de criar de novo. Não depende de storage (§5.5) e
deixa o vínculo visível para quem usa o CRM.

---

## 10. Descoberta guiada de peça desconhecida

Quando o pedido exigir peça, ação ou prop fora de §5, **não gere**. Diga o que falta e peça
uma destas, nesta ordem:

1. **Um flow existente que já use a peça, exportado em JSON.** É a fonte melhor: traz
   `pieceName`, `pieceVersion`, `actionName` e o `input` real. Extraia o contrato dali,
   registre-o na conversa e só então gere.
2. Um flow de sonda montado na interface — um nó por ação, **todos os campos preenchidos,
   inclusive opcionais e avançados**, valores literais sem expressão — e exportado. Campo
   vazio não aparece na exportação, e props dinâmicas (§4.6) só aparecem com o pai definido.
3. Um print do painel de configuração do nó, com os campos preenchidos.

Depois de descobrir, **use o contrato observado literalmente** — sem renomear prop, sem
supor opcionalidade, sem preencher campo que não apareceu.

> Export de outra conta é fonte de **contrato**, nunca de **valor**: copie nomes de prop e
> forma de payload, e descarte ids de conexão, Account Id/Name, FieldKeys e constantes (§1).

---

## 11. Segredo não entra no arquivo

Autenticação de sistema é **sempre** por conexão, nunca digitada no nó. E ao
entregar ou receber um `.json` de flow, conferir se não há senha embutida antes de
compartilhar.

---

## 12. Harness obrigatório

Nunca entregue um template escrito à mão direto no JSON. Sempre:

**12.1 Gere por script.** Escreva um gerador em Python com funções construtoras
(`code_node`, `piece_node`, `loop_node`, `router_node`) e monte o encadeamento no final. JSON
de 30+ nós escrito à mão erra `children`/`branches` e duplica `name`.

**12.2 Checagem estática.** Um script que percorre o flow na ordem de execução, registrando
a pilha de loops, e falha em:

- nome de step duplicado;
- referência a step que roda **depois**;
- leitura de step que está dentro de um loop sem passar por `.iterations`;
- `.iterations` pedido de dentro do próprio loop;
- dentro de um loop, referência ao loop que não seja `.item` / `.index`;
- `nomeStepLeitura` que não é o `firstLoopAction` do loop citado;
- roteador como `firstLoopAction`;
- `len(children) != len(branches)`;
- `actionName` ou `pieceName` fora do catálogo de §5; `pieceVersion` divergente;
- expressão em `method`; rota/método fora da lista permitida;
- `url` de `custom_api_call` que não seja objeto aninhado; `body` incoerente com `body_type`;
- prop filha sem a prop pai que a habilita (§4.6);
- expressão `{{trigger...}}` fora do nó de parâmetros (§5.2.1);
- nó de parâmetros sem a sonda de gatilho: menos de dois caminhos candidatos, ou sem
  `{{trigger}}` bruto, num flow com gatilho de evento;
- rota que altera schema da conta dentro do flow (§1.3): `POST`/`PATCH`/`DELETE` em
  `/Fields`, `/FormsFields`, `/Forms`, `/FieldsEntities`, `/Deals(Pipelines|Stages)`;
- `pieces[]` que não bate exatamente com as peças usadas;
- `schemaVersion` que não seja a string `"21"`; arquivo com BOM;
- JS que não compila (`node --check` em arquivo `.mjs`);
- input declarado no nó e nunca lido no código (sinal de fiação morta).

**Teste o verificador antes de confiar nele.** Um script que injeta cada defeito acima num
clone do template e exige que a checagem reprove, com a mensagem certa. Checagem que nunca
reprovou nada não prova nada — e uma checagem verde sobre um verificador quebrado é pior que
nenhuma, porque cria confiança falsa.

**12.3 Simulação end-to-end.** Um script Node que carrega cada step CODE **do próprio
template gerado** (não de um rascunho paralelo), roda em sequência com payloads sintéticos
do Sankhya e do Ploomes, e afirma o resultado. Cubra **também os caminhos de exceção**:
conta errada, leitura incompleta, dependência opcional indisponível, escrita recusada,
resposta HTTP 200 com erro no corpo, formato de saída alternativo (§4.8). Nenhum flow sai
sem isso verde.

**12.4 Só então entregue** o `.json` mais um changelog curto: o que o flow faz, as rotas
usadas com a coluna "tolera falha", as invariantes protegidas, o que ficou em aberto. No
modo genérico, o changelog abre com a **lista de preenchimento** — conexões, parâmetros,
FieldKeys — e com a frase de que o template importa limpo e **falha no primeiro disparo até
que ela seja preenchida**. Diga isso também na mensagem, não só no anexo.

O changelog também declara, em seções próprias: **o que o flow resolve sozinho em runtime**, de
onde tira cada valor e o que acontece quando a busca não resolve; e **as perguntas de §1.2 que
foram feitas**, com a resposta que o usuário deu — ou, quando ele não estava presente,
a pergunta que ficou aberta e a saída assumida no lugar dela.

---

## 13. Checklist final

- [ ] modo declarado (genérico ou conta conhecida) e coerente com o pedido
- [ ] nenhum valor de outra conta vazou para este template — conexão, Account Id/Name,
      FieldKey, constante de ambiente
- [ ] todo valor de ambiente passou pela escada de §1.2, nesta ordem: resolver em runtime →
      perguntar → placeholder; nenhum placeholder criado por atalho
- [ ] todo valor resolvido em runtime tem parada dura em zero e em ambiguidade, e aparece no
      relatório final com a origem
- [ ] nenhuma pergunta de §1.2 foi respondida por conta própria; se o usuário não estava
      presente, a pergunta aberta está escrita na entrega
- [ ] no modo genérico: todo valor de ambiente é placeholder inerte, nenhum valor plausível
- [ ] todo valor de partida que sobrou falha ruidosamente quando errado; nenhum que grave em
      silêncio
- [ ] no modo genérico: nó de parâmetros lança listando o que falta
- [ ] nenhuma guarda de conta (`GET /Account` comparando Id/Name), salvo pedido explícito do
      usuário
- [ ] gatilho lido por sonda de candidatos (§5.2.1), nunca por caminho único, com o objeto
      bruto junto e o caminho vencedor no relatório
- [ ] existe releitura do registro por `Id eq <resolvido>` logo depois da sonda
- [ ] o flow não cria, edita nem apaga nenhum objeto de configuração da conta (§1.3)
- [ ] identificador que grava em silêncio quando errado é resolvido por leitura, não pedido
      como parâmetro cru
- [ ] pré-requisito de configuração, quando existir, vai na entrega como chamadas prontas e
      abre o changelog
- [ ] no modo conta conhecida: ids de conexão vindos do usuário ou de export **da mesma
      conta**, nenhum inventado
- [ ] valor de ambiente só no nó de parâmetros, em nenhum outro nó
- [ ] `pieces[]` bate exatamente com as peças usadas
- [ ] `schemaVersion` = `"21"`, UTF-8 sem BOM
- [ ] todo `actionName` copiado de §5, nenhum deduzido
- [ ] nenhuma senha em texto claro no arquivo
- [ ] nenhum roteador dentro de loop; falha é `throw`, não ramo
- [ ] nenhum `method` com expressão
- [ ] `children` e `branches` do mesmo tamanho, contando o `FALLBACK`
- [ ] toda leitura de dentro de loop sai por `.iterations`, lida de fora
- [ ] plano de páginas fechado antes do loop
- [ ] paradas duras antes de toda escrita
- [ ] leitura de coleção do Ploomes por `query_records`, não por `custom_api_call`
- [ ] nó que consome leitura normaliza a forma da resposta (§4.8)
- [ ] relatório final com `avisos` e `ok`, com números calculados sobre o que foi enviado
- [ ] checagem estática, teste do verificador e simulação verdes
- [ ] efeito colateral no ERP (reserva de estoque, regeneração de documento) avisado
- [ ] o que não foi confirmado está escrito como não confirmado, não omitido