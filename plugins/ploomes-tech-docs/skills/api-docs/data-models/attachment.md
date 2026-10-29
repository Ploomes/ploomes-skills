# Attachment — Data Models

Data models for the Attachment domain.

### Column Reference

Each property table includes the following columns:

| Column | Description |
|--------|-------------|
| **FieldKey** | The key used to reference this property in the Fields system (see [Fields & Entities](../07-fields-and-entities.md)). Empty if the property is not exposed as a field. |
| **Creatable** | **Yes** = can be set on `POST` (create). **No** = cannot be set on create; managed by the system. |
| **Editable** | **Yes** = can be set on `PATCH` (edit). **No** = cannot be set on edit; managed by the system. |

> **Note on Required vs Nullable**: If a field is not Required and is not Nullable, you may omit it from the payload (the API will set a default value), but you may not send it as `null`.

---

### Attachment


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| ItemId | integer | No |  | No | No |
| OriginId | integer | Yes |  | No | No |
| EntityId | integer | No |  | No | No |
| ContactId | integer | Yes |  | No | No |
| DealId | integer | Yes |  | No | No |
| OrderId | integer | Yes |  | No | No |
| NoteId | integer | Yes |  | No | No |
| InteractionRecordId | integer | Yes |  | No | No |
| EmailId | integer | Yes |  | No | No |
| EmailTemplateId | integer | Yes |  | No | No |
| LeadId | integer | Yes |  | No | No |
| TaskId | integer | Yes |  | No | No |
| DocumentId | integer | Yes |  | No | No |
| QuoteId | integer | Yes |  | No | No |
| ProductId | integer | Yes |  | No | No |
| ProductGroupId | integer | Yes |  | No | No |
| ProductFamilyId | integer | Yes |  | No | No |
| AccountId | integer | Yes |  | No | No |
| AccountId2 | integer | Yes |  | No | No |
| ChatId | integer | Yes |  | No | No |
| MessageId | integer | Yes |  | No | No |
| AttachmentItemId | integer | Yes |  | No | No |
| FileName | string | Yes |  | No | No |
| ContentType | string | Yes |  | No | No |
| ContentLength | integer | No |  | No | No |
| Url | string | Yes |  | No | No |
| Listable | boolean | No |  | No | No |
| IsSensitiveData | boolean | Yes |  | No | No |
| CreatorId | integer | Yes |  | No | No |


**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Entity | FieldEntity | No |  | No | No |
| Contact | Contact | No |  | No | No |
| Deal | Deal | No |  | No | No |
| Order | Order | No |  | No | No |
| Note | Note | No |  | No | No |
| InteractionRecord | InteractionRecord | No |  | No | No |
| Email | Email | No |  | No | No |
| EmailTemplate | EmailTemplate | No |  | No | No |
| Lead | Lead | No |  | No | No |
| Task | Task | No |  | No | No |
| Document | Document | No |  | No | No |
| Quote | Quote | No |  | No | No |
| Product | Product | No |  | No | No |
| ProductGroup | ProductGroup | No |  | No | No |
| ProductFamily | ProductFamily | No |  | No | No |
| Account | Account | No |  | No | No |
| User | User | No |  | No | No |
| Chat | Chat | No |  | No | No |
| Message | Message | No |  | No | No |
| AttachmentItem | AttachmentItem (nullable) | No |  | No | No |
| Creator | User | No |  | No | No |

---


### AttachmentFolder


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| Name | string | Yes | attachment_folder_name | Yes | Yes |
| CollectionSingularUnitName | string | Yes |  | No | No |
| CollectionPluralUnitName | string | Yes |  | No | No |
| CollectionGenderId | integer | Yes |  | No | No |
| BaseFolderId | integer | Yes |  | No | No |
| ParentFolderId | integer | Yes |  | No | No |
| FormId | integer | Yes |  | No | No |
| CollectionFormId | integer | Yes |  | No | No |
| IsPublicView | boolean | Yes |  | No | No |
| IsPublicEdit | boolean | Yes |  | No | No |
| IsPublicDelete | boolean | Yes |  | No | No |
| PermissionTypeId | integer | Yes |  | No | No |
| EditPermissionTypeId | integer | Yes |  | No | No |
| DeletePermissionTypeId | integer | Yes |  | No | No |
| ChildFoldersCount | integer | No |  | No | No |
| Editable | boolean | No |  | No | No |
| Deletable | boolean | No |  | No | No |
| Archived | boolean | No |  | No | No |
| IsDraft | boolean | Yes |  | No | No |
| Depth | integer | Yes |  | No | No |
| IsRag | boolean | No |  | No | No |

**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| CollectionGender | Gender | No |  | No | No |
| BaseFolder | AttachmentFolder | No |  | No | No |
| ParentFolder | AttachmentFolder | No |  | No | No |
| Form | Form | No |  | No | No |
| PermissionType | PermissionType | No |  | No | No |
| EditPermissionType | PermissionType | No |  | No | No |
| DeletePermissionType | PermissionType | No |  | No | No |
| Folders | Collection(AttachmentFolder) | Yes |  | No | No |
| Items | Collection(AttachmentItem) | Yes |  | No | No |
| Parents | Collection(AttachmentFolderParent) | Yes |  | No | No |
| AllowedUsers | Collection(AttachmentFolderAllowedUser) | Yes |  | No | No |
| AllowedUserProfiles | Collection(AttachmentFolderAllowedUserProfile) | Yes |  | No | No |
| AllowedTeams | Collection(AttachmentFolderAllowedTeam) | Yes |  | No | No |
| EditionAllowedUsers | Collection(AttachmentFolderEditionAllowedUser) | Yes |  | No | No |
| EditionAllowedUserProfiles | Collection(AttachmentFolderEditionAllowedUserProfile) | Yes |  | No | No |
| EditionAllowedTeams | Collection(AttachmentFolderEditionAllowedTeam) | Yes |  | No | No |
| DeletionAllowedUsers | Collection(AttachmentFolderDeletionAllowedUser) | Yes |  | No | No |
| DeletionAllowedUserProfiles | Collection(AttachmentFolderDeletionAllowedUserProfile) | Yes |  | No | No |
| DeletionAllowedTeams | Collection(AttachmentFolderDeletionAllowedTeam) | Yes |  | No | No |
| OtherProperties | Collection(AttachmentFolderFieldValue) | Yes |  | No | No |

---


### AttachmentItemRelation


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| AttachmentItemId | integer | Yes |  | No | No |
| EntityId | integer | Yes |  | No | No |
| ContactId | integer | Yes |  | No | No |
| OrderId | integer | Yes |  | No | No |
| InteractionRecordId | integer | Yes |  | No | No |
| LeadId | integer | Yes |  | No | No |
| DealId | integer | Yes |  | No | No |
| EmailTemplateId | integer | Yes |  | No | No |
| TaskId | integer | Yes |  | No | No |
| DocumentId | integer | Yes |  | No | No |
| QuoteId | integer | Yes |  | No | No |
| ProductId | integer | Yes |  | No | No |
| ProductGroupId | integer | Yes |  | No | No |
| ProductFamilyId | integer | Yes |  | No | No |
| MessageId | integer | Yes |  | No | No |

**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| AttachmentItem | AttachmentItem | No |  | No | No |
| Entity | FieldEntity | No |  | No | No |
| Contact | Contact | No |  | No | No |
| Order | Order | No |  | No | No |
| InteractionRecord | InteractionRecord | No |  | No | No |
| Lead | Lead | No |  | No | No |
| Deal | Deal | No |  | No | No |
| EmailTemplate | EmailTemplate | No |  | No | No |
| Task | Task | No |  | No | No |
| Document | Document | No |  | No | No |
| Quote | Quote | No |  | No | No |
| Product | Product | No |  | No | No |
| ProductGroup | ProductGroup | No |  | No | No |
| ProductFamily | ProductFamily | No |  | No | No |
| Account | Account | No |  | No | No |
| User | User | No |  | No | No |
| Message | Message | No |  | No | No |

---

