# /Deals

> **Call form.** Bound actions and functions take the key in parentheses and the bare
> name: `/Deals({id})/Win`, `/Deals({id})/ValidateChecklist`, `/Deals/Merge`,
> `/Deals/GetDeletedDeals`. The `Default.` prefix, a trailing `()` and the key as a
> path segment all fail — see
> [03 §9](../03-odata-reference.md#9-non-conventional-actions-and-functions).

> Deals represent sales opportunities in the CRM pipeline. Each deal tracks a potential sale through configurable pipeline stages until it is won, lost, or reopened.

## Key Business Rules

- Deals belong to a **Pipeline** with defined **Stages**
- Deals have a **Status**: Open (1), Won, Lost
- Moving between stages may be restricted by pipeline configuration (e.g., `MustPassAllStages`, `ForbiddenStageReturn`)
- **Winning** a deal may require passing all stages and completing checklists
- **Losing** a deal requires a `LossReasonId`
- Deals can be **merged** (source deal absorbed into target deal)
- Deals support **custom fields** via `OtherProperties`
- The `Editable` and `Deletable` fields indicate whether the current user has permission to modify/delete

## Data Model

See [Deal data model](../data-models/deal.md#deal) for the full property table with settability information.

## /Deals

### GET `/Deals`

- **OData queryable**: Yes (`$filter`, `$select`, `$expand`, `$orderby`, `$top`, `$skip`, `$count`, `$apply`)
- **Response**: JSON

### POST `/Deals`

- **Parameters**:
  - `webhooks`: `bool` (default: `true`)
- **Response**: Entity (entity)
- **Body**: JSON object with entity fields
- Supports `?webhooks=false` to suppress webhook emission

### PATCH `/Deals/{key}`

- **Parameters**:
  - `key`: `int`
  - `webhooks`: `bool` (default: `true`)
- **Response**: Entity (entity)
- **Body**: JSON delta (only changed fields)
- Supports `?webhooks=false` to suppress webhook emission

### DELETE `/Deals/{key}`

- **Parameters**:
  - `key`: `int`
- **Response**: `200 OK`
- Performs soft delete

### POST `/Deals/{key}/Win`

Mark a deal as won. May fail if pipeline requires all stages to be passed or if there are pending checklists.

- **Parameters**:
  - `key`: `int` — Deal ID
  - `webhooks`: `bool` (default: `true`)
- **Response**: Updated deal (entity)
- **Errors**:
  - `401` — "Your profile doesn't have permission to win a deal"
  - `401` — "MayWinDeals is false: cannot win deals on this pipeline."
  - `401` — "WinDealOnLastStage is true: cannot win deal on stage other than last one."
  - `401` — "There is a pending checklist to be completed" 

### POST `/Deals/{key}/Lose`

Mark a deal as lost. Requires a `LossReasonId`.

- **Parameters**:
  - `key`: `int` — Deal ID
  - `webhooks`: `bool` (default: `true`)
- **Body**:
```json
{
  "LossReasonId": 42
}
```
- **Response**: Updated deal (entity)
- **Errors**:
  - `401` — "Your profile doesn't have permission to lose a deal"
  - `401` — "MayLoseDeals is false: cannot lose deals on this pipeline." 

### POST `/Deals/{key}/Reopen`

- **Parameters**:
  - `key`: `int`
  - `webhooks`: `bool` (default: `true`)
- **Response**: Entity (entity)

### POST `/Deals/{key}/MarkAsRead`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)

### POST `/Deals/{key}/UploadFile`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)

### GET `/Deals/GetAmountSumByCurrencySymbol`

- **OData queryable**: Yes (`$filter`, `$select`, `$expand`, `$orderby`, `$top`, `$skip`, `$count`, `$apply`)
- **Response**: JSON

### GET `/Deals/{key}/ValidateChecklist`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)

### GET `/Deals/{key}/GetApplicableChecklists`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)

### GET `/Deals/GetDeletedDeals`

- **Response**: Entity (entity)

### POST `/Deals/IsDuplicate`

- **Response**: `boolean`

### POST `/Deals/{key}/IsDuplicate`

- **Parameters**:
  - `key`: `int`
- **Response**: `boolean`

### GET `/Deals/GetDealsByContactId`

> ⚠️ **Broken**: answers `500 "Unable to translate set operation"`. Use
> `GET /Deals?$filter=ContactId eq {id}` instead, which also accepts the full set of
> query options.

Get all deals for a specific contact. Restricted OData options: only `$select`, `$top`, `$skip`, `$expand`, `$orderby`, `$count` (no `$filter`, no `$apply`).

- **OData queryable**: Yes (`$filter`, `$select`, `$expand`, `$orderby`, `$top`, `$skip`, `$count`, `$apply`)
- **Parameters**:
  - `contactId`: `int` (default: `0`)
  - `pipelineId`: `int` (default: `0`)
- **Response**: Entity (entity)

### POST `/Deals/Merge`

Merge two deals. The source deal is absorbed into the target deal.

- **Body**:
```json
{
  "SourceDealId": 123,
  "TargetDealId": 456
}
```
- **Response**: `204 No Content`
- **Errors**:
  - `401` — "You don't have permission to merge deals."
  - Various errors if deals are in different pipelines, have different owners, etc.

### POST `/Deals/{key}/Read2`

- **Parameters**:
  - `key`: `int`
- **Response**: `200 OK`

### POST `/Deals/{key}/Unread`

- **Parameters**:
  - `key`: `int`
- **Response**: `200 OK`

### GET `/Deals/ValidateIfUserCanEditDealByDealId`

- **Parameters**:
  - `orderId`: `int`
- **Response**: JSON

### GET `/Deals/AggregateByOtherProperties`

- **Response**: Entity (entity)

## /DealsStagesHistory

### GET `/DealsStagesHistory`

- **Response**: Entity (entity)

> The name `/Deals@Fields@Status@History` documented previously answers `404`.

## /DealsContactsProducts

### GET `/DealsContactsProducts`

- **Response**: Entity (entity)

### GET `/DealsContactsProducts/AggregateByOtherProperties`

- **Response**: Entity (entity)

## /DealsFieldsStatus

### GET `/DealsFieldsStatus`

- **Response**: Entity (entity)

### POST `/DealsFieldsStatus`

- **Parameters**:
  - `adminValidation`: `bool` (default: `false`)
- **Response**: Entity (entity)
- **Body**: JSON object with entity fields
- Supports `?webhooks=false` to suppress webhook emission

### PATCH `/DealsFieldsStatus/{key}`

- **Parameters**:
  - `key`: `int`
  - `adminValidation`: `bool` (default: `false`)
- **Response**: Entity (entity)
- **Body**: JSON delta (only changed fields)
- Supports `?webhooks=false` to suppress webhook emission

### DELETE `/DealsFieldsStatus/{key}`

- **Parameters**:
  - `key`: `int`
  - `adminValidation`: `bool` (default: `false`)
- **Response**: `200 OK`
- Performs soft delete

## /DealsLossReasons

### GET `/DealsLossReasons`

- **Response**: Entity (entity)

### POST `/DealsLossReasons`

- **Response**: Entity (entity)
- **Body**: JSON object with entity fields
- Supports `?webhooks=false` to suppress webhook emission

### PATCH `/DealsLossReasons/{key}`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)
- **Body**: JSON delta (only changed fields)
- Supports `?webhooks=false` to suppress webhook emission

### DELETE `/DealsLossReasons/{key}`

- **Parameters**:
  - `key`: `int`
- **Response**: `200 OK`
- Performs soft delete

### GET `/DealsLossReasons/GetDeletedDealLossReasons`

> ⚠️ **Answers `500 "A possible object cycle was detected"`.** Listing is not
> recovery either way: there is no restore action (see
> [06 · Deleted Records](../06-common-patterns.md#deleted-records)).

- **Response**: Entity (entity)

## /DealsPipelines

### GET `/DealsPipelines`

- **Response**: Entity (entity)

### GET `/DealsPipelines/GetWithDealsCount`

> Called with no arguments this answers `400`: it requires parameters that
> `$metadata` does not declare, and which are not documented here yet.

- **Response**: Entity (entity)

### GET `/DealsPipelines/GetWithDealsCountV2`

- **Response**: Entity (entity)

### GET `/DealsPipelines/GetWithDealsCountByContact`

- **Parameters**:
  - `contactId`: `int` (default: `0`)
- **Response**: Entity (entity)

### POST `/DealsPipelines/CountDealsByContact`

- **Response**: `List<DealPipelineWithDealCount>`

### POST `/DealsPipelines/CountDeals`

- **Response**: `List<DealPipelineWithDealCount>`

### POST `/DealsPipelines`

- **Response**: Entity (entity)
- **Body**: JSON object with entity fields
- Supports `?webhooks=false` to suppress webhook emission

> **A pipeline created here has no table (view) and cannot be displayed.** The web
> interface creates three by default ("em aberto", "ganhos", "perdidos"); this
> `POST` creates none, and the screen resolves a pipeline's views before its deals.
> Create each view with `POST /Tables`, then attach them with a `PATCH` on the
> pipeline carrying a `Tables` array — there is no entity set for the relation. See
> [DealPipeline](../data-models/deal.md#dealpipeline).

### PATCH `/DealsPipelines/{key}`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)
- **Body**: JSON delta (only changed fields)
- Supports `?webhooks=false` to suppress webhook emission

### DELETE `/DealsPipelines/{key}`

- **Parameters**:
  - `key`: `int`
- **Response**: `200 OK`
- Performs soft delete

### POST `/DealsPipelines/{key}/Duplicate`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)

### POST `/DealsPipelines/Sort`

- **Parameters**:
  - `sortStarred`: `bool` (default: `false`)
- **Response**: `200 OK`

### POST `/DealsPipelines/{key}/UserPreferences`

- **Parameters**:
  - `key`: `int`
- **Response**: `200 OK`

### GET `/DealsPipelines/UserPreferencesLastUpdateDate`

- **Response**: JSON

### GET `/DealsPipelines/GetDeletedPipelines`

> ⚠️ **Answers `500 "A possible object cycle was detected"`.** Listing is not
> recovery either way: there is no restore action (see
> [06 · Deleted Records](../06-common-patterns.md#deleted-records)).

- **Response**: Entity (entity)

## /DealsPipelinesStatus

### GET `/DealsPipelinesStatus`

- **Parameters**:
  - `pipelineId`: `int`
- **Response**: Entity (entity)

### GET `/DealsPipelinesStatus`

- **Response**: Entity (entity)

### POST `/DealsPipelinesStatus`

- **Response**: Entity (entity)
- **Body**: JSON object with entity fields
- Supports `?webhooks=false` to suppress webhook emission

### PATCH `/DealsPipelinesStatus/{key}`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)
- **Body**: JSON delta (only changed fields)
- Supports `?webhooks=false` to suppress webhook emission

### DELETE `/DealsPipelinesStatus/{key}`

- **Parameters**:
  - `key`: `int`
- **Response**: `200 OK`
- Performs soft delete

## /DealsPipelinesUserUsabilities

### GET `/DealsPipelinesUserUsabilities`

- **Response**: Entity (entity)

## /DealsPriority

### GET `/DealsPriority`

- **Response**: Entity (entity)

### POST `/DealsPriority`

- **Parameters**:
  - `adminValidation`: `bool` (default: `false`)
- **Response**: Entity (entity)
- **Body**: JSON object with entity fields
- Supports `?webhooks=false` to suppress webhook emission

### PATCH `/DealsPriority/{key}`

- **Parameters**:
  - `key`: `int`
  - `adminValidation`: `bool` (default: `false`)
- **Response**: Entity (entity)
- **Body**: JSON delta (only changed fields)
- Supports `?webhooks=false` to suppress webhook emission

### DELETE `/DealsPriority/{key}`

- **Parameters**:
  - `key`: `int`
  - `adminValidation`: `bool` (default: `false`)
- **Response**: `200 OK`
- Performs soft delete

## /DealsStages

### GET `/DealsStages`

- **Response**: Entity (entity)

### GET `/DealsStages/GetDeletedDealStages`

- **Response**: Entity (entity)

## /DealsStagesHistory

### GET `/DealsStagesHistory`

- **Response**: Entity (entity)

## /DealsStatus

### GET `/DealsStatus`

- **Response**: Entity (entity)
