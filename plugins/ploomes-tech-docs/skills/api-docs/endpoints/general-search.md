# /GeneralSearch

## Data Model

See [GeneralSearch data model](../data-models/other.md#generalsearch) for the full property table with settability information.

## Endpoints

### GET `/GeneralSearch`

- **Response**: Entity (entity)

### POST `/GeneralSearch`

- **Response**: Entity (entity)
- **Body**: JSON object with entity fields
- Supports `?webhooks=false` to suppress webhook emission

### GET `/GeneralSearch/Recents`

- **Response**: Entity (entity)

### POST `/GeneralSearch/Recents`

- **Response**: `200 OK`
