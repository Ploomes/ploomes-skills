# /Emails

## Data Model

See [Email data model](../data-models/email.md#email) for the full property table with settability information.

## /Emails

### GET `/Emails`

- **Response**: Entity (entity)

### POST `/Emails`

- **Response**: Entity (entity)
- **Body**: JSON object with entity fields
- Supports `?webhooks=false` to suppress webhook emission

### PATCH `/Emails/{key}`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)
- **Body**: JSON delta (only changed fields)
- Supports `?webhooks=false` to suppress webhook emission

### DELETE `/Emails/{key}`

- **Parameters**:
  - `key`: `int`
- **Response**: `200 OK`
- Performs soft delete

### POST `/Emails/{key}/UploadFile`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)

### POST `/Emails/Receive`

- **Response**: Entity (entity)

### POST `/Emails/{key}/ChangeFolder`

- **Parameters**:
  - `key`: `int`
  - `fromSync`: `bool` (default: `false`)
- **Response**: Entity (entity)

### POST `/Emails/{key}/MarkAsRead`

- **Parameters**:
  - `key`: `int`
  - `fromSync`: `bool` (default: `false`)
- **Response**: Entity (entity)

### GET `/Emails/GetDeletedEmails`

- **Response**: Entity (entity)

### POST `/Emails/{key}/UploadImage`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)

### POST `/Emails/BulkUpdate`

- **Response**: `200 OK`

### POST `/Emails/BulkMarkAsRead`

- **Response**: `200 OK`

### POST `/Emails/BulkChangeFolder`

- **Response**: `200 OK`

### POST `/Emails/BulkDelete`

- **Response**: `200 OK`

## /EmailsFolders

### GET `/EmailsFolders`

- **Response**: Entity (entity)

### POST `/EmailsFolders`

- **Parameters**:
  - `fromImap`: `bool` (default: `false`)
- **Response**: Entity (entity)
- **Body**: JSON object with entity fields
- Supports `?webhooks=false` to suppress webhook emission

### PATCH `/EmailsFolders/{key}`

- **Parameters**:
  - `key`: `int`
  - `fromImap`: `bool` (default: `false`)
  - `imapIdleSync`: `bool` (default: `false`)
- **Response**: Entity (entity)
- **Body**: JSON delta (only changed fields)
- Supports `?webhooks=false` to suppress webhook emission

### DELETE `/EmailsFolders/{key}`

- **Parameters**:
  - `key`: `int`
- **Response**: `200 OK`
- Performs soft delete

### POST `/EmailsFolders/ResetImapFolders`

- **Response**: `200 OK`

### POST `/EmailsFolders/UpsertAllImapFolders`

- **Response**: `200 OK`

### POST `/EmailsFolders/UpsertImapFolder`

- **Response**: `200 OK`

### POST `/EmailsFolders/UpdateFolderSync`

- **Parameters**:
  - `folderId`: `int`
  - `isStarting`: `bool`
- **Response**: `200 OK`

## /EmailsGroups

### GET `/EmailsGroups`

- **Response**: Entity (entity)

### PATCH `/EmailsGroups/{key}`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)
- **Body**: JSON delta (only changed fields)
- Supports `?webhooks=false` to suppress webhook emission

### DELETE `/EmailsGroups/{key}`

- **Parameters**:
  - `key`: `int`
- **Response**: `200 OK`
- Performs soft delete

### POST `/EmailsGroups/BulkUpdate`

- **Response**: `200 OK`

### POST `/EmailsGroups/BulkDelete`

- **Response**: `200 OK`

## /EmailsGroupsLastEmails

### GET `/EmailsGroupsLastEmails`

- **Response**: Entity (entity)

## /EmailsStatus

### GET `/EmailsStatus`

- **Response**: Entity (entity)

## /EmailsTemplates

### GET `/EmailsTemplates`

- **Response**: Entity (entity)

### POST `/EmailsTemplates`

- **Response**: Entity (entity)
- **Body**: JSON object with entity fields
- Supports `?webhooks=false` to suppress webhook emission

### PATCH `/EmailsTemplates/{key}`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)
- **Body**: JSON delta (only changed fields)
- Supports `?webhooks=false` to suppress webhook emission

### DELETE `/EmailsTemplates/{key}`

- **Parameters**:
  - `key`: `int`
- **Response**: `200 OK`
- Performs soft delete

### POST `/EmailsTemplates/{key}/UploadFile`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)
