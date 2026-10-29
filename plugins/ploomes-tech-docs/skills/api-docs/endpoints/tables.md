# /Tables

## Data Model

See [Table data model](../data-models/table.md#table) for the full property table with settability information.

## Endpoints

### GET `/Tables`

- **Response**: Entity (entity)

### GET `/Tables/{key}`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)

### POST `/Tables`

- **Response**: Entity (entity)
- **Body**: JSON object with entity fields
- Supports `?webhooks=false` to suppress webhook emission

> **A table created here has no column.** Columns are written afterwards with a
> `PATCH` carrying a `Fields` array — there is no entity set for `TableField`.
> Until then the screen renders the invitation to configure the columns instead of
> the data. See [Table](../data-models/table.md#table).

### PATCH `/Tables/{key}`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)
- **Body**: JSON delta (only changed fields)
- Supports `?webhooks=false` to suppress webhook emission

### POST `/Tables/{key}/Duplicate`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)

### DELETE `/Tables/{key}`

- **Parameters**:
  - `key`: `int`
- **Response**: `200 OK`
- Performs soft delete

### GET `/Tables/GetDeletedTables`

- **Response**: Entity (entity)
