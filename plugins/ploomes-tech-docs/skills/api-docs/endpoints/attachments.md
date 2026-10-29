# /Attachments

## Data Model

See [Attachment data model](../data-models/attachment.md#attachment) for the full property table with settability information.

## /Attachments

> **Call form.** Bound functions take the key in parentheses:
> `/Attachments({id})/GetById`, `/AttachmentsFolders({id})/AllowedUsers`. Writing the
> key as a path segment (`/Attachments/{id}/GetById`) answers
> `500 "The request matched multiple endpoints"`, and the `Default.` prefix or a
> trailing `()` answers `404`. See
> [03 §9](../03-odata-reference.md#9-non-conventional-actions-and-functions).

### GET `/Attachments`

- **Response**: Entity (entity)

### GET `/Attachments/{key}/GetById`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)

### POST `/Attachments`

- **Response**: Entity (entity)
- **Body**: JSON object with entity fields
- Supports `?webhooks=false` to suppress webhook emission

### PATCH `/Attachments/{key}`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)
- **Body**: JSON delta (only changed fields)
- Supports `?webhooks=false` to suppress webhook emission

### DELETE `/Attachments/{key}`

- **Parameters**:
  - `key`: `int`
- **Response**: `200 OK`
- Performs soft delete

### POST `/Attachments/Base64`

- **Response**: Entity (entity)

### POST `/Attachments/Duplicate`

- **Response**: Entity (entity)

### POST `/Attachments/BulkDuplicate`

- **Response**: Entity (entity)

## /AttachmentsFolders

### GET `/AttachmentsFolders`

- **Response**: Entity (entity)

### POST `/AttachmentsFolders`

- **Response**: Entity (entity)
- **Body**: JSON object with entity fields
- Supports `?webhooks=false` to suppress webhook emission

### PATCH `/AttachmentsFolders/{key}`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)
- **Body**: JSON delta (only changed fields)
- Supports `?webhooks=false` to suppress webhook emission

### DELETE `/AttachmentsFolders/{key}`

- **Parameters**:
  - `key`: `int`
- **Response**: `200 OK`
- Performs soft delete

### POST `/AttachmentsFolders/{key}/Move`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)

### POST `/AttachmentsFolders/{key}/Archive`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)

### GET `/AttachmentsFolders/{key}/AllowedUsers`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)

### GET `/AttachmentsFolders/{key}/AllowedTeams`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)

### GET `/AttachmentsFolders/{key}/AllowedUserProfiles`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)

### GET `/AttachmentsFolders/{key}/EditionAllowedUsers`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)

### GET `/AttachmentsFolders/{key}/EditionAllowedTeams`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)

### GET `/AttachmentsFolders/{key}/EditionAllowedUserProfiles`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)

### GET `/AttachmentsFolders/{key}/DeletionAllowedUsers`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)

### GET `/AttachmentsFolders/{key}/DeletionAllowedTeams`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)

### GET `/AttachmentsFolders/{key}/DeletionAllowedUserProfiles`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)

### GET `/AttachmentsFolders/GetDeletedAttachmentFolders`

> ⚠️ **Answers `500 "A possible object cycle was detected"`.** Listing is not
> recovery either way: there is no restore action (see
> [06 · Deleted Records](../06-common-patterns.md#deleted-records)).

- **Response**: Entity (entity)

## /AttachmentsItems

### GET `/AttachmentsItems`

- **Response**: Entity (entity)

### POST `/AttachmentsItems`

- **Response**: Entity (entity)
- **Body**: JSON object with entity fields
- Supports `?webhooks=false` to suppress webhook emission

### POST `/AttachmentsItems/FormData`

- **Response**: Entity (entity)

### PATCH `/AttachmentsItems/{key}`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)
- **Body**: JSON delta (only changed fields)
- Supports `?webhooks=false` to suppress webhook emission

### DELETE `/AttachmentsItems/{key}`

- **Parameters**:
  - `key`: `int`
- **Response**: `200 OK`
- Performs soft delete

### POST `/AttachmentsItems/{key}/Move`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)

### POST `/AttachmentsItems/{key}/Archive`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)

## /AttachmentsItemsProcessingStatus

### GET `/AttachmentsItemsProcessingStatus`

- **Response**: Entity (entity)
