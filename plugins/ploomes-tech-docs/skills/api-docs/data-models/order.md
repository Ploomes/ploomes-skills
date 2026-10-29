# Order — Data Models

Data models for the Order domain.

### Column Reference

Each property table includes the following columns:

| Column | Description |
|--------|-------------|
| **FieldKey** | The key used to reference this property in the Fields system (see [Fields & Entities](../07-fields-and-entities.md)). Empty if the property is not exposed as a field. |
| **Creatable** | **Yes** = can be set on `POST` (create). **No** = cannot be set on create; managed by the system. |
| **Editable** | **Yes** = can be set on `PATCH` (edit). **No** = cannot be set on edit; managed by the system. |

> **Note on Required vs Nullable**: If a field is not Required and is not Nullable, you may omit it from the payload (the API will set a default value), but you may not send it as `null`.

---

### Order


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No | order_id | Yes | No |
| OrderNumber | integer | Yes | order_number | Yes | No |
| Date | datetime | Yes | order_date | Yes | Yes |
| ContactId | integer | Yes | order_contact | Yes | No |
| ContactName | string | Yes |  | No | No |
| PersonId | integer | Yes | order_person | Yes | Yes |
| PersonName | string | Yes |  | No | No |
| DealId | integer | Yes | order_deal | Yes | No |
| StageId | integer | Yes | order_stage | Yes | Yes |
| CurrencyId | integer | Yes | order_currency | Yes | Yes |
| Amount | decimal | Yes | order_amount | Yes | Yes |
| Discount | double | Yes | order_discount | Yes | Yes |
| OwnerId | integer | Yes | order_owner | Yes | Yes |
| TemplateId | integer | Yes | order_template | Yes | No |
| IsTemplate | boolean | Yes |  | No | No |
| HeaderSourceCode | string | Yes |  | No | No |
| HeaderHeight | integer | Yes |  | No | No |
| FooterSourceCode | string | Yes |  | No | No |
| FooterHeight | integer | Yes |  | No | No |
| BodySourceCode | string | Yes |  | No | No |
| TopMargin | integer | Yes |  | No | No |
| BottomMargin | integer | Yes |  | No | No |
| SideMargin | integer | Yes |  | No | No |
| CoverSourceCode | string | Yes |  | No | No |
| HasCoverPage | boolean | Yes |  | No | No |
| HasPaging | boolean | Yes |  | No | No |
| FileName | string | Yes |  | No | No |
| InternalComments | string | Yes | order_internal_comments | Yes | Yes |
| Description | string | Yes | order_description | Yes | Yes |
| Key | string | Yes |  | No | No |
| Shared | boolean | Yes |  | No | No |
| EmailSenderTypeId | integer | Yes |  | No | No |
| EmailSenderUserId | integer | Yes |  | No | No |
| EmailId | integer | Yes |  | No | No |
| ExternallyAccepted | boolean | Yes | order_externally_accepted | No | No |
| ExternalNotifications | boolean | Yes |  | No | No |
| ExternalSharingDate | datetime | Yes | order_external_sharing_date | No | No |
| AgentId | integer | Yes | order_agent | Yes | Yes |
| Commission | double | Yes | order_commission | Yes | Yes |
| CommissionAmount | decimal | Yes | order_commission_amount | No | No |
| DocumentUrl | string | Yes |  | No | No |
| Approver | boolean | Yes |  | No | No |
| ApprovalStatusId | integer | Yes | order_approval_status | No | No |
| ApprovalLevelId | integer | Yes |  | No | No |
| OriginQuoteId | integer | Yes | order_origin_quote | Yes | Yes |
| CreatorId | integer | Yes | order_creator | No | No |
| UpdaterId | integer | Yes | order_updater | No | No |
| CreateDate | datetime | Yes | order_create_date | No | No |
| LastUpdateDate | datetime | Yes |  | No | No |
| LastExternalOpeningDate | datetime | Yes | order_last_external_opening_date | No | No |
| Editable | boolean | Yes |  | No | No |
| Deletable | boolean | Yes |  | No | No |
| QueryId | integer | Yes |  | No | No |
| ForceHTMLGeneration | boolean | Yes |  | No | No |


**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Contact | Contact | No | order_contact | Yes | No |
| Person | Contact (nullable) | No | order_person | Yes | Yes |
| Deal | Deal | No | order_deal | Yes | No |
| Stage | OrderStage | No | order_stage | Yes | Yes |
| Currency | Currency | No | order_currency | Yes | Yes |
| Owner | User | No | order_owner | Yes | Yes |
| Template | DocumentTemplate | No | order_template | Yes | No |
| Pages | Collection(DocumentPage) | Yes |  | No | No |
| EmailSenderType | AutomationActionEmailSenderType | No |  | No | No |
| EmailSenderUser | User | No |  | No | No |
| Email | Email | No |  | No | No |
| Agent | User | No | order_agent | Yes | Yes |
| Products | Collection(OrderProduct) | Yes | order_products | No | No |
| Sections | Collection(OrderSection) | Yes | order_sections | Yes | No |
| Attachments | Collection(Attachment) | Yes |  | No | No |
| AttachmentsItems | Collection(AttachmentItemRelation) | Yes |  | No | No |
| OtherProperties | Collection(OrderFieldValue) | Yes |  | No | No |
| Comments | Collection(Comment) | Yes |  | No | No |
| ExternalComments | Collection(ExternalComment) | Yes |  | No | No |
| Installments | Collection(OrderInstallment) | Yes | order_installments | Yes | No |
| RelatedPeople | Collection(RelatedPerson) | Yes | order_related_people | Yes | Yes |
| ApprovalStatus | QuoteApprovalStatus | No | order_approval_status | No | No |
| Approvals | Collection(OrderApproval) | Yes |  | No | No |
| ApprovalLevel | BusinessRuleApprovalLevel | No |  | No | No |
| OriginQuote | Quote | No | order_origin_quote | Yes | Yes |
| Creator | User | No | order_creator | No | No |
| Updater | User | No | order_updater | No | No |
| Query | OrderQuery | No |  | No | No |

---


### OrderApproval


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| OrderId | integer | Yes |  | No | No |
| ApprovalLevelId | integer | Yes |  | No | No |
| Approved | boolean | No |  | No | No |
| ApproverId | integer | Yes |  | No | No |
| ApprovalDate | datetime | No |  | No | No |

**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Order | Order | No |  | No | No |
| ApprovalLevel | BusinessRuleApprovalLevel | No |  | No | No |
| Approver | User | No |  | No | No |

---

### OrderInstallment


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No | order_installment_id | No | No |
| OrderId | integer | Yes | order_installment_order | No | No |
| Date | datetime | Yes | order_installment_date | Yes | Yes |
| Amount | number | No | order_installment_amount | Yes | Yes |
| Fixed | boolean | No | order_installment_fixed | Yes | Yes |

**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Order | Order | No | order_installment_order | No | No |
| OtherProperties | Collection(OrderInstallmentFieldValue) | Yes |  | No | No |

---


### OrderProduct


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No | order_product_id | Yes | No |
| OrderId | integer | Yes | order_product_order | No | No |
| OwnerId | integer | Yes | order_product_owner | No | No |
| OrderDate | datetime | Yes | order_product_quote_date | No | No |
| SectionId | integer | Yes | order_product_section | No | No |
| DealId | integer | Yes |  | No | No |
| ContactId | integer | Yes |  | No | No |
| ProductId | integer | Yes | order_product_product | Yes | No |
| ProductName | string | Yes |  | No | No |
| ProductCode | string | Yes |  | No | No |
| Quantity | number | Yes | order_product_quantity | Yes | Yes |
| CurrencyId | integer | Yes | order_product_currency | Yes | Yes |
| UnitPrice | number | Yes | order_product_unit_price | Yes | Yes |
| Discount | number | Yes | order_product_discount | Yes | Yes |
| Total | number | Yes | order_product_total | Yes | Yes |
| Bonus | boolean | No |  | No | No |
| ContactProductId | integer | Yes | order_product_contact_product | Yes | Yes |
| Ordination | integer | Yes |  | No | No |
| Editable | boolean | Yes |  | No | No |

**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Order | Order | No | order_product_order | No | No |
| Owner | User | No | order_product_owner | No | No |
| Section | OrderSection | No | order_product_section | No | No |
| Deal | Deal | No |  | No | No |
| Contact | Contact | No |  | No | No |
| Product | Product | No | order_product_product | Yes | No |
| Currency | Currency | No | order_product_currency | Yes | Yes |
| ContactProduct | ContactProduct | No | order_product_contact_product | Yes | Yes |
| Parts | Collection(OrderProductPart) | Yes | order_product_parts | Yes | Yes |
| OtherProperties | Collection(OrderProductFieldValue) | Yes |  | No | No |

---


### OrderQuery


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| RootODataQuery | string | Yes |  | No | No |
| SelfODataQuery | string | Yes |  | No | No |
| SectionsODataQuery | string | Yes |  | No | No |
| ProductsODataQuery | string | Yes |  | No | No |
| PartsODataQuery | string | Yes |  | No | No |

---


### OrderSection


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| OrderId | integer | Yes | order_section_order | No | No |
| Code | integer | Yes |  | No | No |
| Discount | number | Yes | order_section_discount | Yes | Yes |
| Total | number | Yes | order_section_total | Yes | Yes |
| CurrencyId | integer | Yes | order_section_currency | Yes | Yes |

**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Order | Order | No | order_section_order | No | No |
| Currency | Currency | No | order_section_currency | Yes | Yes |
| Products | Collection(OrderProduct) | Yes | order_section_products | Yes | Yes |
| OtherProperties | Collection(OrderSectionFieldValue) | Yes |  | No | No |

---


### OrderStage


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| Name | string | Yes | order_stage_name | Yes | Yes |
| Icon | string | Yes |  | No | No |

---
