# /BulkProcedures

## Data Model

See [BulkProcedure data model](../data-models/bulk-procedure.md#bulkprocedure) for the full property table with settability information.

## /BulkProcedures

### GET `/BulkProcedures`

- **Response**: Entity (entity)

### POST `/BulkProcedures`

- **Response**: Entity (entity)
- **Body**: JSON object with entity fields
- Supports `?webhooks=false` to suppress webhook emission

### GET `/BulkProcedures/{key}/GetProgress`

- **Parameters**:
  - `key`: `int`
- **Response**: `decimal`

### POST `/BulkProcedures/{key}/SetFinished`

- **Parameters**:
  - `key`: `int`
- **Response**: `200 OK`

## /BulkProceduresActions

### GET `/BulkProceduresActions`

- **Response**: Entity (entity)
