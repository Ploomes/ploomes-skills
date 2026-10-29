# /Images

## Data Model

See [Image data model](../data-models/other.md#image) for the full property table with settability information.

## Endpoints

### GET `/Images`

- **Response**: Entity (entity)

### POST `/Images`

- **Response**: Entity (entity)
- **Body**: JSON object with entity fields
- Supports `?webhooks=false` to suppress webhook emission

### DELETE `/Images/{key}`

- **Parameters**:
  - `key`: `int`
- **Response**: `200 OK`
- Performs soft delete
