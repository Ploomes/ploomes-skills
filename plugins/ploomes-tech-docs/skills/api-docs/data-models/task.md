# Task — Data Models

Data models for the Task domain.

### Column Reference

Each property table includes the following columns:

| Column | Description |
|--------|-------------|
| **FieldKey** | The key used to reference this property in the Fields system (see [Fields & Entities](../07-fields-and-entities.md)). Empty if the property is not exposed as a field. |
| **Creatable** | **Yes** = can be set on `POST` (create). **No** = cannot be set on create; managed by the system. |
| **Editable** | **Yes** = can be set on `PATCH` (edit). **No** = cannot be set on edit; managed by the system. |

> **Note on Required vs Nullable**: If a field is not Required and is not Nullable, you may omit it from the payload (the API will set a default value), but you may not send it as `null`.

---

### Task


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No | task_id | Yes | No |
| Title | string | Yes | task_title | Yes | Yes |
| Description | string | Yes | task_description | Yes | Yes |
| TypeId | integer | Yes | task_type | Yes | Yes |
| ContactId | integer | Yes | task_contacts | Yes | Yes |
| ContactName | string | Yes |  | No | No |
| DealId | integer | Yes | task_deal | Yes | Yes |
| RepeatIntervalLength | integer | Yes | task_repeat_interval_length | Yes | Yes |
| RepeatIntervalUnitId | integer | Yes | task_repeat_interval_unit | Yes | Yes |
| EmailReminderId | integer | Yes | task_email_reminder | Yes | Yes |
| DateTime | datetime | Yes | task_time | Yes | Yes |
| EndTime | datetime | Yes |  | No | No |
| NoTime | boolean | Yes | task_no_time | Yes | Yes |
| Length | integer | Yes | task_length | Yes | Yes |
| Finished | boolean | Yes | task_finished | No | No |
| Editable | boolean | Yes |  | No | No |
| Finishable | boolean | Yes |  | No | No |
| CreatesGoogleCalendarEvent | boolean | Yes | task_creates_event | Yes | Yes |
| Address | string | Yes | task_address | Yes | Yes |
| Latitude | decimal | Yes | task_latitude | Yes | Yes |
| Longitude | decimal | Yes | taskct_longitude | Yes | Yes |
| InteractionRecordId | integer | Yes |  | No | No |
| OriginTaskId | integer | Yes |  | No | No |
| CreatorId | integer | Yes | task_creator | No | No |
| UpdaterId | integer | Yes |  | No | No |
| FinisherId | integer | Yes |  | No | No |
| FinishDate | datetime | Yes |  | No | No |
| CreateDate | datetime | Yes | task_create_date | No | No |
| LastUpdateDate | datetime | Yes |  | No | No |
| OwnerId | integer | Yes |  | No | No |
| OwnerTypeId | integer | Yes |  | No | No |
| Pending | boolean | Yes |  | No | No |
| OriginalTaskCreatorId | integer | Yes |  | No | No |
| Order | integer | Yes |  | No | No |
| TranscriptionPromptId | integer | Yes | task_transcription_prompt | Yes | Yes |
| AllowMeetingTranscription | boolean | Yes | allow_meeting_transcription | Yes | Yes |


**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Type | TaskType | No | task_type | Yes | Yes |
| Contact | Contact | No | task_contact | Yes | Yes |
| Deal | Deal | No | task_deal | Yes | Yes |
| Users | Collection(TaskUser) | Yes | task_users | Yes | Yes |
| Owners | Collection(TaskOwnerUser) | Yes | task_owners | Yes | Yes |
| RepeatIntervalUnit | TaskRepeatIntervalUnit | No | task_repeat_interval_unit | Yes | Yes |
| EmailReminder | TaskEmailReminder | No | task_email_reminder | Yes | Yes |
| Contacts | Collection(TaskContact) | Yes | task_contacts | Yes | Yes |
| Tags | Collection(TagItem) | Yes | task_tags | Yes | Yes |
| Comments | Collection(Comment) | Yes |  | No | No |
| InteractionRecord | InteractionRecord | No |  | No | No |
| InteractionRecords | Collection(InteractionRecord) | Yes |  | No | No |
| OriginTask | Task | No |  | No | No |
| Creator | User | No | task_creator | No | No |
| Updater | User | No |  | No | No |
| Finisher | User | No |  | No | No |
| NotifiedUsers | Collection(UserNotification) | Yes |  | No | No |
| OtherProperties | Collection(TaskFieldValue) | Yes |  | No | No |
| Attachments | Collection(Attachment) | Yes |  | No | No |
| AttachmentsItems | Collection(AttachmentItemRelation) | Yes |  | No | No |
| TranscriptionPrompt | TranscriptionPrompt | No | task_transcription_prompt | Yes | Yes |

---


### TaskContact


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| TaskId | integer | No |  | No | No |
| ContactId | integer | Yes |  | No | No |
| Name | string | Yes |  | No | No |
| Email | string | Yes |  | No | No |

**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Task | Task | No |  | No | No |
| Contact | Contact | No |  | No | No |

---


### TaskEmailReminder


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| Name | string | Yes |  | No | No |

---

### TaskOwnerUser


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| TaskId | integer | No |  | No | No |

**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Task | Task | No |  | No | No |
| User | User | No |  | No | No |

---


### TaskRepeatIntervalUnit


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| Name | string | Yes |  | No | No |
| Datepart | string | Yes |  | No | No |
| DatepartLength | integer | No |  | No | No |

---


### TaskType


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| Name | string | Yes | task_type_name | No | No |
| Icon | string | Yes |  | No | No |
| Color | string | Yes |  | No | No |
| Listable | boolean | No |  | No | No |

---


### TaskUser


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| TaskId | integer | No |  | No | No |

**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Task | Task | No |  | No | No |
| User | User | No |  | No | No |

---
