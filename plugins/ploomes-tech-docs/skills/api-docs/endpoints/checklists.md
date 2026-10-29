# /Checklists

## Data Model

See [Checklist data model](../data-models/checklist.md#checklist) for the full property table with settability information.

## Endpoints

### GET `/Checklists`

- **Response**: Entity (entity)

### POST `/Checklists`

- **Response**: Entity (entity)
- **Body**: JSON object with entity fields
- Supports `?webhooks=false` to suppress webhook emission

### PATCH `/Checklists/{key}`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)
- **Body**: JSON delta (only changed fields)
- Supports `?webhooks=false` to suppress webhook emission

### DELETE `/Checklists/{key}`

- **Parameters**:
  - `key`: `int`
- **Response**: `200 OK`
- Performs soft delete

### GET `/Checklists/GetDeletedChecklists`

> ⚠️ **Answers `500 "A possible object cycle was detected"`.** Listing is not
> recovery either way: there is no restore action (see
> [06 · Deleted Records](../06-common-patterns.md#deleted-records)).

- **Response**: Entity (entity)
