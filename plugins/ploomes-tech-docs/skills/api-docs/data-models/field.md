# Field — Data Models

Data models for the Field domain.

### Column Reference

Each property table includes the following columns:

| Column | Description |
|--------|-------------|
| **FieldKey** | The key used to reference this property in the Fields system (see [Fields & Entities](../07-fields-and-entities.md)). Empty if the property is not exposed as a field. |
| **Creatable** | **Yes** = can be set on `POST` (create). **No** = cannot be set on create; managed by the system. |
| **Editable** | **Yes** = can be set on `PATCH` (edit). **No** = cannot be set on edit; managed by the system. |

> **Note on Required vs Nullable**: If a field is not Required and is not Nullable, you may omit it from the payload (the API will set a default value), but you may not send it as `null`.

---

### Field


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| Key | string | Yes |  | No | No |
| Dynamic | boolean | No |  | No | No |
| Name | string | Yes | field_name | No | Yes |
| EntityId | integer | Yes | field_entity | No | No |
| SecondaryEntityId | integer | Yes |  | No | No |
| TypeId | integer | Yes |  | No | No |
| OptionsTableId | integer | Yes |  | No | No |
| Multiple | boolean | No |  | No | No |
| Required | boolean | No |  | No | No |
| NotNullable | boolean | No |  | No | No |
| Permanent | boolean | No |  | No | No |
| Unique | boolean | No |  | No | No |
| Disabled | boolean | No |  | No | No |
| FormHidden | boolean | No |  | No | No |
| Hidden | boolean | No |  | No | No |
| Integration | boolean | No |  | No | No |
| Filterable | boolean | No |  | No | No |
| FormFilterable | boolean | No |  | No | No |
| Wide | boolean | No |  | No | No |
| InternalFormula | string | Yes |  | No | No |
| FieldHideFormula | string | Yes |  | No | No |
| FieldDisableFormula | string | Yes |  | No | No |
| ExternalFormulaUrl | string | Yes |  | No | No |
| ExternalFormulaMethod | string | Yes |  | No | No |
| ExternalFormulaHeaders | string | Yes |  | No | No |
| ExternalFormulaRequestBody | string | Yes |  | No | No |
| DefaultStringValue | string | Yes |  | No | No |
| DefaultBigStringValue | string | Yes |  | No | No |
| DefaultIntegerValue | integer | Yes |  | No | No |
| DefaultDecimalValue | number | Yes |  | No | No |
| DefaultDateTimeValue | datetime | Yes |  | No | No |
| DefaultBoolValue | boolean | Yes |  | No | No |
| OriginFieldKey | string | Yes |  | No | No |
| OriginFieldFieldPathId | integer | Yes |  | No | No |
| ApiUrl | string | Yes |  | No | No |
| FilterId | integer | Yes |  | No | No |
| GeneratedFormula | boolean | No |  | No | No |
| ProductGroupId | integer | Yes |  | No | No |
| ProductFamilyId | integer | Yes |  | No | No |
| IsSensitiveData | boolean | Yes |  | No | No |
| InversePropertyFieldKey | string | Yes |  | No | No |
| SendExternalKey | string | Yes |  | No | No |
| ReceiveExternalKey | string | Yes |  | No | No |
| EnableFormatting | boolean | Yes |  | No | No |
| RemoveFieldHeightLimit | boolean | No |  | No | No |
| LastUpdateDate | datetime | No |  | No | No |
| Configurable | boolean | No |  | No | No |
| FieldDescription | string | No |  | No | No |
| AggregatorConfigId | integer | Yes |  | No | No |
| GoogleSheetsIntegrationId | integer | Yes |  | No | No |
| IntegrationCustomFieldId | integer | Yes |  | No | No |
| StringLength | integer | Yes |  | No | No |

**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Entity | FieldEntity | No | field_entity | No | No |
| SecondaryEntity | FieldEntity | No |  | No | No |
| Type | FieldType | No |  | No | No |
| OptionsTable | FieldOptionsTable | No |  | No | No |
| OriginField | Field | No |  | No | No |
| OriginFieldFieldPath | FieldEntityPath | No |  | No | No |
| Filter | Filter | No |  | No | No |
| ProductGroup | ProductGroup | No |  | No | No |
| ProductFamily | ProductFamily | No |  | No | No |
| GoogleSheetsIntegration | FieldGoogleSheetsIntegration | No |  | No | No |
| IntegrationCustomField | IntegrationCustomField | No |  | No | No |
| AggregatorConfig | AccumulatorField | No |  | No | No |
| FormulaVariables | Collection(FieldFormulaVariable) | Yes |  | Yes | Yes |
| ExternalFormulaResponsePaths | Collection(FieldResponsePath) | Yes |  | Yes | Yes |
| ExternalFormulaMappedFields | Collection(FieldMappedField) | Yes |  | Yes | Yes |
| AllowedUsers | Collection(FieldAllowedUser) | Yes |  | No | No |
| AllowedTeams | Collection(FieldAllowedTeam) | Yes |  | No | No |
| AllowedUserProfiles | Collection(FieldAllowedUserProfile) | Yes |  | No | No |
| ExhibitionAllowedUsers | Collection(FieldExhibitionAllowedUser) | Yes |  | No | No |
| ExhibitionAllowedTeams | Collection(FieldExhibitionAllowedTeam) | Yes |  | No | No |
| ExhibitionAllowedUserProfiles | Collection(FieldExhibitionAllowedUserProfile) | Yes |  | No | No |
| Languages | Collection(FieldLanguage) | Yes |  | No | No |

> **A collection in a `PATCH` body needs `Key`, and replaces the whole collection.**
> `FormulaVariables`, `ExternalFormulaResponsePaths` and `ExternalFormulaMappedFields`
> sent without `Key` in the same body answer `200` and are ignored — a re-read shows
> the old state. With `Key` present they are written as a full substitution. When a new
> formula references a new placeholder, the variable must travel in the same body as
> the formula. All three can also be set in a single `POST /Fields`.

---

### FieldEntity

| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| Name | string | Yes | entity_name | No | No |
| ApiUrl | string | Yes |  | No | No |
| DefaultPropertyName | string | Yes |  | No | No |
| DisplayPropertyName | string | Yes |  | No | No |
| Icon | string | Yes |  | No | No |
| Importable | boolean | No |  | No | No |
| QuickFormId | integer | Yes |  | No | No |
| SingularUnitName | string | Yes |  | No | No |
| PluralUnitName | string | Yes |  | No | No |
| GenderId | integer | Yes |  | No | No |
| IsSystemEntity | boolean | Yes |  | No | No |
| IsOwnerPermission | boolean | Yes |  | No | No |
| IsIndividualPermission | boolean | Yes |  | No | No |
| IsAccountDataSet | boolean | Yes |  | No | No |
| IsAllowedToUseInFields | boolean | Yes |  | No | No |

**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| QuickForm | Form | No |  | No | No |
| Gender | Gender | No |  | No | No |
| Forms | Collection(Form) | Yes |  | No | No |
| Paths | Collection(FieldEntityPath) | Yes |  | No | No |

---

### FieldType

| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| Name | string | Yes |  | No | No |
| NativeType | string | Yes |  | No | No |
| Icon | string | Yes |  | No | No |
| Listable | boolean | No |  | No | No |
| Multipliable | boolean | No |  | No | No |
| StandardFormat | string | Yes |  | No | No |

**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| AllowedOperations | Collection(FieldTypeOperation) | Yes |  | No | No |

---

### AccountIntegrationFieldMapping

| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| AccountIntegrationId | integer | Yes |  | No | No |
| CustomFieldId | integer | Yes |  | No | No |
| FieldKey | string | Yes |  | No | No |
| FieldId | integer | Yes |  | No | No |

**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| AccountIntegration | AccountIntegration | No |  | No | No |
| CustomField | IntegrationCustomField | No |  | No | No |
| Field | Field | No |  | No | No |

---


### FieldAllowedTeam


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| FieldKey | string | Yes |  | No | No |
| TeamId | integer | Yes |  | No | No |

**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Field | Field | No |  | No | No |
| Team | Team | No |  | No | No |

---


### FieldAllowedUser


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| FieldKey | string | Yes |  | No | No |

**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Field | Field | No |  | No | No |
| User | User | No |  | No | No |

---


### FieldAllowedUserProfile


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| FieldKey | string | Yes |  | No | No |
| ProfileId | integer | Yes |  | No | No |

**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Field | Field | No |  | No | No |
| Profile | UserProfile | No |  | No | No |

---


### FieldEntityPath


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| EntityId | integer | Yes |  | No | No |
| DestinationEntityId | integer | Yes |  | No | No |
| Default | boolean | No |  | No | No |

**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Entity | FieldEntity | No |  | No | No |
| DestinationEntity | FieldEntity | No |  | No | No |
| Fields | Collection(FieldEntityPathField) | Yes |  | No | No |

---


### FieldExhibitionAllowedTeam


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| FieldKey | string | Yes |  | No | No |
| TeamId | integer | Yes |  | No | No |

**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Field | Field | No |  | No | No |
| Team | Team | No |  | No | No |

---


### FieldExhibitionAllowedUser


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| FieldKey | string | Yes |  | No | No |

**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Field | Field | No |  | No | No |
| User | User | No |  | No | No |

---


### FieldExhibitionAllowedUserProfile


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| FieldKey | string | Yes |  | No | No |
| ProfileId | integer | Yes |  | No | No |

**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Field | Field | No |  | No | No |
| Profile | UserProfile | No |  | No | No |

---


### FieldFormulaVariable


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| FieldKey | string | Yes |  | No | No |
| VariableName | string | Yes |  | No | No |
| VariableFieldKey | string | Yes |  | No | No |
| DefaultValue | string | Yes |  | No | No |
| Required | boolean | No |  | No | No |
| FieldPathId | integer | Yes |  | No | No |
| IsFieldHideVariable | boolean | Yes |  | No | No |
| IsFieldDisableVariable | boolean | Yes |  | No | No |
| VariableProperty | string | Yes |  | No | No |
| ClearFormulaResultOnEmpty | boolean | Yes |  | No | No |
| IsFieldStandardVariable | boolean | Yes |  | No | No |

**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Field | Field | No |  | No | No |
| VariableField | Field | No |  | No | No |
| FieldPath | FieldEntityPath | No |  | No | No |

---


### FieldGoogleSheetsIntegration


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| ServiceAccount | boolean | No |  | No | No |
| SpreadsheetId | string | Yes |  | No | No |
| SpreadsheetSheetName | string | Yes |  | No | No |

**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Variables | Collection(FieldGoogleSheetsIntegrationVariable) | Yes |  | No | No |

---


### FieldLanguage


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| FieldKey | string | Yes |  | No | No |
| LanguageId | integer | Yes |  | No | No |
| Name | string | Yes |  | No | No |
| FieldDescription | string | Yes |  | No | No |

**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Field | Field | No |  | No | No |

---


### FieldMappedField


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| FieldKey | string | Yes |  | No | No |
| MappedFieldKey | string | Yes |  | No | No |
| MappedFieldPathId | integer | Yes |  | No | No |
| Path | string | Yes |  | No | No |

**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Field | Field | No |  | No | No |
| MappedField | Field | No |  | No | No |
| MappedFieldPath | FieldEntityPath | No |  | No | No |

---


### FieldOptionsTable


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| Name | string | Yes |  | No | No |

**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Options | Collection(FieldOptionsTableOption) | Yes |  | No | No |

---


### FieldResponsePath


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| FieldKey | string | Yes |  | No | No |
| TypeId | integer | Yes |  | No | No |
| Path | string | Yes |  | No | No |

**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Field | Field | No |  | No | No |
| Type | FieldResponsePathType | No |  | No | No |

---


### FieldTypeOperation


**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| FieldType | FieldType | No |  | No | No |
| Operation | Operation | No |  | No | No |

---

