# /Self

> The authenticated user's session, preferences, and identity. This is the entry point for authentication.

## Data Model

See [Self data model](../data-models/self.md#self) for the full property table with settability information.

## Endpoints

### GET `/Self`

Returns the authenticated user's profile and session data.

- **Response**: OData collection of `SelfView` — the entity is at `value[0]`, **not** the top level. Like every `GET /Set` (see [OData reference §11](../03-odata-reference.md#11-crud-shape)), the body is wrapped in the collection envelope even though it always holds a single element:
  ```json
  { "@odata.context": "...#Self", "value": [ { "Id": 12345678, "Name": "...", "...": "..." } ] }
  ```
  Read the user as `response.value[0]`. (The `SelfView` *entity* describes the shape of that single element — see the data model link above.)
- **Auth required**: Yes (any valid key type)

> Code embedded in a Developer custom field (TypeId 22) does not call this endpoint
> to get its key: the CRM Web host injects a `PloomesServer` global that already
> carries the signed-in user's self. See
> [Authentication → Option 5](../02-authentication.md#option-5-embedded-custom-code-developer-field-typeid-22).
>
> **The code runs with the session of whoever opens the record.** The `UserKey` that
> `getSelf()` returns is that person's key: never send it to a third party and never
> store it outside Ploomes.

### PATCH `/Self/{key}`

Update the authenticated user's preferences.

- **Parameters**:
  - `key`: `int` (user ID)
- **Body**: JSON delta with updatable fields (Name, Phone, Language, etc.)
- **Response**: Updated `SelfView` entity

### POST `/Self/Login`

Authenticate with email and password. **No auth header required.**

- **Body**:
```json
{
  "Email": "user@company.com",
  "Password": "your-password",
  "MobileCode": "(optional) mobile app code"
}
```
- **Response**: `SelfView` entity including `UserKey` for subsequent requests
- **Errors**:
  - `400` — Missing Email or Password
  - `401` — Invalid credentials
  - If MFA is enabled, returns a response indicating MFA is required

### POST `/Self/ValidateMultiFactorAuthenticationCode`

Validate MFA code after login. **No auth header required.**

- **Body**:
```json
{
  "Email": "user@company.com",
  "MultiFactorAuthenticationCode": 123456
}
```
- **Response**: `SelfView` entity with `UserKey`

### POST `/Self/Logout`

Invalidate the current session key.

- **Response**: `SelfView` entity

### POST `/Self/GenerateImportationKey`

Generate a temporary importation key (valid for 2 days).

- **Response**: `SelfView` entity with populated `ImportationKey` field

### POST `/Self/EraseImportationKey`

Revoke the active importation key.

- **Response**: `SelfView` entity

### POST `/Self/GenerateExportationKey`

Generate a temporary exportation key (valid for 15 days).

- **Response**: `SelfView` entity

### POST `/Self/EraseExportationKey`

Revoke the active exportation key.

- **Response**: `SelfView` entity

### POST `/Self/ResetNotificationsCounter`

Reset the unread notifications counter to zero.

- **Response**: `SelfView` entity

### POST `/Self/ResetDealsCounter`

Reset the unread deals counter to zero.

- **Response**: `SelfView` entity

### POST `/Self/ResetLeadsCounter`

Reset the unread leads counter to zero.

- **Response**: `SelfView` entity

### POST `/Self/LogPage`

Log a page visit for analytics.

- **Body**: JSON object with page information
- **Response**: `200 OK`

### POST `/Self/LogWebApplication`

Log a web application event.

- **Body**: JSON object with event data
- **Response**: `200 OK`

### POST `/Self/AnswerNPSSurvey`

Submit a Net Promoter Score survey response.

- **Body**:
```json
{
  "Score": 9,
  "Comments": "Great product!"
}
```
- **Response**: `SelfPromoterScore` entity

### POST `/Self/ForgotPassword`

Request a password reset email. **No auth header required.**

- **Body**:
```json
{
  "Email": "user@company.com"
}
```
- **Response**: `200 OK`

### POST `/Self/ResetPassword`

Reset password using the verification hash from email. **No auth header required.**

- **Body**:
```json
{
  "ForgotPasswordVerificationHash": "<hash-from-email>",
  "Password": "new-password"
}
```
- **Response**: `200 OK`

### POST `/Self/GenerateGoogleAuthenticator`

Generate a Google Authenticator setup for MFA.

- **Response**: `GoogleAuthenticator` object with QR code data

### POST `/Self/SaveGoogleAuthenticator`

Confirm and save Google Authenticator MFA setup.

- **Response**: `SelfView` entity

### POST `/Self/ResetGoogleAuthenticator`

Remove Google Authenticator MFA.

- **Response**: `SelfView` entity

---

## /SelfCounters

### GET `/SelfCounters`

Get the current user's notification and activity counters.

- **Response**: Counter entity

---

## /SelfDealsOrdinations

### GET `/SelfDealsOrdinations`

Get the user's deal sorting preferences.

- **Response**: Ordination entity

---

## /SelfEmailIntegration

### POST `/SelfEmailIntegration/ActivatePop`

Activate POP email integration.

### POST `/SelfEmailIntegration/DisablePop`

Disable POP email integration.

### POST `/SelfEmailIntegration/ActivateImap`

Activate IMAP email integration.

### POST `/SelfEmailIntegration/DisableImap`

Disable IMAP email integration.

### POST `/SelfEmailIntegration/ActivateSmtp`

Activate SMTP email integration.

### POST `/SelfEmailIntegration/DisableSmtp`

Disable SMTP email integration.

### POST `/SelfEmailIntegration/UpdateEmailSync`

Update email sync settings.

- **Parameters**:
  - `emailIntegrationId`: `int`
  - `isStarting`: `bool`

### POST `/SelfEmailIntegration/PloomesEmailExists`

Check if a Ploomes email address exists.

- **Response**: `boolean`

---

## /SelfGoogleCalendarIntegration

### POST `/SelfGoogleCalendarIntegration`

Create Google Calendar integration.

- **Body**: JSON object with integration settings

### PATCH `/SelfGoogleCalendarIntegration`

Update Google Calendar integration settings.

- **Body**: JSON delta

### DELETE `/SelfGoogleCalendarIntegration`

Remove Google Calendar integration.

---

## /SelfGoogleCalendarIntegrationCalendars

### GET `/SelfGoogleCalendarIntegrationCalendars`

List available Google Calendar calendars for the integration.
