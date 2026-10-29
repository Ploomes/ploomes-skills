# Integration — Data Models

Data models for the Integration domain.

### Column Reference

Each property table includes the following columns:

| Column | Description |
|--------|-------------|
| **FieldKey** | The key used to reference this property in the Fields system (see [Fields & Entities](../07-fields-and-entities.md)). Empty if the property is not exposed as a field. |
| **Creatable** | **Yes** = can be set on `POST` (create). **No** = cannot be set on create; managed by the system. |
| **Editable** | **Yes** = can be set on `PATCH` (edit). **No** = cannot be set on edit; managed by the system. |

> **Note on Required vs Nullable**: If a field is not Required and is not Nullable, you may omit it from the payload (the API will set a default value), but you may not send it as `null`.

---

### Integration


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| Name | string | Yes |  | No | No |
| Key | string | Yes |  | No | No |
| Description | string | Yes |  | No | No |
| ImageUrl | string | Yes |  | No | No |
| BaseUrl | string | Yes |  | No | No |
| IntegrationUserAvatarUrl | string | Yes |  | No | No |
| RedirectUrl | string | Yes |  | No | No |
| ProfileConfigurable | boolean | Yes |  | No | No |


**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Fields | Collection(IntegrationField) | Yes |  | No | No |
| CustomFields | Collection(IntegrationCustomField) | Yes |  | No | No |
| MappedFields | Collection(IntegrationMappedField) | Yes |  | No | No |
| Webhooks | Collection(IntegrationWebhook) | Yes |  | No | No |
| Callbacks | Collection(IntegrationCallback) | Yes |  | No | No |
| Types | Collection(IntegrationType) | Yes |  | No | No |
| DynamicMapEntities | Collection(IntegrationDynamicMapEntity) | Yes |  | No | No |
| FixedDynamicMappedFields | Collection(IntegrationFixedDynamicMappedField) | Yes |  | No | No |
| Buttons | Collection(IntegrationButton) | Yes |  | No | No |

---


### IntegrationButton


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| IntegrationId | integer | Yes |  | No | No |
| UrlWebhook | string | Yes |  | No | No |
| Color | string | Yes |  | No | No |
| Ordination | integer | Yes |  | No | No |
| IconId | integer | Yes |  | No | No |
| Name | string | Yes |  | No | No |
| Description | string | Yes |  | No | No |

**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Integration | Integration | No |  | No | No |
| Icon | Icon | No |  | No | No |

---


### IntegrationCallback


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| IntegrationId | integer | Yes |  | No | No |
| Description | string | Yes |  | No | No |
| EndpointUrl | string | Yes |  | No | No |
| Dynamic | boolean | Yes |  | No | No |

**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Integration | Integration | No |  | No | No |

---


### IntegrationCustomField


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| IntegrationId | integer | Yes |  | No | No |
| Name | string | Yes |  | No | No |
| Key | string | Yes |  | No | No |
| EntityId | integer | Yes |  | No | No |
| TypeId | integer | Yes |  | No | No |
| Multiple | boolean | No |  | No | No |
| SecondaryEntityId | integer | Yes |  | No | No |
| Disabled | boolean | Yes |  | No | No |
| FormHidden | boolean | Yes |  | No | No |
| Restricted | boolean | Yes |  | No | No |

**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Integration | Integration | No |  | No | No |
| Entity | FieldEntity | No |  | No | No |
| Type | FieldType | No |  | No | No |
| Options | Collection(IntegrationCustomFieldOption) | Yes |  | No | No |

---


### IntegrationDynamicMapEntity


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| IntegrationId | integer | Yes |  | No | No |
| EntityId | integer | Yes |  | No | No |
| Ordination | integer | Yes |  | No | No |
| Name | string | Yes |  | No | No |
| EntityName | string | Yes |  | No | No |
| DependentFieldId | integer | Yes |  | No | No |

**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Integration | Integration | No |  | No | No |
| Entity | FieldEntity | No |  | No | No |
| DependentFieldValues | Collection(IntegrationDynamicMapEntitiesDependentFieldValues) | Yes |  | No | No |
| FixedDynamicMappedFields | Collection(IntegrationFixedDynamicMappedField) | Yes |  | No | No |

---


### IntegrationField


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| IntegrationId | integer | Yes |  | No | No |
| Name | string | Yes |  | No | No |
| Key | string | Yes |  | No | No |
| Required | boolean | No |  | No | No |
| Multiple | boolean | No |  | No | No |
| Hidden | boolean | No |  | No | No |
| AutoSave | boolean | No |  | No | No |
| TypeId | integer | Yes |  | No | No |
| SecondaryEntityId | integer | Yes |  | No | No |
| OptionsTableId | integer | Yes |  | No | No |
| CallbackHubActionName | string | Yes |  | No | No |
| DependentFieldId | integer | Yes |  | No | No |
| DependentAuthorized | boolean | No |  | No | No |
| MaxValue | integer | Yes |  | No | No |
| Restricted | boolean | Yes |  | No | No |
| Tooltip | string | Yes |  | No | No |
| QueryDependentFieldId | integer | Yes |  | No | No |
| QueryDependentFieldProp | string | Yes |  | No | No |

**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Integration | Integration | No |  | No | No |
| Type | FieldType | No |  | No | No |
| SecondaryEntity | FieldEntity | No |  | No | No |
| OptionsTable | IntegrationFieldOptionsTable | No |  | No | No |
| DependentFieldValues | Collection(IntegrationFieldDependentFieldValue) | Yes |  | No | No |
| DependentStatus | Collection(IntegrationFieldDependentStatus) | Yes |  | No | No |

---


### IntegrationFixedDynamicMappedField


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| IntegrationId | integer | Yes |  | No | No |
| EntityId | integer | Yes |  | No | No |
| FieldKey | string | Yes |  | No | No |
| ExternalFieldKey | string | Yes |  | No | No |
| ExternalFieldName | string | Yes |  | No | No |
| DynamicMapEntityId | integer | Yes |  | No | No |
| MappingDirectionId | integer | Yes |  | No | No |
| CustomFieldId | integer | Yes |  | No | No |

**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Integration | Integration | No |  | No | No |
| Entity | FieldEntity | No |  | No | No |
| Field | Field | No |  | No | No |
| DynamicMapEntity | IntegrationDynamicMapEntity | No |  | No | No |

---


### IntegrationMappedField


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| IntegrationId | integer | Yes |  | No | No |
| Name | string | Yes |  | No | No |
| Key | string | Yes |  | No | No |
| TypeId | integer | Yes |  | No | No |
| EntityId | integer | Yes |  | No | No |
| Required | boolean | No |  | No | No |
| DependentFieldId | integer | Yes |  | No | No |

**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Integration | Integration | No |  | No | No |
| Type | FieldType | No |  | No | No |
| Entity | FieldEntity | No |  | No | No |
| Options | Collection(IntegrationMappedFieldOption) | Yes |  | No | No |
| DependentFieldValues | Collection(IntegrationMappedFieldDependentFieldValue) | Yes |  | No | No |

---


### IntegrationType


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| IntegrationId | integer | Yes |  | No | No |
| TypeId | integer | Yes |  | No | No |

**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Integration | Integration | No |  | No | No |
| Type | IntegrationTypeType | No |  | No | No |

---


### IntegrationWebhook


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| IntegrationId | integer | Yes |  | No | No |
| EntityId | integer | Yes |  | No | No |
| SecondaryEntityId | integer | Yes |  | No | No |
| ActionId | integer | Yes |  | No | No |
| CallbackUrl | string | Yes |  | No | No |
| UserWebhook | boolean | No |  | No | No |

**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Integration | Integration | No |  | No | No |
| Entity | FieldEntity | No |  | No | No |
| SecondaryEntity | FieldEntity | No |  | No | No |
| Action | WebhookAction | No |  | No | No |

---

