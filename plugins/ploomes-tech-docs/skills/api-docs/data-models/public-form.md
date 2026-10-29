# PublicForm — Data Models

Data models for the PublicForm domain.

### Column Reference

Each property table includes the following columns:

| Column | Description |
|--------|-------------|
| **FieldKey** | The key used to reference this property in the Fields system (see [Fields & Entities](../07-fields-and-entities.md)). Empty if the property is not exposed as a field. |
| **Creatable** | **Yes** = can be set on `POST` (create). **No** = cannot be set on create; managed by the system. |
| **Editable** | **Yes** = can be set on `PATCH` (edit). **No** = cannot be set on edit; managed by the system. |

> **Note on Required vs Nullable**: If a field is not Required and is not Nullable, you may omit it from the payload (the API will set a default value), but you may not send it as `null`.

---

### PublicForm


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| Name | string | Yes |  | No | No |
| Description | string | Yes |  | No | No |
| Color | string | Yes |  | No | No |
| AvatarUrl | string | Yes |  | No | No |
| DealPipelineId | integer | Yes |  | No | No |
| DealStageId | integer | Yes |  | No | No |
| IgnoreStage | boolean | Yes |  | No | No |
| EntityId | integer | Yes |  | No | No |
| ImportationTemplateId | integer | Yes |  | No | No |
| Key | string | Yes |  | No | No |
| IntegrationUserId | integer | Yes |  | No | No |
| EditOnly | boolean | No |  | No | No |
| Enabled | boolean | No |  | No | No |
| CreatorId | integer | Yes |  | No | No |
| CreateDate | datetime | No |  | No | No |
| UpdaterId | integer | Yes |  | No | No |
| UpdateDate | datetime | Yes |  | No | No |
| Editable | boolean | No |  | No | No |
| Ordination | integer | Yes |  | No | No |
| LanguageId | integer | Yes |  | No | No |


**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| DealPipeline | DealPipeline | No |  | No | No |
| DealStage | DealStage | No |  | No | No |
| Entity | FieldEntity | No |  | No | No |
| ImportationTemplate | ImportationTemplate | No |  | No | No |
| Creator | User | No |  | No | No |
| Updater | User | No |  | No | No |
| Fields | Collection(PublicFormField) | Yes |  | No | No |
| DefaultFields | Collection(PublicFormDefaultField) | Yes |  | No | No |

---


### PublicFormDefaultField


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| PublicFormId | integer | Yes |  | No | No |
| ImportationTemplateEntityId | integer | Yes |  | No | No |
| FieldKey | string | Yes |  | No | No |
| ObjectKey | string | Yes |  | No | No |
| Ordination | integer | Yes |  | No | No |

**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| PublicForm | PublicForm | No |  | No | No |
| ImportationTemplateEntity | ImportationTemplateEntity | No |  | No | No |
| Field | Field | No |  | No | No |
| Values | Collection(PublicFormDefaultFieldValue) | Yes |  | No | No |

---


### PublicFormField


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| PublicFormId | integer | Yes |  | No | No |
| Label | string | Yes |  | No | No |
| Description | string | Yes |  | No | No |
| ImportationTemplateEntityId | integer | Yes |  | No | No |
| FieldKey | string | Yes |  | No | No |
| ObjectKey | string | Yes |  | No | No |
| Required | boolean | No |  | No | No |
| Unique | boolean | No |  | No | No |
| MappedById | boolean | No |  | No | No |
| Ordination | integer | Yes |  | No | No |

**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| PublicForm | PublicForm | No |  | No | No |
| ImportationTemplateEntity | ImportationTemplateEntity | No |  | No | No |
| Field | Field | No |  | No | No |
| Options | Collection(PublicFormFieldOption) | Yes |  | No | No |

---

