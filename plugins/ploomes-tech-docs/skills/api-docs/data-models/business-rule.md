# BusinessRule — Data Models

Data models for the BusinessRule domain.

### Column Reference

Each property table includes the following columns:

| Column | Description |
|--------|-------------|
| **FieldKey** | The key used to reference this property in the Fields system (see [Fields & Entities](../07-fields-and-entities.md)). Empty if the property is not exposed as a field. |
| **Creatable** | **Yes** = can be set on `POST` (create). **No** = cannot be set on create; managed by the system. |
| **Editable** | **Yes** = can be set on `PATCH` (edit). **No** = cannot be set on edit; managed by the system. |

> **Note on Required vs Nullable**: If a field is not Required and is not Nullable, you may omit it from the payload (the API will set a default value), but you may not send it as `null`.

---

### BusinessRule


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| Name | string | Yes |  | No | No |
| Description | string | Yes |  | No | No |
| EntityId | integer | Yes |  | No | No |
| ActionId | integer | Yes |  | No | No |
| Ordination | integer | Yes |  | No | No |
| LastUpdateDate | datetime | Yes |  | No | No |


**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Entity | FieldEntity | No |  | No | No |
| Action | BusinessRuleAction | No |  | No | No |
| Fields | Collection(BusinessRuleField) | Yes |  | No | No |
| ApprovalLevels | Collection(BusinessRuleApprovalLevel) | Yes |  | No | No |
| SendEmailUsers | Collection(BusinessRuleFilterSendEmail) | Yes |  | No | No |
| MessageVariables | Collection(BusinessRuleMessageVariable) | Yes |  | No | No |

---


### BusinessRuleAction


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| Name | string | Yes |  | No | No |

---


### BusinessRuleApprovalLevel


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| BusinessRuleId | integer | Yes |  | No | No |

**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| BusinessRule | BusinessRule | No |  | No | No |
| Users | Collection(BusinessRuleApprovalLevelUser) | Yes |  | No | No |

---


### BusinessRuleCustomMessageView


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Message | string | Yes |  | No | No |
| Fields | List<BusinessRuleCustomMessageFieldView> | No |  | No | No |

---


### BusinessRuleField


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| BusinessRuleId | integer | Yes |  | No | No |
| FieldKey | string | Yes |  | No | No |
| FieldPathId | integer | Yes |  | No | No |
| OperationId | integer | Yes |  | No | No |
| StringValue | string | Yes |  | No | No |
| BigStringValue | string | Yes |  | No | No |
| IntegerValue | integer | Yes |  | No | No |
| DecimalValue | number | Yes |  | No | No |
| DateTimeValue | datetime | Yes |  | No | No |
| BoolValue | boolean | Yes |  | No | No |
| ObjectValueName | string | Yes |  | No | No |
| EditorCustomMessageValue | string | Yes |  | No | No |
| ApproversCustomMessageValue | string | Yes |  | No | No |

**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| BusinessRule | BusinessRule | No |  | No | No |
| Field | Field | No |  | No | No |
| FieldPath | FieldEntityPath | No |  | No | No |
| Operation | Operation | No |  | No | No |
| Values | Collection(BusinessRulesFieldValue) | Yes |  | No | No |

---


### BusinessRuleFilterSendEmail


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |

**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| BusinessRule | BusinessRule | No |  | No | No |
| User | User | No |  | No | No |

---


### BusinessRuleMessageVariable


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| BusinessRuleId | integer | Yes |  | No | No |
| MessageType | integer | Yes |  | No | No |
| VariableName | string | Yes |  | No | No |
| FieldKey | string | Yes |  | No | No |
| FieldPathId | integer | Yes |  | No | No |
| Ordination | integer | Yes |  | No | No |
| CreateDate | datetime | Yes |  | No | No |
| UpdateDate | datetime | Yes |  | No | No |
| DeleteDate | datetime | Yes |  | No | No |

**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| BusinessRule | BusinessRule | No |  | No | No |
| Field | Field | No |  | No | No |
| FieldPath | FieldEntityPath | No |  | No | No |

---

