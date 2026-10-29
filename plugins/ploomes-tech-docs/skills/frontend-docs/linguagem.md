# Linguagem

## Tom

- **Tratamento**: "você". Nunca "tu", "vós" ou "o senhor/a senhora".
- **Rótulo de ação**: imperativo afirmativo direto — "Salvar", "Cancelar",
  "Adicionar contato", "Concluir".
- **Mensagem de erro**: frase completa, sem jargão técnico, dizendo o que
  aconteceu **e o que fazer**. "Não foi possível salvar o contato."
- **Confirmação de exclusão**: pergunta direta — "Deseja realmente excluir esse
  contato?". Destruição irreversível pede palavra digitada.
- **Capitalização**: sentence case. Não Title Case. Nomes próprios e siglas
  permanecem maiúsculos.
- **Números concretos**: "3 negócios atrasados", não "alguns negócios precisam de
  atenção".
- **Sem jargão de marketing**: nada de empoderar, jornada, sinergia, unleash.

**Caixa alta em frase é evitada.** A exceção formalizada é rótulo de seção de
formulário e cabeçalho de coluna de tabela. Botão, badge, mensagem, opção de menu,
trilha de navegação e qualquer prosa seguem sentence case.

## Terminologia canônica

| Use | Nunca |
|---|---|
| Negócio | Deal, Oportunidade |
| Funil | Pipeline |
| Estágio | Stage |
| Proposta | Quote, Cotação, Orçamento |
| Venda | Order, Pedido |
| Contato | Lead, Customer, Person |
| Perfil | Role, Papel |
| Responsável | Owner |

"Papel" é ambíguo — também aparece como função do Contato. Para permissão, use
**Perfil**. Lista completa em
`ploomes-tech-docs:business-docs`.

Nomes de campo de API permanecem em PascalCase inglês (`OwnerId`, `StatusId`,
`OtherProperties`) — só o conceito de negócio é traduzido, e só em prosa.

## Termos internos nunca aparecem na tela

Texto visível ao usuário — rótulo, placeholder, ajuda, tooltip, toast, erro, estado
vazio, tela de carregamento, rodapé — **não pode** conter vocabulário de
infraestrutura, modelagem ou protocolo. Vale inclusive em texto "informativo"
secundário: quem lê é um usuário comercial que não conhece a arquitetura, e não
precisa conhecer.

Nunca mostre:

- **Infraestrutura**: shard, HostSet, gateway, endpoint, base URL, host, tenant,
  cluster, nome de servidor.
- **Autenticação de implementação**: User-Key, Secret-Key, token, bearer, JWT,
  header, cookie de sessão.
- **Protocolo**: OData, `$filter`, `$expand`, `$select`, `$top`, `$skip`, `$apply`,
  `$orderby`, payload, request, response, JSON, GET/POST/PATCH/DELETE,
  `@odata.count`.
- **Identificadores internos**: Id numérico cru ("contato 12345"), TypeId, EntityId,
  FieldKey, OtherProperties, StatusId, StageId, PipelineId, OwnerId.
- **Erro cru de servidor**: stack trace, mensagem em inglês do framework,
  `MaxNodeCount`, `ERR_HTTP2_PROTOCOL_ERROR`, código HTTP nu ("Erro 401").
- **Implementação de frontend**: cache, localStorage, state, hook, componente,
  re-render, bundle, feature flag.
- **Metadados**: "metadados", "schema", "dicionário de campos".

| ✗ Não escreva | ✓ Escreva |
|---|---|
| "Carregando metadados da conta…" | "Carregando configurações da conta…" |
| "Erro ao carregar metadados" | "Não foi possível carregar as configurações da conta." |
| "Falha no endpoint /Contacts" | "Não foi possível carregar os contatos." |
| "Sessão expirada (401)" | "Sua sessão expirou. Entre novamente." |
| "Campo TypeId obrigatório" | "Tipo é obrigatório." |
| "StageId inválido para este PipelineId" | "Este estágio não pertence ao funil selecionado." |
| "Erro $filter depth limit excedido" | "Filtro muito complexo. Simplifique os critérios." |
| "User-Key inválido" | "Não foi possível autenticar. Tente entrar novamente." |
| "Contato 12345 atualizado" | "Contato \"Ana Souza\" atualizado." |
| "Falha ao executar PATCH em /Deals(42)" | "Não foi possível salvar o negócio." |

**Siglas que podem aparecer** porque são vocabulário do usuário: CPF, CNPJ, CEP,
CNAE, SLA, NPS, CRM, ERP, IE, RG. Em dúvida, só vai para a tela o que está no
glossário.

## Traduzir erro da API

A API responde em inglês e cita campos em PascalCase. **Nunca renderize a mensagem
crua.**

1. Trate os erros que você conhece — 401, 403, 409 de validação de negócio, 404 —
   com mensagem específica em pt-BR.
2. No caso genérico, mostre mensagem amigável e registre a original em log para
   diagnóstico.
3. Detalhe técnico para administrador, quando útil, vai atrás de um "Ver detalhes"
   colapsado — nunca como texto principal do toast.

Mapa de códigos em
[`../api-docs/04-error-reference.md`](../api-docs/04-error-reference.md).
