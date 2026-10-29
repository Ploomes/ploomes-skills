# Panel — Data Models

Data models for the Panel domain.

### Column Reference

Each property table includes the following columns:

| Column | Description |
|--------|-------------|
| **FieldKey** | The key used to reference this property in the Fields system (see [Fields & Entities](../07-fields-and-entities.md)). Empty if the property is not exposed as a field. |
| **Creatable** | **Yes** = can be set on `POST` (create). **No** = cannot be set on create; managed by the system. |
| **Editable** | **Yes** = can be set on `PATCH` (edit). **No** = cannot be set on edit; managed by the system. |

> **Note on Required vs Nullable**: If a field is not Required and is not Nullable, you may omit it from the payload (the API will set a default value), but you may not send it as `null`.

---

### Panel


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| Name | string | Yes |  | No | No |
| CreatorId | integer | Yes |  | No | No |
| CreateDate | datetime | No |  | No | No |
| LastUpdateDate | datetime | No |  | No | No |
| Editable | boolean | No |  | No | No |
| Ordination | integer | Yes |  | No | No |


**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Creator | User | No |  | No | No |
| Charts | Collection(PanelChart) | Yes |  | No | No |
| AllowedUsers | Collection(PermissionUser) | Yes |  | No | No |
| AllowedTeams | Collection(PermissionTeam) | Yes |  | No | No |
| AllowedUserProfiles | Collection(PermissionUserProfile) | Yes |  | No | No |

---


### PanelChart


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| PanelId | integer | Yes |  | No | No |
| TypeId | integer | Yes |  | No | No |
| Name | string | Yes |  | No | No |
| SizeClass | string | Yes |  | No | No |
| Options | string | Yes |  | No | No |
| DealPipelineId | integer | Yes |  | No | No |
| ViewId | integer | Yes |  | No | No |
| DealHistoryLastNMonths | integer | Yes |  | No | No |
| Ordination | integer | Yes |  | No | No |
| CreatorId | integer | Yes |  | No | No |
| CreateDate | datetime | No |  | No | No |
| LastUpdateDate | datetime | No |  | No | No |

**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Panel | Panel | No |  | No | No |
| Type | PanelChartType | No |  | No | No |
| DealPipeline | DealPipeline | No |  | No | No |
| Metrics | Collection(PanelChartMetric) | Yes |  | No | No |
| Creator | User | No |  | No | No |

---

