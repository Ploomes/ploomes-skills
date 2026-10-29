# DocumentTemplate — Data Models

Data models for the DocumentTemplate domain.

### Column Reference

Each property table includes the following columns:

| Column | Description |
|--------|-------------|
| **FieldKey** | The key used to reference this property in the Fields system (see [Fields & Entities](../07-fields-and-entities.md)). Empty if the property is not exposed as a field. |
| **Creatable** | **Yes** = can be set on `POST` (create). **No** = cannot be set on create; managed by the system. |
| **Editable** | **Yes** = can be set on `PATCH` (edit). **No** = cannot be set on edit; managed by the system. |

> **Note on Required vs Nullable**: If a field is not Required and is not Nullable, you may omit it from the payload (the API will set a default value), but you may not send it as `null`.

---

### DocumentTemplate


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| Name | string | Yes | document_template_name | Yes | Yes |
| EntityId | integer | Yes |  | No | No |
| SecondaryEntityId | integer | Yes |  | No | No |
| FormId | integer | Yes |  | No | No |
| Default | boolean | Yes |  | No | No |
| HeaderSourceCode | string | Yes |  | No | No |
| HeaderHeight | integer | Yes |  | No | No |
| FooterSourceCode | string | Yes |  | No | No |
| FooterHeight | integer | Yes |  | No | No |
| BodySourceCode | string | Yes |  | No | No |
| TopMargin | integer | Yes |  | No | No |
| BottomMargin | integer | Yes |  | No | No |
| SideMargin | integer | Yes |  | No | No |
| CoverSourceCode | string | Yes |  | No | No |
| HasCoverPage | boolean | Yes |  | No | No |
| UseDocusignMessage | boolean | Yes |  | No | No |
| DocusignSubject | string | Yes |  | No | No |
| DocusignMessage | string | Yes |  | No | No |
| HasPaging | boolean | Yes |  | No | No |
| NewFormat | boolean | Yes |  | No | No |
| UseClicksignMessage | boolean | Yes |  | No | No |
| ClicksignMessage | string | Yes |  | No | No |
| UseD4SignMessage | boolean | Yes |  | No | No |
| D4SignMessage | string | No |  | No | No |
| InstallmentsAmountFieldKey | string | Yes |  | No | No |
| InstallmentsRequired | boolean | No |  | No | No |
| Editable | boolean | Yes |  | No | No |
| LastUpdateDate | datetime | Yes |  | No | No |
| FileNameFormula | string | Yes |  | No | No |
| ExternalTemplate | boolean | Yes |  | No | No |
| ExternalTemplateUrl | string | Yes |  | No | No |
| QueryId | integer | Yes |  | No | No |


**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Entity | FieldEntity | No |  | No | No |
| SecondaryEntity | FieldEntity | No |  | No | No |
| Form | Form | No |  | No | No |
| Pages | Collection(DocumentPage) | Yes |  | No | Yes |
| InstallmentsAmountField | Field | No |  | No | No |
| AllowedUsers | Collection(DocumentTemplateAllowedUser) | Yes |  | No | No |
| AllowedTeams | Collection(DocumentTemplateAllowedTeam) | Yes |  | No | No |
| FileNameVariables | Collection(DocumentTemplateFileNameVariable) | Yes |  | No | No |
| Query | DocumentTemplateQuery | No |  | No | No |

> **Writing `Pages` replaces every page.** Each page is recreated with a new `Id`, and
> any property not resent is stored as null — a body sending only `Id`, `Ordination`
> and `BodySourceCode` answers `200` and wipes `Name`, header, footer, heights and
> margins from every page. Resend all 11: `Id`, `Ordination`, `Name`, `BodySourceCode`,
> `HeaderSourceCode`, `HeaderHeight`, `FooterSourceCode`, `FooterHeight`, `SideMargin`,
> `TopMargin` and `BottomMargin`.

> **Writing `Pages` also regenerates the template's form**, which comes back with a new
> `FormId`, dropping any field row added through `/FormsFields`. The template's HTML
> lives in `Pages[].BodySourceCode`; the root `BodySourceCode` comes back empty.

---


### DocumentTemplateAllowedTeam


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| TemplateId | integer | Yes |  | No | No |
| TeamId | integer | Yes |  | No | No |

**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Template | DocumentTemplate | No |  | No | No |
| Team | Team | No |  | No | No |

---


### DocumentTemplateAllowedUser


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| TemplateId | integer | Yes |  | No | No |

**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Template | DocumentTemplate | No |  | No | No |
| User | User | No |  | No | No |

---


### DocumentTemplateFileNameVariable


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| TemplateId | integer | No |  | No | No |
| VariableName | string | Yes |  | No | No |
| VariableFieldKey | string | Yes |  | No | No |
| FieldPathId | integer | Yes |  | No | No |

---


### DocumentTemplateQuery


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| RootODataQuery | string | Yes |  | No | No |
| SelfODataQuery | string | Yes |  | No | No |
| SectionsODataQuery | string | Yes |  | No | No |
| ProductsODataQuery | string | Yes |  | No | No |
| PartsODataQuery | string | Yes |  | No | No |

---


### DocumentTemplateUserUsability


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| Administration | boolean | No |  | No | No |
| Name | string | Yes |  | No | No |

---

