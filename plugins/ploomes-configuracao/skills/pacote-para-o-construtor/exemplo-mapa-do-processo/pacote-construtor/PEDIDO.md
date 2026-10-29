# Pedido: Mapa do processo comercial

Anexos: `PEDIDO.md` (este), `src/ploomes/api.ts` e `src/ploomes/useConexao.ts` (gerados — copie sem
alterar), a pasta `kits/onboarding/` (o kit de onboarding — copie para `src/onboarding/kit/` sem alterar) e a pasta `vendor/xyflow/` (o React Flow embutido — copie para `src/vendor/xyflow/` sem
alterar). Não há protótipo: o visual é o do React Flow, no estilo do CRM Ploomes.

## 1. O que é esta tela

O gestor comercial abre a tela e vê o processo comercial da empresa em **duas abas**:

- **Conta hoje** — o processo como está configurado no Ploomes, lido da conta em tempo real: cada
  funil é uma faixa, cada etapa é um nó, as setas mostram por onde os negócios passam e as automações
  que os levam de um funil para outro. Em cada etapa: quantos negócios, quanto valem, há quanto tempo
  estão parados, quantos avançam. **Só lê.**
- **As-is** — o processo como era quando a empresa entrou no Ploomes, mapeado na imersão. É **onde a
  empresa guarda o próprio processo**: dá para ver, editar (etapas, raias, ligações, detalhes) e salvar
  dentro do Ploomes, com histórico de versões e download. Entra e sai também em **BPMN 2.0**
  (`.bpmn`), o formato em que quem implanta desenha o as-is no Camunda Modeler e no PAM (Ploomes Architecture Mapper, a ferramenta de desenho de processo).

A tela é **genérica**: serve para qualquer conta, sem nome de funil fixo.

## 2. Regras do trabalho

1. **Construa tudo nesta rodada.** Não peça confirmação passo a passo. Se algo estiver ambíguo,
   decida e registre a decisão na resposta final; só pare para perguntar o que está na seção 6.
2. **Você está na base do construtor de telas do Ploomes.** `src/main.tsx` e tudo em `src/lib/` são
   dela: **não edite**. O conteúdo da tela fica dentro de `<main className="app">`.
3. **A camada de dados já existe:** copie os anexos para `src/ploomes/api.ts` e
   `src/ploomes/useConexao.ts` **sem alterar nada**. Nenhum outro arquivo chama `fetch` ou monta URL
   da API. Se faltar uma função, diga na resposta final qual — não escreva uma.
4. **Conexão:** no topo do `App`, `const conexao = useConexao()` (de `./ploomes/useConexao`). Com
   `conexao.fase === 'conectando'`, mostre carregando; com `'erro'`, mostre `conexao.mensagem` e a
   lista `conexao.faltando` e um botão que chama `conexao.tentarDeNovo()` — não siga com a tela
   quebrada. Só com `'pronta'` as funções do `api.ts` são chamadas. Não chame `configurar` nem
   `iniciar` direto: o `useConexao` já faz, inclusive quando o CRM renova a `userKey`.
5. **Só estes pacotes existem no construtor:** `react`, `react-dom`, `react-router` (v7) e
   `@ploomescrm/bridge`. O React Flow **não é pacote**: vem embutido em `src/vendor/xyflow/` —
   importe de `./vendor/xyflow` (caminho relativo) e o CSS com `import './vendor/xyflow/style.css'`.
   Nada de outra biblioteca (gráfico, ícone, animação, layout automático, CSS).
6. **Rotas do `react-router`, uma por tela e por item aberto**, declaradas no `App.tsx` com
   `<Routes>`/`<Route>`, e a rota `path="*"` voltando para `/`. Navegue com o `useNavigate` do
   `react-router`. **Filtro, ordenação e página vão na query string** (`useSearchParams`). Assim o
   voltar do navegador e o link copiado funcionam dentro do CRM. Nada de `BrowserRouter`.
7. **Camada que cobre a tela** (modal, gaveta, alerta): `useViewportOverlay(aberto)` de `./lib`, a
   camada em `position: fixed` e em portal no `document.body` (`createPortal`). Sem isso o modal para
   na borda do frame.
8. **Cores e tema pelos tokens de `src/index.css`** (`var(--color-brand)`, `var(--color-background)`,
   `var(--color-font)`, `var(--color-neutral-level_1..3)`, `var(--color-success)`,
   `var(--color-alert)`, `var(--color-danger)`…). **Nenhuma cor fixa**: a conta pode ser whitelabel e
   o CRM tem modo escuro. O React Flow tem as variáveis próprias (`--xy-background-color`,
   `--xy-node-background-color`, `--xy-node-border`, `--xy-edge-stroke`, `--xy-minimap-*`,
   `--xy-controls-button-*`…): **ligue-as aos tokens** no seu `src/estilo.css`, dentro de
   `.react-flow`. Não mexa no `index.css` nem no `style.css` do vendor.
9. **Nenhum ID fixo no código.** Funil, etapa, gatilho, tipo de ação e integração vêm das leituras, e
   o nome que aparece é o que a conta devolve. As únicas constantes permitidas são as do sistema
   (seção 4.1).
10. **Não crie nem altere configuração da conta.** A única gravação desta tela é o as-is, com
    `salvarAsIs` (seção 4.4). Nada mais é escrito.
11. **Estados obrigatórios em todo bloco:** carregando, vazio, erro (mensagem do `ErroApi`) e sem
    permissão (`status` 401/403). Um bloco que falha não derruba o resto.
12. **Lista carrega sob demanda:** primeira página ao abrir, "carregar mais" com `proximoCursor`. As
    leituras agregadas (`abertosPorEtapa`, `fechadosPorEtapa`, `passagensPorEtapa`) já vêm somadas
    pelo servidor: **nunca** some negócio por negócio no navegador.
13. **Verifique uma vez, no fim:** `npx tsc --noEmit` e `npx vite build` sem erro, e responda com a
    lista dos critérios da seção 5.
14. **Toda tela tem onboarding para quem vai usá-la.** Copie `kits/onboarding/` para `src/onboarding/kit/`
    **sem alterar** e escreva só o roteiro, em `src/onboarding/roteiro.ts` (tipo `Roteiro` do kit), no
    vocabulário do cliente, a partir da subseção "Onboarding" da seção 4. Envolva a tela com
    `<OnboardingProvider roteiro={roteiro} usuarioId={config.userId} pronto={…a primeira vista carregou…}>`;
    ponha `<BotaoDeAjuda />` no cabeçalho; marque cada alvo do tour com `data-onboarding="<id>"`; ponha
    `<Dica id="…" />` ao lado dos rótulos que a subseção pede; e chame `useOnboarding().marcar('<tarefa>')`
    quando a pessoa fizer cada tarefa dos primeiros passos. Animação com `motion/react` (o construtor tem;
    o kit já usa `MotionConfig reducedMotion="user"`); estado vazio de cada bloco diz **o que fazer**, não só
    que está vazio.

## 3. Estrutura de arquivos

```
src/
  main.tsx, lib/, index.css   ← base do construtor, sem alterar
  ploomes/api.ts, ploomes/useConexao.ts   ← anexos, sem alterar
  vendor/xyflow/              ← anexo (React Flow embutido), sem alterar
  App.tsx                     ← useConexao, o cabeçalho com as duas abas, as <Routes>
  onboarding/kit/             ← anexo (kit de onboarding), sem alterar
  onboarding/roteiro.ts       ← o roteiro desta tela (subseção "Onboarding" da seção 4)
  estilo.css                  ← estilos da tela e o tema do React Flow, só com tokens
  conta/                      ← aba Conta hoje: dados (useProcesso, modelo), layout, nós e arestas do React Flow, gaveta da etapa
  asis/                       ← aba As-is: formato.ts (tipos e conversão da matriz), bpmn.ts (ler e gerar BPMN), useAsIs.ts (ler/salvar), editor, painel da etapa, versões
  componentes/                ← Filtros, Estado, Legenda, Modal, Confirmar
```

Rotas: `/` (Conta hoje), `/etapa/:etapaId` (Conta hoje com a gaveta da etapa), `/as-is` (As-is) e
`/as-is/:etapaId` (As-is com o painel da etapa). Query: `funil`, `responsavel`, `periodo` (Conta hoje).

## 4. Telas e comportamentos

### 4.1 Cabeçalho e constantes

Cabeçalho comum: título "Processo comercial", as abas **Conta hoje** e **As-is** (pílulas, rota
própria), e à direita os controles da aba aberta.

Constantes do sistema (as únicas permitidas): `EntityId` 1 Cliente, 2 Negócio, 3 Lead, 4 Venda,
7 Proposta, 12 Tarefa, 66 Documento; `StatusId` 1 aberto, 2 ganho, 3 perdido.

### 4.2 Conta hoje — rota `/` (só lê)

**Dados**, carregados em paralelo quando a conexão fica `'pronta'`:
- **Funis e etapas:** `funisDaConta()` (todas as páginas; `Stages` por `Ordination`); regras
  `MustPassAllStages`, `ForbiddenStageReturn`, `WinDealOnLastStage`.
- **Abertos por etapa:** `abertosPorEtapa()` — com o filtro de responsável,
  `abertosPorEtapaDoResponsavel({ responsavelId })`. Linha: `PipelineId`, `StageId`, `Quantidade`,
  `Valor`, `DiasMedios`.
- **Fechados no período:** `fechadosPorEtapa({ desde })` — ou `fechadosPorEtapaDoResponsavel({ desde,
  responsavelId })`. Linha: `PipelineId`, `StageId`, `StatusId`, `Quantidade`, `Valor`.
- **Passagens no período:** `passagensPorEtapa({ desde })` — ou
  `passagensPorEtapaDoResponsavel({ desde, responsavelId })`. Linha: `StageId`, `Advanced`, `Won`,
  `Lost`, `Quantidade`, `DiasMedios`; os três falsos = ainda na etapa.
- **Checklists:** `checklists()` (`DealStageId`; `Fields` com `Name`, `Required`).
- **Automações:** `automacoes()`, `gatilhos()`, `tiposDeAcao()`. `TriggerDealStageId` liga à etapa
  (nulo = vale para a entidade toda); a ação com `DealStageId` leva o negócio para aquela etapa — é o
  que liga um funil a outro; `ShouldGenerateDocument` gera documento; `Enabled` falso = desligada;
  `DisabledDueToError` = parou por erro.
- **Sistemas e documentos:** `integracoesDaConta()` + `catalogoDeIntegracoes()`, `webhooks()` +
  `acoesDeWebhook()` (não há URL — não mostre nem tente buscar), `modelosDeDocumento()`.
- **Responsáveis:** `usuarios()`.

**Cálculos por etapa** (funções puras): conversão = `Advanced` ÷ encerradas (`Advanced`+`Won`+`Lost`);
perda = `Lost` ÷ encerradas; tempo médio = `DiasMedios` das encerradas, ponderado por `Quantidade`;
parados agora = `DiasMedios` dos abertos; **gargalo** = maior tempo médio do funil e ≥ 2× a mediana.

**Cabeçalho da aba:** Funil (`?funil`), Responsável (`?responsavel`), Período 30/90/365 (`?periodo`,
padrão 90), "Atualizar" e "atualizado às HH:MM". Sem recarga automática.

**O mapa (React Flow, `nodesDraggable`, `fitView`):**
- Layout automático: uma faixa por funil (nó de grupo com o nome e os selos das regras), as etapas da
  esquerda para a direita, os nós terminais **Ganhos** e **Perdidos** no fim; embaixo a faixa
  **Sistemas e documentos** (integrações, "Webhooks" agrupados por entidade e ação, modelos por
  entidade).
- Nó de etapa (nó personalizado): nome; abertos e valor (`Intl.NumberFormat` do `config.language`,
  compacto); "parados há X dias"; selos de checklist (nº obrigatórios) e de automação (em
  `var(--color-danger)` se alguma parou por erro); o gargalo com borda `var(--color-alert)`.
- Arestas: etapa → etapa seguinte (espessura pelas passagens, rótulo "conversão · tempo"); última
  etapa → Ganhos; etapa → Perdidos (se houve perda); **entre funis**, cada ação com `DealStageId`
  noutro funil (tracejada e `animated`, `var(--color-brand)`, rótulo com o nome do tipo de ação);
  etapa → documentos (gera documento) e → integração (o nome do tipo de ação cita a integração);
  Ganhos → Webhooks (webhook ativo de negócio ganho).
- `<Background>`, `<Controls>` (zoom, ajustar, travar) e `<MiniMap>`; botão **Reorganizar** que
  volta ao layout automático. Posições arrastadas ficam no `localStorage` (chave com o `userId`), com
  `try/catch`.
- Passar o mouse num nó realça as arestas dele; clicar numa etapa navega para `/etapa/:etapaId`
  (mantendo a query).

**Gaveta da etapa — `/etapa/:etapaId`** (480 px; tela cheia no celular; `useViewportOverlay`):
abas **Números**, **Negócios** (`negociosDaEtapa({ etapaId })` ou `negociosDaEtapaDoResponsavel`,
"carregar mais" pelo `proximoCursor`, ordem por `DaysInStage`; clicar abre no Ploomes com
`navigate({ to: '/deals/detail', params: { id } })` do `usePloomesBridge()`), **Checklists** e
**Automações** (gatilho, ações, "→ funil › etapa" clicável, selo ativa/desligada/parou por erro,
`LastRunTime`). Fechar e **Esc** voltam para `/` com a mesma query.

### 4.3 As-is — rota `/as-is`

**Onde mora:** num campo de texto longo de "Sua empresa", o `asIs` do `api.ts`, achado **pelo nome**
("Mapeamento as-is (tela)") na abertura. Leia com `contaComAsIs()` (um registro: a conta) e
`ler(conta, 'asIs')` — é um texto JSON no formato abaixo.
- `campoDisponivel('asIs')` falso → a aba mostra: "Esta conta ainda não tem o campo **Mapeamento
  as-is (tela)**. Peça ao administrador para criá-lo em *Sua empresa*, do tipo *Texto multilinha*,
  com este nome exato." — e a aba Conta hoje continua funcionando.
- Campo vazio → estado vazio com dois botões: **Importar o mapeamento as-is** e **Começar em branco**.
- Texto que não é JSON do formato → aviso "O conteúdo salvo não é um as-is desta tela" com
  **Baixar o conteúdo** e **Começar em branco** (que só substitui ao salvar).

**O formato salvo** (`asis/formato.ts`, tipos e validação):

```ts
type MapaAsIs = {
  formato: 'ploomes-mapa-asis'; versao: 1;
  atualizadoEm: string; atualizadoPor: { id: number; nome: string };
  origem: { tipo: 'matriz-asis' | 'bpmn' | 'branco'; arquivo?: string; importadoEm?: string };
  raias: { id: string; nome: string }[];
  etapas: { id: string; tipo: 'inicio' | 'tarefa' | 'decisao' | 'espera' | 'subprocesso' | 'fim';
            nome: string; raia: string; fase?: string; descricao?: string; responsavel?: string;
            sistemas?: string[]; canal?: string; documentos?: string[]; regra?: string; lacuna?: string;
            x?: number; y?: number }[];
  ligacoes: { id: string; de: string; para: string; rotulo?: string }[];
  anteriores: { salvoEm: string; salvoPor: string; resumo: string; raias; etapas; ligacoes }[]; // até 5
};
```

**Importar o mapeamento as-is** (`<input type="file" accept=".json,.bpmn,.xml">`, lido no navegador,
nada sobe antes de salvar). O mesmo botão aceita dois arquivos: o **`.bpmn`** (ou `.xml`, ou texto que
começa com `<`) vai para a leitura de BPMN abaixo; o resto, para a matriz JSON — o
`as-is-matriz-<cliente>.json` que a skill de mapeamento grava (`schemaVersion` 3). Conversão da matriz:
- `matrixRows[]` → `etapas`: `stableRowKey`→`id`, `activityName`→`nome`, `activityDescription`→
  `descricao`, `macroStage`→`fase`, `actor`→`responsavel`, `system` (separado por `;`)→`sistemas`,
  `channel`→`canal`, `documentUsed`/`documentGenerated`→`documentos`, `businessRule`→`regra`,
  `gapOrUncertainty`→`lacuna`; `lane` → `raia` (uma raia por `lane` distinto, na ordem em que aparece).
- `elementType`: `START_EVENT`→`inicio`; `END_EVENT`→`fim`; `EXCLUSIVE_GATEWAY`/`PARALLEL_GATEWAY`→
  `decisao`; `SUBPROCESS`→`subprocesso`; `RECEIVE_TASK`/`INTERMEDIATE_CATCH`/`TIMER_EVENT`→`espera`;
  o resto → `tarefa`.
- `nextStepIds[i]` → uma ligação por item; numa decisão, `decisionOptions[i]` é o `rotulo` dela.
- Sem `x`/`y`: layout automático (raias em faixas horizontais, ordem de `orderIndex`).
- Arquivo que não é matriz → "Este arquivo não é um mapeamento as-is (falta `matrixRows`)".
Depois de importar, a tela mostra o mapa **não salvo** e o botão Salvar destacado.

**Importar .bpmn** (`asis/bpmn.ts`, `importarBpmn`, que recebe o texto e o nome do arquivo e devolve o mesmo
`ResultadoDaImportacao` da matriz). Quem implanta desenha o as-is no **Camunda Modeler** ou no **PAM**
(Ploomes Architecture Mapper, o mesmo dialeto bpmn.io) e importa aqui. Leia o XML no navegador com
`DOMParser` (`application/xml`), sem rede e sem biblioteca; ache os elementos por **namespace**
(`getElementsByTagNameNS` e `localName`), nunca pelo prefixo `bpmn:`, que muda de arquivo para
arquivo. Namespaces: `MODEL` = `http://www.omg.org/spec/BPMN/20100524/MODEL`, `BPMNDI` =
`http://www.omg.org/spec/BPMN/20100524/DI`, `DC` = `http://www.omg.org/spec/DD/20100524/DC`,
`DI` = `http://www.omg.org/spec/DD/20100524/DI`. "Limpo" = espaços seguidos (inclusive quebra de
linha) viram um só, sem espaço nas pontas.

- **Formas:** cada `BPMNDI:BPMNShape` com `DC:Bounds` dá `bpmnElement` → `{x, y, width, height}`.
- **Pool:** cada `MODEL:participant` com `processRef` dá o nome do pool daquele processo (limpo; sem
  nome, o `id` do participante); participante sem `processRef` é ignorado. Processo sem participante
  usa o próprio `name` limpo, ou o `id`.
- **Raias**, processo por processo, na ordem do arquivo:
  - com `lane`: cada `lane` (em qualquer nível) que **não** tem `childLaneSet` vira a raia
    `{ id: <id da lane>, nome }` com o **nome curto**: se o nome do pool começa por `SP` + número
    (`/^(SP\d+)\b/` — os subprocessos do mapeamento), `nome = "SPn · <nome limpo da lane>"`;
    senão (o processo principal), só `<nome limpo da lane>`. Lane
    sem nome = "Sem nome". Os `flowNodeRef` dela (texto limpo) dizem quais elementos estão nela, e a
    forma da lane é a área da raia;
  - sem `lane`: o pool inteiro é **uma raia**, `{ id: "pool-<id do processo>", nome: "<pool>" }`, e a
    área é a forma do participante.
- **Etapas:** só os **filhos diretos** do `process` (o que está dentro de subprocesso não vira etapa):

  | Elemento BPMN | `tipo` |
  |---|---|
  | `startEvent` | `inicio` |
  | `endEvent` | `fim` |
  | `exclusiveGateway`, `parallelGateway`, `inclusiveGateway`, `eventBasedGateway`, `complexGateway` | `decisao` |
  | `intermediateCatchEvent`, `intermediateThrowEvent`, `receiveTask` | `espera` |
  | `subProcess`, `callActivity`, `transaction` | `subprocesso` |
  | `task`, `userTask`, `sendTask`, `serviceTask`, `manualTask`, `scriptTask`, `businessRuleTask` | `tarefa` |

  Qualquer outro filho (fluxo, dado, anotação, `laneSet`…) não é etapa.
  - `id` = o `id` do elemento; `nome` = `name` limpo, ou, sem nome: "Início", "Fim", "Decisão", ou o
    nome local da tag (`userTask`, `subProcess`…) para os outros tipos.
  - `descricao` = estas linhas, unidas por `\n`, sem linha vazia: o texto limpo de cada
    `documentation` filha, na ordem; num **subprocesso**, depois, "Etapas do subprocesso: A; B; C." com
    o `name` limpo dos filhos diretos dele que são etapa pela tabela (os sem nome ficam fora; sem
    nenhum, sem a linha); por último, "Nota: <texto>" para cada `textAnnotation` (texto limpo do
    `text`) ligada ao elemento por uma `association`, em qualquer sentido. Sem nada, sem `descricao`.
  - `documentos` = o `name` limpo de cada `dataObjectReference` ou `dataStoreReference` ligado ao
    elemento por uma `dataOutputAssociation` (pelo `targetRef`) ou `dataInputAssociation` (pelo
    `sourceRef`) filha dele, sem repetidos, em **ordem `.sort()`** do JavaScript (sem `localeCompare`).
  - `raia` = a raia cujo `flowNodeRef` cita o elemento; num pool com lanes, elemento que nenhuma lane
    cita vai para a **primeira raia daquele processo**, com aviso.
  - campo sem valor fica fora do objeto (como na matriz).
- **Ligações:** cada `sequenceFlow` em qualquer nível do processo vira `{ id, de: sourceRef, para:
  targetRef }`, com `rotulo` = `name` limpo, se houver; depois, cada `messageFlow`, com `rotulo` =
  "mensagem" ou "mensagem: <name limpo>". Ligação cuja ponta não é etapa (dentro de subprocesso,
  anotação, pool fechado) é descartada, com **um** aviso que diz quantas.
- **Posição — primeiro, a do desenho** (`BPMNShape`): `minX` = o menor `x` entre as formas das
  etapas (todas as raias); `x = Math.round(CABECA_DA_RAIA + 30 + (xBPMN − minX) × 1,75)`; com área de
  raia de altura > 0, `centro = (yBPMN + alturaBPMN/2 − yDaArea) ÷ alturaDaArea` e
  `y = Math.round(centro × ALTURA_DA_RAIA − h/2)`, com `h` a altura do tipo em `TAMANHO_DO_TIPO`; sem
  área, `y = Math.round((ALTURA_DA_RAIA − h)/2)`. Etapa sem forma fica sem `x`/`y`. O `y` é relativo
  ao topo da raia, como no resto do editor.
- **Depois, quem decide:** se o `definitions` tem `exporter="Ploomes — Mapa do processo comercial"`
  (o arquivo saiu do Baixar .bpmn desta tela e não passou por outro editor), as posições do desenho
  **ficam** (etapa sem forma: `posicionar`). Em **qualquer outro
  arquivo** (Camunda, PAM (Ploomes Architecture Mapper)), passe o resultado por **`organizarPeloFluxo`** (abaixo, no editor). As
  posições do desenho servem só para desempatar a ordem lá dentro.
- **Detalhes da tela:** se o elemento tiver `extensionElements` > `ploomes:detalhes` (namespace
  `https://ploomes.com/schema/mapa-asis/1`, que o Baixar .bpmn grava), leia de cada
  `ploomes:campo nome="…"` o texto exato: `fase`, `responsavel`, `canal`, `regra` e `lacuna` (um
  cada), `sistemas` e `documentos` (um por item, na ordem). Os `documentos` dali somam-se aos dos
  dados ligados (sem repetidos, ordem `.sort()`).
- **Raias** sem nenhuma etapa saem; as outras ficam na ordem do arquivo.
- `origem` = `{ tipo: 'bpmn', arquivo: <nome do arquivo>, importadoEm: agora }`.
- **Erros:** o XML não abre (`parsererror`) → "“<arquivo>” não é um BPMN válido: o XML não abre.";
  sem nenhum `process` → "“<arquivo>” não tem processo BPMN." (nos dois, o rascunho fica como
  estava); nenhuma etapa → aviso "O BPMN não tem nenhuma etapa.". Depois, como na matriz:
  confirmação se houver rascunho, mapa **não salvo** e o aviso com raias, etapas, ligações e avisos.

**Baixar .bpmn** (`asis/bpmn.ts`, `exportarBpmn`, que recebe o `Conteudo` e o nome da conta e devolve o texto): gera no navegador
`as-is-<conta>.bpmn` (o nome do JSON, com `.bpmn`; tipo `application/xml`) — um **BPMN 2.0 válido,
com o desenho (BPMNDI)**, que abre no Camunda Modeler e no PAM (Ploomes Architecture Mapper) e que, importado de volta aqui,
**redesenha o mesmo mapa**: as mesmas raias na mesma ordem, as etapas com todos os campos, as
ligações com os rótulos e as posições (no máximo deslocadas na horizontal; salvo de novo no Camunda
ou no PAM (Ploomes Architecture Mapper), volta organizado pelo fluxo). Monte com
`document.implementation.createDocument` + `createElementNS` + `XMLSerializer` — **nunca por
concatenação de texto**: é o que escapa `&`, `<` e aspas dos nomes. Prefixos `bpmn`, `bpmndi`, `dc`,
`di` e `ploomes`, declarados no `definitions`; o texto começa por `<?xml version="1.0" encoding="UTF-8"?>`.

- **`definitions`**: `id="Definitions_1"`, `targetNamespace="http://bpmn.io/schema/bpmn"`,
  `exporter="Ploomes — Mapa do processo comercial"`, `exporterVersion="1"`. Filhos, nesta ordem: a
  `collaboration` (`id="Collaboration_1"`), os `process` e o `BPMNDiagram`.
- **IDs:** o id de raia, etapa e ligação vai **como está** se for nome XML válido
  (`/^[A-Za-z_][A-Za-z0-9_.-]*$/`) e ainda não usado no arquivo; senão, troque cada caractere que não
  vale por `_`, ponha `_` na frente se começar com dígito ou `-`/`.`, e some `_2`, `_3`… até ficar
  único. Os ids criados aqui (`Collaboration_1`, `Participant_<n>`, `Process_<n>`, `LaneSet_<n>`,
  `DataObject_<n>`, `DataObjectReference_<n>`, `DataAssociation_<n>`, `TimerDef_<n>`, `<id>_di`)
  também contam como usados.
- **Pools e lanes** (a conta inversa dos nomes curtos): as raias cujo nome começa por `SPn · `
  (`/^(SP\d+) · /`) vão para o pool **`SPn`** (um pool por número, na ordem em que aparece), com
  `lane name` = o que vem depois de `SPn · `; **todas as outras** vão, na ordem, como lanes de **um só**
  pool, o processo principal, com `name` = o nome da conta (a função recebe também o nome da conta)
  e `lane name` = o nome inteiro da raia. O pool principal vem primeiro, depois os `SPn`. Cada pool é
  um `participant` (`name`, `processRef`) com o seu `process` (`isExecutable="false"`) e um `laneSet`
  com uma `lane` por raia (`id` = o da raia), cada uma com os `flowNodeRef` das etapas dela.
- **Elementos**, no `process` da raia da etapa: `inicio` → `startEvent`, `fim` → `endEvent`, `decisao`
  → `exclusiveGateway`, `espera` → `intermediateCatchEvent` com um `timerEventDefinition` vazio,
  `subprocesso` → `subProcess` vazio, `tarefa` → `task`; `name` = o nome. Filhos na ordem que o
  schema exige: `documentation` (**uma por linha** não vazia da `descricao`: a importação limpa cada
  uma e junta com `\n`, então a quebra de linha volta), `extensionElements`, `incoming`
  e `outgoing` (ids dos `sequenceFlow` que chegam e saem), a associação de dado e, por último, a
  definição de evento.
  - **Documentos:** em `tarefa`, `subprocesso`, `espera` e `inicio`, cada documento é um
    `dataObjectReference` (`name` = o documento, `dataObjectRef` → um `dataObject` vazio) no mesmo
    processo, ligado por uma `dataOutputAssociation` do elemento com `targetRef` → a referência. A
    `decisao` não aceita dado, e no `fim` o schema pediria um `dataInput` próprio: nesses dois, o
    documento vai só na extensão.
  - **Extensão:** se a etapa tiver `fase`, `responsavel`, `canal`, `regra`, `lacuna`, `sistemas` ou
    for `decisao` ou `fim` com documento: `extensionElements` > `ploomes:detalhes` > um `ploomes:campo
    nome="fase"` (etc.) por valor, com o valor como **texto** do elemento, não atributo — assim a
    quebra de linha sobrevive; `sistemas` e `documentos`, um `ploomes:campo` por item.
- **Ligações:** pontas no **mesmo processo** → `sequenceFlow` dentro dele (`sourceRef`, `targetRef`,
  `name` = o rótulo); em processos diferentes → `messageFlow` na `collaboration`, com `name` = o
  rótulo **sem** o "mensagem: " ou "mensagem" do começo (a importação põe de volta). Ligação com ponta
  que não existe fica fora.
- **Desenho** — `BPMNDiagram` > `BPMNPlane` (`bpmnElement="Collaboration_1"`), um `BPMNShape` ou
  `BPMNEdge` por elemento, `id` = `<id>_di`:
  - tamanhos do PAM (Ploomes Architecture Mapper): tarefa e subprocesso 100×80, decisão 50×50, eventos 36×36, dado 36×50;
  - cada raia tem **220 de altura**; os pools, empilhados na ordem a partir de `y = 0`, sem vão, com
    `x = 0`, e a faixa do nome com 30 (as lanes começam em `x = 30`); todos da mesma largura = a maior
    borda direita das formas + 60; participante e lane com `isHorizontal="true"`;
  - etapa: `xBPMN = 70 + (x − minX) ÷ 1,75` (`minX` = o menor `x` das etapas; é a conta inversa da
    importação) e o **centro** vertical em `yDaRaia + (y + h/2) × 220 ÷ ALTURA_DA_RAIA`, com `h` a
    altura do tipo na tela; passe antes pelo `posicionar` para quem não tem `x`/`y`;
  - `exclusiveGateway` com `isMarkerVisible="true"`; `subProcess` com `isExpanded="false"`;
  - dado: encostado no fundo da raia (`y = fundoDaRaia − 54`), a partir do `x` da etapa, um ao lado do
    outro a cada 44; a associação vai do centro da etapa ao centro do dado;
  - arestas com `di:waypoint` (no mínimo dois, arredondados): destino à direita → sai do meio da
    direita e entra no meio da esquerda, em ângulo reto pelo meio do caminho; senão, sai de baixo (de
    cima, se o destino estiver acima) e entra por cima (por baixo), em ângulo reto;
  - sem cor (o Camunda e o PAM (Ploomes Architecture Mapper) aplicam a paleta deles).

**O editor (React Flow):**
- Raias como **faixas horizontais** (nó de grupo por raia, com o nome à esquerda); cada etapa dentro da
  sua raia. **Arrastar a etapa para outra faixa troca a raia.**
- Nó por tipo: início e fim (círculo), tarefa (retângulo), decisão (losango), espera (com relógio),
  subprocesso (retângulo com "+"); selo de **lacuna** (`var(--color-alert)`) quando houver.
- **Editar:** arrastar move; puxar de um ponto de ligação até outra etapa cria a ligação; selecionar e
  `Delete` remove (com confirmação se a etapa tiver ligações); duplo clique no nome renomeia; botão
  **+ Etapa** (escolhe o tipo, entra na raia selecionada) e **+ Raia**; renomear e reordenar raias;
  rótulo da ligação editável (duplo clique). **Desfazer/refazer** (Ctrl+Z / Ctrl+Shift+Z), na memória.
- **Organizar pelo fluxo** (botão; `asis/organizar.ts`, `organizarPeloFluxo`, função pura; dá para
  desfazer): reposiciona as etapas pela ordem do processo. (1) tira os retornos (ciclos) por busca em
  profundidade, começando pelas etapas `inicio` e seguindo na ordem do desenho (x, depois y absoluto);
  (2) ordem topológica sem os retornos; coluna = maior coluna das anteriores + 1 (0 sem anterior);
  ligações de "mensagem" não contam; (3) no máximo 2 etapas por célula (raia × coluna), e dois nós
  pequenos (início, fim, decisão) nunca dividem a célula — cheia, vai para a coluna seguinte;
  (4) `x = CABECA_DA_RAIA + 30 + coluna × 230` (centralizado pelo tamanho do tipo); uma etapa na
  célula fica no meio da raia, duas ficam uma em cima e outra embaixo.
- **Painel da etapa — `/as-is/:etapaId`** (gaveta, `useViewportOverlay`): tipo, nome, raia, fase,
  descrição, responsável, sistemas, canal, documentos, regra e lacuna — editáveis (rascunho até salvar).
- **Salvar** (habilitado só com mudança; o cabeçalho mostra "alterações não salvas"):
  1. pede um resumo curto ("O que mudou?", opcional);
  2. relê com `contaComAsIs()`: se o `atualizadoEm` salvo mudou desde que você abriu, **não grave** —
     mostre "Outra pessoa salvou o as-is às HH:MM" com **Recarregar** e **Salvar mesmo assim**;
  3. põe a versão que estava salva no começo de `anteriores` (no máximo 5; se o texto passar de
     1.000.000 de caracteres, tire as mais antigas) e grava com
     `salvarAsIs(conta.Id, { campos: { asIs: JSON.stringify(mapa) } })`, com `atualizadoEm` = agora e
     `atualizadoPor` = o usuário (`config.userId`; o nome de `usuarios()`).
  Erro: mostre a mensagem do `ErroApi` e **não perca o rascunho**. Sair da aba ou da tela com
  rascunho pede confirmação.
- **Versões:** lista de `anteriores` (quando, quem, resumo); abrir uma mostra o mapa só para ver, com
  **Restaurar esta versão** (vira rascunho, que se salva normalmente).
- **Baixar:** duas opções lado a lado, **Baixar .json** (`as-is-<conta>.json`, o formato acima) e
  **Baixar .bpmn** (acima). As duas geram no navegador, do rascunho atual, sem chamar a API.
- `<Background>`, `<Controls>`, `<MiniMap>`; legenda dos tipos.

### 4.4 O que esta tela grava

Só o campo `asIs` da conta, por `salvarAsIs`, quando o usuário clica em Salvar. Nada mais.

### Onboarding — para quem usa a tela

Quem usa: o gestor comercial, que quer ver e guardar o processo da empresa.

- **Boas-vindas:**
  1. "O seu processo comercial, vivo" — a aba Conta hoje desenha os funis e os números de agora, direto do Ploomes. (ícone `mapa`)
  2. "Onde os negócios param" — em cada etapa, quantos estão ali, há quanto tempo e quantos avançam; o gargalo fica destacado. (ícone `grafico`)
  3. "O processo de quando vocês começaram" — a aba As-is guarda o mapeamento da implantação; dá para editar e salvar. (ícone `editar`)
  4. "Ajuda a qualquer hora" — o botão Ajuda reabre este tour e os primeiros passos. (ícone `alvo`)
- **Tour:**
  - `filtros` em `/` — "Filtros" — "Escolha o funil, o responsável e o período dos números." — experimente: "Troque para 30 dias."
  - `etapa` em `/` (a primeira etapa do primeiro funil) — "Uma etapa" — "Abertos, valor e há quanto tempo estão parados." — experimente: "Clique para ver os negócios."
  - `conversao` em `/` (a primeira aresta com rótulo) — "Conversão" — "Quantos dos que passaram por aqui avançaram, e em quantos dias."
  - `automacao-entre-funis` em `/` — "Automação entre funis" — "A linha tracejada mostra a automação que leva o negócio para outro funil."
  - `aba-as-is` — "As-is" — "O processo de quando a empresa entrou no Ploomes." — experimente: "Abra a aba."
  - `editor-asis` em `/as-is` — "Editar o as-is" — "Arraste etapas, ligue uma à outra e salve; cada versão fica guardada."
  - `organizar` em `/as-is` — "Organizar pelo fluxo" — "Reorganiza o desenho pela ordem das etapas."
  - `ajuda` — "Ajuda" — "Volte aqui para refazer o tour."
- **Primeiros passos:** "Troque o período" (ao mudar `periodo`) · "Abra uma etapa" (ao abrir a gaveta) · "Abra a aba As-is" (ao entrar em `/as-is`) · "Salve o as-is" (ao salvar com sucesso).
- **Dicas:** "Conversão" → "Dos negócios que saíram desta etapa no período, quantos avançaram." · "Parados há" → "Média de dias dos negócios abertos nesta etapa." · "Gargalo" → "A etapa com o maior tempo do funil, pelo menos o dobro da média." · "Versões" → "As 5 últimas versões salvas do as-is; dá para restaurar."
- **Estados vazios:** conta sem funil → "Esta conta ainda não tem funil. Crie um no Ploomes e volte aqui." · as-is vazio → o "Importar ou Começar em branco" que já existe, com a dica "Peça a quem implantou o arquivo do mapeamento".

## 5. Critérios de aceite

- [ ] A tela abre dentro do Ploomes sem login próprio, com as abas Conta hoje e As-is, cada uma na sua rota.
- [ ] Nenhum arquivo além de `src/ploomes/api.ts` contém `fetch(` ou `User-Key`; `src/lib/`, `src/main.tsx` e `src/vendor/xyflow/` estão como entregues; nenhum `import` de pacote fora dos quatro permitidos.
- [ ] Conta hoje desenha todos os funis da conta em React Flow, com números de `abertosPorEtapa`, `fechadosPorEtapa` e `passagensPorEtapa`, sem baixar os negócios.
- [ ] As automações que levam o negócio para outro funil aparecem como arestas animadas entre as faixas.
- [ ] Clicar numa etapa da Conta hoje abre `/etapa/:etapaId`; a lista de negócios carrega mais e abre o registro no CRM.
- [ ] Sem o campo "Mapeamento as-is (tela)" na conta, a aba As-is explica como criá-lo e a Conta hoje continua funcionando.
- [ ] Importar o `as-is-matriz-<cliente>.json` desenha as raias, as etapas por tipo e as ligações com os rótulos das decisões.
- [ ] Editar (mover, trocar de raia, ligar, renomear, criar, apagar) e Salvar grava no campo; recarregar a tela mostra o que foi salvo.
- [ ] Se outra pessoa salvou depois que você abriu, Salvar avisa em vez de sobrescrever.
- [ ] Importar um `.bpmn` do Camunda ou do PAM (Ploomes Architecture Mapper) desenha as raias com o nome curto (a lane; "SPn · lane" nos subprocessos), as etapas por tipo, as descrições, notas e documentos e as ligações (de sequência e de mensagem), organizadas pelo fluxo, sem chamar a API, e fica como rascunho até Salvar.
- [ ] Um `.bpmn` que não abre ou sem processo mostra o erro e não mexe no rascunho.
- [ ] Versões anteriores aparecem e podem ser restauradas; Baixar .json e Baixar .bpmn geram o arquivo sem chamar a API.
- [ ] O `.bpmn` baixado é BPMN 2.0 com BPMNDI (abre no Camunda Modeler e no PAM (Ploomes Architecture Mapper)) e, importado de volta, redesenha o mesmo mapa: raias, etapas com todos os campos, ligações e posições.
- [ ] Com a conta whitelabel e no modo escuro, as cores acompanham, inclusive as do React Flow (só tokens).
- [ ] A tela não faz requisição que não seja GET, exceto o `PATCH Account` do Salvar.
- [ ] Na primeira vez, as boas-vindas abrem sozinhas depois que a tela carrega; o tour realça cada alvo do
      roteiro; "Ajuda" reabre o tour e os primeiros passos; cada tarefa feita marca o check.
- [ ] `src/onboarding/kit/` é idêntico ao anexo; quem pediu menos movimento no sistema não vê animação de deslocamento.

## 6. Dúvidas em aberto

Nenhuma.
