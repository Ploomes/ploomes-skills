# /Roles

## Data Model

See [Role data model](../data-models/other.md#role) for the full property table with settability information.

## Endpoints

### GET `/Roles`

- **Response**: Entity (entity)

### POST `/Roles`

- **Parameters**:
  - `adminValidation`: `bool` (default: `false`)
- **Response**: Entity (entity)
- **Body**: JSON object with entity fields
- Supports `?webhooks=false` to suppress webhook emission

### PATCH `/Roles/{key}`

- **Parameters**:
  - `key`: `int`
  - `adminValidation`: `bool` (default: `false`)
- **Response**: Entity (entity)
- **Body**: JSON delta (only changed fields)
- Supports `?webhooks=false` to suppress webhook emission

### DELETE `/Roles/{key}`

- **Parameters**:
  - `key`: `int`
  - `adminValidation`: `bool` (default: `false`)
- **Response**: `200 OK`
- Performs soft delete
