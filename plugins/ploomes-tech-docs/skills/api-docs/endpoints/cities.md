# /Cities

## Data Model

See [City data model](../data-models/other.md#city) for the full property table with settability information.

## /Cities

### GET `/Cities`

- **Response**: Entity (entity)

### POST `/Cities`

- **Parameters**:
  - `adminValidation`: `bool` (default: `false`)
- **Response**: Entity (entity)
- **Body**: JSON object with entity fields
- Supports `?webhooks=false` to suppress webhook emission

### PATCH `/Cities/{key}`

- **Parameters**:
  - `key`: `int`
  - `adminValidation`: `bool` (default: `false`)
- **Response**: Entity (entity)
- **Body**: JSON delta (only changed fields)
- Supports `?webhooks=false` to suppress webhook emission

### DELETE `/Cities/{key}`

- **Parameters**:
  - `key`: `int`
  - `adminValidation`: `bool` (default: `false`)
- **Response**: `200 OK`
- Performs soft delete

### GET `/Cities/GetDeletedCities`

> ⚠️ **Answers `500 "A possible object cycle was detected"`.** Listing is not
> recovery either way: there is no restore action (see
> [06 · Deleted Records](../06-common-patterns.md#deleted-records)).

- **Response**: Entity (entity)

## /CitiesCountries

### GET `/CitiesCountries`

- **Response**: Entity (entity)

## /CitiesCountriesStates

### GET `/CitiesCountriesStates`

- **Response**: Entity (entity)
