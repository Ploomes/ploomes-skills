# Automation — Data Models

Data models for the Automation domain.

### Column Reference

Each property table includes the following columns:

| Column | Description |
|--------|-------------|
| **FieldKey** | The key used to reference this property in the Fields system (see [Fields & Entities](../07-fields-and-entities.md)). Empty if the property is not exposed as a field. |
| **Creatable** | **Yes** = can be set on `POST` (create). **No** = cannot be set on create; managed by the system. |
| **Editable** | **Yes** = can be set on `PATCH` (edit). **No** = cannot be set on edit; managed by the system. |

> **Note on Required vs Nullable**: If a field is not Required and is not Nullable, you may omit it from the payload (the API will set a default value), but you may not send it as `null`.

---

### Automation


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| Name | string | Yes |  | Yes | Yes |
| EntityId | integer | Yes |  | Yes | No |
| TriggerId | integer | Yes |  | Yes | Yes |
| TriggerFilterId | integer | Yes |  | Yes | Yes |
| TriggerDealStageId | integer | Yes |  | No | No |
| TriggerRepeatIntervalUnitId | integer | Yes |  | No | No |
| TriggerRepeatIntervalLength | integer | Yes |  | No | No |
| TriggerRepeatStartDateTime | datetime | Yes |  | No | No |
| Ordination | integer | Yes |  | No | No |
| Enabled | boolean | No |  | Yes | Yes |
| CreatorId | integer | Yes |  | No | No |
| CreateDate | datetime | Yes |  | No | No |
| LastRunTime | datetime | Yes |  | No | No |
| BlockTriggerByAutomation | boolean | No |  | Yes | Yes |
| UpdaterId | integer | Yes |  | No | No |
| LastUpdateDate | datetime | No |  | No | No |
| DisabledDueToError | boolean | No |  | No | No |
| HasTriggerFields | boolean | Yes |  | No | No |


**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Entity | FieldEntity | No |  | No | No |
| Trigger | AutomationTrigger | No |  | No | No |
| TriggerFilter | Filter | No |  | No | No |
| TriggerDealStage | DealStage | No |  | No | No |
| TriggerRepeatIntervalUnit | IntervalUnit | No |  | No | No |
| Creator | User | No |  | No | No |
| Actions | Collection(AutomationAction) | Yes |  | Yes | Yes |
| Updater | User | No |  | No | No |
| TriggerFields | Collection(AutomationTriggerField) | Yes |  | No | No |

> **Writing `Actions` replaces the whole collection.** A `PATCH` carrying `Actions`
> also requires `EntityId` and `TriggerId` in the same body — without them it fails
> with `500 Object reference not set to an instance of an object`. The stored
> collection is discarded and rebuilt: an action you do not resend is deleted, and
> every action gets a new `Id` on each save, so never match actions by id. Read the
> automation, send every action back with your change applied, and leave `Actions` out
> of the body when editing anything else.

> **`POST /Automations` creates the automation enabled** unless the body carries
> `"Enabled": false`, and `POST /Automations({id})/Duplicate` always creates the copy
> enabled, with its own new filter. `Name` accepts 150 characters; at 151 both `POST`
> and `PATCH` answer `400 "Your request has a wrong format"` without naming the
> property. A `TriggerFilter` object nested in the body is ignored, with `200` —
> reference the filter by `TriggerFilterId`.

---


### AutomationAction


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| AutomationId | integer | Yes |  | No | No |
| ActionId | integer | Yes |  | No | No |
| FieldKey | string | Yes |  | No | No |
| FieldPathId | integer | Yes |  | No | No |
| StringValue | string | Yes |  | No | No |
| BigStringValue | string | Yes |  | No | No |
| IntegerValue | integer | Yes |  | No | No |
| DecimalValue | number | Yes |  | No | No |
| DateTimeValue | datetime | Yes |  | No | No |
| BoolValue | boolean | Yes |  | No | No |
| ObjectValueName | string | Yes |  | No | No |
| UserValueId | integer | Yes |  | No | No |
| DealStageId | integer | Yes |  | No | No |
| EmailTemplateId | integer | Yes |  | No | No |
| RecipientsEmailAddress | string | Yes |  | No | No |
| EmailSenderTypeId | integer | Yes |  | No | No |
| EmailSenderUserId | integer | Yes |  | No | No |
| EmailSenderFieldKey | string | Yes |  | No | No |
| EmailSenderFieldPathId | integer | Yes |  | No | No |
| EmailSenderFailureNotificationUserId | integer | Yes |  | No | No |
| TaskDaysFromNow | integer | Yes |  | No | No |
| RequestBody | string | Yes |  | No | No |
| LossReasonId | integer | Yes |  | No | No |
| ShouldGenerateDocument | boolean | Yes |  | No | No |
| MeetimeCadenceId | integer | Yes |  | No | No |
| MeetimeImmediateStart | boolean | Yes |  | No | No |
| MeetimeWaitStart | boolean | Yes |  | No | No |
| ShouldClearFieldValues | boolean | Yes |  | No | No |
| TaskFilterId | integer | Yes |  | No | No |

**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Automation | Automation | No |  | No | No |
| Action | AutomationActionAction | No |  | No | No |
| Field | Field | No |  | No | No |
| FieldPath | FieldEntityPath | No |  | No | No |
| UserValue | User | No |  | No | No |
| DealStage | DealStage | No |  | No | No |
| EmailTemplate | EmailTemplate | No |  | No | No |
| EmailSenderField | Field | No |  | No | No |
| EmailSenderFieldPath | FieldEntityPath | No |  | No | No |
| EmailSenderFailureNotificationUser | User | No |  | No | No |
| LossReason | DealLossReason | No |  | No | No |
| Fields | Collection(AutomationActionField) | Yes |  | No | No |
| Values | Collection(AutomationActionValue) | Yes |  | No | No |
| TaskFilter | Filter | No |  | No | No |

---


### AutomationActionEmailSenderType


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| Name | string | Yes |  | No | No |

---


### AutomationTrigger


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| Name | string | Yes |  | No | No |
| DealStageIdRequired | boolean | No |  | No | No |
| WebhookActionId | integer | Yes |  | No | No |
| RestrictedEntityId | integer | Yes |  | No | No |

**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| RestrictedEntity | FieldEntity | No |  | No | No |

---


### AutomationTriggerField


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| AutomationId | integer | No |  | No | No |
| FieldKey | string | Yes |  | No | No |

**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Field | Field | No |  | No | No |
| Automation | Automation | No |  | No | No |

---

