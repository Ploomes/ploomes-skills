---
name: onboarding-de-tela
description: "Monta e mantém o onboarding de quem vai usar uma tela própria do Ploomes — boas-vindas, tour com holofote sobre os elementos reais, primeiros passos, dicas, \"O que há de novo\" a cada versão e, para ensinar o processo, a tela de treinamento com o mapa da jornada e o simulador de cada funil —, montado com o kit pronto da skill para aquela conta, e o atualiza quando a tela ou a conta muda. Recebe o pedido (o que ensinar, para quem, em que tela e conta) e a tela atual, na pasta de trabalho; lê a conta só pela API, com a chave num arquivo apontado por --env, e percorre a tela numa bancada antes de subir. Registra no Usuário, por um flow do Ploomes Flows, quem abriu, voltou e concluiu. Não publica — publicar é de quem pede, pela interface do Ploomes — e não grava na conta: criar campo, só com OK explícito na conversa. Use para \"monta o onboarding da tela [tela]\", \"faz a tela de treinamento da [empresa]\", \"atualiza o onboarding desta tela\" ou \"roda o QA do onboarding\"."
---

# Onboarding de tela

**O onboarding é o que quem pede quer ensinar, montado para aquela conta** — e acompanha a tela enquanto ela muda.
A tela tem de traduzir o funcionamento da conta do cliente para quem vai usá-la: aonde ela vai, como vai fazer, o que
vai fazer. Esta skill é o caminho para chegar lá sem começar do zero: **entender o pedido, desenhar a tela e montar com os blocos que já funcionam.**

| Peça | O que é | Onde |
|---|---|---|
| **A indicação de tela** | o desenho da tela do onboarding — o protótipo, a especificação com a seção do onboarding e o que a tela exige da conta | a skill `indicacao-de-tela`, deste plugin (seção 3, passo 3) |
| **O kit** | boas-vindas, tour com holofote sobre os elementos reais, tour de uma parte, primeiros passos, dicas, "O que há de novo" por versão e o registro no Usuário | `kit/`, `references/roteiro.md` |
| **O bloco do mapa e do simulador** | o mapa da jornada (os funis da conta em fases, com as passagens reais) e o simulador de cada funil — o card de exemplo, o checklist, as automações e as dicas com holofote. Veio do onboarding de um cliente | `modelo-treinamento/`, `references/bloco-mapa-e-simulador.md` |
| **O registro no Usuário** | os quatro campos de acompanhamento e o flow que grava neles | `references/registro-pelo-flow.md` |


## Onde ela lê e grava

🔴 **Qual pasta e de onde vem a chave da conta está no [modo de trabalho](../_nucleo/modo-de-trabalho.md)**
— leia-o antes de começar. O que é desta skill:

- **A pasta da tela é `telas/<slug>/`, dentro da pasta de entrega** — a mesma da `pacote-para-o-construtor` (seção 5).
- **A entrada é o pedido e a tela atual:** o que o onboarding ensina, dito na conversa, e — com a tela já no ar — o
  código dela (a última `codigo-vN-salva`, o `baixar` da API ou o export do construtor). A especificação da
  `indicacao-de-tela` entra quando existe; sem ela, o desenho é o roteiro em texto (regra 5).
- **A chave da conta vem de um arquivo**, nunca da conversa: os scripts que a usam recebem `--env <arquivo>`, e o
  arquivo tem a linha `UK_PLOOMES_CLIENTE=<chave>` (a chave de um usuário de integração da conta, em Administração →
  Integrações).
- **Quem pede** é quem vai entregar a tela ao cliente: diz o que o onboarding ensina, aprova cada escrita, dá o OK
  para criar campo e publica pela interface.
- **Erro de configuração** achado no caminho vai para o `pontos-em-aberto.md` da pasta de entrega.

---

## 1. Por onde ela entra: a ação pela frase

| Ação | Frase | O que faz |
|---|---|---|
| **montar o onboarding** | "monta o onboarding da [empresa]", "monta o onboarding da tela [tela]", "faz a tela de treinamento da [empresa]" | o pedido, o retrato, os blocos, o desenho, a montagem, o QA e a subida (seção 3) |
| **rodar o QA** | "roda o QA do onboarding da [tela]" | o QA do avanço na bancada, em quatro larguras, com os prints (`references/qa-do-avanco.md`) |
| **atualizar** | "atualiza o onboarding da [tela]" — ou o "sim" à pergunta do hook | confere o que ficou para trás, propõe o roteiro novo, sobe a versão (seção 4.1) |
| **conferir** | "confere o onboarding da [tela]" | só a conferência, sem mexer em nada (seção 4.1, passo 1) |
| **a conta mudou** | "o [nome] mexeu nos funis da [empresa]" | retrato novo, comparação e os roteiros a rever (seção 4.2) |

Sem a conta e o que o onboarding deve ensinar na frase, pergunte os dois — e nada mais antes da entrevista.

## 2. 🔴 As regras duras

1. ⛔ **Publicar é sempre de quem pede.** A skill salva versões no construtor — pela API ou pelo "Salvar alterações"
   do editor —, e só com o plano mostrado e o OK dele em texto; quem clica em "Publicar" é ele.
2. ⛔ **Nada se escreve na conta do cliente.** O retrato é só leitura. Erro de configuração achado no caminho vai
   para o `pontos-em-aberto.md` (*Onde ela lê e grava*), com o funil, a etapa e o que se viu, e o trabalho segue.
   Criar campo (os do registro no Usuário, por exemplo) só com OK explícito de quem pede, na conversa.
3. ⛔ **A chave nunca passa pela conversa nem pelo tráfego do navegador.** Ela vem do arquivo apontado com `--env`
   (linha `UK_PLOOMES_CLIENTE`), e o retrato e a subida pela API a leem dali.
4. 🔴 **O que se construiu noutra conta é ideia, nunca código.**
   ⛔ Código de outro cliente não se copia para este: a ideia vem do precedente, o código vem da skill — o kit e os
   blocos, na versão corrigida.
5. 🔴 **O desenho é da `indicacao-de-tela`, ou é o roteiro em texto.** Tela nova com protótipo e especificação entra no
   `candidatos-de-tela.md` como pedido de quem pede e passa pelas fases dela e pelo portão `validar_telas.py`; sem
   ela, o desenho é o roteiro em texto, mostrado a quem pede antes de montar. ⛔ Esta skill não escreve especificação nem protótipo próprios. ➜ *Por
   quê:* um formato só de especificação, lido pela `pacote-para-o-construtor` e pelo portão de coerência; duas formas
   divergiriam.
6. ⛔ **O kit e os blocos não se editam na tela.** A tela copia `kit/` para `src/onboarding/kit/` e, com o mapa,
   `modelo-treinamento/src/treinamento/` para `src/treinamento/`; escreve só o roteiro e o `jornada.ts`. Precisou de algo
   que eles não fazem? É mudança aqui, com autoteste — não na tela.
7. ⛔ **Nunca num negócio real.** Medir o card nativo, testar um checklist: num negócio com `[TESTE]` no título.
8. 🔴 **Uma parte de cada vez, com o OK de quem pede.** Um funil por vez no simulador; uma parte (aba) por vez numa
   tela grande. Mostre antes de subir.
9. ⛔ **Não redesenhe o Ploomes.** Menu lateral, barra do topo, lista de clientes, ficha simulada: a tela mora dentro
   do Ploomes, ao lado do menu dele. ➜ *Por quê:* num cliente a tela de treinamento ganhou uma lateral própria, e o
   cliente viu dois menus laterais. ⛔ **E nada de print embutido no código**: os prints em base64 de um onboarding
   levaram a montagem do construtor a estourar o tempo (`references/editor-do-construtor.md`, seção 4).
10. 🔴 **O QA do avanço antes de mostrar e antes de subir** (`references/qa-do-avanco.md`): ERRO bloqueia — rolagem
    travada, conteúdo cortado, botão fora da tela, alvo do tour sumido, funil que não chega ao fim, erro no console.
11. 🔴 **Todo onboarding atualiza o acompanhamento no Usuário.** A skill **propõe a quem pede** os campos no cadastro
    do Usuário (*Vezes que assistiu*, *Vezes que consultou*, *Concluiu* e *Última conclusão* — um conjunto por
    onboarding, com o nome da tela no campo quando a conta tiver mais de um), cria com o OK dele e **liga o registro**:
    a tela manda `abriu` e `concluiu` ao webhook de um flow, que grava com a chave de integração
    (`references/registro-pelo-flow.md`). ➜ *Por quê:* é por esses campos que o gestor e o CS veem, papel por papel,
    quem assistiu, quantas vezes voltou e quem concluiu. Onboarding sem esse rastro não se mede (decisão de
    27/10/2026). A conta não tem o Ploomes Flows, ou quem pede recusou? O registro fica desligado, e o motivo vai para
    o `MUDANCAS.md`.

## 3. Montar um onboarding

0. **O pedido** — `references/entrevista.md`, bloco 1: o que o onboarding ensina, para quem, em que tela e conta, no
   vocabulário de quem usa, e o que conta como concluir. Com ele, o contexto, **lido e não perguntado**:
   - a **especificação**, quando a tela já saiu da `indicacao-de-tela`: `telas/<slug>/especificacao.md`, seção
     `e. Onboarding`;
   - o **processo** — quem faz o quê, no vocabulário do cliente: na pasta local, o `processo.md` ou o
     `as-is.bpmn`, se houver, e a conversa;
   - a **conversa** e, com a tela já no ar, o **código dela** (as rotas, as abas, os blocos, os botões).
1. **O retrato da conta**, só leitura — `scripts/retrato_da_conta.py --env <arquivo> --conta <Id> --saida …`. Traz os funis, os
   checklists, as automações, os perfis e os campos do Usuário (as FieldKeys do registro).
2. **Os blocos, e o que reaproveitar.**
   **Proponha a quem pede a lista curta** (entrevista, bloco 2): os blocos — o kit, o mapa e o simulador, ou os dois —
   e o que reaproveitar de uma tela que já existe.
3. **O desenho.** Com a `indicacao-de-tela`, leia o `SKILL.md` dela e siga as fases dela para a tela do onboarding:
   - **a tela é nova** (um onboarding do processo, uma tela de treinamento): acrescente-a ao
     `telas/candidatos-de-tela.md` — crie o arquivo se não existir — como candidato com `Veredito: PEDIDO`, no
     formato da fase A dela (`Trava nativa: nenhuma — o nativo não ensina o processo desta conta`, o `Quem usa` e o `O
     que a tela faria` do pedido). Grave a `### Decisão de quem pede` da fase B com o que a entrevista decidiu, e em
     `Referência enviada` a lista curta. Rode `validar_telas.py --fase A`; depois a **fase C num subagente**, que grava
     o protótipo, a especificação — a seção `e. Onboarding` com os blocos escolhidos, o que conta como concluir e o
     registro no Usuário (sem a URL do webhook, que o portão dela bloqueia) — e o `requisitos-da-cadeia.csv`, e publica
     o protótipo. `validar_telas.py --fase C` sem bloqueio. ⚠️ O arquivo já tem três candidatos? O teto é dela: diga
     a quem pede, não contorne. Tem a seção `## Nenhuma tela indicada`? Ela sai, e o porquê vai para as `## Notas`;
   - **a tela já existe** (o onboarding de uma tela do construtor): a especificação dela é o desenho — a seção
     `e. Onboarding` é o rascunho do roteiro.
   - **Sem especificação** — a tela já existe sem ela, ou quem pede não quer o desenho pela `indicacao-de-tela` —, o
     desenho é o roteiro em texto, mostrado a quem pede antes de montar (regra 5).
4. **A montagem**, com o mínimo de mudança na tela:
   - **a base**: tela nova, a skill cria pela API (`criar`, com o plano mostrado e o OK de quem pede em texto) e baixa
     para `codigo-v1` (`references/editor-do-construtor.md`, seção 0); pela rota do editor, quem pede cria a tela em
     branco pela interface e ela se baixa pelo editor (seção 3 do mesmo arquivo). Tela que já existe parte da última
     cópia salva. O trabalho vai numa `codigo-vN` nova;
   - **o kit** em `src/onboarding/kit/` (sem o `LEIA-ME.md`), as marcas `data-onboarding` e o `src/onboarding/roteiro.ts`
     (`references/roteiro.md`);
   - **com o mapa e o simulador**: `modelo-treinamento/src/` por cima, os dados do retrato (`gerar_dados.py`) e o
     `jornada.ts` com quem pede, **um funil de cada vez** (`references/bloco-mapa-e-simulador.md`);
   - **a ligação**, numa tela que já existe:
     ```tsx
     const { config, isLoading } = usePloomesBridge();
     useRegistroDaAbertura({ webhook: WEBHOOK, tela: '<slug>', usuarioId: config?.userId, pronto: !isLoading });
     <OnboardingProvider roteiro={roteiro} usuarioId={config?.userId ?? 0} pronto={!isLoading /* e a 1ª vista carregada */}
       aoConcluirTour={(fim) => { if (fim.tipo === 'completo' && fim.concluiu) registrar({ webhook: WEBHOOK, tela: '<slug>', usuarioId: config?.userId, evento: 'concluiu' }); }}>
       …as rotas…
     </OnboardingProvider>
     ```
     `<BotaoDeAjuda />` no cabeçalho, `<Dica id="…" />` ao lado do rótulo e `useOnboarding().marcar('<tarefa>')` onde a
     pessoa faz a tarefa (a que se cumpre só de abrir uma rota se marca num componente próprio em `src/onboarding/` —
     `MarcasPorRota`, na `pacote-para-o-construtor`);
   - 🔴 **o registro no Usuário** (regra 11): os campos criados com o OK de quem pede, o flow importado e a URL dele no
     webhook. Enquanto o flow não existe, o webhook fica `null` e a conferência avisa.
5. **Compile, confira e teste** (seção 6): `tsc`, `conferir_onboarding.py` sem ERRO e o **QA do avanço** sem ERRO.
6. **Mostre a quem pede** os prints e **suba** (`references/editor-do-construtor.md`). Pela API, a rota padrão: o
   `.zip` da versão, o `salvar` simulado com o diff e o plano, o OK de quem pede em texto e só então `--executar`
   (seção 0). Pelo editor (DevTools), quando a API não serve — qual rota usar e quando trocar é o passo 9 da
   `pacote-para-o-construtor` ([`SKILL.md`](../pacote-para-o-construtor/SKILL.md)) —, com o `.zip` do mesmo jeito
   (seções 3 e 5). 🔴 Arquivo novo sobe junto pela API, sem mensagem no chat; pelo editor, exige uma mensagem ao chat
   do construtor, que gasta crédito. Nas duas rotas: `codigo-vN-salva`, com o `.construtor.json` dentro, e o
   `MUDANCAS.md` — com o que mudou **e por quê**, que é o que o próximo onboarding vai ler. Depois do OK,
   `conferir_onboarding.py --registrar`.

## 4. Manter: a tela mudou, ou a conta mudou

🔴 **O hook do plugin lembra.** Quando o Claude edita um arquivo de uma tela do construtor, ele injeta o lembrete:
a tela tem onboarding → ao fim da rodada, pergunte *"Quer que eu atualize o onboarding desta tela?"*; não tem →
ofereça criar. Uma vez por tela e por sessão. ➜ *Por quê:* num cliente ninguém tinha esse momento — uma tela andou
treze versões com o tour igual, e uma etapa dele passou a ensinar uma regra que não vale mais.

### 4.1 Atualizar o onboarding

1. **Confira**: `python scripts/conferir_onboarding.py --tela <codigo-vN>`. Ele diz o alvo que sumiu, a rota que
   ninguém explica, o kit desatualizado, o registro desligado e os arquivos que mudaram desde a última conferência.
2. **Leia o que mudou** — o `MUDANCAS.md` e o diff — e **proponha a quem pede**, numa lista curta, o que muda no
   roteiro: passo que sai, passo que entra, texto que passou a descrever errado.
3. **Versão:** passo que entrou ou mudou de sentido sobe a `versao` e leva `desde`, com uma frase em
   `notasDaVersao` — é o que mostra a quem já usa a tela o que mudou (`references/roteiro.md`, seção 5).
4. Teste, mostre, suba e `--registrar`.

### 4.2 A conta mudou (o mapa e o simulador)

Num cliente, o que pediu atualização foi sempre a **conta**: alguém do cliente mexeu nos funis durante a montagem, e uma automação
sumiu. **Em toda sessão de trabalho num onboarding com o simulador**, antes de mexer:

1. Retrato novo, numa pasta com a data de hoje.
2. `python scripts/conferir_onboarding.py --tela <codigo-vN> --retrato <retrato novo>` — cada mudança da conta sai
   com o funil e a etapa: é a lista dos roteiros a rever.
3. Gere os dados de novo, reveja os roteiros afetados com quem pede e suba.

## 5. Onde mora cada coisa

Na pasta da tela, `telas/<slug>/`, dentro da pasta de entrega (*Onde ela lê e grava*) — a mesma pasta da
especificação da `indicacao-de-tela` e do pacote da `pacote-para-o-construtor`:

```
telas/
  candidatos-de-tela.md       ← da indicacao-de-tela: o onboarding entra como candidato pedido
  <slug>/
    especificacao.md · prototipo.html · requisitos-da-cadeia.csv   ← da fase C da indicacao-de-tela, quando houver
    codigo-v1/                  ← a base baixada da tela em branco
    codigo-vN/                  ← o trabalho em curso
    codigo-vN-salva/            ← o que está no construtor na versão N, com o .construtor.json — nunca se sobrescreve
    codigo-vN-baixada/          ← a versão N pelo baixar da API, completa: a base nova quando a trava parou ou falta a src/lib/
    <slug>-<AAAAMMDD-HHMM>.zip  ← a cópia portátil de cada subida, por qualquer rota — nunca se sobrescreve
    retrato/<AAAA-MM-DD>/       ← o retrato da conta, com o origens.json quando houver
    qa/qa-<data>/               ← o relatório e os prints do QA do avanço
    .onboarding-conferido.json  ← a última conferência aprovada (o --registrar)
    MUDANCAS.md · LEIA-ME.md    ← o que mudou em cada versão, e por quê; o id do projeto no construtor e a conta
```


## 6. Compilar, conferir e testar — antes de subir

```bash
# compilar (PowerShell, na pasta codigo-vN, com o package.json da base da pacote-para-o-construtor)
npm install ; npx tsc --noEmit ; npx vite build
# conferir o onboarding (com --retrato <pasta> para ver o que mudou na conta; --registrar depois do OK de quem pede)
python scripts/conferir_onboarding.py --tela <codigo-vN>
# abrir na bancada, que imita o Ploomes, com portas livres (a 8780 pode estar com a bancada de outra tela)
node <pacote-para-o-construtor>/bancada/servidor.mjs --pacote <pasta com dados-de-teste.json> --tela <codigo-vN>/dist --porta-host 8850 --porta-tela 8851
# o QA do avanço, com a bancada no ar — zero ERRO para subir; os prints vão a quem pede
node scripts/qa_do_avanco.mjs --host http://localhost:8850/ --saida <tela>/qa --fotos
```

A base para compilar fora do construtor (o `package.json`, o `vite.config.ts`, o `tsconfig.json`, o `index.html` e o
tipo local do `@ploomescrm/api-types`) é a `bancada/scaffold/` da `pacote-para-o-construtor`: copie esses arquivos para
a `codigo-vN`, sem tocar no `src/`. No navegador de trabalho, abra a bancada e percorra: boas-vindas, tour inteiro numa
sessão só, cada parte — e, com o simulador, cada funil até o fim.

Os scripts ficam em `"${CLAUDE_PLUGIN_ROOT}/skills/onboarding-de-tela/scripts/"`; as ferramentas do editor, em
`ferramentas/`; o kit, em `kit/`; o bloco do mapa e do simulador, em `modelo-treinamento/` (com um exemplo de três
funis em `exemplo/`).

| Script | Para quê |
|---|---|
| `retrato_da_conta.py` | o retrato da conta, só leitura, com a chave do arquivo `--env`; para com a chave de outra conta |
| `gerar_dados.py` | o `src/treinamento/dados.ts` do simulador, a partir do retrato |
| `comparar_retratos.py` | o que mudou entre dois retratos (ou entre o `dados.ts` da tela e a conta de hoje) |
| `conferir_onboarding.py` | o roteiro contra a tela, o kit, o registro e a conta |
| `qa_do_avanco.mjs` | o QA do avanço na bancada: percorre tudo em quatro larguras e acusa o que a pessoa veria quebrado |
| `autoteste.py` | o autoteste da skill — rode depois de mexer em qualquer script, no kit ou no bloco (`--compilar` compila o bloco com o exemplo; `--compilar --qa` roda o QA do avanço nele) |

## 7. Como conduzir quem não sabe

Quem roda isto pela primeira vez não sabe o que vem depois. Então:

- **Diga o passo e o porquê em uma linha** antes de fazer: *"Agora o retrato da conta — é dele que saem os funis e as
  etapas que o simulador mostra."*
- **Proponha, não pergunte em aberto.** *"Para o Hunter, proponho os funis 1, 4 e 6. Confere?"* vale mais que
  *"Quais funis o Hunter usa?"*.
- **Uma decisão por vez**, e a próxima só depois da resposta.
- **Mostre antes de subir** — o print da bancada, o roteiro em texto —, e só suba com o OK.
- **Feche cada passo dizendo o que ficou pendente** e de quem: o OK de um roteiro, um campo a criar, a publicação.

---

## O que esta skill nunca faz

- ⛔ não publica a tela, não grava na conta do cliente e não cria campo sem OK explícito;
- ⛔ não lê nem guarda chave pela conversa ou pelo tráfego do navegador;
- ⛔ não grava nas pastas de outros clientes nem copia o código deles para este;
- ⛔ não escreve especificação nem protótipo próprios — o desenho é da `indicacao-de-tela` ou o roteiro em texto;
- ⛔ não edita o kit nem o bloco dentro da tela, nem sobrescreve uma `codigo-vN-salva`;
- ⛔ não usa o navegador pessoal de quem pede, nem a área de transferência para mover código;
- ⛔ não abre nem edita negócio real para medir ou testar;
- ⛔ não sobe sem compilar, conferir, rodar o QA do avanço e mostrar a quem pede;
- ⛔ não corrige configuração da conta no meio do onboarding — anota em `pontos-em-aberto.md`;
- ⛔ não muda o comportamento da tela para caber o onboarding — o onboarding se adapta à tela;
- ⛔ não redesenha o Ploomes (menu lateral, topo, telas simuladas) nem embute print no código;
- ⛔ não entrega onboarding sem o acompanhamento no Usuário proposto a quem pede (regra 11) — se ele recusar, ou a
  conta não tiver o Ploomes Flows, fica escrito no `MUDANCAS.md`, com o motivo.

## Modos de falha previstos

| O que acontece | Por que dói | O que fazer |
|---|---|---|
| o desenho sai de um caso anterior, e não do pedido | o cliente recebe o onboarding de outro (um redesenho assim foi recusado) | o pedido primeiro (seção 3, passo 0); o precedente dá ideias, e a lista curta passa por quem pede |
| o tour aponta para um botão que saiu da tela | o passo aparece no centro, sem holofote, e ensina o que não existe | `conferir_onboarding.py` acusa alvo sem marca como ERRO |
| a tela muda e o roteiro fica na mesma versão | quem já usa não vê o que mudou; o tour descreve a regra antiga | o hook pergunta; a conferência acusa arquivo mudado sem a versão subir |
| a conta muda e o simulador ensina o funil de antes | a pessoa treina numa conta que não existe mais | retrato novo e `--retrato` em toda sessão com o simulador |
| id de etapa suposto no roteiro | o roteiro cai na etapa errada (num cliente, da 6ª etapa em diante) | ids sempre do retrato; a conferência acusa id que não existe |
| rota do editor: alguém de outra máquina sobe direto pelo construtor | a cópia local fica velha, e a troca seguinte apaga o trabalho dele | `comparar-todos` antes de trocar; DIFERENTE é parar |
| rota do editor: abrir um arquivo no editor recarrega a versão anterior | a versão salva sai sem uma parte do onboarding | `comparar-todos` antes **e depois** de salvar |
| rota da API: alguém salvou pelo editor ou pelo chat depois do `baixar` | o `code/save` grava por cima, e a mudança da outra pessoa some | a trava de versão do `salvar` para sem gravar; baixe numa pasta nova, compare com a cópia salva e combine com quem pede o que vale (`editor-do-construtor.md`, seção 0) |
| a tela de treinamento sobe com `--tela-existente` | o portão reprova o `src/treinamento/` e qualquer arquivo novo fora de `src/onboarding/` | a tela que o onboarding criou sobe sem esse modo em toda subida; a flag é só da tela que já existia (`editor-do-construtor.md`, seção 0) |
| print em base64 no código | a montagem do construtor estoura o tempo, com o código compilando | regra 9: o simulador e o tour sobre a tela real ensinam; print não entra no código |
| o tour pede a camada de tela cheia da ponte | no construtor a página congela, e o passo abaixo da dobra fica no escuro | o `Tour` do kit não pede; não reintroduza |
| o perfil não pode alterar o próprio usuário | o registro do onboarding não grava, e ninguém percebe | quem grava é o flow, com a chave de integração; o evento vai como `text/plain` |
| o webhook da bancada sobe para o construtor | em produção nada grava | a conferência dá ERRO quando o webhook aponta `localhost` |
| o simulador decide um filtro que não sabe ler | o checklist aparece quando não devia | filtro que não se lê sai sem regra, e o simulador oferece "simular este caso" |
| a tela redesenha a lateral do Ploomes | o cliente vê dois menus laterais | regra 9: abas no alto, o Ploomes de verdade em volta |
