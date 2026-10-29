# Team — Data Models

Data models for the Team domain.

### Column Reference

Each property table includes the following columns:

| Column | Description |
|--------|-------------|
| **FieldKey** | The key used to reference this property in the Fields system (see [Fields & Entities](../07-fields-and-entities.md)). Empty if the property is not exposed as a field. |
| **Creatable** | **Yes** = can be set on `POST` (create). **No** = cannot be set on create; managed by the system. |
| **Editable** | **Yes** = can be set on `PATCH` (edit). **No** = cannot be set on edit; managed by the system. |

> **Note on Required vs Nullable**: If a field is not Required and is not Nullable, you may omit it from the payload (the API will set a default value), but you may not send it as `null`.

---

### Team


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| Name | string | Yes | team_name | Yes | Yes |
| CreatorId | integer | Yes |  | No | No |
| CreateDate | datetime | No |  | No | No |
| UpdaterId | integer | Yes |  | No | No |
| UpdateDate | datetime | Yes |  | No | No |


**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Creator | User | No |  | No | No |
| Updater | User | No |  | No | No |
| Users | Collection(UserTeam) | Yes | team_users | Yes | Yes |
| OtherProperties | Collection(TeamFieldValue) | Yes |  | No | No |
