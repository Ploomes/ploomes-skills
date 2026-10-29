# /Timeline

## Data Model

See [Timeline data model](../data-models/other.md#timeline) for the full property table with settability information.

## /Timeline

### GET `/Timeline`

- **Parameters**:
  - `skip`: `int` (default: `0`)
  - `top`: `int` (default: `10`)
  - `timelineId`: `int` (default: `1`)
  - `contactId`: `int?` (default: `null`)
  - `dealId`: `int?` (default: `null`)
  - `quoteId`: `int?` (default: `null`)
  - `userId`: `int?` (default: `null`)
  - `orderId`: `int?` (default: `null`)
  - `documentId`: `int?` (default: `null`)
  - `quotes`: `bool?` (default: `null`)
  - `entities`: `string` (default: `null`)
  - `interactionRecordTags`: `string` (default: `null`)
  - `interactionRecordTypes`: `string` (default: `null`)
  - `startDate`: `DateTime?` (default: `null`)
  - `endDate`: `DateTime?` (default: `null`)
- **Response**: Entity (entity)

## /TimelineEntities

### GET `/TimelineEntities`

- **Response**: Entity (entity)
