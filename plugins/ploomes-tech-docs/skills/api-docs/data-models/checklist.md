# Checklist — Data Models

Data models for the Checklist domain.

### Column Reference

Each property table includes the following columns:

| Column | Description |
|--------|-------------|
| **FieldKey** | The key used to reference this property in the Fields system (see [Fields & Entities](../07-fields-and-entities.md)). Empty if the property is not exposed as a field. |
| **Creatable** | **Yes** = can be set on `POST` (create). **No** = cannot be set on create; managed by the system. |
| **Editable** | **Yes** = can be set on `PATCH` (edit). **No** = cannot be set on edit; managed by the system. |

> **Note on Required vs Nullable**: If a field is not Required and is not Nullable, you may omit it from the payload (the API will set a default value), but you may not send it as `null`.

---

### Checklist


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| Name | string | Yes |  | No | No |
| DealStageId | integer | Yes |  | Yes | Yes |
| DealFilterId | integer | Yes |  | No | No |
| CreatorId | integer | Yes |  | No | No |
| CreateDate | datetime | Yes |  | No | No |
| LastUpdateDate | datetime | Yes |  | No | No |
| Ordination | integer | Yes |  | No | No |
| FillingInfo | string | Yes |  | No | No |


**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| DealStage | DealStage | No |  | No | No |
| DealFilter | Filter | No |  | No | No |
| Creator | User | No |  | No | No |
| Fields | Collection(ChecklistField) | Yes |  | Yes | Yes |

> **Writing `Fields`**: `POST /Checklists` accepts the nested `Fields` array in the
> same request, so a checklist and its items are created in one call.
> `PATCH /Checklists({id})` with a `Fields` array replaces the whole collection —
> full substitution, not a merge, so send every item you want to keep.

---


### ChecklistField


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| ChecklistId | integer | Yes |  | No | No |
| Name | string | Yes |  | Yes | Yes |
| Required | boolean | Yes |  | Yes | Yes |
| FieldKey | string | Yes |  | Yes | Yes |
| FieldPathId | integer | Yes |  | Yes | Yes |
| Ordination | integer | Yes |  | Yes | Yes |

**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Checklist | Checklist | No |  | No | No |
| Field | Field | No |  | No | No |
| FieldPath | FieldEntityPath | No |  | No | No |
| Users | Collection(ChecklistFieldUser) | Yes |  | No | No |
| Conditions | Collection(ChecklistFieldCondition) | Yes |  | No | No |
| Conditions2 | Collection(ChecklistFieldConditionSimpleView2) | Yes |  | No | No |

---

