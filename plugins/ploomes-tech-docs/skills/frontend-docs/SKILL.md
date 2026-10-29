---
name: frontend-docs
description: 'Use ao construir, revisar, planejar ou explicar o COMPORTAMENTO de tela do Ploomes CRM — como carrega dado (paginação, ordenação, busca, cache), quando persiste e o que valida, contrato de campo por TypeId (forma armazenada x exibida, máscara, unicidade), o que vem da Conta e não pode ser fixado no código (idioma, moeda, fuso, IDs configuráveis, permissão, whitelabel), os quatro estados de tela (carregando, vazio, erro, sem permissão), foco/teclado/ARIA, terminologia canônica pt-BR, tradução de erro cru da API, e renderização de documento gerado (PVD). Dispare quando a tarefa mencionar Ploomes, CRM Ploomes, Negócios, Funis, Etapas, Propostas, Vendas, Contatos, campos personalizados, OtherProperties, FieldKey, TypeId ou formulário dinâmico. NÃO é a fonte de forma visual — componente, token, cor, medida e mockup são da skill irmã ds-ploomes-crm-ui; sobre forma ela vence, sobre comportamento esta vence. Para endpoint, OData ou rate limit, use api-docs; para regra de negócio, business-docs.'
---

# Ploomes Frontend Context

**O que o frontend do produto se preocupa em fazer:** como carrega dado, quando persiste, o que valida, como fala com o usuário, o que a Conta manda e o que nunca pode vazar para a tela.

**Esta skill não descreve forma.** Componente, token, cor, medida, raio, sombra, anatomia e variante são do **design system** — a skill irmã `ds-ploomes-crm-ui`, que carrega o snapshot estático do storybook real do produto. Se a pergunta é "como isso **é**", a resposta está lá; aqui está "como isso **se comporta**".

Essa fronteira é rígida de propósito: quando as duas fontes descreviam a mesma coisa, elas divergiam, e a divergência virava bug — esta doc chegou a prescrever sombra em cartão em repouso, que o design system não faz.

## First Steps

1. Classifique a **preocupação** que a tarefa toca: princípios, listagem, escrita/validação, campo por TypeId, Conta/localização, linguagem, estados/feedback, acessibilidade, documento gerado.
2. Abra o [`_index.md`](./_index.md) e leia **o arquivo daquela preocupação** — não a camada inteira. A maioria das tarefas toca dois ou três.
3. Se precisar de comportamento preciso de API (endpoints, payloads, OData, auth), use a skill `api-docs`.

## Estrutura

Nove arquivos na raiz, um por preocupação, mapeados pelo [`_index.md`](./_index.md):

| Arquivo | Responde |
|---|---|
| `principios.md` | densidade, viewport cheia, configurabilidade, feedback não-bloqueante |
| `dados-e-listagem.md` | paginação, ordenação, busca, cache, seleção de registro |
| `escrita-e-validacao.md` | quando salva, o que valida, processamento assíncrono, descarte |
| `campos.md` | contrato por TypeId: forma armazenada × exibida, máscara, unicidade |
| `conta-e-localizacao.md` | idioma, moeda, fuso, IDs configuráveis, permissão, whitelabel |
| `linguagem.md` | voz, terminologia canônica, tradução de erro cru da API |
| `estados-e-feedback.md` | vazio, carregando, erro, sem permissão; toasts canônicos |
| `acessibilidade.md` | teclado, foco, ARIA, landmarks |
| `documento-gerado.md` | renderização do HTML de Proposta/Venda/Documento (PVD) |

## Routing

- Comportamento de entidade/módulo de negócio: **use a skill `business-docs`** (regras, entidades, módulos, configuração). Esta skill é sobre o comportamento da INTERFACE.
- **Forma visual — componente, token, medida, mockup de tela:** `ds-ploomes-crm-ui`. Não descreva aparência a partir daqui.
- Formulários dinâmicos e campos personalizados: `campos.md`, cruzando com `business-docs` para regras por TypeId.
- Detalhes de API: use `api-docs`. Esta skill não é fonte de verdade para endpoints, auth, OData, payloads, rate limits ou data models.

**Precedência quando duas fontes discordam:** regra de negócio → contrato de API → comportamento de frontend (esta skill) → forma visual (o design system). Um invariante de domínio sobrescreve o default de um componente, nunca o contrário. Sobre **forma**, o design system vence; sobre **comportamento**, esta skill vence.

## Non-Negotiable Rules

- Use termos canônicos PT-BR na UI: `Negocio`, `Funil`, `Estagio`, `Proposta`, `Venda`, `Contato`, `Perfil`, `Responsavel`.
- Mantenha campos de API em PascalCase inglês: `OwnerId`, `StatusId`, `OtherProperties`, `FieldKey`.
- Nunca faça hardcode de IDs configuráveis (Estagio, Motivo de Perda, Origem, status de aprovação, listas definidas pela conta).
- Trate o Ploomes como multi-tenant. A configuração da conta é a fonte de verdade para campos, formulários, funis, permissões, módulos, rótulos, moedas, integrações e feature flags.
- Valores de campo personalizado ficam em `OtherProperties` com `FieldKey` estável e o slot tipado do `TypeId`.
- Nunca use `TypeId` `3`, `14`, `15`, `16` — intencionalmente não existem.
- Não exponha termos internos (`HostSet`, `EntityId`, `TypeId`, `$filter`, `$expand`, `$select`) ao usuário final, salvo tarefa explicitamente técnica.
- Não duplique documentação de API aqui; roteie perguntas de API pela skill `api-docs`.

## Output Expectations

- Ao dar orientação, cite os arquivos-fonte que informaram a resposta (ex.: `dados-e-listagem.md`, `campos.md`).
- Ao desenhar tela, aplique daqui o comportamento de campo, as convenções de linguagem, os quatro estados e as regras de acessibilidade; tokens e componentes vêm do design system (`ds-ploomes-crm-ui`).
- Quando faltar detalhe de API e `api-docs` estiver indisponível/incompleta, pare na lacuna e peça a referência de API em vez de adivinhar.
