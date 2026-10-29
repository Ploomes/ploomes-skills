# OData v4 — PloomesCRMAPI-2 (AI-first reference)

> Audience: code-generating agents and LLM-driven integrations.
> Goal: produce valid, executable OData v4 requests against this API on the first attempt.

---

## 1. Base contract

| Item                    | Value                                                                                                     |
| ----------------------- | --------------------------------------------------------------------------------------------------------- |
| Protocol                | OData v4                                                                                                   |
| Base URL                | **Dynamic** — resolved from `GET /Account?$expand=HostSet` (see Architecture Overview)                     |
| Auth header             | `User-Key: <key>`                                                                                         |
| Content-Type (writes)   | `application/json` (PascalCase)                                                                           |
| Casing                  | **PascalCase everywhere** (entities, properties, query option values) except odata operators (ne, gt, lt) and boolean literals (`true`/`false`, not `True`/`False`) |
| OData metadata document | `GET /$metadata`                                                                                          |
| Service document        | `GET /`                                                                                                   |

Authentication is required on every request. Sessions are scoped by tenant (`AccountId`) and user — every collection result is row-filtered by the calling user.

---

## 2. Supported query options (global)

All standard OData v4 query options are supported on collection endpoints:

| Option        | Notes                                                                                                |
| ------------- | ---------------------------------------------------------------------------------------------------- |
| `$filter`     | Standard predicates + `any/all` (lambda depth limited, see §3)                                       |
| `$select`     | PascalCase property names; supports navigation properties (`$select=Contact/Name`)                   |
| `$expand`     | Max depth = 8 (global); supports nested options: `$expand=Contact($select=Name;$filter=...;$top=10)` |
| `$orderby`    | `asc` / `desc`; supports navigation (`Contact/Name desc`)                                            |
| `$top`        | Bounded by per-endpoint `MaxTop` (see §4)                                                            |
| `$skip`       | No upper bound                                                                                       |
| `$count=true` | **Eagerly computed** before serialization (see §6)                                                   |
| `$apply`      | Aggregations; **materializes results in memory** (see §7)                                            |
| `$search`     | Not used; prefer `$filter` with `contains/startswith`                                                |

> **Do not use `$compute`.** The OData stack accepts the token but downstream behavior is unreliable in this API — derived aliases do not consistently round-trip through `$select` / `$filter` / `$orderby`. Express the computation client-side, or push it into `$apply=aggregate(... with ...)`.

### 2.1. `$filter` predicate semantics — nullable fields (`ne`, not `eq`, for "is not X")

Most non-required columns are **nullable**, and for the majority of rows they are stored as `null` — **not** as the type's "default" value (`false` for booleans, `0` for numbers). A column is nullable whenever `/Fields` reports `Required: false` for it.

So:

- `Flag eq false` matches **only** rows explicitly set to `false` — it **silently excludes every `null` row**. On a field that is `null` for most records, this returns few or **zero** results even though the data exists.
- `Flag eq true` likewise excludes `null`.

**Rule:** to express *"the flag is not set / not true"*, use **`Flag ne true`** (matches both `null` and `false`). For *"not false"*, use `Flag ne false`. Reserve `eq true` / `eq false` for columns you know are non-nullable (`Required: true`).

---

## 3. Hard validation limits (effective on every Get endpoint)

These limits are enforced server-side on every GET collection endpoint.

| Validator                                            | Effective limit                                   |
| ---------------------------------------------------- | ------------------------------------------------- |
| `MaxExpansionDepth` (`$expand` nesting)              | **8**                                             |
| `MaxAnyAllExpressionDepth` (`any()`/`all()` nesting) | **2**                                             |
| `MaxNodeCount` (filter AST size)                     | **220**                                           |
| `MaxTop`                                             | **1000** (default) — overridden per route, see §4 |

> `MaxTop` is a **validation ceiling, not a promise about page size** — `$top=1001` returns `400`. Never infer "end of collection" from a page shorter than `$top`; stop when a page comes back empty (§5).

> Hitting one of these returns `400 Bad Request` from the OData validator. If a generated query expands more than 8 levels or nests `any/all` more than twice, the agent must rewrite it.

---

## 4. Per-endpoint `$top` limits (distinct from the 1000 default)

| Route                               | `MaxTop`                              |
| ----------------------------------- | ------------------------------------- |
| `/Tags`                             | **10000**                             |
| `/ContactsOrigins`                  | **10000**                             |
| `/FieldsOptionsTablesOptions`       | **10000**                             |
| Every other GET collection endpoint | **1000**                              |

Notes:
- `MaxTop = 1000` is the only ceiling the validator enforces. To walk a result larger than `MaxTop`, page by keyset — `$orderby=Id&$top=N&$filter=… and Id gt <last Id of the previous page>` — and stop when a page comes back **empty**. **Do not page with `$skip`** and **do not rely on `@odata.nextLink`** — see §5.
- `/Products/Search` returns `405` and is absent from `$metadata`. Use `/Products/SmartSearch?text=`, or `SearchByName`, `SearchByNameOrCode`, `SearchByNameOrExactCode`.
- `/Deals/GetDealsByContactId` restricts options to `$select`, `$top`, `$skip`, `$expand`, `$orderby`, `$count` (no `$filter`, no `$apply`).



---

## 5. Paging (keyset on `Id` — do NOT use `$skip` or `@odata.nextLink`)

**`@odata.nextLink` does not work in this API** — it is either absent, malformed, or points at a URL that fails to round-trip. **Treat it as unreliable and ignore it.**

The server may also cap the page size returned, regardless of the client's `$top`. The client must walk pages itself.

**`$skip` silently drops rows.** On a collection that changes while it is being read, offset paging re-shuffles rows under the cursor: a measured scan of 27,099 rows lost 196 of them with no error. Page by the key instead.

Recommended client pattern:
1. Issue `GET /Set?$orderby=Id&$top=N&$filter=<your filter>` (with whatever `$select`/`$expand` you need).
2. Take the **largest `Id` of the root rows** in the response — never an `Id` from an expanded child.
3. Repeat with `$filter=<your filter> and Id gt <that Id>`.
4. **Stop only when a page comes back empty.**
5. Don't page with `$skip`, don't read `@odata.nextLink`, and don't synthesize one.

> **Always end `$orderby` with `Id` as a tiebreaker.** Any sort on a non-unique column (`Name`, `CreateDate`, a custom ordinal…) leaves rows with equal values in an undefined order, so pages reshuffle and silently drop or duplicate records between pages. Append `,Id` to make the ordering total: `$orderby=Name asc,Id asc`, `$orderby=CreateDate desc,Id`, `$orderby=Priority asc,Id asc`. Do this unconditionally — append `,Id` to any sort on a non-unique column. When there is no chosen sort, order by `Id` alone.
>
> **Why keyset and not `$skip`.** Besides losing rows on a moving collection, `$skip` gets progressively slower at large offsets, because the server counts past every skipped row instead of seeking. Keyset paging stays fast at any depth.
>
> **Right-size the page.** For screen-facing lists, a `$top` of roughly **50–200** balances payload size against the number of round-trips — don't fetch the maximum just because you can. Reserve `$top=1000` for background scans that genuinely need the whole set (§15.3). Fewer, right-sized pages also mean fewer requests counting against the rate limit.

If you need the total upfront (to size progress bars), make a single `$apply=aggregate($count as Count)` call instead of `$count=true` — see §6 / §7.1.

---

## 6. `$count` semantics — eager computation

`$count=true` is computed **before** the response body starts. This protects clients from `ERR_HTTP2_PROTOCOL_ERROR` when the count query times out mid-stream. Practical consequences:

- A `$count=true` request can return `504 Gateway Timeout` on very large filtered sets. Retry without `$count` if you only need the items.
- The count reflects the **filtered** total (after `$filter`, before `$skip`/`$top`).
- Response shape: `{ "@odata.count": <long>, "value": [ … ] }`.

### 6.1. Fast-count pattern — a separate, lightweight query

**Do not hang `$count=true` on the query that fetches the data.** If the count times out, it takes the whole list down with it, and expanding + counting in one request is the slowest possible shape. Instead, fire the count as its own decoupled request that materializes nothing:

```http
GET /Deals?$count=true&$select=Id&$top=0&$filter=PipelineId eq 10001
```

`$top=0` returns zero rows, `$select=Id` projects a single column, so the server only computes `@odata.count` — the number arrives cheaply and independently of the data page. Use this everywhere a total is shown (list totals, tab counters, "N de TOTAL" summaries): one light count query alongside the real data query, never `$count=true` on the data query itself.

For an alternative that also returns just a number, `$apply=aggregate($count as Count)` works too (§7.1) — but the `$count=true&$select=Id&$top=0` form is preferred and composes directly with an existing `$filter`.

---

## 7. `$apply` — aggregations & grouping

`$apply` is supported, with two limits that are easy to hit. Behavior:

- The entire aggregated result is **materialized in memory**. Do not run `$apply` over unbounded data sets — narrow with `filter(...)` first.
- When `$apply` is present, `$top`/`$skip`/`$count` interact only with the aggregated rows.
- **It cannot group by a nested collection property.** `groupby((OtherProperties/IntegerValue),…)` returns `400`; there is no `$apply` route to "count deals by custom field value".
- The `MaxAnyAllExpressionDepth` limit of **2** (§3) applies inside `$apply` too: at most two nested `any()`.

### 7.1. Quick aggregate cookbook

Examples sourced from the official Ploomes Postman collection `API 2.1 - odata v4`. All URLs are relative to `{base_url}` and require the `User-Key` header.

**Count rows:**
```http
GET /Orders?$apply=aggregate($count as Count)
```

**Max / Min / Sum / Average of a numeric column:**
```http
GET /Orders?$apply=aggregate(Amount with max as MaxAmount)
GET /Orders?$apply=aggregate(Amount with min as MinAmount)
GET /Orders?$apply=aggregate(Amount with sum as SumAmount)
GET /Orders?$apply=aggregate(Amount with average as AverageAmount)
```

**Distinct count:**
```http
GET /Orders?$apply=aggregate(ContactId with countdistinct as DistinctContacts)
```

**Multiple aggregates in one call:**
```http
GET /Orders?$apply=aggregate(
    Amount with sum as SumAmount,
    Amount with max as MaxValue,
    Amount with min as MinValue)
```

**Group by a single property:**
```http
GET /Orders?$apply=groupby((OwnerId))
GET /Orders?$apply=groupby((OwnerId),aggregate($count as Count))
```

**Group by + aggregate:**
```http
GET /Orders?$apply=groupby(
    (ContactId),
    aggregate(Amount with average as AverageAmount))
```

**Group by navigation chains (multi-level):**
```http
GET /Orders?$apply=groupby(
    (Contact/State/Name, Contact/Country/Name),
    aggregate(Amount with average as AverageAmount))
```

**Group by + multiple aggregates + order:**
```http
GET /Orders?$apply=groupby(
    (ContactId),
    aggregate(
        Amount with sum as SumAmount,
        Amount with max as MaxValue,
        Amount with min as MinValue))
&$orderby=MaxValue desc
```

**Chained transformations (groupby → aggregate):**
```http
GET /Orders?$apply=groupby(
    (ContactId),
    aggregate(Amount with sum as AmountSum))
/aggregate(AmountSum with average as ClientAverage)
```

### 7.2. Filtering combined with `$apply`

The order of `filter(...)` / `groupby(...)` / `aggregate(...)` inside `$apply` matters. There are three valid placements:

**Filter AFTER aggregation (`$filter` on aggregated columns):**
```http
GET /Orders?$apply=groupby(
    (ContactId),
    aggregate(
        Amount with sum as SumAmount,
        Amount with max as MaxValue,
        Amount with min as MinValue))
&$filter=MinValue gt 0
```

**Filter BEFORE aggregation (narrow rows first — recommended for large tables):**
```http
GET /Orders?$apply=filter(
    CreateDate gt 2025-01-01
)/groupby(
    (ContactId),
    aggregate(
        Amount with sum as SumAmount,
        Amount with max as MaxValue,
        Amount with min as MinValue))
```

**Filter IN THE MIDDLE (between two transformations — HAVING-style):**
```http
GET /Orders?$apply=groupby(
    (ContactId),
    aggregate(
        Amount with sum as AmountSum,
        $count as Count)
)/filter(
    Count lt 50
)/aggregate(AmountSum with max as MaxSum)
```

**Filter on a sub-entity (`any()`):**
```http
GET /Orders?$apply=filter(
    Contact/OtherProperties/any(op: op/BoolValue eq true)
)/groupby(
    (ContactId),
    aggregate(
        Amount with sum as SumAmount,
        Amount with max as MaxValue,
        Amount with min as MinValue))
```

> Reminder: `any()`/`all()` nesting is capped at depth 2 (§3).

### 7.3. Realistic dashboard query (sales pipeline cards)

```http
GET /Deals
  ?$filter=StageId in (100001,100002,100003)
           and PipelineId eq 10001
           and (StatusId eq 1)
  &$apply=groupby(
      (PipelineId, StageId, StatusId, Stage/Name, Currency/Symbol),
      aggregate(
          Amount with sum as StageSum,
          Id with countdistinct as DealsCount))
  &$orderby=StageSum asc
```

---

## 8. `?preload` — use this when `$expand` is heavy or the query is slow

`preload` is a custom, non-OData query parameter (no `$` prefix) that swaps the execution strategy when navigation properties blow up the generated SQL.

**Reach for `preload` whenever any of these is true:**

- The request has many `$expand`s, especially **nested ones** (`$expand=Contact($expand=City($expand=Country))`).
- A specific endpoint is consistently slow or times out, and the result set is not huge (hundreds, not hundreds of thousands).
- A previous attempt without `preload` returned `504 Gateway Timeout`.

**How it works:**

1. **Phase 1 — SQL:** apply `$filter` + `$orderby` + `$skip` + `$top` against the database and materialize *only* the page of root rows.
2. **Phase 2 — in-memory:** apply `$expand` + `$select` against the materialized list, fetching each navigation collection separately.

This avoids a single mega-`JOIN` that the query optimizer can't handle. Trade-off: per-page overhead grows with the number of expanded navigations (extra round-trips), so don't combine it with `$top` values in the thousands.

```http
GET /Deals?$top=50&$expand=Contact($select=Name),Stage&preload
```

```http
GET /Deals
  ?$top=100
  &$filter=PipelineId eq 10001
  &$expand=Contact($select=Name,City;$expand=City($select=Name)),Stage,Currency,Owner
  &$orderby=Id asc
  &preload
```

**`preload` is not a safe default — it is a targeted fix.** Reach for it when the expansion is genuinely deep (3 levels or more) and the page is small. On measured queries it made things *slower*: same query at `$top=100` went from ~5 s to ~7 s with `preload`, and at `$top=500` from ~16 s to ~18 s. Under `preload` a timeout also stops being a clean `504` JSON error and becomes the gateway's HTML `504` at around 180 s.

What actually drives the cost is `$expand=OtherProperties` with no inner `$select`, and queries with no `$top` at all: adding an inner `$select` took one measured read from ~16 s / ~14 MB down to ~5,7 s / ~4,2 MB. Fix the projection first (§15.1), then consider `preload`.


Notes:
- Written as `preload=true` by convention. The parameter needs no meaningful value — bare `&preload` is also accepted — but `preload=true` is the canonical spelling.
- `preload` is **not** combinable with `$apply` — the apply branch is taken first and `preload` is ignored. Aggregation/kanban queries never carry it.
- `$count=true` still works under `preload` and is computed eagerly before phase 1.
- Don't pair `preload` with `$top` in the thousands — the per-page in-memory fetch of each navigation makes wide pages expensive.

---

## 9. Non-conventional actions and functions

Many entity sets expose OData actions (`POST`) and functions (`GET`) beyond CRUD, routed under the entity set, e.g. `/Deals({id})/Win`, `/Deals/Merge`.

Selected examples:

**Deals**
- Entity actions: `Win`, `Lose`, `Reopen`, `MarkAsRead`, `UploadFile`, `Read2`, `Unread`, `IsDuplicate`
- Collection action: `Merge` (body `{ "SourceDealId": int, "TargetDealId": int }`)
- Functions: `GetApplicableChecklists`, `ValidateChecklist`, `GetAmountSumByCurrencySymbol`, `GetDeletedDeals`, `GetDealsByContactId(contactId, pipelineId)`, `ValidateIfUserCanEditDealByDealId`, `AggregateByOtherProperties`

**Contacts**
- Entity actions: `UploadFile`, `UploadAvatar`, `UploadAvatarFromUrl`, `IsDuplicate`, `IsForeignZipCodeDuplicate`, `IsPhoneDuplicate`
- Collection: `GetDeletedContacts`
- Function: `AggregateByOtherProperties`

**Products**
- `/Products/SmartSearch?text=...` — text search; also `SearchByName`, `SearchByNameOrCode`, `SearchByNameOrExactCode`
- `/Products/Search?text=...` and `/Products/SmartSearchV2?text=...` — `405`; use `SmartSearch` (see §4)

**Call form — by bare name, with the key in parentheses.** There is exactly one shape that works:

- Bound to one record: `{Set}({id})/{Name}` — `GET /Deals(123)/ValidateChecklist`, `POST /Quotes(123)/NewComment`.
- Bound to the collection: `{Set}/{Name}?arg=value` — `GET /Deals/GetDeletedDeals`, `POST /Deals/Merge`.

Everything else fails:

| Form | Result |
|---|---|
| `/Deals({id})/Default.ValidateChecklist` | `404` |
| `/Deals({id})/ValidateChecklist()` | `404` |
| `/Deals/{id}/ValidateChecklist` (key in a path segment) | `500` "The request matched multiple endpoints" |
| `/Deals/Default.GetDeletedDeals` | `404` |
| `/Deals/Default.GetDealsByContactId(contactId=…)` | `404` |

The same `500` from the key-in-a-path-segment form was measured on `Deals({key})/GetApplicableChecklists`, `Attachments({key})/GetById` and the `AttachmentsFolders` permission routes.

---

## 10. Entity sets (collection routes)

Comprehensive list (~190 routes). Group them mentally:

- **Core CRM**: `/Contacts`, `/Deals`, `/Leads`, `/Quotes`, `/Orders`, `/Documents`, `/Tasks`, `/Products`, `/Forms`, `/Tables`, `/Fields`
- **Engagement**: `/Chats`, `/Messages`, `/Emails`, `/Comments`, `/InteractionRecords`, `/Notifications`, `/Timeline`
- **Configuration / lookup**: `/Currencies`, `/Languages`, `/Cities`, `/PhoneTypes`, `/Departments`, `/Teams`, `/IntervalUnits`, `/RelativeDates`, `/Tags`, `/Genders`, `/Icons`
- **Pipeline taxonomy**: `/DealsPipelines`, `/DealsPipelinesStatus`, `/DealsStages`, `/DealsStatus`, `/DealsLossReasons`
- **Product catalog (CPQ)**: `/Products`, `/ProductsFamilies`, `/ProductsGroups`, `/ProductsLists`, `/ProductsParts`, `/ProductsPartsGroups`
- **Document line items**: `/OrdersProducts`, `/OrdersProductsParts`, `/QuotesProducts`, `/QuotesProductsParts`, `/DocumentsProducts`, `/DocumentsProductsParts`
- **Automation/workflow**: `/Automations`, `/AutomationsLogs`, `/AutomationsTriggers`, `/AutomationsStatus`, `/BusinessRules`, `/BusinessRulesActions`, `/Approvals`, `/BulkProcedures`
- **Account / tenant**: `/Account`, `/AccountIntegrations`, `/Self`, `/SelfCounters`, `/SelfEmailIntegration`, `/SelfGoogleCalendarIntegration`
- **Webhooks & integrations**: `/Webhooks`, `/MobileWebhooks`, `/Integrations`, `/IntegrationsTypesTypes`
- **Importation**: `/Importations`, `/ImportationTemplates`, `/ContactsImports`
- **Reports**: `/Reports`, `/PipelineReports`, `/Panels`, `/PanelsCharts`, `/PanelsGoals`
- **Search**: `/GeneralSearch`
- **Public (external-facing)**: `/PublicForms`, `/PublicDocuments`, `/PublicQuotes`, `/PublicOrders`, `/PublicFormsDeals`, `/PublicRelatedPeople`

Use `GET /$metadata` for the authoritative, machine-readable schema.

---

## 11. CRUD shape

All standard CRUD verbs follow the same conventions across every set:

| Method   | Path         | Body        | Returns                                                           |
| -------- | ------------ | ----------- | ----------------------------------------------------------------- |
| `GET`    | `/Set`       | —           | OData collection (paged) — `{ "value": [ … ] }`                    |
| `GET`    | `/Set?$filter={Key} eq {value}` | — | One record — same envelope, one element: read `value[0]` (see note below) |
| `POST`   | `/Set`       | JSON entity | The created entity (projected), **inside the collection envelope** |
| `PATCH`  | `/Set({key})` | JSON delta for scalars; **any nested collection in the body replaces the stored one** — see [06 · Nested Objects](06-common-patterns.md#nested-objects) | The updated entity (projected), **inside the collection envelope** |
| `DELETE` | `/Set({key})` | —           | `200 OK` (soft delete)                                            |

> **The body is never the bare entity — it is wrapped in the OData collection envelope.**
> Every response that carries an entity carries it as an element of `value`, even when there
> is exactly one element, and **including on writes**:
>
> ```json
> { "@odata.context": "…#Tasks(Id,Title,…)", "value": [ { "Id": 2301, "Title": "Mandar e-mail" } ] }
> ```
>
> Read the record as `value[0]`, never off the top level. The per-endpoint pages say
> `Response: Entity` — that names the **type of the element inside** `value`, not the shape of
> the body. Reading the body as if it were the entity still type-checks and compiles; it then
> renders blank fields right after a create or an edit, which is how this normally surfaces. A
> tolerant read covers both shapes: `const entity = body.value?.[0] ?? body`.
>
> This is the rule, not a per-endpoint quirk: `/Self` and `/Account` are documented with
> `value[0]` because they always hold a single element, not because they are exceptions.
>
> Scope: this covers the standard CRUD verbs on every entity set. The non-conventional
> actions and functions of §9 are outside this table — some shape their body differently, so
> check the endpoint page rather than assuming the envelope. The tolerant read above is
> correct either way.

> **Reading one record: use `$filter`, not parenthesized key access.** To fetch a single record, query the collection filtering on its primary key — e.g. `GET /Contacts?$filter=Id eq 123`. This is the general, reliable way to read one entity; the key-in-parentheses form (`GET /Set({key})`) should **not** be assumed for reads. Specific endpoints may document key access explicitly, but they are the exception — default to `$filter`. Note the primary key is usually `Id`, but **not always** (some sets key on another property, such as `Key`); check `/$metadata` or the entity's own doc for the actual key before filtering. Parenthesized key access **is** the correct form for writes (`PATCH`/`DELETE /Set({key})`) and for action/function sub-routes (§9).

Special headers / query params:
- `?webhooks=false` — suppress outbound webhook emission for the write.
- All writes accept JSON with PascalCase property names.

---

## 12. `OtherProperties` (schema-less custom fields)

Custom fields are exposed as a navigation collection `OtherProperties` on each parent entity. Metadata lives in `/Fields`. On writes, send:

```json
{
  "OtherProperties": [
    { "FieldKey": "contact_abc123", "StringValue": "ACME" },
    { "FieldKey": "contact_def456", "DecimalValue": 199.90 },
    { "FieldKey": "contact_ghi789", "IntegerValue": 7 }
  ]
}
```

Settable columns: `FieldKey` (required), `StringValue`, `BigStringValue`, `IntegerValue`, `DecimalValue`, `DateTimeValue`, `BoolValue`. All other columns (`ObjectValueId`, `UserValueId`, etc.) are read-only. Filtering example:

```http
GET /Contacts?$filter=OtherProperties/any(op: op/FieldId eq 123 and op/StringValue eq 'ACME')
```

(Stays within the `any/all` depth-2 limit.)

---

## 13. Error model

- `400 Bad Request` — OData validation (limits, malformed filter), business rules, missing required fields.
- `401/403` — auth / scope.
- `404` — entity / key not found, or not visible to the calling user (row-level security).
- `429` — rate limit (middleware-driven).
- `504` — usually a slow `$count=true` or a heavy `$apply` over unbounded data, or just a heavy uery in gene

Error envelope follows OData v4: `{ "error": { "code": "...", "message": "..." } }`.

---

## 14. Quick "make it work" checklist for AI agents

When generating a query, verify in this order:

1. **Auth**: did you set `User-Key`?
2. **Casing**: are entity / property / option-value names PascalCase?
3. **`$expand` depth ≤ 8**, **`any/all` depth ≤ 2**, **filter AST nodes ≤ 220**.
3b. **Nullable flags**: filtering a `Required: false` boolean? Use `ne true` / `ne false` — never `eq false` / `eq true`, which drop every `null` row and silently empty the result (§2.1).
4. **`$top`** ≤ 1000 unless the route is `/Tags`, `/ContactsOrigins`, or `/FieldsOptionsTablesOptions` (10000). A short page never means "end of collection" (§3, §5).
5. **Never use `$compute`.** Compute client-side, or push it into `$apply=aggregate(...)`.
6. **Never page with `$skip`, never rely on `@odata.nextLink`.** Page by keyset: `$orderby=Id` + `$top=N` + `$filter=… and Id gt <last Id>`, stopping only when a page comes back **empty**. **End every `$orderby` with `Id`** as a tiebreaker so pages don't reshuffle (§5).
7. For aggregations, prefer **`filter(...)`/`groupby(...)`/`aggregate(...)` inside `$apply`** over post-filtering when the dataset is large. Put `$orderby` **outside** `$apply`, on the aggregate alias. `$apply` cannot group by a nested collection property such as `OtherProperties/…` (§7).
8. Need a total? Don't hang `$count=true` on the data query — fire a **separate** `$count=true&$select=Id&$top=0&<filter>` (§6.1). If a `$count=true` is timing out, drop it or switch to `$apply=aggregate($count as Count)`.
9. Don't add `preload=true` reflexively — it made measured queries slower. Fix the projection first (item 10); reach for `preload` when the expansion is 3+ levels deep and the page is small (§8). Never combine it with `$apply`.
10. **Minimize the projection.** Add `$select` on the root **and** inside every `$expand` level; project only `Id` for counts and id-scans (§15.1).
11. **Batching ids?** `in (...)` is only reliable **inside `$apply=filter(...)`**; on a plain top-level `$filter` the account's OData version may reject `Id in (…)` — fall back to an `Id eq … or …` chain, and keep the list short (AST ≤ 220 nodes) (§15.2).
12. For non-CRUD operations, call by bare name: `/{Set}({key})/{Name}` for one record, `/{Set}/{Name}?arg=value` for the collection. No `Default.` prefix, no `()` suffix, and never the key as a path segment — each of those returns `404` or `500` (§9).
13. **Reading one record?** Use `GET /{Set}?$filter={Key} eq {value}` (usually `Id eq …`), **not** `GET /{Set}({key})`. Key-in-parentheses is for writes and action/function routes; single-record reads go through `$filter` unless a specific endpoint documents otherwise (§11).

---

## 15. Efficient query construction

Follow these rules by default on any screen-facing query — they are what keeps queries fast and stable.

### 15.1. `$select` — project the minimum, at every level

Fetch only the columns the screen actually uses, and repeat that discipline **inside each `$expand`**. Every heavy expand carries its own inline `$select`:

```http
GET /Deals
  ?$top=15
  &$filter=StageId eq 100001
  &$select=Id,Title,Amount,StageId,StatusId,OwnerId
  &$expand=Contact($select=Id,Name),Stage($select=Id,Name),Currency($select=Id,Symbol),Owner($select=Id,Name)
  &$orderby=Id asc
  &preload=true
```

Why it matters:
- **Payload size.** Without `$select`, every row ships every column plus every expanded entity in full — the dominant cost on list screens.
- **`504` avoidance.** Narrow projections keep the generated SQL and the serialized response small.
- **Counts and id-scans.** When you only need a total or a set of keys, project **only `Id`** (`$select=Id`) — see §6.1 and §15.3.

There is no server-side "default field set"; the caller is responsible for choosing the columns. Treat a bare query with no `$select` as a smell on any screen-facing read.

### 15.2. Batching ids — `in (...)` vs. the `or`-chain

To fetch/aggregate a known set of ids, the natural form is `... in (id1, id2, …)`. It behaves differently depending on where it sits:

- **Inside `$apply=filter(...)`** — reliable. E.g. `…$apply=filter(StageId in (100001,100002,100003) and PipelineId eq 10001)/groupby(…)`.
- **On a plain top-level `$filter`** — the account's OData version may reject `Id in (…)`. When it does, fall back to an explicit disjunction: `$filter=Id eq 1 or Id eq 2 or Id eq 3`.

Either way, **keep the list bounded**: each term is a node in the filter AST, and the tree is capped at **220 nodes** (`MaxNodeCount`, §3). A few hundred ids is the practical ceiling; beyond that, page the ids in chunks or switch to the two-phase read below.

### 15.3. Two-phase read for heavy or large result sets

When you need many rows *and* a rich `$expand`, don't ask for both at once — the mega-`JOIN` is what times out. Split into two phases:

1. **Scan (light).** Walk the matching keys with a minimal projection and keyset paging:
   `GET /Set?$filter=<predicate>&$select=Id&$orderby=Id asc&$top=1000` then repeat with `… and Id gt <lastId>` until a page comes back **empty** — a short page is not the end (§5).
2. **Hydrate (heavy).** Fetch the matched ids in small batches with the full `$expand`/`$select` and `preload=true`, using the `in`/`or`-chain rule from §15.2.

This keeps each request cheap and predictable for large, expand-heavy loads.

### 15.4. Predicate order inside a flat `$filter` is not a performance lever

A common misconception is that reordering `$filter` predicates (e.g. "most selective first", "indexed column first") speeds up the query. In this API it does **not** — predicate order within a flat `$filter` has no effect on execution; the server's query planner decides the order. Don't spend effort arranging predicates.

What *does* matter structurally:
- **Inside `$apply`, `filter(...)` must come first** — narrow the rows before `groupby`/`aggregate` (§7.2). This is a correctness-and-cost rule, not cosmetic.
- **Narrow before you expand or aggregate.** A tight `$filter` (and, for huge sets, the two-phase scan of §15.3) is what reduces work — not the ordering of the predicates within it.
- **Stay under the AST cap.** Deeply nested `and`/`or` or long `in`/`or`-chains can hit the 220-node limit (§3); flatten or chunk instead of reordering.

### 15.5. Filter literals — quoting, encoding, and helper functions

When building `$filter` values by hand (a URL builder handles percent-encoding for you, but the literal *shapes* are what matter):

- **Strings** are single-quoted and URL-encoded: `contains(Name,'ACME%20Ltda')`. Escape a literal single quote by doubling it (`'O''Brien'`).
- **Case-insensitive text search** wraps both sides in `tolower(...)`: `contains(tolower(Name),'acme')`.
- **Dates** compare against ISO-8601 literals; express a period as a parenthesized range: `(CreateDate ge 2025-01-01 and CreateDate le 2025-01-31)`. For date-only comparison on a datetime column, wrap it with `date(...)`: `date(FinishDate) eq 2025-06-15`.
- **Negation** of a grouped predicate uses `not (...)`.
- **Typed casts** appear where a non-string column is matched textually, e.g. phone search: `contains(cast(p/SearchPhoneNumber,'Edm.String'),'9999')`.
- **Nullable flags** use `ne true` / `ne false`, never `eq false` / `eq true`, to include `null` rows (§2.1).

### 15.6. Prefer `$expand` over multiple round-trips

Fetching a parent together with its related entities in a single `$expand` request is cheaper than issuing a separate call per relation: one round-trip instead of N, a single consistent snapshot, and fewer requests counting against the rate limit. Expand wide but project narrow — pair every `$expand` with an inline `$select` (§15.1), and add `preload=true` when the expansion is heavy (§8).


