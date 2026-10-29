# Common API Patterns

## CRUD Operations

The CRUD verb table, the single-record read rule (`$filter`, **not** `/Set({key})`), PascalCase bodies, soft-delete, and projected write responses are identical across every entity set — documented once in the [OData Reference](03-odata-reference.md) §11. This file covers the patterns that go **beyond** plain CRUD.

## Webhook Suppression

Most write endpoints accept a `webhooks` query parameter:

```http
POST /Deals?webhooks=false
Content-Type: application/json

{ "Title": "New Deal" }
```

When `webhooks=false`, outbound webhook events are not fired for this operation. Default is `true`.

## File Upload

Several entities support file uploads via `multipart/form-data`:

```http
POST /Deals({id})/UploadFile
Content-Type: multipart/form-data

--boundary
Content-Disposition: form-data; name="file"; filename="document.pdf"
Content-Type: application/pdf

<binary data>
--boundary
Content-Disposition: form-data; name="folderId"

12345
--boundary--
```

Entities supporting file upload:
- `/Deals/{id}/UploadFile`
- `/Contacts/{id}/UploadFile`
- `/Chats/{id}/UploadFile`
- `/Attachments` (POST, Base64)
- `/AttachmentsItems` (POST, FormData)

## Avatar Upload

Contacts support avatar uploads:

```http
POST /Contacts({id})/UploadAvatar
Content-Type: multipart/form-data

--boundary
Content-Disposition: form-data; name="file"; filename="avatar.png"
Content-Type: image/png

<binary data>
--boundary--
```

Or from URL:
```http
POST /Contacts({id})/UploadAvatarFromUrl
Content-Type: application/json

{
  "Url": "https://example.com/photo.jpg"
}
```

## Bulk Operations

### Bulk Update (Contacts)

```http
POST /Contacts/BulkUpdate?$filter=City eq 'São Paulo'
Content-Type: application/json

{
  "StatusId": 5
}
```

The `$filter` query parameter selects which records to update. The body contains the fields to change.

### Bulk Delete (Contacts)

```http
POST /Contacts/BulkDelete?$filter=StatusId eq 3
```

## Duplicate Detection

Several entities support duplicate checking:

```http
POST /Contacts/IsDuplicate
Content-Type: application/json

{
  "Email": "john@example.com",
  "CNPJ": "12345678000100"
}
```

Returns `true` or `false`.

For deals:
```http
POST /Deals/IsDuplicate
POST /Deals({id})/IsDuplicate
```

## OtherProperties (Custom Fields)

Custom fields are written and filtered through the `OtherProperties` collection on the parent entity. The complete workflow — creating fields, the stable `FieldKey`, the value column for each `NativeType`, filtering with `OtherProperties/any(...)`, and updating a single field — is documented in [Fields & Entities](07-fields-and-entities.md) (full guide) and the [OData Reference](03-odata-reference.md) §12.

Key gotcha worth repeating: for dropdown/options fields (those with an `OptionsTableId`), write the selected option's Id into **`IntegerValue`** — `ObjectValueId`/`UserValueId`/`ProductValueId`/`ContactValueId`/`CurrencyValueId`/`AttachmentValueId`/`AttachmentItemValueId` are read-only and populated by the system.

## Nested Objects in Payloads (Quotes, Orders, Documents)

The endpoints for **Quotes**, **Orders**, and **Documents** accept nested child objects directly in the POST and PATCH payload. This is the **only way** to create Sections, Products (line items), Product Parts, and Installments — there are no separate endpoints for creating them individually.

### Supported Nested Objects

| Entity | Nested Objects Accepted |
|--------|------------------------|
| **Quotes** (`/Quotes`) | `Sections` → `Products` → `Parts`, `Installments`, `RelatedPeople` |
| **Orders** (`/Orders`) | `Sections` → `Products` → `Parts`, `Products` (root-level), `Installments`, `RelatedPeople` |
| **Documents** (`/Documents`) | `Sections` → `Products` → `Parts`, `Installments`, `RelatedPeople`, `Pages` |

### Nesting Hierarchy

```
Root (Quote/Order/Document)
├── Sections[]               — Groups of products
│   └── Products[]           — Line items within a section
│       └── Parts[]          — Component parts of a product
├── Installments[]           — Payment installments
├── RelatedPeople[]          — People related to the entity
└── Pages[]                  — Document pages (Documents only)
```

### Example: Create a Quote with Sections, Products, and Parts

```http
POST /Quotes
User-Key: <your-key>
Content-Type: application/json

{
  "DealId": 100,
  "ContactId": 200,
  "TemplateId": 5,
  "Sections": [
    {
      "Name": "Hardware",
      "CurrencyId": 1,
      "Products": [
        {
          "ProductId": 10,
          "Quantity": 2,
          "UnitPrice": 500.00,
          "CurrencyId": 1,
          "Parts": [
            {
              "PartId": 1,
              "ProductId": 15,
              "Quantity": 4,
              "UnitPrice": 50.00,
              "CurrencyId": 1
            }
          ]
        },
        {
          "ProductId": 11,
          "Quantity": 1,
          "UnitPrice": 1200.00,
          "CurrencyId": 1
        }
      ]
    },
    {
      "Name": "Services",
      "CurrencyId": 1,
      "Products": [
        {
          "ProductId": 20,
          "Quantity": 10,
          "UnitPrice": 150.00,
          "CurrencyId": 1
        }
      ]
    }
  ],
  "Installments": [
    {
      "Date": "2025-07-15T00:00:00Z",
      "Amount": 2000.00
    },
    {
      "Date": "2025-08-15T00:00:00Z",
      "Amount": 2000.00
    }
  ]
}
```

### Example: Update an Order's Sections and Products

```http
PATCH /Orders(123)
User-Key: <your-key>
Content-Type: application/json

{
  "Sections": [
    {
      "Name": "Updated Section",
      "CurrencyId": 1,
      "Products": [
        {
          "ProductId": 10,
          "Quantity": 5,
          "UnitPrice": 450.00,
          "CurrencyId": 1
        }
      ]
    }
  ]
}
```

### Important Behavior

- **Replace semantics**: When you send `Sections`, `Products`, `Parts`, or `Installments` in a PATCH, the existing children are **deleted and replaced** with the new ones — it is not a merge or append. Two consequences that are easy to miss:
  - **Ids change on every write.** `Section.Id` and `QuoteProduct.Id` are new after each PATCH that carries `Sections`. Never diff, reconcile or match children by id — compare by content (`Code`, `ProductId`, `Quantity`, and `OtherProperties` keyed by `FieldKey`). A team comparing ids will conclude the record "lost its history".
  - **A child you don't resend is deleted** — including the product-less section that carries totals, which the generated PDF reads. Patching one line item with a body holding only that line removes every other section.
- **The root is still a delta.** Root scalar properties and the root `OtherProperties` are merged, not replaced: `OtherProperties` merges by `FieldKey`, so untouched custom fields survive. Measured: a PATCH carrying 2 custom fields left the other 140 and all native fields intact. **If you only need to change the root, don't send `Sections` at all.**
- **To change one line item**, read the whole tree, edit it in memory and send it all back: `$expand=OtherProperties,Sections($expand=OtherProperties,Products($expand=OtherProperties,Parts($expand=OtherProperties)))`. Strip `Id`, `QuoteId` and `SectionId` when copying rows from another record. Use `?generateDocument=false` while you are only adjusting data (see [Quotes](endpoints/quotes.md)).
- **OtherProperties on nested objects**: Sections, Products, and Parts each support their own `OtherProperties` array for custom fields, nested within the child object. Resend them with the child.
- **Products must belong to a Section**: Products are always nested inside a Section. You cannot send `Products` at the root level without a `Sections` wrapper in Quotes and Documents. Orders accept both `Sections` with nested `Products` and root-level `Products`.
- **Parts must belong to a Product**: Parts are always nested inside a Product object.
- **Product validation**: Each `ProductId` must reference a valid product in the catalog. Invalid product references are silently skipped.
- **Currency validation**: Each `CurrencyId` is validated — invalid ones are set to `null`.

## Pagination

Page by **keyset on `Id`** — `$orderby=Id&$top=N&$filter=… and Id gt <last Id of the previous page>` — and stop only when a page comes back **empty**. Never page with `$skip` (it drops rows on a collection that is being written to) and never rely on `@odata.nextLink`. A page shorter than `$top` does not mean the end. The full rule, plus the fast-count pattern, is in the [OData Reference](03-odata-reference.md) §5 and §6.1.

## Deleted Records

Many entities expose a route that **lists** soft-deleted records:

```http
GET /Deals/GetDeletedDeals
GET /Contacts/GetDeletedContacts
```

> **Listing is not recovery.** There is no restore action anywhere in `$metadata` —
> these routes only read. In practice a `DELETE` through the API is irreversible:
> take a full `GET` of the record first, and count how many rows the call will hit.
>
> `GetDeleted*` also answers `500 "A possible object cycle was detected"` for
> Automations, Checklists, Cities, Currencies, DealsLossReasons, DealsPipelines,
> Fields, FieldsOptionsTablesOptions, Forms, PublicForms, Tags and AttachmentsFolders.

## Aggregation by Custom Fields

Some entities support aggregation over custom fields:

```http
GET /Contacts/AggregateByOtherProperties
GET /Deals/AggregateByOtherProperties
GET /ContactsProducts/AggregateByOtherProperties
GET /DealsContactsProducts/AggregateByOtherProperties
```

## Non-Conventional Actions

Actions are called via POST on an entity instance:

```http
POST /Deals({id})/Win
POST /Deals({id})/Lose
POST /Deals({id})/Reopen
POST /Deals({id})/MarkAsRead
```

Some actions require a request body:

```http
POST /Deals({id})/Lose
Content-Type: application/json

{
  "LossReasonId": 42
}
```

## Merge Operations

```http
POST /Deals/Merge
Content-Type: application/json

{
  "SourceDealId": 123,
  "TargetDealId": 456
}
```

## Search

### General Search
```http
GET /GeneralSearch?$filter=...
```

### Product Search
```http
GET /Products/SmartSearch?text=laptop
GET /Products/SearchByName?text=laptop
GET /Products/SearchByNameOrCode?text=laptop
GET /Products/SearchByNameOrExactCode?text=laptop
```

Note: `/Products/Search` and `/Products/SmartSearchV2` answer `405` — use `SmartSearch` or one of the `SearchByName*` routes.
