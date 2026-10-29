# /Filters

## Data Model

See [Filter data model](../data-models/filter.md#filter) for the full property table with settability information.

## Endpoints

### GET `/Filters`

- **Response**: Entity (entity)

### POST `/Filters`

- **Response**: Entity (entity)
- **Body**: JSON object with entity fields
- Supports `?webhooks=false` to suppress webhook emission

A filter has **three levels**, and all three must be sent in the same body:

1. The filter itself — `Name`, `EntityId` and `Url`, the `$filter` string the client
   assembled, with spaces encoded as `+`.
2. `Fields[]` — one entry per condition, each carrying `FieldKey`, `OperationId`,
   `FieldTypeId` and `LogicalGroupNumber`.
3. `Values[]` inside each field, with the value in the column matching the type
   (`IntegerValue`, `StringValue`, `BoolValue`). A "field is one of these" condition
   is **one** `Field` holding several `Values`.

**A `Field` with no `Values` is the silent failure mode.** The `Url` still looks
right, and the automation screen shows "no filter". Verify with
`GET /Filters?$filter=Id eq {id}&$expand=Fields($expand=Values)` — expanding
`Fields` without `Values` makes a broken filter look fine.

### PATCH `/Filters/{key}`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)
- **Body**: the whole filter object. **Not a delta** — see below
- Supports `?webhooks=false` to suppress webhook emission

> **Conditions cannot be edited by delta.** Measured:
>
> | Body | Result |
> |---|---|
> | `Url` alone | `200`, and nothing changes — the `Fields` are what the screen reads |
> | a partial `Fields` array | `400 "Your request has a wrong format"` |
> | anything missing `Id`, `Name` or `Url` | `400` |
>
> What works is resending the entire object read from the `GET`, with `Fields`,
> `Values` and their ids — and the response comes back with **new ids** for
> `Fields` and `Values`, so this path also replaces the collection rather than
> merging into it.
>
> **For an automation, don't patch the filter at all**: create a new one with
> `POST /Filters` and point the automation's `TriggerFilterId` at it. Patching in
> place answers `200` and leaves the automation running the old conditions.

### POST `/Filters/BulkUpdate`

- **Response**: Entity (entity)

### DELETE `/Filters/{key}`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)
- Performs soft delete
