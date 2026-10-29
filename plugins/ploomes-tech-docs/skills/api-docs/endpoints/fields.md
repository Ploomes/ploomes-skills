# Fields — Custom Field Management

> **Full workflow guide**: See [Fields & Entities](../07-fields-and-entities.md) for the complete step-by-step workflow on creating and using custom fields.

---

## /Fields

### Data Model (Field)

See [Field data model](../data-models/field.md#field) for the full property table with settability information.

### GET `/Fields`

- **Response**: Collection of Field entities

### POST `/Fields`

- **Response**: Field entity, inside the collection envelope — **read it from `value[0]`**
- **Body**: JSON object with field properties (minimum: `EntityId`, `TypeId`, `Name`)
- Supports `?webhooks=false` to suppress webhook emission

The response is `{"value":[{"Id":…,"Key":…}]}`. There is no `Key` at the top level.

> **If the script fails after this call, do not re-run it.** The field already
> exists, and a second `POST` creates a duplicate. Recover the key instead with
> `GET /Fields?$filter=Name eq '<name>'`.

Collections (`FormulaVariables`, `ExternalFormulaResponsePaths`,
`ExternalFormulaMappedFields`) can be created in this same call.

A field created here is **not on any form**, and therefore invisible on screen — see
[Forms](forms.md#post-formsfields).

### PATCH `/Fields('{key}')`

- **Parameters**:
  - `key`: `string` (the field `Key`), **quoted, inside parentheses**
- **Response**: Field entity
- **Body**: JSON delta for scalars. **A collection in the body needs `Key` and replaces the collection** — see below
- Supports `?webhooks=false` to suppress webhook emission

> **Key form.** `/Fields('<Key>')` is the only path that works. `/Fields/<Key>` and
> `/Fields(<Key>)` answer `404`; `/Fields(<Id>)` answered `404` on one account and
> `401` on another — that `401` is not a permission problem.

> **Collections are silently ignored without `Key` in the body.** A `PATCH` carrying
> `FormulaVariables` (or `ExternalFormulaResponsePaths`, `ExternalFormulaMappedFields`)
> but no `Key` answers `200` and changes nothing — a re-read shows the old state.
> With `Key` present it writes, and **replaces the whole collection**.
>
> So when a new formula references a new placeholder, the variable must travel in the
> **same body** as the formula. Splitting them broke the price formula of every order
> in an account: the field rendered the placeholder name in brackets instead of a
> number.
>
> On a **native** field, send only `Key` plus what changes. Echoing back the whole
> object read from a `GET` does not work — the `GET` projection has no
> `PropertyName` / `UpdatePropertyName`.

### DELETE `/Fields('{key}')`

- **Parameters**:
  - `key`: `string` (the field `Key`), quoted, inside parentheses
- **Response**: `200 OK`
- Performs soft delete

### GET `/Fields/GetDeletedFields`

- **Response**: Collection of deleted Field entities
- ⚠️ Answers `500 "A possible object cycle was detected"`, and listing is not recovery (see [06 · Deleted Records](../06-common-patterns.md#deleted-records))

---

## /FieldsEntities

See [FieldEntity data model](../data-models/field.md#fieldentity) for the full property table.

### GET `/FieldsEntities`

- **Response**: Collection of FieldEntity entities

### PATCH `/FieldsEntities/{key}`

- **Parameters**:
  - `key`: `int`
- **Response**: FieldEntity entity
- **Body**: JSON delta (only changed fields)
- Supports `?webhooks=false` to suppress webhook emission

---

## /FieldsTypes

See [FieldType data model](../data-models/field.md#fieldtype) for the full property table.

### GET `/FieldsTypes`

- **Response**: Collection of FieldType entities

---

## /FieldsEntitiesLastUpdates

### GET `/FieldsEntitiesLastUpdates`

- **Response**: Collection of field entity last update records

---

## /FieldsEntitiesPaths

### GET `/FieldsEntitiesPaths`

- **Response**: Collection of field entity paths

### POST `/FieldsEntitiesPaths/ValidateFieldPath`

- **Response**: `boolean`

---

## /FieldsFixedFieldsLanguages

### GET `/FieldsFixedFieldsLanguages`

> ⚠️ Answers `500`.

- **Response**: Collection of fixed field language records

---

## /FieldsGoogleSheetsIntegrations

### POST `/FieldsGoogleSheetsIntegrations/{key}/CalculateValue`

- **Parameters**:
  - `key`: `int`
- **Response**: `FieldGoogleSheetsIntegrationValue`

---

## /FieldsOptionsTables

### GET `/FieldsOptionsTables`

- **Response**: Collection of FieldOptionsTable entities

### POST `/FieldsOptionsTables`

- **Response**: FieldOptionsTable entity
- **Body**: JSON object with entity fields
- Supports `?webhooks=false` to suppress webhook emission

---

## /FieldsOptionsTablesOptions

**MaxTop**: 10000

> **Send `?adminValidation=true` on `POST` and `DELETE` here.** Without it they
> answer `401` even for an Administrator profile, and `200` with it. A `DELETE` of an
> option that was **already deleted** also answers `401` — see
> [Error Reference](../04-error-reference.md).

### GET `/FieldsOptionsTablesOptions`

- **Response**: Collection of FieldOptionsTableOption entities

### POST `/FieldsOptionsTablesOptions`

- **Parameters**:
  - `adminValidation`: `bool` (default: `false`)
- **Response**: FieldOptionsTableOption entity
- **Body**: JSON object with entity fields
- Supports `?webhooks=false` to suppress webhook emission

### PATCH `/FieldsOptionsTablesOptions/{key}`

- **Parameters**:
  - `key`: `int`
  - `adminValidation`: `bool` (default: `false`)
- **Response**: FieldOptionsTableOption entity
- **Body**: JSON delta (only changed fields)
- Supports `?webhooks=false` to suppress webhook emission

### DELETE `/FieldsOptionsTablesOptions/{key}`

- **Parameters**:
  - `key`: `int`
  - `adminValidation`: `bool` (default: `false`)
- **Response**: `200 OK`
- Performs soft delete

### GET `/FieldsOptionsTablesOptions/GetDeletedFieldOptionsTables`

> ⚠️ **Answers `500 "A possible object cycle was detected"`.** Listing is not
> recovery either way: there is no restore action (see
> [06 · Deleted Records](../06-common-patterns.md#deleted-records)).

- **Response**: Collection of deleted FieldOptionsTableOption entities

---

## /AccumulatorFields

### GET `/AccumulatorFields`

- **Response**: `ActionResult<AccumulatorTestResponse>`

> `$metadata` names the type `AccumulatorField` (singular); that name is not a route
> and answers `404`.
