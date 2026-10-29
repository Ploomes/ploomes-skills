# /Importations

## Data Model

See [Importation data model](../data-models/importation.md#importation) for the full property table with settability information.

## /Importations

### GET `/Importations`

- **Response**: Entity (entity)

### POST `/Importations`

- **Response**: Entity (entity)
- **Body**: JSON object with entity fields
- Supports `?webhooks=false` to suppress webhook emission

### POST `/Importations/{key}/MapFields`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)

### POST `/Importations/{key}/ReturnStatus`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)

### POST `/Importations/{key}/Start`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)

### POST `/Importations/{key}/Finish`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)

### POST `/Importations/{key}/Cancel`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)

### POST `/Importations/{key}/Fail`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)

### POST `/Importations/{key}/IncreaseInsertedRows`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)

### POST `/Importations/{key}/IncreaseUpdatedRows`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)

### POST `/Importations/{key}/IncreaseErrorRows`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)

## /ImportationsStatus

### GET `/ImportationsStatus`

- **Response**: Entity (entity)
