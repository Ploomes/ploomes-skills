# Account — Data Models

Data models for the Account domain.

### Column Reference

Each property table includes the following columns:

| Column | Description |
|--------|-------------|
| **FieldKey** | The key used to reference this property in the Fields system (see [Fields & Entities](../07-fields-and-entities.md)). Empty if the property is not exposed as a field. |
| **Creatable** | **Yes** = can be set on `POST` (create). **No** = cannot be set on create; managed by the system. |
| **Editable** | **Yes** = can be set on `PATCH` (edit). **No** = cannot be set on edit; managed by the system. |

> **Note on Required vs Nullable**: If a field is not Required and is not Nullable, you may omit it from the payload (the API will set a default value), but you may not send it as `null`.

---

### Account


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| Name | string | Yes | account_name | Yes | Yes |
| Email | string | Yes | account_email | Yes | Yes |
| AdministratorId | integer | Yes |  | No | No |
| Phone | string | Yes | account_phone | Yes | Yes |
| Website | string | Yes | account_website | Yes | Yes |
| Register | string | Yes | account_register | Yes | Yes |
| LogoUrl | string | Yes | account_logo_url | Yes | No |
| Language | string | Yes |  | No | No |
| LanguageId | integer | Yes |  | No | No |
| PlanId | integer | Yes |  | No | No |
| TrialExpiringDate | datetime | Yes |  | No | No |
| StreetAddress | string | Yes | account_street_address | Yes | Yes |
| StreetAddressLine2 | string | Yes | account_street_address_line2 | Yes | Yes |
| CityId | integer | Yes | account_city | Yes | Yes |
| CurrencyId | integer | No |  | No | No |
| QuotesUrl | string | Yes |  | No | No |
| OrdersUrl | string | Yes |  | No | No |
| DocumentsUrl | string | Yes |  | No | No |
| LoginRedirectUrl | string | Yes |  | No | No |
| DealsModule | boolean | No |  | No | No |
| DealsModuleName | string | Yes |  | No | No |
| DealsModuleIconId | integer | Yes |  | No | No |
| DealsModuleSingularUnitName | string | Yes |  | No | No |
| DealsModulePluralUnitName | string | Yes |  | No | No |
| DealsModuleGenderId | integer | Yes |  | No | No |
| DealsPipelinesModuleSingularUnitName | string | Yes |  | No | No |
| DealsPipelinesModulePluralUnitName | string | Yes |  | No | No |
| DealsPipelinesModuleGenderId | integer | Yes |  | No | No |
| ContactsProductsModuleName | string | Yes |  | No | No |
| ContactsProductsModuleIconId | integer | Yes |  | No | No |
| ContactsProductsModuleSingularUnitName | string | Yes |  | No | No |
| ContactsProductsModulePluralUnitName | string | Yes |  | No | No |
| ContactsProductsModuleGenderId | integer | Yes |  | No | No |
| PipelineUserUsabilityId | integer | Yes |  | No | No |
| QuoteTemplateUserUsabilityId | integer | Yes |  | No | No |
| OrderTemplateUserUsabilityId | integer | Yes |  | No | No |
| DocumentTemplateUserUsabilityId | integer | Yes |  | No | No |
| QuotesModule | boolean | No |  | No | No |
| OrdersModule | boolean | No |  | No | No |
| DocumentsModule | boolean | No |  | No | No |
| CommissionsModule | boolean | No |  | No | No |
| BusinessRulesModule | boolean | No |  | No | No |
| LeadsModule | boolean | No |  | No | No |
| ProductsModule | boolean | No |  | No | No |
| ContactsProductsModule | boolean | No |  | No | No |
| AutomationsModule | boolean | No |  | No | No |
| ReportsModule | boolean | No |  | No | No |
| ReportsModuleType | string | Yes |  | No | No |
| LibraryModulePartners | boolean | Yes |  | No | No |
| LibraryModule | boolean | Yes |  | No | No |
| LibraryModuleName | string | Yes |  | No | No |
| LibraryModuleIconId | integer | Yes |  | No | No |
| LibraryModuleSingularUnitName | string | Yes |  | No | No |
| LibraryModulePluralUnitName | string | Yes |  | No | No |
| LibraryModuleGenderId | integer | Yes |  | No | No |
| AttachmentCollectionsModuleSingularUnitName | string | Yes |  | No | No |
| AttachmentCollectionsModulePluralUnitName | string | Yes |  | No | No |
| AttachmentCollectionsModuleGenderId | integer | Yes |  | No | No |
| PublicFormModule | boolean | Yes |  | No | No |
| EnableInvoicing | boolean | No |  | No | No |
| QuotesUseERPFormat | boolean | No |  | No | No |
| OrdersUseERPFormat | boolean | No |  | No | No |
| DocumentsUseERPFormat | boolean | No |  | No | No |
| FolderName | string | Yes |  | No | No |
| NextQuoteNumber | integer | Yes |  | No | No |
| NextOrderNumber | integer | Yes |  | No | No |
| NextDocumentNumber | integer | Yes |  | No | No |
| NextDealNumber | integer | Yes |  | No | No |
| TotalVoiceIntegrationId | integer | Yes |  | No | No |
| PublicKey | string | Yes |  | No | No |
| MailChimpIntegrationId | integer | Yes |  | No | No |
| RDStationIntegrationId | integer | Yes |  | No | No |
| ReevIntegrationId | integer | Yes |  | No | No |
| JivoIntegrationId | integer | Yes |  | No | No |
| FirstStepsCompleted | boolean | No |  | No | No |
| MultiFactorAuthenticationTypeId | integer | Yes |  | No | No |
| MultiFactorAuthenticationExpirationSeconds | integer | Yes |  | No | No |
| HostSetId | integer | Yes |  | No | No |
| AutomationUserId | integer | Yes |  | No | No |
| HasStrongPassword | boolean | Yes |  | No | No |
| WhiteLabel | boolean | Yes |  | No | No |
| WhiteLabelBrandColor | string | Yes |  | No | No |
| WhiteLabelDarkColor | string | Yes |  | No | No |
| WhiteLabelActionColor | string | Yes |  | No | No |
| WhiteLabelNeutralColor | string | Yes |  | No | No |
| WhiteLabelUseCustomLogo | boolean | Yes |  | No | No |
| WhiteLabelUrl | string | Yes |  | No | No |
| WhiteLabelLoginLogoUrl | string | Yes |  | No | No |
| WhiteLabelMenuLogoUrl | string | Yes |  | No | No |
| WhiteLabelIconLogoUrl | string | Yes |  | No | No |
| WhiteLabelAutomaticEmailLogoUrl | string | Yes |  | No | No |
| WhiteLabelAutomaticEmailSenderName | string | Yes |  | No | No |
| WhiteLabelAutomaticEmailSenderEmail | string | Yes |  | No | No |
| WhiteLabelFirstPasswordEmailSubject | string | Yes |  | No | No |
| WhiteLabelFirstPasswordEmailBody | string | Yes |  | No | No |
| WhiteLabelEdit | boolean | Yes |  | No | No |
| IsResellerCustomer | boolean | Yes |  | No | No |
| WhatsAppExtension | boolean | Yes |  | No | No |
| UsersOnlineModule | boolean | Yes |  | No | No |
| ChatModule | boolean | Yes |  | No | No |
| AkitaModule | boolean | Yes |  | No | No |
| AkitaPublicKey | string | Yes |  | No | No |
| IntercomModule | boolean | Yes |  | No | No |
| IntercomPublicKey | string | Yes |  | No | No |
| EmailIntegrationSmtpSaveInboxCopy | boolean | Yes |  | No | No |
| SSO | boolean | Yes |  | No | No |
| SSOTypeId | integer | Yes |  | No | No |
| SAMLIdentifier | string | Yes |  | No | No |
| SAMLLoginUrl | string | Yes |  | No | No |
| SAMLLogoutUrl | string | Yes |  | No | No |
| SAMLCertificateUrl | string | Yes |  | No | No |
| SAMLMetadataUrl | string | Yes |  | No | No |
| SAMLSignatureTypeId | integer | Yes |  | No | No |
| FirstLoginTypeId | integer | Yes |  | No | No |
| DisableQuotesExternalComments | boolean | Yes |  | No | No |
| DisableOrdersExternalComments | boolean | Yes |  | No | No |
| DisableDocumentsExternalComments | boolean | Yes |  | No | No |
| QuotesHideExternalAcceptButtons | boolean | Yes |  | No | No |
| OrdersHideExternalAcceptButtons | boolean | Yes |  | No | No |
| DocumentsHideExternalAcceptButtons | boolean | Yes |  | No | No |
| QuotesHideExternalReopenButton | boolean | Yes |  | No | No |
| OrdersHideExternalReopenButton | boolean | Yes |  | No | No |
| DocumentsHideExternalReopenButton | boolean | Yes |  | No | No |
| MaxAttachmentsGBSizePerUser | integer | No |  | No | No |
| MaxDepthFoldersPerBaseFolder | integer | Yes |  | No | No |
| MaxUploadFileSizeInMB | integer | Yes |  | No | No |
| OldFieldValueUpdate | boolean | Yes |  | No | No |
| HasPasswordExpiredConfig | boolean | Yes |  | No | No |
| DaysToExpirePassword | integer | Yes |  | No | No |
| DaysToNotifyPassword | integer | Yes |  | No | No |
| PasswordQuantitiesLimit | integer | Yes |  | No | No |
| AccountModelId | integer | Yes |  | No | No |
| Ghost | boolean | Yes |  | No | No |
| TimeZone | string | Yes |  | No | No |
| UseOnlyExternalLogin | boolean | Yes |  | No | No |
| SankhyaIntegrationModule | boolean | Yes |  | No | No |
| SankhyaSandboxIntegrationModule | boolean | Yes |  | No | No |
| ModuleId | integer | Yes |  | No | No |
| AutomationsCreateLimit | integer | Yes |  | No | No |
| PipelineAutomationsCreateLimit | integer | Yes |  | No | No |
| UsersNoLoginCreateLimit | integer | No |  | No | No |
| ShouldUseNewHtmlGenerator | boolean | Yes |  | No | No |
| WhiteLabelName | string | Yes |  | No | No |
| AllowAutomationsEdition | boolean | Yes |  | No | No |
| HasCheckInCheckOut | boolean | Yes |  | No | No |
| CheckInCheckOutRange | integer | Yes |  | No | No |
| NeppoIntegrationModule | boolean | Yes |  | No | No |
| OmieIntegrationModule | boolean | Yes |  | No | No |
| DefaultMaskCountryId | integer | Yes |  | No | No |
| PlooStoreModule | boolean | Yes |  | No | No |
| QuotesProductsUseModal | boolean | Yes |  | No | No |
| OrdersProductsUseModal | boolean | Yes |  | No | No |
| DocumentProductsUseModal | boolean | Yes |  | No | No |
| RestrictTask | boolean | Yes |  | No | No |
| MicrosoftSSOModule | boolean | Yes |  | No | No |
| AggregatorFieldsLimit | integer | No |  | No | No |
| LastUpdateDate | datetime | Yes |  | No | No |
| MaxWordsPerFileInRag | integer | No |  | No | No |
| MaxFilesPerRagFolder | integer | No |  | No | No |
| RagFileLimitFactor | integer | No |  | No | No |
| DailyAIChatCreditsPerUser | integer | No |  | No | No |
| ReportsProModule | boolean | No |  | No | No |
| MaxReportsPanels | integer | No |  | No | No |
| MaxReportsChartsPerPanel | integer | No |  | No | No |
| IdentityProvider | IdentityProviderEnum | No |  | No | No |


**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| City | City (nullable) | No | account_city | Yes | Yes |
| Currency | Currency (nullable) | No |  | No | No |
| DealsModuleIcon | Icon (nullable) | No |  | No | No |
| DealsModuleGender | Gender (nullable) | No |  | No | No |
| ContactsProductsModuleIcon | Icon | No |  | No | No |
| ContactsProductsModuleGender | Gender | No |  | No | No |
| DealsPipelinesModuleGender | Gender | No |  | No | No |
| PipelineUserUsability | DealPipelineUserUsability | No |  | No | No |
| QuoteTemplateUserUsability | DocumentTemplateUserUsability | No |  | No | No |
| OrderTemplateUserUsability | DocumentTemplateUserUsability | No |  | No | No |
| DocumentTemplateUserUsability | DocumentTemplateUserUsability | No |  | No | No |
| LibraryModuleIcon | Icon | No |  | No | No |
| LibraryModuleGender | Gender | No |  | No | No |
| AttachmentCollectionsModuleGender | Gender | No |  | No | No |
| TotalVoiceIntegration | AccountTotalVoiceIntegration | No |  | No | No |
| MailChimpIntegration | AccountMailChimpIntegration | No |  | No | No |
| RDStationIntegration | AccountRDStationIntegration | No |  | No | No |
| ReevIntegration | AccountReevIntegration | No |  | No | No |
| JivoIntegration | AccountJivoIntegration | No |  | No | No |
| OtherProperties | Collection(AccountFieldValue) | Yes |  | No | No |
| MultiFactorAuthenticationType | AccountMultiFactorAuthenticationType | No |  | No | No |
| HostSet | HostSet | No |  | No | No |
| SSOType | AccountSSOType | No |  | No | No |
| SAMLSignatureType | AccountSAMLSignatureType | No |  | No | No |
| FirstLoginType | AccountFirstLoginType | No |  | No | No |
| AttachmentsItems | Collection(AttachmentItemRelation) | Yes |  | No | No |
| Module | AccountModule | No |  | No | No |

---

### AccountFirstLoginType


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| Name | string | Yes |  | No | No |

---


### AccountIntegration


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| IntegrationId | integer | Yes |  | No | No |
| Key | string | Yes |  | No | No |
| IntegrationUserId | integer | Yes |  | No | No |
| Enabled | boolean | No |  | No | No |
| StatusId | integer | Yes |  | No | No |
| Authorized | boolean | No |  | No | No |
| CreatorId | integer | Yes |  | No | No |
| CreateDate | datetime | No |  | No | No |
| UpdaterId | integer | Yes |  | No | No |
| UpdateDate | datetime | Yes |  | No | No |

**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Integration | Integration | No |  | No | No |
| Status | AccountIntegrationStatus | No |  | No | No |
| FieldValues | Collection(AccountIntegrationFieldValue) | Yes |  | No | No |
| Webhooks | Collection(AccountIntegrationWebhook) | Yes |  | No | No |
| MappedFields | Collection(AccountIntegrationMappedField) | Yes |  | No | No |
| DynamicMappedFields | Collection(AccountIntegrationDynamicMappedField) | Yes |  | No | No |
| CustomFields | Collection(AccountIntegrationCustomField) | Yes |  | No | No |

---


### AccountJivoIntegration


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| Enabled | boolean | No |  | No | No |
| IntegrationUserId | integer | No |  | No | No |
| BehaviorId | integer | Yes |  | No | No |
| DealStageId | integer | Yes |  | No | No |

**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Behavior | AccountJivoIntegrationBehavior | No |  | No | No |
| DealStage | DealStage | No |  | No | No |

---


### AccountMailChimpIntegration


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| ApiUrl | string | Yes |  | No | No |

---


### AccountModule


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| WorkflowModule | AccountModuleStatusEnum | No |  | No | No |
| PublicFormModule | AccountModuleStatusEnum | No |  | No | No |
| AutomationDocumentsModule | AccountModuleStatusEnum | No |  | No | No |
| DocumentModule | AccountModuleStatusEnum | No |  | No | No |
| QuoteModule | AccountModuleStatusEnum | No |  | No | No |
| OrderModule | AccountModuleStatusEnum | No |  | No | No |
| CPQModule | AccountModuleStatusEnum | No |  | No | No |
| AnalyticsModule | AccountModuleStatusEnum | No |  | No | No |
| ContactProductModule | AccountModuleStatusEnum | No |  | No | No |
| LibraryModule | AccountModuleStatusEnum | No |  | No | No |
| APIModule | AccountModuleStatusEnum | No |  | No | No |
| WhiteLabelModule | AccountModuleStatusEnum | No |  | No | No |
| ProductsModule | AccountModuleStatusEnum | No |  | No | No |
| DealsModule | AccountModuleStatusEnum | No |  | No | No |
| RagModule | AccountModuleStatusEnum | No |  | No | No |
| MeetingTranscriptionModule | AccountModuleStatusEnum | No |  | No | No |

**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| UserPermissions | Collection(AccountModuleUserPermission) | Yes |  | No | No |

---


### AccountMultiFactorAuthenticationType


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| Name | string | Yes |  | No | No |

---


### AccountRDStationIntegration


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| Enabled | boolean | No |  | No | No |
| BehaviorId | integer | Yes |  | No | No |
| DealStageId | integer | Yes |  | No | No |
| CompanyTag | boolean | No |  | No | No |
| PersonTag | boolean | No |  | No | No |
| DealTag | boolean | No |  | No | No |
| SendPersons | boolean | No |  | No | No |
| LastSyncDate | datetime | Yes |  | No | No |

**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Behavior | AccountRDStationIntegrationBehavior | No |  | No | No |
| DealStage | DealStage | No |  | No | No |

---


### AccountReevIntegration


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| Enabled | boolean | No |  | No | No |
| IntegrationUserId | integer | No |  | No | No |
| BehaviorId | integer | Yes |  | No | No |
| DealStageId | integer | Yes |  | No | No |
| CompanyTag | boolean | No |  | No | No |
| PersonTag | boolean | No |  | No | No |
| DealTag | boolean | No |  | No | No |
| LeadTag | boolean | No |  | No | No |
| WonDealWebhookId | integer | Yes |  | No | No |

**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Behavior | AccountReevIntegrationBehavior | No |  | No | No |
| DealStage | DealStage | No |  | No | No |

---


### AccountSAMLSignatureType


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| Name | string | Yes |  | No | No |

---


### AccountSSOType


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| Name | string | Yes |  | No | No |

---


### AccountTotalVoiceIntegration


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| Email | string | Yes |  | No | No |
| InteractionRecordTypeId | integer | Yes |  | No | No |
| CreateUserBranch | boolean | Yes |  | No | No |

**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| InteractionRecord | TaskType | No |  | No | No |
| Users | Collection(AccountTotalVoiceIntegrationUser) | Yes |  | No | No |

---
