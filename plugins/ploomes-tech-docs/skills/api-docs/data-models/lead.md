# Lead — Data Models

Data models for the Lead domain.

### Column Reference

Each property table includes the following columns:

| Column | Description |
|--------|-------------|
| **FieldKey** | The key used to reference this property in the Fields system (see [Fields & Entities](../07-fields-and-entities.md)). Empty if the property is not exposed as a field. |
| **Creatable** | **Yes** = can be set on `POST` (create). **No** = cannot be set on create; managed by the system. |
| **Editable** | **Yes** = can be set on `PATCH` (edit). **No** = cannot be set on edit; managed by the system. |

> **Note on Required vs Nullable**: If a field is not Required and is not Nullable, you may omit it from the payload (the API will set a default value), but you may not send it as `null`.

---

### Lead


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No | lead_id | Yes | No |
| CompanyId | integer | Yes | lead_company | Yes | No |
| PersonId | integer | Yes | lead_person | Yes | No |
| CompanyName | string | Yes | lead_company_name | Yes | Yes |
| CompanyLegalName | string | Yes | lead_company_legal_name | Yes | Yes |
| CompanyRegister | string | Yes | lead_company_cnpj | Yes | Yes |
| PersonName | string | Yes | lead_person_name | Yes | Yes |
| Origin | string | Yes | lead_origin | Yes | Yes |
| Email | string | Yes | lead_email | Yes | Yes |
| OwnerId | integer | Yes | lead_owner | Yes | Yes |
| StatusId | integer | Yes | lead_status | Yes | No |
| NextContact | datetime | Yes |  | No | No |
| NoTime | boolean | Yes |  | No | No |
| ReminderId | integer | Yes |  | No | No |
| DiscardReasonId | integer | Yes | lead_discard_reason | Yes | No |
| Editable | boolean | Yes |  | No | No |
| Deletable | boolean | Yes |  | No | No |
| Workable | boolean | Yes |  | No | No |
| CreatorId | integer | Yes | lead_creator | No | No |
| UpdaterId | integer | Yes |  | No | No |
| CreateDate | datetime | No | lead_create_date | No | No |
| LastUpdateDate | datetime | No |  | No | No |
| LastStatusUpdateDate | datetime | Yes | lead_last_status_update_date | No | No |
| NextContactScheduled | boolean | Yes |  | No | No |
| StatusOrdination | integer | Yes |  | No | No |
| NextContactOrdination | datetime | Yes |  | No | No |
| CreateImportId | integer | Yes |  | No | No |
| UpdateImportId | integer | Yes |  | No | No |
| ImportationIdCreate | string | Yes | lead_create_new_importation_id | No | No |
| ImportationIdUpdate | string | Yes | lead_update_new_importation_id | No | No |


**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Company | Contact | No | lead_company | Yes | No |
| Person | Contact (nullable) | No | lead_person | Yes | No |
| Owner | User | No | lead_owner | Yes | Yes |
| Phones | Collection(LeadPhone) | Yes | lead_phones | Yes | Yes |
| Attachments | Collection(Attachment) | Yes |  | No | No |
| AttachmentsItems | Collection(AttachmentItemRelation) | Yes |  | No | No |
| OtherProperties | Collection(LeadFieldValue) | Yes |  | No | No |
| Status | LeadStatus | No | lead_status | Yes | No |
| Reminder | LeadReminder | No |  | No | No |
| DiscardReason | LeadDiscardReason | No | lead_discard_reason | Yes | No |
| History | Collection(LeadHistory) | Yes |  | No | No |
| Tags | Collection(TagItem) | Yes | lead_tags | Yes | Yes |
| Creator | User | No | lead_creator | No | No |
| Updater | User | No |  | No | No |

---


### LeadDiscardReason


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| Name | string | Yes | lead_discard_reason_name | Yes | Yes |
| LastUpdateDate | datetime | Yes |  | No | No |

---

### LeadHistory


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| LeadId | integer | Yes |  | No | No |
| StatusId | integer | Yes |  | No | No |
| Comments | string | Yes |  | No | No |
| NextContact | datetime | Yes |  | No | No |
| NoTime | boolean | Yes |  | No | No |
| CreatorId | integer | Yes |  | No | No |
| CreateDate | datetime | No |  | No | No |
| Editable | boolean | No |  | No | No |

**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Lead | Lead | No |  | No | No |
| Status | LeadStatus | No |  | No | No |
| Creator | User | No |  | No | No |
| NotifiedUsers | Collection(UserNotification) | Yes |  | No | No |

---


### LeadPhone


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| LeadId | integer | Yes |  | No | No |
| PhoneNumber | string | Yes |  | No | No |
| SearchPhoneNumber | integer | Yes |  | No | No |
| TypeId | integer | Yes |  | No | No |
| CountryId | integer | Yes |  | No | No |

**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Lead | Lead | No |  | No | No |
| FullLead | LeadTotalView | No |  | No | No |
| Type | PhoneType | No |  | No | No |
| Country | Country | No |  | No | No |

---


### LeadReminder


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| Name | string | Yes |  | No | No |

---


### LeadStatus


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| Name | string | Yes | lead_status_name | Yes | Yes |
| Icon | string | Yes |  | No | No |
| Color | string | Yes |  | No | No |
| HistoryStatus | boolean | No |  | No | No |

---
