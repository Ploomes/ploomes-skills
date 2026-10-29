# Modelo do `PEDIDO.md`

É a instrução de construção da tela, escrita para um **agente**: imperativo, sem contexto de venda,
sem história do cliente. Ela é lida em dois lugares, com o mesmo texto:

1. **Aqui, na bancada** — o agente constrói a tela dentro de `bancada/scaffold/` (a base exata do
   construtor) e o resultado vai ao construtor pelo **importar** (passo 9 da skill). É o caminho
   padrão: o agente do construtor não roda.
2. **No construtor**, como mensagem com anexos — quando a importação não for possível.

O portão exige as seis seções com estes títulos exatos. Alvo: **até 30 mil caracteres**.
Substitua o que está entre `<>`. Não apague as regras da seção 2.

````markdown
# Pedido: <nome da tela>

Anexos: `PEDIDO.md` (este), `src/ploomes/api.ts` e `src/ploomes/useConexao.ts` (gerados — copie sem
alterar), a pasta `kits/onboarding/` (o kit de onboarding — copie para `src/onboarding/kit/` sem alterar) e
`prototipo.html` (referência visual, se houver).

## 1. O que é esta tela

<Duas a quatro frases: quem usa, a tarefa do começo ao fim, o que ela vê primeiro (lista, quadro,
ficha ou painel). No vocabulário do cliente.>

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
6. **Rotas do `react-router`, uma por tela e por item aberto** (`/`, `/cotacao/:id`…), declaradas
   no `App.tsx` com `<Routes>`/`<Route>`, e a rota `path="*"` voltando para `/`. Navegue com o
   `useNavigate` do `react-router`. **Filtro, ordenação e página vão na query string**
   (`useSearchParams`). Assim o voltar do navegador e o link copiado funcionam dentro do CRM. Nada de
   `BrowserRouter`.
7. **Camada que cobre a tela** (modal, gaveta, alerta): `useViewportOverlay(aberto)` de `./lib`, a
   camada em `position: fixed` e em portal no `document.body` (`createPortal`). Sem isso o modal para
   na borda do frame.
8. **Cores e tema pelos tokens de `src/index.css`** (`var(--color-brand)`, `var(--color-background)`,
   `var(--color-font)`, `var(--color-neutral-level_1..3)`, `var(--color-success)`,
   `var(--color-alert)`, `var(--color-danger)`…). **Nenhuma cor fixa**: a conta pode ser whitelabel e
   o CRM tem modo escuro. Estilos próprios num `src/estilo.css` importado pelo `App`; não mexa no
   `index.css`.
9. **Nenhum ID fixo no código.** Funil, etapa, modelo e opção vêm de `idFunil`, `idEtapa`,
   `idModelo`, `idOpcao`, `opcoes` e `etapasDoFunil`. Campo personalizado se lê com `ler` e
   `lerNome` e se escreve pelas funções de escrita.
10. **Não crie nem altere configuração da conta** (campos, opções, funis, modelos, automações). Se o
    dado não existir, é erro de configuração, não motivo para criar.
11. **Estados obrigatórios em todo bloco:** carregando, vazio, erro (mensagem do `ErroApi`) e sem
    permissão (`status` 401/403). **Toda escrita que falhar mostra a mensagem do erro** e desfaz o
    que a tela já tinha mudado.
12. **Lista carrega sob demanda:** primeira página ao abrir, "carregar mais" com `proximoCursor`.
    Nunca a base inteira.
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
  App.tsx                     ← useConexao, o OnboardingProvider, as <Routes> e o layout
  onboarding/kit/             ← anexo (kit de onboarding), sem alterar
  onboarding/roteiro.ts       ← o roteiro desta tela (subseção "Onboarding" da seção 4)
  estilo.css                  ← estilos da tela, só com tokens
  telas/<Tela>.tsx            ← uma por rota da seção 4
  componentes/                ← peças reutilizadas (cartão, coluna, modal, entrada por tipo, estados)
```

<Liste as telas e as rotas: `telas/Quadro.tsx` em `/`, `telas/Ficha.tsx` em `/cotacao/:id`…>

## 4. Telas e comportamentos

<Um subtítulo por tela, com a rota. Em cada uma: o que mostra (colunas, na ordem), de qual função do
`api.ts` vem cada coisa, as ações e a função que cada ação chama, e as regras.>

### <Tela> — rota `<rota>`
- **Dados:** `<funcaoDeLeitura>` — colunas: <…>
- **Ações:** <botão> → `<funcaoDeEscrita>`
- **Regras:** <…>

<Se a tela move negócio de etapa ou ganha/perde, inclua sempre estas regras, mesmo que ninguém
tenha pedido:>
- Ao abrir um negócio, chame `checklistsDaEtapa(id)` e mostre os checklists da etapa. Cada item
  já vem com `valor`, `typeId`, `opcoes`, `obrigatorio`, `pendente` e `entidade`: a entrada segue o
  `typeId`, e o item se grava com `salvarItemDoChecklist(id, fieldKey, valor)`. Use `pendente` (o
  veredito do servidor) para marcar o que falta; não leia `OtherProperties` para checklist.
- "Ganhar" só habilita com `(await validarChecklist(id)).valido`; desabilitado, mostre o motivo com
  `pendentes`. Se o servidor recusar mesmo assim, mostre a mensagem do `ErroApi` — ele é quem decide.
- Respeite `regrasDoFunil(f)`: `forbiddenStageReturn` (não volta etapa), `mustPassAllStages`,
  `winDealOnLastStage`.
- Recarregue o registro (leitura `umRegistro`) depois de toda ação.
- Negócio ganho ou perdido não muda de etapa; só "Reabrir".
- Os verbos e o nome da unidade vêm de `textosDoFunil(f)` (`verboGanhar`, `verboPerder`, `unidade`,
  `unidades`): a conta pode chamar "Ganhar" de "Fechar" e "Negócio" de "Cotação".
- Perder abre a escolha do motivo, de `motivosDePerda(f)`, e envia `{ LossReasonId }`.

### Onboarding — para quem usa a tela

<Escreva no vocabulário de quem vai usar (o vendedor, o gestor), não no de quem implanta. Curto: quem lê está
começando a usar a tela agora.>

- **Boas-vindas** (2 a 4 cartões, uma frase cada): <para que serve a tela; o que a pessoa vê primeiro; a
  ação principal; onde pedir ajuda>.
- **Tour** (4 a 8 passos, na ordem em que a pessoa trabalha): para cada passo, o alvo (`data-onboarding`),
  a rota, o título, o texto e o "experimente" (uma ação que ela pode fazer ali). Ex.:
  `filtros` em `/` — "Filtros" — "Escolha o funil, o responsável e o período." — experimente: "Troque para 30 dias."
- **Primeiros passos** (3 a 6 tarefas reais): <tarefa → quando a tela chama `marcar`>. Ex.: "Abra uma
  etapa" → ao abrir a gaveta da etapa.
- **Dicas** (o "?" ao lado do rótulo): <rótulo → explicação de uma ou duas frases>, para todo número ou
  termo que o usuário possa não entender ("conversão", "parados há").
- **Estados vazios que ensinam:** <bloco → o que dizer e qual botão oferecer quando vier vazio>.

## 5. Critérios de aceite

- [ ] A tela abre dentro do Ploomes sem login próprio e mostra os dados do usuário logado.
- [ ] Com um funil, etapa ou modelo renomeado na conta, a tela mostra o erro de configuração com o
      nome que falta.
- [ ] Nenhum arquivo além de `src/ploomes/api.ts` contém `fetch(` ou `User-Key`; `src/lib/` e
      `src/main.tsx` estão como na base.
- [ ] Abrir um item muda a rota, e o voltar do navegador volta para a lista.
- [ ] Na primeira vez, as boas-vindas abrem sozinhas depois que a tela carrega; o tour realça cada alvo do
      roteiro; "Ajuda" reabre o tour e os primeiros passos; cada tarefa feita marca o check.
- [ ] `src/onboarding/kit/` é idêntico ao anexo; quem pediu menos movimento no sistema não vê animação de deslocamento.
- [ ] <um critério verificável por comportamento da seção 4>

## 6. Dúvidas em aberto

<Só o que o agente não pode decidir sozinho. "Nenhuma." é resposta válida.>
````
