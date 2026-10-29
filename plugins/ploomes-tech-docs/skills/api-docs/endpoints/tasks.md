# /Tasks

## Data Model

See [Task data model](../data-models/task.md#task) for the full property table with settability information.

## /Tasks

### GET `/Tasks`

- **OData queryable**: Yes (`$filter`, `$select`, `$expand`, `$orderby`, `$top`, `$skip`, `$count`, `$apply`)
- **Response**: JSON

### POST `/Tasks`

- **Parameters**:
  - `webhooks`: `bool` (default: `true`)
- **Response**: Entity (entity)
- **Body**: JSON object with entity fields
- Supports `?webhooks=false` to suppress webhook emission

### PATCH `/Tasks/{key}`

- **Parameters**:
  - `key`: `int`
  - `webhooks`: `bool` (default: `true`)
- **Response**: Entity (entity)
- **Body**: JSON delta (only changed fields)
- Supports `?webhooks=false` to suppress webhook emission

### DELETE `/Tasks/{key}`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)
- Performs soft delete

### POST `/Tasks/{key}/Finish`

- **Parameters**:
  - `key`: `int`
  - `webhooks`: `bool` (default: `true`)
- **Response**: Entity (entity)

### POST `/Tasks/SetOrder`

- **Response**: Entity (entity)

### POST `/Tasks/{key}/UploadFile`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)

### POST `/Tasks/{key}/NewComment`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)

### GET `/Tasks/GetDeletedTasks`

- **Response**: Entity (entity)

### GET `/Tasks/AggregateByOtherProperties`

- **Response**: Entity (entity)

## /TasksEmailReminders

### GET `/TasksEmailReminders`

- **Response**: Entity (entity)

## /TasksRepeatIntervalUnits

### GET `/TasksRepeatIntervalUnits`

- **Response**: Entity (entity)

## /TasksTranscriptionPrompts

### GET `/TasksTranscriptionPrompts`

- **Response**: Entity (entity)

### POST `/TasksTranscriptionPrompts`

- **Response**: Entity (entity)
- **Body**: JSON object with entity fields
- Supports `?webhooks=false` to suppress webhook emission

### PATCH `/TasksTranscriptionPrompts/{key}`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)
- **Body**: JSON delta (only changed fields)
- Supports `?webhooks=false` to suppress webhook emission

### DELETE `/TasksTranscriptionPrompts/{key}`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)
- Performs soft delete

## /TasksTypes

### GET `/TasksTypes`

- **Response**: Entity (entity)

### PATCH `/TasksTypes/{key}`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)
- **Body**: JSON delta (only changed fields)
- Supports `?webhooks=false` to suppress webhook emission
