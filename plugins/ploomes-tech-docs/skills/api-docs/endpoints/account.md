# /Account

> The Account entity represents the tenant (company) in the multi-tenant CRM. It manages account-level settings, plans, payments, integrations, modules, and SSO configuration.

## HostSet — Dynamic Base URL Resolution

The `Account` entity has a `HostSet` navigation property that contains all platform service URLs. **Every client must resolve the API base URL from HostSet before making any other API calls.**

```http
GET /Account?$expand=HostSet
User-Key: <your-key>
```

`GET /Account` is a collection request (no `({id})`), so the response is wrapped in
the OData collection envelope — the account is at `value[0]`, **not** the top level.
Read `HostSet` as `response.value[0].HostSet` (see [OData reference §11](../03-odata-reference.md#11-crud-shape)):

```json
{ "@odata.context": "...#Account(HostSet())", "value": [ { "Id": 12345678, "HostSet": { "WebApiUrl": "..." } } ] }
```

Use the appropriate `HostSet` property based on your caller type:

| Caller Type | HostSet Property | HostSet Property (Canary) | Fallback |
|-------------|-----------------|--------------------------|----------|
| **Frontend app** (web or mobile) | `HostSet.WebApiUrl` | `HostSet.WebApiCanaryUrl` | — |
| **Internal service** | `HostSet.PublicApiUrl` | `HostSet.PublicApiCanaryUrl` | — |
| **External service** | _(not needed)_ | _(not needed)_ | `https://public-api2.ploomes.com` |
| **Exporter service** | `HostSet.ExporterApi2Url` | — | — |
| **PowerBI service** | `HostSet.ExporterPowerBiApi2Url` | — | — |

See [Architecture Overview — Base URL](../01-overview.md#base-url-dynamic-via-hostset) for the complete HostSet data model and rules.

## Key Sub-Entities

- `/AccountModules` — Feature modules (CPQ, Automation, etc.)
- `/AccountIntegrations` — Third-party integrations (Meetime, RDStation, Reev, Jivo, MailChimp)
- `/AccountSSOTypes` — Single Sign-On configuration
- `/AccountSAMLSignatureTypes` — SAML signature types
- `/AccountMultiFactorAuthenticationTypes` — MFA configuration

## Data Model

See [Account data model](../data-models/account.md#account) for the full property table with settability information.

## /Account

> The Account entity represents the tenant (company) in the multi-tenant CRM. It manages account-level settings, plans, payments, integrations, modules, and SSO configuration.

## Key Sub-Entities

- `/AccountModules` — Feature modules (CPQ, Automation, etc.)
- `/AccountIntegrations` — Third-party integrations (Meetime, RDStation, Reev, Jivo, MailChimp)
- `/AccountSSOTypes` — Single Sign-On configuration
- `/AccountSAMLSignatureTypes` — SAML signature types
- `/AccountMultiFactorAuthenticationTypes` — MFA configuration

### GET `/Account`

- **Response**: OData collection of the account entity — it is at `value[0]`, **not** the
  top level (like every `GET /Set`; see [OData reference §11](../03-odata-reference.md#11-crud-shape)).
  The body is `{ "value": [ { ... } ] }` even though it holds a single account.

### PATCH `/Account`

- **Response**: Entity (entity)
- **Body**: JSON delta (only changed fields)
- Supports `?webhooks=false` to suppress webhook emission

### PATCH `/Account/{key}`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)
- **Body**: JSON delta (only changed fields)
- Supports `?webhooks=false` to suppress webhook emission

### POST `/Account/UploadLoginLogo`

- **Response**: Entity (entity)

### POST `/Account/UploadMenuLogo`

- **Response**: Entity (entity)

### POST `/Account/UploadIconLogo`

- **Response**: Entity (entity)

### POST `/Account/UploadAutomaticEmailLogo`

- **Response**: Entity (entity)

### POST `/Account/UploadLogo`

- **Response**: Entity (entity)

### GET `/Account/GetAttachmentStorageStatus`

- **Response**: `List<AccountAttachmentStorageResultObject>`

## /AccountFirstLoginTypes

### GET `/AccountFirstLoginTypes`

- **Response**: Entity (entity)

## /AccountIntegrations

### GET `/AccountIntegrations`

- **Response**: Entity (entity)

### POST `/AccountIntegrations`

- **Response**: Entity (entity)
- **Body**: JSON object with entity fields
- Supports `?webhooks=false` to suppress webhook emission

### PATCH `/AccountIntegrations/{key}`

- **Parameters**:
  - `key`: `int`
  - `webhooks`: `bool` (default: `true`)
- **Response**: Entity (entity)
- **Body**: JSON delta (only changed fields)
- Supports `?webhooks=false` to suppress webhook emission

## /AccountIntegrationsMeetime

### GET `/AccountIntegrationsMeetime`

- **Response**: Entity (entity)

### PATCH `/AccountIntegrationsMeetime/{key}`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)
- **Body**: JSON delta (only changed fields)
- Supports `?webhooks=false` to suppress webhook emission

## /AccountIntegrationsMeetimeAction

### GET `/AccountIntegrationsMeetimeAction`

- **Response**: `List<AccountIntegrationFieldMeetimeAction>`

## /AccountJivoIntegrationBehaviors

### GET `/AccountJivoIntegrationBehaviors`

- **Response**: Entity (entity)

## /AccountMailChimpIntegration

### GET `/AccountMailChimpIntegration`

- **Response**: Entity (entity)

### POST `/AccountMailChimpIntegration`

- **Response**: Entity (entity)
- **Body**: JSON object with entity fields
- Supports `?webhooks=false` to suppress webhook emission

### DELETE `/AccountMailChimpIntegration`

- **Response**: `200 OK`
- Performs soft delete

## /AccountModules

### GET `/AccountModules`

- **Response**: Entity (entity)

### PATCH `/AccountModules/{key}`

- **Parameters**:
  - `key`: `int`
- **Response**: Entity (entity)
- **Body**: JSON delta (only changed fields)
- Supports `?webhooks=false` to suppress webhook emission

### GET `/AccountModules/{key}/MeetingTranscriptionModuleAllowedUsers`

- **Parameters**:
  - `key`: `int`
- **Response**: `Collection(User)`

### POST `/AccountModules/{key}/SetMeetingTranscriptionModuleAllowedUsers`

- **Parameters**:
  - `key`: `int`
- **Response**: `Collection(User)`

## /AccountMultiFactorAuthenticationTypes

### GET `/AccountMultiFactorAuthenticationTypes`

- **Response**: Entity (entity)

## /AccountRDStationIntegrationBehaviors

### GET `/AccountRDStationIntegrationBehaviors`

- **Response**: Entity (entity)

## /AccountReevIntegrationBehaviors

### GET `/AccountReevIntegrationBehaviors`

- **Response**: Entity (entity)

## /AccountSAMLSignatureTypes

### GET `/AccountSAMLSignatureTypes`

- **Response**: Entity (entity)

## /AccountSSOTypes

### GET `/AccountSSOTypes`

- **Response**: Entity (entity)

