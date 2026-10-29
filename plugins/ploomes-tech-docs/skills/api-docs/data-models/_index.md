# Data Models Reference — Index

All data models organized by domain. Each file contains the primary entity model
(from endpoint documentation) plus all related navigation property types.


### Column Reference

Each property table includes the following columns:

| Column | Description |
|--------|-------------|
| **FieldKey** | The key used to reference this property in the Fields system (see [Fields & Entities](../07-fields-and-entities.md)). Empty if the property is not exposed as a field. |
| **Creatable** | **Yes** = can be set on `POST` (create). **No** = cannot be set on create; managed by the system. |
| **Editable** | **Yes** = can be set on `PATCH` (edit). **No** = cannot be set on edit; managed by the system. |

> **Note on Required vs Nullable**: If a field is not Required and is not Nullable, you may omit it from the payload (the API will set a default value), but you may not send it as `null`.

---

## Domains

| Domain | File | Models |
|--------|------|--------|
| Account | [account.md](account.md) | 16 |
| Approval | [approval.md](approval.md) | 1 |
| Attachment | [attachment.md](attachment.md) | 3 |
| Automation | [automation.md](automation.md) | 5 |
| BulkProcedure | [bulk-procedure.md](bulk-procedure.md) | 2 |
| BusinessRule | [business-rule.md](business-rule.md) | 7 |
| Chat | [chat.md](chat.md) | 2 |
| Checklist | [checklist.md](checklist.md) | 2 |
| CompanyPhone | [company-phone.md](company-phone.md) | 1 |
| Contact | [contact.md](contact.md) | 15 |
| Country | [country.md](country.md) | 2 |
| Deal | [deal.md](deal.md) | 14 |
| Document | [document.md](document.md) | 7 |
| DocumentTemplate | [document-template.md](document-template.md) | 6 |
| Email | [email.md](email.md) | 8 |
| Field | [field.md](field.md) | 15 |
| Filter | [filter.md](filter.md) | 4 |
| Form | [form.md](form.md) | 3 |
| HostSet | [host-set.md](host-set.md) | 1 |
| IdentityProvider | [identity-provider.md](identity-provider.md) | 1 |
| Importation | [importation.md](importation.md) | 5 |
| Integration | [integration.md](integration.md) | 10 |
| InteractionRecord | [interaction-record.md](interaction-record.md) | 4 |
| Lead | [lead.md](lead.md) | 6 |
| Log | [log.md](log.md) | 2 |
| Message | [message.md](message.md) | 2 |
| Note | [note.md](note.md) | 1 |
| Notification | [notification.md](notification.md) | 2 |
| Order | [order.md](order.md) | 7 |
| Other | [other.md](other.md) | 19 |
| Panel | [panel.md](panel.md) | 2 |
| Permission | [permission.md](permission.md) | 4 |
| Product | [product.md](product.md) | 5 |
| PublicDocument | [public-document.md](public-document.md) | 3 |
| PublicForm | [public-form.md](public-form.md) | 3 |
| Quote | [quote.md](quote.md) | 7 |
| Self | [self.md](self.md) | 2 |
| Table | [table.md](table.md) | 6 |
| Tag | [tag.md](tag.md) | 3 |
| Task | [task.md](task.md) | 7 |
| Team | [team.md](team.md) | 1 |
| Transcription | [transcription.md](transcription.md) | 1 |
| User | [user.md](user.md) | 4 |
| Webhook | [webhook.md](webhook.md) | 2 |

**Total: 223 models across 44 domains**
