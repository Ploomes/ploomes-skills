# Guardrails de segurança — api-docs

> Camada de pré-checagem para o agente **antes de gerar** qualquer escrita ou operação contra a API Ploomes. Esta skill **não executa** chamadas — ela as gera. Portanto "confirmar" aqui significa **apresentar a chamada e seu impacto ao usuário na conversa e aguardar OK** antes de entregar a operação.
>
> **Limitação conhecida:** isto é instrução, não enforcement de runtime. Protege contra erro honesto de um agente cooperativo; não impede um agente que ignore instruções. Enforcement real (bloquear a chamada) seria outra camada — hook ou proxy —, fora desta documentação.

## Como usar — 3 tiers keyed por operação

| Tier | O que fazer | Operações |
|---|---|---|
| **0 — siga** | Gere corretamente, sem confirmar. Inclui o tratamento operacional automático do bloco E (honrar `429`/`Retry-After`). | Read; create de registro único; PATCH de campo simples sem cascata; bloco E. |
| **1 — anuncie + confirme** | Apresente a chamada **e o impacto** ao usuário; aguarde OK. | Bloco 0 (uma vez por sessão); blocos A, B. |
| **2 — recuse / escale** | Não gere; explique e escale ao humano. | Blocos C, D. |

Não confirme o que é Tier 0 — excesso de confirmação treina o usuário a ignorar. Confirme o que realmente destrói, atinge em massa ou dispara cascata.

## 0) Ambiente — pré-condição da primeira escrita de qualquer sessão · Tier 1

**Confirme em qual ambiente a escrita vai cair, antes da primeira escrita da sessão.**
- Leia o host efetivo — o `@odata.context` da primeira resposta já o entrega — e verifique se ele contém `canary`.
- **Canary é pré-produção** (`SKILL.md` §3.1): a escrita ali **não aparece para o cliente** e pode se perder no próximo refresh do ambiente. O `200` não distingue um do outro — não o trate como sinal de que caiu em produção.
- Se o host for canary e a intenção for produção, **pare e avise o usuário antes de escrever**.
- Vale para `POST`, `PATCH` e `DELETE`, **inclusive em operação unitária e não destrutiva** — o risco aqui não é o que a chamada faz, é onde ela cai.
- Anuncie o ambiente ao usuário uma vez, no início; depois disso, escrita no mesmo host é Tier 0 de novo.

**Independe do transporte.** Se a escrita sai por um MCP ou por outra ferramenta que você mesmo dispara — e não por uma chamada HTTP que você apenas redige —, a confirmação é a mesma, e é mais importante: ali não há um humano lendo a URL antes do envio.

> Por que este bloco existe: uma implantação inteira de estrutura (22 campos, 3 tabelas de opções, 12 opções, 7 origens de contato) foi criada em canary com `200` em todas as chamadas. O desvio só apareceu horas depois, por divergência de dados na leitura — nada na sessão sinalizou o ambiente antes ou durante as escritas.

## A) Escrita destrutiva ou em massa · Tier 1

**`DELETE /{Set}({id})`**
- Risco: baixo/médio — é **soft delete recuperável** (`SKILL.md` §3.8). O registro é marcado como deletado, não removido fisicamente.
- Pré-voo: não superestime o risco; muitos sets expõem `GET /{Set}/GetDeleted{Set}` para recuperar. Antes de afirmar que é reversível, confirme que a entidade tem `GetDeleted{Set}`. Confirme o escopo (qual registro).

**`POST /{Set}/BulkUpdate?$filter=…` e `POST /{Set}/BulkDelete?$filter=…`**
- Risco: alto — um `$filter` amplo ou errado atinge **toda a base** que ele casar. O servidor exige filtro (`MissingFieldException` — "You must use a filter to call this action"), mas um filtro amplo passa.
- Pré-voo (Tier 1): **conte antes** com `GET /{Set}?$filter=<mesmo filtro>&$apply=aggregate($count as Count)`; ecoe ao usuário o `$filter` exato + o nº de registros afetados; só entregue a operação após OK.

**`PATCH` em Quotes / Orders / Documents com filhos aninhados**
- Risco: alto e silencioso — enviar `Sections`, `Products`, `Parts` ou `Installments` num PATCH tem **replace semantics: apaga e recria todos os filhos** (`06-common-patterns.md`), não faz merge.
- Pré-voo: para alterar um único item de linha, **leia o estado atual primeiro** e reenvie a árvore inteira, ou você zera o resto. Avise o usuário que os filhos serão substituídos.

**`POST /{Set}/Merge`**
- Risco: alto — combina registros e é difícil de desfazer. Restrições: só mescla com mesmo Owner/Contact/Pipeline (`04-error-reference.md`).
- Pré-voo: confirme `SourceId`/`TargetId` e explique a irreversibilidade antes de entregar.

## B) Escrita com efeito colateral invisível · Tier 1

**Mudar `StageId` / `PipelineId` / `StatusId`, ou `POST /Deals({id})/Win|Lose|Reopen`**
- Risco: cascata **invisível na camada de API** — um PATCH de um campo só pode disparar automações de funil (criar venda ao ganhar, enviar e-mail, trocar responsável). A chamada parece trivial; o efeito não é.
- Pré-voo: sinalize que a mudança pode disparar automações do tenant que você não enxerga, e confirme. Para entender o impacto de negócio, consulte a skill `business-docs` (automações de funil / genéricas).

**Regras de funil que bloqueiam a transição**
- Risco: a escrita pode ser rejeitada por regra do funil: `MayWinDeals`, `WinDealOnLastStage`, `ForbiddenStageReturn`, `MustPassAllStages`, ou `PendingCheckListException` (`04-error-reference.md` §Pipeline Rules).
- Pré-voo: espere esses erros como resultado legítimo de regra de negócio; não os trate como falha genérica nem tente contorná-los.

**`?webhooks=false` em qualquer escrita**
- Risco: **dessincroniza integrações silenciosamente** — webhooks externos não disparam para aquela operação (`SKILL.md` §3.7). Default é `true`.
- Pré-voo: use só quando entender o impacto na integração. Não espalhe `webhooks=false` para "evitar barulho".

## C) Credenciais e chaves · Tier 2

**Chave em software construído**
- Regra: **nunca hardcode uma API Key fixa** no software gerado — assuma login por credenciais do usuário, salvo declaração explícita em contrário (é o guardrail já firmado na skill `business-docs`, boas práticas de construção de telas).

**Manuseio de qualquer chave**
- Regra: nunca logue, ecoe em output, nem persista em texto claro uma chave (`User-Key`, `Secret-Key`, `Importation-Key`, `Exportation-Key`, `*-Key` de escopo).
- `Exportation-Key` tem leitura ampla e vale 15 dias; trate como sensível.

## D) Escopo e menor privilégio · Tier 2

**Escolha da chave**
- A `User-Key` de integração tem **acesso total do usuário**. Prefira usuário de integração com **perfil restrito** ao mínimo necessário — não a conta AccountOwner. **O perfil é o guardrail.**

**Operar dentro do escopo**
- `404` pode significar **"sem visibilidade", não "não existe"** — há row-level security e respostas escopadas por `AccountId` (`02-authentication.md` §Request Scoping). Não conclua que o registro sumiu nem tente escalar acesso.
- Erros de permissão ("Your profile doesn't have permission…"; AccountOwners protegidos) são resultado legítimo. Explique ao usuário; **não** reaja trocando por uma chave mais poderosa.

## E) Rate limit e carga · operacional (Tier 0, automático — sem confirmar)

**`429 Too Many Requests`**
- Pré-voo: honre `Retry-After` (segundos) com backoff antes de repetir. Não martele o endpoint (`05-rate-limiting.md`).

**Queries pesadas → `504`**
- `$count=true` em coleção grande e `$apply` sem limite causam timeout. **Não duplicar aqui** — siga os anti-patterns já documentados em `SKILL.md` §3.5 e o checklist §6 (use `$apply=aggregate($count as Count)`; adicione `preload`).
