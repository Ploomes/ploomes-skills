# Webhook — Data Models

Data models for the Webhook domain.

### Column Reference

Each property table includes the following columns:

| Column | Description |
|--------|-------------|
| **FieldKey** | The key used to reference this property in the Fields system (see [Fields & Entities](../07-fields-and-entities.md)). Empty if the property is not exposed as a field. |
| **Creatable** | **Yes** = can be set on `POST` (create). **No** = cannot be set on create; managed by the system. |
| **Editable** | **Yes** = can be set on `PATCH` (edit). **No** = cannot be set on edit; managed by the system. |

> **Note on Required vs Nullable**: If a field is not Required and is not Nullable, you may omit it from the payload (the API will set a default value), but you may not send it as `null`.

---

### Webhook


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| EntityId | integer | Yes |  | No | No |
| SecondaryEntityId | integer | Yes |  | No | No |
| ActionId | integer | Yes |  | No | No |
| Name | string | Yes |  | No | No |
| CallbackUrl | string | Yes |  | No | No |
| CreateDate | datetime | No |  | No | No |
| Active | boolean | No |  | No | No |
| UserWebhook | boolean | No |  | No | No |
| IsNativeIntegration | boolean | No |  | No | No |


**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Entity | FieldEntity | No |  | No | No |
| SecondaryEntity | FieldEntity | No |  | No | No |
| Action | WebhookAction | No |  | No | No |

---


### WebhookAction


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| RestrictedEntityId | integer | Yes |  | No | No |
| Name | string | Yes | webhook_action_name | No | No |

**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| RestrictedEntity | FieldEntity | No |  | No | No |

---

