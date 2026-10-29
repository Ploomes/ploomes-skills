# /Approvals

## Data Model

See [Approval data model](../data-models/approval.md#approval) for the full property table with settability information.

## Endpoints

### GET `/Approvals`

- **Response**: Entity (entity)

> **`/Approvals` is the history of decisions already taken — not the pending queue.**
> To list what a given approver still has to decide, query the entity itself:
>
> ```http
> GET /Quotes?$filter=ApprovalStatusId eq 1 and ApprovalLevel/Users/any(u: u/UserId eq {UserId})
> ```
>
> The same shape works on `/Orders`.
