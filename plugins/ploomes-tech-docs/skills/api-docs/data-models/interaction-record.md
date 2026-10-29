# InteractionRecord — Data Models

Data models for the InteractionRecord domain.

### Column Reference

Each property table includes the following columns:

| Column | Description |
|--------|-------------|
| **FieldKey** | The key used to reference this property in the Fields system (see [Fields & Entities](../07-fields-and-entities.md)). Empty if the property is not exposed as a field. |
| **Creatable** | **Yes** = can be set on `POST` (create). **No** = cannot be set on create; managed by the system. |
| **Editable** | **Yes** = can be set on `PATCH` (edit). **No** = cannot be set on edit; managed by the system. |

> **Note on Required vs Nullable**: If a field is not Required and is not Nullable, you may omit it from the payload (the API will set a default value), but you may not send it as `null`.

---

### InteractionRecord


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No | interaction_record_id | Yes | No |
| ContactId | integer | Yes | interaction_record_contacts | Yes | Yes |
| AccountId | integer | Yes |  | No | No |
| DealId | integer | Yes | interaction_record_deal | Yes | Yes |
| Date | datetime | Yes | interaction_record_date | Yes | Yes |
| Length | Single | Yes |  | No | No |
| TypeId | integer | Yes | interaction_record_type | Yes | Yes |
| Title | string | Yes |  | No | No |
| Content | string | Yes | interaction_record_content | Yes | Yes |
| Latitude | decimal | Yes | interaction_record_latitude | Yes | No |
| Longitude | decimal | Yes | interaction_record_longitude | Yes | No |
| VerifiedCheckIn | boolean | Yes | interaction_record_verified_check_in | No | No |
| OriginalTaskId | integer | Yes | interaction_record_original_task | No | No |
| TotalVoiceCallId | integer | Yes |  | No | No |
| EmailRecipients | string | Yes |  | No | No |
| EmailSender | string | Yes |  | No | No |
| EmailOriginalSender | string | Yes |  | No | No |
| EmailReference | string | Yes |  | No | No |
| EmailSubject | string | Yes |  | No | No |
| CreatorId | integer | Yes | interaction_record_creator | No | No |
| UpdaterId | integer | Yes |  | No | No |
| LastUpdateDate | datetime | Yes |  | No | No |
| CreateDate | datetime | Yes | interaction_record_create_date | No | No |
| Editable | boolean | Yes |  | No | No |
| DurationInSeconds | integer | Yes | interaction_record_duration_in_seconds | Yes | No |
| CallStatusId | integer | Yes | interaction_record_call_status | Yes | No |
| CheckInAddress | string | Yes | interaction_record_check_in_address | Yes | No |
| CheckInLatitude | decimal | Yes | interaction_record_check_in_latitude | Yes | No |
| CheckInLongitude | decimal | Yes | interaction_record_check_in_longitude | Yes | No |
| CheckInDate | datetime | Yes | interaction_record_check_in_date | Yes | No |
| VerifiedCheckOut | boolean | Yes | interaction_record_check_out_verified | Yes | No |
| CheckOutAddress | string | Yes | interaction_record_check_out_address | Yes | No |
| CheckOutLatitude | decimal | Yes | interaction_record_check_out_latitude | Yes | No |
| CheckOutLongitude | decimal | Yes | interaction_record_check_out_longitude | Yes | No |
| CheckOutDate | datetime | Yes | interaction_record_check_out_date | Yes | No |
| WasMerged | boolean | Yes |  | No | No |
| MergeInteraction | boolean | Yes |  | No | No |
| Address | string | Yes | interaction_record_address | Yes | Yes |
| FieldStatusId | integer | Yes |  | No | No |
| AiGenerated | boolean | Yes |  | No | No |
| AiGenerationStatusId | integer | Yes |  | No | No |

> Editing `DealId` moves the record to another deal, or unlinks it back to a
> contact-only state. Both are validated as business rules — see
> [`PATCH /InteractionRecords/{key}`](../endpoints/interaction-records.md#patch-interactionrecordskey).


**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Contact | Contact | No | interaction_record_contact | Yes | No |
| Deal | Deal | No | interaction_record_deal | Yes | No |
| Type | TaskType | No | interaction_record_type | Yes | Yes |
| Tags | Collection(TagItem) | Yes | interaction_record_tags | Yes | Yes |
| Contacts | Collection(InteractionRecordContact) | Yes | interaction_record_contacts | Yes | Yes |
| Comments | Collection(Comment) | Yes |  | No | No |
| NotifiedUsers | Collection(UserNotification) | Yes |  | No | No |
| OriginalTask | Task | No | interaction_record_original_task | No | No |
| Attachments | Collection(Attachment) | Yes |  | No | No |
| AttachmentsItems | Collection(AttachmentItemRelation) | Yes |  | No | No |
| OtherProperties | Collection(InteractionRecordFieldValue) | Yes |  | No | No |
| Creator | User | No | interaction_record_creator | No | No |
| Updater | User | No |  | No | No |
| CallStatus | InteractionRecordCallStatus | No | interaction_record_call_status | Yes | No |
| FieldStatus | DealFieldStatus | No |  | No | No |
| AiGenerationStatus | InteractionRecordAiGenerationStatus | No |  | No | No |

---


### InteractionRecordAiGenerationStatus


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| Name | string | Yes |  | No | No |

---


### InteractionRecordCallStatus


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| Name | string | Yes | interaction_record_call_status_name | Yes | Yes |

---


### InteractionRecordContact


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |

**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| InteractionRecord | InteractionRecord | No |  | No | No |
| Contact | Contact | No |  | No | No |
