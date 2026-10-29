# /Forms

## Data Model

See [Form data model](../data-models/form.md#form) for the full property table with settability information.

## /Forms

### GET `/Forms`

- **Response**: Entity (entity)

### POST `/Forms`

- **Response**: Entity (entity)
- **Body**: JSON object with entity fields
- Supports `?webhooks=false` to suppress webhook emission

### PATCH `/Forms/{key}`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)
- **Body**: JSON delta (only changed fields)
- Supports `?webhooks=false` to suppress webhook emission

### DELETE `/Forms/{key}`

- **Parameters**:
  - `key`: `int`
- **Response**: `200 OK`
- Performs soft delete

### GET `/Forms/GetDeletedForms`

> ⚠️ **Answers `500 "A possible object cycle was detected"`.** Listing is not
> recovery either way: there is no restore action (see
> [06 · Deleted Records](../06-common-patterns.md#deleted-records)).

- **Response**: Entity (entity)

### POST `/Forms/{key}/SortFields`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)

### POST `/Forms/{key}/SortFieldsV2`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)

## /FormsFields

### GET `/FormsFields`

- **Response**: Entity (entity)

### POST `/FormsFields`

- **Response**: Entity (entity)
- **Body**: JSON object with entity fields
- Supports `?webhooks=false` to suppress webhook emission

**This is how a field becomes visible.** A field created by `POST /Fields` belongs to
no form. Without a row here it is invisible on screen, never calculated, and its
`Required` flag is not enforced — even when `OtherProperties` already holds a value
for it.

```json
{ "FormId": <FormId>, "FieldKey": "<Key>", "SectionId": null, "Wide": false, "Required": false, "Ordination": -1 }
```

- `Ordination: -1` puts the field at the top without renumbering the others.
- The pipeline's `FormId` comes from `/DealsPipelines`; a template's from
  `/DocumentTemplates?$select=Id,FormId` — **re-read it immediately before using it**
  (see the warning below).
- Verify with `GET /FormsFields?$filter=FieldKey eq '<Key>'`.

> **On a quote / order / document template, a row created here does not survive.**
> The template's form is derived from the template body, so every save of `Pages` —
> from the API or from the screen — regenerates the form under a new `FormId` and the
> row disappears. Measured on 10 templates; re-adding the row right afterwards did not
> hold either.
>
> What does hold is declaring the field in the template's `BodySourceCode`, hidden if
> it must not appear in the PDF. Its position in the body determines its order on
> screen.
>
> ```html
> <div style="display:none"><span wrapper-field="true"><field key="<Key>" path-id="56">[Proposta.Nome do campo]</field></span></div>
> ```
>
> A formula field left out of the main templates had a value on a negligible share of
> quotes; once declared in the body, nearly every new quote had one.

### PATCH `/FormsFields/{key}`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)
- **Body**: JSON delta (only changed fields)
- Supports `?webhooks=false` to suppress webhook emission

### DELETE `/FormsFields/{key}`

- **Parameters**:
  - `key`: `int`
- **Response**: `200 OK`
- Performs soft delete

## /FormsSections

### GET `/FormsSections`

- **Response**: Entity (entity)

### POST `/FormsSections`

- **Response**: Entity (entity)
- **Body**: JSON object with entity fields
- Supports `?webhooks=false` to suppress webhook emission

### PATCH `/FormsSections/{key}`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)
- **Body**: JSON delta (only changed fields)
- Supports `?webhooks=false` to suppress webhook emission

### DELETE `/FormsSections/{key}`

- **Parameters**:
  - `key`: `int`
- **Response**: `200 OK`
- Performs soft delete
