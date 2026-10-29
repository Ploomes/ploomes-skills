# Kit de onboarding

Toda tela do construtor traz o onboarding para quem vai usá-la. Este kit é a parte que não muda de tela para
tela; a tela copia a pasta para `src/onboarding/kit/` **sem editar** e escreve só o `src/onboarding/roteiro.ts`
(tipo `Roteiro`). O empacotador da `pacote-para-o-construtor` e o `conferir_onboarding.py` desta skill conferem a
cópia arquivo a arquivo. Como se escreve o roteiro: `references/roteiro.md`.

| Peça | O que faz |
|---|---|
| `OnboardingProvider` | guarda o progresso por pessoa e por tela (`localStorage`, com try/catch); abre as boas-vindas na primeira visita, quando `pronto`, e "O que há de novo" para quem já viu uma versão anterior. Recebe `perfil` (filtra o roteiro), `ativo` (desliga tudo sem mudar a tela) e `aoConcluirTour` (a tela grava a conclusão onde quiser) |
| `BoasVindas` | 2 a 4 cartões, um de cada vez, com direção, indicador com `layoutId` e mola |
| `Novidades` | o cartão "O que há de novo": os passos com `desde` maior que a última versão que a pessoa viu, e o tour só deles |
| `Tour` | holofote sobre o elemento real (`data-onboarding`), que desliza de um passo para outro; dentro do recorte dá para clicar ("experimente"); navega até a rota do passo, espera o alvo e, no fim, devolve a pessoa à rota de onde ela começou; ← → Esc |
| `PrimeirosPassos` | botão flutuante com o anel de progresso e o painel das tarefas (cascata, check com mola, comemoração no fim); cada item leva à rota e realça o alvo |
| `BotaoDeAjuda`, `Dica` | o "?" do cabeçalho (o tour, o tour só desta parte, o que há de novo, primeiros passos, rever a apresentação) e o "?" ao lado de um rótulo |
| `registrar`, `useRegistroDaAbertura` | o registro no Usuário (regra 11 da skill): `abriu`, uma vez por sessão, e `concluiu`, onde o onboarding fecha, mandados ao webhook do flow como `text/plain` — `application/json` faria o navegador mandar antes um `OPTIONS` de CORS, que o webhook do Flows pode não responder. Sem webhook, só anota *desligado* (`references/registro-pelo-flow.md`) |

Princípios do [Motion](https://motion.dev/) que o kit segue: mola em vez de duração fixa
(`MotionConfig transition={{ type: 'spring' }}`); `AnimatePresence` para entrar e sair; `layoutId` para o
que muda de lugar; cascata nas listas; gesto (`whileTap`, `whileHover`) só em botão; e
`reducedMotion="user"` — quem pediu menos movimento no sistema vê só opacidade. Cores só pelos tokens.

**Compatível com o roteiro da versão anterior:** todo campo novo é opcional. A pessoa que viu o onboarding na versão
anterior do kit — que guardava uma chave por versão do roteiro — é achada pela chave antiga e não revê a
apresentação inteira.

**O que a tela pode ajustar sem editar o kit:** o lugar do lançador dos primeiros passos, por variável CSS
no estilo da própria tela — `:root { --ob-lancador-esquerda: 60px; --ob-lancador-baixo: 16px; }` — quando
o canto inferior esquerdo já tem algo (os controles do React Flow, por exemplo).

**Por que cada raiz do kit declara a fonte:** o kit desenha em portal no `<body>`, e a base do construtor
não dá fonte ao `body` (só a tela, no contêiner dela). Sem isso, as boas-vindas e o lançador saíam em
serifa — achado no Mapa do processo, rodada 9.

**Por que o `Tour` não pede a camada de tela cheia da ponte** (`useViewportOverlay`): com ela, a ponte congela a
página no construtor — o `#root` fica fixo e o `html` perde a altura — e nada rola; os passos com alvo abaixo da dobra
ficavam no escuro. O véu do tour cobre só a tela, e a página rola até o alvo. As boas-vindas,
que não rolam, continuam pedindo a camada. E o cartão do tour tem `max-height` e rola por dentro: texto longo não passa
da tela.

**Por que as caixas do kit são `border-box`:** com `content-box`, o cartão do tour media 340 px mais o padding e
vazava na beira direita da tela — achado no teste de um treinamento.

Este `LEIA-ME.md` não vai para a tela. Mexeu no kit? Rode o autoteste desta skill (`python scripts/autoteste.py`),
o da `pacote-para-o-construtor` (`node scripts/autoteste.mjs`) e teste numa tela real na bancada (o tour precisa
de navegador).
