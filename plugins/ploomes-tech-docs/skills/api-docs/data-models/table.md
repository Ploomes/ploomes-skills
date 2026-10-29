# Table — Data Models

Data models for the Table domain.

### Column Reference

Each property table includes the following columns:

| Column | Description |
|--------|-------------|
| **FieldKey** | The key used to reference this property in the Fields system (see [Fields & Entities](../07-fields-and-entities.md)). Empty if the property is not exposed as a field. |
| **Creatable** | **Yes** = can be set on `POST` (create). **No** = cannot be set on create; managed by the system. |
| **Editable** | **Yes** = can be set on `PATCH` (edit). **No** = cannot be set on edit; managed by the system. |

> **Note on Required vs Nullable**: If a field is not Required and is not Nullable, you may omit it from the payload (the API will set a default value), but you may not send it as `null`.

---

### Table


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| Name | string | Yes |  | No | No |
| EntityId | integer | No |  | No | No |
| FilterId | integer | Yes |  | No | No |
| CreatorId | integer | Yes |  | No | No |
| MaximumResultsPerPage | integer | No |  | No | No |
| Url | string | Yes |  | No | No |
| BelongsToPipeline | boolean | No |  | No | No |
| UserPageTable | boolean | Yes |  | No | No |
| ContactPageTable | boolean | Yes |  | No | No |
| Listable | boolean | No |  | No | No |
| Editable | boolean | No |  | No | No |
| Ordination | integer | Yes |  | No | No |
| MailChimpListIntegrationId | integer | Yes |  | No | No |
| IsDataSetSync | boolean | Yes |  | No | No |
| LastUpdateDate | datetime | Yes |  | No | No |


**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Entity | FieldEntity | No |  | No | No |
| Filter | Filter | No |  | No | No |
| Creator | User | No |  | No | No |
| Fields | Collection(TableField) | Yes |  | No | Yes |
| AllowedUsers | Collection(TableAllowedUser) | Yes |  | No | No |
| AllowedTeams | Collection(TableAllowedTeam) | Yes |  | No | No |
| Pipelines | Collection(DealPipelineTable) | Yes |  | No | No |
| FieldsEntitiesReadsCustoms | Collection(TableFieldEntityReadCustom) | Yes |  | No | No |
| MailChimpListIntegration | TableMailChimpListIntegration | No |  | No | No |

> **`POST /Tables` creates no column.** The table is created with an empty
> `Fields` collection, and columns are what the interface draws — with the table
> attached to a pipeline but no column in it, the screen finds the deals and
> counts them ("Mostrando 1 - 2 de 2") while showing the invitation to configure
> the columns instead of any data. Neither the empty collection nor the resulting
> blank screen shows up in a read by API.

> **Writing `Fields`**: there is no entity set for `TableField`. The `$metadata`
> exposes the type but no collection to post to, so columns are written by
> updating the table itself: `PATCH /Tables({id})` with a `Fields` array. It
> replaces the whole collection — full substitution, not a merge — so send every
> column you want to keep. Each item accepts `FieldKey` and `Ordination`.

---


### TableAllowedTeam


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| TableId | integer | No |  | No | No |
| TeamId | integer | No |  | No | No |

**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Table | Table | No |  | No | No |
| Team | Team | No |  | No | No |

---


### TableAllowedUser


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |

**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Table | Table | No |  | No | No |
| User | User | No |  | No | No |

---


### TableField


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| TableId | integer | Yes |  | No | No |
| FieldKey | string | Yes |  | No | Yes |
| Ordination | integer | Yes |  | No | Yes |
| AscendingSorting | boolean | Yes |  | No | No |
| Bold | boolean | Yes |  | No | No |

**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Table | Table | No |  | No | No |
| Field | Field | No |  | No | No |
| FieldPath | Collection(TableFieldField) | Yes |  | No | No |

---


### TableFieldEntityReadCustom


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| TableId | integer | Yes |  | No | No |
| FieldEntityReadCustomId | integer | Yes |  | No | No |
| IsFilter | boolean | No |  | No | No |

**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Table | Table | No |  | No | No |
| FieldEntityReadCustom | FieldEntityReadCustom | No |  | No | No |

---


### TableMailChimpListIntegration


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| ListName | string | Yes |  | No | No |
| ListId | string | Yes |  | No | No |

---

