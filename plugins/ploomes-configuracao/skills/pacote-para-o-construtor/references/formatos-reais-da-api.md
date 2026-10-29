# Formatos conferidos na API real

O que está aqui foi **visto em resposta real da API do Ploomes**, não lido em documentação. Cada
linha diz quando e como foi conferida. O `api.ts` gerado e a API falsa da bancada seguem esta
página; quando a documentação e esta página divergirem, vale esta página até nova conferência.

Conta usada: uma conta de teste, 2026-09-30 —
pelo MCP do Ploomes e pelo `testar_na_conta.ts` na `public-api2`, só leitura. 11 chamadas, todas 200.

## URL base

| Quem chama | URL | Fonte |
|---|---|---|
| A tela, dentro do CRM | a que a ponte entrega em `host:init` (`apiUrls.apiUrl`) — nunca fixe | tráfego de tela publicada |
| Script ou proxy fora do CRM (`testar_na_conta.ts`, bancada no modo API real) | `https://public-api2.ploomes.com/` | `api-docs` 01-overview, "External service" |

O MCP responde com `@odata.context` num host que muda de conta para conta: por isso a tela nunca fixa URL.

## `GET Deals({id})/ValidateChecklist`

**A resposta é a lista dos itens pendentes.** Lista vazia = pode avançar e ganhar.

```json
{ "value": [ { "Id": 1002, "ChecklistId": 2001, "Name": "Data de envio da cotação",
               "Required": true, "FieldKey": "deal_48120556-…", "FieldPathId": 70, "Ordination": 2 } ] }
```

⚠️ Não há campo `Valid`/`IsValid`. Código que procura esse campo e, sem achar, conclui "válido"
libera o ganho com pendência — foi o bug da v2 do gerador.

## `GET Deals({id})/GetApplicableChecklists`

⚠️ **Na `public-api2`, sem `$expand=Fields`, o checklist volta sem itens** (visto no teste real: "0 itens").
O MCP mostra os itens porque pede o `$expand`. O `api.ts` pede
`$expand=Fields($expand=Field($select=Id,Key,Name,TypeId))` e, se a função recusar, busca por `Checklists`.

Já filtrada pela condição de exibição (`DealFilterId`): só volta o checklist que se aplica ao
negócio naquela etapa. Cada item traz o campo expandido, com o tipo:

```json
{ "value": [ { "Id": 2001, "Name": "Base da cotação enviada", "DealStageId": 3001,
  "Fields": [ { "Id": 1001, "Name": "Faixa da tabela de preço aplicada", "Required": true,
                "FieldKey": "deal_61C5…", "Ordination": 1,
                "Field": { "Id": 4001, "Key": "deal_61C5…", "Name": "…", "TypeId": 7 },
                "Conditions": [ { "OperationId": 1, "IntegerValue": null, … } ] } ] } ] }
```

- **O item conta como feito pela condição, não por estar preenchido.** Por isso o `api.ts` marca
  `pendente` com o veredito do `ValidateChecklist`, e a tela usa `pendente`.
- **Não traz o valor atual:** o valor vem de `OtherProperties` do negócio, na coluna do `TypeId`.
- **Campo de opção (TypeId 7) não traz as opções:** elas vêm de `FieldsOptionsTables`.

## `DealsPipelines`

`$expand=Stages($select=Id,Name)` funciona. O funil tem textos que a tela deve usar em vez de fixar:
`SingularUnitName` / `PluralUnitName` ("Cotação" / "Cotações"), `WinVerb($select=Name)` ("Fechar")
e `LoseVerb($select=Name)` ("Encerrar", "Perder"). Conferido pelo MCP, que usa exatamente esse
`$select`/`$expand`.

## Chave inválida

A `public-api2` responde **404**, não 401, para User-Key inválida (visto com chave inventada). A
tela diria "registro não encontrado"; o teste de fumaça avisa que pode ser a chave.

## Erros de regra de negócio

A API real responde **`{"value": "mensagem"}`**, não `{"error": {"message"}}`, e usa **401** também para
regra de negócio. Visto:

| Chamada | Status | Corpo |
|---|---|---|
| `PATCH Deals(id)` mudando `StageId` com checklist pendente | 401 | `{"value":"There is a pending checklist to be completed"}` |
| `POST Deals(id)/Win` com checklist pendente | 401 | idem |

➜ **O servidor barra avanço e ganho com checklist pendente.** A tela barra antes para dar a mensagem
certa, mas não é a única trava. O `api.ts` lê os dois formatos de corpo e traduz as mensagens conhecidas.

## Condição de item de checklist

Operadores (`buscar_operacoes`): 1 igual a, 2 diferente de, 3 maior que, 4 maior ou igual, 5 menor que,
6 menor ou igual, 7 contém, 8 não contém. **"Preenchido" é `OperationId 2` sem valor (diferente de
vazio).** `OperationId 1` sem valor é "igual a vazio": o item só passa com o campo **vazio** — foi o
que travou os checklists do funil "Vendas de EPI". Item obrigatório **sem condição** nunca passa.

⚠️ `salvar_checklist_etapa` do MCP: a condição vai como `{"operador": 2, "valor": null}`; outros
formatos viram `OperationId 1`. E uma chamada que responde **400 pode deixar o checklist criado pela
metade** — sempre liste os checklists da etapa depois de um erro.

## Tabela de opções

O `api.ts` usa `Fields@OptionsTables@Options?$filter=TableId eq N&$select=Id,Name`: forma vista
respondendo 200 em 39 chamadas de uma tela publicada (tráfego observado no navegador). A mesma coleção atende
por `/Fields/OptionsTables/Options` (MCP).


`/Fields/OptionsTables/Options?$filter=TableId eq N` devolve `Id`, `TableId`, `Name`,
`ExternalKey`. A opção não tem ordem própria: a lista sai ordenada por `Name`. O `Id` é o valor
gravado em `IntegerValue`.

## Agregação (`$apply`) — conferida em 2026-10-20

Numa conta de teste, só com GET, para a tela do mapa do processo.

- **`Deals?$apply=filter(StatusId eq 1)/groupby((PipelineId,StageId),aggregate($count as Quantidade,Amount with sum as Valor,DaysInStage with average as DiasMedios))`**
  devolve `{ value: [{ StageId, PipelineId, DiasMedios, Valor, Quantidade }] }`, uma linha por grupo,
  sem paginação. `DiasMedios` vem inteiro.
- **`DealsStagesHistory?$apply=…`** devolve o mesmo formato, mais **`"@odata.id": null`** em cada linha
  (o `api.ts` gerado tira essa chave). `Days with average` vem `null` no grupo das passagens ainda
  abertas.
- O filtro de data dentro de `filter(...)` aceita o ISO com `Z` (`FinishDate ge 2026-07-22T17:55:27.579Z`).

## `DealsStagesHistory` — uma linha por passagem

Campos: `Id`, `DealId`, `StageId`, `NewStageId`, `Advanced`, `Won`, `Lost`, `Amount`, `LossReasonId`,
`Days`, `Undone`, `CreateDate`. A criação do negócio entra como `StageId: 1` com `NewStageId` na
primeira etapa. A etapa deixada tem `NewStageId` e `Days`; a etapa atual, `NewStageId: null` e
`Days: null`. Conversão de uma etapa = `Advanced` ÷ (`Advanced` + `Won` + `Lost`).
O histórico **filtra pelo negócio por navegação**: `Deal/OwnerId eq N` dentro do `filter(...)` do
`$apply` respondeu 200 (conversão por responsável). A bancada imita (`Contact/…` e `Deal/…`).

## Configuração do processo: o que a API devolve, e o segredo que vem junto

| Rota | Campos úteis | ⛔ Segredo — nunca no `select` |
|---|---|---|
| `Automations` (`$expand=Actions`) | `TriggerId`, `TriggerDealStageId` (etapa do gatilho), `Enabled`, `DisabledDueToError`, `LastRunTime`; na ação, `ActionId`, `DealStageId` (etapa de destino), `ShouldGenerateDocument` | `RequestBody` da ação (corpo da tarefa, do webhook) |
| `AutomationsTriggers`, `AutomationsActionsActions`, `WebhooksActions`, `Integrations` | catálogos do sistema, iguais em toda conta (cópia em `bancada/catalogos-do-sistema.json`) | — |
| `Checklists` (`$expand=Fields`) | `DealStageId`; no item, `Name`, `Required`, `FieldKey` | — |
| `Webhooks` | `EntityId`, `ActionId`, `Active`, `IsNativeIntegration` | `CallbackUrl`, `ValidationKey` |
| `AccountIntegrations` | `IntegrationId`, `Enabled`, `StatusId` | `Key`, `IntegrationUserKey`, `IntegrationUserId` |

O portão bloqueia esses campos no `select` e no `$expand`, e bloqueia a leitura dessas rotas sem
`select`: a resposta inteira levaria o segredo para o navegador.

## "Sua empresa" e Arquivos — conferido em 2026-10-20

- **Campo de texto multilinha (TypeId 2) em "Sua empresa" (`EntityId` 15)**: criado por
  `POST Fields { Name, EntityId: 15, TypeId: 2 }` (a chave volta gerada: `account_<GUID>`).
  `PATCH Account(<id>) { OtherProperties: [{ FieldKey, BigStringValue }] }` gravou e
  `GET Account?$expand=OtherProperties` leu de volta **10 KB, 100 KB, 400 KB e 1,5 MB idênticos**,
  com `<`, `>`, `&`, aspas e acentos.
- **Arquivos (`Attachments`)**: a `Url` do anexo **não é legível pela tela**, e a API não tem rota de conteúdo (`/$value` e `/Download` dão 404; `GetById`
  devolve só os metadados). **A tela não consegue ler um arquivo do módulo Arquivos.**
- `POST AttachmentsFolders` respondeu **401** para a chave da conta de teste (perfil sem permissão no
  módulo), e `POST Attachments/Base64` recusou três formatos de corpo (`400 wrong format`) — o formato
  não está documentado.

## Ainda não conferido na API real

- Paginação por cursor (`Id gt N`) com mais de uma página — a consulta roda (visto), mas a conta de
  teste tem 1 negócio aberto no funil.
- Resposta de `Win`, `Lose` e `Reopen` e mensagens de erro de escrita — exige o modo com escrita.
- `DealsLossReasons` com `PipelineId eq null` (motivos gerais) — a documentação indica, falta ver.
