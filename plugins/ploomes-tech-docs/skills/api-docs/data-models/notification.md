# Notification — Data Models

Data models for the Notification domain.

### Column Reference

Each property table includes the following columns:

| Column | Description |
|--------|-------------|
| **FieldKey** | The key used to reference this property in the Fields system (see [Fields & Entities](../07-fields-and-entities.md)). Empty if the property is not exposed as a field. |
| **Creatable** | **Yes** = can be set on `POST` (create). **No** = cannot be set on create; managed by the system. |
| **Editable** | **Yes** = can be set on `PATCH` (edit). **No** = cannot be set on edit; managed by the system. |

> **Note on Required vs Nullable**: If a field is not Required and is not Nullable, you may omit it from the payload (the API will set a default value), but you may not send it as `null`.

---

### Notification


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| Read | boolean | No |  | No | No |
| ActionUserId | integer | Yes |  | No | No |
| DateTime | datetime | No |  | No | No |
| PrimaryTargetId | integer | Yes |  | No | No |
| SecondaryTargetId | integer | Yes |  | No | No |
| StringTargetId | string | Yes |  | No | No |
| DaysToExpire | integer | Yes |  | No | No |


**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| ActionUser | User | No |  | No | No |
| Action | NotificationAction | No |  | No | No |

---


### NotificationAction


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| PrimaryTargetEntityId | integer | Yes |  | No | No |
| Text | string | Yes |  | No | No |
| ExternalUrl | string | Yes |  | No | No |
| Icon | string | Yes |  | No | No |
| Exclusion | boolean | No |  | No | No |

**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| PrimaryTargetEntity | NotificationEntity | No |  | No | No |

---

