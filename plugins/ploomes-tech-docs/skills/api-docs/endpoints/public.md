# /PublicDocuments

## Data Model

See [PublicDocument data model](../data-models/public-document.md#publicdocument) for the full property table with settability information.

## /PublicDocuments

### GET `/PublicDocuments`

- **Parameters**:
  - `traceable`: `bool` (default: `true`)
- **Response**: Entity (entity)

### POST `/PublicDocuments/Accept`

- **Response**: Entity (entity)

## /PublicDocumentsExternalComments

### GET `/PublicDocumentsExternalComments`

- **Response**: Entity (entity)

### POST `/PublicDocumentsExternalComments`

- **Response**: Entity (entity)
- **Body**: JSON object with entity fields
- Supports `?webhooks=false` to suppress webhook emission

## /PublicOrders

### GET `/PublicOrders`

- **Parameters**:
  - `traceable`: `bool` (default: `true`)
- **Response**: Entity (entity)

### POST `/PublicOrders/Accept`

- **Response**: Entity (entity)

## /PublicOrdersExternalComments

### GET `/PublicOrdersExternalComments`

- **Response**: Entity (entity)

### POST `/PublicOrdersExternalComments`

- **Response**: Entity (entity)
- **Body**: JSON object with entity fields
- Supports `?webhooks=false` to suppress webhook emission

## /PublicQuotes

### GET `/PublicQuotes`

- **Parameters**:
  - `traceable`: `bool` (default: `true`)
- **Response**: Entity (entity)

### POST `/PublicQuotes/Accept`

- **Response**: Entity (entity)

## /PublicQuotesExternalComments

### GET `/PublicQuotesExternalComments`

- **Response**: Entity (entity)

### POST `/PublicQuotesExternalComments`

- **Response**: Entity (entity)
- **Body**: JSON object with entity fields
- Supports `?webhooks=false` to suppress webhook emission

## /PublicRelatedPeople

### GET `/PublicRelatedPeople`

- **Response**: Entity (entity)
