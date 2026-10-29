# Rate Limiting

## Overview

The API enforces rate limiting using a fixed-window algorithm. Requests exceeding the limit receive a `429 Too Many Requests` response.

## Limits

| Parameter | Value |
|-----------|-------|
| Algorithm | Fixed window |
| Window size | 1 minute |
| Limit | **Not readable through the API.** Plan for 120 requests/minute per key — see below |

> `MaximumRequestsPerMinute` is not in `$metadata` and cannot be read through the
> API. Size bulk work at **120 requests per minute per key** and honour `Retry-After`
> when a `429` arrives.

## Rate Limit Response

When the limit is exceeded:

```http
HTTP/1.1 429 Too Many Requests
Retry-After: <seconds-until-window-resets>

{N} requests per minute exceeded
```

The `Retry-After` header indicates how many seconds to wait before retrying.

## Best Practices for AI Agents

1. **Respect `Retry-After`**: when receiving a `429`, wait the indicated number of seconds before retrying.
2. **Avoid redundant calls**: cache responses when the data doesn't change frequently.

The query-shape rules that also reduce server load — batching related data with `$expand` instead of many calls (§15.6), minimizing `$select` (§15.1), right-sizing `$top` (§5), and lightweight counts (§6.1) — are documented in the [OData Reference](03-odata-reference.md). Follow those.
