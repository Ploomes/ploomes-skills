# /Users

## Data Model

See [User data model](../data-models/user.md#user) for the full property table with settability information.

## /Users

### GET `/Users`

- **Response**: Entity (entity)

### POST `/Users`

- **Parameters**:
  - `generateUserKey`: `bool` (default: `false`)
- **Response**: Entity (entity)
- **Body**: JSON object with entity fields
- Supports `?webhooks=false` to suppress webhook emission

### PATCH `/Users/{key}`

- **Parameters**:
  - `key`: `int`
  - `webhooks`: `bool` (default: `true`)
- **Response**: Entity (entity)
- **Body**: JSON delta (only changed fields)
- Supports `?webhooks=false` to suppress webhook emission

### POST `/Users/IsDuplicate`

- **Response**: `boolean`

### GET `/Users/GetContactOwners`

- **Response**: Entity (entity)

### GET `/Users/GetDealOwners`

- **Response**: Entity (entity)

### GET `/Users/GetLeadOwners`

- **Response**: Entity (entity)

### GET `/Users/GetOrderOwners`

- **Response**: Entity (entity)

### GET `/Users/GetContactGoalUsers`

- **Response**: Entity (entity)

### GET `/Users/GetDealGoalUsers`

- **Response**: Entity (entity)

### GET `/Users/GetLeadGoalUsers`

- **Response**: Entity (entity)

### GET `/Users/GetOrderGoalUsers`

- **Response**: Entity (entity)

### GET `/Users/GetTaskGoalUsers`

- **Response**: Entity (entity)

### GET `/Users/GetInteractionRecordGoalUsers`

- **Response**: Entity (entity)

### GET `/Users/GetDocumentGoalUsers`

- **Response**: Entity (entity)

### GET `/Users/GetChatUsers`

- **Response**: Entity (entity)

### POST `/Users/{key}/UploadAvatar`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)

### POST `/Users/{key}/ResetGoogleAuthenticator`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)

### POST `/Users/{key}/ResetUserKey`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)

### POST `/Users/{key}/ChangeNoLogin`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)

### GET `/Users/AggregateByOtherProperties`

- **Response**: Entity (entity)

## /UsersProfiles

### GET `/UsersProfiles`

- **Response**: Entity (entity)

### POST `/UsersProfiles`

- **Response**: Entity (entity)
- **Body**: JSON object with entity fields
- Supports `?webhooks=false` to suppress webhook emission

### PATCH `/UsersProfiles/{key}`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)
- **Body**: JSON delta (only changed fields)
- Supports `?webhooks=false` to suppress webhook emission

### DELETE `/UsersProfiles/{key}`

- **Parameters**:
  - `key`: `int`
- **Response**: `200 OK`
- Performs soft delete

## /UsersSuspensionReasons

### GET `/UsersSuspensionReasons`

- **Response**: Entity (entity)
