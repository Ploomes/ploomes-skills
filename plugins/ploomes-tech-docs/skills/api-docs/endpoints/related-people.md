# /RelatedPeopleEmailsTypes

## Data Model

See [RelatedPerson data model](../data-models/other.md#relatedperson) for the full property table with settability information.

## /RelatedPeopleEmailsTypes

### GET `/RelatedPeopleEmailsTypes`

- **Response**: Entity (entity)

## /RelatedPeopleEmailsTypesTemplates

### GET `/RelatedPeopleEmailsTypesTemplates`

- **Response**: Entity (entity)

### POST `/RelatedPeopleEmailsTypesTemplates`

- **Response**: Entity (entity)
- **Body**: JSON object with entity fields
- Supports `?webhooks=false` to suppress webhook emission

### DELETE `/RelatedPeopleEmailsTypesTemplates/{key}`

- **Parameters**:
  - `key`: `int`
- **Response**: `200 OK`
- Performs soft delete
