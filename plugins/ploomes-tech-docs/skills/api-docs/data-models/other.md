# Other — Data Models

Data models for the Other domain.

### Column Reference

Each property table includes the following columns:

| Column | Description |
|--------|-------------|
| **FieldKey** | The key used to reference this property in the Fields system (see [Fields & Entities](../07-fields-and-entities.md)). Empty if the property is not exposed as a field. |
| **Creatable** | **Yes** = can be set on `POST` (create). **No** = cannot be set on create; managed by the system. |
| **Editable** | **Yes** = can be set on `PATCH` (edit). **No** = cannot be set on edit; managed by the system. |

> **Note on Required vs Nullable**: If a field is not Required and is not Nullable, you may omit it from the payload (the API will set a default value), but you may not send it as `null`.

---

### Button


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| Name | string | Yes |  | No | No |
| Class | string | Yes |  | No | No |


---

### City


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| Name | string | Yes | city_name | Yes | Yes |
| CountryId | integer | Yes | city_country | Yes | Yes |
| StateId | integer | Yes | city_state | Yes | No |
| IBGECode | integer | Yes | city_ibge_code | Yes | Yes |
| LastUpdateDate | datetime | Yes |  | No | No |
| Editable | boolean | No |  | No | No |
| Latitude | string | Yes |  | No | No |
| Longitude | string | Yes |  | No | No |


**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Country | Country (nullable) | No | city_country | Yes | Yes |
| State | CountryState (nullable) | No | city_state | Yes | No |

---

### Comment


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| TaskId | integer | Yes |  | No | No |
| QuoteId | integer | Yes |  | No | No |
| OrderId | integer | Yes |  | No | No |
| MessageId | integer | Yes |  | No | No |
| InteractionRecordId | integer | Yes |  | No | No |
| DocumentId | integer | Yes |  | No | No |
| CreatorId | integer | Yes |  | No | No |
| CreateDate | datetime | No |  | No | No |
| Content | string | Yes |  | No | No |
| Editable | boolean | No |  | No | No |


**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Task | Task | No |  | No | No |
| Quote | Quote | No |  | No | No |
| Order | Order | No |  | No | No |
| Messsage | Message | No |  | No | No |
| InteractionRecord | InteractionRecord | No |  | No | No |
| Document | Document | No |  | No | No |
| Creator | User | No |  | No | No |
| NotifiedUsers | Collection(UserNotification) | Yes |  | No | No |

---

### Currency


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| Symbol | string | Yes | currency_symbol | Yes | Yes |
| Code | string | Yes | currency_code | Yes | Yes |
| Editable | boolean | No |  | No | No |
| LastUpdateDate | datetime | Yes |  | No | No |


---

### Department


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| Name | string | Yes | department_name | Yes | Yes |
| LastUpdateDate | datetime | Yes |  | No | No |


---

### Gender


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| Name | string | Yes |  | No | No |


---

### GeneralSearch

`/GeneralSearch` returns **`GeneralSearchView`**, whose properties include
`EntityId`, `ItemId` and `StringSearch`. Read the shape from `$metadata`.

---

### Icon


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| Class | string | Yes |  | No | No |


---

### Image


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| FileName | string | Yes |  | No | No |
| ContentType | string | Yes |  | No | No |
| CreateDate | datetime | No |  | No | No |
| Url | string | Yes |  | No | No |
| ThumbUrl | string | Yes |  | No | No |
| Editable | boolean | No |  | No | No |


---

### IntervalUnit


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| Name | string | Yes |  | No | No |
| Datepart | string | Yes |  | No | No |


---

### Language


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| Key | string | Yes |  | No | No |
| Name | string | Yes |  | No | No |


---

### Operation


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| Name | string | Yes |  | No | No |
| Identifier | string | Yes |  | No | No |


---

### Phone


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| Name | string | Yes |  | No | No |


---

### RelatedPerson


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| Name | string | Yes |  | No | No |


---

### Role


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| Name | string | Yes | role_name | Yes | Yes |
| LastUpdateDate | datetime | Yes |  | No | No |


---

### Selector


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| Name | string | Yes |  | No | No |


---

### Timeline


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| Name | string | Yes |  | No | No |
| Icon | string | Yes |  | No | No |
| Color | string | Yes |  | No | No |


---

### Word


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| MaleValue | string | Yes |  | No | No |
| FemaleValue | string | Yes |  | No | No |
| PluralMaleValue | string | Yes |  | No | No |
| PluralFemaleValue | string | Yes |  | No | No |


---


### AccumulatorField


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| FieldId | integer | No |  | No | No |
| GroupByFieldId | integer | No |  | No | No |
| SourceEntityId | integer | No |  | No | No |
| TargetEntityId | integer | No |  | No | No |
| TargetContactTypeId | integer | Yes |  | No | No |
| OperationId | integer | No |  | No | No |
| TargetFieldId | integer | Yes |  | No | No |
| FilterId | integer | Yes |  | No | No |
| StartDate | datetime | Yes |  | No | No |
| EndDate | datetime | Yes |  | No | No |
| DateFieldId | integer | Yes |  | No | No |
| ODataUrl | string | Yes |  | No | No |
| RelativeDateIdentifier | string | Yes |  | No | No |
| LastSyncDate | datetime | Yes |  | No | No |
| ExecutingSync | boolean | Yes |  | No | No |
| SourceFieldTypeId | integer | Yes |  | No | No |

---

