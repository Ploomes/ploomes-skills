---
name: api-docs
description: Referência técnica completa da API Ploomes CRM (OData v4). Use sempre que a conversa envolver a API Ploomes — em português ou inglês. Cobre - autenticação (User-Key, Importation-Key e variantes); resolução de base URL (HostSet, WebApiUrl, PublicApiUrl, ExporterApi2Url); as rotas, incluindo Deals, Contacts, Quotes, Orders, Leads, Documents, Tasks, Products, Automations, BusinessRules e Pipelines; campos customizados (OtherProperties, FieldKey, FieldsEntities/FieldsTypes); consultas OData ($filter, $expand, $apply, $skip/$top, preload); webhooks e supressão de webhooks; rate limiting (429/Retry-After); uploads e operações em massa; e tradução PT→API (negócio, proposta, cliente, funil, etapa, marcador). Use também para criar/ler/editar qualquer entidade Ploomes via API, depurar chamadas, construir integrações, ou converter comandos de negócio em requisições HTTP corretas.
---

# ploomes-api-docs — referência da API Ploomes CRM

> Referência técnica da API do Ploomes CRM (OData v4).
> Audience: integradores, consultorias parceiras e agentes de IA gerando código contra a API.

This skill is the canonical reference. **Do not invent endpoints, properties, limits, or behaviors.** Everything callable here is documented in the reference files of this skill. If something is not documented here, say so explicitly instead of guessing.

---

## 1. When to use this skill

Use whenever the conversation touches the Ploomes CRM backend API, in Portuguese or English. The skill applies to all flavors of the API a caller can hit — pick the base URL according to caller type:

| Caller | URL property to use |
|---|---|
| Frontend (web/mobile) | `HostSet.WebApiUrl` (or `HostSet.WebApiCanaryUrl` for canary) |
| Internal service | `HostSet.PublicApiUrl` (or `HostSet.PublicApiCanaryUrl` for canary) |
| External / third-party | **fixed** `https://api2.ploomes.com` |
| Exporter service | `HostSet.ExporterApi2Url` |
| PowerBI service | `HostSet.ExporterPowerBiApi2Url` |

Resolving the `HostSet` itself and the canary rule: see §3.1.

---

## 1.5 When NOT to use this skill

This skill is **API-only**. Do not pull it in for:

- UI/UX questions about the Ploomes web or mobile interface (telas, fluxos do usuário, cliques) — that's the design system / product skill.
- Treinamento comercial, coaching de vendas, processo conceitual de CRM.
- Configurações feitas exclusivamente pela tela administrativa, sem intenção de automatizar via API.
- Billing, planos, contratos, política comercial.
- Bugs de produção específicos (precisam de logs e telemetria, não de referência).
- SQL direto contra o banco — esta skill cobre apenas a API HTTP.

If the request touches both UI and API, scope your answer to the API portion and flag that the UI portion is out of scope.

---

## 2. Reading pattern (progressive disclosure)

The full documentation is ~261 KB across 113 files. Do not try to load everything. Follow this protocol:

1. **Before answering anything specific about an endpoint**: open `endpoints/<entity>.md`. If you don't know which file, open `endpoints/_index.md` first — it lists all routes.
2. **Before generating a payload that touches a model**: open `data-models/<domain>.md`. Use the FieldKey / Creatable / Editable columns to know what you can send on POST/PATCH. If unsure which domain a model lives in, open `data-models/_index.md`.
3. **Before writing a complex `$filter` / `$expand` / `$apply`**: consult `03-odata-reference.md` for the exact limits and syntax.
4. **Before generating any payload with `OtherProperties`**: consult `07-fields-and-entities.md` — this is the system for custom fields and it has strict rules.
5. **When the user issues a command in Portuguese**: consult `09-portuguese-reference.md` to map "negócio", "proposta", "venda", "marcador", etc. to the right endpoint and EntityId, plus PT-named `FieldKey`s for native fields.
6. **For HTTP error codes or exception mapping**: `04-error-reference.md`.
7. **For 429 / `Retry-After` behavior**: `05-rate-limiting.md`.
8. **For CRUD/bulk/upload/webhook patterns**: `06-common-patterns.md`.
9. **For architecture, multi-tenancy, `HostSet` rules**: `01-overview.md`.
10. **For auth header types and login flow**: `02-authentication.md`.

You can hold the section below (§3–§9) from memory; everything more specific must be looked up.

**Always cite the reference file you consulted** in your answer — e.g. "from `03-odata-reference.md` §3 …" — so the user can verify against the source.

---

## 3. Critical flows you can answer without opening references

### 3.1 Resolving the base URL

The base URL is **never hardcoded**. Resolve it dynamically:

```http
GET /Account?$expand=HostSet
User-Key: <key>
```

Then pick the URL from `HostSet` according to the caller (see table in §1).

External / third-party integrations are the only exception — they always use the fixed `https://api2.ploomes.com`.

**Canary URLs** (`WebApiCanaryUrl`, `PublicApiCanaryUrl`) are for staging / pre-production testing only. Production integrations always use the non-canary URL (the one without the `Canary` suffix).

⚠️ **Writing to canary by accident is silent.** A write that lands on a canary host answers `200` exactly like production, and the divergence only shows up later, on reads that miss records. Before the first write of a session, read the effective host — the `@odata.context` of the first response carries it — and check it for `canary`. Pre-flight in `guardrails.md`, block 0.

⚠️ **Not every entity set is exposed on every host, and the symptom is a bare `404` that looks like a wrong route name.** Verified on 2026-09-09 against an account's hostset: `/ContactsOrigins` and `/FieldsOptionsTablesOptions` return `200` on `https://api2.ploomes.com` and `404` on that hostset's `WebApiUrl`, while `/Tags` and `/Deals` answer on both. ➜ **When a route you took from `endpoints/_index.md` 404s, retry it on the public host before doubting the name.** Metadata-shaped sets (`Fields*`, `*Origins`) are the ones that behave this way.

### 3.2 Authenticating (99% of cases)

Send a `User-Key` header on every request:

```http
GET /Deals
User-Key: <user-key>
```

`User-Key` covers both interactive sessions and **integration users** (recommended for automation — created in Administration → Integrations → Integration Users).

Other key types exist for specific flows:

- `Importation-Key`, `Exportation-Key` — elevated/admin and bulk import/export flows.
- `Quote-Key`, `Order-Key`, `Document-Key`, `Related-Person-Key` — scoped tokens for embedded / public-facing flows (signed links, public forms, etc.).

Open `02-authentication.md` whenever any of these is involved — do not guess which one applies based on the name alone.

### 3.3 Paginating (do NOT use `@odata.nextLink`)

`@odata.nextLink` is unreliable in this API. **Always page manually:**

```http
GET /Deals?$orderby=Id asc&$top=100&$skip=0
GET /Deals?$orderby=Id asc&$top=100&$skip=100
GET /Deals?$orderby=Id asc&$top=100&$skip=200
```

Stop when the `value` array is shorter than `$top`. A stable `$orderby=Id asc` is required so subsequent pages don't reshuffle.

### 3.4 Casing rules

- **Entities and properties**: PascalCase (`Contacts`, `Deals`, `OtherProperties`, `FieldKey`, `WinDealOnLastStage`).
- **OData operators**: lowercase (`eq`, `ne`, `gt`, `lt`, `and`, `or`, `not`, `contains`, `startswith`, `any`, `all`).
- **Query option names**: lowercase with `$` (`$filter`, `$expand`, `$select`, `$orderby`, `$top`, `$skip`, `$count`, `$apply`).
- **Function/action segment**: `/Set({id})/Default.Action` (PascalCase).

### 3.5 Validator limits (enforced server-side on every GET collection)

| Validator | Limit |
|---|---|
| `MaxExpansionDepth` (`$expand` nesting) | **8** |
| `MaxAnyAllExpressionDepth` (`any/all` nesting) | **2** |
| `MaxNodeCount` (filter AST size) | **220** |
| Default `MaxTop` | **1000** |
| `MaxTop` on `/Tags`, `/ContactsOrigins`, `/FieldsOptionsTablesOptions` | 10000 |
| `MaxTop` on `/Products/Search` | 100 (and `$filter`/`$expand`/`$orderby`/`$count`/`$apply` are disabled there) |

Hitting any of these returns `400 Bad Request` from the OData validator. If a generated query exceeds the limit, rewrite it (split into multiple smaller queries, flatten `any/all` nesting, drop unused expansions).

**Never use `$compute`** — accepted but unreliable; compute client-side or push into `$apply=aggregate(... with ...)`.

**`$count=true` on heavy queries → use `$apply=aggregate($count as Count)` instead.** `$count=true` streams the full count alongside the result and is a frequent cause of timeouts on large collections. The `$apply` form returns a single aggregated row with the total — much cheaper.

### 3.6 Custom fields — the 4-step OtherProperties flow

For every entity that supports `OtherProperties` (Contacts, Deals, Quotes, Orders, Products, Tasks, Documents, InteractionRecords, Users, Teams, Leads, Emails, Account, ...):

1. **Discover the entity** — `GET /FieldsEntities?$filter=ApiUrl eq 'Contacts'` → grab `Id`.
2. **Discover the type** — `GET /FieldsTypes` → pick the row whose `NativeType` matches what you want to store.
3. **Create the field** — `POST /Fields` with `{ "EntityId": …, "TypeId": …, "Name": "…" }` → response includes the `Key` to use as `FieldKey`.
4. **Set the value** — POST/PATCH the parent entity with an `OtherProperties` array. Set **exactly one** value column per entry, matching the field's `NativeType`:

| NativeType | Value column |
|---|---|
| `String` | `StringValue` |
| `BigString` | `BigStringValue` |
| `Integer` | `IntegerValue` *(also used for dropdown/options fields — the option's ID)* |
| `Decimal` | `DecimalValue` |
| `DateTime` | `DateTimeValue` |
| `Bool` | `BoolValue` |

All other value columns (`ObjectValueId`, `UserValueId`, `ProductValueId`, `ContactValueId`, `CurrencyValueId`, `AttachmentValueId`, `AttachmentItemValueId`, etc.) are **read-only** and populated by the system.

Filtering tip: in `$filter`, prefer `OtherProperties/any(op: op/FieldId eq <int> and op/StringValue eq '…')` — `FieldId` is indexed and faster than `FieldKey`. In write payloads you must still use `FieldKey`.

For full details (Options Tables for dropdowns, multi-value fields with `Multiple: true`, validation rules, full Field Types Reference, `UpdateOtherProperty` endpoint), always open `07-fields-and-entities.md`.

### 3.7 Webhook suppression

Add `?webhooks=false` to a write to skip outbound webhook emission:

```http
POST /Deals?webhooks=false
PATCH /Contacts(123)?webhooks=false
```

Default is `true`.

### 3.8 Soft delete by default

`DELETE /{Set}({id})` returns `200 OK` and marks the row deleted; rows are not physically removed. Many entities expose `GET /{Set}/GetDeleted{Set}` to read soft-deleted records (e.g. `/Deals/GetDeletedDeals`, `/Contacts/GetDeletedContacts`, `/Automations/GetDeletedAutomations`).

### 3.9 Portuguese commands

When the user writes Portuguese, translate via `09-portuguese-reference.md`. The most common mappings:

| PT | EN / Endpoint |
|---|---|
| Cliente | `/Contacts` |
| Negócio | `/Deals` |
| Lead | `/Leads` |
| Proposta | `/Quotes` |
| Venda / Pedido | `/Orders` |
| Documento | `/Documents` |
| Tarefa | `/Tasks` |
| Produto | `/Products` |
| Funil | `/DealsPipelines` |
| Estágio (do negócio) | `/DealsStages` |
| Marcador | `/Tags` |
| Equipe | `/Teams` |
| Usuário | `/Users` |
| Campo (customizado) | `/Fields` |
| Automação | `/Automations` |
| Fluxo de aprovação | `/BusinessRules` |
| Registro de Interação | `/InteractionRecords` |
| Anexo | `/Attachments` |
| Painel de relatórios | `/Panels` |

Full table (110+ entities) lives in `09-portuguese-reference.md`, along with PT-named `FieldKey`s for native fields.

### 3.10 Anti-patterns to actively avoid

Common mistakes that this skill should prevent — even when carrying out a request from the user:

- ❌ **Hardcoding `https://api2.ploomes.com` for internal callers.** That fixed URL is only for external / third-party integrations. Internal callers must resolve `HostSet` first (§3.1).
- ❌ **Using `@odata.nextLink` for pagination.** Unreliable — page manually with `$skip` (§3.3).
- ❌ **Using `$compute`.** Accepted but unreliable. Compute client-side, or push the math into `$apply=aggregate(... with ...)`.
- ❌ **Using `FieldId` in a write payload.** Use `FieldKey` for writes. `FieldId` is the indexed identifier used only inside `$filter` for read performance (§3.6).
- ❌ **Sending `OtherProperties` as a single object.** It is always an array, even with one item.
- ❌ **Filling more than one `*Value` column on the same `OtherProperties` entry.** Exactly one, matching the field's `NativeType`.
- ❌ **camelCase or snake_case for entity/property names.** Always PascalCase (§3.4).
- ❌ **`$count=true` on heavy collections.** Use `$apply=aggregate($count as Count)` instead (§3.5).
- ❌ **Combining `$apply` with `preload`.** Not compatible — `preload` is only for paged reads with nested `$expand`.
- ❌ **Inventing endpoints, properties, or actions.** If it is not in `endpoints/_index.md` or `data-models/_index.md`, say so — do not improvise.

### 3.11 Guardrails de segurança (antes de QUALQUER escrita)

Antes de gerar uma operação de escrita, **abra `guardrails.md`** se ela for qualquer uma destas:

- **a primeira escrita da sessão, qualquer que seja ela** — o bloco 0 é sobre ambiente (produção × canary), não sobre o que a chamada faz;
- `DELETE`, `BulkUpdate`/`BulkDelete`, `PATCH` com filhos aninhados (Quotes/Orders/Documents), `Merge`;
- mudança de `StageId`/`PipelineId`/`StatusId` ou `Win`/`Lose`/`Reopen`;
- `?webhooks=false`;
- qualquer coisa envolvendo chaves, escopo ou permissão.

Regra em uma linha:
- **Antes da primeira escrita, confirme o ambiente: host com `canary` é pré-produção, e o `200` não avisa** (Tier 1).
- **Destrutivo / em massa / cascata → anuncie o impacto e confirme com o usuário antes de entregar a chamada** (Tier 1).
- **Nunca hardcode ou exponha chave; nunca sugira bypass; opere sempre com menor privilégio** (Tier 2).

Detalhe por operação, com checklist de pré-voo: [guardrails.md](guardrails.md).

---

## 4. CRUD shape (uniform across every entity set)

| Method   | Path             | Body         | Returns |
|----------|------------------|--------------|---------|
| `GET`    | `/Set`           | —            | OData collection (paged) |
| `GET`    | `/Set({id})`     | —            | Single entity |
| `POST`   | `/Set`           | JSON entity  | Created entity (projected, includes computed fields) |
| `PATCH`  | `/Set({id})`     | JSON delta   | Updated entity (projected) |
| `DELETE` | `/Set({id})`     | —            | `200 OK` (soft delete) |

- All bodies use PascalCase.
- All writes return the projected entity — meaning denormalized navigation fields and computed properties are included.
- Append `?webhooks=false` to any write to suppress webhooks.

For non-CRUD operations, the OData action / function form is:

```
POST /{Set}({id})/Default.{Action}          ← actions on a single instance
POST /{Set}/Default.{Action}                ← collection-level actions (e.g. /Deals/Merge)
GET  /{Set}/Default.{Function}(arg=value,…) ← functions
```

Examples (open `endpoints/deals.md` for the complete list):

- `POST /Deals({id})/Win`, `POST /Deals({id})/Lose`, `POST /Deals({id})/Reopen`
- `POST /Deals({id})/UploadFile` (multipart/form-data)
- `POST /Deals/Merge` with `{ "SourceDealId": 1, "TargetDealId": 2 }`
- `GET /Deals/Default.GetDealsByContactId(contactId=…,pipelineId=…)`
- `POST /Contacts({id})/UpdateOtherProperty` with `{ "FieldKey": "…", "StringValue": "…" }`

---

## 5. Common request anatomy

### Read a single Deal with related Contact and Stage

```http
GET /Deals(12345)?$select=Id,Title,Amount&$expand=Contact($select=Name),Stage($select=Name)
User-Key: <key>
```

### Create a Contact with a custom field

```http
POST /Contacts
User-Key: <key>
Content-Type: application/json

{
  "Name": "ACME LTDA",
  "TypeId": 1,
  "OtherProperties": [
    { "FieldKey": "contact_8142012u0", "StringValue": "Lead from event" }
  ]
}
```

### Aggregate (dashboard-style) without `$count=true`

```http
GET /Deals
  ?$filter=PipelineId eq 10001 and StatusId eq 1
  &$apply=groupby(
    (StageId, Stage/Name),
    aggregate(Amount with sum as StageSum, Id with countdistinct as DealsCount))
  &$orderby=StageSum desc
```

### Upload a file to a Deal

```http
POST /Deals(12345)/UploadFile
User-Key: <key>
Content-Type: multipart/form-data; boundary=---X

-----X
Content-Disposition: form-data; name="file"; filename="contract.pdf"
Content-Type: application/pdf

<binary>
-----X
Content-Disposition: form-data; name="folderId"

42
-----X--
```

### Slow query with many `$expand`s — add `?preload`

```http
GET /Deals
  ?$top=100
  &$filter=PipelineId eq 10001
  &$expand=Contact($select=Name,City;$expand=City($select=Name)),Stage,Currency,Owner
  &$orderby=Id asc
  &preload
```

`preload` splits execution into two phases (SQL for the page, then in-memory expansion). Use it when nested expansions cause SQL timeouts. Not combinable with `$apply`.

### End-to-end worked example: business command → API calls

This is the pattern to follow when the user gives a high-level Portuguese command. Three phases: **interpret → discover IDs → write**.

**User:** "crie uma proposta de R$ 50.000 pro cliente ACME no funil Vendas Diretas"

**Interpret (§3.9 / `09-portuguese-reference.md`):**
- "proposta" → `/Quotes`
- "cliente ACME" → need `ContactId`
- "funil Vendas Diretas" → need `PipelineId`

**Discover IDs:**

```http
GET /Contacts?$filter=Name eq 'ACME'&$select=Id,Name&$top=1
User-Key: <key>
```

```http
GET /DealsPipelines?$filter=Name eq 'Vendas Diretas'&$select=Id&$top=1
User-Key: <key>
```

**Write the proposta:**

```http
POST /Quotes
User-Key: <key>
Content-Type: application/json

{
  "ContactId": <id from step 1>,
  "PipelineId": <id from step 2>,
  "Amount": 50000
}
```

Before sending the `POST`, confirm in `data-models/quote.md` which fields are `Creatable` and whether any are required beyond what the user provided (e.g. `CurrencyId`, `OwnerId`, `StageId` may have defaults but are sometimes mandatory by tenant config).

---

## 6. Quick "make it work" checklist for AI agents

Before sending a generated request, verify in order:

1. **Auth**: is `User-Key` set?
2. **Base URL**: did you resolve `HostSet` and pick the right `*Url` for your caller type (frontend / internal / external / exporter / PowerBI)? External services use fixed `https://api2.ploomes.com`.
3. **Casing**: PascalCase for entity, property, action and option-value names? Lowercase for operators (`eq`, `and`, …)?
4. **OData limits**: `$expand` depth ≤ 8, `any/all` depth ≤ 2, filter AST nodes ≤ 220, `$top` ≤ 1000 (or per-route exception)?
5. **Pagination**: are you using `$orderby=Id asc&$top=N&$skip=k*N` instead of `@odata.nextLink`?
6. **`$compute`**: not used. Compute client-side, or push into `$apply=aggregate(...)`.
7. **`$count=true` on a heavy query**: drop it. Use `$apply=aggregate($count as Count)` instead — it returns the total without the streaming hazard.
8. **Slow query with nested `$expand`**: add `&preload`.
9. **Custom fields**: discovered entity + type + field first? Set exactly one matching `*Value` column? Used `FieldKey` (not `FieldId`) in the write payload?
10. **Environment (first write of the session)**: does the effective host contain `canary`? If it does and production was intended, stop and tell the user — the `200` is identical either way (§3.1, `guardrails.md` block 0).
11. **Writes**: do you want `?webhooks=false`? Did you confirm the property is `Creatable`/`Editable` in `data-models/<domain>.md` (don't try to set system-managed fields)?
12. **Portuguese command**: translated via `09-portuguese-reference.md`?
13. **Non-CRUD**: used `/Set({id})/Default.Action` (POST) or `/Set/Default.Function(args)` (GET)?
14. **Segurança**: a operação é destrutiva, em massa, dispara cascata (delete/bulk/merge/patch-nested/mudança de etapa/`webhooks=false`), ou envolve chaves/escopo/permissão? Consulte `guardrails.md` — destrutivo/massa/cascata: confirme com o usuário antes de entregar; chaves/escopo: nunca hardcode, exponha ou burle (menor privilégio).

If the answer to any of these is "I'm not sure", open the relevant reference file before responding.

---

## 7. Directory map

```
api-docs/
├── SKILL.md                         ← you are here (lean overview + reading pattern)
├── 01-overview.md                   ← architecture, multi-tenancy, HostSet (full table)
├── 02-authentication.md             ← all key types, MFA, password reset, no-auth endpoints
├── 03-odata-reference.md            ← OData v4 reference (filters, expand, $apply, preload, limits)
├── 04-error-reference.md            ← HTTP codes + exception mapping + business error messages
├── 05-rate-limiting.md              ← 429 mechanics, Retry-After, best practices
├── 06-common-patterns.md            ← CRUD, bulk, upload, OtherProperties, soft delete
├── 07-fields-and-entities.md        ← FULL custom-field workflow (FieldsEntities/FieldsTypes/Fields)
├── 09-portuguese-reference.md       ← PT-BR ↔ API endpoint + EntityId + PT-named FieldKeys
├── endpoints/                       ← entity route files
│   └── _index.md                    ← MASTER ROUTE TABLE — open first to find an endpoint file
└── data-models/                     ← domain model files
    └── _index.md                    ← DOMAIN MAP — open first to find a model
```

`endpoints/_index.md` and `data-models/_index.md` are navigation aids — open them freely to find the right per-entity / per-domain file. Everything else: open on demand.

---

## 8. Honest limits of this skill

- Documentation reflects the API at extraction time. If the user describes behavior that contradicts a reference file, the live API is the source of truth — flag the discrepancy and suggest verifying via `GET /$metadata`.
- The skill does NOT execute API calls. It generates correct calls and explains responses.
- For anything not covered by this skill's reference files (e.g. infrastructure questions, deployment topology), say so explicitly — do not improvise.

