# /Automations

## Data Model

See [Automation data model](../data-models/automation.md#automation) for the full property table with settability information.

## /Automations

### GET `/Automations`

- **Response**: Entity (entity)

### POST `/Automations`

- **Response**: Entity (entity)
- **Body**: JSON object with entity fields
- Supports `?webhooks=false` to suppress webhook emission

**Create the filter first.** An automation references its trigger filter by id, so
the filter has to exist before the automation: `POST /Filters` (see
[Filters](filters.md#post-filters)), then `POST /Automations` with
`TriggerFilterId` set to the id it returned. A `TriggerFilter` object nested in the
automation body is **ignored**, and the call still answers `200`.

Two defaults that bite:

- **Without `Enabled` in the body, the automation is created enabled** and starts
  firing immediately. Send `"Enabled": false` and turn it on deliberately.
- Send `"BlockTriggerByAutomation": true` unless you want this automation to be
  re-triggered by other automations' writes.

`Name` accepts **150 characters**. At 151 both `POST` and `PATCH` answer
`400 "Your request has a wrong format"` without naming the offending property —
the error looks like malformed JSON, and is not.

```json
{ "Name": "…", "EntityId": 2, "TriggerId": <TriggerId>, "TriggerFilterId": <FilterId>, "Enabled": false, "BlockTriggerByAutomation": true }
```

To change the filter of an existing automation, create a **new** filter and send
only `{"TriggerFilterId": <new id>}` — no `Actions` (see the `PATCH` note below).

### PATCH `/Automations/{key}`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)
- **Body**: JSON delta for scalar properties. **`Actions` is not a delta** — see below
- Supports `?webhooks=false` to suppress webhook emission

> **A body carrying `Actions` replaces the whole collection, and requires both
> `EntityId` and `TriggerId`.**
>
> Without `EntityId` and `TriggerId` the call fails with
> `500 Object reference not set to an instance of an object`, raised in
> `AssertEntityPermissionForActions` while the server checks the entity permission
> for the actions.
>
> With `Actions` present, the stored collection is **discarded and rebuilt** from
> what you sent: an action you don't resend is **deleted**, and every action gets a
> new `Id` on each save — three consecutive PATCHes produced three different ids for
> the same action. Never diff by id.
>
> The safe sequence: disable the automation, `GET` it expanding `Actions`, send
> **every** action back with your change applied, then `GET` again and compare by
> content.
>
> ```json
> { "EntityId": 2, "TriggerId": <TriggerId>, "Actions": [ <every action read from the GET, with the change applied> ] }
> ```
>
> To edit anything else — including swapping the trigger filter — leave `Actions`
> out of the body entirely.

### DELETE `/Automations/{key}`

- **Parameters**:
  - `key`: `int`
- **Response**: `200 OK`
- Performs soft delete

### POST `/Automations/{key}/Execute`

- **Parameters**:
  - `key`: `int`
- **Response**: `boolean`

### POST `/Automations/{key}/ExecuteNow`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)

### POST `/Automations/{key}/Duplicate`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)

> **The copy is created enabled** (`Enabled: true`), regardless of the original's
> state, and starts firing as soon as it exists. It also gets its **own new filter**,
> carrying the same `Url` and the same `Fields` as the original's — the two
> automations do not share one filter row.

### POST `/Automations/DuplicateAllFromStageIntoAnotherStage`

- **Response**: `200 OK`

### POST `/Automations/CalculateAllAutomationsToExecute`

- **Response**: `200 OK`

### POST `/Automations/ApplyExternalFormulaResult`

- **Response**: `200 OK`

### GET `/Automations/GetDeletedAutomations`

> ⚠️ **Answers `500 "A possible object cycle was detected"`.** Listing is not
> recovery either way: there is no restore action (see
> [06 · Deleted Records](../06-common-patterns.md#deleted-records)).

- **Response**: Entity (entity)

## /AutomationsActionsActions

### GET `/AutomationsActionsActions`

- **Response**: Entity (entity)

## /AutomationsActionsEmailSenderTypes

### GET `/AutomationsActionsEmailSenderTypes`

- **Response**: Entity (entity)

## /AutomationsAllowedEntities

### GET `/AutomationsAllowedEntities`

- **Response**: Entity (entity)

## /AutomationsLogs

### GET `/AutomationsLogs`

- **Response**: Entity (entity)

## /AutomationsStatus

### GET `/AutomationsStatus`

- **Response**: Entity (entity)

## /AutomationsTriggers

### GET `/AutomationsTriggers`

- **Response**: Entity (entity)
