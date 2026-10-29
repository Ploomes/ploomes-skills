# /Orders

> Orders represent confirmed sales/purchases. Like quotes, they support document generation from templates, approval workflows, external sharing, and signatures.

## Key Business Rules

- Orders are generated from won deals or created directly
- Orders support document generation from templates (`generateDocument=true`)
- **Late document generation** can be deferred (`lateGenerateDocument=true`)
- Orders can be **approved** via workflow
- Orders can be **shared** externally via a public link
- **Signatures** can be set on orders
- Orders support installments (`/Orders/Installments`)
- Orders have stages (`/Orders/Stages`)
- Comments and external comments can be added
- Orders support OtherProperties (custom fields)

## Data Model

See [Order data model](../data-models/order.md#order) for the full property table with settability information.

## /Orders

> Orders represent confirmed sales/purchases. Like quotes, they support document generation from templates, approval workflows, external sharing, and signatures.

## Key Business Rules

- Orders are generated from won deals or created directly
- Orders support document generation from templates (`generateDocument=true`)
- **Late document generation** can be deferred (`lateGenerateDocument=true`)
- Orders can be **approved** via workflow
- Orders can be **shared** externally via a public link
- **Signatures** can be set on orders
- Orders support installments (`/Orders/Installments`)
- Orders have stages (`/Orders/Stages`)
- Comments and external comments can be added
- Orders support OtherProperties (custom fields)

### GET `/Orders`

- **OData queryable**: Yes (`$filter`, `$select`, `$expand`, `$orderby`, `$top`, `$skip`, `$count`, `$apply`)
- **Response**: JSON

### POST `/Orders`

- **Parameters**:
  - `generateDocument`: `bool` (default: `true`)
  - `webhooks`: `bool` (default: `true`)
  - `lateGenerateDocument`: `bool` (default: `false`)
  - `formTraceId`: `string` (default: `"0"`)
  - `formUniqueId`: `string` (default: `"0"`)
  - `formSaveAttempts`: `int` (default: `0`)
  - `formOrigin`: `string` (default: `"0"`)
- **Response**: Entity (entity)
- **Body**: JSON object with entity fields. Accepts nested `Sections`, `Products`, `Installments`, and `RelatedPeople` arrays. Products can be nested inside Sections (with Parts inside Products), or sent at the root level. See [Nested Objects in Payloads](../06-common-patterns.md#nested-objects-in-payloads-quotes-orders-documents).
- Supports `?webhooks=false` to suppress webhook emission

### PATCH `/Orders/{key}`

- **Parameters**:
  - `key`: `int`
  - `generateDocument`: `bool` (default: `true`)
  - `preservePreviousTemplate`: `bool` (default: `false`)
  - `webhooks`: `bool` (default: `true`)
  - `lateGenerateDocument`: `bool` (default: `false`)
- **Response**: Entity (entity)
- **Body**: JSON delta for root properties. Accepts nested `Sections`, `Products`, `Installments` and `RelatedPeople` arrays — **replace semantics**: children are deleted and recreated with new ids, and any child not resent is deleted. See [Nested Objects in Payloads](../06-common-patterns.md#nested-objects-in-payloads-quotes-orders-documents).
- Supports `?webhooks=false` to suppress webhook emission

> **Every PATCH regenerates the document by default** (`generateDocument` defaults to
> `true`). Pass `?generateDocument=false` when you are only storing data.
>
> **A PATCH can send the order back for approval.** On an account with an approval
> rule (`GET /BusinessRules?$filter=EntityId eq 4`), a PATCH can move
> `ApprovalStatusId` from null to `1`, even when it stores the value the order
> already had. Check the account's rules before a bulk PATCH.

### DELETE `/Orders/{key}`

- **Parameters**:
  - `key`: `int`
  - `webhooks`: `bool` (default: `true`)
- **Response**: `200 OK`
- Performs soft delete

### POST `/Orders/{key}/Approve`

- **Parameters**:
  - `key`: `int`
  - `webhooks`: `bool` (default: `true`)
- **Response**: Entity (entity)

### POST `/Orders/{key}/NewComment`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)

### POST `/Orders/{key}/NewExternalComment`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)

### POST `/Orders/{key}/UploadFile`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)

### POST `/Orders/{key}/UpdateUrl`

- **Parameters**:
  - `key`: `int`
- **Response**: `200 OK`

> **This does not regenerate the document — it destroys it.** As on
> [Quotes](quotes.md#post-quoteskeyupdateurl), the call answers `200` and leaves
> `DocumentUrl` null a few minutes later. To regenerate, PATCH with
> `generateDocument=true`.

### POST `/Orders/{key}/Share`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)

### GET `/Orders/GetDeletedOrders`

- **Response**: Entity (entity)

### POST `/Orders/{key}/SetSignature`

- **Parameters**:
  - `key`: `int`
  - `generateDocument`: `bool` (default: `true`)
- **Response**: Entity (entity)

### POST `/Orders/{key}/TriggerHTMLGeneration`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)

### GET `/Orders/AggregateByOtherProperties`

- **Response**: Entity (entity)

## /OrdersInstallments

### GET `/OrdersInstallments`

- **Response**: Entity (entity)

## /OrdersProducts

### GET `/OrdersProducts`

- **Response**: Entity (entity)

### PATCH `/OrdersProducts/{key}`

- **Parameters**:
  - `key`: `int`
  - `generateDocument`: `bool` (default: `true`)
- **Response**: Entity (entity)
- **Body**: JSON delta (only changed fields)
- Supports `?webhooks=false` to suppress webhook emission

### GET `/OrdersProducts/AggregateByOtherProperties`

- **Response**: Entity (entity)

## /OrdersProductsParts

### GET `/OrdersProductsParts`

- **Response**: Entity (entity)

### GET `/OrdersProductsParts/v2`

- **Response**: Entity (entity)

## /OrdersProductsPartsV2

### GET `/OrdersProductsPartsV2`

- **Response**: Entity (entity)

### GET `/OrdersProductsPartsV2/AggregateByOtherProperties`

- **Response**: Entity (entity)

## /OrdersStages

### GET `/OrdersStages`

- **Response**: Entity (entity)

### POST `/OrdersStages`

- **Response**: Entity (entity)
- **Body**: JSON object with entity fields
- Supports `?webhooks=false` to suppress webhook emission

### PATCH `/OrdersStages/{key}`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)
- **Body**: JSON delta (only changed fields)
- Supports `?webhooks=false` to suppress webhook emission

### DELETE `/OrdersStages/{key}`

- **Parameters**:
  - `key`: `int`
- **Response**: `200 OK`
- Performs soft delete
