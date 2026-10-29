# O que o construtor de telas é por dentro

Levantado em **2026-09-30** observando uma tela publicada aberta no CRM e o construtor aberto num
projeto de CPQ.

⚠️ **É observação de tráfego, não documentação oficial** — se algo abaixo divergir do que o construtor
fizer hoje, vale o construtor, e este arquivo precisa ser atualizado.

## 1. A tela publicada

| Peça | O que é |
|---|---|
| Registro da tela | `GET ai-builder.ploomes.com/api/modules/{id}` → `{deploymentUrl, iconClass, name, permissionType, allowedUsers}` |
| Onde o código roda | a `deploymentUrl` — o CRM a abre num iframe |
| Stack do scaffold | React 19 + Vite + react-router 7; build = `index.html` + um JS (~280–590 KB) + um CSS. A base exata está na seção 4 |
| Sessão | pacote `@ploomescrm/bridge`, por `postMessage`: a tela manda `app:ready`, o CRM responde `host:init` com `apiUrls.apiUrl`, `userKey` e `userId` do usuário logado |
| Chamada à API | direto do navegador, `fetch(apiUrl + rota)` com cabeçalho `User-Key` |
| Outras mensagens da ponte | `navigate`, `event`, `request`/`response` com o host, `viewport-overlay` (modal que cobre o CRM), transporte WebView no app mobile |

🔴 **Consequência:** a tela não tem login próprio e herda o perfil de quem abriu. Tudo o que o perfil
não vê, a tela também não vê. ⛔ **E o código roda com a sessão de quem abre:** a `userKey` que a ponte
entrega é a chave dessa pessoa — nunca sai da tela para terceiro nem é gravada fora do Ploomes.

## 2. O construtor (AI Builder)

| Rota (`ai-builder.ploomes.com/api/…`) | O que devolve |
|---|---|
| `templates` | os scaffolds: `ploomes-ai-builder-module-scaffold` e `ploomes-ai-builder-module-cpq-scaffold` |
| `projects/{id}` | `state`, `previewUrl`, `deploymentUrl`, `templateId`, quem publicou |
| `projects/{id}/snapshots` | uma snapshot **por resposta do agente**, com `buildStatus` e `deployed` |

➜ **As rotas de escrita** — criar a tela (`POST projects`), gravar versão nova
(`POST projects/{id}/code/save`, arquivo inteiro) e as permissões (`modules/{id}/permissions`) — foram
testadas em produção em 28/10/2026. Estão em `api-do-construtor.md`, com
o script que as usa. A versão gravada assim **não passa pelo agente de lá**: 0 token, e a tela sobe
pronta. O agente do construtor só entra se alguém escrever no chat.

## 3. Os padrões que o pacote ataca

O que se viu o construtor fazer quando escreve a tela pela IA, e a resposta do pacote a cada um:

| Padrão observado | Resposta do pacote |
|---|---|
| Pedido aos pedaços ("segue ajustes" × 19) | **um** `PEDIDO.md` completo, e ajustes depois só em lote |
| Monólito `App.tsx` reeditado a cada pedido | estrutura de arquivos fixada no pedido; `App.tsx` só compõe |
| Camada de API reescrita à mão, com `$skip` e base inteira baixada ao abrir | `api.ts` **gerado** e anexado; o agente não escreve `fetch` |
| IDs de funil, etapa, status e modelo fixos no código | resolução **por nome** em `iniciar()`; só FieldKey é fixo |
| Descoberta de campo e criação de configuração pelo agente | `conferencia-da-conta.json` já feito; o pedido **proíbe** escrita de configuração |
| Teste com Playwright a cada passo | critérios de aceite testados **uma vez**, no fim |

## 4. A base de uma tela em branco e a importação

Levantado em **2026-10-19** do export de uma tela em branco (`00-base-tela-em-branco.zip`, exportado
em 16/10/2026), quando o time de produto abriu a **importação** de código no construtor. A cópia
exata está em `bancada/scaffold/src/`.

| Peça | O que é |
|---|---|
| O que o export traz | só `src/` (26 arquivos) e um `LEIA-ME.md`; sem `package.json`, `vite.config`, `tsconfig` nem `index.html` — a bancada os repõe |
| Pacotes | `react`, `react-dom`, `react-router` 7 (`MemoryRouter`), `@ploomescrm/bridge` (npm, 1.2.0, licença proprietária) e `@ploomescrm/api-types` (não publicado no npm; a bancada usa um tipo local em `tipos-locais/`) |
| Entrada | `main.tsx` → `<PloomesProvider><PloomesRouter><App/>`; `src/lib/` é da base e não se edita |
| Config | `usePloomesBridge()` → `{isLoading, config, navigate}`; `config` = `userKey`, `userId`, `apiUrls.apiUrl`, `whitelabel`, `itemId?`, `featureFlags?`, `initialRoute`, `projectId`, `language`. A `userKey` pode ser renovada: o `host:init` chega de novo |
| Rotas | o endereço no CRM é `/ai-screen/<tela>/<rota>`; a base espelha a rota do `MemoryRouter` no host nos dois sentidos (voltar, avançar, link copiado). Uma rota por tela e por item aberto, filtro na query string, `path="*"` para `/`; nada de `BrowserRouter` |
| Navegar ao CRM | `navigate` do `usePloomesBridge` é só para telas do CRM (catálogo); dentro da tela, `useNavigate` do `react-router` |
| Modal | `useViewportOverlay(aberto)` + `position: fixed` + portal no `document.body`: o host cobre a página inteira, não só o iframe |
| Tema | tokens CSS em `index.css` (`--color-brand`, `--color-background`, `--color-font`, `--color-neutral-level_*`…), `.dark` para o modo escuro; whitelabel troca os tokens |
| Protocolo | envelope `{__ploomesBridge: true, v: 1, type, payload}`; `app:ready` → `host:init`; `app:navigate`/`host:navigate`; `event`, `request`/`response` |

➜ **Importação: rota alternativa.** A tela sobe pela API (`api-do-construtor.md`); o `.zip` com só
`src/`, no formato do export (`scripts/empacotar_importacao.py`), sai em toda entrega como a cópia local
da versão, e é importado só se a API e o editor falharem. ⚠️ Que a importação aceita exatamente esse
formato é suposição — confirmar na primeira importação real e corrigir aqui.

➜ **Ao conectar, a base reporta `/` com `replace`** antes de aplicar a `initialRoute` (o
`MemoryRouter` nasce em `/`). Um host que obedeça apaga o link copiado do endereço. A bancada ignora
e avisa; ⚠️ como o CRM real trata isso não está confirmado.

## 5. O que a primeira tela em produção mostrou

Levantado do export de uma tela em produção num cliente, comparado com o pacote que a gerou.

- **O construtor reescreveu a camada de dados.** O `api.ts` gerado não foi usado; no ar ficou um
  escrito à mão, que truncava a lista de negócios, paginava com `$skip` e não repetia o 429. É o que a
  construção aqui e a subida pronta evitam: o empacotador, e o `salvar` da API com o mesmo portão,
  reprovam `api.ts` diferente do pacote.
- **Campo pelo nome, não por chave inventada.** O código de produção resolve campo personalizado
  pela `Fields.Name`; o contrato do pacote tinha FieldKeys `TOBE0001…` dos campos que a cadeia ainda
  ia criar. ➜ O contrato só leva FieldKey **conferido na conta**; campo ainda por criar espera a
  cadeia, e o pacote não sai antes.
- **Integração disparada pela tela.** ➜ No pacote, integração disparada pela tela é escrita no
  Ploomes (campo, tarefa, registro) que uma automação leva ao flow; o PEDIDO nunca traz URL de flow.
  *Por quê:* a tela roda no navegador de quem a abre, e uma URL de flow no código da tela pode ser
  chamada por qualquer um que tenha o código, sem passar pelo perfil de ninguém.
- **A tela opera o registro.** Ganhar (com `ValidateChecklist`), perder, reabrir, duplicar, gerar
  proposta pelo modelo com `ForceHTMLGeneration`: o contrato precisa dessas escritas quando a
  indicação diz `Opera o registro: sim`.

## 6. Pacotes que o construtor tem além da base

- **`motion`** (`motion/react`): a base em branco não o declara, mas uma tela em produção o importa
  em três arquivos (outubro de 2026) — o construtor o instala. A versão de lá não é
  conhecida; a base daqui fixa 12.43.0 e o kit de onboarding usa só a API estável entre a 12 e a 14
  (`motion`, `AnimatePresence`, `MotionConfig`, `useReducedMotion`, `layoutId`). ⚠️ Confirmar a versão com
  o produto; se o construtor tiver outra, troque no `bancada/scaffold/package.json` e rode o autoteste.
- **`lucide-react`**: a base em branco não o declara, mas duas telas em produção o importam — uma After Sales
  e um onboarding com simulador (outubro de 2026) —, então o construtor o instala. A base daqui fixa a
  1.55.0; a versão de lá não é conhecida, e o nome de um ícone pode mudar entre versões.
