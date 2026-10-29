# Form — Data Models

Data models for the Form domain.

### Column Reference

Each property table includes the following columns:

| Column | Description |
|--------|-------------|
| **FieldKey** | The key used to reference this property in the Fields system (see [Fields & Entities](../07-fields-and-entities.md)). Empty if the property is not exposed as a field. |
| **Creatable** | **Yes** = can be set on `POST` (create). **No** = cannot be set on create; managed by the system. |
| **Editable** | **Yes** = can be set on `PATCH` (edit). **No** = cannot be set on edit; managed by the system. |

> **Note on Required vs Nullable**: If a field is not Required and is not Nullable, you may omit it from the payload (the API will set a default value), but you may not send it as `null`.

---

### Form


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| Name | string | Yes |  | No | No |
| Key | string | Yes |  | No | No |
| EntityId | integer | Yes |  | No | No |
| FilterForm | boolean | No |  | No | No |
| Editable | boolean | No |  | No | No |
| TemplateId | integer | Yes |  | No | No |
| AttachmentFolderId | integer | Yes |  | No | No |
| LastUpdateDate | datetime | Yes |  | No | No |


**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Entity | FieldEntity | No |  | No | No |
| Sections | Collection(FormSection) | Yes |  | No | No |
| Fields | Collection(FormField) | Yes |  | No | No |
| Template | DocumentTemplate | No |  | No | No |
| AttachmentFolder | AttachmentFolder | No |  | No | No |
| Templates | Collection(DocumentTemplate) | Yes |  | No | No |

---


### FormField


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| FormId | integer | Yes |  | Yes | No |
| GroupNumber | integer | Yes |  | No | No |
| SectionId | integer | Yes |  | No | No |
| FieldKey | string | Yes |  | Yes | No |
| Wide | boolean | No |  | Yes | No |
| QuickFormId | integer | Yes |  | No | No |
| SectionCode | integer | Yes |  | No | No |
| SectionName | string | Yes |  | No | No |
| SectionProductGroupIds | string | Yes |  | No | No |
| SectionProductFamilyIds | string | Yes |  | No | No |
| SectionProductListIds | string | Yes |  | No | No |
| SectionOnlyContactProducts | boolean | Yes |  | No | No |
| SectionAlwaysOpen | boolean | Yes |  | No | No |
| ProductPartCode | integer | Yes |  | No | No |
| ProductPartName | string | Yes |  | No | No |
| ProductPartGroupIds | string | Yes |  | No | No |
| ProductPartUseSelector | boolean | Yes |  | No | No |
| ProductPartOnlyOnePart | boolean | Yes |  | No | No |
| Placeholder | string | Yes |  | No | No |

**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Form | Form | No |  | No | No |
| Section | FormSection | No |  | No | No |
| Field | Field | No |  | No | No |
| QuickForm | Form | No |  | No | No |

> **`POST /Fields` does not put the field on a form.** A field with no row here is
> invisible on screen, is never calculated, and its `Required` flag is not enforced,
> even when `OtherProperties` already holds a value for it. Create the row with
> `POST /FormsFields`, whose body accepts `FormId`, `FieldKey`, `SectionId`, `Wide`,
> `Required` and `Ordination`.

> **On a quote / order / document template the row does not survive.** The template's
> form is derived from the template body, so every save of `Pages` regenerates the
> form under a new `FormId` and the row disappears. There, declare the field in the
> template's `BodySourceCode` instead. See [Forms](../endpoints/forms.md#post-formsfields).

---


### FormSection


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| FormId | integer | Yes |  | No | No |
| Name | string | Yes |  | No | No |
| Hidden | boolean | No |  | No | No |

**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Form | Form | No |  | No | No |
| Fields | Collection(FormField) | Yes |  | No | No |
| AllowedUsers | Collection(FormSectionAllowedUser) | Yes |  | No | No |
| AllowedUserProfiles | Collection(FormSectionAllowedUserProfile) | Yes |  | No | No |
| AllowedTeams | Collection(FormSectionAllowedTeam) | Yes |  | No | No |
| Languages | Collection(FormSectionLanguage) | Yes |  | No | No |

---

