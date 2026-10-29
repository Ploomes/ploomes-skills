# Pedido: Agenda de reposição

Anexos: `PEDIDO.md` (este), `src/ploomes/api.ts` e `src/ploomes/useConexao.ts` (gerados — copie sem
alterar), a pasta `kits/onboarding/` (o kit de onboarding — copie para `src/onboarding/kit/` sem alterar). Não há protótipo: decida o layout por este pedido, no estilo do CRM Ploomes.

## 1. O que é esta tela

O time de pós-venda de EPI acompanha os clientes que compram de novo em ciclos (mensal, trimestral…).
A tela abre na **janela da semana**: quem tem reposição prevista nos próximos 7 dias e precisa ser
contatado. Abaixo, um quadro com uma coluna por etapa do funil "Reposição Programada". Clicar numa
reposição abre a ficha dela, numa rota própria, onde a pessoa registra o consumo confirmado,
preenche os checklists da etapa (alguns itens são do cliente) e confirma a reposição.

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
   `@ploomescrm/bridge`. Nada de biblioteca de componente, de data, de ícone ou de CSS.
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
   o CRM tem modo escuro. Estilos próprios num `src/estilo.css` importado pelo `App`; não mexa no
   `index.css`.
9. **Nenhum ID fixo no código.** Funil, etapa e opção vêm de `idFunil`, `idEtapa`, `idOpcao`,
   `opcoes` e `etapasDoFunil`. Campo personalizado se lê com `ler` e `lerNome`.
10. **Não crie nem altere configuração da conta** (campos, opções, funis, checklists, automações).
11. **Estados obrigatórios em todo bloco:** carregando, vazio, erro (mensagem do `ErroApi`) e sem
    permissão (`status` 401/403). **Toda escrita que falhar mostra a mensagem do erro** e desfaz o
    que a tela já tinha mudado.
12. **Lista carrega sob demanda:** primeira página ao abrir, "carregar mais" com `proximoCursor`.
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
  ploomes/api.ts              ← anexo, sem alterar
  ploomes/useConexao.ts       ← anexo, sem alterar
  App.tsx                     ← useConexao, as <Routes> e o layout
  onboarding/kit/             ← anexo (kit de onboarding), sem alterar
  onboarding/roteiro.ts       ← o roteiro desta tela (subseção "Onboarding" da seção 4)
  estilo.css                  ← estilos da tela, só com tokens
  telas/Agenda.tsx            ← rota "/": a janela da semana em cima, o quadro embaixo
  telas/Ficha.tsx             ← rota "/reposicao/:id"
  componentes/                ← cartão, coluna, entrada por tipo de campo, estados
```

## 4. Telas e comportamentos

O nome do que está sendo acompanhado vem de `textosDoFunil('reposicao')`: use `unidade`/`unidades`
nos títulos e `verboGanhar` no botão de confirmar — não fixe "Negócio" nem "Ganhar".

### Agenda — rota `/`

**Janela da semana**
- **Dados:** `janelaDeReposicao({ ate })`, com `ate` = hoje + 7 dias, em lista: `Contact.Name`,
  `Title`, `ler(item, 'dataPrevista')` e `ler(item, 'consumoMensal')` em kg.
- **Regras:** data prevista anterior a hoje ganha a marca "Atrasada"; a lista vem ordenada pela data
  prevista na tela (a API devolve por Id). Vazia: "Nenhuma reposição prevista para os próximos 7 dias."
- **Ações:** clicar numa linha navega para `/reposicao/:id`.

**Quadro de reposições**
- **Dados:** uma coluna por etapa de `etapasDoFunil('reposicao')`, cada uma com
  `reposicoesDaEtapa({ etapaId })` e o seu "carregar mais". Cartão: `Contact.Name`, `Title`,
  `ler(item, 'dataPrevista')`, `lerNome(item, 'consumoConfirmado')`.
- **Ações:** clicar no cartão navega para `/reposicao/:id`; botões "◀" e "▶" movem para a etapa
  vizinha → `moverDeEtapa(id, { nativos: { StageId } })`.
- **Regras:** antes de avançar, `validarChecklist(id)`: com `valido` falso, não mova e mostre
  `pendentes`. `regrasDoFunil('reposicao').forbiddenStageReturn` esconde "◀". Reposição confirmada
  (`StatusId` 2) mostra a marca "Confirmada" e não tem "◀"/"▶".

### Ficha — rota `/reposicao/:id`
- **Dados:** `reposicaoPorId(id)` ao abrir e depois de toda ação. Checklists de
  `checklistsDaEtapa(id)`: cada item traz `valor`, `nomeDoValor`, `typeId`, `opcoes`, `obrigatorio`,
  `pendente` e **`entidade`** (`negocio` ou `cliente`). Mostre "do cliente" ao lado dos itens de
  cliente — a gravação já vai para o cliente sozinha.
- **Ações:**
  - "Registrar consumo" → `registrarConsumo(id, { campos: { consumoConfirmado, consumoMensal, dataPrevista } })`,
    com `consumoConfirmado` escolhido entre `opcoes('consumoConfirmado')`.
  - item de checklist → `salvarItemDoChecklist(id, fieldKey, valor)`, entrada conforme `typeId`:
    8 data, 1 texto curto, 2 texto longo, 4 inteiro, 5/6/13 decimal, 7 as `opcoes`, 10 sim/não.
  - confirmar → `confirmarReposicao(id)`; "Reabrir" → `reabrirReposicao(id)`.
  - "Voltar" → `navigate(-1)` do `react-router` (o voltar do navegador faz o mesmo).
- **Regras:**
  - Confirmar só habilita com `(await validarChecklist(id)).valido` e, se `winDealOnLastStage`, na
    última etapa. Desabilitado, mostre o motivo com `pendentes`. Se o servidor recusar mesmo assim,
    mostre a mensagem do `ErroApi` — ele é quem decide.
  - Reposição confirmada não muda de etapa; só "Reabrir".

### Onboarding — para quem usa a tela

Quem usa: o pós-venda de EPI, que liga para o cliente antes do estoque acabar.

- **Boas-vindas:**
  1. "Quem vai precisar de EPI esta semana" — a janela mostra as reposições previstas nos próximos 7 dias.
  2. "Uma coluna por etapa" — o quadro embaixo mostra todas as reposições, da mais nova à confirmada.
  3. "Confirme com o cliente" — na ficha, registre o consumo e confirme a reposição.
- **Tour:**
  - `janela` em `/` — "Janela da semana" — "Quem tem reposição prevista nos próximos 7 dias; as atrasadas ficam marcadas." — experimente: "Clique numa linha para abrir a reposição."
  - `quadro` em `/` — "O quadro" — "Cada coluna é uma etapa do funil Reposição Programada."
  - `mover` em `/` — "Avançar" — "Só avança com o checklist da etapa completo."
  - `registrar-consumo` em `/reposicao/:id` (abra a primeira da janela) — "Registrar consumo" — "O consumo confirmado com o cliente atualiza a próxima data prevista."
  - `confirmar` em `/reposicao/:id` — "Confirmar a reposição" — "Habilita quando o checklist está completo."
- **Primeiros passos:** "Abra uma reposição da semana" (ao abrir a ficha) · "Registre um consumo" (ao salvar) · "Preencha um item do checklist" (ao salvar um item).
- **Dicas:** "Atrasada" → "A data prevista já passou e o cliente ainda não foi contatado." · "Consumo mensal" → "Em kg; é o que define a próxima data."
- **Estados vazios:** janela vazia → "Nenhuma reposição prevista para os próximos 7 dias. Veja o quadro para as próximas."

## 5. Critérios de aceite

- [ ] A tela abre dentro do Ploomes sem login próprio e mostra a janela da semana e o quadro.
- [ ] Com o funil "Reposição Programada" renomeado, a tela mostra o erro de configuração com o nome.
- [ ] Nenhum arquivo além de `src/ploomes/api.ts` contém `fetch(` ou `User-Key`; `src/lib/` e
      `src/main.tsx` estão como na base.
- [ ] Abrir uma reposição muda a rota para `/reposicao/:id`, e o voltar do navegador volta à agenda.
- [ ] Um item de checklist do cliente aparece com o valor do cliente e é gravado no cliente.
- [ ] "▶" numa reposição com checklist obrigatório pendente não move e diz o que falta.
- [ ] O botão de confirmar usa o verbo que a conta define para o funil.
- [ ] Com a conta whitelabel, a cor de ação da tela muda junto (só tokens, nenhuma cor fixa).
- [ ] Na primeira vez, as boas-vindas abrem sozinhas depois que a tela carrega; o tour realça cada alvo do
      roteiro; "Ajuda" reabre o tour e os primeiros passos; cada tarefa feita marca o check.
- [ ] `src/onboarding/kit/` é idêntico ao anexo; quem pediu menos movimento no sistema não vê animação de deslocamento.

## 6. Dúvidas em aberto

Nenhuma.
