# Email — Data Models

Data models for the Email domain.

### Column Reference

Each property table includes the following columns:

| Column | Description |
|--------|-------------|
| **FieldKey** | The key used to reference this property in the Fields system (see [Fields & Entities](../07-fields-and-entities.md)). Empty if the property is not exposed as a field. |
| **Creatable** | **Yes** = can be set on `POST` (create). **No** = cannot be set on create; managed by the system. |
| **Editable** | **Yes** = can be set on `PATCH` (edit). **No** = cannot be set on edit; managed by the system. |

> **Note on Required vs Nullable**: If a field is not Required and is not Nullable, you may omit it from the payload (the API will set a default value), but you may not send it as `null`.

---

### Email


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| From | string | Yes | email_from | No | No |
| To | string | Yes | email_to | Yes | Yes |
| Subject | string | Yes | email_subject | Yes | Yes |
| Cc | string | Yes | email_cc | Yes | Yes |
| Bcc | string | Yes |  | No | No |
| Snippet | string | Yes |  | No | No |
| SenderUserId | integer | Yes | email_sender_user | No | No |
| SenderContactId | integer | Yes | email_sender_contact | No | No |
| ContactId | integer | Yes |  | No | No |
| Date | datetime | Yes | email_date | No | No |
| Private | boolean | Yes |  | No | No |
| StatusId | integer | Yes | email_status | Yes | Yes |
| FolderId | integer | Yes | email_folder | Yes | Yes |
| Content | string | Yes |  | No | No |
| Formatted | boolean | Yes |  | No | No |
| FormattedContent | string | Yes |  | No | No |
| Draft | boolean | Yes |  | No | No |
| Sent | boolean | Yes | email_sent | No | No |
| Read | boolean | Yes | email_read | No | Yes |
| Thread | string | Yes |  | No | No |
| GroupId | integer | Yes |  | No | No |
| DealId | integer | Yes | email_deals | No | No |
| TrackingEnabled | boolean | Yes |  | No | No |
| TrackingCode | string | Yes |  | No | No |
| LastOpenDate | datetime | Yes |  | No | No |
| Trashed | boolean | No |  | No | No |
| Editable | boolean | Yes |  | No | No |
| EmailMessageId | string | Yes |  | No | No |
| DisableDocumentsAttachments | boolean | Yes |  | No | No |


**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| User | User | No |  | No | No |
| SenderUser | User | No | email_sender_user | No | No |
| SenderContact | Contact | No | email_sender_contact | No | No |
| Contact | Contact | No |  | No | No |
| Status | EmailStatus | No | email_status | Yes | Yes |
| Folder | EmailFolder | No | email_folder | Yes | Yes |
| Group | EmailGroup | No |  | No | No |
| Deal | Deal | No |  | No | No |
| Opens | Collection(EmailOpen) | Yes |  | No | No |
| Contacts | Collection(EmailContact) | Yes |  | No | No |
| Recipients | Collection(EmailRecipient) | Yes | email_recipients | Yes | Yes |
| Attachments | Collection(Attachment) | Yes |  | No | No |
| OtherProperties | Collection(EmailFieldValue) | Yes |  | No | No |
| Tags | Collection(TagItem) | Yes | email_tags | Yes | Yes |

---


### EmailContact


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| EmailId | integer | Yes |  | No | No |
| ContactId | integer | Yes |  | No | No |

**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Email | Email | No |  | No | No |
| Contact | Contact | No |  | No | No |

---

### EmailFolder


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| Name | string | Yes |  | No | No |
| IconId | integer | Yes |  | No | No |
| Color | string | Yes |  | No | No |
| TypeId | integer | Yes |  | No | No |
| FolderId | integer | Yes |  | No | No |
| ImapHighestModSeq | integer | Yes |  | No | No |
| ImapId | integer | Yes |  | No | No |
| ImapSync | boolean | Yes |  | No | No |
| ImapIdleSync | boolean | Yes |  | No | No |
| Ordination | integer | Yes |  | No | No |
| ImapLastSyncDate | datetime | Yes |  | No | No |
| IsEmailSyncing | boolean | Yes |  | No | No |

**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| User | User | No |  | No | No |
| Icon | Icon | No |  | No | No |
| Folder | EmailFolder | No |  | No | No |

---


### EmailGroup


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| Title | string | Yes |  | No | No |
| FolderId | integer | Yes |  | No | No |
| HasUnreadEmails | boolean | No |  | No | No |
| LastEmailId | integer | Yes |  | No | No |
| DealId | integer | Yes |  | No | No |
| ContactId | integer | Yes |  | No | No |
| EmailsCount | integer | Yes |  | No | No |
| TrashedEmailsCount | integer | Yes |  | No | No |

**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Folder | EmailFolder | No |  | No | No |
| User | User | No |  | No | No |
| LastEmail | Email | No |  | No | No |
| Deal | Deal | No |  | No | No |
| Contact | Contact | No |  | No | No |
| EmailAddresses | Collection(EmailGroupEmailAddress) | Yes |  | No | No |
| Emails | Collection(Email) | Yes |  | No | No |

---


### EmailOpen


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| EmailId | integer | Yes |  | No | No |
| OpenDate | datetime | No |  | No | No |

**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Email | Email | No |  | No | No |

---


### EmailRecipient


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| EmailId | integer | Yes |  | No | No |
| ContactId | integer | Yes | email_recipient_contact | No | No |
| EmailAddress | string | Yes | email_recipient_email_address | No | No |

**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Email | Email | No |  | No | No |
| Contact | Contact | No | email_recipient_contact | No | No |
| User | User | No | email_recipient_user | No | No |

---


### EmailStatus


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| Name | string | Yes | email_status_name | Yes | Yes |

---


### EmailTemplate


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| EntityId | integer | Yes |  | No | No |
| Name | string | Yes |  | No | No |
| Subject | string | Yes |  | No | No |
| Content | string | Yes |  | No | No |
| Editable | boolean | Yes |  | No | No |
| Automations | boolean | Yes |  | No | No |

**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Entity | FieldEntity | No |  | No | No |
| AllowedUsers | Collection(EmailTemplateAllowedUser) | Yes |  | No | No |
| AllowedTeams | Collection(EmailTemplateAllowedTeam) | Yes |  | No | No |
| SubjectVariables | Collection(EmailTemplateSubjectVariable) | Yes |  | No | No |
| Attachments | Collection(Attachment) | Yes |  | No | No |
| AttachmentsItems | Collection(AttachmentItemRelation) | Yes |  | No | No |

---
