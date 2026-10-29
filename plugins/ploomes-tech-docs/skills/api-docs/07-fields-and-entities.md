# Fields & Entities — Custom Field System

The **Fields** system is one of the most important backend features of Ploomes. It allows creating custom fields on any entity that supports the `OtherProperties` array.

## Overview

The custom field lifecycle has five steps:

1. **Discover the target entity** — `GET /FieldsEntities` to find which entity you want to add a field to (match by `ApiUrl`).
2. **Discover the field type** — `GET /FieldsTypes` to find the type of value the field will hold (use the `NativeType` property).
3. **Create the field** — `POST /Fields` with the entity ID and type ID.
4. **Put the field on a form** — `POST /FormsFields`. A field created by `POST /Fields` belongs to **no form**, and a field outside the form is invisible on screen, is never calculated, and does not enforce `Required` — even with a value stored in `OtherProperties`. See [Forms](endpoints/forms.md#post-formsfields).
5. **Use the field** — Include the field's `FieldKey` in the `OtherProperties` array when creating/updating records via POST or PATCH.

## Step-by-Step Example: Create a Contact Custom Text Field

### 1. Find the Entity

```http
GET /FieldsEntities?$filter=ApiUrl eq 'Contacts'
User-Key: <your-key>
```

Response (relevant fields):
```json
{
  "value": [
    {
      "Id": 2,
      "Name": "Contacts",
      "ApiUrl": "Contacts"
    }
  ]
}
```

→ The entity ID for Contacts is `2`.

### 2. Find the Field Type

```http
GET /FieldsTypes
User-Key: <your-key>
```

Response (relevant fields):
```json
{
  "value": [
    { "Id": 1, "Name": "Short text", "NativeType": "String" },
    { "Id": 2, "Name": "Long text", "NativeType": "BigString" },
    { "Id": 4, "Name": "Integer", "NativeType": "Integer" },
    ...
  ]
}
```

For a text field, you want `Id: 1` (NativeType = `String`).

### 3. Create the Field

```http
POST /Fields
User-Key: <your-key>
Content-Type: application/json

{
  "EntityId": 2,
  "TypeId": 1,
  "Name": "Nickname"
}
```

Response:
```json
{
  "Id": 500,
  "Key": "contact_8142012u0",
  "EntityId": 2,
  "TypeId": 1,
  "Name": "Nickname",
  "Dynamic": true
}
```

→ The `Key` value (`contact_8142012u0`) is the `FieldKey` you will use in `OtherProperties`.

### 4. Use the Field in OtherProperties

Now create a contact using the new custom field:

```http
POST /Contacts
User-Key: <your-key>
Content-Type: application/json

{
  "Name": "John",
  "OtherProperties": [
    {
      "FieldKey": "contact_8142012u0",
      "StringValue": "Johnny"
    }
  ]
}
```

The `StringValue` column is used because the field type's `NativeType` is `String`. See the [Field Types Reference](#field-types-reference) below for the full mapping.

#### Validation Rules

1. **One value per FieldKey**: Each OtherProperties entry must set exactly **one** value column. Setting multiple values for the same FieldKey is invalid.

   ```json
   // ❌ WRONG — two values for the same FieldKey
   { "FieldKey": "contact_143081", "StringValue": "1", "IntegerValue": 1 }

   // ✅ CORRECT — only the matching NativeType value
   { "FieldKey": "contact_143081", "StringValue": "1" }
   ```

2. **Value must match the field type**: The value column you set must correspond to the field's `NativeType` from the [Field Types Reference](#field-types-reference). For example, if the field type has `NativeType = String`, you must use `StringValue`.

   > **A value in the wrong column is not rejected — it is stored.** The API answers
   > `200` and keeps what you sent. Reading back through the API shows the field
   > populated, but the screen and the generated document only read the column
   > belonging to the field's `TypeId`, so the value is invisible to the user and
   > absent from the PDF, with no error to investigate. Measured: the description of a
   > simple-text field (TypeId 1) written to `BigStringValue` on every line of a quote
   > — an API check reported 100% filled while the PDF came out with no descriptions
   > at all; moving the value to `StringValue` made them appear.
   >
   > Before writing, build the `FieldKey → TypeId` map once
   > (`GET /Fields?$select=Key,TypeId`) and pick the column from it. When verifying a
   > bulk load, check **the column the type requires**, not "some column is filled".
   > To clear a value, send that same column as `null`.

3. **No duplicate FieldKeys in the same request** — unless the field was created with `Multiple: true`. For single-value fields, each `FieldKey` may appear at most once. For multi-value fields (`Multiple: true`), you may repeat the same `FieldKey` to set multiple values:

   ```json
   // ✅ CORRECT — field created with Multiple: true allows repeated FieldKeys
   {
     "OtherProperties": [
       { "FieldKey": "contact_0184u148hh", "IntegerValue": 1 },
       { "FieldKey": "contact_0184u148hh", "IntegerValue": 2 }
     ]
   }
   ```

### 5. Update the Custom Field

```http
PATCH /Contacts(123)
User-Key: <your-key>
Content-Type: application/json

{
  "OtherProperties": [
    {
      "FieldKey": "contact_8142012u0",
      "StringValue": "Updated nickname"
    }
  ]
}
```

### 6. Filter by Custom Field

```http
GET /Contacts?$filter=OtherProperties/any(op: op/FieldId eq 500 and op/StringValue eq 'Johnny')
```

> **Performance tip**: Always use `FieldId` (integer) instead of `FieldKey` (string) in `$filter` queries. Filtering by `FieldId` is significantly faster because it uses an indexed integer lookup in the database. The `FieldKey` filter works but is slower. Use the `Id` returned from `POST /Fields` or `GET /Fields` for this purpose.
>
> **Important**: In `OtherProperties` write payloads (POST/PATCH), you must still use `FieldKey` — `FieldId` is only recommended for `$filter` queries.

## Field Types Reference

Every field type maps to a specific `NativeType`, which determines which value column to use in the `OtherProperties` array.

| Type Id | Name | NativeType | Value Column to Use |
|---------|------|------------|---------------------|
| 1 | Simple text | `String` | `StringValue` |
| 2 | Multiple lines text | `BigString` | `BigStringValue` |
| 4 | Integer number | `Integer` | `IntegerValue` |
| 5 | Currency | `Decimal` | `DecimalValue` |
| 6 | Number with unlimited decimal places | `Decimal` | `DecimalValue` |
| 7 | Pre-registered options | `Integer` | `IntegerValue` |
| 8 | Date | `DateTime` | `DateTimeValue` |
| 9 | Time | `DateTime` | `DateTimeValue` |
| 10 | Checkbox | `Bool` | `BoolValue` |
| 11 | CPF | `String` | `StringValue` |
| 12 | CNPJ | `String` | `StringValue` |
| 13 | Percentage | `Decimal` | `DecimalValue` |
| 17 | Address | `String` | `StringValue` |
| 18 | Image | `String` | `StringValue` |
| 19 | Attachment | `Integer` | `IntegerValue` |
| 20 | Color | `String` | `StringValue` |
| 21 | DocuSign Signature | `String` | `StringValue` |
| 22 | Developer | `BigString` | `BigStringValue` |
| 23 | Accumulator | `Decimal` | `DecimalValue` |
| 24 | D4Sign Signature | `String` | `StringValue` |

> **Important — Dropdown/Select fields**: When a field has an `OptionsTableId` configured (Type Id 7 — Pre-registered options), the value to fill is `IntegerValue` with the selected option's ID. The `ObjectValueId` is **read-only** and populated by the system.

> **Tip**: To discover the human-readable name and icon for each type, call `GET /FieldsTypes`. The `NativeType` property tells you exactly which value column to fill.

> **There are 20 field types: 1, 2, 4–13 and 17–24.** TypeIds **3, 14, 15 and 16 do
> not exist.** `GET /FieldsTypes` returns those 20;
> `GET /Fields?$filter=TypeId eq 3 or … eq 16` comes back empty; `$metadata` declares
> no field-type enum; and a census of 48,942 fields across 28 accounts found none of
> them. An earlier revision of this table listed 14, 15 and 16 as Order taxes,
> Discount and Additional taxes — that was wrong, and a payload built on it carries a
> non-existent type.

### NativeType → Value Column Quick Reference

The `FieldKey` property is **required** in every OtherProperties entry. Alongside it, set exactly **one** of the following value columns based on the field's NativeType:

| NativeType | Value Column | JSON Type |
|------------|-------------|-----------|
| `String` | `StringValue` | `"text"` |
| `BigString` | `BigStringValue` | `"long text or HTML"` — sanitized on API writes, see below |
| `Integer` | `IntegerValue` | `123` |
| `Decimal` | `DecimalValue` | `1500.50` |
| `DateTime` | `DateTimeValue` | `"2025-06-15T00:00:00Z"` |
| `Bool` | `BoolValue` | `true` / `false` |

> **HTML written through the API into a multi-line field (`TypeId 2`) is sanitized
> silently, and the response is still `200`.** Stripped: `<script>`, every `on*`
> attribute, `href="javascript:"`, `<svg>`, `<iframe>` and `formaction`. Measured:
> `PATCH /Fields('<Key>')` with HTML in `DefaultBigStringValue` stored a little over
> half the bytes sent.
>
> The screen does **not** sanitize — HTML pasted there is stored whole (a script in a
> multi-line field still doesn't execute). The consequence is that a "fix" applied
> through the API destroys content that was authored on screen, irreversibly. The
> same filter hit HTML produced by an automation's embedded formula: a `mailto:` link
> arrived with the link gone.
>
> Developer fields (`TypeId 22`) are **not** sanitized.

### Settable vs Read-only Properties

Only the following properties can be set in the OtherProperties payload:

| Property | Description |
|----------|-------------|
| `FieldKey` | **Required.** The field key identifying which custom field to set. |
| `StringValue` | Value for `String` NativeType fields |
| `BigStringValue` | Value for `BigString` NativeType fields |
| `IntegerValue` | Value for `Integer` NativeType fields (including dropdown/options fields) |
| `DecimalValue` | Value for `Decimal` NativeType fields |
| `DateTimeValue` | Value for `DateTime` NativeType fields |
| `BoolValue` | Value for `Bool` NativeType fields |

All other properties (`Id`, `FieldId`, `ObjectValueId`, `ObjectValueName`, `UserValueId`, `UserValueName`, `ProductValueId`, `ProductValueName`, `AttachmentValueId`, `AttachmentValueName`, `ContactValueId`, `ContactValueName`, `CurrencyValueId`, `AttachmentItemValueId`, etc.) are **read-only** and populated by the system.

## Entities That Support OtherProperties

Any entity that has the `OtherProperties` navigation property supports custom fields. The main entities are:

| Entity | Endpoint | OtherProperties |
|--------|----------|----------------|
| Contacts | `/Contacts` | ✓ |
| Deals | `/Deals` | ✓ |
| Quotes | `/Quotes` | ✓ |
| Quote Sections | _(no collection route — `/QuotesSections` and `/Quotes@Sections` both `404`)_ | ✓, read via `/Quotes?$expand=Sections(...)` |
| Orders | `/Orders` | ✓ |
| Products | `/Products` | ✓ |
| Tasks | `/Tasks` | ✓ |
| Documents | `/Documents` | ✓ |
| Interaction Records | `/InteractionRecords` | ✓ |
| Users | `/Users` | ✓ |
| Teams | `/Teams` | ✓ |
| Leads | `/Leads` | ✓ |
| Emails | `/Emails` | ✓ |
| Account | `/Account` | ✓ |

To get the full list dynamically, call `GET /FieldsEntities` and look for entities where the `ApiUrl` matches a known entity endpoint.

## Endpoints Reference

### GET /FieldsEntities

Returns all entities that can have custom fields.

Key properties in the response:

| Property | Type | Description |
|----------|------|-------------|
| Id | integer | Entity ID (used as `EntityId` when creating a Field) |
| Name | string | Display name |
| Key | string | Internal key |
| ApiUrl | string | The API endpoint path for this entity (e.g., `Contacts`, `Deals`) |
| Importable | boolean | Whether bulk import is supported |
| Icon | string | Display icon identifier |
| SingularUnitName | string | Singular label |
| PluralUnitName | string | Plural label |
| IsAllowedToUseInFields | boolean | Whether fields can be created for this entity |

### GET /FieldsTypes

Returns all available field types.

Key properties in the response:

| Property | Type | Description |
|----------|------|-------------|
| Id | integer | Type ID (used as `TypeId` when creating a Field) |
| Name | string | Display name (e.g., "Short text", "Number", "Date") |
| NativeType | string | The value column type — determines which `*Value` column to use in `OtherProperties` |
| Icon | string | Display icon identifier |
| Listable | boolean | Whether this type can be displayed in list views |
| Multipliable | boolean | Whether this type supports multiplication/calculations |
| StandardFormat | string | Default display format |

### POST /Fields

Creates a new custom field.

Required properties in the request body:

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| EntityId | integer | Yes | The entity this field belongs to (from `GET /FieldsEntities`) |
| TypeId | integer | Yes | The field type (from `GET /FieldsTypes`) |
| Name | string | Yes | Display name for the field |

Key properties in the response:

| Property | Type | Description |
|----------|------|-------------|
| Id | integer | The field's numeric ID |
| Key | string | The field key — use this as `FieldKey` in `OtherProperties` |
| EntityId | integer | The entity this field belongs to |
| TypeId | integer | The field type |
| Name | string | Display name |
| Dynamic | boolean | `true` for custom fields created via API |
| Required | boolean | Whether the field is required |
| Unique | boolean | Whether the field value must be unique |
| Multiple | boolean | Whether the field accepts multiple values |
| Filterable | boolean | Whether the field can be used in filters |
| OptionsTableId | integer | If the field is a dropdown/select, the ID of the options table |

### PATCH /Fields('{key}')

Updates an existing field definition. The key is the field's `Key` (string), **in
single quotes inside parentheses**.

### DELETE /Fields('{key}')

Soft-deletes a field, same key form.

> **The quoted-parentheses form is the only one that works.** `/Fields/<Key>` and
> `/Fields(<Key>)` both answer `404`, and `/Fields(<Id>)` answered `404` on one
> account and `401` on another — the `401` reads like a permission problem and is not.

### GET /Fields/GetDeletedFields

Lists soft-deleted fields. Answers `500 "A possible object cycle was detected"`, and
there is no restore action in any case (see
[06 · Deleted Records](06-common-patterns.md#deleted-records)).

## Options Tables (Dropdowns)

For fields that represent a selection from a list (e.g., dropdown, multi-select), you need to create an **Options Table** with its options.

### Creating an Options Table

```http
POST /FieldsOptionsTables
Content-Type: application/json

{
  "Name": "Priority Levels"
}
```

### Adding Options

```http
POST /FieldsOptionsTablesOptions
Content-Type: application/json

{
  "OptionsTableId": 10,
  "Name": "High"
}
```

### Using with a Field

When creating a field of a select/dropdown type, set the `OptionsTableId`:

```http
POST /Fields
Content-Type: application/json

{
  "EntityId": 2,
  "TypeId": 11,
  "Name": "Priority",
  "OptionsTableId": 10
}
```

Then when setting the value in `OtherProperties`, use `IntegerValue` with the option's ID:

```json
{
  "OtherProperties": [
    {
      "FieldKey": "contact_abc123",
      "IntegerValue": 42
    }
  ]
}
```

## Complete Workflow Summary

```
1. GET /FieldsEntities         → Find the entity (match by ApiUrl)
2. GET /FieldsTypes             → Find the type (use NativeType to know which value column)
3. POST /Fields                 → Create the field (get the Key back)
4. POST /{Entity}               → Use FieldKey + correct *Value column in OtherProperties
   or PATCH /{Entity}({id})
```

This workflow applies to **every entity that has the OtherProperties array** and is the standard mechanism for extending Ploomes entities with custom data.
