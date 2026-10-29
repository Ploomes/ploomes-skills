# Document — Data Models

Data models for the Document domain.

### Column Reference

Each property table includes the following columns:

| Column | Description |
|--------|-------------|
| **FieldKey** | The key used to reference this property in the Fields system (see [Fields & Entities](../07-fields-and-entities.md)). Empty if the property is not exposed as a field. |
| **Creatable** | **Yes** = can be set on `POST` (create). **No** = cannot be set on create; managed by the system. |
| **Editable** | **Yes** = can be set on `PATCH` (edit). **No** = cannot be set on edit; managed by the system. |

> **Note on Required vs Nullable**: If a field is not Required and is not Nullable, you may omit it from the payload (the API will set a default value), but you may not send it as `null`.

---

### Document


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No | document_id | Yes | No |
| Name | string | Yes | document_name | Yes | Yes |
| DocumentNumber | integer | Yes | document_number | Yes | No |
| Date | datetime | Yes | document_date | Yes | Yes |
| TemplateId | integer | Yes | document_template | Yes | No |
| ContactId | integer | Yes | document_contact | Yes | No |
| ContactName | string | Yes |  | No | No |
| DealId | integer | Yes | document_deal | Yes | No |
| PersonId | integer | Yes | document_person | Yes | Yes |
| HasPaging | boolean | Yes |  | No | No |
| FileName | string | Yes |  | No | No |
| Key | string | Yes |  | No | No |
| Shared | boolean | Yes |  | No | No |
| EmailSenderTypeId | integer | Yes |  | No | No |
| EmailSenderUserId | integer | Yes |  | No | No |
| EmailId | integer | Yes |  | No | No |
| ExternallyAccepted | boolean | Yes | document_externally_accepted | No | No |
| ExternalNotifications | boolean | Yes |  | No | No |
| ExternalSharingDate | datetime | Yes | document_external_sharing_date | No | No |
| DocumentUrl | string | Yes |  | No | No |
| Approver | boolean | Yes |  | No | No |
| ApprovalStatusId | integer | Yes | document_approval_status | No | No |
| ApprovalLevelId | integer | Yes |  | No | No |
| OriginQuoteId | integer | Yes | document_origin_quote | Yes | Yes |
| CreatorId | integer | Yes | document_creator | No | No |
| UpdaterId | integer | Yes | document_updater | No | No |
| LastUpdateDate | datetime | Yes |  | No | No |
| LastExternalOpeningDate | datetime | Yes | document_last_external_opening_date | No | No |
| CreateDate | datetime | Yes | document_create_date | No | No |
| Editable | boolean | Yes |  | No | No |
| OwnerId | integer | Yes |  | No | No |
| CurrencyId | integer | Yes | document_currency | Yes | Yes |
| QueryId | integer | Yes |  | No | No |
| ForceHTMLGeneration | boolean | Yes |  | No | No |


**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Template | DocumentTemplate | No | document_template | Yes | No |
| Contact | Contact | No | document_contact | Yes | No |
| Deal | Deal | No | document_deal | Yes | No |
| Person | Contact (nullable) | No | document_person | Yes | Yes |
| Pages | Collection(DocumentPage) | Yes |  | No | No |
| Sections | Collection(DocumentSection) | Yes | document_sections | Yes | No |
| Products | Collection(DocumentProduct) | Yes | document_products | No | No |
| OtherProperties | Collection(DocumentFieldValue) | Yes |  | No | No |
| Comments | Collection(Comment) | Yes |  | No | No |
| ExternalComments | Collection(ExternalComment) | Yes |  | No | No |
| Installments | Collection(DocumentInstallment) | Yes | document_installments | Yes | No |
| RelatedPeople | Collection(RelatedPerson) | Yes | document_related_people | Yes | Yes |
| EmailSenderType | AutomationActionEmailSenderType | No |  | No | No |
| EmailSenderUser | User | No |  | No | No |
| Email | Email | No |  | No | No |
| ApprovalStatus | QuoteApprovalStatus | No | document_approval_status | No | No |
| Approvals | Collection(DocumentApproval) | Yes |  | No | No |
| ApprovalLevel | BusinessRuleApprovalLevel | No |  | No | No |
| OriginQuote | Quote | No | document_origin_quote | Yes | Yes |
| Creator | User | No | document_creator | No | No |
| Updater | User | No | document_updater | No | No |
| Owner | User | No |  | No | No |
| Currency | Currency | No | document_currency | Yes | Yes |
| AttachmentsItems | Collection(AttachmentItemRelation) | Yes |  | No | No |
| Query | DocumentQuery | No |  | No | No |

---


### DocumentApproval


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| DocumentId | integer | Yes |  | No | No |
| ApprovalLevelId | integer | Yes |  | No | No |
| Approved | boolean | No |  | No | No |
| ApproverId | integer | Yes |  | No | No |
| ApprovalDate | datetime | No |  | No | No |

**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Document | Document | No |  | No | No |
| ApprovalLevel | BusinessRuleApprovalLevel | No |  | No | No |
| Approver | User | No |  | No | No |

---

### DocumentInstallment


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| DocumentId | integer | Yes |  | No | No |
| Date | datetime | Yes | document_installment_date | Yes | Yes |
| Amount | number | No | document_installment_amount | Yes | Yes |
| Fixed | boolean | No | document_installment_fixed | Yes | Yes |

**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Document | Document | No |  | No | No |
| OtherProperties | Collection(DocumentInstallmentFieldValue) | Yes |  | No | No |

---


### DocumentPage


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| DocumentId | integer | Yes |  | No | No |
| DocumentTemplateId | integer | Yes |  | No | No |
| QuoteId | integer | Yes |  | No | No |
| OrderId | integer | Yes |  | No | No |
| Name | string | Yes |  | No | No |
| BodySourceCode | string | Yes |  | No | No |
| HeaderSourceCode | string | Yes |  | No | No |
| HeaderHeight | integer | Yes |  | No | No |
| FooterSourceCode | string | Yes |  | No | No |
| FooterHeight | integer | Yes |  | No | No |
| SideMargin | integer | Yes |  | No | No |
| TopMargin | integer | Yes |  | No | No |
| BottomMargin | integer | Yes |  | No | No |
| Ordination | integer | Yes |  | No | No |

**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Document | Document | No |  | No | No |
| DocumentTemplate | DocumentTemplate | No |  | No | No |
| Quote | Quote | No |  | No | No |
| Order | Order | No |  | No | No |

---


### DocumentProduct


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No | document_product_id | No | No |
| DocumentId | integer | Yes | document_product_document | No | No |
| SectionId | integer | Yes | document_product_section | No | No |
| DealId | integer | Yes |  | No | No |
| ContactId | integer | Yes |  | No | No |
| ProductId | integer | Yes | document_product_product | Yes | No |
| ProductName | string | Yes |  | No | No |
| ProductCode | string | Yes |  | No | No |
| DocumentCreatorId | integer | Yes | document_product_document_creator | No | No |
| DocumentDate | datetime | No | document_product_document_date | No | No |
| Quantity | number | Yes | document_product_quantity | Yes | Yes |
| UnitPrice | number | Yes | document_product_unit_price | Yes | Yes |
| Total | number | Yes | document_product_total | Yes | Yes |
| Discount | number | Yes | document_product_discount | Yes | Yes |
| CurrencyId | integer | Yes | document_product_currency | Yes | Yes |
| ContactProductId | integer | Yes | document_product_contact_product | Yes | Yes |
| Editable | boolean | Yes |  | No | No |
| Ordination | integer | Yes |  | No | No |

**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Document | Document | No | document_product_document | No | No |
| Section | DocumentSection | No | document_product_section | No | No |
| Deal | Deal | No |  | No | No |
| Contact | Contact | No |  | No | No |
| Product | Product | No | document_product_product | Yes | No |
| DocumentCreator | User | No | document_product_document_creator | No | No |
| Currency | Currency | No | document_product_currency | Yes | Yes |
| Parts | Collection(DocumentProductPart) | Yes | document_product_parts | Yes | Yes |
| OtherProperties | Collection(DocumentProductFieldValue) | Yes |  | No | No |
| ContactProduct | ContactProduct | No | document_product_contact_product | Yes | Yes |

---


### DocumentQuery


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| RootODataQuery | string | Yes |  | No | No |
| SelfODataQuery | string | Yes |  | No | No |
| SectionsODataQuery | string | Yes |  | No | No |
| ProductsODataQuery | string | Yes |  | No | No |
| PartsODataQuery | string | Yes |  | No | No |

---


### DocumentSection


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| DocumentId | integer | Yes | document_section_document | No | No |
| Discount | number | Yes | document_section_discount | Yes | Yes |
| Total | number | Yes | document_section_total | Yes | Yes |
| CurrencyId | integer | Yes | document_section_currency | Yes | Yes |

**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Document | Document | No | document_section_document | No | No |
| Currency | Currency | No | document_section_currency | Yes | Yes |
| Products | Collection(DocumentProduct) | Yes | document_section_products | Yes | Yes |
| OtherProperties | Collection(DocumentSectionFieldValue) | Yes |  | No | No |

---
