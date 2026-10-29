# Self — Data Models

Data models for the Self domain.

### Column Reference

Each property table includes the following columns:

| Column | Description |
|--------|-------------|
| **FieldKey** | The key used to reference this property in the Fields system (see [Fields & Entities](../07-fields-and-entities.md)). Empty if the property is not exposed as a field. |
| **Creatable** | **Yes** = can be set on `POST` (create). **No** = cannot be set on create; managed by the system. |
| **Editable** | **Yes** = can be set on `PATCH` (edit). **No** = cannot be set on edit; managed by the system. |

> **Note on Required vs Nullable**: If a field is not Required and is not Nullable, you may omit it from the payload (the API will set a default value), but you may not send it as `null`.

---

### Self



| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| AccountId | integer | No | self_account | No | No |
| AccountOwner | boolean | No |  | No | No |
| Name | string | Yes | self_name | Yes | Yes |
| Email | string | Yes |  | No | No |
| UserKey | string | Yes |  | No | No |
| ImportationKey | string | Yes |  | No | No |
| ImportationKeyExpiringDate | datetime | Yes |  | No | No |
| CurrentImportationId | integer | Yes |  | No | No |
| RoleId | integer | Yes |  | No | No |
| AvatarUrl | string | Yes |  | No | No |
| ProfileId | integer | No |  | No | No |
| Facebook | string | Yes |  | No | No |
| LinkedIn | string | Yes |  | No | No |
| Phone | string | Yes |  | No | No |
| Language | string | Yes |  | No | No |
| LanguageId | integer | Yes |  | No | No |
| NotificationsCounter | integer | No |  | No | No |
| DealsCounter | integer | No |  | No | No |
| LeadsCounter | integer | No |  | No | No |


**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Account | Account | No | self_account | No | No |
| Role | Role | No |  | No | No |
| Profile | UserProfile | No |  | No | No |
| Teams | Collection<UserTeam> | Yes |  | No | No |
| CurrentImportation | Importation | No |  | No | No |

---


### SelfPipelineSelectorViewMode


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| Name | string | Yes |  | No | No |

---

