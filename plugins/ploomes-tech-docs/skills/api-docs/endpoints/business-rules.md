# /BusinessRules

## Data Model

See [BusinessRule data model](../data-models/business-rule.md#businessrule) for the full property table with settability information.

## /BusinessRules

### GET `/BusinessRules`

- **Response**: Entity (entity)

### POST `/BusinessRules`

- **Response**: Entity (entity)
- **Body**: JSON object with entity fields
- Supports `?webhooks=false` to suppress webhook emission

### PATCH `/BusinessRules/{key}`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)
- **Body**: JSON delta (only changed fields)
- Supports `?webhooks=false` to suppress webhook emission

### DELETE `/BusinessRules/{key}`

- **Parameters**:
  - `key`: `int`
- **Response**: `200 OK`
- Performs soft delete

### POST `/BusinessRules/ValidateQuote`

- **Body**: the same payload the quote save would send — the whole quote, not a delta
- **Response**: Entity (entity)

> The screen calls this before saving: "Atualizar dados" sends `ValidateQuote` with
> the entire quote, then the `PATCH` with `{}`.
>
> To find out whether an account even has approval rules — and therefore whether a
> write can reopen an approval — read them first:
> `GET /BusinessRules?$filter=EntityId eq 7` for Quote, `EntityId eq 4` for Order.

### POST `/BusinessRules/ValidateOrder`

- **Response**: Entity (entity)

### POST `/BusinessRules/ValidateDocument`

- **Response**: Entity (entity)

## /BusinessRulesActions

### GET `/BusinessRulesActions`

- **Response**: Entity (entity)
