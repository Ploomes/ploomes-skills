# Tag — Data Models

Data models for the Tag domain.

### Column Reference

Each property table includes the following columns:

| Column | Description |
|--------|-------------|
| **FieldKey** | The key used to reference this property in the Fields system (see [Fields & Entities](../07-fields-and-entities.md)). Empty if the property is not exposed as a field. |
| **Creatable** | **Yes** = can be set on `POST` (create). **No** = cannot be set on create; managed by the system. |
| **Editable** | **Yes** = can be set on `PATCH` (edit). **No** = cannot be set on edit; managed by the system. |

> **Note on Required vs Nullable**: If a field is not Required and is not Nullable, you may omit it from the payload (the API will set a default value), but you may not send it as `null`.

---

### Tag


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| Name | string | Yes | tag_name | Yes | Yes |
| Color | string | Yes | tag_color | Yes | Yes |
| EntityId | integer | No |  | No | No |


**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Entity | TagEntity | No |  | No | No |

---


### TagEntity


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| Name | string | Yes |  | No | No |

---


### TagItem


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| TagId | integer | No |  | No | No |
| NoteId | integer | Yes |  | No | No |
| InteractionRecordId | integer | Yes |  | No | No |
| TaskId | integer | Yes |  | No | No |
| ContactId | integer | Yes |  | No | No |
| DealId | integer | Yes |  | No | No |
| LeadId | integer | Yes |  | No | No |
| EmailId | integer | Yes |  | No | No |

**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Tag | Tag | No |  | No | No |
| Note | Note | No |  | No | No |
| InteractionRecord | InteractionRecord | No |  | No | No |
| Task | Task | No |  | No | No |
| DeletedTask | TaskDeletedView | No |  | No | No |
| Contact | Contact | No |  | No | No |
| Deal | Deal | No |  | No | No |
| Lead | Lead | No |  | No | No |
| Email | Email | No |  | No | No |

---

