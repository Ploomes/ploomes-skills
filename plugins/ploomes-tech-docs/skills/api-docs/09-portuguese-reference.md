# Referência Português ↔ API (Tradução de Entidades)

Esta tabela permite que agentes de IA traduzam comandos recebidos em português para os endpoints e entidades corretos da API.

Quando um comando é recebido em português (ex: "crie um novo negócio"), use esta tabela para identificar o endpoint correto (`/Deals`) e a entidade correspondente.

## Tabela de Entidades

> Entries marked _(nav property only)_ do not have a standalone endpoint. Access them via `$expand` on the parent entity or through a parent-scoped route.

| EntityId | API Endpoint (`ApiUrl`) | Nome em Português |
|----------|------------------------|-------------------|
| 1 | `/Contacts` | Cliente |
| 2 | `/Deals` | Negócio |
| 3 | `/Leads` | Lead |
| 4 | `/Orders` | Venda |
| 5 | `/Orders/Sections` _(nav property only)_ | Bloco de proposta |
| 7 | `/Quotes` | Proposta |
| 10 | `/Products` | Produto |
| 11 | `/ProductsGroups` | Grupo do produto |
| 12 | `/Tasks` | Tarefa |
| 14 | `/QuotesProducts` | Produto da proposta |
| 15 | `/Account` | Minha conta |
| 17 | `/Currencies` | Moeda |
| 20 | `/OrdersProducts` | Produto da venda |
| 21 | `/QuotesProductsParts` | Vínculo do produto da proposta |
| 22 | `/Self` | Meu usuário |
| 23 | `/Tags` | Marcador |
| 24 | `/Users` | Usuário |
| 25 | `/Cities` | Cidade |
| 26 | `/CitiesCountriesStates` | Estado |
| 27 | `/CitiesCountries` | País |
| 29 | `/PhoneTypes` | Tipo de telefone |
| 30 | `/Teams` | Equipe |
| 31 | `/DealsStages` | Estágio do negócio |
| 33 | `/DealsLossReasons` | Motivo de perda do negócio |
| 34 | `/QuotesInstallments` | Parcela da proposta |
| 35 | `/ContactsOrigins` | Origem do cliente |
| 36 | `/InteractionRecords` | Registro de Interação |
| 37 | `/ContactsLinesOfBusiness` | Segmento do cliente |
| 38 | `/Roles` | Cargo |
| 39 | `/Departments` | Departamento |
| 40 | `/ContactsNumbersOfEmployees` | Número de funcionários |
| 41 | `/ProductsParts` | Vínculo de produtos |
| 42 | `/UsersProfiles` | Perfil de usuário |
| 43 | `/ProductsFamilies` | Família do produto |
| 44 | `/DealsPipelines` | Funil de negócios |
| 45 | `/OrdersStages` | Estágios da venda |
| 46 | `/ContactsRelationships` | Tipo de relação de cliente |
| 47 | `/ContactsStatus` | Status de cliente |
| 48 | `/ContactsClasses` | Classe de cliente |
| 49 | `/ContactsTypes` | Tipo de cliente |
| 50 | `/DocumentTemplates` | Modelo do documento |
| 52 | `/LeadsStatus` | Situação do lead |
| 53 | `/QuotesApprovalStatus` | Situação da aprovação |
| 54 | `/LeadsDiscardReasons` | Motivo de descarte do lead |
| 55 | `/Messages` | Informe |
| 56 | `/Emails` | E-mail |
| 57 | `/Comments` | Comentário |
| 58 | `/Attachments` | Anexo |
| 59 | `/DealsStatus` | Situação do negócio |
| 60 | `/Emails/Recipients` _(nav property only)_ | Destinatário de e-mail |
| 61 | `/EmailsStatus` | Situação de e-mail |
| 62 | `/EmailsTemplates` | Template de e-mail |
| 63 | `/TasksTypes` | Tipo de tarefa |
| 64 | `/Panels` | Painel de relatórios |
| 65 | `/IntegrationsFieldsOptionsTablesOptions` | Opções da integração |
| 66 | `/Documents` | Documento |
| 67 | `/Documents/Sections` _(nav property only)_ | Bloco do documento |
| 68 | `/DocumentsProducts` | Produto do documento |
| 69 | `/OrdersProductsParts` | Vínculo do produto da venda |
| 70 | `/DocumentsProductsParts` | Vínculo do produto do documento |
| 71 | `/OrdersInstallments` | Parcela da venda |
| 72 | `/Documents/Installments` _(nav property only)_ | Parcela do documento |
| 73 | `/RelatedPeople` _(nav property only)_ | Contato relacionado |
| 74 | `/AccountIntegrations` | Integrações |
| 75 | `/ContactsProducts` | Produto do cliente |
| 76 | `/ProductsLists` | Lista de produtos |
| 77 | `/Fields` | Campo |
| 80 | `/FieldsTypes` | Tipo de campo |
| 81 | `/Forms` | Formulários |
| 83 | `/ProductsPartsGroups` | Categoria de vínculos |
| 84 | `/Words` | Palavras |
| 85 | `/WordsVerbs` | Verbos |
| 86 | `/Icons` | Ícones |
| 87 | `/FieldsOptionsTablesOptions` | Opções |
| 88 | `/Chats` | Chat |
| 89 | `/EmailsFolders` | Pasta de e-mail |
| 90 | `/EmailsGroups` | Grupo de Emails |
| 91 | `/UsersLogsChangesChanges` | Registro de modificação |
| 92 | `/WebhooksActions` | Ação de webhook |
| 93 | `/FieldsEntities` | Entidade |
| 94 | `/FieldsEntitiesPaths` | Caminhos entre entidades |
| 95 | `/AttachmentsFolders` | Pasta de anexo |
| 98 | `/Tables` | Aba |
| 99 | `/PanelsGoals` | Meta |
| 100 | `/Timeline` | Timeline |
| 101 | `/PanelsCharts` | Gráfico |
| 102 | `/BusinessRules` | Fluxo de aprovação |
| 103 | `/Automations` | Automação |
| 104 | `/TasksRepeatIntervalUnits` | Intervalo de repetição de tarefa |
| 105 | `/InteractionRecordsCallStatus` | Status da chamada no registro de interação |
| 106 | `/Checklists` | Checklist de negócios |
| 107 | `/DealsPriority` | Prioridade de negócio |
| 108 | `/DealsFieldsStatus` | Status de campo de negócio |
| 109 | `/AttachmentsItemsProcessingStatus` | Estado de Processamento do anexo |

## Como Usar Esta Tabela

1. **Recebendo comando em português**: Identifique a entidade mencionada na coluna "Nome em Português"
2. **Encontre o endpoint**: Use a coluna "API Endpoint" para saber qual rota da API chamar
3. **Use o EntityId**: O `EntityId` é usado internamente para referência em Fields e outras entidades relacionais

### Exemplos de Tradução

| Comando em Português | Endpoint da API | Ação HTTP |
|---------------------|-----------------|-----------|
| "Crie um novo cliente" | `POST /Contacts` | Criar contato |
| "Liste os negócios" | `GET /Deals` | Listar negócios |
| "Atualize a proposta" | `PATCH /Quotes({id})` | Atualizar proposta |
| "Apague a tarefa" | `DELETE /Tasks({id})` | Deletar tarefa |
| "Crie um lead" | `POST /Leads` | Criar lead |
| "Liste as vendas" | `GET /Orders` | Listar pedidos/vendas |
| "Crie um registro de interação" | `POST /InteractionRecords` | Criar registro de interação |
| "Liste os produtos da proposta" | `GET /QuotesProducts?$filter=QuoteId eq {id}` | Listar produtos da proposta |
| "Crie uma automação" | `POST /Automations` | Criar automação |
| "Liste os estágios do negócio" | `GET /DealsStages` | Listar estágios |

### Termos Comuns

| Português | Inglês (API) |
|-----------|-------------|
| Cliente | Contact |
| Negócio | Deal |
| Proposta | Quote |
| Venda / Pedido | Order |
| Tarefa | Task |
| Campo | Field |
| Funil | Pipeline |
| Estágio / Etapa | Stage |
| Anexo | Attachment |
| Marcador | Tag |
| Equipe | Team |
| Usuário | User |
| Moeda | Currency |
| Cargo | Role |
| Departamento | Department |
| Modelo do documento | Document Template |
| Registro de Interação | Interaction Record |
| Fluxo de aprovação | Business Rule |
| Automação | Automation |
| Informe | Message |
| Comentário | Comment |
| Painel de relatórios | Panel |
| Aba | Table |
| Meta | Goal |
| Gráfico | Chart |
| Checklist de negócios | Checklist |

## Referência de Campos (Fields)

Esta seção mapeia os campos nativos (FieldKey) de cada entidade para seus nomes em português.
Campos estão vinculados a entidades — o mesmo nome de campo pode ter significados diferentes dependendo da entidade.

> Para identificar um campo, use a combinação de **EntityId** + **FieldKey**.

### Tasks (EntityId: 12)

| FieldKey | Nome em Português |
|----------|-------------------|
| `task_title` | Título |
| `task_description` | Descrição |
| `task_date` | Data |
| `task_time` | Horário |
| `task_length` | Duração |
| `task_repeat_interval_length` | Repetir a cada |
| `task_repeat_interval_unit` | Intervalo de repetição |
| `task_email_reminder` | Lembrete por e-mail |
| `task_contact` | Cliente |
| `task_tags` | Marcadores |
| `task_contacts` | Contatos relacionados |
| `task_users` | Usuários |
| `task_address` | Endereço |
| `task_creates_event` | Enviar convite às pessoas relacionadas |
| `task_finished` | Finalizada |
| `task_creator` | Criador |
| `task_id` | Id |
| `task_create_date` | Data de criação |
| `task_type` | Tipo |
| `task_latitude` | Latitude |
| `taskct_longitude` | Longitude |
| `task_no_time` | Tarefa sem horário |
| `task_owners` | Responsáveis |
| `task_transcription_prompt` | Modelo de resumo |
| `allow_meeting_transcription` | Transcrição automática |

### Contacts (EntityId: 1)

| FieldKey | Nome em Português |
|----------|-------------------|
| `contact_name` | Nome |
| `contact_legal_name` | Razão social |
| `contact_cnpj` | CNPJ |
| `contact_cpf` | CPF |
| `contact_status` | Status |
| `contact_company` | Empresa |
| `contact_phones` | Telefones |
| `contact_relationship` | Relação |
| `contact_line_of_business` | Segmento |
| `contact_origin` | Origem |
| `contact_class` | Classe |
| `contact_owner` | Responsável |
| `contact_birthday` | Data de nascimento |
| `contact_note` | Observações |
| `contact_email` | E-mail |
| `contact_website` | Site |
| `contact_role` | Cargo |
| `contact_department` | Departamento |
| `contact_skype` | Skype |
| `contact_facebook` | Facebook |
| `contact_street_address` | Endereço |
| `contact_street_address_line2` | Complemento |
| `contact_neighborhood` | Bairro |
| `contact_zipcode` | CEP |
| `contact_city` | Cidade |
| `contact_currency` | Moeda |
| `contact_type` | Tipo |
| `contact_tags` | Marcadores |
| `contact_number_of_employees` | Número de funcionários |
| `contact_email_marketing` | Recebe e-mail marketing |
| `contact_tasks` | Tarefas |
| `contact_create_date` | Data de criação |
| `contact_last_interaction_record` | Último contato |
| `contact_last_order` | Última venda |
| `contact_creator` | Criador |
| `contact_lead` | Lead origem |
| `contact_collaborating_users` | Usuários colaboradores |
| `contact_id` | Id |
| `contact_cnae_code` | Código CNAE |
| `contact_cnae_name` | Descrição CNAE |
| `contact_create_importation_id` | Importação de criação |
| `contact_update_importation_id` | Importação de atualização |
| `contact_street_address_number` | Número (endereço) |
| `contact_state` | Estado |
| `contact_country` | País |
| `contact_products` | Produtos |
| `contact_last_document` | Último documento |
| `contact_contacts` | Contatos |
| `contact_next_anniversary` | Próximo aniversário |
| `contact_previous_anniversary` | Último aniversário |
| `contact_companies` | Empresas |
| `contact_latitude` | Latitude |
| `contact_longitude` | Longitude |
| `contact_key` | Chave externa |
| `contact_avatar_url` | Avatar |
| `contact_cnae_secondary` | Atividades Secundárias |
| `contact_foreign_zipcode` | Código Postal Internacional |
| `contact_identity_document` | Documento de identidade Internacional |
| `contact_create_new_importation_id` | Id da importação de criação (novo) |
| `contact_update_new_importation_id` | Id da importação de atualização (novo) |
| `contact_has_scheduled_tasks` | Possui tarefas agendadas |
| `contact_create_public_form_id` | Id do formulário externo de criação |
| `contact_update_public_form_id` | Id do formulário externo de atualização |
| `contact_last_update_date` | Última atualização |
| `contact_updater` | Último atualizador |
| `contact_zipcode_country` | País do código postal |

### Tags (EntityId: 23)

| FieldKey | Nome em Português |
|----------|-------------------|
| `tag_name` | Nome |
| `tag_color` | Cor |

### Deals (EntityId: 2)

| FieldKey | Nome em Português |
|----------|-------------------|
| `deal_title` | Título |
| `deal_contact` | Cliente |
| `deal_stage` | Estágio |
| `deal_owner` | Responsável |
| `deal_start_date` | Início |
| `deal_finish_date` | Término |
| `deal_currency` | Moeda |
| `deal_amount` | Valor |
| `deal_person` | Contato |
| `deal_tags` | Marcadores |
| `deal_collaborating_users` | Usuários colaboradores |
| `deal_contacts` | Contatos relacionados |
| `deal_products` | Produtos relacionados |
| `deal_stages` | Estágios |
| `deal_loss_reason` | Motivo de perda |
| `deal_days_in_stage` | Dias no estágio |
| `deal_tasks` | Tarefas |
| `deal_last_quote` | Proposta |
| `deal_last_interaction_record` | Último contato |
| `deal_origin` | Origem |
| `deal_create_date` | Data de criação |
| `deal_has_scheduled_tasks` | Possui tarefas agendadas |
| `deal_creator` | Criador |
| `deal_lead` | Lead origem |
| `deal_status` | Situação |
| `deal_last_quote_approved` | Proposta aprovada |
| `deal_id` | Id |
| `deal_last_document` | Último documento |
| `deal_derivated_deals` | Negócios derivados |
| `deal_number` | Número |
| `deal_last_order` | Última venda |
| `deal_won_quote` | Proposta ganha |
| `deal_hours_in_stage` | Horas no estágio |
| `deal_last_update_date` | Última atualização |
| `deal_length` | Duração |
| `deal_create_new_importation_id` | Id da importação de criação (novo) |
| `deal_update_new_importation_id` | Id da importação de atualização (novo) |
| `deal_create_public_form_id` | Id do formulário externo de criação |
| `deal_update_public_form_id` | Id do formulário externo de atualização |
| `deal_updater` | Último atualizador |
| `deal_priority` | Prioridade |

### Users (EntityId: 24)

| FieldKey | Nome em Português |
|----------|-------------------|
| `user_name` | Nome |
| `user_avatar_url` | Avatar |
| `user_role` | Cargo |
| `user_profile` | Perfil |
| `user_teams` | Equipes |
| `user_email` | E-mail |
| `user_phone` | Telefone |
| `user_facebook` | Facebook |
| `user_linkedin` | LinkedIn |
| `user_suspended` | Inativo |
| `user_id` | Id |
| `user_next_anniversary` | Próximo aniversário |
| `user_previous_anniversary` | Último aniversário |
| `user_last_seen` | Último acesso |
| `user_integration` | Usuário de integração |
| `user_no_login` | Sem acesso? |
| `user_creator` | Criador do usuário |

### Cities (EntityId: 25)

| FieldKey | Nome em Português |
|----------|-------------------|
| `city_name` | Nome |
| `city_state` | Estado |
| `city_country` | País |
| `city_ibge_code` | Código IBGE |

### Cities@Countries@States (EntityId: 26)

| FieldKey | Nome em Português |
|----------|-------------------|
| `state_name` | Nome |
| `state_short` | Sigla |
| `state_country` | País |

### Cities@Countries (EntityId: 27)

| FieldKey | Nome em Português |
|----------|-------------------|
| `country_name` | Nome |
| `country_short` | Sigla |
| `country_short2` | Sigla (2 letras) |
| `country_phone_mask` | Máscara de telefone |
| `country_zipcode_mask` | Máscara de Código Postal Internacional |

### PhoneTypes (EntityId: 29)

| FieldKey | Nome em Português |
|----------|-------------------|
| `phone_type_name` | Nome |

### Deals@Stages (EntityId: 31)

| FieldKey | Nome em Português |
|----------|-------------------|
| `deal_stage_name` | Nome |
| `deal_stage_ordination` | Ordenação do estágio |

### Deals@LossReasons (EntityId: 33)

| FieldKey | Nome em Português |
|----------|-------------------|
| `deal_loss_reason_name` | Nome |

### Currencies (EntityId: 17)

| FieldKey | Nome em Português |
|----------|-------------------|
| `currency_symbol` | Símbolo |
| `currency_code` | Código |

### Contacts@Origins (EntityId: 35)

| FieldKey | Nome em Português |
|----------|-------------------|
| `contact_origin_name` | Nome |

### InteractionRecords (EntityId: 36)

| FieldKey | Nome em Português |
|----------|-------------------|
| `interaction_record_contact` | Cliente |
| `interaction_record_date` | Data |
| `interaction_record_content` | Descrição |
| `interaction_record_contacts` | Contatos relacionados |
| `interaction_record_tags` | Marcadores |
| `interaction_record_type` | Tipo |
| `interaction_record_creator` | Criador |
| `interaction_record_create_date` | Data da criação |
| `interaction_record_id` | Id |
| `interaction_record_verified_check_in` | Check-in verificado |
| `interaction_record_original_task` | Tarefa origem |
| `interaction_record_latitude` | Latitude |
| `interaction_record_longitude` | Longitude |
| `interaction_record_call_status` | Status da chamada |
| `interaction_record_duration_in_seconds` | Duração |
| `interaction_record_address` | Endereço |
| `interaction_record_check_in_address` | Endereco de CheckIn |
| `interaction_record_check_in_date` | Data de CheckIn |
| `interaction_record_check_in_latitude` | Latitude de CheckIn |
| `interaction_record_check_in_longitude` | Longitude de CheckIn |
| `interaction_record_check_out_address` | Endereco de CheckOut |
| `interaction_record_check_out_date` | Data de CheckOut |
| `interaction_record_check_out_latitude` | Latitude de CheckOut |
| `interaction_record_check_out_longitude` | Longitude de CheckOut |
| `interaction_record_check_out_verified` | Verificacao de CheckOut |

### Contacts@LinesOfBusiness (EntityId: 37)

| FieldKey | Nome em Português |
|----------|-------------------|
| `contact_line_of_business_name` | Nome |

### Roles (EntityId: 38)

| FieldKey | Nome em Português |
|----------|-------------------|
| `role_name` | Nome |

### Departments (EntityId: 39)

| FieldKey | Nome em Português |
|----------|-------------------|
| `department_name` | Nome |

### Contacts@NumbersOfEmployees (EntityId: 40)

| FieldKey | Nome em Português |
|----------|-------------------|
| `contact_number_of_employees_name` | Nome |

### Products (EntityId: 10)

| FieldKey | Nome em Português |
|----------|-------------------|
| `product_name` | Nome |
| `product_code` | Código |
| `product_measurement_unit` | Unidade de medida |
| `product_currency` | Moeda |
| `product_unit_price` | Valor unitário |
| `product_group` | Grupo |
| `product_parts` | Partes |
| `product_family` | Família |
| `product_image_url` | Imagem |
| `product_id` | Id |
| `product_create_importation_id` | Id da importação de criação |
| `product_update_importation_id` | Id da importação de atualização |
| `product_last_update_date` | Última atualização |
| `product_lists` | Marcadores |
| `product_creator` | Criador |
| `product_create_new_importation_id` | Id da importação de criação (novo) |
| `product_update_new_importation_id` | Id da importação de atualização (novo) |
| `product_updater` | Último atualizador |

### Products@Groups (EntityId: 11)

| FieldKey | Nome em Português |
|----------|-------------------|
| `product_group_name` | Nome |
| `product_group_family` | Família |
| `product_group_fixed_price` | Preço fixado |
| `product_group_id` | Id |
| `product_group_create_new_importation_id` | Id da importação de criação (novo) |
| `product_group_update_new_importation_id` | Id da importação de atualização (novo) |

### Quotes (EntityId: 7)

| FieldKey | Nome em Português |
|----------|-------------------|
| `quote_date` | Data |
| `quote_number` | Código |
| `quote_review_number` | Número da revisão |
| `quote_is_last_review` | Última revisão |
| `quote_is_approver` | Sou aprovador |
| `quote_person` | Contato |
| `quote_currency` | Moeda |
| `quote_amount` | Valor |
| `quote_discount` | Desconto |
| `quote_expiration_date` | Data de validade |
| `quote_installments_number` | Número de parcelas |
| `quote_delivery_time` | Prazo de entrega |
| `quote_payment_method` | Método de pagamento |
| `quote_externally_accepted` | Aceita externamente |
| `quote_creator` | Criador |
| `quote_products` | Produtos da proposta |
| `quote_sections` | Blocos |
| `quote_contact` | Cliente |
| `quote_installments` | Parcelas |
| `quote_products_filter` | Produtos |
| `quote_template` | Modelo |
| `quote_approval_status` | Situação da aprovação |
| `quote_id` | Id |
| `quote_related_people` | Contatos relacionados |
| `quote_owner` | Responsável |
| `quote_title` | Título |
| `quote_notes` | Observações |
| `quote_freight_cost` | Valor do frete |
| `quote_freight_modal` | Modalidade de frete |
| `quote_description` | Descrição |
| `quote_last_external_opening_date` | Última visualização do cliente |
| `quote_external_sharing_date` | Data de compartilhamento da proposta |
| `quote_create_date` | Data da criação |
| `quote_updater` | Último atualizador |

### Quotes@Products (EntityId: 14)

| FieldKey | Nome em Português |
|----------|-------------------|
| `quote_product_product` | Produto |
| `quote_product_quantity` | Quantidade |
| `quote_product_currency` | Moeda |
| `quote_product_unit_price` | Valor unitário |
| `quote_product_total` | Total |
| `quote_product_discount` | Desconto |
| `quote_product_section` | Bloco |
| `quote_product_quote` | Proposta |
| `quote_product_parts` | Vinculos |
| `quote_product_id` | Id |
| `quote_product_owner` | Responsável |
| `quote_product_quote_date` | Data da proposta |
| `quote_product_parts_filter` | Vinculos |

### Products@Parts (EntityId: 41)

| FieldKey | Nome em Português |
|----------|-------------------|
| `product_part_product` | Produto |
| `product_part_group` | Grupo de produto |
| `product_part_currency` | Moeda |
| `product_part_minimum_unit_price` | Valor unitário mínimo |
| `product_part_maximum_unit_price` | Valor unitário máximo |
| `product_part_default_unit_price` | Valor unitário padrão |
| `product_part_minimum_quantity` | Quantidade mínima |
| `product_part_maximum_quantity` | Quantidade máxima |
| `product_part_default_quantity` | Quantidade padrão |
| `product_part_default` | Padrão |
| `product_part_required` | Obrigatório |
| `product_part_list` | Marcador de produto |
| `product_part_parent_product` | Produto pai |
| `product_part_category` | Categoria |
| `product_part_blocked_parts` | Vínculos bloqueados |
| `product_part_required_parts` | Vínculos obrigatórios |
| `product_part_suggested_parts` | Vínculos sugeridos |
| `product_part_name` | Identificação do vínculo |
| `product_part_id` | Id |

### Quotes@Products@Parts (EntityId: 21)

| FieldKey | Nome em Português |
|----------|-------------------|
| `quote_product_part_product` | Produto |
| `quote_product_part_quantity` | Quantidade |
| `quote_product_part_currency` | Moeda |
| `quote_product_part_unit_price` | Valor unitário |
| `quote_product_part_total` | Total |
| `quote_product_part_discount` | Desconto |
| `quote_product_part_quote_product` | Produto da proposta |
| `quote_product_part_id` | Id |
| `quote_product_part_part` | Vínculo |
| `quote_product_part_owner` | Responsável |
| `quote_product_part_quote_date` | Data da proposta |

### Users@Profiles (EntityId: 42)

| FieldKey | Nome em Português |
|----------|-------------------|
| `user_profile_name` | Nome |

### Teams (EntityId: 30)

| FieldKey | Nome em Português |
|----------|-------------------|
| `team_name` | Nome |
| `team_users` | Usuários |

### Products@Families (EntityId: 43)

| FieldKey | Nome em Português |
|----------|-------------------|
| `product_family_name` | Nome |
| `product_family_id` | Id |

### Orders (EntityId: 4)

| FieldKey | Nome em Português |
|----------|-------------------|
| `order_number` | Número |
| `order_date` | Data |
| `order_amount` | Valor |
| `order_creator` | Criador |
| `order_create_date` | Data da criação |
| `order_owner` | Responsável |
| `order_contact` | Cliente |
| `order_person` | Contato |
| `order_internal_comments` | Notas internas |
| `order_description` | Informações da venda |
| `order_discount` | Desconto |
| `order_currency` | Moeda |
| `order_sections` | Blocos |
| `order_products` | Produtos da venda |
| `order_stage` | Estágio |
| `order_agent` | Comissionado |
| `order_commission` | Comissão |
| `order_commission_amount` | Valor da comissão |
| `order_products_filter` | Produtos |
| `order_id` | Id |
| `order_installments` | Parcelas |
| `order_related_people` | Contatos relacionados |
| `order_template` | Modelo |
| `order_last_external_opening_date` | Última visualização do cliente |
| `order_approval_status` | Situação da aprovação |
| `order_externally_accepted` | Aceita externamente |
| `order_origin_quote` | Proposta origem |
| `order_external_sharing_date` | Data de compartilhamento da venda |
| `order_updater` | Último atualizador |
| `order_installments_number` | Número de parcelas |

### Deals@Pipelines (EntityId: 44)

| FieldKey | Nome em Português |
|----------|-------------------|
| `deal_pipeline_name` | Nome |

### Quotes@Installments (EntityId: 34)

| FieldKey | Nome em Português |
|----------|-------------------|
| `quote_installment_date` | Data |
| `quote_installment_amount` | Valor |
| `quote_installment_fixed` | Fixar parcela |
| `quote_installment_id` | Id da parcela |
| `quote_installment_quote` | Proposta da parcela |

### Orders@Sections (EntityId: 5)

| FieldKey | Nome em Português |
|----------|-------------------|
| `order_section_products` | Produtos |
| `order_section_order` | Venda |
| `order_section_currency` | Moeda |
| `order_section_total` | Total |
| `order_section_discount` | Desconto |

### Orders@Products (EntityId: 20)

| FieldKey | Nome em Português |
|----------|-------------------|
| `order_product_product` | Produto |
| `order_product_quantity` | Quantidade |
| `order_product_currency` | Moeda |
| `order_product_unit_price` | Valor unitário |
| `order_product_total` | Total |
| `order_product_discount` | Desconto |
| `order_product_section` | Seção |
| `order_product_order` | Venda |
| `order_product_id` | Id |
| `order_product_parts` | Vinculos |
| `order_product_owner` | Responsável |
| `order_product_quote_date` | Data da venda |
| `order_product_parts_filter` | Vinculos |

### Orders@Stages (EntityId: 45)

| FieldKey | Nome em Português |
|----------|-------------------|
| `order_stage_name` | Nome |

### Self (EntityId: 22)

| FieldKey | Nome em Português |
|----------|-------------------|
| `self_name` | Nome |
| `self_account` | Sua empresa |

### Account (EntityId: 15)

| FieldKey | Nome em Português |
|----------|-------------------|
| `account_name` | Nome |
| `account_phone` | Telefone |
| `account_street_address` | Endereço |
| `account_street_address_line2` | Complemento |
| `account_website` | Site |
| `account_register` | CNPJ |
| `account_logo_url` | Logo |
| `account_email` | E-mail |
| `account_city` | Cidade |

### Contacts@Relationships (EntityId: 46)

| FieldKey | Nome em Português |
|----------|-------------------|
| `contact_relationship_name` | Nome |

### Contacts@Status (EntityId: 47)

| FieldKey | Nome em Português |
|----------|-------------------|
| `contact_status_name` | Nome |

### Contacts@Classes (EntityId: 48)

| FieldKey | Nome em Português |
|----------|-------------------|
| `contact_class_name` | Nome |

### Contacts@Types (EntityId: 49)

| FieldKey | Nome em Português |
|----------|-------------------|
| `contact_type_name` | Nome |

### DocumentTemplates (EntityId: 50)

| FieldKey | Nome em Português |
|----------|-------------------|
| `document_template_name` | Nome |

### Leads (EntityId: 3)

| FieldKey | Nome em Português |
|----------|-------------------|
| `lead_company` | Empresa |
| `lead_person` | Contato |
| `lead_company_name` | Nome da empresa |
| `lead_company_legal_name` | Razão social |
| `lead_company_cnpj` | CNPJ |
| `lead_person_name` | Nome do contato |
| `lead_origin` | Origem |
| `lead_email` | E-mail |
| `lead_owner` | Responsável |
| `lead_phones` | Telefones |
| `lead_creator` | Criador |
| `lead_status` | Situação |
| `lead_tags` | Marcadores |
| `lead_create_date` | Data de criação |
| `lead_last_status_update_date` | Última atualização da situação |
| `lead_discard_reason` | Motivo de descarte |
| `lead_id` | Id |
| `lead_create_importation_id` | Importação de criação |
| `lead_update_importation_id` | Importação de criação |
| `lead_create_new_importation_id` | Id da importação de criação (novo) |
| `lead_update_new_importation_id` | Id da importação de atualização (novo) |

### Leads@Status (EntityId: 52)

| FieldKey | Nome em Português |
|----------|-------------------|
| `lead_status_name` | Nome |

### Quotes@ApprovalStatus (EntityId: 53)

| FieldKey | Nome em Português |
|----------|-------------------|
| `quote_approval_status_name` | Nome |

### Emails (EntityId: 56)

| FieldKey | Nome em Português |
|----------|-------------------|
| `email_from` | De |
| `email_to` | Para |
| `email_cc` | Cc |
| `email_subject` | Assunto |
| `email_sender_contact` | Cliente remetente |
| `email_sender_user` | Usuário remetente |
| `email_status` | Situação |
| `email_date` | Data |
| `email_sent` | Enviado |
| `email_read` | Lido |
| `email_recipients` | Destinatários |
| `email_tags` | Marcadores |
| `email_folder` | Pasta |

### Emails@Status (EntityId: 61)

| FieldKey | Nome em Português |
|----------|-------------------|
| `email_status_name` | Nome |

### Emails@Recipients (EntityId: 60)

| FieldKey | Nome em Português |
|----------|-------------------|
| `email_recipient_contact` | Cliente |
| `email_recipient_user` | Usuário |
| `email_recipient_email_address` | Endereço de e-mail |

### Tasks@Types (EntityId: 63)

| FieldKey | Nome em Português |
|----------|-------------------|
| `task_type_name` | Nome |

### Deals@Status (EntityId: 59)

| FieldKey | Nome em Português |
|----------|-------------------|
| `deal_status_name` | Nome |

### Documents (EntityId: 66)

| FieldKey | Nome em Português |
|----------|-------------------|
| `document_name` | Título |
| `document_template` | Modelo |
| `document_contact` | Cliente |
| `document_sections` | Blocos |
| `document_products` | Produtos do documento |
| `document_number` | Número |
| `document_date` | Data |
| `document_create_date` | Data de criação |
| `document_creator` | Criador |
| `document_installments` | Parcelas |
| `document_related_people` | Contatos relacionados |
| `document_last_external_opening_date` | Última visualização do cliente |
| `document_approval_status` | Situação da aprovação |
| `document_externally_accepted` | Aceita externamente |
| `document_origin_quote` | Proposta origem |
| `document_person` | Contato |
| `document_id` | Id |
| `document_external_sharing_date` | Data de compartilhamento do documento |
| `document_currency` | Moeda |
| `document_updater` | Último atualizador |
| `document_installments_number` | Número de parcelas |

### Documents@Sections (EntityId: 67)

| FieldKey | Nome em Português |
|----------|-------------------|
| `document_section_products` | Produtos |
| `document_section_document` | Documento |
| `document_section_currency` | Moeda |
| `document_section_discount` | Desconto |
| `document_section_total` | Total |

### Documents@Products (EntityId: 68)

| FieldKey | Nome em Português |
|----------|-------------------|
| `document_product_document` | Documento |
| `document_product_section` | Seção |
| `document_product_product` | Produto |
| `document_product_parts` | Vinculos |
| `document_product_document_creator` | Criador do documento |
| `document_product_quantity` | Quantidade |
| `document_product_unit_price` | Preço unitário |
| `document_product_total` | Total |
| `document_product_discount` | Desconto |
| `document_product_currency` | Moeda |
| `document_product_id` | Id do produto do documento |
| `document_product_document_date` | Data do documento |
| `document_product_parts_filter` | Vinculos |

### Orders@Products@Parts (EntityId: 69)

| FieldKey | Nome em Português |
|----------|-------------------|
| `order_product_part_product` | Produto |
| `order_product_part_quantity` | Quantidade |
| `order_product_part_currency` | Moeda |
| `order_product_part_unit_price` | Valor unitário |
| `order_product_part_total` | Total |
| `order_product_part_discount` | Desconto |
| `order_product_part_order_product` | Produto da venda |
| `order_product_part_part` | Vínculo |
| `order_product_part_owner` | Responsável |
| `order_product_part_order_date` | Data da venda |
| `order_product_part_id` | Id |

### Documents@Products@Parts (EntityId: 70)

| FieldKey | Nome em Português |
|----------|-------------------|
| `document_product_part_product` | Produto |
| `document_product_part_document_product` | Produto do documento |
| `document_product_part_quantity` | Quantidade |
| `document_product_part_unit_price` | Preço unitário |
| `document_product_part_total` | Total |
| `document_product_part_discount` | Desconto |
| `document_product_part_currency` | Moeda |
| `document_product_part_part` | Vínculo |
| `document_product_part_owner` | Responsável |
| `document_product_part_document_date` | Data do documento |
| `document_product_part_id` | Id |

### Orders@Installments (EntityId: 71)

| FieldKey | Nome em Português |
|----------|-------------------|
| `order_installment_date` | Data |
| `order_installment_amount` | Valor |
| `order_installment_fixed` | Fixar parcela |
| `order_installment_order` | Venda da parcela |
| `order_installment_id` | Id da parcela |

### Documents@Installments (EntityId: 72)

| FieldKey | Nome em Português |
|----------|-------------------|
| `document_installment_date` | Data |
| `document_installment_amount` | Valor |
| `document_installment_fixed` | Fixar parcela |

### RelatedPeople (EntityId: 73)

| FieldKey | Nome em Português |
|----------|-------------------|
| `related_person_email` | E-mail |
| `related_person_signee` | Signatário |
| `related_person_person` | Contato |
| `related_person_externally_shared` | Compartilhado |
| `related_person_externally_accpeted` | Aceito externamente |
| `related_person_quote` | Proposta |
| `related_person_order` | Venda |
| `related_person_document` | Documento |
| `related_person_sender_user` | Remetente |
| `related_person_external_url` | Link para compartilhamento |
| `related_person_sharing_text` | Texto para compartilhamento |

### Leads@DiscardReasons (EntityId: 54)

| FieldKey | Nome em Português |
|----------|-------------------|
| `lead_discard_reason_name` | Nome |

### Contacts@Products (EntityId: 75)

| FieldKey | Nome em Português |
|----------|-------------------|
| `contact_product_contact` | Cliente |
| `contact_product_product` | Produto |
| `contact_product_id` | Id |
| `contact_product_name` | Nome |
| `contact_product_code` | Código |

### Products@Lists (EntityId: 76)

| FieldKey | Nome em Português |
|----------|-------------------|
| `product_list_name` | Nome |
| `product_list_products` | Produtos |
| `product_list_color` | Cor |

### Products@Parts@Groups (EntityId: 83)

| FieldKey | Nome em Português |
|----------|-------------------|
| `product_part_group_name` | Nome |
| `product_part_group_default` | Padrão |

### Users@Logs@Changes@Changes (EntityId: 91)

| FieldKey | Nome em Português |
|----------|-------------------|
| `log_change_change_new_value` | Novo valor |
| `log_change_change_old_value` | Antigo valor |
| `log_change_change_field_key` | Campo modificado |
| `log_change_change_updater` | Usuário realizador |
| `log_change_change_datetime` | Data da modificação |
| `log_change_change_action` | Ação |
| `log_change_change_entity` | Entidade base |
| `log_change_change_item_id` | Id do item |
| `log_change_change_new_object_value_name` | Novo valor formatado |
| `log_change_change_old_object_value_name` | Antigo valor formatado |

### Fields (EntityId: 77)

| FieldKey | Nome em Português |
|----------|-------------------|
| `field_entity` | Entidade |
| `field_name` | Nome do campo |

### Webhooks@Actions (EntityId: 92)

| FieldKey | Nome em Português |
|----------|-------------------|
| `webhook_action_name` | Nome da ação |

### Fields@Entities (EntityId: 93)

| FieldKey | Nome em Português |
|----------|-------------------|
| `entity_name` | Nome da entidade |

### Attachments@Folders (EntityId: 95)

| FieldKey | Nome em Português |
|----------|-------------------|
| `attachment_folder_name` | Nome |

### Attachments@Items (EntityId: 96)

| FieldKey | Nome em Português |
|----------|-------------------|
| `attachment_item_name` | Nome |
| `attachment_item_iscollection` | Coleção |
| `attachment_item_type` | Tipo |
| `attachment_item_content_length` | Tamanho |
| `attachment_item_processing_status` | Estado de Processamento |

### InteractionRecords@CallStatus (EntityId: 105)

| FieldKey | Nome em Português |
|----------|-------------------|
| `interaction_record_call_status_name` | Nome |

### Deals@Priority (EntityId: 107)

| FieldKey | Nome em Português |
|----------|-------------------|
| `deal_priority_name` | Nome |

### Deals@Fields@Status (EntityId: 108)

| FieldKey | Nome em Português |
|----------|-------------------|
| `deal_field_status_name` | Nome |

### Attachments@Items@ProcessingStatus (EntityId: 109)

| FieldKey | Nome em Português |
|----------|-------------------|
| `attachment_item_processing_status_name` | Nome |
