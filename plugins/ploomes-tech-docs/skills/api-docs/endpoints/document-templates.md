# /DocumentTemplates

## Data Model

See [DocumentTemplate data model](../data-models/document-template.md#documenttemplate) for the full property table with settability information.

## /DocumentTemplates

### GET `/DocumentTemplates`

- **Response**: Entity (entity)

Read one template with
`GET /DocumentTemplates?$filter=Id eq {id}&$expand=Pages` — **without `$select`**,
which drops page properties you will need to send back. `GET /DocumentTemplates({id})`
answers `404`, while `PATCH`/`DELETE` by key work (see
[03 §11](../03-odata-reference.md#11-crud-shape)).

The template's HTML lives in `Pages[].BodySourceCode`;
`DocumentTemplates.BodySourceCode` at the root comes back empty.

### POST `/DocumentTemplates`

- **Response**: Entity (entity)
- **Body**: JSON object with entity fields
- Supports `?webhooks=false` to suppress webhook emission

### PATCH `/DocumentTemplates/{key}`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)
- **Body**: JSON delta for scalar properties. **`Pages` is not a delta** — see below
- Supports `?webhooks=false` to suppress webhook emission

> **A body carrying `Pages` replaces every page.** Each page is recreated with a new
> `Id`, and **any property you don't resend is stored as null**. A PATCH that sent
> pages carrying only `Id`, `Ordination` and `BodySourceCode` answered `200` and
> wiped `Name`, header, footer, heights and margins from every page of a template in
> production: unnamed tabs in the editor, and a PDF with no logo, no footer and zero
> margins.
>
> Resend all **11** properties per page:
> `Id`, `Ordination`, `Name`, `BodySourceCode`, `HeaderSourceCode`, `HeaderHeight`,
> `FooterSourceCode`, `FooterHeight`, `SideMargin`, `TopMargin`, `BottomMargin`.
> With all 11 present, nothing is lost.
>
> **Writing `Pages` regenerates the template's form**, which comes back with a new
> `FormId` — whether the write came from the API or from the screen. A field row
> added only through `/FormsFields` disappears with it; see
> [Forms](forms.md#post-formsfields).
>
> Quotes, orders and documents already generated are unaffected until they are
> regenerated.

### DELETE `/DocumentTemplates/{key}`

- **Parameters**:
  - `key`: `int`
- **Response**: `200 OK`
- Performs soft delete

### POST `/DocumentTemplates/FillTemplateWithAttachments`

- **Response**: `FillTemplateResponse`

### POST `/DocumentTemplates/FillTemplateMultipleWithAttachments`

- **Response**: `FillTemplateResponse`

### POST `/DocumentTemplates/FillTemplate`

- **Response**: `string`

### POST `/DocumentTemplates/FillTemplateMultiple`

- **Response**: `string`

### POST `/DocumentTemplates/FillString`

- **Response**: `string`

## /DocumentTemplatesSections

### GET `/DocumentTemplatesSections`

- **Response**: Entity (entity)

### POST `/DocumentTemplatesSections`

- **Response**: Entity (entity)
- **Body**: JSON object with entity fields
- Supports `?webhooks=false` to suppress webhook emission

### PATCH `/DocumentTemplatesSections/{key}`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)
- **Body**: JSON delta (only changed fields)
- Supports `?webhooks=false` to suppress webhook emission

### DELETE `/DocumentTemplatesSections/{key}`

- **Parameters**:
  - `key`: `int`
- **Response**: `200 OK`
- Performs soft delete

## /DocumentTemplatesSectionsTypes

### GET `/DocumentTemplatesSectionsTypes`

- **Response**: Entity (entity)

## /DocumentTemplatesUserUsabilities

### GET `/DocumentTemplatesUserUsabilities`

- **Response**: Entity (entity)
