# /Products

> Products represent items in the product catalog. They follow a hierarchy: Family → Group → Product → Part. Products support text search and smart search.

## Key Business Rules

- **Product hierarchy**: ProductFamily → ProductGroup → Product → ProductPart
- **Search endpoints**: `/Products/SmartSearch`, `/Products/SearchByName`, `/Products/SearchByNameOrCode`, `/Products/SearchByNameOrExactCode`
- `/Products/Search` and `/Products/SmartSearchV2` answer `405` and are absent from `$metadata`; `/Products/GetV2` does not exist either
- Products can have images uploaded via `/Products/{id}/UploadImage`
- Products support OtherProperties (custom fields)

## Data Model

See [Product data model](../data-models/product.md#product) for the full property table with settability information.

## /Products

> Products represent items in the product catalog. They follow a hierarchy: Family → Group → Product → Part. Products support text search and smart search.

## Key Business Rules

- **Product hierarchy**: ProductFamily → ProductGroup → Product → ProductPart
- **Search endpoints**: `/Products/SmartSearch`, `/Products/SearchByName`, `/Products/SearchByNameOrCode`, `/Products/SearchByNameOrExactCode`
- `/Products/Search` and `/Products/SmartSearchV2` answer `405` and are absent from `$metadata`; `/Products/GetV2` does not exist either
- Products can have images uploaded via `/Products/{id}/UploadImage`
- Products support OtherProperties (custom fields)

### GET `/Products`

- **Response**: Entity (entity)

### GET `/Products/GetV2`

> ⚠️ **Does not exist.**

- **OData queryable**: Yes (`$filter`, `$select`, `$expand`, `$orderby`, `$top`, `$skip`, `$count`, `$apply`)
- **Response**: JSON

### POST `/Products`

- **Response**: Entity (entity)
- **Body**: JSON object with entity fields
- Supports `?webhooks=false` to suppress webhook emission

### DELETE `/Products/{key}`

- **Parameters**:
  - `key`: `int`
- **Response**: `200 OK`
- Performs soft delete

### POST `/Products/{key}/UploadImage`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)

### GET `/Products/GetDeletedProducts`

- **Response**: Entity (entity)

### GET `/Products/Search`

> ⚠️ **Answers `405`.** Use `/Products/SmartSearch?text=`.

- **OData queryable**: Yes (`$filter`, `$select`, `$expand`, `$orderby`, `$top`, `$skip`, `$count`, `$apply`)
- **Parameters**:
  - `text`: `string` (default: `null`)
- **Response**: JSON

### GET `/Products/SmartSearch`

- **OData queryable**: Yes (`$filter`, `$select`, `$expand`, `$orderby`, `$top`, `$skip`, `$count`, `$apply`)
- **Parameters**:
  - `text`: `string` (default: `null`)
- **Response**: JSON

### GET `/Products/SmartSearchV2`

> ⚠️ **Answers `405`.** Use `/Products/SmartSearch?text=`.

- **OData queryable**: Yes (`$filter`, `$select`, `$expand`, `$orderby`, `$top`, `$skip`, `$count`, `$apply`)
- **Parameters**:
  - `text`: `string` (default: `null`)
- **Response**: JSON

### POST `/Products/GetProductsByIdsAndFilter`

- **Response**: Entity (entity)

### GET `/Products/AggregateByOtherProperties`

- **Response**: Entity (entity)

## /ProductsFamilies

### GET `/ProductsFamilies`

- **Response**: Entity (entity)

### POST `/ProductsFamilies`

- **Response**: Entity (entity)
- **Body**: JSON object with entity fields
- Supports `?webhooks=false` to suppress webhook emission

### PATCH `/ProductsFamilies/{key}`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)
- **Body**: JSON delta (only changed fields)
- Supports `?webhooks=false` to suppress webhook emission

### DELETE `/ProductsFamilies/{key}`

- **Parameters**:
  - `key`: `int`
- **Response**: `200 OK`
- Performs soft delete

## /ProductsGroups

### GET `/ProductsGroups`

- **Response**: Entity (entity)

### POST `/ProductsGroups`

- **Response**: Entity (entity)
- **Body**: JSON object with entity fields
- Supports `?webhooks=false` to suppress webhook emission

### PATCH `/ProductsGroups/{key}`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)
- **Body**: JSON delta (only changed fields)
- Supports `?webhooks=false` to suppress webhook emission

### DELETE `/ProductsGroups/{key}`

- **Parameters**:
  - `key`: `int`
- **Response**: `200 OK`
- Performs soft delete

## /ProductsLists

### GET `/ProductsLists`

- **Response**: Entity (entity)

### POST `/ProductsLists`

- **Response**: Entity (entity)
- **Body**: JSON object with entity fields
- Supports `?webhooks=false` to suppress webhook emission

### PATCH `/ProductsLists/{key}`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)
- **Body**: JSON delta (only changed fields)
- Supports `?webhooks=false` to suppress webhook emission

### DELETE `/ProductsLists/{key}`

- **Parameters**:
  - `key`: `int`
- **Response**: `200 OK`
- Performs soft delete

## /ProductsParts

### GET `/ProductsParts`

- **Response**: Entity (entity)

### GET `/ProductsParts/AggregateByOtherProperties`

- **Response**: Entity (entity)

### POST `/ProductsParts`

- **Response**: Entity (entity)
- **Body**: JSON object with entity fields
- Supports `?webhooks=false` to suppress webhook emission

### PATCH `/ProductsParts/{key}`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)
- **Body**: JSON delta (only changed fields)
- Supports `?webhooks=false` to suppress webhook emission

### DELETE `/ProductsParts/{key}`

- **Parameters**:
  - `key`: `int`
- **Response**: `200 OK`
- Performs soft delete

### PATCH `/ProductsParts/BulkUpdate`

- **Response**: `200 OK`
- **Body**: JSON delta (only changed fields)
- Supports `?webhooks=false` to suppress webhook emission

### POST `/ProductsParts/BulkOrdination`

- **Response**: `200 OK`

## /ProductsPartsGroups

### GET `/ProductsPartsGroups`

- **Response**: Entity (entity)

### POST `/ProductsPartsGroups`

- **Response**: Entity (entity)
- **Body**: JSON object with entity fields
- Supports `?webhooks=false` to suppress webhook emission

### PATCH `/ProductsPartsGroups/{key}`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)
- **Body**: JSON delta (only changed fields)
- Supports `?webhooks=false` to suppress webhook emission

### DELETE `/ProductsPartsGroups/{key}`

- **Parameters**:
  - `key`: `int`
  - `replacementProductPartGroupId`: `int?` (default: `null`)
- **Response**: `200 OK`
- Performs soft delete
