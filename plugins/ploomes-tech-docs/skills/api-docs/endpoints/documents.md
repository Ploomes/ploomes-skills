# /Documents

## Data Model

See [Document data model](../data-models/document.md#document) for the full property table with settability information.

## /Documents

### GET `/Documents`

- **Response**: Entity (entity)

### POST `/Documents`

- **Parameters**:
  - `generateDocument`: `bool` (default: `true`)
  - `lateGenerateDocument`: `bool` (default: `false`)
  - `formTraceId`: `string` (default: `"0"`)
  - `formUniqueId`: `string` (default: `"0"`)
  - `formSaveAttempts`: `int` (default: `0`)
  - `formVersion`: `string` (default: `"0"`)
- **Response**: Entity (entity)
- **Body**: JSON object with entity fields. Accepts nested `Sections`, `Installments`, and `RelatedPeople` arrays. Products are nested inside Sections, and Parts inside Products. See [Nested Objects in Payloads](../06-common-patterns.md#nested-objects-in-payloads-quotes-orders-documents).
- Supports `?webhooks=false` to suppress webhook emission

### PATCH `/Documents/{key}`

- **Parameters**:
  - `key`: `int`
  - `generateDocument`: `bool` (default: `true`)
  - `preservePreviousTemplate`: `bool` (default: `false`)
  - `lateGenerateDocument`: `bool` (default: `false`)
- **Response**: Entity (entity)
- **Body**: JSON delta (only changed fields). Accepts nested `Sections`, `Installments`, `RelatedPeople`, and `Pages` arrays (replace semantics — existing children are deleted and recreated). See [Nested Objects in Payloads](../06-common-patterns.md#nested-objects-in-payloads-quotes-orders-documents).
- Supports `?webhooks=false` to suppress webhook emission

### DELETE `/Documents/{key}`

- **Parameters**:
  - `key`: `int`
- **Response**: `200 OK`
- Performs soft delete

### POST `/Documents/{key}/Approve`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)

### POST `/Documents/{key}/NewComment`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)

### POST `/Documents/{key}/NewExternalComment`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)

### POST `/Documents/{key}/Share`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)

### GET `/Documents/GetDeletedDocuments`

- **Response**: Entity (entity)

### POST `/Documents/{key}/SetSignature`

- **Parameters**:
  - `key`: `int`
  - `generateDocument`: `bool` (default: `true`)
- **Response**: Entity (entity)

### POST `/Documents/{key}/TriggerHTMLGeneration`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)

### GET `/Documents/AggregateByOtherProperties`

- **Response**: Entity (entity)

## /DocumentsProducts

### GET `/DocumentsProducts`

- **Response**: Entity (entity)

### PATCH `/DocumentsProducts/{key}`

- **Parameters**:
  - `key`: `int`
  - `generateDocument`: `bool` (default: `true`)
- **Response**: Entity (entity)
- **Body**: JSON delta (only changed fields)
- Supports `?webhooks=false` to suppress webhook emission

### GET `/DocumentsProducts/AggregateByOtherProperties`

- **Response**: Entity (entity)

## /DocumentsProductsParts

### GET `/DocumentsProductsParts`

- **Response**: Entity (entity)

### GET `/DocumentsProductsParts/v2`

- **Response**: Entity (entity)

## /DocumentsProductsPartsV2

### GET `/DocumentsProductsPartsV2`

- **Response**: Entity (entity)

### GET `/DocumentsProductsPartsV2/AggregateByOtherProperties`

- **Response**: Entity (entity)
