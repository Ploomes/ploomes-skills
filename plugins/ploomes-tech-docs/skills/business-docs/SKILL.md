---
name: business-docs
description: Use ao projetar, configurar, estruturar, planejar, modelar ou explicar algo dentro do Ploomes CRM — regras de negócio, comportamentos nativos e modelo de dados. Cobre funis, etapas, automações de funil e gerais, checklists, campos nativos e personalizados, formulários e formulários externos, fluxos de aprovação, perfis e permissões, abas e tabelas dinâmicas, filtros, metas, modelos de proposta/venda/documento (PVD), field-paths e vínculos entre Negócios, Clientes, Produtos, Produtos do cliente, Propostas, Vendas, Documentos, Tarefas, Registros de interação e Usuários. Vale mesmo sem a palavra "configurar" — "como faço X no Ploomes", "quero um funil de Y", "que campo usar para W", "monte uma tela no Ploomes para...". Diz o que é possível ou impossível na plataforma. Para endpoint, OData, auth e payloads use também api-docs; para UI/telas do CRM use frontend-docs; para o design system do CRM Web use ds-ploomes-crm-ui; para site/landing use ds-website e para apresentações use ds-apresentacoes.
---

# Configuração de negócio do Ploomes CRM

Esta skill reúne o conhecimento de negócio necessário para **projetar soluções e configurar corretamente o Ploomes**: o que cada entidade é, como elas se vinculam, quais comportamentos são nativos, o que é possível e o que é impossível, e quais propriedades preencher ao criar cada tipo de configuração (funil, automação, checklist, campo, formulário externo, fluxo de aprovação, perfil, aba, filtro, meta, modelo de PVD).

O papel esperado é o de **arquiteto de soluções do Ploomes**: receber uma demanda e transformá-la em software — um **frontend navegável** conectado à API do Ploomes (funcionando como uma tela dentro do Ploomes) e a **documentação** que o acompanha (escopo macro, relação de entidades/campos e roteiro de configurações). O objetivo é propor soluções que respeitem as regras reais da plataforma, sem inventar capacidades que não existem nem ignorar comportamentos nativos que já resolvem o problema.

## PRIMEIRO PASSO OBRIGATÓRIO — leia a Introdução

**Antes de qualquer coisa, abra e leia integralmente `construtor-de-tela/introducao-claude.txt`.** Esse arquivo é o briefing do papel: define a missão (frontend + documentação), o que entra em cada parte da entrega, quais entidades/sub-entidades/manipulações de dados podem ser ignoradas conforme a demanda e — crucialmente — **a ordem em que as configurações devem ser levantadas e especificadas** (Campos → Abas → Filtros → Formulários externos → Modelos de PVD → Funis → Checklists → Automações de funil → Automações genéricas → Fluxos de aprovação → Metas → o que mais for necessário). Não pule esse arquivo; o resto desta skill assume que você já o leu.

Em seguida, se a demanda envolver a construção de tela/frontend, leia também `construtor-de-tela/boas-praticas-de-construcao-de-telas/boas-praticas.txt` — ele lista comportamentos que o frontend deve prever mesmo quando não solicitados (checklists, regras de funil, ganhar/perder, tarefas→timeline, login por credenciais).

## Como usar esta skill

1. **Leia `construtor-de-tela/introducao-claude.txt` primeiro** (passo acima). Ele orienta toda a montagem.
2. **Identifique o que está sendo configurado** e abra o(s) arquivo(s) de referência relevante(s) com `view` antes de responder. Não confie só no resumo abaixo — os arquivos contêm as regras finas (limites, obrigatoriedades, exceções) que mudam a solução. Use a lista de "o que pode ser ignorado" da Introdução para não abrir arquivos desnecessários.
3. **Antes de propor criar campo novo**, verifique se já existe um campo nativo que resolve. Consulte `construtor-de-tela/04-regras-de-configuracao/rc-lista-de-campos-nativos-com-comportamentos.txt` e, quando aplicável, a API (skill `api-docs`).
4. **Antes de propor filtro, aba, automação condicional, checklist condicional, coluna de outra entidade ou puxar/editar dado de entidade vinculada**, confirme que o **field-path existe** em `construtor-de-tela/04-regras-de-configuracao/rc-lista-de-field-paths.txt`. Sem field-path, boa parte das configurações nativas é impossível e a solução muda (segunda requisição na API, campo acumulador, ou lógica de frontend).
5. **Cite o limite/regra concreta** quando ela afetar a decisão (ex.: aba retorna no máx. 50 itens e 30 campos; campo "Opções pré-cadastradas" aceita até 1000 opções; arquivo até 25 MB; automação tem 1 gatilho e N ações em sequência).
6. **Respeite a ordem de configuração** e a coerência total: nenhuma configuração que não será usada pelo software deve ser listada, e nenhuma configuração usada pode faltar. Configuração anterior é pré-requisito da posterior (ex.: um campo usado em filtro de aba ou em checklist precisa ser criado antes).
7. Para **endpoints, OData, auth e payloads**, combine com a skill `api-docs`. Para **UI/componentes/padrões de tela do CRM Ploomes**, combine com `frontend-docs`; para a **aparência do CRM Web** (tokens, componentes do design system, mockup de tela), com `ds-ploomes-crm-ui` — para site/landing é `ds-website` e para apresentação é `ds-apresentacoes`. Esta skill é a fonte das **regras de negócio**.

## Regra de ouro: nativo primeiro, frontend depois

O Ploomes está mais bem indexado e otimizado para os mecanismos nativos (funil, abas, filtros, field-path). Prefira sempre a solução nativa. Só recorra a "truques de frontend" (simular funis com um campo de estágio, simular entidade dinâmica com JSON em campo multilinha, vínculo "virtual" guardando um ID em campo número inteiro) quando o nativo realmente não atender ao caso de uso. Vários arquivos de entidade documentam esses padrões alternativos no fim — leia-os antes de improvisar.

## Onde ficam os arquivos

Toda a documentação de referência está sob a pasta **`construtor-de-tela/`**, organizada em subpastas:

- `01-entidades-principais/` — arquivos `ep-...`
- `02-sub-entidades/` — arquivos `se-...`
- `03-manipulacao-de-dados/` — arquivos `md-...`
- `04-regras-de-configuracao/` — arquivos `rc-...`
- `boas-praticas-de-construcao-de-telas/boas-praticas.txt`
- `introducao-claude.txt` (na raiz de `construtor-de-tela/`)

> **Nota sobre nomes de arquivo:** todos os nomes usam ASCII kebab-case, sem espaços nem acentos. Abra pelos caminhos exatos listados abaixo.

## Mapa de referências (abra conforme a tarefa)

### Entidades principais — o que cada base é, como se vincula e seus padrões de uso
- `construtor-de-tela/01-entidades-principais/ep-negocios.txt` — Negócios/Deals: situação (aberto/ganho/perdido + motivo de perda), vínculo obrigatório a 1 funil, cliente/contato/contatos relacionados, negócio pai/filho, movimentação entre funis, processos conectados multidepartamentais.
- `construtor-de-tela/01-entidades-principais/ep-clientes.txt` — Clientes: empresas e pessoas na mesma base (campo "Tipo"), vínculos pessoa↔empresa e empresa↔empresa, limite de 1000 pessoas por empresa, padrão de "tipos de cadastro" via campo + exibição condicional.
- `construtor-de-tela/01-entidades-principais/ep-propostas-vendas-e-documentos.txt` — PVD: as 3 bases (proposta/venda/documento) + blocos/produtos/opcionais, geração de HTML a partir de modelo, revisão de propostas, fluxos de aprovação, compartilhamento web, vínculos e obrigatoriedades de cada uma.
- `construtor-de-tela/01-entidades-principais/ep-produtos.txt` — Produtos/serviços: hierarquia Família > Grupo > Produto, grupos têm nível de acesso.
- `construtor-de-tela/01-entidades-principais/ep-produtos-do-cliente.txt` — Produtos do cliente: relação Cliente↔Produto com dados próprios (ativos, contratos, mix, número de série); pode existir sem cliente; pode vincular a negócio (assistência técnica, renovação).
- `construtor-de-tela/01-entidades-principais/ep-registros-de-interacao.txt` — Registros de interação: 7 tipos, vínculo a cliente e/ou negócio, gerados ao finalizar tarefa, alimentam a Timeline.
- `construtor-de-tela/01-entidades-principais/ep-tarefas.txt` — Tarefas: responsável + usuários, visibilidade especial quando sem cliente, integração Google/Outlook, geram registro de interação ao finalizar.
- `construtor-de-tela/01-entidades-principais/ep-usuarios-e-equipes.txt` — Usuários e equipes: perfil obrigatório, inativação preserva histórico, usuário em múltiplas equipes; **administração só no admin do Ploomes, não no construtor de telas**.
- `construtor-de-tela/01-entidades-principais/ep-biblioteca.txt` — Biblioteca: pastas/sub-pastas/coleções, extensões aceitas, limite 25 MB/arquivo, rede de permissões hierárquica e regras de movimentação.
- `construtor-de-tela/01-entidades-principais/ep-sua-empresa.txt` — "Sua empresa": entidade única com dados globais avulsos (cotação/PTAX, parâmetros de cálculo, regras de comissão, dados fiscais), acessíveis por outras entidades via field-path.

### Sub-entidades
- `construtor-de-tela/02-sub-entidades/se-funis.txt` — O que é um funil (fluxo de trabalho) e exemplos de processos (vendas, licitações, implantação, chamados, renovação).
- `construtor-de-tela/02-sub-entidades/se-checklists.txt` — Checklists por etapa: campos de negócio/cliente/contato, condição de avanço, exibição condicional em tempo real, validação no backend.
- `construtor-de-tela/02-sub-entidades/se-formularios-externos.txt` — Formulários externos de cliente e de negócio; tipos "atualização" (URL por registro) vs "criação" (URL global + campo chave anti-duplicidade); embed em site.
- `construtor-de-tela/02-sub-entidades/se-modelos-de-proposta-vendas-documentos.txt` — Modelos de PVD: formulário + HTML com referências a campos; entidades do formulário (cabeçalho/blocos/produtos/opcionais); **modelo configurado só no admin, nunca no frontend do usuário**.
- `construtor-de-tela/02-sub-entidades/se-opcionais.txt` — Vínculos produto-pai/produto-filho ("opcionais"/"partes"), categorias de vínculo, relações inserir/bloquear/sugerir.
- `construtor-de-tela/02-sub-entidades/se-timeline.txt` — Timeline: tabela **somente leitura** populada por eventos; lista os tipos de evento por escopo (cliente, negócio, geral).
- `construtor-de-tela/02-sub-entidades/se-anexos.txt` — Anexos: extensões aceitas, 25 MB/arquivo, 5 GB/usuário, onde podem ser vinculados.
- `construtor-de-tela/02-sub-entidades/se-cadastro-de-cidades.txt` — Cidades/estados/países; municípios BR já cadastrados; estados nativos só p/ BR, EUA, México e Portugal.

### Manipulação de dados — os mecanismos transversais
- `construtor-de-tela/03-manipulacao-de-dados/md-formularios-e-campos.txt` — **Leia antes de qualquer coisa sobre campos.** Campos nativos vs personalizados, todos os Tipos de campo e suas regras, limites e cuidados (ex.: campos do tipo Usuário/Produto/Cliente NÃO geram field-path; multilinha renderiza HTML; acumulador é calculado).
- `construtor-de-tela/03-manipulacao-de-dados/md-field-path.txt` — **Conceito central.** O que field-path habilita (filtrar, exibir, automatizar editando/puxando dados de entidades vinculadas) e o que é impossível sem ele.
- `construtor-de-tela/03-manipulacao-de-dados/md-filtros.txt` — Mecanismo de filtros salvos; usa field-path; quando ir direto na API.
- `construtor-de-tela/03-manipulacao-de-dados/md-abas-e-tabelas-dinamicas.txt` — Abas: filtros + campos ordenados + paginação; colunas de entidades vinculadas via field-path; limites e impacto de nível de acesso.
- `construtor-de-tela/03-manipulacao-de-dados/md-automacoes-de-funil.txt` — Automações de funil: baseadas em negócio + estágio; gatilhos por estágio; ações; fórmulas simples em JS; limitações (código sequencial, dias no estágio).
- `construtor-de-tela/03-manipulacao-de-dados/md-automacoes-gerais.txt` — Automações gerais: por entidade; gatilhos gerais e específicos; ações por entidade; quando preferir geral a de funil.
- `construtor-de-tela/03-manipulacao-de-dados/md-perfis-de-usuario.txt` — **Leia antes de tratar permissões.** Permissões gerais (CRUD por entidade, responsável vs colaborador, equipes) e específicas (visibilidade de abas, funis, modelos, campos, biblioteca, grupos de produto); limitações (sem hierarquia nativa); prioridade das gerais sobre as específicas. **Administração só no admin do Ploomes.**

### Regras de configuração — o passo a passo do que preencher ao criar cada coisa
Use estes quando o usuário for **efetivamente montar/configurar** o item (lista de propriedades obrigatórias e opcionais). A ordem abaixo segue a ordem de configuração definida na Introdução:
- `construtor-de-tela/04-regras-de-configuracao/rc-campos.txt` — Criar/configurar campo: título (4 idiomas, 60 chars), valor padrão, campo chave (quais tipos), múltiplo (quais tipos), dado de pessoa física, limitar itens listados por filtro; propriedades a ignorar. **Inclui a regra de checar campo nativo antes de criar.**
- `construtor-de-tela/04-regras-de-configuracao/rc-lista-de-campos-nativos-com-comportamentos.txt` — **Catálogo completo** dos campos nativos com comportamento especial, por entidade, com flags "preenchível na criação / na edição / obrigatório". Consulte para não recriar o que já existe e para saber o que NÃO pode ser editado (criador, datas, campos calculados, etc.). Tem índice de seções por entidade no topo. **Sempre cruze com este arquivo antes de propor um campo personalizado.**
- `construtor-de-tela/04-regras-de-configuracao/rc-abas-e-tabelas-dinamicas.txt` — Criar aba: entidade, nome, itens por página (≤50), quem vê, filtros, campos da tabela (≤30, via field-path).
- `construtor-de-tela/04-regras-de-configuracao/rc-filtros.txt` — Criar filtro salvo: entidade, nome, quem vê, filtros (via field-path).
- `construtor-de-tela/04-regras-de-configuracao/rc-formularios-externos.txt` — Criar formulário externo: tipo (negócio/cliente), logo, nome, descrição, cor, finalidade (criar vs atualizar), funil/estágio, ignorar mudança de estágio, campos, valores padrão, idioma.
- `construtor-de-tela/04-regras-de-configuracao/rc-modelos-de-proposta-vendas-e-documentos.txt` — Criar modelo de PVD: tipo, nome, quem vê, opções gerais (paginação, nome do PDF, parcelas), seções (margens, cabeçalho, rodapé), conteúdo HTML com referências a campos/blocos/produtos/opcionais/parcelas e exibição condicional (sempre A4 retrato).
- `construtor-de-tela/04-regras-de-configuracao/rc-funis.txt` — Criar funil: nome, ícone/cor, quem vê, etapas, formulário(s), regras do funil (pular/voltar etapa, ganhar só na última, criar venda ao ganhar, pode ganhar/perder, usuário de automação, gerar/limitar PVDs), nomenclatura da unidade, botões ganhar/perder, motivos de perda, abas.
- `construtor-de-tela/04-regras-de-configuracao/rc-checklists.txt` — Criar checklist: estágio, título, texto informativo, filtros (condicional), itens (descrição + campo de negócio/cliente/contato + condição de avanço), ordenação.
- `construtor-de-tela/04-regras-de-configuracao/rc-automacoes-de-funil.txt` — Criar automação de funil: etapa, descrição, gatilho, filtro, ações (12 tipos) e os parâmetros de cada ação.
- `construtor-de-tela/04-regras-de-configuracao/rc-automacoes-genericas.txt` — Criar automação geral: entidade, descrição, gatilho (geral/específico), filtro, ações disponíveis por entidade e seus parâmetros.
- `construtor-de-tela/04-regras-de-configuracao/rc-fluxos-de-aprovacao.txt` — Criar fluxo de aprovação de PVD: entidade, nome, condições, mensagem, ação (fluxo/bloqueio/alerta), níveis e aprovadores, notificação por e-mail e destinatários.
- `construtor-de-tela/04-regras-de-configuracao/rc-metas.txt` — Criar meta: painel, nome, dado metrificado (entidade+campo), agregação, usuários/equipes alvo e papel, quem vê, datas e campo de data do intervalo, separação do intervalo, cor.
- `construtor-de-tela/04-regras-de-configuracao/rc-regras-de-filtragem.txt` — **Como o filtro funciona em qualquer lugar** (abas, filtros, automações, checklists): entidade base → campo → operação → valor fixo ou comparação com outro campo; navegação por field-path; o que é impossível sem field-path (ex.: filtrar clientes que têm negócio em andamento no funil X precisa de acumulador ou API).
- `construtor-de-tela/04-regras-de-configuracao/rc-lista-de-field-paths.txt` — **Fonte canônica de TODAS as relações entre entidades por field-path.** Consulte sempre que precisar saber se é possível navegar/filtrar/automatizar de uma entidade origem para uma destino.

### Introdução e boas práticas
- `construtor-de-tela/introducao-claude.txt` — **Briefing do papel de arquiteto de soluções. LEIA PRIMEIRO.** Missão (frontend + documentação), o que entra em cada entregável, quais entidades/sub-entidades/MDs podem ser ignoradas por demanda, e a **ordem obrigatória das configurações**.
- `construtor-de-tela/boas-praticas-de-construcao-de-telas/boas-praticas.txt` — Comportamentos que o frontend deve prever mesmo sem serem pedidos: sempre exibir checklists de uma etapa (e habilitar "Ganhar" só com os obrigatórios preenchidos); respeitar as regras do funil; regras de ganho/perda/reabertura; finalizar tarefa deve atualizar timeline/registros de interação; login por credenciais do usuário (não API Key fixa), salvo declaração explícita.

## Princípios de negócio a respeitar sempre

- **Field-path é o que torna possível** filtrar/exibir/automatizar entre entidades vinculadas. Sem field-path entre origem e destino, não há filtragem nativa nem automação que edite/puxe dados daquela entidade vinculada — só sobra segunda requisição na API ou campo acumulador. Verifique em `rc-lista-de-field-paths.txt`.
- **Campos dinâmicos do tipo Usuário, Produto e Cliente NÃO geram field-path.** Para ler dados da entidade vinculada por esses campos, é preciso uma segunda requisição na API com o ID.
- **Uma automação tem um único gatilho e pode ter várias ações executadas em sequência** (a ordem importa). Prefira automação geral à de funil quando o gatilho não depender de estágio (evita duplicar a mesma automação por estágio).
- **Permissões gerais têm prioridade sobre as específicas.** Uma aba/filtro pode existir, mas só listará o que o perfil permite ver. Negócios e clientes têm níveis de acesso independentes.
- **Administração de usuários, perfis e modelos de PVD ocorre só no admin do Ploomes**, nunca em telas construídas para o usuário final.
- **Algumas tabelas/campos são somente leitura ou calculados**: Timeline (só leitura), criador, datas de criação/atualização, "possui tarefas agendadas", "próximo aniversário", acumuladores, etc. Não proponha preenchê-los manualmente.
- **Respeite obrigatoriedades de vínculo**: proposta sempre vinculada a negócio; venda sempre vinculada a cliente; documento de negócio vinculado a negócio; negócio sempre vinculado a um (e só um) funil; negócio perdido sempre com motivo de perda; produto sempre em um grupo.
- **Limites recorrentes**: aba ≤ 50 itens/página e ≤ 30 campos; "Opções pré-cadastradas" ≤ 1000 opções; texto simples 200 chars; número inteiro 9 dígitos; arquivo ≤ 25 MB (5 GB/usuário); título de campo 60 chars; 100 pastas-mãe e 7 sub-pastas na Biblioteca; 1000 pessoas por empresa. Confirme no arquivo específico antes de afirmar.
- **PVD A4 retrato apenas** (nunca paisagem) na geração de PDF.
- **O frontend deve prever todo o comportamento nativo do Ploomes** (ver `construtor-de-tela/boas-praticas-de-construcao-de-telas/boas-praticas.txt`), mesmo quando não pedido: checklists de etapa (e "Ganhar" liberado só com os obrigatórios preenchidos), regras do funil, regras de ganho/perda/reabertura de negócio, atualização da timeline ao finalizar tarefa, e login por credenciais do usuário (não API Key fixa) salvo declaração explícita.
- **Coerência total entre software e configurações**: liste todas — e somente — as configurações que o software usa; respeite a ordem em que devem ser criadas (uma é pré-requisito da seguinte); não deixe faltar nenhuma configuração usada.

## Quando combinar com outras skills

- Precisa de **endpoint, método HTTP, query OData, autenticação, payload, FieldKey/OtherProperties, rate limit**? Use também `api-docs`.
- Precisa de **UI do CRM Ploomes** (componentes do design system, campos por TypeId, padrões de tela como list-page/kanban/record-sheet, tokens, acessibilidade)? Use também `frontend-docs`.
- Precisa da **aparência do CRM Web** (tokens, componentes do design system, mockup de tela do produto)? Use também `ds-ploomes-crm-ui`, skill irmã desta, no mesmo plugin `ploomes-tech-docs`. Para **site/landing** é `ds-website`, para **apresentação/deck** é `ds-apresentacoes`, e para **voz pt-BR de marketing** é `tom-de-voz` — todas do plugin `ploomes-marketing`.
- Esta skill responde **"o que é possível e como configurar a regra de negócio"**; as outras respondem **"como chamar a API"**, **"como montar a interface"** e **"como deve parecer"**.
