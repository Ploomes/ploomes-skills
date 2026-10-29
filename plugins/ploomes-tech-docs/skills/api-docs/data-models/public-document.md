# PublicDocument — Data Models

Data models for the PublicDocument domain.

### Column Reference

Each property table includes the following columns:

| Column | Description |
|--------|-------------|
| **FieldKey** | The key used to reference this property in the Fields system (see [Fields & Entities](../07-fields-and-entities.md)). Empty if the property is not exposed as a field. |
| **Creatable** | **Yes** = can be set on `POST` (create). **No** = cannot be set on create; managed by the system. |
| **Editable** | **Yes** = can be set on `PATCH` (edit). **No** = cannot be set on edit; managed by the system. |

> **Note on Required vs Nullable**: If a field is not Required and is not Nullable, you may omit it from the payload (the API will set a default value), but you may not send it as `null`.

---

### PublicDocument


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| Name | string | Yes |  | No | No |
| ContactName | string | Yes |  | No | No |
| CreatorName | string | Yes |  | No | No |
| DocumentNumber | integer | Yes |  | No | No |
| Key | string | Yes |  | No | No |
| ExternallyAccepted | boolean | Yes |  | No | No |
| HasPaging | boolean | Yes |  | No | No |
| FileName | string | Yes |  | No | No |
| DocumentUrl | string | Yes |  | No | No |
| AccountFolderName | string | Yes |  | No | No |
| WhiteLabel | boolean | Yes |  | No | No |
| DisableDocumentsExternalComments | boolean | Yes |  | No | No |
| HideExternalAcceptButtons | boolean | Yes |  | No | No |
| HideExternalReopenButton | boolean | Yes |  | No | No |


**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Pages | Collection(PublicDocumentPage) | Yes |  | No | No |
| ExternalComments | Collection(PublicDocumentExternalComment) | Yes |  | No | No |

---


### PublicDocumentExternalComment


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| DocumentId | integer | Yes |  | No | No |
| CreatorName | string | Yes |  | No | No |
| CreatorAvatarUrl | string | Yes |  | No | No |
| CreateDate | datetime | No |  | No | No |
| Content | string | Yes |  | No | No |
| DisableDocumentsExternalComments | boolean | Yes |  | No | No |

**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Document | PublicDocument | No |  | No | No |

---


### PublicDocumentPage


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| QuoteId | integer | Yes |  | No | No |
| OrderId | integer | Yes |  | No | No |
| DocumentId | integer | Yes |  | No | No |
| BodySourceCode | string | Yes |  | No | No |
| HeaderSourceCode | string | Yes |  | No | No |
| HeaderHeight | integer | Yes |  | No | No |
| FooterSourceCode | string | Yes |  | No | No |
| FooterHeight | integer | Yes |  | No | No |
| SideMargin | integer | Yes |  | No | No |
| TopMargin | integer | Yes |  | No | No |
| BottomMargin | integer | Yes |  | No | No |
| Ordination | integer | Yes |  | No | No |

**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Quote | PublicQuote | No |  | No | No |
| Order | PublicOrder | No |  | No | No |
| Document | PublicDocument | No |  | No | No |

---

