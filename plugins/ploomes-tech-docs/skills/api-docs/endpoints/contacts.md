# /Contacts

> Contacts represent people and companies in the CRM. They are polymorphic — a contact can be a Company (TypeId=1) or a Person/Individual (TypeId=2). Persons can be linked to a Company via `CompanyId`.

## Key Business Rules

- Contacts have a `TypeId`: 1 = Company, 2 = Person/Individual
- Persons can belong to a Company (`CompanyId`)
- Contacts support custom fields via `OtherProperties`
- Duplicate detection is available via `IsDuplicate` and `IsPhoneDuplicate`
- `Editable` and `Deletable` indicate current user's permissions
- Bulk update/delete operations are available with OData filter-based selection
- Contacts support avatar images (upload or from URL)

## Data Model

See [Contact data model](../data-models/contact.md#contact) for the full property table with settability information.

## /Contacts

### GET `/Contacts`

- **OData queryable**: Yes (`$filter`, `$select`, `$expand`, `$orderby`, `$top`, `$skip`, `$count`, `$apply`)
- **Response**: JSON

### POST `/Contacts`

- **Parameters**:
  - `webhooks`: `bool` (default: `true`)
- **Response**: `200 OK`
- **Body**: JSON object with entity fields
- Supports `?webhooks=false` to suppress webhook emission

### PATCH `/Contacts/{key}`

- **Parameters**:
  - `key`: `int`
  - `webhooks`: `bool` (default: `true`)
- **Response**: Entity (entity)
- **Body**: JSON delta (only changed fields)
- Supports `?webhooks=false` to suppress webhook emission

### DELETE `/Contacts/{key}`

- **Parameters**:
  - `key`: `int`
  - `webhooks`: `bool` (default: `true`)
- **Response**: `200 OK`
- Performs soft delete

### POST `/Contacts/BulkUpdate`

- **Response**: Entity (entity)

### POST `/Contacts/BulkDelete`

- **Response**: Entity (entity)

### POST `/Contacts/{key}/UploadFile`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)

### POST `/Contacts/IsDuplicate`

- **Response**: `boolean`

### POST `/Contacts/{key}/IsPhoneDuplicate`

- **Parameters**:
  - `key`: `int`
- **Response**: `List<PhoneIsDuplicateValue>`

### POST `/Contacts/{key}/IsForeignZipCodeDuplicate`

- **Parameters**:
  - `key`: `int`
- **Response**: `boolean`

### POST `/Contacts/{key}/IsDuplicate`

- **Parameters**:
  - `key`: `int`
- **Response**: `boolean`

### GET `/Contacts/GetDeletedContacts`

- **Response**: Entity (entity)

### POST `/Contacts/{key}/UploadAvatar`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)

### POST `/Contacts/{key}/UploadAvatarFromUrl`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)

### POST `/Contacts/GetContactsByEmail`

- **Response**: Entity (entity)

### POST `/Contacts/GetContactsByIdsAndFilter`

- **Response**: Entity (entity)

### GET `/Contacts/AggregateByOtherProperties`

- **Response**: Entity (entity)

## /ContactsClasses

### GET `/ContactsClasses`

- **Response**: Entity (entity)

## /ContactsImports

### POST `/ContactsImports`

- **Response**: Entity (entity)
- **Body**: JSON object with entity fields
- Supports `?webhooks=false` to suppress webhook emission

### PATCH `/ContactsImports/{key}`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)
- **Body**: JSON delta (only changed fields)
- Supports `?webhooks=false` to suppress webhook emission

## /ContactsLinesOfBusiness

### GET `/ContactsLinesOfBusiness`

- **Response**: Entity (entity)

### POST `/ContactsLinesOfBusiness`

- **Parameters**:
  - `adminValidation`: `bool` (default: `false`)
- **Response**: Entity (entity)
- **Body**: JSON object with entity fields
- Supports `?webhooks=false` to suppress webhook emission

### PATCH `/ContactsLinesOfBusiness/{key}`

- **Parameters**:
  - `key`: `int`
  - `adminValidation`: `bool` (default: `false`)
- **Response**: Entity (entity)
- **Body**: JSON delta (only changed fields)
- Supports `?webhooks=false` to suppress webhook emission

### DELETE `/ContactsLinesOfBusiness/{key}`

- **Parameters**:
  - `key`: `int`
  - `adminValidation`: `bool` (default: `false`)
- **Response**: `200 OK`
- Performs soft delete

## /ContactsNumbersOfEmployees

### GET `/ContactsNumbersOfEmployees`

- **Response**: Entity (entity)

### POST `/ContactsNumbersOfEmployees`

- **Parameters**:
  - `adminValidation`: `bool` (default: `false`)
- **Response**: Entity (entity)
- **Body**: JSON object with entity fields
- Supports `?webhooks=false` to suppress webhook emission

### PATCH `/ContactsNumbersOfEmployees/{key}`

- **Parameters**:
  - `key`: `int`
  - `adminValidation`: `bool` (default: `false`)
- **Response**: Entity (entity)
- **Body**: JSON delta (only changed fields)
- Supports `?webhooks=false` to suppress webhook emission

### DELETE `/ContactsNumbersOfEmployees/{key}`

- **Parameters**:
  - `key`: `int`
  - `adminValidation`: `bool` (default: `false`)
- **Response**: `200 OK`
- Performs soft delete

## /ContactsOrigins

**MaxTop**: 10000

### GET `/ContactsOrigins`

- **Response**: Entity (entity)

### POST `/ContactsOrigins`

- **Parameters**:
  - `adminValidation`: `bool` (default: `false`)
- **Response**: Entity (entity)
- **Body**: JSON object with entity fields
- Supports `?webhooks=false` to suppress webhook emission

### PATCH `/ContactsOrigins/{key}`

- **Parameters**:
  - `key`: `int`
  - `adminValidation`: `bool` (default: `false`)
- **Response**: Entity (entity)
- **Body**: JSON delta (only changed fields)
- Supports `?webhooks=false` to suppress webhook emission

### DELETE `/ContactsOrigins/{key}`

- **Parameters**:
  - `key`: `int`
  - `adminValidation`: `bool` (default: `false`)
- **Response**: `ActionResult`
- Performs soft delete

## /ContactsProducts

### GET `/ContactsProducts`

- **Response**: Entity (entity)

### POST `/ContactsProducts`

- **Response**: Entity (entity)
- **Body**: JSON object with entity fields
- Supports `?webhooks=false` to suppress webhook emission

### PATCH `/ContactsProducts/{key}`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)
- **Body**: JSON delta (only changed fields)
- Supports `?webhooks=false` to suppress webhook emission

### DELETE `/ContactsProducts/{key}`

- **Parameters**:
  - `key`: `int`
- **Response**: `200 OK`
- Performs soft delete

### GET `/ContactsProducts/GetDeletedContactsProducts`

- **Response**: Entity (entity)

### GET `/ContactsProducts/AggregateByOtherProperties`

- **Response**: Entity (entity)

## /ContactsRelationships

### GET `/ContactsRelationships`

- **Response**: Entity (entity)

### POST `/ContactsRelationships`

- **Parameters**:
  - `adminValidation`: `bool` (default: `false`)
- **Response**: Entity (entity)
- **Body**: JSON object with entity fields
- Supports `?webhooks=false` to suppress webhook emission

### PATCH `/ContactsRelationships/{key}`

- **Parameters**:
  - `key`: `int`
  - `adminValidation`: `bool` (default: `false`)
- **Response**: Entity (entity)
- **Body**: JSON delta (only changed fields)
- Supports `?webhooks=false` to suppress webhook emission

### DELETE `/ContactsRelationships/{key}`

- **Parameters**:
  - `key`: `int`
  - `adminValidation`: `bool` (default: `false`)
- **Response**: `200 OK`
- Performs soft delete

## /ContactsStatus

### GET `/ContactsStatus`

- **Response**: Entity (entity)

### POST `/ContactsStatus`

- **Parameters**:
  - `adminValidation`: `bool` (default: `false`)
- **Response**: Entity (entity)
- **Body**: JSON object with entity fields
- Supports `?webhooks=false` to suppress webhook emission

### PATCH `/ContactsStatus/{key}`

- **Parameters**:
  - `key`: `int`
  - `adminValidation`: `bool` (default: `false`)
- **Response**: Entity (entity)
- **Body**: JSON delta (only changed fields)
- Supports `?webhooks=false` to suppress webhook emission

### DELETE `/ContactsStatus/{key}`

- **Parameters**:
  - `key`: `int`
  - `adminValidation`: `bool` (default: `false`)
- **Response**: `200 OK`
- Performs soft delete

### GET `/ContactsStatus/GetDeletedContactsStatus`

- **Response**: Entity (entity)

## /ContactsTypes

### GET `/ContactsTypes`

- **Response**: Entity (entity)
