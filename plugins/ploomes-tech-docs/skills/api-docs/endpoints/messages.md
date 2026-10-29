# /Messages

## Data Model

See [Message data model](../data-models/message.md#message) for the full property table with settability information.

## Endpoints

### GET `/Messages`

- **Response**: Entity (entity)

### POST `/Messages`

- **Response**: Entity (entity)
- **Body**: JSON object with entity fields
- Supports `?webhooks=false` to suppress webhook emission

### PATCH `/Messages/{key}`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)
- **Body**: JSON delta (only changed fields)
- Supports `?webhooks=false` to suppress webhook emission

### DELETE `/Messages/{key}`

- **Parameters**:
  - `key`: `int`
- **Response**: `200 OK`
- Performs soft delete

### POST `/Messages/{key}/NewComment`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)

### POST `/Messages/{key}/UploadFile`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)

### GET `/Messages/GetDeletedMessages`

- **Response**: Entity (entity)
