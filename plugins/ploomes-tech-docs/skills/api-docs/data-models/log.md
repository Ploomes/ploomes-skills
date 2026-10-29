# Log — Data Models

Data models for the Log domain.

### Column Reference

Each property table includes the following columns:

| Column | Description |
|--------|-------------|
| **FieldKey** | The key used to reference this property in the Fields system (see [Fields & Entities](../07-fields-and-entities.md)). Empty if the property is not exposed as a field. |
| **Creatable** | **Yes** = can be set on `POST` (create). **No** = cannot be set on create; managed by the system. |
| **Editable** | **Yes** = can be set on `PATCH` (edit). **No** = cannot be set on edit; managed by the system. |

> **Note on Required vs Nullable**: If a field is not Required and is not Nullable, you may omit it from the payload (the API will set a default value), but you may not send it as `null`.

---

### Log


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| ChangeLogId | integer | Yes |  | No | No |
| FieldKey | string | Yes |  | No | No |
| FieldPathId | integer | Yes |  | No | No |
| OldValue | string | Yes |  | No | No |
| NewValue | string | Yes |  | No | No |
| OldObjectValueName | string | Yes |  | No | No |
| NewObjectValueName | string | Yes |  | No | No |
| BaseIndex | integer | Yes |  | No | No |
| Index | integer | Yes |  | No | No |
| ActionId | integer | Yes |  | No | No |
| EntityId | integer | Yes |  | No | No |
| UpdaterId | integer | Yes |  | No | No |
| DateTime | datetime | No |  | No | No |


**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| ChangeLog | LogChange | No |  | No | No |
| Field | Field | No |  | No | No |
| FieldPath | FieldEntityPath | No |  | No | No |
| Action | WebhookAction | No |  | No | No |
| Entity | FieldEntity | No |  | No | No |
| Updater | User | No |  | No | No |

---


### LogChange


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| ActionId | integer | Yes |  | No | No |
| EntityId | integer | Yes |  | No | No |
| UpdaterId | integer | Yes |  | No | No |
| DateTime | datetime | No |  | No | No |

**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Action | WebhookAction | No |  | No | No |
| Entity | FieldEntity | No |  | No | No |
| Updater | User | No |  | No | No |

---

