# Contact — Data Models

Data models for the Contact domain.

### Column Reference

Each property table includes the following columns:

| Column | Description |
|--------|-------------|
| **FieldKey** | The key used to reference this property in the Fields system (see [Fields & Entities](../07-fields-and-entities.md)). Empty if the property is not exposed as a field. |
| **Creatable** | **Yes** = can be set on `POST` (create). **No** = cannot be set on create; managed by the system. |
| **Editable** | **Yes** = can be set on `PATCH` (edit). **No** = cannot be set on edit; managed by the system. |

> **Note on Required vs Nullable**: If a field is not Required and is not Nullable, you may omit it from the payload (the API will set a default value), but you may not send it as `null`.

---

### Contact


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No | contact_id | Yes | No |
| AccountId | integer | No |  | No | No |
| TypeId | integer | Yes | contact_type | Yes | No |
| Name | string | Yes | contact_name | Yes | Yes |
| LegalName | string | Yes | contact_legal_name | Yes | Yes |
| Register | string | Yes | contact_cpf | Yes | Yes |
| CNPJ | string | Yes | contact_cnpj | Yes | Yes |
| CPF | string | Yes | contact_cpf | Yes | Yes |
| StatusId | integer | Yes | contact_status | Yes | Yes |
| CompanyId | integer | Yes | contact_companies | Yes | Yes |
| RelationshipId | integer | Yes | contact_relationship | Yes | Yes |
| LineOfBusinessId | integer | Yes | contact_line_of_business | Yes | Yes |
| OriginId | integer | Yes | contact_origin | Yes | Yes |
| NumberOfEmployeesId | integer | Yes | contact_number_of_employees | Yes | Yes |
| ClassId | integer | Yes | contact_class | Yes | Yes |
| OwnerId | integer | Yes | contact_owner | Yes | Yes |
| Birthday | datetime | Yes | contact_birthday | Yes | Yes |
| NextAnniversary | datetime | Yes | contact_next_anniversary | No | No |
| PreviousAnniversary | datetime | Yes | contact_previous_anniversary | No | No |
| Note | string | Yes | contact_note | Yes | Yes |
| Email | string | Yes | contact_email | Yes | Yes |
| Website | string | Yes | contact_website | Yes | Yes |
| RoleId | integer | Yes | contact_role | Yes | Yes |
| DepartmentId | integer | Yes | contact_department | Yes | Yes |
| Skype | string | Yes | contact_skype | Yes | Yes |
| Facebook | string | Yes | contact_facebook | Yes | Yes |
| StreetAddress | string | Yes | contact_street_address | Yes | Yes |
| StreetAddressNumber | string | Yes | contact_street_address_number | Yes | Yes |
| StreetAddressLine2 | string | Yes | contact_street_address_line2 | Yes | Yes |
| Neighborhood | string | Yes | contact_neighborhood | Yes | Yes |
| ZipCode | integer | Yes | contact_zipcode | Yes | Yes |
| ForeignZipCode | string | Yes | contact_foreign_zipcode | Yes | Yes |
| ForeignZipCodeCountryId | integer | Yes | contact_zipcode_country | Yes | Yes |
| ForeignZipCodeWithoutMask | string | Yes |  | No | No |
| CityId | integer | Yes | contact_city | Yes | Yes |
| StateId | integer | Yes | contact_state | Yes | No |
| CountryId | integer | Yes | contact_country | Yes | No |
| CurrencyId | integer | Yes | contact_currency | Yes | Yes |
| EmailMarketing | boolean | Yes | contact_email_marketing | Yes | Yes |
| CNAECode | string | Yes | contact_cnae_code | Yes | Yes |
| CNAEName | string | Yes | contact_cnae_name | Yes | Yes |
| CNAESecondary | string | Yes | contact_cnae_secondary | Yes | Yes |
| Latitude | decimal | Yes | contact_latitude | Yes | Yes |
| Longitude | decimal | Yes | contact_longitude | Yes | Yes |
| ImportId | integer | Yes |  | No | No |
| CreateImportationId | integer | Yes | contact_create_importation_id | No | No |
| UpdateImportationId | integer | Yes | contact_update_importation_id | No | No |
| FirstTaskId | integer | Yes |  | No | No |
| FirstTaskDate | datetime | Yes |  | No | No |
| LastInteractionRecordId | integer | Yes | contact_last_interaction_record | No | No |
| LastDealId | integer | Yes | contact_lead_deal | No | No |
| LastOrderId | integer | Yes | contact_last_order | No | No |
| LastDocumentId | integer | Yes | contact_last_document | No | No |
| LastQuoteId | integer | Yes |  | No | No |
| TasksOrdination | integer | Yes |  | No | No |
| LeadId | integer | Yes | contact_lead | No | No |
| Editable | boolean | Yes |  | No | No |
| Deletable | boolean | Yes |  | No | No |
| CreatorId | integer | Yes | contact_creator | No | No |
| UpdaterId | integer | Yes | contact_updater | No | No |
| CreateDate | datetime | Yes | contact_create_date | No | No |
| LastUpdateDate | datetime | Yes | contact_last_update_date | No | No |
| Key | string | Yes | contact_key | Yes | Yes |
| AvatarUrl | string | Yes | contact_avatar_url | Yes | Yes |
| LastCompanyId | integer | Yes |  | No | No |
| IdentityDocument | string | Yes | contact_identity_document | Yes | Yes |
| HasScheduledTasks | boolean | Yes | contact_has_scheduled_tasks | No | No |
| ImportationIdCreate | string | Yes | contact_create_new_importation_id | No | No |
| ImportationIdUpdate | string | Yes | contact_update_new_importation_id | No | No |
| PublicFormIdCreate | string | Yes | contact_create_public_form_id | No | No |
| PublicFormIdUpdate | string | Yes | contact_update_public_form_id | No | No |


**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Type | ContactType | No | contact_type | Yes | No |
| Status | ContactStatus | No | contact_status | Yes | Yes |
| Company | Contact | No | contact_company | Yes | Yes |
| Phones | Collection(ContactPhone) | Yes | contact_phones | Yes | Yes |
| Relationship | ContactRelationship | No | contact_relationship | Yes | Yes |
| LineOfBusiness | ContactLineOfBusiness | No | contact_line_of_business | Yes | Yes |
| Origin | ContactOrigin | No | contact_origin | Yes | Yes |
| NumberOfEmployees | ContactNumberOfEmployees | No | contact_number_of_employees | Yes | Yes |
| Class | ContactClass | No | contact_class | Yes | Yes |
| Owner | User | No | contact_owner | Yes | Yes |
| Role | Role | No | contact_role | Yes | Yes |
| Department | Department | No | contact_department | Yes | Yes |
| Addresses | Collection(ContactAddress) | Yes |  | No | No |
| ForeignZipCodeCountry | Country | No | contact_zipcode_country | Yes | Yes |
| City | City | No | contact_city | Yes | Yes |
| State | CountryState | No | contact_state | Yes | No |
| Country | Country | No | contact_country | Yes | No |
| Currency | Currency | No | contact_currency | Yes | Yes |
| Import | ContactImport | No |  | No | No |
| Tags | Collection(TagItem) | Yes | contact_tags | Yes | Yes |
| OtherProperties | Collection(ContactFieldValue) | Yes |  | No | No |
| FirstTask | Task | No |  | No | No |
| Tasks | Collection(Task) | Yes | contact_tasks | No | No |
| TaskContacts | Collection(TaskContact) | Yes |  | No | No |
| LastInteractionRecord | InteractionRecord | No | contact_last_interaction_record | No | No |
| InteractionRecords | Collection(InteractionRecord) | Yes |  | No | No |
| LastDeal | Deal (nullable) | No | contact_lead_deal | No | No |
| LastOrder | Order (nullable) | No | contact_last_order | No | No |
| LastDocument | Document (nullable) | No | contact_last_document | No | No |
| LastQuote | Quote | No |  | No | No |
| Attachments | Collection(Attachment) | Yes |  | No | No |
| AttachmentsItems | Collection(AttachmentItemRelation) | Yes |  | No | No |
| CollaboratingUsers | Collection(ContactCollaboratingUser) | Yes | contact_collaborating_users | Yes | Yes |
| Lead | Lead | No | contact_lead | No | No |
| Products | Collection(ContactProduct) | Yes | contact_products | Yes | No |
| Creator | User | No | contact_creator | No | No |
| Updater | User | No | contact_updater | No | No |
| Contacts | Collection(Contact) | Yes | contact_contacts | No | No |
| Companies | Collection(ContactCompany) | Yes | contact_companies | Yes | Yes |
| OtherContacts | Collection(ContactCompany) | Yes |  | No | No |
| ParentContacts | Collection(ContactParentContact) | Yes |  | No | No |

---


### ContactAddress


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| Main | boolean | No |  | No | No |
| Name | string | Yes |  | No | No |
| StreetAddress | string | Yes |  | No | No |
| StreetAddressLine2 | string | Yes |  | No | No |
| Neighborhood | string | Yes |  | No | No |
| ZipCode | integer | Yes |  | No | No |
| CityId | integer | Yes |  | No | No |
| Latitude | number | Yes |  | No | No |
| Longitude | number | Yes |  | No | No |

**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Contact | Contact | No |  | No | No |
| City | City | No |  | No | No |

---


### ContactClass


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| Name | string | Yes | contact_class_name | Yes | Yes |
| Icon | string | Yes |  | No | No |

---


### ContactCollaboratingUser


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |

**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Contact | Contact | No |  | No | No |
| User | User | No |  | No | No |

---


### ContactCompany


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| ContactId | integer | Yes |  | No | No |
| CompanyId | integer | Yes |  | No | No |

**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Contact | Contact | No |  | No | No |
| Company | Contact | No |  | No | No |

---

### ContactImport


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| Editable | boolean | No |  | No | No |
| UpdaterId | integer | Yes |  | No | No |

---


### ContactLineOfBusiness


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| Name | string | Yes | contact_line_of_business_name | Yes | Yes |
| LastUpdateDate | datetime | Yes |  | No | No |

---


### ContactNumberOfEmployees


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| Name | string | Yes | contact_number_of_employees_name | Yes | Yes |
| LastUpdateDate | datetime | Yes |  | No | No |

---


### ContactOrigin


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| Name | string | Yes | contact_origin_name | Yes | Yes |
| LastUpdateDate | datetime | Yes |  | No | No |

---


### ContactParentContact


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| ContactId | integer | Yes |  | No | No |
| ParentContactId | integer | Yes |  | No | No |

**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Contact | Contact | No |  | No | No |
| ParentContact | Contact | No |  | No | No |

---


### ContactPhone


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| ContactId | integer | Yes |  | No | No |
| PhoneNumber | string | Yes |  | No | No |
| SearchPhoneNumber | integer | Yes |  | No | No |
| CountryId | integer | Yes |  | No | No |

**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Contact | Contact | No |  | No | No |
| FullContact | ContactTotalView | No |  | No | No |
| Type | PhoneType | No |  | No | No |
| Country | Country | No |  | No | No |

---


### ContactProduct


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No | contact_product_id | Yes | No |
| ContactId | integer | Yes | contact_product_contact | Yes | Yes |
| ProductId | integer | Yes | contact_product_product | Yes | Yes |
| Name | string | Yes | contact_product_name | Yes | Yes |
| Code | string | Yes | contact_product_code | Yes | Yes |
| CreatorId | integer | Yes |  | No | No |
| CreateDate | datetime | No |  | No | No |
| UpdaterId | integer | Yes |  | No | No |
| LastUpdateDate | datetime | No |  | No | No |
| Editable | boolean | No |  | No | No |
| Deletable | boolean | No |  | No | No |

**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Contact | Contact | No | contact_product_contact | Yes | Yes |
| Product | Product | No | contact_product_product | Yes | Yes |
| OtherProperties | Collection(ContactProductFieldValue) | Yes |  | No | No |
| Creator | User | No |  | No | No |
| Updater | User | No |  | No | No |

---


### ContactRelationship


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| Name | string | Yes | contact_relationship_name | Yes | Yes |

---


### ContactStatus


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| Name | string | Yes | contact_status_name | Yes | Yes |
| Label | string | Yes |  | No | No |
| Icon | string | Yes |  | No | No |
| ImageName | string | Yes |  | No | No |
| Color | string | Yes |  | No | No |
| Prospect | boolean | No |  | No | No |
| Discarded | boolean | No |  | No | No |

**Navigation Properties** (expandable via `$expand`):

| Property | Type | Collection | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Languages | Collection(ContactStatusLanguage) | Yes |  | No | No |

---


### ContactType


| Property | Type | Nullable | FieldKey | Creatable | Editable |
|----------|----------|----------|----------|----------|----------|
| Id | integer | No |  | No | No |
| Name | string | Yes | contact_type_name | Yes | Yes |

---
