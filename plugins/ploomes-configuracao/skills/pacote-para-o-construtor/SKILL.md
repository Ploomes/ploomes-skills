---
name: pacote-para-o-construtor
description: "Constrói uma tela própria do Ploomes na base exata do construtor de telas (AI Builder), já com o onboarding de quem vai usá-la, e a sobe como versão nova pela API do construtor, sem gastar crédito de IA — ou entrega o .zip para importar. Recebe uma tela já decidida (a especificação da indicacao-de-tela ou uma tela descrita na conversa) e a conta que vai recebê-la; confere a conta só lendo, pelo MCP do Ploomes ou pela API com a chave num arquivo apontado por --env, gera por script a camada de dados e o pedido, passa num portão e testa a tela numa bancada que imita o Ploomes e na API real de uma conta de teste. Não publica — publicar é do usuário, pela interface do Ploomes — e não cria nem altera configuração da conta: o que falta vira pedido a quem configura. Use para \"monta o pacote do construtor da tela de [processo]\", \"sobe a tela no construtor sem gastar crédito\", \"testa a tela antes de mandar\" ou \"põe o onboarding na tela que já está em produção\"."
---

# Pacote para o construtor de telas

O construtor de telas escreve a tela com IA, do zero, a cada pedido. Ele também aceita código pronto:
pela API dele, que grava versão nova **sem passar pela IA** (0 token, medido em 28/10/2026), e pela
importação de um `.zip`. Então a tela se constrói aqui, na mesma base (`bancada/scaffold/`), e sobe
pronta. O que o construtor é por dentro está em `references/contrato-do-construtor.md` — **leia antes
de começar**, ele justifica cada regra abaixo.

## As três regras duras

1. 🔴 **Nenhum modelo escreve a camada de dados.** O modelo escreve o `contrato-de-dados.json`; o
   `api.ts` sai do `scripts/gerar_api.py`, igual para toda tela, e nunca é editado à mão.
2. ⛔ **Nenhuma configuração é escrita na conta do cliente.** Conferência só lendo — as ferramentas
   `buscar_*` do MCP do Ploomes ou o `ler-conta`, que só faz GET (passo 2); teste contra a API real só em
   conta de teste ou interna, e só leitura salvo autorização explícita. A única escrita é a da tela no
   construtor (passo 9): versão nova, nunca publicada, com o plano aprovado por quem pede.
3. ⛔ **A chave do Ploomes nunca passa pela conversa, pelo pacote nem pela tela.** Na bancada, quem roda
   com chave é quem pede, no terminal dele (passo 8); na leitura da conta e na subida, o script a lê do
   arquivo da chave e nunca a mostra (passos 2 e 9).

## Onde ela lê e grava

🔴 **Qual pasta e de onde vem a chave da conta está no [modo de trabalho](../_nucleo/modo-de-trabalho.md)**
— leia-o antes de começar. O que é desta skill:

- **A pasta da tela é `telas/<slug>/`, dentro da pasta de entrega**, e o pacote vai em
  `telas/<slug>/pacote-construtor/`.
- **A chave da conta vem de um arquivo**, nunca da conversa: os scripts que a usam recebem
  `--env <arquivo>`, e o arquivo tem a linha `UK_PLOOMES_CLIENTE=<chave>` (a chave de um usuário de
  integração da conta, em Administração → Integrações).
- **Quem pede** é quem vai entregar a tela ao cliente: aprova cada escrita, publica pela interface e
  corrige a configuração da conta.
- **Nos comandos**, `<skill>` é o caminho absoluto desta skill e `<tela-dir>` o da pasta da tela,
  `telas/<slug>/` (*Cuidados deste ambiente*: só caminho absoluto).

---

## Os passos

| # | Passo | Sai |
|---|---|---|
| 1 | Entender a tela | a tarefa, a vista inicial, as ações |
| 2 | Conferir a conta (só leitura) | `conferencia-da-conta.json` |
| 3 | Escrever o contrato | `contrato-de-dados.json` |
| 4 | Gerar a camada de dados | `src/ploomes/api.ts` e `useConexao.ts` |
| 5 | Escrever o pedido | `PEDIDO.md` |
| 6 | Portão | APROVADO ou a lista de bloqueios |
| 7 | Construir e testar na bancada | a tela construída só com o pacote, critérios passados |
| 8 | Testar na API real | o teste de fumaça sem falha |
| 9 | Subir e entregar | o `.zip` da versão, a versão salva no construtor |

### 1. Entender a tela

| Entrada | Onde está |
|---|---|
| Tela saída da `indicacao-de-tela` | `telas/<slug>/`: `especificacao.md`, `prototipo.html` e `requisitos-da-cadeia.csv`; e a decisão de quem pede no `telas/candidatos-de-tela.md`, um nível acima |
| Tela descrita na conversa | peça a tarefa principal, a vista inicial (lista, quadro, ficha ou painel), as ações e as entidades; havendo print ou rascunho, peça o arquivo |

➜ **Sem saber qual conta vai receber a tela, pare e pergunte.** Com o MCP do Ploomes, confira pelo
`buscar_conta` que ele está nela; se estiver noutra conta, diga qual e peça para trocar o conector. Sem
o MCP, o `ler-conta` do passo 2 para sozinho se a chave abrir outra conta.

### 2. Conferir a conta (só leitura)

Duas rotas, as duas só lendo: as ferramentas `buscar_*` do **MCP do Ploomes**, quando a sessão o tem
ligado à conta certa, ou o **`ler-conta`**, pela API pública, com a chave do arquivo (*Onde ela lê e
grava*). Sem o MCP, é o `ler-conta`:

```bash
python -I <skill>/scripts/construtor_api.py ler-conta --env <arquivo da chave> --conta <Id> --saida <tela-dir>/conta-lida.json [--tabelas <Ids>]
```

Ele grava a conta, os funis com as etapas na ordem, os campos (FieldKey, nome, TypeId, entidade e
tabela de opções), os checklists com os itens e os modelos de documento — pelas mesmas rotas que o
`api.ts` gerado usa. `--tabelas` (os `OptionsTableId` dos campos TypeId 7 que a tela usa) grava as
opções delas; `--entidades` limita os campos.

| O quê | Pelo MCP | Pelo `ler-conta` |
|---|---|---|
| FieldKey, TypeId e tabela de opções de cada campo | `buscar_campos` (por `chave`, ou `nome` + `entidade_id`) | `campos` |
| Funil e nomes exatos das etapas | `buscar_pipeline` | `funis` |
| Checklists de cada etapa usada (itens, obrigatoriedade, tipo) | `buscar_checklists_etapa`; num negócio real, `buscar_checklists_aplicaveis` e `validar_checklist` | `checklists`; a condição de cada item, o teste do passo 8 confere |
| Opções de campo TypeId 7 | `buscar_opcoes_tabela` | `--tabelas` |
| Modelos de proposta, venda e documento | `buscar_templates_documentos` / `buscar_templates_proposta` | `modelos` |
| Telas de IA que a conta já tem | `buscar_telas_ia` | `construtor_api.py listar` |

Se a tela já existir, o pacote é de **extensão**, e o PEDIDO diz isso.

Grave `conferencia-da-conta.json` como no exemplo: `conferidoEm`, `conta`, `comoFoiConferido`,
`campos` (FieldKey → `{nome, typeId}`), `funis` (nome → etapas) e `modelos` — só o que a tela usa.

- Falta algo que está no `requisitos-da-cadeia.csv`: a cadeia vai criar; o portão aceita com aviso.
- Falta algo que não está: **pare e diga a quem pede o que falta.** Não crie, e não tire da tela para passar.
- Busca por nome com mais de um resultado: pergunte qual é. Nunca escolha sozinho.
- **Confira a condição de cada item obrigatório dos checklists.** "Preenchido" é `diferente de` vazio
  (`OperationId 2`). Obrigatório **sem condição** trava a etapa para sempre; `igual a` vazio
  (`OperationId 1` sem valor) só passa com o campo **vazio**. Os dois fazem a tela parecer quebrada.
  Achou? Diga a quem pede, com a lista, antes de testar — corrigir configuração existente da conta é
  dele. O teste de fumaça (passo 8) faz essa conferência sozinho, na seção 4.

### 3. Escrever o contrato

Formato em `references/formato-do-contrato.md`; exemplos em `exemplo/pacote-construtor/` e em
`exemplo-reposicao/` — este com o passo a passo inteiro em `exemplo-reposicao/COMO-FOI-FEITO.md`.

- Liste **só** o que a tela usa: cada leitura é uma função que um bloco chama; cada escrita, uma ação.
- **Funil, etapa e modelo pelo nome exato; opção por `{opcao:campo.Nome}`; FieldKey é o único ID fixo.**
- **Quadro por etapa = uma leitura com `StageId eq {param:etapaId}`**, para cada coluna paginar sozinha.
- **Ficha que recarrega depois de agir = uma leitura com `"umRegistro": true`.**
- **Número de painel (quantos, quanto, tempo médio) = uma leitura com `"agregar"`**: o servidor soma
  (`$apply`) e a tela não baixa os registros. Tela **genérica**, que lê a configuração da conta, não
  declara funil: lê `DealsPipelines`, `Automations`, `Checklists`… — exemplo em
  `exemplo-mapa-do-processo/`.
- **Tela que vai para várias contas e usa campo personalizado = campo `porNome`** (a chave muda de
  conta para conta), com `"opcional": true` se a tela deve abrir sem ele.
- **Biblioteca além dos quatro pacotes vai embutida** (`bancada/vendor/<nome>/`, hoje o React Flow), e
  o PEDIDO manda copiá-la sem editar.
- ⛔ **Segredo não vai para a tela.** `Webhooks`, `AccountIntegrations` e as ações de `Automations`
  devolvem URL, chave e corpo de integração: leia só com `select`, sem esses campos.
- **Toda escrita lista os `nativos` e os `campos` que aceita.** A função gerada recusa o resto.

### 4. Gerar a camada de dados

```bash
python scripts/gerar_api.py <pacote>/contrato-de-dados.json <pacote>/src/ploomes/api.ts
```

Sai também o `useConexao.ts` ao lado (de `scripts/modelos/`): o hook que liga o `api.ts` ao
`usePloomesBridge()` da base, chama `iniciar()` e refaz o `configurar` quando o CRM renova a `userKey`.

O `api.ts` traz, além de uma função por leitura e por escrita:

| Função | Para quê |
|---|---|
| `configurar(ctx)`, `iniciar()` | ligar à ponte; resolver tudo por nome, com `ErroConfiguracao` listando o que falta |
| `idFunil`, `idEtapa`, `etapasDoFunil`, `idModelo`, `opcoes`, `idOpcao` | IDs em tempo de execução |
| `regrasDoFunil(f)` | voltar etapa, passar por todas, ganhar só na última, pode ganhar/perder |
| `textosDoFunil(f)` | `unidade`, `unidades`, `verboGanhar`, `verboPerder` — a conta pode chamar "Ganhar" de "Fechar" |
| `ler`, `lerNome` | campo personalizado na coluna certa |
| `checklistsDaEtapa`, `salvarItemDoChecklist`, `validarChecklist` | checklists com valor lido e `pendente` vindo do servidor; item de campo do **cliente** é lido e gravado no cliente (se o contrato usa `Deals`) |
| `motivosDePerda(f)` | se o contrato tem ação `Lose` |

Também repete o 429 com `Retry-After` e traduz os erros da API. Os formatos que ele assume estão
conferidos em `references/formatos-reais-da-api.md`.

### 5. Escrever o pedido

Siga `references/modelo-do-pedido.md`, com as seis seções e os títulos exatos.

- **A seção 2 (regras do trabalho) vai inteira.** É ela que impede o agente de refazer o que está pronto.
- 🔴 **Toda tela tem onboarding para quem vai usá-la** — a subseção "### Onboarding" da seção 4
  (boas-vindas, tour, primeiros passos, dicas, estados vazios), no vocabulário do usuário final. A tela
  monta com o kit da skill `onboarding-de-tela` (`kit/`: holofote que desliza entre os alvos, cartões com
  mola, checklist com cascata, tour por parte, novidades por versão, roteiro por perfil,
  `MotionConfig reducedMotion="user"`), que vai anexado e é copiado sem editar; a tela escreve só o
  `src/onboarding/roteiro.ts` — como se escreve está em `references/roteiro.md` daquela skill — e marca os
  alvos com `data-onboarding`. Depois de entregue, quem mantém o onboarding quando a tela muda é ela.
- **A seção 4 cita a função do `api.ts` em cada dado e em cada ação.** Bloco sem função = contrato
  incompleto: volte ao passo 3.
- **Critérios de aceite verificáveis**, em checklist (`- [ ]`).
- **A seção 6 só tem o que o agente não pode decidir.** O que quem pede já decidiu entra como regra.
- Havendo `prototipo.html`, ele vai como referência visual; o `const api = {…}` dele não é a camada de dados.

### 6. Portão

```bash
python scripts/validar_pacote.py <caminho ABSOLUTO do pacote>
```

Reprova: rota fora de `references/rotas-api.txt`; ID de conta no filtro; `$skip`; `pagina` acima de
1000; marcador sem declaração; **campo secreto no `select` ou rota com segredo sem `select`**;
agregação com medida inválida ou `groupby` em `OtherProperties`; PEDIDO sem a subseção de onboarding; leitura com nome que o `api.ts` já
usa (`funis`, `modelos`…); campo, funil, etapa ou modelo sem conferência; TypeId divergente;
`api.ts` ou `useConexao.ts` diferente do gerado; PEDIDO sem as seções ou sem `useConexao()`; **PEDIDO que
cita função que o `api.ts` não exporta**; tela que move ou ganha negócio sem pedir `checklistsDaEtapa`,
`validarChecklist` e `regrasDoFunil`; tela que perde sem `motivosDePerda`; User-Key literal.

🔴 **Com bloqueio, não entrega.** Corrija na origem e rode de novo.

### 7. Construir e testar na bancada

A bancada imita o Ploomes: API falsa com as regras de negócio (etapa de negócio fechado, volta de
etapa, checklist, ganhar só na última, motivo de perda) e CRM falso que abre a tela num iframe com o
**host real do `@ploomescrm/bridge`** (o mesmo pacote da tela, servido do `node_modules` dela): config,
rota espelhada no endereço (`#/ai-screen/bancada/<rota>`), voltar do navegador, link copiado, modal
que cobre a página, whitelabel e "Renovar userKey" no painel. Nenhuma conta é tocada.

1. Escreva `dados-de-teste.json` no pacote (formato no exemplo), **com a estrutura da conta
   conferida no passo 2** — mesmo funil, etapas, campos, opções e checklists — e negócios no
   vocabulário do cliente; use `gerar` para passar de uma página.
2. Copie `bancada/scaffold/` para a pasta da tela e rode `npm install` (no Windows, pelo PowerShell).
   É a base exata de uma tela em branco do construtor (`src/`, exportado em 16/10/2026), mais o que o
   construtor não mostra: `package.json`, `vite.config.ts`, `tsconfig.json`, `index.html` e o tipo de
   `@ploomescrm/api-types` (não publicado no npm) em `tipos-locais/`.
3. **Construa a tela só com o pacote, num subagente** que recebe o `PEDIDO.md`, o `api.ts` e o
   `useConexao.ts` e não vê a skill, a bancada nem os dados. É o teste de que o pedido basta. Anote
   chamadas, tokens e tempo.
4. Suba e abra `http://localhost:8780/` no browser:
   `node bancada/servidor.mjs --pacote <pacote> --tela <tela>/dist`
5. Passe os critérios de aceite e as provocações do painel (429, 401, 500, renomear funil ou etapa).
   O painel mostra cada requisição e avisa gravação em coluna errada e `$skip`.
6. **Função que o agente disse que faltou, ou bug que veio do `api.ts`, é defeito do pacote**: corrija
   o contrato ou o gerador, gere de novo e mande os ajustes numa rodada só.

➜ Arrastar e soltar (HTML5) não se testa pelo browser automatizado: marque NÃO VERIFICADO, ou peça
no PEDIDO botões de mover etapa.

### 8. Testar na API real (só leitura)

A API falsa foi escrita da mesma documentação que o `api.ts`: se a documentação errar, os dois erram
juntos. Só a API real pega isso. Em **conta de teste**, quem pede roda no terminal dele — a chave na
variável `PLOOMES_USER_KEY` do terminal, ou guardada pelos scripts do Windows, abaixo; nunca na conversa:

- **Sem tela:** `PLOOMES_API_URL=https://public-api2.ploomes.com/ PLOOMES_USER_KEY=… [PLOOMES_DEAL_ID=…] node scripts/testar_na_conta.ts <pacote>`
  — roda `iniciar()`, cada leitura (as por etapa, em todas as etapas), os checklists do negócio
  indicado e os textos do funil. Barra qualquer escrita.
- **Com a tela:** `PLOOMES_USER_KEY=… node bancada/servidor.mjs --api-real https://public-api2.ploomes.com/ --tela <tela>/dist`
  — a tela roda no CRM falso contra a conta verdadeira; o proxy põe a chave e **barra POST e PATCH**.
  `--permitir-escrita` só com autorização de quem pede e em negócio de teste; `--escrita-so-em <Rota>` libera
  escrita só naquela rota (ex.: `Account`, para gravar o as-is no campo da conta) e barra o resto.

No Windows, use os modelos de `bancada/windows/`: `guardar-chave.ps1` (quem pede guarda a chave **uma vez**,
criptografada com DPAPI em `%USERPROFILE%\.ploomes-bancada\`; só o usuário dele abre),
`testar-api-real.ps1 -Pacote … -DealId …`, `rodar-tela-api-real.ps1 -Tela …` e `apagar-chave.ps1`.
Com a chave guardada, os testes rodam sem perguntar — e o valor nunca aparece na saída.

➜ No PowerShell do Windows, **Ctrl+V não cola** no campo oculto: grava o caractere U+0016. Os scripts
leem da área de transferência quando o campo vem vazio.

Divergência de formato vira correção no gerador, na API falsa **e** uma linha em
`references/formatos-reais-da-api.md` — e o autoteste tem de pegar a divergência antes da correção.

### 9. Subir e entregar

A tela sobe por uma de três rotas, nesta ordem de preferência. As rotas, os comandos e o que cada
rota faz por dentro estão em `references/api-do-construtor.md` — **leia antes da primeira subida**.

| Rota | Quando | Como |
|---|---|---|
| **API (padrão)** | sempre que houver o arquivo com a chave da conta (*Onde ela lê e grava*) | `criar` (tela nova) → `baixar` → `salvar --pacote`, abaixo |
| **Editor (DevTools)** | API fora do ar, 403 ou 404 numa rota de escrita, chave sem acesso à tela e ninguém para incluí-la, ou quem pede prefere | [`editor-do-construtor.md`](../onboarding-de-tela/references/editor-do-construtor.md), da skill `onboarding-de-tela` |
| **`.zip`** | **sempre gerado**, em qualquer rota — é a cópia local da versão, para editar fora do construtor ou importar se as outras rotas falharem | `empacotar_importacao.py`, abaixo, rodado antes da subida |

➜ *Por que a API é o padrão:* ela grava a versão sem a IA do Ploomes (0 token, medido em 28/10/2026) e
cria arquivo novo sem mensagem no chat; pelo editor, arquivo novo só nasce pedindo ao chat, e isso gasta
crédito. O editor fica porque já subiu telas em dois clientes e é a saída se a API, que o produto não
documenta, mudar.

➜ **Trocar de rota no meio:** as duas rotas pegam a versão que a outra criou. Depois de subir pelo editor,
o `salvar` para: a base nova traz a versão do editor, e o `.construtor.json` da pasta da tela ainda aponta
a última subida pela API. Compare o `src/` das duas, traga para a pasta da tela o que fica e copie para ela
o `.construtor.json` da base; só então ela sobe. Depois de subir pela API, o `comparar-todos` do editor
acusa a diferença: baixe pelo editor antes de trocar arquivo.

#### O `.zip`, em toda entrega

🔴 **O `.zip` sai em toda entrega, não só quando pedido** (decisão de 2026-10-28). *Por quê:* quem entrega
a tela quer poder editá-la localmente a qualquer momento, e o `.zip` é a cópia portátil, que não depende da
API nem do editor. Fica na pasta da tela, `telas/<slug>/<slug>-<AAAAMMDD-HHMM>.zip`, com a data e a hora
em que foi gerado, e vai a quem pede junto com a versão salva. O empacotador recusa saída que já existe: nenhum
`.zip` se sobrescreve. ➜ *Por que data e hora, e não o número da versão:* o `.zip` sai antes da subida,
quando a versão ainda não existe, e a outra skill que sobe tela (a `onboarding-de-tela`) grava na mesma
pasta. Quem liga a pasta da tela a uma versão do construtor é o `.construtor.json` dela, que o `salvar`
grava.

```bash
python -I <skill>/scripts/empacotar_importacao.py <pasta da tela> <tela-dir>/<slug>-<AAAAMMDD-HHMM>.zip --pacote <pacote>
```

O `.zip` leva só `src/`, como o construtor exporta. **Reprova** se `src/main.tsx`, `src/lib/` ou o
começo do `index.css` mudaram; se há import de pacote fora de `react`, `react-dom`, `react-router` e
`@ploomescrm/bridge`; `fetch`/`User-Key` fora do `api.ts` (a exceção é o `kit/registro.ts` do onboarding, igual ao
da skill, que manda o evento ao webhook do flow); `BrowserRouter`/`HashRouter`; ou se o
`api.ts`/`useConexao.ts` diferem do pacote; `src/vendor/<x>/` diferente de `bancada/vendor/<x>/`; e, com
`--pacote`, tela sem onboarding (kit em `src/onboarding/kit/` igual ao da skill, `roteiro.ts` e
`OnboardingProvider`). **Avisa** alvo do roteiro que nenhum `data-onboarding` marca. **Avisa** camada fixa sem `useViewportOverlay`, falta da
rota `path="*"` e cor fixa. Com bloqueio, não sobe por rota nenhuma.

#### A subida pela API

O script é o `scripts/construtor_api.py`; a chave vem do arquivo apontado com `--env` (*Onde ela lê e
grava*). O `--conta` é o Id da conta conferido no passo 2. Sem o arquivo ou sem a chave nele, peça a quem
pede que a preencha — nunca na conversa — ou suba pelo editor. Os comandos abaixo são
`python -I <skill>/scripts/construtor_api.py <comando> --env <arquivo da chave> …`.

1. **Tela nova:** `criar --conta <Id> --nome "<nome>" --emails <quem vai usar>`. Pergunte a quem pede quem
   pode usar a tela; o script inclui o usuário da chave, sem o qual a chave não edita a tela depois, e para se já
   existe tela com o mesmo nome (`--permitir-mesmo-nome` só se a tela nova é outra de propósito). **Tela que
   já existe** (o pacote de extensão do passo 2): `listar` dá o GUID dela.
2. **Base:** `baixar --projeto <GUID> --pasta <tela-dir>/base-v<N>`, sempre numa pasta nova e a cada
   subida; `N` conta as subidas da tela (1 na primeira, mais um a cada nova). É a versão mais recente, e
   não se edita.
3. **Subir:** `salvar --conta <Id> --base <tela-dir>/base-v<N> --editado <pasta da tela> --pacote <pacote>
   --permitir-novos`. Roda o mesmo portão do `.zip` e tem duas travas: para se alguém salvou depois do
   `baixar` e, da segunda subida em diante, se a tela mudou no construtor desde a última subida desta pasta
   — o `.construtor.json` que o `salvar` grava na pasta da tela aponta outra versão que a base. Parou na
   segunda? Veja o que mudou antes de gravar por cima (*Trocar de rota no meio*, acima). O portão roda numa
   cópia da pasta num caminho curto; se nem assim o Windows ler, ele para com "caminho longo demais":
   trabalhe numa pasta curta (por exemplo, com `subst`).

⛔ **Escrita só com o plano aprovado.** `criar` e `salvar` sem `--executar` só simulam: mostre a quem pede o
plano (e, no `salvar`, o diff) e espere o OK em texto. Só então repita com
`--executar --confirmo "CONFIRMO <n>"`, com o número que o plano mostrou. ⛔ **Publicar é de quem pede**, pela
interface: a API tem a rota, e a skill não a usa.

➜ **Build que não ficou pronto:** o script não declara sucesso. Corrija a tela, gere o `.zip` da próxima
entrega e suba de novo, com uma base nova. ➜ **Tempo esgotado ou resposta incerta** (5xx, conexão que
caiu): nunca repita o comando; o script mostra as versões que existem, e você confere antes de qualquer
outra tentativa. Só a recusa com 4xx é certa: nada foi gravado.

#### A resposta a quem pede

1. a versão salva (o build e a conferência do script), o caminho do `.zip` e o resultado do portão, da
   bancada e da API real (inclusive o NÃO VERIFICADO);
2. **como publicar:** abrir a tela em Telas personalizadas → "Ir para edição", testar e publicar pela
   interface. Pela rota do `.zip`, antes: importar no projeto da tela (ou num projeto novo, se a tela
   ainda não existe);
3. **como pedir ajustes:** volte aqui, ajuste o pacote ou a tela, teste e suba de novo — uma entrega nova,
   com o `.zip` dela. Ajuste que muda dado volta ao contrato (passo 3);
4. **como medir:** os tokens do subagente que construiu a tela.

---

## Onboarding numa tela que já está em produção

A tela que já roda num cliente e não tem onboarding ganha o mesmo kit sem ser reconstruída: os passos 1 a
8 não se aplicam (a camada de dados é a dela, como foi para o ar). **A regra dura deste caminho:** a tela
só **ganha** — o provider, as marcas `data-onboarding`, o botão Ajuda, as dicas e as chamadas de `marcar`.
Nenhum comportamento muda, nenhum arquivo do export some, e o que é novo vai em `src/onboarding/`.

| # | Passo | Sai |
|---|---|---|
| E1 | Com a chave do cliente, `baixar` a versão mais recente da tela numa pasta nova (passo 9); sem ela, pedir a quem pede o **export** (no construtor, o projeto da tela → exportar). E a conta dela | a pasta baixada, que também é a base do `salvar`, ou o `.zip` |
| E2 | `python -I <skill>/scripts/preparar_tela_existente.py <pasta baixada ou export.zip> <pasta>` | `original/` (intocado), `tela/` (com o kit) e `inventario.md` |
| E3 | `npm install` na `tela/` (PowerShell) e `npx tsc --noEmit && npx vite build` **antes** de mexer | a prova de que a tela compila aqui como está |
| E4 | Escrever o roteiro e integrar (abaixo) | `src/onboarding/roteiro.ts` e as marcas |
| E5 | Testar na bancada, `--api-real`, **só leitura** | os critérios do onboarding passados |
| E6 | `python -I <skill>/scripts/empacotar_importacao.py <pasta>/tela <tela-dir>/<slug>-<AAAAMMDD-HHMM>.zip --tela-existente <pasta>/original` | o `.zip`, com a lista do que mudou |

- ➜ **Sem a versão baixada ou o export, não comece.** Não reescreva a tela a partir do que se vê no Ploomes.
- ➜ **A tela não compila no E3?** Pare e diga a quem pede o erro. Não conserte a tela para caber no onboarding.
- ➜ **A pasta de trabalho** é `telas/<slug>/tela-em-producao/`, na pasta de entrega (*Onde ela lê e
  grava*), como a `pacote-construtor/` do caminho principal.
  Mais de uma tela no mesmo cliente: uma pasta por tela.

**E4 — o roteiro e a integração.** Leia a tela inteira e o `inventario.md`, e escreva o roteiro como a
subseção "### Onboarding" de `references/modelo-do-pedido.md` manda e o `references/roteiro.md` da skill
`onboarding-de-tela` detalha: quem usa, boas-vindas, tour, primeiros passos, dicas e estados vazios, no
vocabulário de quem usa a tela. Quem usa não está claro na tela? Pergunte a quem pede antes de escrever — a entrevista
da `onboarding-de-tela` tem as perguntas. Depois integre com o mínimo de mudança:

- envolva as rotas com `<OnboardingProvider roteiro usuarioId={config.userId} pronto>`, dentro do Router
  (o `config` vem de `usePloomesBridge()`, que a tela já usa);
- ponha `<BotaoDeAjuda />` no cabeçalho e `data-onboarding="<id>"` nos elementos que já existem;
- marque as tarefas que se cumprem ao abrir uma rota com um componente próprio em `src/onboarding/`
  (veja `MarcasPorRota` abaixo), sem mexer no código da tela; só a tarefa que depende de uma ação
  (salvar, mover) ganha um `marcar()` no lugar da ação;
- o lançador dos primeiros passos encobre algo no canto inferior esquerdo? Mude o lugar dele por
  `--ob-lancador-esquerda` / `--ob-lancador-baixo` no CSS da tela.

```tsx
// src/onboarding/MarcasPorRota.tsx — marca a tarefa só de abrir a rota
const POR_ROTA: Record<string, string> = { '/atendimentos': 'atendimentos' };
export function MarcasPorRota() {
  const { pathname } = useLocation();
  const { marcar } = useOnboarding();
  useEffect(() => { const t = POR_ROTA[pathname]; if (t) marcar(t); }, [pathname, marcar]);
  return null;
}
```

**E5 — a bancada.** `node bancada/servidor.mjs --api-real https://public-api2.ploomes.com/ --tela <tela>/dist`
(no Windows, `bancada/windows/rodar-tela-api-real.ps1`). **Sem `--permitir-escrita`, nunca**: na conta do
cliente é só leitura, com a chave que quem pede guardou (passo 8). Na conta de teste, a tela pode abrir sem os
dados do cliente. Para testar o onboarding isso basta, porque as boas-vindas, o tour e o Ajuda não dependem
dos dados.

**E6 — o empacotador nesse modo** compara com o `original/`, não com a base daqui (a base de lá pode ser
de outra versão, e o export costuma vir sem `src/lib/`). Reprova:
- arquivo do export que sumiu;
- `main.tsx` ou `src/lib/` mudados;
- arquivo novo fora de `src/onboarding/`;
- chamada de rede ou pacote novos;
- kit editado, ou falta do roteiro ou do provider.

O que o export já tinha é herdado e não reprova. A lista "Arquivos do export que mudaram" sai com as linhas
de cada arquivo; **arquivo que perdeu linhas é aviso**, confira. O `.zip` repete a forma do export (a
pasta raiz dele) e não leva a `src/lib/` que serviu só para compilar.

**Entrega:** pelas rotas do passo 9, sempre **no projeto da tela existente**, nunca num projeto novo. Pela
API, `salvar --base <pasta baixada> --editado <pasta>/tela --tela-existente --permitir-novos` — o
`--tela-existente` aplica as regras do E6, e o `--permitir-novos` aceita os arquivos de `src/onboarding/`.
O `.zip` do E6 sai do mesmo jeito, como em toda entrega. A resposta a quem pede leva o resultado dos passos E3,
E5 e E6, a versão salva e a lista do que mudou.

---

## Cuidados deste ambiente

- **Windows:** com acento no nome do usuário, o Python pode perder o caractere no diretório atual. Passe **caminho absoluto**
  aos scripts, e rode `npm` pelo PowerShell (pelo Bash, o esbuild não instala).
- **A base do construtor muda.** Ao receber um export novo de tela em branco, troque `bancada/scaffold/src/`
  por ele, compile (`npx tsc --noEmit && npx vite build`) e rode o autoteste: o empacotador compara
  `main.tsx` e `src/lib/` com essa cópia.
- **`@ploomescrm/bridge` é proprietário:** não entra no repositório nem no `.zip`; vem do `npm install`.

## Manter a skill

- **Mexeu no gerador, no portão, na bancada ou em `scripts/modelos/`?** Rode `node scripts/autoteste.mjs`:
  gera o exemplo, passa o portão, sobe a bancada e roda o teste de fumaça. Sem PASSOU, não publique.
- **Formato novo visto na API real** → corrija o gerador e a API falsa juntos, e registre em
  `references/formatos-reais-da-api.md`.
- **A api-docs mudou** → regere `references/rotas-api.txt` a partir de `api-docs/endpoints`.
- **Mexeu no `scripts/construtor_api.py`?** Rode `python -I scripts/construtor_api.py --autoteste`: API
  falsa em `127.0.0.1`, nenhuma chamada sai da máquina. Sem PASSOU, não publique.
- **A API do construtor respondeu diferente do que está em `references/api-do-construtor.md`** → corrija o
  script e o arquivo juntos; até lá, suba pelo editor.
- **O kit de onboarding é da skill `onboarding-de-tela`** (`kit/`): o empacotador, o `preparar_tela_existente.py` e o
  autoteste o leem de lá. Mexeu no kit? Rode o autoteste das duas skills.

## O que ainda não se sabe

- **Se a importação aceita o `.zip` como ele sai.** Ele segue o export (só `src/`), e não foi importado
  num cliente. Não trava a entrega: a tela sobe pela API ou pelo editor, e o `.zip` é a cópia local e a
  rota de reserva.
- **Criar tela de CPQ pela API.** O modelo de CPQ está em `/templates`, mas a criação com ele não foi
  testada; o `criar` usa o modelo de tela.
- **Como o CRM trata o `/` que a base reporta ao conectar**, antes de aplicar a `initialRoute`: a
  bancada ignora e avisa no painel; se o CRM obedecer, o link copiado volta para a raiz.
- **A versão do `motion` no construtor.** Uma tela em produção importa `motion/react`, mas o export
  não diz a versão; a base daqui fixa a 12.43.0, e o kit de onboarding usa só a API estável entre a 12 e a
  14. Falta confirmar com o produto (`references/contrato-do-construtor.md`, seção 6).
- **O `ler-conta` numa conta real.** As rotas são as do `api.ts` gerado, e a paginação por Id em `Fields`
  e `Checklists` é a do retrato da conta da `onboarding-de-tela`; a de `DocumentTemplates` passou só na
  API falsa do autoteste. Se uma delas recusar, confira pelo MCP e corrija o script.
- **Quanto a API do construtor dura como está.** O produto não a documenta; o que se sabe dela foi medido
  (`references/api-do-construtor.md`), e o editor é a saída se ela mudar.
- **O que falta conferir na API real** está no fim de `references/formatos-reais-da-api.md`.
