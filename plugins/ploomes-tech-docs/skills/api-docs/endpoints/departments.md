# /Departments

## Data Model

See [Department data model](../data-models/other.md#department) for the full property table with settability information.

## Endpoints

### GET `/Departments`

- **Response**: Entity (entity)

### POST `/Departments`

- **Parameters**:
  - `adminValidation`: `bool` (default: `false`)
- **Response**: Entity (entity)
- **Body**: JSON object with entity fields
- Supports `?webhooks=false` to suppress webhook emission

### PATCH `/Departments/{key}`

- **Parameters**:
  - `key`: `int`
  - `adminValidation`: `bool` (default: `false`)
- **Response**: Entity (entity)
- **Body**: JSON delta (only changed fields)
- Supports `?webhooks=false` to suppress webhook emission

### DELETE `/Departments/{key}`

- **Parameters**:
  - `key`: `int`
  - `adminValidation`: `bool` (default: `false`)
- **Response**: `200 OK`
- Performs soft delete
