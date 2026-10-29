# /Panels

## Data Model

See [Panel data model](../data-models/panel.md#panel) for the full property table with settability information.

## /Panels

### GET `/Panels`

- **Response**: Entity (entity)

### POST `/Panels`

- **Response**: Entity (entity)
- **Body**: JSON object with entity fields
- Supports `?webhooks=false` to suppress webhook emission

### PATCH `/Panels/{key}`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)
- **Body**: JSON delta (only changed fields)
- Supports `?webhooks=false` to suppress webhook emission

### DELETE `/Panels/{key}`

- **Parameters**:
  - `key`: `int`
- **Response**: `200 OK`
- Performs soft delete

### GET `/Panels/GetDeletedPanels`

- **Response**: Entity (entity)

## /PanelsCharts

### GET `/PanelsCharts`

- **Response**: Entity (entity)

### POST `/PanelsCharts`

- **Response**: Entity (entity)
- **Body**: JSON object with entity fields
- Supports `?webhooks=false` to suppress webhook emission

### PATCH `/PanelsCharts/{key}`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)
- **Body**: JSON delta (only changed fields)
- Supports `?webhooks=false` to suppress webhook emission

### DELETE `/PanelsCharts/{key}`

- **Parameters**:
  - `key`: `int`
- **Response**: `200 OK`
- Performs soft delete

## /PanelsChartsMetricsAggregators

### GET `/PanelsChartsMetricsAggregators`

- **Response**: Entity (entity)

## /PanelsChartsMetricsModifiers

### GET `/PanelsChartsMetricsModifiers`

- **Response**: Entity (entity)

## /PanelsChartsTypes

### GET `/PanelsChartsTypes`

- **Response**: Entity (entity)

## /PanelsGoals

### GET `/PanelsGoals`

- **Response**: Entity (entity)

### POST `/PanelsGoals`

- **Response**: Entity (entity)
- **Body**: JSON object with entity fields
- Supports `?webhooks=false` to suppress webhook emission

### PATCH `/PanelsGoals/{key}`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)
- **Body**: JSON delta (only changed fields)
- Supports `?webhooks=false` to suppress webhook emission

### DELETE `/PanelsGoals/{key}`

- **Parameters**:
  - `key`: `int`
- **Response**: `200 OK`
- Performs soft delete
