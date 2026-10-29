# /Leads

## Data Model

See [Lead data model](../data-models/lead.md#lead) for the full property table with settability information.

## /Leads

### GET `/Leads`

- **Response**: Entity (entity)

### POST `/Leads`

- **Response**: Entity (entity)
- **Body**: JSON object with entity fields
- Supports `?webhooks=false` to suppress webhook emission

### PATCH `/Leads/{key}`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)
- **Body**: JSON delta (only changed fields)
- Supports `?webhooks=false` to suppress webhook emission

### DELETE `/Leads/{key}`

- **Parameters**:
  - `key`: `int`
- **Response**: `200 OK`
- Performs soft delete

### POST `/Leads/IsDuplicate`

- **Response**: `boolean`

### POST `/Leads/{key}/IsDuplicate`

- **Parameters**:
  - `key`: `int`
- **Response**: `boolean`

### POST `/Leads/IsPhoneDuplicate`

- **Response**: `List<PhoneIsDuplicateValue>`

### POST `/Leads/{key}/IsPhoneDuplicate`

- **Parameters**:
  - `key`: `int`
- **Response**: `List<PhoneIsDuplicateValue>`

### POST `/Leads/{key}/NewHistory`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)

### POST `/Leads/{key}/Discard`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)

### POST `/Leads/{key}/Convert`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)

### POST `/Leads/{key}/UploadFile`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)

### POST `/Leads/BulkUpdate`

- **Response**: Entity (entity)

### POST `/Leads/BulkDelete`

- **Response**: Entity (entity)

### GET `/Leads/GetDeletedLeads`

- **Response**: Entity (entity)

## /LeadsDiscardReasons

### GET `/LeadsDiscardReasons`

- **Response**: Entity (entity)

### POST `/LeadsDiscardReasons`

- **Response**: Entity (entity)
- **Body**: JSON object with entity fields
- Supports `?webhooks=false` to suppress webhook emission

### PATCH `/LeadsDiscardReasons/{key}`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)
- **Body**: JSON delta (only changed fields)
- Supports `?webhooks=false` to suppress webhook emission

### DELETE `/LeadsDiscardReasons/{key}`

- **Parameters**:
  - `key`: `int`
- **Response**: `200 OK`
- Performs soft delete

## /LeadsHistory

### GET `/LeadsHistory`

- **Response**: Entity (entity)

### PATCH `/LeadsHistory/{key}`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)
- **Body**: JSON delta (only changed fields)
- Supports `?webhooks=false` to suppress webhook emission

## /LeadsReminders

### GET `/LeadsReminders`

- **Response**: Entity (entity)

## /LeadsStatus

### GET `/LeadsStatus`

- **Response**: Entity (entity)
