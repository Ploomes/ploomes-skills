# /Currencies

## Data Model

See [Currency data model](../data-models/other.md#currency) for the full property table with settability information.

## Endpoints

### GET `/Currencies`

- **Response**: Entity (entity)

### POST `/Currencies`

- **Response**: Entity (entity)
- **Body**: JSON object with entity fields
- Supports `?webhooks=false` to suppress webhook emission

### PATCH `/Currencies/{key}`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)
- **Body**: JSON delta (only changed fields)
- Supports `?webhooks=false` to suppress webhook emission

### DELETE `/Currencies/{key}`

- **Parameters**:
  - `key`: `int`
- **Response**: `200 OK`
- Performs soft delete

### GET `/Currencies/GetDeletedCurrencies`

> ⚠️ **Answers `500 "A possible object cycle was detected"`.** Listing is not
> recovery either way: there is no restore action (see
> [06 · Deleted Records](../06-common-patterns.md#deleted-records)).

- **Response**: Entity (entity)
