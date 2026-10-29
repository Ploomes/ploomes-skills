# /PublicForms

## Data Model

See [PublicForm data model](../data-models/public-form.md#publicform) for the full property table with settability information.

## /PublicForms

### GET `/PublicForms`

- **Response**: Entity (entity)

### POST `/PublicForms`

- **Response**: Entity (entity)
- **Body**: JSON object with entity fields
- Supports `?webhooks=false` to suppress webhook emission

### PATCH `/PublicForms/{key}`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)
- **Body**: JSON delta (only changed fields)
- Supports `?webhooks=false` to suppress webhook emission

### DELETE `/PublicForms/{key}`

- **Parameters**:
  - `key`: `int`
- **Response**: `200 OK`
- Performs soft delete

### GET `/PublicForms/GetDeletedPublicForms`

> ⚠️ **Answers `500 "A possible object cycle was detected"`.** Listing is not
> recovery either way: there is no restore action (see
> [06 · Deleted Records](../06-common-patterns.md#deleted-records)).

- **Response**: Entity (entity)

## /PublicFormsContacts

### GET `/PublicFormsContacts`

- **Response**: Entity (entity)

### POST `/PublicFormsContacts`

- **Response**: Entity (entity)
- **Body**: JSON object with entity fields
- Supports `?webhooks=false` to suppress webhook emission

### PATCH `/PublicFormsContacts/{key}`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)
- **Body**: JSON delta (only changed fields)
- Supports `?webhooks=false` to suppress webhook emission

## /PublicFormsDeals

### GET `/PublicFormsDeals`

- **Response**: Entity (entity)

### GET `/PublicFormsDeals/expanded`

> ⚠️ Answers `500`.

- **Response**: JSON

### POST `/PublicFormsDeals`

- **Response**: Entity (entity)
- **Body**: JSON object with entity fields
- Supports `?webhooks=false` to suppress webhook emission

### PATCH `/PublicFormsDeals/{key}`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)
- **Body**: JSON delta (only changed fields)
- Supports `?webhooks=false` to suppress webhook emission
