# /Quotes

> Quotes (proposals) are versioned documents associated with deals. Each new version is called a "Review". Quotes can be approved, shared externally, and have their HTML generated from templates.

## Key Business Rules

- Quotes are linked to Deals and use Document Templates for HTML generation
- Creating a quote can auto-generate the document (`generateDocument=true`)
- **Review**: Creates a new version of an existing quote (`POST /{id}/Review`)
- Quotes can be **approved** via workflow
- Quotes can be **shared** externally via a public link
- **Signatures** can be set on quotes
- Quotes support OtherProperties (custom fields)
- Comments and external comments can be added to quotes

## Data Model

See [Quote data model](../data-models/quote.md#quote) for the full property table with settability information.

## /Quotes

> Quotes (proposals) are versioned documents associated with deals. Each new version is called a "Review". Quotes can be approved, shared externally, and have their HTML generated from templates.

## Key Business Rules

- Quotes are linked to Deals and use Document Templates for HTML generation
- Creating a quote can auto-generate the document (`generateDocument=true`)
- **Review**: Creates a new version of an existing quote (`POST /{id}/Review`)
- Quotes can be **approved** via workflow
- Quotes can be **shared** externally via a public link
- **Signatures** can be set on quotes
- Quotes support OtherProperties (custom fields)
- Comments and external comments can be added to quotes

### GET `/Quotes`

- **OData queryable**: Yes (`$filter`, `$select`, `$expand`, `$orderby`, `$top`, `$skip`, `$count`, `$apply`)
- **Response**: JSON

### POST `/Quotes`

- **Parameters**:
  - `generateDocument`: `bool` (default: `true`)
  - `webhooks`: `bool` (default: `true`)
  - `lateGenerateDocument`: `bool` (default: `false`)
  - `formTraceId`: `string` (default: `"0"`)
  - `formUniqueId`: `string` (default: `"0"`)
  - `formSaveAttempts`: `int` (default: `0`)
  - `formVersion`: `string` (default: `"0"`)
- **Response**: Entity (entity)
- **Body**: JSON object with entity fields. Accepts nested `Sections`, `Installments`, and `RelatedPeople` arrays. Products are nested inside Sections, and Parts inside Products. See [Nested Objects in Payloads](../06-common-patterns.md#nested-objects-in-payloads-quotes-orders-documents).
- Supports `?webhooks=false` to suppress webhook emission

### POST `/Quotes/{key}/Review`

- **Parameters**:
  - `key`: `int`
  - `generateDocument`: `bool` (default: `true`)
  - `preservePreviousTemplate`: `bool` (default: `false`)
  - `webhooks`: `bool` (default: `true`)
  - `lateGenerateDocument`: `bool` (default: `false`)
  - `formTraceId`: `string` (default: `"0"`)
  - `formUniqueId`: `string` (default: `"0"`)
  - `formSaveAttempts`: `int` (default: `0`)
  - `formVersion`: `string` (default: `"0"`)
- **Response**: Entity (entity)

### PATCH `/Quotes/{key}`

- **Parameters**:
  - `key`: `int`
  - `generateDocument`: `bool` (default: `true`)
  - `preservePreviousTemplate`: `bool` (default: `false`)
  - `webhooks`: `bool` (default: `true`)
  - `lateGenerateDocument`: `bool` (default: `false`)
- **Response**: Entity (entity)
- **Body**: JSON delta for root properties. Accepts nested `Sections` (with their `Products` and `Parts`), `Installments` and `RelatedPeople` arrays — **replace semantics**: children are deleted and recreated with new ids, and any child not resent is deleted. See [Nested Objects in Payloads](../06-common-patterns.md#nested-objects-in-payloads-quotes-orders-documents).
- Supports `?webhooks=false` to suppress webhook emission

> **Every PATCH regenerates the document by default.** `generateDocument` defaults to
> `true`, so a write that only stores data also rebuilds the PDF — measured on a
> Document PATCH that changed a single checkbox. Pass `?generateDocument=false`
> whenever you are only adjusting data.
>
> **A PATCH can send the quote back for approval.** On an account with an approval
> rule (`GET /BusinessRules?$filter=EntityId eq 7`; `4` for Order), a PATCH can move
> `ApprovalStatusId` from null to `1` — measured even when the write stored the
> *same* value it was already holding, and on an automation rewriting an unchanged
> field. Check the account's business rules before scripting a bulk PATCH, or you
> will park every quote in the approver's queue.
>
> **To regenerate on purpose**: `PATCH /Quotes({id})?generateDocument=true&preservePreviousTemplate=false`
> with an empty body `{}` — this is what the screen's "Atualizar dados" button does.
> On a superseded revision (`LastReview` false) it answers `401`.

### DELETE `/Quotes/{key}`

- **Parameters**:
  - `key`: `int`
  - `webhooks`: `bool` (default: `true`)
- **Response**: `200 OK`
- Performs soft delete

### POST `/Quotes/{key}/Approve`

- **Parameters**:
  - `key`: `int`
  - `webhooks`: `bool` (default: `true`)
- **Response**: Entity (entity)

### POST `/Quotes/{key}/NewComment`

- **Parameters**:
  - `key`: `int`
- **Body**: `{ "Content": "<text or HTML>" }`
- **Response**: Entity (entity) — the created comment

> **This is the only way to write a comment.** A `Comments` array nested in
> `POST /Quotes` or `PATCH /Quotes` is silently **ignored**, and the call still
> answers `200` — an integration copying comments writes nothing and reports success.
>
> Read them back with `$expand=Comments($expand=Creator($select=Id,Name))`.
> **Keep that inner `$select`**: select only the user fields you need.
>
> There is no `GET /Comments` collection (`404`). Delete with `DELETE /Comments/{id}`.

### POST `/Quotes/{key}/NewExternalComment`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)

### POST `/Quotes/{key}/UpdateUrl`

- **Parameters**:
  - `key`: `int`
- **Response**: `200 OK`

> **This does not regenerate the document — it destroys it.** The call answers
> `200`, and around five minutes later `DocumentUrl` is null, both through the API
> and on screen: the customer's quote is left with no PDF. Never use it to refresh a
> document; to regenerate, PATCH with `generateDocument=true` (see
> [PATCH `/Quotes/{key}`](#patch-quoteskey)).

### POST `/Quotes/{key}/Share`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)

### GET `/Quotes/GetDeletedQuotes`

- **Response**: Entity (entity)

### POST `/Quotes/{key}/SetSignature`

- **Parameters**:
  - `key`: `int`
  - `generateDocument`: `bool` (default: `true`)
- **Response**: Entity (entity)

### POST `/Quotes/{key}/TriggerHTMLGeneration`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)

> On a quote that already has a document this answers `200` and **does nothing** —
> `DocumentUrl` and the PDF are unchanged. To actually regenerate, PATCH with
> `generateDocument=true`.

### GET `/Quotes/AggregateByOtherProperties`

- **Response**: Entity (entity)

## /QuotesApprovalStatus

### GET `/QuotesApprovalStatus`

- **Response**: Entity (entity)

## /QuotesInstallments

### GET `/QuotesInstallments`

- **Response**: Entity (entity)

## /QuotesProducts

### GET `/QuotesProducts`

- **Response**: Entity (entity)

### PATCH `/QuotesProducts/{key}`

- **Parameters**:
  - `key`: `int`
  - `generateDocument`: `bool` (default: `true`)
- **Response**: Entity (entity)
- **Body**: JSON delta (only changed fields)
- Supports `?webhooks=false` to suppress webhook emission

### GET `/QuotesProducts/AggregateByOtherProperties`

- **Response**: Entity (entity)

## /QuotesProductsParts

### GET `/QuotesProductsParts`

- **Response**: Entity (entity)

### GET `/QuotesProductsParts/v2`

- **Response**: Entity (entity)

## /QuotesProductsPartsV2

### GET `/QuotesProductsPartsV2`

- **Response**: Entity (entity)

### GET `/QuotesProductsPartsV2/AggregateByOtherProperties`

- **Response**: Entity (entity)
