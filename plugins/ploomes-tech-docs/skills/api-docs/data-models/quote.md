# Quote — Data Models

Data models for the Quote domain.

### Column Reference

Each property table includes the following columns:

| Column | Description |
|--------|-------------|
| **FieldKey** | The key used to reference this property in the Fields system (see [Fields & Entities](../07-fields-and-entities.md)). Empty if the property is not exposed as a field. |
| **Creatable** | **Yes** = can be set on `POST` (create). **No** = cannot be set on create; managed by the system. |
| **Editable** | **Yes** = can be set on `PATCH` (edit). **No** = cannot be set on edit; managed by the system. |

> **Note on Required vs Nullable**: If a field is not Required and is not Nullable, you may omit it from the payload (the API will set a default value), but you may not send it as `null`.

---

### Quote


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No | quote_id | Yes | No |
| ContactId | integer | Yes | quote_contact | No | No |
| AccountId | integer | No |  | No | No |
| ContactName | string | Yes |  | No | No |
| DealId | integer | Yes | quote_deal | Yes | No |
| OwnerId | integer | Yes | quote_owner | No | No |
| TemplateId | integer | Yes | quote_template | Yes | No |
| IsTemplate | boolean | Yes |  | No | No |
| Date | datetime | No | quote_date | Yes | Yes |
| QuoteNumber | integer | Yes | quote_number | No | No |
| ReviewNumber | integer | Yes | quote_review_number | No | No |
| LastReview | boolean | Yes | quote_is_last_review | No | No |
| LastReviewId | integer | Yes |  | No | No |
| Approver | boolean | Yes | quote_is_approver | No | No |
| ApprovalStatusId | integer | Yes | quote_approval_status | No | No |
| ApprovalLevelId | integer | Yes |  | No | No |
| PersonId | integer | Yes | quote_person | Yes | Yes |
| PersonName | string | Yes |  | No | No |
| CurrencyId | integer | Yes | quote_currency | Yes | Yes |
| Amount | decimal | Yes | quote_amount | Yes | Yes |
| Discount | double | Yes | quote_discount | Yes | Yes |
| ExpirationDate | datetime | Yes | quote_expiration_date | Yes | Yes |
| InstallmentsNumber | integer | Yes | quote_installments_number | Yes | Yes |
| DeliveryTime | string | Yes | quote_delivery_time | Yes | Yes |
| PaymentMethod | string | Yes | quote_payment_method | Yes | Yes |
| Title | string | Yes | quote_title | Yes | Yes |
| Description | string | Yes | quote_description | Yes | Yes |
| Notes | string | Yes | quote_notes | Yes | Yes |
| FreightModal | string | Yes | quote_freight_modal | Yes | Yes |
| FreightCost | decimal | Yes | quote_freight_cost | Yes | Yes |
| Key | string | Yes |  | No | No |
| Shared | boolean | Yes |  | No | No |
| EmailSenderTypeId | integer | Yes |  | No | No |
| EmailSenderUserId | integer | Yes |  | No | No |
| ExternallyAccepted | boolean | Yes | quote_externally_accepted | No | No |
| ExternalNotifications | boolean | Yes |  | No | No |
| ExternalSharingDate | datetime | Yes | quote_external_sharing_date | No | No |
| HeaderSourceCode | string | Yes |  | No | No |
| HeaderHeight | integer | Yes |  | No | No |
| FooterSourceCode | string | Yes |  | No | No |
| FooterHeight | integer | Yes |  | No | No |
| BodySourceCode | string | Yes |  | No | No |
| PreviewSourceCode | string | Yes |  | No | No |
| TopMargin | integer | Yes |  | No | No |
| BottomMargin | integer | Yes |  | No | No |
| SideMargin | integer | Yes |  | No | No |
| HasCoverPage | boolean | Yes |  | No | No |
| CoverSourceCode | string | Yes |  | No | No |
| HasPaging | boolean | Yes |  | No | No |
| FileName | string | Yes |  | No | No |
| EmailId | integer | Yes |  | No | No |
| DocumentUrl | string | Yes |  | No | No |
| CreatorId | integer | Yes | quote_creator | No | No |
| UpdaterId | integer | Yes | quote_updater | No | No |
| CreateDate | datetime | Yes | quote_create_date | No | No |
| LastUpdateDate | datetime | Yes |  | No | No |
| LastExternalOpeningDate | datetime | Yes | quote_last_external_opening_date | No | No |
| Editable | boolean | Yes |  | No | No |
| QueryId | integer | Yes |  | No | No |
| ForceHTMLGeneration | boolean | Yes |  | No | No |


**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Contact | Contact | No | quote_contact | No | No |
| Deal | Deal | No | quote_deal | Yes | No |
| Owner | User | No | quote_owner | No | No |
| Template | DocumentTemplate | No | quote_template | Yes | No |
| ApprovalStatus | QuoteApprovalStatus | No | quote_approval_status | No | No |
| Approvals | Collection(QuoteApproval) | Yes |  | No | No |
| ApprovalLevel | BusinessRuleApprovalLevel | No |  | No | No |
| Person | Contact (nullable) | No | quote_person | Yes | Yes |
| Currency | Currency | No | quote_currency | Yes | Yes |
| EmailSenderType | AutomationActionEmailSenderType | No |  | No | No |
| EmailSenderUser | User | No |  | No | No |
| Pages | Collection(DocumentPage) | Yes |  | No | No |
| Email | Email | No |  | No | No |
| Comments | Collection(Comment) | Yes |  | No | No |
| ExternalComments | Collection(ExternalComment) | Yes |  | No | No |
| Sections | Collection(QuoteSection) | Yes | quote_sections | Yes | No |
| Products | Collection(QuoteProduct) | Yes | quote_products | No | No |
| Installments | Collection(QuoteInstallment) | Yes | quote_installments | Yes | No |
| RelatedPeople | Collection(RelatedPerson) | Yes | quote_related_people | Yes | Yes |
| OtherProperties | Collection(QuoteFieldValue) | Yes |  | No | No |
| Creator | User | No | quote_creator | No | No |
| Updater | User | No | quote_updater | No | No |
| AttachmentsItems | Collection(AttachmentItemRelation) | Yes |  | No | No |
| Query | QuoteQuery | No |  | No | No |

---


### QuoteApproval


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| QuoteId | integer | Yes |  | No | No |
| ApprovalLevelId | integer | Yes |  | No | No |
| Approved | boolean | No |  | No | No |
| ApproverId | integer | Yes |  | No | No |
| ApprovalDate | datetime | No |  | No | No |

**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Quote | Quote | No |  | No | No |
| ApprovalLevel | BusinessRuleApprovalLevel | No |  | No | No |
| Approver | User | No |  | No | No |

---


### QuoteApprovalStatus


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| Name | string | Yes | quote_approval_status_name | No | No |

---

### QuoteInstallment


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No | quote_installment_id | No | No |
| QuoteId | integer | Yes | quote_installment_quote | No | No |
| Date | datetime | Yes | quote_installment_date | Yes | Yes |
| Amount | number | No | quote_installment_amount | Yes | Yes |
| Fixed | boolean | No | quote_installment_fixed | Yes | Yes |

**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Quote | Quote | No | quote_installment_quote | No | No |
| OtherProperties | Collection(QuoteInstallmentFieldValue) | Yes |  | No | No |

---


### QuoteProduct


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No | quote_product_id | Yes | No |
| DealId | integer | Yes | quote_product_deal | No | No |
| ContactId | integer | Yes |  | No | No |
| QuoteId | integer | Yes | quote_product_quote | No | No |
| OwnerId | integer | Yes | quote_product_owner | No | No |
| QuoteDate | datetime | Yes | quote_product_quote_date | No | No |
| SectionId | integer | Yes | quote_product_section | No | No |
| ProductId | integer | Yes | quote_product_product | Yes | No |
| ProductName | string | Yes |  | No | No |
| ProductCode | string | Yes |  | No | No |
| Quantity | number | Yes | quote_product_quantity | Yes | Yes |
| CurrencyId | integer | Yes | quote_product_currency | Yes | Yes |
| UnitPrice | number | Yes | quote_product_unit_price | Yes | Yes |
| Discount | number | Yes | quote_product_discount | Yes | Yes |
| Total | number | Yes | quote_product_total | Yes | Yes |
| ContactProductId | integer | Yes | quote_product_contact_product | Yes | Yes |
| Ordination | integer | Yes |  | No | No |
| Editable | boolean | Yes |  | No | No |

**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Deal | Deal | No | quote_product_deal | No | No |
| Contact | Contact | No |  | No | No |
| Quote | Quote | No | quote_product_quote | No | No |
| Owner | User | No | quote_product_owner | No | No |
| Section | QuoteSection | No | quote_product_section | No | No |
| Product | Product | No | quote_product_product | Yes | No |
| Currency | Currency | No | quote_product_currency | Yes | Yes |
| ContactProduct | ContactProduct | No | quote_product_contact_product | Yes | Yes |
| Parts | Collection(QuoteProductPart) | Yes | quote_product_parts | Yes | Yes |
| OtherProperties | Collection(QuoteProductFieldValue) | Yes |  | No | No |

---


### QuoteQuery


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| RootODataQuery | string | Yes |  | No | No |
| SelfODataQuery | string | Yes |  | No | No |
| SectionsODataQuery | string | Yes |  | No | No |
| ProductsODataQuery | string | Yes |  | No | No |
| PartsODataQuery | string | Yes |  | No | No |

---


### QuoteSection


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| QuoteId | integer | Yes |  | No | No |
| Code | integer | Yes |  | No | No |
| Discount | number | Yes |  | No | No |
| CurrencyId | integer | Yes |  | No | No |
| Total | number | Yes |  | No | No |

**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Quote | Quote | No |  | No | No |
| Currency | Currency | No |  | No | No |
| Products | Collection(QuoteProduct) | Yes |  | No | No |
| OtherProperties | Collection(QuoteSectionFieldValue) | Yes |  | No | No |

---
