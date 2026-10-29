# /Tags

## Data Model

See [Tag data model](../data-models/tag.md#tag) for the full property table with settability information.

## /Tags

**MaxTop**: 10000

### GET `/Tags`

- **Response**: Entity (entity)

### POST `/Tags`

- **Response**: Entity (entity)
- **Body**: JSON object with entity fields
- Supports `?webhooks=false` to suppress webhook emission

### PATCH `/Tags/{key}`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)
- **Body**: JSON delta (only changed fields)
- Supports `?webhooks=false` to suppress webhook emission

### DELETE `/Tags/{key}`

- **Parameters**:
  - `key`: `int`
- **Response**: `200 OK`
- Performs soft delete

### GET `/Tags/GetDeletedTags`

> ⚠️ **Answers `500 "A possible object cycle was detected"`.** Listing is not
> recovery either way: there is no restore action (see
> [06 · Deleted Records](../06-common-patterns.md#deleted-records)).

- **Response**: Entity (entity)

## /TagsEntities

### GET `/TagsEntities`

- **Response**: Entity (entity)
