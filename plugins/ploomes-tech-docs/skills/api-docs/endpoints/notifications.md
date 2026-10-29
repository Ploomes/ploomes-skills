# /Notifications

## Data Model

See [Notification data model](../data-models/notification.md#notification) for the full property table with settability information.

## /Notifications

### GET `/Notifications`

- **Response**: Entity (entity)

### PATCH `/Notifications/{key}`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)
- **Body**: JSON delta (only changed fields)
- Supports `?webhooks=false` to suppress webhook emission

### POST `/Notifications/ReadAll`

- **Response**: Entity (entity)

## /NotificationsEntities

### GET `/NotificationsEntities`

- **Response**: Entity (entity)
