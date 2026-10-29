# O bloco "mapa da jornada e simulador": os funis do cliente, simulados no Ploomes

> Um dos blocos que a skill reaproveita — não o produto obrigatório. Nasceu no onboarding de um cliente
> e é o bloco para todo pedido do tipo *"o usuário precisa entender por onde o
> cliente anda, o que ele faz em cada funil e o que o Ploomes faz sozinho"*. O código está em `modelo-treinamento/`;
> os scripts, em `scripts/`; um exemplo com três funis fictícios, em `modelo-treinamento/exemplo/`.

## 1. O que a pessoa vê

| Rota | O que é |
|---|---|
| `/` — **o mapa da jornada** | as fases do processo (to-be), da esquerda para a direita, cada funil como um cartão e as **setas reais** entre eles — as automações que abrem um funil a partir de outro. Com trilhas por papel, a pessoa escolhe a dela ("Ver como: Hunter"), o resto apaga, e a escolha fica lembrada: é o caminho dela. O progresso conta os funis simulados até o fim |
| `/funil/:id` — **o simulador** | o funil **desenhado como o nativo** (colunas de 250 px, cabeçalho de 52 px, card de 13/12 px) com um card de exemplo. Clicar abre o card **como no Ploomes**: a barra de etapas em seta, o checklist da etapa à esquerda com o triângulo vermelho do obrigatório, a linha do tempo à direita. Uma dica com holofote vai guiando: quem faz a etapa, o que o Ploomes faz sozinho, o que preencher, como mover |

O que o simulador reproduz da conta:

- **o item obrigatório trava o avanço**, como no Ploomes; o último "Entendi" da etapa responde o exemplo até não
  sobrar obrigatório (o passo a passo, abaixo);
- **o checklist com filtro só aparece quando a resposta bate** — a regra lida da Url do filtro, com E, OU, "não",
  caixa Sim/Não e opção de lista;
- **a automação de entrada já preenche** o que ela grava, e a tarefa que ela cria aparece em *Tarefas em aberto*;
- **as passagens**: *Chega aqui por* no topo, *Negócios derivados* no card e o funil que abre no ganho ou na perda.

🔴 **O registro no Usuário (regra 11)** vem ligado: `abriu` quando a pessoa abre a tela, uma vez por sessão, e
`concluiu` quando ela simula até o fim o último funil do caminho dela (a trilha escolhida; sem trilha, todos os funis
do mapa). *Recomeçar* abre uma rodada nova, e concluir de novo soma no Usuário. O webhook do flow vai em
`WEBHOOK_DO_REGISTRO`, no `jornada.ts` (`registro-pelo-flow.md`).

⛔ **Não redesenhe o Ploomes em volta.** O simulador desenha o funil e o card — e só. Nada de menu lateral, barra do
topo ou tela de listagem simulada: a tela mora dentro do Ploomes, ao lado do menu dele. Num cliente a
tela ganhou uma "lateral no visual do Ploomes" e telas simuladas de Clientes, Propostas e Vendas — e o cliente viu
dois menus laterais.

⛔ **A tela não lê a conta em tempo real.** O retrato vai embutido no código (`dados.ts`): ela nunca grava nada na
conta, mas cada mudança na conta pede gerar e subir de novo — é o que a conferência com `--retrato` vigia.

## 2. As correções que o bloco já traz

De uma revisão interna e do retorno de um cliente, testadas numa tela em produção. ⛔ Não desfaça sem
motivo novo: cada uma foi um defeito que alguém viu.

| O que mudou | Por quê |
|---|---|
| *Chega aqui por* é uma etiqueta (número e nome do funil de origem); o clique abre a regra e o botão *Abrir este funil* | o cartão inteiro de cada origem deixava o cabeçalho alto, e no notebook o quadro do funil ficava pequeno |
| o prefixo interno da automação (*"P6 ·"*) sai de todo texto mostrado (`semPrefixo`, no `jornada.ts`) | é nome de trabalho de quem configura; a pessoa não lê código |
| a roda vertical do mouse anda o quadro para o lado enquanto há etapa à direita; nas pontas, volta a rolar a página | com mouse comum, no notebook, o funil não rolava para as etapas da direita. Ouvinte nativo `wheel` com `passive: false` — o `onWheel` do React não deixa cancelar a rolagem |
| a dica mede com `ResizeObserver` (a página e o alvo), no rolar e redimensionar e duas vezes depois da entrada (450 e 900 ms); a medida só muda o estado se mudou; `html { scrollbar-gutter: stable; }` | um relógio de 300 ms remedia sem parar, e a tela tremia num monitor de 14" |
| o aviso do simulador (obrigatório faltando etc.) fica até a pessoa fechar no X, mover o card ou trocar de etapa | sumia em 6 s, e o cliente não tinha tempo de ler o texto |
| o balão da dica tem `max-height: calc(100vh - 32px)` e rola por dentro | explicações longas passavam do balão |
| no celular (abaixo de 640 px) o mapa empilha em uma coluna e as setas somem | as setas cruzavam os cartões empilhados |

### O passo a passo do simulador

O retorno do cliente foi de cliques demais e de um passo a passo pouco claro; a correção foi aprovada na prévia. 🔴 **A pessoa clica sempre no mesmo lugar, o botão do balão**, e cada clique anda um passo:

| Passo | Botão do balão | O que acontece |
|---|---|---|
| card fechado no quadro | **Abrir o card** | abre o card, como clicar nele |
| o roteiro da etapa (quem faz, o que faz) | **Entendi** | se é o último balão de leitura da etapa, **já preenche o checklist com o exemplo** |
| o que o Ploomes faz sozinho — **uma vez por funil**, na primeira etapa com automação | **Entendi** | aponta a linha do tempo e explica que tudo o que a automação faz aparece ali; também preenche o checklist |
| checklist preenchido | **Mover para [próxima etapa]** | move o card; o balão avisa que o exemplo foi preenchido pelo simulador e que um clique no item muda a resposta |
| última etapa | **Ganhar** (ou *Concluir a simulação*, no funil que não se ganha à mão) | ganha o card |
| fim do funil | o funil que o Ploomes abre | **entra no próximo funil já com o card aberto** — abrir o card a pessoa já aprendeu |

- Nas etapas depois da primeira com automação **não tem balão de automação**: a tarefa em *Tarefas em aberto* e o
  registro em *Histórico completo* chegam animados e destacados (`.neg-novo`). É a linha do tempo que "acontece".
- O jeito do Ploomes continua valendo: clicar no card, na barra de etapas, arrastar no quadro e preencher item a item.
  O "Preencher por mim" só aparece se a pessoa apagar uma resposta e faltar obrigatório.
- Para mover, o balão tem botão em vez de mover sozinho: a pessoa ainda faz o gesto de avançar, só não precisa
  procurar onde.
- No primeiro caso, o Funil 1 (10 etapas e Ganhar) foi de ponta a ponta em 22 cliques, todos no botão do balão.
- ⛔ O destaque da linha do tempo usa `animation-fill-mode: backwards`. Com `both`, o item fica no último quadro da
  animação e perde o fundo branco.

## 3. Os arquivos, e quem escreve cada um

```
src/
  App.tsx                     ← do bloco: as rotas, o OnboardingProvider (boas-vindas + tour do mapa) e o registro da abertura
  onboarding/kit/             ← cópia do kit/ da skill, sem editar (inclui o registro.ts)
  onboarding/roteiro.ts       ← o onboarding do MAPA (boas-vindas, tour) — à mão, curto
  treinamento/
    dados.ts                  ← GERADO pelo gerar_dados.py. Ninguém edita
    jornada.ts                ← À MÃO: fases, trilhas, roteiro de cada etapa, card de exemplo, WEBHOOK_DO_REGISTRO
    tipos.ts · progresso.ts · rotas.ts · MapaJornada.tsx · FunilSimulador.tsx · treinamento.css   ← do bloco, sem editar
```

🔴 **Dado e texto não se misturam.** O que vem da conta sai do gerador; o que a pessoa lê sai do `jornada.ts`.
➜ *Por quê:* assim a conta muda, o gerador roda de novo, e o roteiro escrito à mão continua de pé.

O bloco pode morar noutra rota de uma tela maior: quem o monta fornece o caminho do mapa com `RotaDoMapa.Provider`
(`rotas.ts`), e o simulador volta para lá.

## 4. A montagem

1. **O retrato da conta**, só leitura:
   ```
   python scripts/retrato_da_conta.py --env <arquivo> --conta <Id> --saida "<tela>/retrato/<AAAA-MM-DD>"
   ```
   Ele para se a chave abrir outra conta. A data na pasta é o que diz de quando é o retrato.
2. **Os dados**: `python scripts/gerar_dados.py --retrato "<tela>/retrato/<AAAA-MM-DD>" --tela "<tela>/codigo-vN"`.
   Leia os `avisos` com quem pede:
   - *filtro que não se lê* → o simulador oferece "simular este caso". Está certo assim;
   - *automação sem etapa cujo filtro não diz o funil* → pergunte de qual funil ela é e grave em
     `origens.json`, ao lado do retrato (`{"<Id da automação>": <Id do funil>}`), e gere de novo.
3. **A jornada** (`jornada.ts`), com quem pede, **um funil de cada vez**:
   - as **fases** e a ordem, das jornadas do processo (o to-be, quando houver);
   - as **trilhas** por papel, se houver;
   - o **roteiro** do funil: o resumo e, por etapa, `quem` faz e o `texto` — o que fazer e o que acontece depois,
     escrito a partir do checklist, da condição e das automações daquela etapa, e do processo;
   - `ETAPA_DA_EDICAO` e `ETAPA_DA_AUTOMACAO` para o que dispara sem etapa (a conferência lista o que falta);
   - `WEBHOOK_DO_REGISTRO`, depois que o flow existir.
4. **A conferência**: `python scripts/conferir_onboarding.py --tela "<tela>/codigo-vN"` — id de etapa errado no
   roteiro é ERRO (o primeiro caso supôs ids sequenciais e errou da 6ª etapa em diante).
5. **O teste**: compile, abra na bancada e **percorra cada funil até o fim** — o checklist trava? o filtro abre o
   checklist certo? a passagem aponta o funil certo? O QA do avanço faz esse percurso sozinho (`qa-do-avanco.md`).
6. **Mostre a quem pede e peça o OK do funil** — e só então passe para o próximo.

### A escrita do roteiro

- Português do Brasil, frase curta, voz direta, no vocabulário de quem usa (o card é "oportunidade", "chamado"?).
- O nome do campo, da etapa e do botão **exatamente como está na conta**.
- O passo no imperativo ("Abra", "Marque"); o que o Ploomes faz sozinho, no presente ("O Ploomes abre o card de
  Implementação").
- Fica de fora: erro de teste, pendência, comentário interno. Ambiguidade vira pergunta a quem pede, nunca suposição.

## 5. O visual nativo

As medidas estão no `treinamento.css` (comentários `funil como no Ploomes` e `card aberto como no Ploomes`),
tiradas do DOM do Ploomes em 23/10/2026. ⛔ **Não meça de novo sem motivo.** O Ploomes mudou? Meça **num negócio
`[TESTE]`**, nunca num real, troque no CSS do bloco e registre a data no comentário. Para o resto da tela —
tokens, cores, componentes —, a fonte é a skill `ploomes-tech-docs:ds-ploomes-crm-ui`.

## 6. O que aparece no caminho, e não é do onboarding

Montar o simulador passa por cada checklist e cada automação — e acha erro de configuração: no primeiro caso, um item de
teste que travava os usuários e uma passagem que nunca disparava. ⛔ **Não corrija a conta no meio do onboarding**,
nem por API. Anote no `pontos-em-aberto.md` da pasta de entrega, com o funil, a etapa e o que se viu, e siga.
