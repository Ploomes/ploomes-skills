# /InteractionRecords

## Data Model

See [InteractionRecord data model](../data-models/interaction-record.md#interactionrecord) for the full property table with settability information.

## /InteractionRecords

### GET `/InteractionRecords`

- **Response**: Entity (entity)

### POST `/InteractionRecords`

- **Response**: Entity (entity)
- **Body**: JSON object with entity fields
- Supports `?webhooks=false` to suppress webhook emission

### PATCH `/InteractionRecords/{key}`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)
- **Body**: JSON delta (only changed fields)
- Supports `?webhooks=false` to suppress webhook emission

> **Changing `DealId`** moves the record to another deal, or unlinks it back to a
> contact-only state. Both are accepted and validated as business rules:
>
> - **Move** — a different, non-null `DealId`. The destination deal must be
>   accessible and must share the **same non-null `ContactId`** as the record, so a
>   record only moves between deals of the same contact. A record sitting on the
>   account's ghost contact cannot be moved.
> - **Unlink** — `DealId: null`. The record needs a real contact to fall back to;
>   one with no contact, or on the ghost contact, cannot be detached.
> - Either deal being **mid-merge** rejects the operation.
> - A rejected move or unlink returns `400`; a deal mid-merge returns `401`.
>
> Two fields are re-derived rather than read from the body: the record's owner —
> the pointer behind row-level visibility — becomes the destination deal's owner on
> a move and the contact's owner on an unlink, and `FieldStatusId` is cleared when
> the destination deal sits in a different pipeline, and on every unlink. Sending
> the `DealId` the record already has changes nothing.
>
> `PATCH` on an interaction record also requires the profile's interaction-record
> edit permission and a record whose `Editable` is `true`.

### DELETE `/InteractionRecords/{key}`

- **Parameters**:
  - `key`: `int`
- **Response**: `200 OK`
- Performs soft delete

### POST `/InteractionRecords/{key}/UploadFile`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)

### POST `/InteractionRecords/{key}/NewComment`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)

### GET `/InteractionRecords/GetDeletedInteractionRecords`

- **Response**: Entity (entity)

### GET `/InteractionRecords/AggregateByOtherProperties`

- **Response**: Entity (entity)

## /InteractionRecordsAiGenerationStatus

### GET `/InteractionRecordsAiGenerationStatus`

- **Response**: Entity (entity)

## /InteractionRecordsCallStatus

### GET `/InteractionRecordsCallStatus`

- **Response**: Entity (entity)
