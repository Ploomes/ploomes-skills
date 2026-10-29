# Approval — Data Models

Data models for the Approval domain.

### Column Reference

Each property table includes the following columns:

| Column | Description |
|--------|-------------|
| **FieldKey** | The key used to reference this property in the Fields system (see [Fields & Entities](../07-fields-and-entities.md)). Empty if the property is not exposed as a field. |
| **Creatable** | **Yes** = can be set on `POST` (create). **No** = cannot be set on create; managed by the system. |
| **Editable** | **Yes** = can be set on `PATCH` (edit). **No** = cannot be set on edit; managed by the system. |

> **Note on Required vs Nullable**: If a field is not Required and is not Nullable, you may omit it from the payload (the API will set a default value), but you may not send it as `null`.

---

### Approval


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| QuoteId | integer | Yes |  | No | No |
| OrderId | integer | Yes |  | No | No |
| DocumentId | integer | Yes |  | No | No |
| BusinessRuleApprovalLevelId | integer | Yes |  | No | No |
| SendEmail | boolean | Yes |  | No | No |
| MobileNotificationPushed | boolean | Yes |  | No | No |


**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Quote | Quote | No |  | No | No |
| Order | Order | No |  | No | No |
| Document | Document | No |  | No | No |
| BusinessRuleApprovalLevel | BusinessRuleApprovalLevel | No |  | No | No |

---
