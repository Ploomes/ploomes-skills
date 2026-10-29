# Pedido: Quadro de embarques

Anexos: `PEDIDO.md` (este), `src/ploomes/api.ts` e `src/ploomes/useConexao.ts` (gerados — copie sem
alterar), a pasta `kits/onboarding/` (o kit de onboarding — copie para `src/onboarding/kit/` sem alterar), `prototipo.html` (referência visual, se houver).

## 1. O que é esta tela

O time de logística acompanha cada embarque vendido, da documentação até a entrega. A tela abre num
quadro com uma coluna por etapa do funil Embarques. Clicar num cartão abre a ficha do embarque, onde
a pessoa registra o carregamento e finaliza o embarque.

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
  telas/Quadro.tsx            ← rota "/": o quadro de embarques
  telas/Ficha.tsx             ← rota "/embarque/:id"
  telas/Busca.tsx             ← rota "/busca?nf=…" (a NF vai na query string)
  componentes/                ← cartão, coluna, campo de data, campo decimal, estados
```

## 4. Telas e comportamentos

### QuadroDeEmbarques — rota `/`
- **Dados:** uma coluna por etapa de `etapasDoFunil('embarques')`, na ordem. Cada coluna carrega a
  própria lista com `embarquesDaEtapa({ etapaId })` — ou `meusEmbarquesDaEtapa({ etapaId })` com o
  alternador "Só os meus" ligado — e tem o seu "carregar mais" (`proximoCursor`). Cartão: `Title`,
  `Contact.Name`, `lerNome(item, 'modal')`, `ler(item, 'dataEmbarque')`, `ler(item, 'toneladas')`.
- **Ações:** arrastar o cartão para outra coluna → `moverDeEtapa(id, { nativos: { StageId } })`.
- **Regras:**
  - Embarque aberto com data de embarque anterior a hoje ganha a marca "Atrasado".
  - Embarque ganho (`StatusId` 2) aparece com a marca "Finalizado" e não pode ser arrastado.
  - Respeite `regrasDoFunil('embarques')` ao soltar: `forbiddenStageReturn`, `mustPassAllStages`.

### FichaDoEmbarque — rota `/embarque/:id`
- **Dados:** `embarquePorId(id)` ao abrir e **depois de toda ação** (registrar, finalizar,
  reabrir, mover). Checklists de `checklistsDaEtapa(id)` — cada item já vem com `valor`,
  `nomeDoValor`, `preenchido`, `typeId` e `opcoes`: use esses campos, não leia `OtherProperties`
  para o checklist.
- **Ações:** "Registrar carregamento" → `registrarCarregamento(id, { campos: { dataEmbarque,
  notaFiscal, toneladas } })`; item de checklist editável → `salvarItemDoChecklist(id, fieldKey,
  valor)`, com a entrada conforme `typeId` (8 data, 1/2 texto, 4 inteiro, 5/6/13 decimal, 7 as
  `opcoes`, 10 sim/não); "Finalizar embarque" → `finalizarEmbarque(id)`; "Reabrir" →
  `reabrirEmbarque(id)`.
- **Regras:**
  - "Finalizar embarque" só habilita com `(await validarChecklist(id)).valido` e, se `winDealOnLastStage`, na
    última etapa. Quando
    desabilitado, mostre o motivo (use `pendentes`).
  - Embarque finalizado não muda de etapa; só "Reabrir".
  - O texto do botão de ganho é `textosDoFunil('embarques').verboGanhar` (a conta pode chamar de
    "Finalizar", "Fechar"…); não fixe o verbo.

### BuscaPorNotaFiscal — rota `/busca?nf=…`
- **Dados:** `buscarPorNotaFiscal({ nf })` ao confirmar a busca, com "carregar mais".
- **Ações:** clicar no resultado abre a `FichaDoEmbarque`.

### Onboarding — para quem usa a tela

Quem usa: o analista de logística, que acompanha os embarques do dia.

- **Boas-vindas:**
  1. "Seus embarques num quadro só" — cada coluna é uma etapa do embarque; cada cartão, um embarque.
  2. "Mova quando o caminhão andar" — "▶" leva o embarque para a próxima etapa, se o checklist estiver completo.
  3. "Ache pela nota fiscal" — a busca por NF leva direto ao embarque.
- **Tour:**
  - `colunas` em `/` — "As etapas" — "Cada coluna é uma etapa do funil de embarques, na ordem da conta." — experimente: "Role a coluna para ver mais embarques."
  - `cartao` em `/` — "Um embarque" — "O cartão mostra a NF, a data e quem cuida." — experimente: "Clique para abrir a ficha."
  - `mover` em `/` — "Avançar etapa" — "Só avança com o checklist da etapa completo; o que falta aparece aqui."
  - `busca` em `/` — "Busca por nota fiscal" — "Digite o número da NF para ir direto ao embarque."
  - `ajuda` — "Ajuda" — "Volte aqui para refazer o tour ou ver os primeiros passos."
- **Primeiros passos:** "Abra um embarque" (ao abrir a ficha) · "Preencha a data de embarque" (ao salvar o campo na ficha) · "Busque uma nota fiscal" (ao buscar).
- **Dicas:** "Data de embarque" → "Quando o caminhão sai. Sem ela, o embarque não avança." · "Checklist" → "O que a etapa exige antes de seguir."
- **Estados vazios:** coluna vazia → "Nenhum embarque nesta etapa." · busca sem resultado → "Nenhum embarque com esta NF. Confira o número."

## 5. Critérios de aceite

- [ ] A tela abre dentro do Ploomes sem login próprio e mostra os dados do usuário logado.
- [ ] Com o funil "Embarques" renomeado na conta, a tela mostra o erro de configuração com o nome
      que falta.
- [ ] Nenhum arquivo além de `src/ploomes/api.ts` contém `fetch(` ou `User-Key`.
- [ ] Cada coluna mostra até 50 cartões e tem o próprio "carregar mais".
- [ ] Um embarque com checklist obrigatório em branco não deixa finalizar; preenchido o item,
      o botão libera sem recarregar a tela.
- [ ] Um embarque finalizado não pode ser arrastado.
- [ ] Na primeira vez, as boas-vindas abrem sozinhas depois que a tela carrega; o tour realça cada alvo do
      roteiro; "Ajuda" reabre o tour e os primeiros passos; cada tarefa feita marca o check.
- [ ] `src/onboarding/kit/` é idêntico ao anexo; quem pediu menos movimento no sistema não vê animação de deslocamento.

## 6. Dúvidas em aberto

Nenhuma.
