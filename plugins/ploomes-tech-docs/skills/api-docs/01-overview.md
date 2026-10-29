# PloomesCRMAPI-2 — Architecture Overview

## What is this API?

PloomesCRMAPI-2 is the primary backend API for the Ploomes CRM platform. It is a multi-tenant, RESTful API using the OData v4 protocol.

This API manages the entire CRM lifecycle: contacts, deals (sales pipeline), quotes, orders, documents, tasks, automations, reports, and more.

## Key Technical Details

| Aspect | Detail |
|--------|--------|
| Protocol | OData v4 |
| JSON Serialization | PascalCase property names |
| File Storage | Azure Blob Storage, AWS S3 |

## Multi-Tenancy

The API provides complete tenant isolation. Every request is scoped to a specific account and user.

- Every request is scoped by the `User-Key` (or other auth key) to a specific account and user
- All entity queries return only rows visible to the calling user
- There is no cross-tenant data access

## Key Concepts

### Read-Only Projections

All GET endpoints return denormalized, user-scoped projections — not raw database models. These projections include computed and relationship fields.

### OtherProperties (Custom Fields)

A schema-less system for extending entities with custom fields:
- Entities are discovered via `GET /FieldsEntities` (match by `ApiUrl`)
- Field types are discovered via `GET /FieldsTypes` (the `NativeType` property determines which value column to use)
- Fields are created via `POST /Fields` (returns a `Key` to use as `FieldKey` in `OtherProperties`)
- Custom field values are set on entities via the `OtherProperties` array in POST/PATCH requests
- Settable value columns: `FieldKey` (required), `StringValue`, `BigStringValue`, `IntegerValue`, `DecimalValue`, `DateTimeValue`, `BoolValue`. All other value columns (`ObjectValueId`, `UserValueId`, etc.) are read-only.

> **Full guide**: See [Fields & Entities](07-fields-and-entities.md) for the complete workflow with examples.

### OData Metadata

The full Entity Data Model is available at `GET /$metadata`.

## Core Business Flows

### Sales Pipeline
```
Lead → Contact → Deal (with Pipeline/Stage) → Quote → Order
```

### Document Cycle
```
Creation → BusinessRule Validation → Approval Flow → HTML Template → Azure Storage → External Sharing
```

### Automation Engine
```
Trigger (event) → Filter Evaluation → Action Execution (UpdateField, SendEmail, ChangeStage, CallWebhook, ExecuteFormula)
```

### Product Catalog (CPQ)
```
ProductFamily → ProductGroup → Product → ProductPart
```

## Base URL (Dynamic via HostSet)

The API base URL is **not hardcoded** — it must be obtained dynamically from the `HostSet` navigation property on the `Account` entity.

### How to Obtain the Base URL

After authenticating, call:

```http
GET /Account?$expand=HostSet
User-Key: <your-key>
```

The response includes a `HostSet` object with URLs for all Ploomes services. Use the appropriate property depending on the caller type:

| Caller Type | HostSet Property | HostSet Property (Canary) | Example |
|-------------|-----------------|--------------------------|---------|
| **Frontend app** (web or mobile) | `HostSet.WebApiUrl` | `HostSet.WebApiCanaryUrl` | _(varies by account)_ |
| **Internal service** | `HostSet.PublicApiUrl` | `HostSet.PublicApiCanaryUrl` | _(varies by account)_ |
| **External service** | _(fixed)_ | _(fixed)_ | `https://public-api2.ploomes.com` |
| **Exporter service** | `HostSet.ExporterApi2Url` | — | _(varies by environment)_ |
| **PowerBI service** | `HostSet.ExporterPowerBiApi2Url` | — | _(varies by environment)_ |

### Rules

1. **Frontend apps (web, mobile):** Use `HostSet.WebApiUrl` for the stable version, or `HostSet.WebApiCanaryUrl` for the canary version.
2. **Internal services:** Use `HostSet.PublicApiUrl` for the stable version, or `HostSet.PublicApiCanaryUrl` for the canary version.
3. **External services / third-party integrations:** Use the fixed URL `https://public-api2.ploomes.com`. External consumers do not need to resolve HostSet.
4. **Exporter service:** Use `HostSet.ExporterApi2Url`.
5. **PowerBI service:** Use `HostSet.ExporterPowerBiApi2Url`.

### HostSet Data Model

The `HostSet` object contains URLs for all Ploomes platform services:

| Property | Type | Description |
|----------|------|-------------|
| Id | integer | HostSet ID |
| ApiUrl | string | Legacy API URL |
| WebApiUrl | string | **API2 URL for frontend apps (web/mobile)** |
| WebApiCanaryUrl | string | **API2 canary URL for frontend apps** |
| PublicApiCanaryUrl | string | **API2 canary URL for internal services** |
| WebUrl | string | Web application URL |
| WebVersion | string | Web application version |
| MobileVersion | string | Mobile app version |
| LogsApiUrl | string | Logging service URL |
| ReportsApiUrl | string | Reports service URL |
| ImportationApiUrl | string | Importation service URL |
| SocketApiUrl | string | WebSocket service URL |
| SocketHubUrl | string | WebSocket hub URL |
| Html2PdfApiUrl | string | HTML-to-PDF conversion service URL |
| AttachmentsApiUrl | string | Attachments service URL |
| CacheApiUrl | string | Cache service URL |
| CalcApiUrl | string | Calculation service URL |
| MailApiUrl | string | Mail service URL |
| MailSupervisorApiUrl | string | Mail supervisor service URL |
| CommandReportsApiUrl | string | Command reports service URL |
| ReportsGeneratorApiUrl | string | Reports generator service URL |
| IdentityProviderApiUrl | string | Identity provider service URL |
| ServiceChannelApiUrl | string | Service channel URL |
| PublicApiUrl | string | **API2 URL for internal services** |
| ExporterApiUrl | string | Exporter service URL |
| ExporterApi2Url | string | **API2 URL for the Exporter service** |
| ExporterPbiUrl | string | PowerBI exporter URL |
| ExporterPowerBiApi2Url | string | **API2 URL for the PowerBI service** |
| FrontendApiUrl | string | Frontend API URL |
| FrontendVersionPath | string | Frontend version path |
| ReportsV3ApiUrl | string | Reports V3 service URL |
| AggregatorApiUrl | string | Aggregator service URL |
| ApiaUrl | string | Apia service URL |
| SseApiUrl | string | Server-Sent Events URL |
| OperationScreenSocketUrl | string | Operation screen WebSocket URL |
| OperationScreenApiUrl | string | Operation screen API URL |

### Important

- **Never hardcode the API base URL.** Always resolve it from `HostSet` at startup or first request.
- The `HostSet` is tied to the account and determines which infrastructure cluster the account is routed to.
- Different accounts may have different `HostSet` configurations (e.g., for canary rollouts or regional deployments).

## Content Type

- Requests: `application/json` (PascalCase)
- Responses: `application/json` (PascalCase property names)
- Multipart: `multipart/form-data` (file uploads)
