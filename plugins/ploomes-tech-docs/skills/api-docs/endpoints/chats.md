# /Chats

## Data Model

See [Chat data model](../data-models/chat.md#chat) for the full property table with settability information.

## Endpoints

### GET `/Chats`

- **Response**: Entity (entity)

### POST `/Chats`

- **Response**: Entity (entity)
- **Body**: JSON object with entity fields
- Supports `?webhooks=false` to suppress webhook emission

### PATCH `/Chats/{key}`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)
- **Body**: JSON delta (only changed fields)
- Supports `?webhooks=false` to suppress webhook emission

### DELETE `/Chats/{key}`

- **Parameters**:
  - `key`: `int`
- **Response**: `200 OK`
- Performs soft delete

### POST `/Chats/{key}/UploadFile`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)

### POST `/Chats/{key}/UploadAvatar`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)

### POST `/Chats/{key}/Quit`

- **Parameters**:
  - `key`: `int`
- **Response**: `200 OK`
