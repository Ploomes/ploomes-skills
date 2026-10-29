---
name: indicacao-de-tela
description: "Indica onde uma tela própria dentro do Ploomes (construtor de telas / AI Builder) resolve o que o nativo não resolve no processo de um cliente — só com a trava nativa nomeada e a evidência citada do processo, do escopo ou das notas; nativo primeiro, e pedido fora disso fica registrado como pedido. Pensa por papel: o que a mesma pessoa usa o dia todo vira uma mesa com abas. Pergunta na conversa quais telas seguem e como cada uma deve ser, e desenha as escolhidas na base em branco do construtor: o protótipo navegável, a especificação com rotas, dependências, roteiro de configuração e roteiro de onboarding, e a lista do que a tela exige da conta. Lê o que está na pasta de trabalho (processo, escopo, notas) e o que a pessoa conta. Não constrói a tela final (é a pacote-para-o-construtor), não cria funil nem campo e não escreve na conta. Use para \"vale uma tela própria para este cliente?\", \"indica as telas do processo da [empresa]\", \"monta o protótipo da tela de [tarefa]\"."
---

# Indicação de tela

Você recebe um **cliente** e o processo dele, e responde a uma pergunta: **alguma parte do processo
redesenhado fica melhor numa tela própria dentro do Ploomes do que no nativo?** Se ficar, quem pede
diz quais seguem e como as quer, e você desenha cada uma aqui. Quem as constrói e as leva ao
construtor é a `pacote-para-o-construtor`.

🔴 **Nativo primeiro, tela depois.** É a regra de ouro da `ploomes-tech-docs:business-docs`: a tela
só é indicada quando existe uma **trava nativa nomeada** — um limite da plataforma que o processo,
o escopo ou as notas esbarram. ⛔ **Tela por estética ou dashboard genérico não é indicação**:
Relatório e Analytics resolvem dashboard.

🔴 **Mas quem decide é quem pede.** Se ele quiser uma tela que a indicação não recomendou, ela segue
**registrada como pedido dele**, no formato do arquivo, com a trava que faltou dita em uma frase.
Pedido que não fica no arquivo some do portão de coerência e do roteiro de configuração.

⛔ **Você não desenha funil, não cria campo na cadeia e não edita CSV.** O que a tela precisa da
conta vira **requisito declarado** no `requisitos-da-cadeia.csv`; quem cria são as skills de
configuração, e quem confere a costura é o `_nucleo/validar_coerencia.py`.

As regras marcadas **(produção)** vêm da comparação com uma tela que foi para o ar:
`references/licoes-da-producao.md`. Leia antes de mudar alguma.

---

## 1. Onde ela lê e grava

🔴 **Qual pasta e o que procurar nela está no [modo de trabalho](../_nucleo/modo-de-trabalho.md)**
— leia-o antes de começar. O que é desta skill:

- **Tudo o que ela grava fica em `telas/`, dentro da pasta de entrega**, a pasta irmã da
  `arquivos-de-configuracao/`, que é onde o portão de coerência procura os requisitos.
- **A entrada é o que está na pasta de trabalho e a conversa:** o processo (`as-is.bpmn` ou
  `processo.md`), o escopo (`escopo.md`), as `notas/` e os `documentos/` — e, faltando algum, o que
  quem pede contar. Sem o processo desenhado, a evidência de cada candidato é a fala dele, citada.
- **Quem pede** é quem vai entregar a tela ao cliente: responde a fase B, escolhe as telas que seguem
  e mostra o protótipo ao cliente.

---

## 2. As quatro fases, e quem roda cada uma

| Fase | Quando | Onde roda | Grava |
|---|---|---|---|
| **A. Indicar** | **antes da configuração da conta** | subagente | `telas/candidatos-de-tela.md` |
| **B. Perguntar** | logo depois da A | 🔴 **na conversa principal** | a decisão de quem pede, dentro do `candidatos-de-tela.md` |
| **C. Desenhar** | depois da B, **uma tela por subagente** | subagente | `telas/<slug-da-tela>/` |
| **D. Conferir** | com os CSVs da configuração gravados (funis, checklists, automações, fluxos) | `_nucleo/validar_coerencia.py` | — (é o portão que lê) |

🔴 **A fase B nunca roda dentro de subagente.** Lá não há ninguém para responder. A fase A devolve
os candidatos **pelo arquivo**; quem conversa com quem pede pergunta; a fase C lê a decisão **do
arquivo**, nunca da conversa.

➜ **Nenhum candidato na fase A:** grave o arquivo com a seção `## Nenhuma tela indicada` e o porquê
em uma frase. É resultado válido: a skill termina ali e a configuração segue.

🔴 **Portão próprio:** `python scripts/validar_telas.py <pasta telas/> [--fase A|C]`, no fim da fase A
e no fim da fase C. **Bloqueio não entrega.**

---

## 3. Fase A — Indicar

### O que ler

1. O **processo atual**: o as-is em BPMN, se houver; senão o
   `processo.md` ou o que quem pede descreve.
2. O **escopo**: o que foi vendido ao cliente.
3. As **notas** e o que quem pede contar: procure como a pessoa trabalha hoje — planilha paralela,
   telas abertas em sequência, cálculo na mão.
4. **(produção)** O que se sabe das **integrações** do cliente: o ERP, o WhatsApp, os flows — nas
   notas, nos documentos ou na conversa.
   Uma tela que vive de dado do ERP precisa saber disso já na indicação.
5. `ploomes-tech-docs:business-docs` → `construtor-de-tela/introducao-claude.txt` primeiro, depois
   só o que o caso pedir (`rc-lista-de-field-paths.txt`, `md-formularios-e-campos.txt`,
   `md-abas-e-tabelas-dinamicas.txt`, `se-formularios-externos.txt`).
6. **As telas que a conta já tem.** Com o MCP do Ploomes, `buscar_telas_ia` — **antes, `buscar_conta`**:
   com o MCP noutra conta, não use. Sem o MCP, o `listar` do `construtor_api.py` da
   `pacote-para-o-construtor`, com a chave do arquivo (`--env`). Sem nenhum dos dois, diga no arquivo
   que as telas existentes não foram conferidas. ⛔ Não indique tela que já existe; indique a extensão
   dela.

### Os sinais que abrem candidato

Cada candidato precisa de **pelo menos um sinal de S1 a S5**, com a evidência citada:

| Sinal | O que o processo mostra | Trava nativa |
|---|---|---|
| **S1** | **Dado que o Ploomes não tem como entidade**: série no tempo (cotação diária, consumo), saldo que baixa (contrato entregue em parcelas), grade N×N (ofertas × fornecedores) | não há série temporal nem entidade dinâmica; o contorno é JSON em campo multilinha |
| **S2** | **Uma tarefa que exige várias entidades na mesma tela**: negócio + produtos do cliente + proposta + tarefas, operados juntos | a aba mostra uma entidade, ≤ 50 itens e ≤ 30 campos por página |
| **S3** | **Vínculo sem field-path**: filtrar ou exibir dado de entidade ligada por campo Usuário, Produto ou Cliente sem relação em `rc-lista-de-field-paths.txt` | sem field-path não há filtro nem automação nativa |
| **S4** | **Cálculo fora das fórmulas nativas** — o mesmo sinal do aviso `formula-fora-do-nativo` da `configuracao-de-proposta` | fórmula simples e JavaScript em campo são o teto |
| **S5** | **Captura externa que o formulário externo não cobre**: CAPTCHA, Tag Manager, consentimento com data, lista vinda do Ploomes | limite declarado do formulário externo |
| **S6** | **Planilha ou sistema paralelo usado todo dia** para o que o CRM deveria conter | é o sintoma, não a trava |

⚠️ **S6 sozinho não abre candidato** — o portão bloqueia. Planilha paralela muitas vezes some com um
campo e uma aba.

### Pense por papel, não por trava (produção)

Junte os candidatos pelo **"Quem usa"**. Duas ou três tarefas da mesma pessoa, no mesmo dia, são
**uma mesa com abas** — a agenda, a operação do registro e a consulta — e não telas soltas que ela
abre uma depois da outra. Numa tela que foi para o ar, duas telas indicadas em separado para a
mesma pessoa viraram uma só, com abas, pouco depois. A mesa conta como **um** candidato, e cada aba
diz a sua trava.

🔴 **No máximo três candidatos.** Mais que isso é sinal de que o desenho nativo ainda não foi
tentado — o portão bloqueia.

### O formato do `candidatos-de-tela.md` — o portão lê este formato

```markdown
# Candidatos de tela — <Cliente>

## <Nome provisório da tela>
- Slug: <slug-em-kebab-case>
- Sinais: S1, S2
- Evidência: <elemento do processo / arquivo:trecho / item do escopo / fala de quem pede>
- Trava nativa: <o limite, citando o arquivo da business-docs>
- Por que o nativo não basta: <uma frase>
- O que a tela faria: <duas ou três frases, no vocabulário do cliente>
- Abas: <só numa mesa: uma por tarefa, com a rota — "Meu dia (/)", "Atendimentos (/atendimentos)">
- Quem usa: <papel ou raia do processo>
- Integrações: <as que o processo cita e a tela usa, ou "nenhuma">
- O que ela exige da conta: <funis, etapas, campos, modelos — só o que dá para prever>
- Veredito: RECOMENDADA | OPCIONAL

## Notas
<o que não é candidato e vale registrar — "o painel o nativo resolve, porque…". O portão não lê.>
```

⛔ **Não escreva a seção `### Decisão de quem pede`** — ela é da fase B.

---

## 4. Fase B — Perguntar (na conversa)

Quem conversa com quem pede lê o `candidatos-de-tela.md` e pergunta, com `AskUserQuestion`:

1. **Quais seguem.** Múltipla escolha; "nenhum" encerra a skill. **Se ele quiser uma tela que não
   está na lista**, acrescente-a ao arquivo como candidato com `Veredito: PEDIDO`, a trava que faltou
   numa frase (`Trava nativa: nenhuma — <por que o nativo resolveria>`) e os demais campos. Ela segue
   como qualquer outra.
2. Para cada tela que segue, **como ele a quer**. São no máximo quatro perguntas por rodada, e
   quantas rodadas forem precisas:
   - **a tarefa principal**: o que a pessoa faz ali, do começo ao fim, em uma frase;
   - **(produção) a tela opera o registro ou só mostra?** Operar é ganhar, perder, reabrir, mudar de
     etapa e gerar documento sem sair da tela. Mostrar é cada clique abrir o card nativo. Numa tela
     que foi para o ar, a resposta foi "só mostra" e a tela no ar faz tudo — pergunte com o exemplo;
   - **o que ela vê primeiro**: lista, quadro (kanban), ficha de um registro ou painel; numa mesa,
     a aba inicial;
   - **(produção) integrações e flows**: para cada integração que o processo cita, se a tela usa, o
     que mostra dela e se a integração já existe. "Sistema externo: nenhum" não durou numa tela que
     foi para o ar. ⛔ Não suponha integração que quem pede e as notas não citaram;
   - **(produção) quanto dado e quem vê**: quantos registros abertos por pessoa e por equipe, e o
     recorte por perfil (o gestor vê a equipe, o administrador vê todos).

➜ **Tendo quem pede rascunho, print ou planilha**, peça o arquivo: vale mais que as perguntas.

🔴 **Grave a decisão embaixo de cada candidato, antes de despachar a fase C**, neste formato:

```markdown
### Decisão de quem pede
- Segue: sim | não
- Tarefa principal: ...
- Opera o registro: sim | não — <as ações: ganhar, perder, reabrir, duplicar, etapa, documento…>
- Vista inicial: lista | quadro | ficha | painel
- Integrações: nenhuma | <nome — o que a tela mostra — existe hoje? sim | não>
- Volume e recorte: <~N registros abertos por pessoa; quem vê o quê>
- Referência enviada: <arquivo, se houver>
```


---

## 5. Fase C — Desenhar (uma tela por subagente)

### O que carregar, nesta ordem

1. `references/prototipo-na-base.md` — **a base em branco do construtor**: rotas, tokens, modal,
   navegação ao CRM, padrões que entram sem pedido e a camada de dados.
2. `ploomes-tech-docs:business-docs` — `introducao-claude.txt` e `boas-praticas.txt` do
   `construtor-de-tela/`: regras de negócio e **ordem de configuração**.
3. `ploomes-tech-docs:frontend-docs` — os quatro estados, contrato de campo por TypeId, o que vem
   da conta e não se fixa.
4. `ploomes-tech-docs:ds-ploomes-crm-ui` — componentes e voz pt-BR. Para cor, valem os tokens da base.
5. `ploomes-tech-docs:api-docs` — as rotas que a tela chama.

### O que gravar em `telas/<slug>/`

| Arquivo | Conteúdo |
|---|---|
| `prototipo.html` | frontend navegável, arquivo único, CSS e JS embutidos, **na forma da base** (`references/prototipo-na-base.md`) |
| `especificacao.md` | cinco seções, com estes títulos: `## a. Especificação macro` · `## b. Entidades e campos` · `## c. Roteiro de configuração` · `## d. Dependências e fases` · `## e. Onboarding` |
| `requisitos-da-cadeia.csv` | o que a tela exige que exista na conta, **com o nome exato** que ela usa |

**O que cada seção da especificação traz:**

- **a. Especificação macro.** Começa pela **tabela de rotas**: rota, tela ou aba, o que abre e o
  que vai na query. Depois, por bloco:
  - o que mostra;
  - de qual leitura vem cada coisa;
  - **o volume esperado e como pagina**;
  - as ações e a escrita de cada uma;
  - os estados;
  - as regras.

  Com `Opera o registro: sim`, entram inteiras as regras do `boas-praticas.txt`: checklists da
  etapa à vista, ganhar só com os obrigatórios, regras do funil, ganho e perdido não mudam de
  etapa, perder com motivo, reabrir.
- **b. Entidades e campos.** Entidades, campos (nativos e novos) pelo **nome exato**, e onde cada
  um aparece. A **data** que cada indicador usa (fechamento ≠ última atualização).
- **c. Roteiro de configuração.** Parâmetro por parâmetro, na ordem da `business-docs`.
- **d. Dependências e fases.** Cada bloco que depende de uma integração ou de um flow diz:
  - qual é;
  - se já existe;
  - o que a tela mostra enquanto ela não existe — o estado "aguardando a integração com…";
  - **como a tela a dispara**: por uma escrita no Ploomes, que uma automação leva ao flow.

  ⛔ Nunca por URL de webhook ou de flow no código da tela. Sem dependência, escreva "Nenhuma".
- **e. Onboarding — para quem vai usar a tela.** Toda tela sai com o caminho do primeiro uso, no
  vocabulário de quem usa (o vendedor, o gestor), não no de quem configura:
  - **boas-vindas** — 2 a 4 cartões de uma frase: para que serve, o que se vê primeiro, a ação
    principal, onde pedir ajuda;
  - **tour** — 4 a 8 passos na ordem do trabalho, cada um com o elemento que realça, o texto e uma ação
    para experimentar;
  - **primeiros passos** — 3 a 6 tarefas reais, e o que conta como feita;
  - **dicas** — o "?" de cada número ou termo que o usuário pode não entender;
  - **estados vazios que ensinam** — o que dizer e que botão oferecer quando o bloco vem vazio.

  O kit de onboarding é da skill `onboarding-de-tela` (`kit/`), que já tem as animações (Motion), a
  acessibilidade, o tour por parte, o "O que há de novo" por versão e o roteiro por perfil; a especificação
  só escreve o roteiro, e a `onboarding-de-tela` o mantém quando a tela muda.

**O `requisitos-da-cadeia.csv`** tem quatro colunas — `Tipo`, `Nome`, `Funil`, `Por quê` — e o
`Tipo` é um destes cinco:

| Tipo | `Nome` é | `Funil` | Quem cria na configuração |
|---|---|---|---|
| `funil` | o nome do funil | vazio | `configuracao-de-funis` |
| `etapa` | o nome da etapa | o funil dela | `configuracao-de-funis` |
| `modelo` | o nome do modelo de PVD | vazio | `configuracao-de-proposta` |
| `motivo-de-perda` | o motivo | vazio | `configuracao-de-funis` |
| `campo` | o nome do campo | vazio | `configuracao-de-proposta` ou `configuracao-de-checklists` — ou a própria tela, pela parte c do roteiro |

### Regras do protótipo — o portão confere as marcadas com ⚙

- 🔴 **É uma tela dentro do Ploomes, na base do construtor:** sem logo, perfil ou logout; uma rota
  por aba e por registro aberto; modal sobre a página inteira; "Abrir no Ploomes" pela navegação
  do CRM.
- ⚙ **Cores só pelos tokens da base** (`var(--color-*)`, com os blocos `:root` e `.dark` copiados
  de `pacote-para-o-construtor/bancada/scaffold/src/index.css`). Hex solto vira aviso: o construtor
  copia o CSS do protótipo, e a conta whitelabel e o modo escuro deixam de funcionar.
- ⚙ **Login pelas credenciais do usuário, nunca chave de API fixa**: nenhum `User-Key` com valor
  literal.
- ⚙ **Camada de dados isolada:** um único `const api = {...}`, uma função por rota do Ploomes (a
  rota, o recorte e o volume em comentário), devolvendo o dado de exemplo.
- ⚙ **Nenhuma URL de webhook ou de flow** no protótipo nem na especificação.
- ⚙ **Nada externo:** nenhum `<script src>` nem `<link>` para fora, exceto Google Fonts. A página
  pode ser publicada como artifact, e o artifact bloqueia host externo.
- 🔴 **Dado de exemplo no vocabulário do cliente**, tirado do processo e das notas — nunca
  "Empresa X" e "Produto 1".
- 🔴 **Os padrões da seção 2 de `references/prototipo-na-base.md` entram sem pedido.**
- ⛔ **Nada de administração de usuário, perfil ou modelo de PVD**: isso é só no admin do Ploomes.
- ⛔ **Nenhuma configuração no roteiro que a tela não usa, e nenhuma que ela usa pode faltar.**

### Entrega

1. Grave os três arquivos em `telas/<slug>/` e rode `scripts/validar_telas.py --fase C`.
2. **Mostre o protótipo a quem pede.** Podendo a sessão publicar artifact, publique o
   `prototipo.html` (carregue `artifact-design` antes), com o título `<Tela> — <Cliente>`, para ele
   abrir e mostrar ao cliente; sem isso, o arquivo abre direto no navegador.
3. Devolva **o caminho da pasta e o link do artifact, se houver**, nada mais.

➜ **Depois desta skill**, com a configuração criada na conta, a `pacote-para-o-construtor` lê a
especificação e o protótipo, confere a conta, gera a camada de dados, constrói a tela na base do
construtor e sobe a versão no construtor. **Ajuste de tela se faz lá, e não em rodadas no
construtor**: numa tela que foi para o ar, as rodadas no construtor terminaram com a camada de dados
reescrita à mão (`references/licoes-da-producao.md`, item 4).

---

## 6. Fase D — a costura, que é do portão de coerência

🔴 **Só roda havendo os CSVs da configuração** na `arquivos-de-configuracao/` da pasta de entrega —
os que as skills `configuracao-*` gravam. Sem eles não há costura a conferir: diga isso na entrega, e
o `requisitos-da-cadeia.csv` de cada tela fica como a lista do que a conta precisa ter.

```bash
python "${CLAUDE_PLUGIN_ROOT}/skills/_nucleo/validar_coerencia.py" <pasta de entrega>/arquivos-de-configuracao
```

Ele lê cada `telas/*/requisitos-da-cadeia.csv` das telas com `Segue: sim` e confere contra os CSVs
da `arquivos-de-configuracao/`:

| Achado | Severidade | Volta para |
|---|---|---|
| `tela-funil-inexistente`, `tela-etapa-inexistente`, `tela-motivo-inexistente` | bloqueio | **`configuracao-de-funis`** |
| `tela-modelo-inexistente` | bloqueio | **`configuracao-de-proposta`** |
| `tela-sem-requisitos` | bloqueio | **fase C** desta skill |
| `tela-campo-fora-da-cadeia` | aviso | nenhuma — o campo fica no roteiro da tela (parte c), declarado na entrega |

⛔ **Não edite CSV para a costura passar**, e ⛔ **não mude a tela para caber no que a configuração
fez** sem voltar a quem pede.

---

## 7. O que você nunca faz

- ⛔ Indicar tela sem trava nativa nomeada e sem evidência citada. Pedido de quem pede se registra
  como pedido.
- ⛔ Perguntar a quem pede de dentro de um subagente.
- ⛔ Supor integração que quem pede e as notas não citaram.
- ⛔ Prometer prazo ou custo da tela. Leve a capacidade, não o número.
- ⛔ Enviar a tela ao Ploomes. Construir e subir é da `pacote-para-o-construtor`.

---

## Manter a skill

- **Mexeu no `validar_telas.py`?** Rode `python scripts/autoteste.py`. Sem PASSOU, não publique.
- **Uma tela indicada aqui foi para o ar?** Compare o que a skill gravou com o código exportado do
  construtor e registre o que mudou em `references/licoes-da-producao.md`, sem o cliente: o que
  aconteceu e a regra que saiu. Regra nova nasce de lá, marcada **(produção)**.
- **A base do construtor mudou?** A cópia vive na `pacote-para-o-construtor`
  (`bancada/scaffold/src/`); confira se `references/prototipo-na-base.md` ainda bate com ela.
