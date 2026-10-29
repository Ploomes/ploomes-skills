# User — Data Models

Data models for the User domain.

### Column Reference

Each property table includes the following columns:

| Column | Description |
|--------|-------------|
| **FieldKey** | The key used to reference this property in the Fields system (see [Fields & Entities](../07-fields-and-entities.md)). Empty if the property is not exposed as a field. |
| **Creatable** | **Yes** = can be set on `POST` (create). **No** = cannot be set on create; managed by the system. |
| **Editable** | **Yes** = can be set on `PATCH` (edit). **No** = cannot be set on edit; managed by the system. |

> **Note on Required vs Nullable**: If a field is not Required and is not Nullable, you may omit it from the payload (the API will set a default value), but you may not send it as `null`.

---

### User


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No | user_id | No | No |
| AccountId | integer | No |  | No | No |
| Name | string | Yes | user_name | Yes | Yes |
| Email | string | Yes | user_email | Yes | Yes |
| Phone | string | Yes | user_phone | Yes | Yes |
| AvatarUrl | string | Yes | user_avatar_url | Yes | Yes |
| RoleId | integer | Yes | user_role | Yes | Yes |
| ProfileId | integer | Yes | user_profile | Yes | Yes |
| Facebook | string | Yes | user_facebook | Yes | Yes |
| LinkedIn | string | Yes | user_linkedin | Yes | Yes |
| Birthday | datetime | Yes |  | No | No |
| NextAnniversary | datetime | Yes | user_next_anniversary | No | No |
| PreviousAnniversary | datetime | Yes | user_previous_anniversary | No | No |
| Integration | boolean | No | user_integration | No | No |
| NativeIntegration | boolean | No |  | No | No |
| GoogleAuthenticatorConfigured | boolean | Yes |  | No | No |
| LastLogin | datetime | Yes |  | No | No |
| Frequency | double | Yes |  | No | No |
| AccountOwner | boolean | No |  | No | No |
| ActiveSmtp | boolean | No |  | No | No |
| LastSeen | datetime | Yes | user_last_seen | No | No |
| LastSeenRoute | string | Yes |  | No | No |
| Editable | boolean | No |  | No | No |
| Suspended | boolean | No | user_suspended | No | No |
| CreatorId | integer | Yes | user_creator | No | No |
| UpdaterId | integer | Yes |  | No | No |
| CreateDate | datetime | Yes |  | No | No |
| UpdateDate | datetime | Yes |  | No | No |
| LastUpdateDate | datetime | Yes |  | No | No |
| LastSeenPlatform | string | Yes |  | No | No |
| ResetPassword | boolean | Yes |  | No | No |
| Language | string | Yes |  | No | No |
| LanguageId | integer | Yes |  | No | No |
| NoLogin | boolean | Yes | user_no_login | No | No |
| DefaultMaskCountryId | integer | Yes |  | No | No |
| AllPipelinesCollapseOpen | boolean | Yes |  | No | No |
| StarredPipelinesCollapseOpen | boolean | Yes |  | No | No |
| PipelineSelectorViewModeId | integer | Yes |  | No | No |
| StarredPipelineSelectorViewModeId | integer | Yes |  | No | No |
| SSOResetPassword | boolean | Yes |  | No | No |


**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Role | Role | No | user_role | Yes | Yes |
| Profile | UserProfile | No | user_profile | Yes | Yes |
| Teams | Collection(UserTeam) | Yes | user_teams | Yes | Yes |
| OtherProperties | Collection(UserFieldValue) | Yes |  | No | No |
| Creator | User | No | user_creator | No | No |
| AttachmentsItems | Collection(AttachmentItemRelation) | Yes |  | No | No |
| PipelineSelectorViewMode | SelfPipelineSelectorViewMode | No |  | No | No |
| StarredPipelineSelectorViewMode | SelfPipelineSelectorViewMode | No |  | No | No |

---

### UserNotification


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| InteractionRecordId | integer | Yes |  | No | No |
| TaskId | integer | Yes |  | No | No |
| CommentId | integer | Yes |  | No | No |
| HistoryId | integer | Yes |  | No | No |

**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| User | User | No |  | No | No |
| InteractionRecord | InteractionRecord | No |  | No | No |
| Task | Task | No |  | No | No |
| Comment | Comment | No |  | No | No |
| History | LeadHistory | No |  | No | No |

---


### UserProfile


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| Name | string | Yes | user_profile_name | Yes | Yes |
| Administrator | boolean | No |  | No | No |
| ContactsModule | boolean | No |  | No | No |
| ContactsView | integer | No |  | No | No |
| ContactsEdit | integer | No |  | No | No |
| ContactsDelete | integer | No |  | No | No |
| ContactsPersonCreatePermission | boolean | No |  | No | No |
| ContactsCompanyCreatePermission | boolean | No |  | No | No |
| ContactsCreatePermission | boolean | No |  | No | No |
| ContactsProductsViewPermission | boolean | No |  | No | No |
| ContactsProductsCreatePermission | boolean | No |  | No | No |
| ContactsProductsEditPermission | boolean | No |  | No | No |
| ContactsProductsDeletePermission | boolean | No |  | No | No |
| DealsModule | boolean | No |  | No | No |
| DealsView | integer | No |  | No | No |
| DealsContactsView | boolean | No |  | No | No |
| DealsEdit | integer | No |  | No | No |
| DealsContactsEdit | boolean | No |  | No | No |
| DealsDelete | integer | No |  | No | No |
| DealsContactsDelete | boolean | No |  | No | No |
| DealsCreatePermission | boolean | No |  | No | No |
| DealsWinOrLosePermission | boolean | No |  | No | No |
| DealsReopenPermission | boolean | No |  | No | No |
| QuotesModule | boolean | No |  | No | No |
| QuotesCreatePermission | boolean | No |  | No | No |
| QuotesEditPermission | boolean | No |  | No | No |
| QuotesDeletePermission | boolean | No |  | No | No |
| LeadsModule | boolean | No |  | No | No |
| LeadsView | integer | Yes |  | No | No |
| LeadsEdit | integer | Yes |  | No | No |
| LeadsUpdateStatusPermission | boolean | No |  | No | No |
| LeadsDelete | integer | No |  | No | No |
| LeadsCreatePermission | boolean | No |  | No | No |
| OrdersModule | boolean | No |  | No | No |
| OrdersView | integer | No |  | No | No |
| OrdersEdit | integer | No |  | No | No |
| OrdersDelete | integer | No |  | No | No |
| OrdersCreatePermission | boolean | No |  | No | No |
| DocumentsModule | boolean | No |  | No | No |
| DocumentsCreatePermission | boolean | No |  | No | No |
| DocumentsEditPermission | boolean | No |  | No | No |
| DocumentsDeletePermission | boolean | No |  | No | No |
| UsersView | integer | Yes |  | No | No |
| ProductsAdministerPermission | boolean | No |  | No | No |
| ProductsCreatePermission | boolean | No |  | No | No |
| ProductsEditPermission | boolean | No |  | No | No |
| ProductsDeletePermission | boolean | No |  | No | No |
| TablesCreatePermission | boolean | No |  | No | No |
| LossReasonsCreatePermission | boolean | No |  | No | No |
| TagsCreatePermission | boolean | No |  | No | No |
| CitiesCreatePermission | boolean | No |  | No | No |
| OtherOptionsCreatePermission | boolean | No |  | No | No |
| ExcelExportPermission | boolean | No |  | No | No |
| ExcelImportPermission | boolean | No |  | No | No |
| ReportsModule | boolean | No |  | No | No |
| EmailsModule | boolean | No |  | No | No |
| EmailsView | integer | Yes |  | No | No |
| TasksModule | boolean | No |  | No | No |
| FullMainTimeline | boolean | No |  | No | No |
| GoalsContactsCreate | integer | No |  | No | No |
| GoalsDealsCreate | integer | No |  | No | No |
| GoalsLeadsCreate | integer | No |  | No | No |
| GoalsOrdersCreate | integer | No |  | No | No |
| GoalsDocumentsCreate | integer | No |  | No | No |
| GoalsTasksCreate | integer | No |  | No | No |
| GoalsInteractionRecordsCreate | integer | No |  | No | No |
| ChatModule | boolean | No |  | No | No |
| ChatPermission | integer | Yes |  | No | No |
| FieldsCreatePermission | boolean | No |  | No | No |
| FieldsEditPermission | boolean | No |  | No | No |
| FieldsDeletePermission | boolean | No |  | No | No |
| Editable | boolean | No |  | No | No |
| Listable | boolean | No |  | No | No |
| LogsViewPermission | integer | No |  | No | No |
| HomeMessagesCreate | integer | No |  | No | No |
| TeamsView | integer | No |  | No | No |
| GoalsModule | boolean | Yes |  | No | No |
| LibraryModule | boolean | No |  | No | No |
| AttachmentBaseFolderCreatePermission | boolean | No |  | No | No |
| ContactPublicFormsCreatePermission | boolean | No |  | No | No |
| DealPublicFormsCreatePermission | boolean | No |  | No | No |
| CreatorId | integer | Yes |  | No | No |
| CreateDate | datetime | Yes |  | No | No |
| UpdaterId | integer | Yes |  | No | No |
| UpdateDate | datetime | Yes |  | No | No |
| QuoteSharePermission | boolean | No |  | No | No |
| OrderSharePermission | boolean | No |  | No | No |
| DocumentSharePermission | boolean | No |  | No | No |
| InteractionRecordDeletePermission | boolean | No |  | No | No |
| InteractionRecordEditPermission | boolean | No |  | No | No |

**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| AllowedChatUsers | Collection(UserProfileAllowedChatUser) | Yes |  | No | No |
| AccountIntegrationsPermissions | Collection(UserProfileAccountIntegrationPermission) | Yes |  | No | No |
| Creator | User | No |  | No | No |
| Updater | User | No |  | No | No |

---


### UserTeam


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| TeamId | integer | Yes |  | No | No |

**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| User | User | No |  | No | No |
| Team | Team | No |  | No | No |

---
