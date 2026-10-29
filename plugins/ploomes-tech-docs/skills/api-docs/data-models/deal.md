# Deal — Data Models

Data models for the Deal domain.

### Column Reference

Each property table includes the following columns:

| Column | Description |
|--------|-------------|
| **FieldKey** | The key used to reference this property in the Fields system (see [Fields & Entities](../07-fields-and-entities.md)). Empty if the property is not exposed as a field. |
| **Creatable** | **Yes** = can be set on `POST` (create). **No** = cannot be set on create; managed by the system. |
| **Editable** | **Yes** = can be set on `PATCH` (edit). **No** = cannot be set on edit; managed by the system. |

> **Note on Required vs Nullable**: If a field is not Required and is not Nullable, you may omit it from the payload (the API will set a default value), but you may not send it as `null`.

---

### Deal


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No | deal_id | Yes | No |
| Title | string | Yes | deal_title | Yes | Yes |
| AccountId | integer | Yes |  | No | No |
| ContactId | integer | Yes | deal_contacts | Yes | Yes |
| ContactName | string | Yes |  | No | No |
| PersonId | integer | Yes | deal_person | Yes | Yes |
| PersonName | string | Yes |  | No | No |
| PipelineId | integer | Yes | deal_pipeline | Yes | No |
| StageId | integer | Yes | deal_stage | Yes | Yes |
| StatusId | integer | Yes | deal_status | Yes | No |
| FirstTaskId | integer | Yes |  | No | No |
| FirstTaskDate | datetime | Yes |  | No | No |
| FirstTaskNoTime | boolean | Yes |  | No | No |
| HasScheduledTasks | boolean | Yes | deal_has_scheduled_tasks | No | No |
| TasksOrdination | integer | Yes |  | No | No |
| ContactProductId | integer | Yes | deal_contact_product | Yes | Yes |
| LastQuoteId | integer | Yes | deal_last_quote | No | No |
| IsLastQuoteApproved | boolean | Yes | deal_last_quote_approved | No | No |
| WonQuoteId | integer | Yes | deal_won_quote | No | No |
| LastStageId | integer | Yes |  | No | No |
| LossReasonId | integer | Yes | deal_loss_reason | Yes | No |
| OriginId | integer | Yes | deal_origin | Yes | Yes |
| OwnerId | integer | Yes | deal_owner | Yes | Yes |
| StartDate | datetime | Yes | deal_start_date | Yes | Yes |
| FinishDate | datetime | Yes | deal_finish_date | Yes | Yes |
| CurrencyId | integer | Yes | deal_currency | Yes | Yes |
| Amount | decimal | Yes | deal_amount | Yes | Yes |
| StartCurrencyId | integer | Yes |  | No | No |
| StartAmount | decimal | Yes |  | No | No |
| Read | boolean | Yes |  | No | No |
| LastInteractionRecordId | integer | Yes | deal_last_interaction_record | No | No |
| LastOrderId | integer | Yes | deal_last_order | No | No |
| DaysInStage | integer | Yes | deal_days_in_stage | No | No |
| HoursInStage | integer | Yes | deal_hours_in_stage | No | No |
| Length | integer | Yes | deal_length | No | No |
| CreateImportId | integer | Yes |  | No | No |
| UpdateImportId | integer | Yes |  | No | No |
| LeadId | integer | Yes | deal_lead | No | No |
| OriginDealId | integer | Yes | deal_derivated_deals | Yes | Yes |
| ReevId | integer | Yes |  | No | No |
| Editable | boolean | Yes |  | No | No |
| Deletable | boolean | Yes |  | No | No |
| CreatorId | integer | Yes | deal_creator | No | No |
| UpdaterId | integer | Yes | deal_updater | No | No |
| CreateDate | datetime | Yes | deal_create_date | No | No |
| LastUpdateDate | datetime | Yes | deal_last_update_date | No | No |
| LastDocumentId | integer | Yes | deal_last_document | No | No |
| DealNumber | integer | Yes | deal_number | Yes | Yes |
| ImportationIdCreate | string | Yes | deal_create_new_importation_id | No | No |
| ImportationIdUpdate | string | Yes | deal_update_new_importation_id | No | No |
| PublicFormIdCreate | string | Yes | deal_create_public_form_id | No | No |
| PublicFormIdUpdate | string | Yes | deal_update_public_form_id | No | No |
| MergeStatus | integer | Yes |  | No | No |
| PriorityId | integer | Yes | deal_priority | Yes | Yes |
| FieldStatusId | integer | Yes | deal_field_status | Yes | Yes |
| IsRead | boolean | No |  | No | No |
| WasMerged | boolean | Yes |  | No | No |
| QuoteAmountId | integer | Yes |  | No | No |


**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Contact | Contact | No | deal_contact | Yes | Yes |
| Person | Contact | No | deal_person | Yes | Yes |
| Pipeline | DealPipeline | No | deal_pipeline | Yes | No |
| Stage | DealStage | No | deal_stage | Yes | Yes |
| Status | DealStatus | No | deal_status | Yes | No |
| Stages | Collection(DealStageDeal) | Yes | deal_stages | No | Yes |
| Tags | Collection(TagItem) | Yes | deal_tags | Yes | Yes |
| FirstTask | Task | No |  | No | No |
| Tasks | Collection(Task) | Yes | deal_tasks | No | No |
| Products | Collection(DealProduct) | Yes | deal_products | Yes | Yes |
| Contacts | Collection(DealContact) | Yes | deal_contacts | Yes | Yes |
| ContactsProducts | Collection(DealContactProduct) | Yes | deal_contacts_products | Yes | Yes |
| ContactProduct | ContactProduct | No | deal_contact_product | Yes | Yes |
| Quotes | Collection(Quote) | Yes |  | No | No |
| LastQuote | Quote (nullable) | No | deal_last_quote | No | No |
| WonQuote | Quote (nullable) | No | deal_won_quote | No | No |
| LossReason | DealLossReason | No | deal_loss_reason | Yes | No |
| Origin | ContactOrigin | No | deal_origin | Yes | Yes |
| Owner | User | No | deal_owner | Yes | Yes |
| Currency | Currency | No | deal_currency | Yes | Yes |
| StartCurrency | Currency | No |  | No | No |
| LastInteractionRecord | InteractionRecord | No | deal_last_interaction_record | No | No |
| InteractionRecords | Collection(InteractionRecord) | Yes |  | No | No |
| LastOrder | Order | No | deal_last_order | No | No |
| Orders | Collection(Order) | Yes |  | No | No |
| OtherProperties | Collection(DealFieldValue) | Yes |  | No | No |
| Documents | Collection(Document) | Yes |  | No | No |
| CollaboratingUsers | Collection(DealCollaboratingUser) | Yes | deal_collaborating_users | Yes | Yes |
| Attachments | Collection(Attachment) | Yes |  | No | No |
| AttachmentsItems | Collection(AttachmentItemRelation) | Yes |  | No | No |
| Lead | Lead | No | deal_lead | No | No |
| OriginDeal | Deal | No | deal_origin_deal | Yes | Yes |
| DerivatedDeals | Collection(Deal) | Yes | deal_derivated_deals | Yes | Yes |
| Creator | User | No | deal_creator | No | No |
| Updater | User | No | deal_updater | No | No |
| LastDocument | Document | No | deal_last_document | No | No |
| Priority | DealPriority | No | deal_priority | Yes | Yes |
| FieldStatus | DealFieldStatus | No | deal_field_status | Yes | Yes |

---


### DealCollaboratingUser


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |

**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Deal | Deal | No |  | No | No |
| User | User | No |  | No | No |

---


### DealContact


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |

**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Deal | Deal | No |  | No | No |
| Contact | Contact | No |  | No | No |

---


### DealContactProduct


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| DealId | integer | Yes |  | No | No |
| ContactProductId | integer | Yes |  | No | No |

**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Deal | Deal | No |  | No | No |
| ContactProduct | ContactProduct | No |  | No | No |

---


### DealFieldStatus


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| Name | string | Yes | deal_field_status_name | Yes | Yes |
| CreatorId | integer | No |  | No | No |
| CreateDate | datetime | No |  | No | No |
| UpdaterId | integer | Yes |  | No | No |
| UpdateDate | datetime | Yes |  | No | No |
| Suspended | boolean | No |  | No | No |

---

### DealLossReason


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| Name | string | Yes | deal_loss_reason_name | Yes | Yes |
| PipelineId | integer | Yes |  | No | No |
| LastUpdateDate | datetime | Yes |  | No | No |

**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Pipeline | DealPipeline | No |  | No | No |

---


### DealPipeline


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| Name | string | Yes | deal_pipeline_name | Yes | Yes |
| FormId | integer | Yes |  | No | No |
| QuickFormId | integer | Yes |  | No | No |
| MustPassAllStages | boolean | Yes |  | No | No |
| ForbiddenStageReturn | boolean | Yes |  | No | No |
| MayCreateQuotes | boolean | No |  | No | No |
| MayCreateOrders | boolean | No |  | No | No |
| MayCreateDocuments | boolean | No |  | No | No |
| MayWinDeals | boolean | No |  | Yes | Yes |
| MayLoseDeals | boolean | No |  | Yes | Yes |
| Archived | boolean | No |  | No | No |
| NewOrderOnWonDeal | boolean | No |  | No | No |
| CreateOrderOnWonDeal | boolean | No |  | No | No |
| WinDealOnLastStage | boolean | No |  | Yes | Yes |
| SingularUnitName | string | Yes |  | No | No |
| PluralUnitName | string | Yes |  | No | No |
| GenderId | integer | Yes |  | No | No |
| DefaultQuoteDocumentTemplateId | integer | Yes |  | No | No |
| DefaultOrderDocumentTemplateId | integer | Yes |  | No | No |
| DefaultDocumentDocumentTemplateId | integer | Yes |  | No | No |
| Color | string | Yes |  | Yes | Yes |
| IconId | integer | Yes |  | Yes | Yes |
| EnableTableViewMode | boolean | No |  | No | No |
| EnableFunnelViewMode | boolean | No |  | Yes | Yes |
| NoAllowedPipelines | boolean | Yes |  | No | No |
| WinButtonId | integer | Yes |  | No | No |
| LoseButtonId | integer | Yes |  | No | No |
| WinVerbId | integer | Yes |  | No | No |
| LoseVerbId | integer | Yes |  | No | No |
| Ordination | integer | Yes |  | No | No |
| UserOrdination | integer | Yes |  | No | No |
| StarredOrdination | integer | Yes |  | No | No |
| Starred | boolean | Yes |  | No | No |
| ViewMode | string | Yes |  | No | No |
| LastUpdateDate | datetime | Yes |  | No | No |
| ContactPageTableId | integer | Yes |  | No | No |
| QuotesUseERPFormat | boolean | Yes |  | No | No |
| OrdersUseERPFormat | boolean | Yes |  | No | No |
| DocumentsUseERPFormat | boolean | Yes |  | No | No |
| ExecuteAutomationsAsAutomationUser | boolean | Yes |  | No | No |
| CanMergeDeals | boolean | Yes |  | No | No |
| EnableStatus | boolean | Yes |  | No | No |
| EnableDealsRead | boolean | Yes |  | No | No |
| CPQProductsUseModal | boolean | Yes |  | No | No |
| CanPerformPolling | boolean | Yes |  | No | No |

**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Form | Form | No |  | No | No |
| QuickForm | Form | No |  | No | No |
| Gender | Gender | No |  | No | No |
| Stages | Collection(DealStage) | Yes |  | No | Yes |
| Tables | Collection(DealPipelineTable) | Yes |  | No | Yes |
| AllowedUsers | Collection(DealPipelineAllowedUser) | Yes |  | No | No |
| AllowedTeams | Collection(DealPipelineAllowedTeam) | Yes |  | No | No |
| AllowedUserProfiles | Collection(DealPipelineAllowedUserProfile) | Yes |  | No | No |
| LossReasons | Collection(DealLossReason) | Yes |  | No | No |
| AllowedPipelines | Collection(DealPipelineAllowedPipeline) | Yes |  | No | No |
| AllowedDocumentTemplates | Collection(DealPipelineAllowedDocumentTemplate) | Yes |  | No | No |
| DefaultQuoteDocumentTemplate | DocumentTemplate | No |  | No | No |
| DefaultOrderDocumentTemplate | DocumentTemplate | No |  | No | No |
| DefaultDocumentDocumentTemplate | DocumentTemplate | No |  | No | No |
| Icon | Icon | No |  | No | No |
| WinButton | Button | No |  | No | No |
| LoseButton | Button | No |  | No | No |
| WinVerb | WordVerb | No |  | No | No |
| LoseVerb | WordVerb | No |  | No | No |

> **Editing `Stages`**: `PATCH /DealsPipelines({id})` accepts a `Stages` array and
> replaces the whole collection — it is a full substitution, not a merge, so send
> every stage you want to keep. Each item accepts `Name`, `Ordination` and
> `LastPipelineStage`.

> **`POST /DealsPipelines` creates no table (view).** The web interface creates
> three by default when the pipeline is made there — "em aberto", "ganhos" and
> "perdidos" — and the API creates none. A pipeline whose `Tables` collection is
> empty exists and answers every read, but it cannot be displayed: the interface
> resolves the views before the deals and stops there, so the pipeline header
> renders over an empty body. Create the views as `Tables` and attach them, or
> the pipeline stays unreachable by screen.

> **Writing `Tables`**: there is no entity set for `DealPipelineTable`. The
> `$metadata` exposes the type but no collection to post to, and a `POST` to the
> route the relation name suggests answers with an empty body and no error.
> Attach views by updating the pipeline itself: `PATCH /DealsPipelines({id})`
> with a `Tables` array. Like `Stages`, it replaces the whole collection, so send
> every view you want to keep. Each item accepts `TableId`.

---


### DealPipelineTable


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| PipelineId | integer | Yes |  | No | No |
| TableId | integer | Yes |  | No | No |

**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Pipeline | DealPipeline | No |  | No | No |
| Table | Table | No |  | No | No |

---


### DealPipelineUserUsability


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| Administration | boolean | No |  | No | No |
| Name | string | Yes |  | No | No |

---


### DealPriority


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| Name | string | Yes | deal_priority_name | Yes | Yes |
| LastUpdateDate | datetime | Yes |  | No | No |

---


### DealProduct


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| ProductName | string | Yes |  | No | No |
| ProductCode | string | Yes |  | No | No |

**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Deal | Deal | No |  | No | No |
| Product | Product | No |  | No | No |

---


### DealStage


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| Name | string | Yes | deal_stage_name | Yes | Yes |
| PipelineId | integer | Yes | deal_stage_pipeline | Yes | Yes |
| LastPipelineStage | boolean | Yes |  | No | No |
| Ordination | integer | Yes | deal_stage_ordination | Yes | Yes |
| TriggerId | integer | Yes |  | No | No |

**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Pipeline | DealPipeline | No | deal_stage_pipeline | Yes | Yes |
| Deals | Collection(DealStageDeal) | Yes |  | No | No |
| Checklists | Collection(Checklist) | Yes |  | No | No |
| Automations | Collection(Automation) | Yes |  | No | No |

---


### DealStageDeal


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| DealId | integer | Yes |  | No | No |
| PipelineId | integer | Yes |  | No | No |
| StageId | integer | Yes |  | No | No |
| StatusId | integer | Yes |  | No | No |

**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Deal | Deal | No |  | No | No |
| Pipeline | DealPipeline | No |  | No | No |
| Stage | DealStage | No |  | No | No |
| Status | DealStatus | No |  | No | No |

---


### DealStatus


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| Name | string | Yes | deal_status_name | No | No |

---
