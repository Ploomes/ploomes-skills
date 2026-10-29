# /Teams

## Data Model

See [Team data model](../data-models/team.md#team) for the full property table with settability information.

## Endpoints

### GET `/Teams`

- **Response**: Entity (entity)

### POST `/Teams`

- **Response**: Entity (entity)
- **Body**: JSON object with entity fields
- Supports `?webhooks=false` to suppress webhook emission

### PATCH `/Teams/{key}`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)
- **Body**: JSON delta (only changed fields)
- Supports `?webhooks=false` to suppress webhook emission

### DELETE `/Teams/{key}`

- **Parameters**:
  - `key`: `int`
- **Response**: `200 OK`
- Performs soft delete

### GET `/Teams/GetContactGoalTeams`

- **Response**: Entity (entity)

### GET `/Teams/GetDealGoalTeams`

- **Response**: Entity (entity)

### GET `/Teams/GetLeadGoalTeams`

- **Response**: Entity (entity)

### GET `/Teams/GetOrderGoalTeams`

- **Response**: Entity (entity)

### GET `/Teams/GetTaskGoalTeams`

- **Response**: Entity (entity)

### GET `/Teams/GetInteractionRecordGoalTeams`

- **Response**: Entity (entity)

### GET `/Teams/GetDocumentGoalTeams`

- **Response**: Entity (entity)
