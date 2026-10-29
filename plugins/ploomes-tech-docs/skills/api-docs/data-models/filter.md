# Filter — Data Models

Data models for the Filter domain.

### Column Reference

Each property table includes the following columns:

| Column | Description |
|--------|-------------|
| **FieldKey** | The key used to reference this property in the Fields system (see [Fields & Entities](../07-fields-and-entities.md)). Empty if the property is not exposed as a field. |
| **Creatable** | **Yes** = can be set on `POST` (create). **No** = cannot be set on create; managed by the system. |
| **Editable** | **Yes** = can be set on `PATCH` (edit). **No** = cannot be set on edit; managed by the system. |

> **Note on Required vs Nullable**: If a field is not Required and is not Nullable, you may omit it from the payload (the API will set a default value), but you may not send it as `null`.

---

### Filter


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| Name | string | Yes |  | Yes | Yes |
| Url | string | Yes |  | Yes | Yes |
| EntityId | integer | Yes |  | Yes | No |
| Listable | boolean | No |  | No | No |


**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Entity | FieldEntity | No |  | No | No |
| Fields | Collection(FilterField) | Yes |  | Yes | Yes |
| AllowedUsers | Collection(FilterAllowedUser) | Yes |  | No | No |
| AllowedTeams | Collection(FilterAllowedTeam) | Yes |  | No | No |

> **Writing a filter's conditions.** A filter is created in one call: `POST /Filters`
> with `Name`, `EntityId`, `Url` (the `$filter` string, spaces encoded as `+`) and a
> `Fields` array. Each field carries `FieldKey`, `OperationId`, `FieldTypeId`,
> `LogicalGroupNumber` and its own `Values` array, with the value in the column
> matching the type. A "field is one of these" condition is one field holding several
> values, and a field with no `Values` renders as "no filter" on screen even when the
> `Url` is right.

> **`PATCH /Filters({id})` does not edit conditions by delta.** A body with only `Url`
> answers `200` and changes nothing; a partial `Fields` array answers
> `400 "Your request has a wrong format"`, as does any body missing `Id`, `Name` or
> `Url`. Resending the whole object replaces `Fields` and `Values`, which come back
> with new ids. For an automation, create a new filter with `POST /Filters` and point
> `TriggerFilterId` at it.

---


### FilterAllowedTeam


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| FilterId | integer | Yes |  | No | No |
| TeamId | integer | Yes |  | No | No |

**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Filter | Filter | No |  | No | No |
| Team | Team | No |  | No | No |

---


### FilterAllowedUser


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| FilterId | integer | Yes |  | No | No |

**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Filter | Filter | No |  | No | No |
| User | User | No |  | No | No |

---


### FilterField


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| FilterId | integer | Yes |  | No | No |
| LogicalGroupNumber | integer | Yes |  | No | No |
| FieldKey | string | Yes |  | No | No |
| RelativeDate | boolean | No |  | No | No |
| OperationId | integer | Yes |  | No | No |
| SelectorId | integer | Yes |  | No | No |
| Interval | boolean | Yes |  | No | No |
| FieldTypeId | integer | Yes |  | No | No |
| FieldName | string | Yes |  | No | No |

**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Filter | Filter | No |  | No | No |
| Field | Field | No |  | No | No |
| Operation | Operation | No |  | No | No |
| Selector | Selector | No |  | No | No |
| FieldPath | Collection(FilterFieldField) | Yes |  | No | No |
| Values | Collection(FilterFieldValue) | Yes |  | Yes | Yes |

---

