# /Webhooks

## Data Model

See [Webhook data model](../data-models/webhook.md#webhook) for the full property table with settability information.

## /Webhooks

### GET `/Webhooks`

- **Response**: Entity (entity)

### POST `/Webhooks`

- **Response**: Entity (entity)
- **Body**: JSON object with entity fields
- Supports `?webhooks=false` to suppress webhook emission

### PATCH `/Webhooks/{key}`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)
- **Body**: JSON delta (only changed fields)
- Supports `?webhooks=false` to suppress webhook emission

### DELETE `/Webhooks/{key}`

- **Parameters**:
  - `key`: `int`
- **Response**: `200 OK`
- Performs soft delete

## /WebhooksActions

### GET `/WebhooksActions`

- **Response**: Entity (entity)

## /WebhooksStatus

