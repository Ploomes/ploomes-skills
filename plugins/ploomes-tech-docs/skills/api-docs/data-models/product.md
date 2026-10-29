# Product — Data Models

Data models for the Product domain.

### Column Reference

Each property table includes the following columns:

| Column | Description |
|--------|-------------|
| **FieldKey** | The key used to reference this property in the Fields system (see [Fields & Entities](../07-fields-and-entities.md)). Empty if the property is not exposed as a field. |
| **Creatable** | **Yes** = can be set on `POST` (create). **No** = cannot be set on create; managed by the system. |
| **Editable** | **Yes** = can be set on `PATCH` (edit). **No** = cannot be set on edit; managed by the system. |

> **Note on Required vs Nullable**: If a field is not Required and is not Nullable, you may omit it from the payload (the API will set a default value), but you may not send it as `null`.

---

### Product


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| AccountId | integer | No |  | No | No |
| Id | integer | No | product_id | Yes | No |
| GroupId | integer | Yes | product_group | Yes | Yes |
| FamilyId | integer | Yes | product_family | No | No |
| Name | string | Yes | product_name | Yes | Yes |
| Code | string | Yes | product_code | Yes | Yes |
| MeasurementUnit | string | Yes | product_measurement_unit | Yes | Yes |
| ImageUrl | string | Yes | product_image_url | Yes | Yes |
| CurrencyId | integer | Yes | product_currency | Yes | Yes |
| UnitPrice | decimal | Yes | product_unit_price | Yes | Yes |
| CreateImportId | integer | Yes | product_create_importation_id | No | No |
| UpdateImportId | integer | Yes | product_update_importation_id | No | No |
| Editable | boolean | No |  | No | No |
| Deletable | boolean | No |  | No | No |
| Suspended | boolean | No |  | No | No |
| CreatorId | integer | Yes | product_creator | No | No |
| UpdaterId | integer | Yes | product_updater | No | No |
| CreateDate | datetime | Yes |  | No | No |
| LastUpdateDate | datetime | Yes | product_last_update_date | No | No |
| ImportationIdCreate | string | Yes | product_create_new_importation_id | No | No |
| ImportationIdUpdate | string | Yes | product_update_new_importation_id | No | No |


**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Group | ProductGroup | No | product_group | Yes | Yes |
| Family | ProductFamily | No | product_family | No | No |
| Currency | Currency | No | product_currency | Yes | Yes |
| Parts | Collection(ProductPart) | Yes | product_parts | No | No |
| OtherProperties | Collection(ProductFieldValue) | Yes |  | No | No |
| Contacts | Collection(ContactProduct) | Yes |  | No | No |
| Lists | Collection(ProductListProduct) | Yes | product_lists | Yes | Yes |
| Creator | User | No | product_creator | No | No |
| Updater | User | No | product_updater | No | No |
| AttachmentsItems | Collection(AttachmentItemRelation) | Yes |  | No | No |

---


### ProductFamily


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No | product_family_id | Yes | No |
| Name | string | Yes | product_family_name | Yes | Yes |
| Editable | boolean | No |  | No | No |
| Deletable | boolean | No |  | No | No |

**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| OtherProperties | Collection(ProductFamilyFieldValue) | Yes |  | No | No |
| AttachmentsItems | Collection(AttachmentItemRelation) | Yes |  | No | No |

---

### ProductGroup


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No | product_group_id | Yes | No |
| Name | string | Yes | product_group_name | Yes | Yes |
| FamilyId | integer | Yes | product_group_family | Yes | Yes |
| FixedPrice | boolean | No | product_group_fixed_price | Yes | Yes |
| CreateImportId | integer | Yes |  | No | No |
| UpdateImportId | integer | Yes |  | No | No |
| Editable | boolean | No |  | No | No |
| Deletable | boolean | No |  | No | No |
| Default | boolean | No |  | No | No |
| LastUpdateDate | datetime | Yes |  | No | No |
| ImportationIdCreate | string | Yes | product_group_create_new_importation_id | No | No |
| ImportationIdUpdate | string | Yes | product_group_update_new_importation_id | No | No |

**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Family | ProductFamily | No | product_group_family | Yes | Yes |
| AllowedUsers | Collection(ProductGroupAllowedUser) | Yes |  | No | No |
| AllowedTeams | Collection(ProductGroupAllowedTeam) | Yes |  | No | No |
| OtherProperties | Collection(ProductGroupFieldValue) | Yes |  | No | No |
| AttachmentsItems | Collection(AttachmentItemRelation) | Yes |  | No | No |

---


### ProductListProduct


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| ListId | integer | Yes |  | No | No |
| ProductId | integer | Yes |  | No | No |

**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| List | ProductList | No |  | No | No |
| Product | Product | No |  | No | No |

---


### ProductPart


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No | product_part_id | Yes | No |
| ProductId | integer | Yes | product_part_parent_product | Yes | Yes |
| Name | string | Yes | product_part_name | Yes | Yes |
| ProductPartId | integer | Yes | product_part_product | Yes | No |
| GroupPartId | integer | Yes | product_part_group | Yes | No |
| ContactProductId | integer | Yes | product_part_contact_product | Yes | Yes |
| ListPartId | integer | Yes | product_part_list | Yes | No |
| Default | boolean | No | product_part_default | Yes | Yes |
| MinimumQuantity | number | Yes | product_part_minimum_quantity | Yes | Yes |
| MaximumQuantity | number | Yes | product_part_maximum_quantity | Yes | Yes |
| DefaultQuantity | number | Yes | product_part_default_quantity | Yes | Yes |
| CurrencyId | integer | Yes | product_part_currency | Yes | Yes |
| MinimumUnitPrice | number | Yes | product_part_minimum_unit_price | Yes | Yes |
| MaximumUnitPrice | number | Yes | product_part_maximum_unit_price | Yes | Yes |
| DefaultUnitPrice | number | Yes | product_part_default_unit_price | Yes | Yes |
| GroupId | integer | Yes | product_part_category | Yes | Yes |
| LastUpdateDate | datetime | Yes |  | No | No |
| Required | boolean | No | product_part_required | Yes | Yes |
| Editable | boolean | No |  | No | No |
| Ordination | integer | Yes |  | No | No |

**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Product | Product | No | product_part_parent_product | Yes | Yes |
| ProductPart | Product | No | product_part_product | Yes | No |
| GroupPart | ProductGroup | No | product_part_group | Yes | No |
| ContactProduct | ContactProduct | No | product_part_contact_product | Yes | Yes |
| ListPart | ProductList | No | product_part_list | Yes | No |
| Currency | Currency | No | product_part_currency | Yes | Yes |
| Group | ProductPartGroup | No | product_part_category | Yes | Yes |
| BlockedParts | Collection(ProductPartBlockedPart) | Yes | product_part_blocked_parts | Yes | Yes |
| SuggestedParts | Collection(ProductPartSuggestedPart) | Yes | product_part_suggested_parts | Yes | Yes |
| RequiredParts | Collection(ProductPartRequiredPart) | Yes | product_part_required_parts | Yes | Yes |
| OtherProperties | Collection(ProductPartFieldValue) | Yes |  | No | No |

---
