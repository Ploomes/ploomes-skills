# Error Reference

## Error Response Format

All errors follow this JSON envelope:

```json
{
  "value": "Error message description"
}
```

For OData-specific errors, the format is:

```json
{
  "error": {
    "code": "...",
    "message": "..."
  }
}
```

## HTTP Status Codes

| Status Code | Meaning | Common Causes |
|-------------|---------|---------------|
| `200 OK` | Success | Successful GET, POST, PATCH, DELETE |
| `400 Bad Request` | Invalid request | OData validation error, malformed filter, missing required fields, business rule violation, invalid file format |
| `401 Unauthorized` | Authentication failed — **or the resource is gone** | Invalid or missing auth key, permission denied for specific action, pending checklist, **a resource that no longer exists** (e.g. `DELETE` of an already-deleted option), **a missing `?adminValidation=true`**, or a key written in a form the route doesn't accept (`/Fields(<Id>)`) |

> **Do not read `401` as "no permission" on its own.** It is returned for several
> unrelated conditions, including acting on something that has already been deleted
> and calling an options route without `?adminValidation=true` — measured with an
> Administrator profile. Confirm the resource exists, and the path form is right,
> before investigating permissions.
| `403 Forbidden` | Access denied | Account expired, password reset required, whitelist restriction |
| `404 Not Found` | Resource not found | Entity not found or not visible to calling user (row-level security) |
| `408 Request Timeout` | Timeout | SQL query timeout |
| `409 Conflict` | Conflict | Automation conflict, quote review on outdated revision, duplicate email for user |
| `423 Locked` | Resource locked | Concurrent modification (optimistic concurrency check failed) |
| `429 Too Many Requests` | Rate limited | Exceeded per-minute request limit |
| `502 Bad Gateway` | External service error | Apia service communication failure |
| `504 Gateway Timeout` | Query timeout | Heavy `$count`, unbounded `$apply`, complex query |

## Exception Mapping

The `GlobalExceptionHandler` maps .NET exceptions to HTTP status codes:

| Exception Type | HTTP Status | Message |
|----------------|-------------|---------|
| `FormatException` | 400 | "Your request has a wrong format" |
| `ODataException` | 400 | "Your querystring has a wrong format: {details}" |
| `MissingFieldException` | 400 | "You must use a filter to call this action" |
| `AccumulatorFieldException` | 400 | (dynamic message) |
| `AutomationActionException` | 400 | (dynamic message) |
| `ImageException` | 400 | (dynamic message) |
| `InvalidFileException` | 400 | (dynamic message) |
| `UnauthorizedAccessException` | 401 | "You do not have permission to access this resource" |
| `PendingCheckListException` | 401 | "There is a pending checklist to be completed" |
| `DealException` | 401 | (dynamic message) |
| `AutomationExeption` | 409 | (dynamic message) |
| `QuoteReviewOnOutdatedRevisionException` | 409 | (dynamic message) |
| `UserEmailAlreadyExistsException` | 409 | (dynamic message) |
| `DbUpdateConcurrencyException` | 423 | "There are locked items for this resource" |
| `DbUpdateException` | 500 | "An error has occurred" |
| `CentralApiIntegrationException` | 500 | "Could not integrate with central api. {details}" |
| `MergeEntitiesException` | 500 | (inner exception message) |
| `InvalidChartDefinitionException` | 500 | (dynamic message) |
| `TimeoutException` | 408 | "The request has timed out. Please try again later." |
| `SqlException` | 504 | "The request has timed out. Please try again later." |
| `LimitOfTimeoutsException` | 504 | (dynamic message) |
| `CalculationTimeoutException` | 504 | (dynamic message) |
| `ApiaRequestException` | 502 | "An error occurred while communicating with Apia. Try again later." |
| Any other exception | 500 | "An error has occurred" |

## Common Business Error Messages

### Contacts
- "Your profile doesn't have permission to create a company"
- "Your profile doesn't have permission to create a person"
- "Contacts limit reached for this company"

### Deals
- "Your profile doesn't have permission to create a deal"
- "Your profile doesn't have permission to win a deal"
- "Your profile doesn't have permission to lose a deal"
- "Your profile doesn't have permission to reopen a deal"
- "There is a pending checklist to be completed"
- "Not found the ghost contact"
- "You don't have permission to merge deals."
- "Deals cannot be merged. In order to merge Deals, they must have the same Owner/Contact/Pipeline."
- "You cannot perform this action, Deal in merge."

### Pipeline Rules
- "MayWinDeals is false: cannot win deals on this pipeline."
- "WinDealOnLastStage is true: cannot win deal on stage other than last one."
- "MayLoseDeals is false: cannot lose deals on this pipeline."
- "ForbiddenStageReturn is true: new stage cannot be greater than new stage."
- "MustPassAllStages is true: deal cannot jump stages."
- "NoAllowedPipelines is true: cannot change deal to other pipeline."

### Quotes / Orders / Documents
- "Your profile doesn't have permission to create/edit/delete/share a quote"
- "Unable to proceed this action because quote/order/document module or automation documents module is not active"

### Fields
- "Your profile doesn't have permission to create/edit/delete a field"
- "Unable to perform this action because CPQ module is not active"
- "Invalid values to the field type 22"

### Products
- "The product is not editable"

### Users
- "You don't have permission to edit this user's profile. Users marked as AccountOwners cannot have their profiles altered."

### Images
- "Invalid image format. Ensure that your image is in BMP, GIF, EXIF, JPG, PNG, or TIFF formats."

### General Search
- "The provided entity is invalid. To be valid, it must be one of the following: (1, 2, 4, 7, 10, 24, 66, 75)."
- "The provided FieldKey is invalid."
- "The Language is not supported."

### Generic
- "{Entity} of id {id} is not accessible or not exists"
- "The field {fieldName} is missing or sent in an invalid format"
- "The provided JSON object cannot be null."
