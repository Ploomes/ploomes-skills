# BulkProcedure — Data Models

Data models for the BulkProcedure domain.

### Column Reference

Each property table includes the following columns:

| Column | Description |
|--------|-------------|
| **FieldKey** | The key used to reference this property in the Fields system (see [Fields & Entities](../07-fields-and-entities.md)). Empty if the property is not exposed as a field. |
| **Creatable** | **Yes** = can be set on `POST` (create). **No** = cannot be set on create; managed by the system. |
| **Editable** | **Yes** = can be set on `PATCH` (edit). **No** = cannot be set on edit; managed by the system. |

> **Note on Required vs Nullable**: If a field is not Required and is not Nullable, you may omit it from the payload (the API will set a default value), but you may not send it as `null`.

---

### BulkProcedure


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| EntityId | integer | No |  | No | No |
| FilterUrl | string | Yes |  | No | No |
| RequestBody | string | Yes |  | No | No |
| FileUrl | string | Yes |  | No | No |
| TableId | integer | Yes |  | No | No |
| CreateDate | datetime | No |  | No | No |
| Finished | boolean | No |  | No | No |
| FinishDate | datetime | Yes |  | No | No |


**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Entity | FieldEntity | No |  | No | No |
| Action | BulkProcedureAction | No |  | No | No |
| Table | Table | No |  | No | No |

---


### BulkProcedureAction


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| Name | string | Yes |  | No | No |
| RestrictedEntityId | integer | Yes |  | No | No |
| ActionName | string | Yes |  | No | No |

---

