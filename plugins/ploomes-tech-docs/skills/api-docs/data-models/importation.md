# Importation — Data Models

Data models for the Importation domain.

### Column Reference

Each property table includes the following columns:

| Column | Description |
|--------|-------------|
| **FieldKey** | The key used to reference this property in the Fields system (see [Fields & Entities](../07-fields-and-entities.md)). Empty if the property is not exposed as a field. |
| **Creatable** | **Yes** = can be set on `POST` (create). **No** = cannot be set on create; managed by the system. |
| **Editable** | **Yes** = can be set on `PATCH` (edit). **No** = cannot be set on edit; managed by the system. |

> **Note on Required vs Nullable**: If a field is not Required and is not Nullable, you may omit it from the payload (the API will set a default value), but you may not send it as `null`.

---

### ImportationTemplate


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| EntityId | integer | No |  | No | No |
| Name | string | Yes |  | No | No |


**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Entity | FieldEntity | No |  | No | No |
| Entities | Collection(ImportationTemplateEntity) | Yes |  | No | No |

---

### Importation


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| TemplateId | integer | Yes |  | No | No |
| StatusId | integer | Yes |  | No | No |
| CreatorId | integer | Yes |  | No | No |
| CreateDate | datetime | No |  | No | No |
| Started | boolean | No |  | No | No |
| StartDate | datetime | Yes |  | No | No |
| Finished | boolean | No |  | No | No |
| FinishDate | datetime | Yes |  | No | No |
| Failed | boolean | No |  | No | No |
| FailDate | datetime | Yes |  | No | No |
| FailExceptionMessage | string | Yes |  | No | No |
| TotalRows | integer | No |  | No | No |
| InsertedRows | integer | No |  | No | No |
| UpdatedRows | integer | No |  | No | No |
| ErrorRows | integer | No |  | No | No |
| Cancelled | boolean | No |  | No | No |
| Progress | double | No |  | No | No |
| CancelDate | datetime | Yes |  | No | No |
| SpreadsheetUrl | string | Yes |  | No | No |


**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Template | ImportationTemplate | No |  | No | No |
| Status | ImportationStatus | No |  | No | No |
| Creator | User | No |  | No | No |
| MappedFields | Collection(ImportationMappedField) | Yes |  | No | No |

---


### ImportationMappedField


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| ImportationId | integer | Yes |  | No | No |
| TemplateEntityId | integer | Yes |  | No | No |
| FieldKey | string | Yes |  | No | No |
| Unique | boolean | No |  | No | No |

**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Importation | Importation | No |  | No | No |
| TemplateEntity | ImportationTemplateEntity | No |  | No | No |
| Field | Field | No |  | No | No |

---


### ImportationStatus


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| Name | string | Yes |  | No | No |

---


### ImportationTemplateEntity


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| TemplateId | integer | Yes |  | No | No |
| EntityId | integer | No |  | No | No |
| Name | string | Yes |  | No | No |
| Ordination | integer | Yes |  | No | No |
| HierarchyOrdination | integer | Yes |  | No | No |
| Listable | boolean | No |  | No | No |
| Optional | boolean | No |  | No | No |

**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Template | ImportationTemplate | No |  | No | No |
| Entity | FieldEntity | No |  | No | No |
| Relationships | Collection(ImportationTemplateEntityEntity) | Yes |  | No | No |
| DefaultValues | Collection(ImportationTemplateEntityDefaultValue) | Yes |  | No | No |

---

