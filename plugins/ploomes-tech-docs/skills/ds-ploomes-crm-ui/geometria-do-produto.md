# Geometria do produto — medidas aferidas

Medidas tiradas de **capturas de DOM do app rodando** (`app.ploomes.com`), com posição,
dimensão e estilo computado. Capturas de **27/05/2026**, **02/07/2026**, **04/08/2026**,
**05/08/2026** e **06/08/2026** — a rodada de 04/08 varreu Painel, Funil, tabela, Negócio, busca aberta e menu
expandido em **viewport 1920 × 945**, e resgatou as folhas de estilo do sistema legado (2,85 MB)
que até então eram ilegíveis por CORS. A rodada de 05/08 (via **chrome-devtools MCP**, não
Firecrawl) mediu a
**composição real do Painel** (os quatro widgets fixos, ver seção própria abaixo) depois de um
mockup gerado pela skill sair muito diferente do produto por nunca ter documentado isso.

A rodada de **06/08/2026** fez uma nova varredura autenticada pelo protocolo local do Chrome
(CDP), sem ler cookies, armazenamento ou perfil. Em **1536 × 730**, DPR **1,25**, ela percorreu
Painel, Clientes, Processos, Documentos e Produtos; forçou pseudoestados CSS; abriu seletores,
menu e tooltips; e releu as folhas carregadas. Dados de conta foram descartados: aqui ficam só
geometria, aparência, comportamento e identificadores técnicos públicos da interface.

| Evidência da rodada 06/08 | Valor |
|---|---|
| Rail | **195px expandido**, **55px recolhido** · transição declarada **150ms** |
| Chrome do Painel | topbar **50px** · subcabeçalho **40px** · conteúdo começa em y=90 |
| Coluna “Hoje” | x=210 · y=105 · **400px** de largura · altura fluida até a viewport |
| KPIs em 1536px | x=625 / 927 / 1229 · cerca de **286 × 176px** cada |
| Widgets grandes em 1536px | Publicações **435px** · Atividades **437px** de largura |
| Rotas aferidas | `/operations`, `/Contacts/producttable`, `/Deals/<funil>/table`, `/Orders/table`, `/Products/table` |

Estados, transições, tooltips, dropdowns e catálogo de ícones dessa rodada estão na seção
**Estados, movimento e iconografia**, mais abaixo neste arquivo.

> **Largura de contêiner: use apenas com a viewport indicada.** Há medidas válidas em 1920px e
> em 1536px; elas mostram como o layout responde, não dois tamanhos concorrentes. Rodadas
> intermediárias de 04/08 em 690px produziram larguras absolutas que **não devem virar regra** —
> a coluna do Funil, por exemplo, mede 250px de passo em 690 e **310px em 1920**. Altura, padding,
> raio, cor, tipografia e sombra são mais estáveis; largura de coluna e painel, não.

**Isto é um retrato, não uma especificação.** O design system é a fonte de verdade para cor,
token e componente; este arquivo existe para o que o DS não diz: quanto mede, onde fica, qual o
ritmo. Onde um valor daqui contradisser o pacote, o pacote vence — exceto quando você está
reproduzindo a tela atual, e aí vale conferir os dois.

Datas importam: o produto muda. As medidas mais recentes são da captura de **06/08/2026**; duas delas —
o cartão de indicador do Painel e a largura da coluna do Funil — já haviam mudado no intervalo
de dois meses desde a captura anterior. Reconfira antes de usar qualquer valor daqui numa
comparação lado a lado com o produto.

> **Partes do app já usam o design system, e a divisão é por tela.** A barra superior renderiza
> `ds-button normal_35 SOFT`, `SOFT_TO_ACTION` e a variante `--outline` das duas — os exports
> `ButtonSoft` e `ButtonSoftToAction` do `@ploomescrm/ui`; os widgets do Painel são construídos
> sobre `ds_icon`, `ds-rd` e `ds-dropdown-wrapper`. **Funil, Negócio, tabela e formulários rodam o
> sistema legado** — 105 classes `.button-*` em 1207 regras (ver a seção "O app tem DOIS sistemas
> de botão"). O **menu de módulos** é um terceiro caso: `styled-components` com `font-family: Inter`
> declarado; a rodada de 05/08 confirmou Inter 300/400/500 carregado nessa sessão.
> Ou seja, divergência entre este arquivo e o pacote não é toda igual — em parte da tela o pacote
> **é** o que está renderizando; em outra parte, o pacote nem entrou.

> **Fontes carregadas de fato** (`document.fonts`, filtrado por status `loaded`): **Source Sans
> Pro** 400/600/700 (o conteúdo inteiro) e **Font Awesome 6 Pro**. Na rodada de 06/08, os ícones
> visíveis usaram 300 (`fal`) e 900 (`fas`); a ausência de `far`/400 nessa navegação não prova que
> o peso foi removido do app. O prefixo da classe é o peso: `fal fa-eye` é 300,
> `fas fa-search` é 900. Inter 300/400/500 foi confirmado como carregado em 05/08.

---

## Chrome da aplicação

| Elemento | Medida | Raio | Observação |
|---|---|---|---|
| **Símbolo da marca** | **23 × 17** (viewBox `0 0 23 17`) | — | São **duas formas em "V" deitado**, não a letra "P" e não um quadrado roxo com monograma. Use `assets/symbol-white.svg` da skill (branco, para o rail escuro) ou `assets/symbol-purple.svg` (roxo `#7E33E6`, para fundo claro). **Mais largo que alto** — caixa quadrada deforma o desenho. ⚠ **Fica no RODAPÉ do rail e só aparece expandido** — ver a seção do menu; o topo do rail não tem marca, o primeiro item já é um módulo (y=20) |
| Menu de módulos, recolhido | **55 × altura total**, padding `0 10px 10px 5px` | — | `font-family: Inter` declarado e confirmado como carregado na rodada de 05/08; 15px peso 300 |
| Menu de módulos, expandido | **195px** de largura | — | mesma tipografia |
| Item do menu (módulo, inativo/ativo) | **40 × 40** recolhido; área clicável **175 × 40** expandida; passo vertical de **50px** | 5px | y = 20, 70, 120, …; fundo sempre transparente, ícone inativo `rgb(135,131,141)` = `#87838D` |
| **Indicador do item ativo** | **60 × 40** recolhido; **195 × 40** expandido | 5px | sangra à esquerda: x=−15 recolhido e x=−10 expandido; `linear-gradient(102.35deg, rgb(125,51,230) 0%, rgb(67,17,136) 100%)` = **`#7D33E6 → #431188`**; sombra `shadow-4dp` |
| Ícone do menu | 25 × 15 em x=13 | — | **Font Awesome 6 Pro Light**, carregada: mais largo que alto |
| Item do rodapé do menu (expandir) | 40 × 40 | 5px | transparente; `box-shadow: rgba(246,241,253,.1) 0 0 0 1px inset`; cor `rgb(125,51,230)` = `#7D33E6` |
| Controle de expandir | 195 × 45, no rodapé | — | |
| Barra superior — `horizontal-menu` (o elemento externo) | **altura 50**, começa em x=55 recolhido ou x=195 expandido | — | fundo **transparente**, `z-index: 999`, **sem borda**; é só o envelope |
| ↳ **`horizontal-menu > div`** (onde vive o estilo) | altura 50, padding **`0 7,5px`**, gap 10px, `space-between` | **`5px 0 0`** | fundo `rgb(255,255,255)`; **`border-bottom: 1px solid rgba(27,16,44,.1)`** — a barra **tem** divisória |
| Botão "+" (`normal_35 SOFT_TO_ACTION --outline`) | **35 × 35** em x=63 recolhido ou x≈203 expandido, y=7; padding `0 5px`, gap 5px | 5px | fundo **branco**; anel `box-shadow: inset 0 0 0 1px rgba(27,16,44,.1)` (nunca `border`); ícone `rgb(26,148,255)` = `confirmation` |
| Campo de busca (`FakeSearchInput-component`) | **300 × 35** em x=108 recolhido ou x=247,5 expandido, y≈7; padding `0 0 0 10px`, gap 10px | **5px** | fundo **transparente**; não é pílula; anel `inset 0 0 0 1px rgba(27,16,44,.1)`; lupa e placeholder **14px**, `rgb(139,132,149)`; lupa mede 19×14 |
| Botão da IA (`ai-assistant-button`) | ver seção dedicada abaixo | 5px | não é pílula |
| Botões de ícone (`normal_35 SOFT`: e-mail, notificação, chat, agenda, perfil) | 35 × 35, passo de **45px** | 5px | fundo **transparente, sem anel**; no botão soft, hover/focus usa `rgba(27,16,44,.05)` e active `rgba(27,16,44,.1)`; ícone `rgb(27,16,44)` = `font` |
| Botão do usuário | **188 × 35**, padding `0 10px` | 5px | fundo **transparente** (não neutro) |
| Avatar | 20 × 20 | 50% | |
| Sub-cabeçalho (`operation-header-component`) | altura **40**, em y=50, padding **`0 15px`**, `space-between` | — | fundo `rgb(255,255,255)`; `border-bottom: 1px solid rgba(27,16,44,.05)` — **metade da opacidade** da barra acima |
| Seletor "Painel Ploomes" (`small_30`) | altura **30** | 5px | transparente; texto **14px peso 600** |
| Ação do sub-cabeçalho ("Menu"/"Customizar", `small_30`) | altura **30** | 5px | transparente; texto **14px peso 400** em `rgb(27,16,44)`; ícone 15px em `rgb(26,148,255)` = `confirmation`; "Customizar" é `--disabled`: **`opacity: .3`** no botão inteiro, não um tom de texto mais claro |
| Aba | altura 40 | `4px 4px 0 0` | **14px** — também presente em `small_30` (seletor de painel, "Menu"/"Customizar") |

## Sistema de variantes de botão

Lido das folhas de estilo do app em 04/08/2026 — inclui combinações que **nenhuma tela renderiza**,
e que por isso não apareciam em captura de DOM.

O botão do DS tem **três eixos ortogonais** mais modificadores. A composição real é
`ds-button <tamanho> <variante> --ds__button-color-<cor> [modificadores]`.

**Eixo 1 — variante** (decide a mecânica de fundo e anel): `SOFT` · `SOFT_TO_ACTION` · `ACTION`

**Eixo 2 — cor** (`--ds__button-color-*`): `brand` · `brand_ai` · `confirmation` · `danger` ·
`alert` · `confirmation_alt`

**Eixo 3 — tamanho:**

| Classe | Altura | Padding | Largura com `--has-not-text` | Texto |
|---|---|---|---|---|
| `tiny_20` | **25px** ⚠ o nome mente | `0 5px` | 25px | 13px/600 |
| `small_30` | 30px | `0 10px` | 30px | 14px |
| `normal_35` | 35px | `0 10px` | 35px | 14px |
| `big_40` | 40px | `10px` | 40px | 16px |

**Modificadores:** `--outline` · `--selected` · `--active` · `--disabled` · `--not-text` /
`--has-not-text` · `--hug-contents`

### Fundo e anel por variante, com estados

**O anel nunca é `border` — é sempre `box-shadow: 0 0 0 1px inset`.**

| Variante | Base | `:hover` | `:active` | Com `--outline` |
|---|---|---|---|---|
| `SOFT` | transparente, sem anel | `rgba(27,16,44,.05)` | `rgba(27,16,44,.1)` | fundo `#FFF` + anel `rgba(27,16,44,.1)` |
| `SOFT_TO_ACTION` | transparente, sem anel | `rgba(27,16,44,.05)` **+ anel na cor** | `rgba(27,16,44,.1)` + anel na cor | fundo `#FFF` + anel `rgba(27,16,44,.1)` |
| `ACTION` | **chapado na cor** | cor `level_1` | cor `level_2` | — |

Outros estados: `SOFT.--selected` = `rgba(27,16,44,.05)` + anel `rgba(27,16,44,.1)` ·
`SOFT.--active` = anel `#1A94FF` · `--disabled` = `opacity: .3` **e** `box-shadow: none !important`.

Hover e active são **`neutral-level_1` e `neutral-level_2`** — têm token, use o token.

### `ACTION` por cor

| Cor | Base | `:hover` (`level_1`) | `:active` (`level_2`) |
|---|---|---|---|
| `brand` | `#7D33E6` | `#8C49E9` | `#6F1CE3` |
| `brand_ai` | `#7E33E6` | `#8F4DED` | `#6D1ADF` |
| `confirmation` | `#1A94FF` | `#33A0FF` | `#0088FF` |
| `danger` | `#F22727` | `#F33F3F` | `#F00F0F` |
| `alert` | `#FFC01A` | `#FFC733` | `#FFB900` |
| `confirmation_alt` | `#3BDDAD` | `#51E1B7` | `#26D9A4` |

Texto de `ACTION`: `#FBF8FE` com `!important`.

**Todos esses hovers e actives batem com os tokens `--color-<cor>-level_1` e `-level_2` do tema
claro do pacote** — a única exceção é `brand`, que renderiza `#7D33E6` onde o token diz `#7e33e6`
(um dígito no R).

### O que o app usa de fato

Dos 44 `ds-button` do Painel, **44 são `confirmation`**. As outras cinco cores existem na folha e
nenhuma tela capturada as usa: **o chrome do CRM é monocromático em azul.** Ao reproduzir uma tela,
`confirmation` é o padrão; `danger`/`alert`/`brand` só com motivo.

Cor do ícone: **`SOFT_TO_ACTION` → `#1A94FF`; `SOFT` → `#1B102C`.** É função da variante, **não da
página** — Painel e Funil renderizam a mesma barra, botão por botão, com os mesmos valores.

### Foco de teclado: o DS não tem

| Componente | `:focus` / `:focus-visible` |
|---|---|
| `ds-button`, todas as variantes | **nenhuma regra**; `outline: none` computado |
| `.ds-dropdown:focus` | `border: none` — **remove** o indicador |
| `input.form-control:focus` | `border-color: #1A94FF` ✅ |
| Busca ao focar | anel muda para `#1A94FF` ✅ |

**O botão do DS não tem indicador de foco visível.** Ao gerar tela, isto é o único ponto deste
arquivo que você **não** deve replicar fielmente: adicione um anel de foco
(`box-shadow: 0 0 0 2px rgba(26,148,255,.5)` funciona com a mecânica de anel do sistema). Copiar
a falha de acessibilidade do produto não é fidelidade útil.

## Botão da IA

Não é pílula com borda — é um sanduíche de gradiente translúcido:

| Camada | Medida | Estilo |
|---|---|---|
| Moldura (`ai-assistant-button`) | **110 × 30**, padding **1px** | `background-image: linear-gradient(92.08deg, rgba(205,61,255,.5) 1.56%, rgba(15,47,255,.5) 100%)`; raio 5px |
| Miolo (`ai-assistant-button-content`) | 108 × 28, padding 8px, gap 2px | fundo `rgb(255,255,255)`; raio 5px |
| Ícone | 20 × 20 | é **imagem** (`/assets/images/ai-assistant-logo.svg`), não `svg` de biblioteca |
| Texto | 70 × 13, padding `0 4px` | 13px **peso 600**, `rgb(104,81,139)` |

O SVG do ícone tem `viewBox="0 0 25 21"` renderizado a 20 × 20: três estrelas de quatro pontas,
um único `<path>` com `fill-opacity="0.5"` e gradiente `#CD3DFF → #0F2FFF`
(`gradientUnits="userSpaceOnUse"`, `x1=0.405 y1≈0 x2=25.857 y2=1.157`). **A translucidez de 50%
está no SVG, não no CSS** — é o que dá o aspecto suave à moldura.

> **Há dois caminhos para esse efeito no app, e eles divergem.** O componente do DS
> (`SOFT --outline --ds__button-color-brand_ai`) faz borda-gradiente por **máscara**:
> `::before` com `inset: 0`, `padding: 1px`, `background: linear-gradient(141deg, #CA33FF, #334EFF)`
> e `mask: linear-gradient(#fff 0,#fff 0) content-box exclude, linear-gradient(#fff 0,#fff 0)`.
> O `.ai-assistant-button` da barra é **legado** e usa a moldura de dois elementos acima, com
> `92.08deg` e cores a 50%. Ao reproduzir a barra, use a moldura; ao usar o componente do DS, use
> a máscara.

## Contador de notificação

`component__counter-badge`: **17 × 16**, raio **2px**, fundo **`#FFC01A`** — que é o token
`--color-alert`. Fonte **10px peso 700**.

**É amarelo, não vermelho, e não é pílula.** Contador de notificação lido de print costuma ser
replicado como badge vermelho arredondado; a medida diz alert e raio 2. A cor do texto não foi
capturada — sobre amarelo, o token escuro (`font`) é o único legível.

## Área de conteúdo

| Elemento | Medida | Raio | Observação |
|---|---|---|---|
| Superfície | começa em (55, 90) | — | **`#F4F3F4`** — ver a nota de divergência abaixo |
| Cabeçalho de cartão / widget | altura **50** | **`10px 10px 0 0`** | 13px — **exceto** o título dos widgets grandes (Publicações, Atividades): confirmado em 05/08 como **14px/600** (`.widgets-component-header-title`), não 13px |
| Cartão de indicador (KPI) | **fluido, não fixo** — amostra 461 × 176 (captura de 27/05) e 412 × 174 (captura de 05/08, rail expandida) | **10px** | ⚠️ **Não é medida fixa**: o grid do Painel é `grid-stack gs-12` (biblioteca de 12 colunas, arrastável/redimensionável), e cada KPI ocupa **4 de 12 colunas** — a largura em px muda com o espaço disponível (rail recolhida vs. expandida, resolução da tela). Ao reproduzir, calcule a partir de `(largura útil do grid − gaps) × 4/12`, não copie um px fixo. |
| Faixa do objetivo | 429 × 39 | — | |
| **Barra de meta do KPI** (`.progress.table-progress.goal-bar`) | 382 × 30 (também fluida, mesma lógica do cartão) | **3px** | fundo `rgba(24,21,38,.05)` — ⚠️ **confirmado em 05/08: não é skeleton de carregamento.** É um componente real e permanente (trilha da meta do KPI), sempre visível — não trate como placeholder de loading. Erro cometido no primeiro teste de mockup desta skill. |
| Widget grande | **699 × 752** | **10px** | branco |
| Painel de conteúdo do widget | 697 × 710 | 4px | |
| Cartão lateral / coluna mestre | **400 × 893** | — | "Publicações", "Atividades", "Hoje" |
| Cartão de item | 358 × 70 | **10px** | 11,05px |
| Linha de grupo (`ds_collapse_header`) | 378 × **40**, padding `0 10px 0 15px`, gap 10px | **5px** | fundo **`rgb(255,255,255)` — branco**; **11,05px** peso **400** |
| Linha "Atrasadas" | 398 × 40, padding `0 10px 0 15px` | **`0 0 15px 15px`** | fundo `rgba(242,39,39,.05)` — `danger` a **5%**; 11,05px/400 |
| Texto de estado vazio | 142 × 18 | — | 13px **peso 600**, centralizado |
| Rótulo com contagem | ~90 × 25 | — | 13px peso 600 |
| Marcador/badge | 35 × 19 | **3px** | 11px peso 600 |
| Avatar em lista | 27 × 27 | 100% | |

## Card de tarefas do Painel

| Elemento | Medida | Raio | Observação |
|---|---|---|---|
| `task-list-component` | 400 × 873 | **15px** | fundo branco |
| `header-component` | 400 × **50**, padding `0 10px` | **`10px 10px 0 0`** | |
| Lado direito do cabeçalho | 65 × 30, gap 5px | — | dois botões de 30 × 30 |
| `ds-button small_30` | 30 × 30 e 76 × 30, padding `0 5px` | **5px** | texto 14px |
| Envoltório redimensionável (`ds-rd__rnd-wrapper`) | 400 × 610 | `0 0 10px 10px` | fundo `rgb(250,250,251)` = `#FAFAFB` — bate exato com `background-level_1` |
| ↳ filho (`ds-rd__rnd__children-wrapper`) | 400 × 610 | 0 | fundo **`rgb(244,243,244)` = `#F4F3F4`** — **as duas superfícies coexistem em camadas**, não é uma ou outra |

> **Inconsistência interna do app, não erro de medição.** O card usa raio **15px**, o cabeçalho
> dele **10px**, e o contêiner externo (`grid-stack-master-item`) **10px** — três valores na
> mesma pilha de elementos. Ao replicar, reproduza os três; alisar para um valor só é decidir
> design, não copiar a tela.

> **Reconfirmado ao vivo em 05/08/2026** (chrome-devtools MCP, `/operations`, com o identificador do painel omitido,
> viewport 1920×945, rail expandida): `task-list-component` raio 15px, `header-component` 400×50
> com borda `1px solid rgba(27,16,44,.1)` e raio `10px 10px 0 0`, `ds-rd__rnd-wrapper` fundo
> `#FAFAFB` com raio `0 0 10px 10px`, `-children-wrapper` fundo `#F4F3F4` — bateu exato. A altura
> total (873 em maio, 825 em agosto) **varia com a altura da janela**, não é constante: o card
> ocupa o restante do viewport abaixo do cabeçalho.

## Composição do Painel — os quatro widgets fixos

**O Painel não é um dashboard genérico** — reproduzi-lo como "cards de KPI + tabela + lista de
atividade" inventados é o erro que motivou esta captura (uma revisão comparou um mockup contra
screenshot real e apontou a divergência em 05/08/2026). Nesta conta, o Painel é montado por um
sistema de **grid arrastável e redimensionável** (`grid-stack gs-12` — biblioteca de 12 colunas),
com **quatro widgets fixos**, da esquerda para a direita:

| # | Widget | Classe raiz | Conteúdo real |
|---|---|---|---|
| 1 | **Hoje** | `task-list-component` | Lista de tarefas em 4 grupos recolhíveis: **Sem horário**, **Com horário**, **Finalizadas**, **Atrasadas** (badge de contagem por grupo). Vazio: ícone de calendário cortado + "Não há tarefas para exibir". Tem seta própria que recolhe/expande o widget (não confundir com a seta do rail). |
| 2–4 | **Três KPIs** (ex.: "Net New", "New MRR", "Saldo") | `panel white-content widget-hover`, 4/12 do grid cada | Cabeçalho com nome + **seletor de mês próprio** (`title="header-date-picker"`, `ds-button small_30 SOFT`, 76×30) — cada KPI filtra seu próprio período, não é um filtro único da tela. Corpo: dois pares valor absoluto + variação percentual, e uma **barra de meta** (`goal-bar`) sempre visível (não é skeleton — ver tabela acima). |
| 5 | **Publicações** | `.widgets-component` | Feed social: campo "Nova publicação…" + posts com avatar, autor, timestamp e corpo rico (emoji, formatação). |
| 6 | **Atividades** | `.widgets-component --interaction-history-header` | Timeline vertical: avatar 28×28, ícone por tipo de interação (`.activity-icon`, círculo com fundo neutro), remetente, timestamp, tipo (E-mail, etc.), prévia do corpo, link "Visualizar", contagem de comentários, data. |

Os quatro compartilham o cabeçalho de widget documentado acima (altura 50, raio `10px 10px 0 0`,
borda `1px solid rgba(27,16,44,.1)`) e o corpo com raio 10px — **exceto Hoje**, que usa 15px
(ver a inconsistência registrada acima).

**Resolvido na segunda passagem de 05/08:** a dúvida sobre o contador do sino aparecer vermelho
estava errada — foi leitura equivocada de screenshot comprimido. Medidos os três contadores da
barra (**e-mail**, **sino** e **agenda**), todos são `.component__counter-badge` **amarelo**
`rgb(255,192,26)` = `#FFC01A`, texto `rgb(18,18,18)`, 17 × 16, raio 2px, 10px/700. **Não existe
contador vermelho na barra superior.** Vermelho (`danger`) aparece no Painel, mas como fundo da
linha "Atrasadas" do widget Hoje (`rgba(242,39,39,.05)`), não como contador.

**Também em aberto:** `/Deals/all/funnel` redireciona para `/Deals/all/table` (mesmo
redirecionamento que já valia para `/Deals/table`) — a URL do Kanban com um funil real não foi
localizada nesta rodada.

### O grid é `grid-stack gs-12`, com respiro de 8px por item

Medido em 05/08. O Painel tem **duas zonas**, e só a segunda é grid:

- **Coluna fixa "Hoje"** — `task-list-component`, **400px** de largura em x=210 (15px depois do
  rail expandido), **fora** do grid.
- **`grid-stack gs-12`** — começa em x=617, `margin: -8px 0`. Cada `.grid-stack-item` tem **8px
  de padding** até o `.grid-stack-item-content`, então o **respiro visível entre widgets é 16px**
  (8 + 8), não um `gap` declarado.

| Bloco | Item (com respiro) | Conteúdo (a caixa visível) |
|---|---|---|
| KPI | 430 × 192 | **414 × 176** |
| Publicações / Atividades | 645 × 768 | **629 × 752** |

Três KPIs em x = 617 · 1047 · 1477 (passo 430); os dois widgets grandes em x = 617 · 1262
(passo 645). Ambas as linhas somam **1274px** de conteúdo — é assim que as colunas se alinham.
Ao reproduzir sem a biblioteca de grid, use `gap: 16px` com as larguras de **conteúdo** (414 e
629), não as do item.

### Cartão de KPI, por dentro

O erro do primeiro mockup foi empilhar os dois valores em linhas separadas e pintar o negativo de
vermelho. **Nenhuma das duas coisas acontece no produto.**

| Elemento | Medida | Detalhe |
|---|---|---|
| `.panel` | 412 × 174 + borda 1px (= 414 × 176 de caixa) | raio **10px**, fundo branco |
| Cabeçalho `.white-content.b-b-1` | 412 × **50**, `padding: 5px 15px` | `border-bottom: 1px solid rgba(24,21,38,.1)`, raio `10px 10px 0 0` |
| ↳ `.move-goal-card` | 382 × 39, `gap: 5px`, **`justify-content: space-between`** | |
| ↳ título | **13px peso 600**, `rgb(27,16,44)`, largura máx. 50% | `ellipsis` |
| ↳ seletor de mês | **89,3 × 30**, `padding: 0 5px`, raio 5px | ⚠️ é botão **legado** (`.button.button-white-no-border.button-short`), **13px peso 500**, e a `border` é **branca sobre fundo branco** — ou seja, **não tem anel visível**. Não desenhe um anel cinza aqui. |
| Corpo `.wrapper.min-height-85` | 412 × 124, `padding: 15px` | contém um `div` com `padding: 15px 0 0` |
| ↳ `.hbox.goal-numbers` | 382 × **20**, **`justify-content: space-between`** | ⚠️ **os dois valores ficam na MESMA linha**, um em cada ponta |
| ↳ valor da esquerda / da direita | **14px peso 400**, cor **`rgb(51,51,51)`** | ⚠️ **o valor negativo NÃO é vermelho** — é o mesmo cinza-escuro do positivo |
| ↳ `.gap-5` | 382 × **5** | espaçador entre números e barra |
| ↳ `.progress.goal-bar` | 382 × **30**, raio **3px** | trilha `rgba(24,21,38,.05)` |
| ↳ `.progress-bar` (preenchimento) | largura proporcional à meta | **`rgb(93,179,113)` = `#5DB371` — VERDE**, com `box-shadow: inset 0 -1px 0 0 rgba(0,0,0,.15)`. Não é azul. Nesta conta as três barras estão em **0** (vazias). |

> **O verde da barra de meta não tem token.** `#5DB371` não é o `--color-success` `#3BDDAD` nem
> nenhum outro token do pacote — é valor aferido. Já constava na lista de divergências e agora
> está confirmado ao vivo com o seletor exato.

### Item de Atividades: ícone fora, cartão flutuante, setinha

Não é uma lista de texto numa timeline — é um **cartão com sombra difusa**, com o ícone **fora**
dele e uma **seta triangular** ligando os dois.

| Elemento | Medida | Detalhe |
|---|---|---|
| `aside.activity-history` (coluna do ícone) | **40,5px** de largura | fica à esquerda do cartão |
| ↳ círculo do ícone | **27 × 27**, raio **100%** | fundo **`rgb(24,159,201)` = `#189FC9`** ⚠️ (ciano — **não** é o `#1A94FF` do `confirmation`), sombra `rgba(0,0,0,.1) 1.5px 1.5px 1.5px 0` |
| ↳ ícone dentro | `i.fal.activity-icon.fa-envelope`, **15px**, branco | Font Awesome, muda com o tipo de interação |
| `.history-arrow.arrow-style` | **8 × 16** | seta triangular feita com borda CSS (`border-bottom: 8px solid transparent`), aponta do ícone para o cartão |
| `.timeline-bubble` (o cartão) | largura fluida × altura pelo conteúdo | raio **10px**, fundo branco, **`box-shadow: rgba(0,0,0,.09) 0 0 20px 0`** — sombra difusa e **sem borda**; `margin-top: 5px` |
| ↳ `.bubble-wrapper` | `padding: 10px 15px` | |
| ↳ `aside.width-40` | 40px | avatar **28 × 28**, raio 100%, `margin: 4px 3px 0 0` |
| ↳ nome | **13px peso 600**, `rgb(51,51,51)` | `a.font-bold.inline-link-regular` |
| ↳ `.timeline-clock` (hora) | **11px peso 400**, `rgb(151,151,151)` = `#979797` | precedido de `i.fal.fa-clock` de **11px** |
| ↳ corpo | 13px/400, blocos com `margin-top: 3px` (`.mtop3`) | |
| ↳ rodapé de meta | cada item com **`margin-right: 15px`** | "Visualizar" e o e-mail em **15px/400 `#898791`**; contagem de comentários em **13px/400 `#979797`**; a data em **12px/400 `#979797`** com `i.fal.fa-calendar` de 12,3px |

> **A sombra do cartão da timeline é a exceção que confirma a regra.** O DS é plano e usa borda
> em superfície de página — mas este cartão **flutua** sobre a timeline, então leva sombra
> (`0 0 20px` a 9%, difusa e sem deslocamento) e **nenhuma borda**. É camada flutuante, não
> superfície de página. Ver a seção "Sombra: borda XOR sombra" no `SKILL.md`.

### Rail expandido: os 9 itens, o indicador e o badge

| Elemento | Medida | Detalhe |
|---|---|---|
| Item (`button.ds-button-container`) | **175 × 40** em x=10, `padding: 0 10px`, raio 5px | fundo **transparente** — inclusive o ativo |
| Passo vertical | **50px** exato (y = 20, 70, 120, …) | 40 de item + 10 de respiro |
| Wrapper do ícone | **35 × 15** em x=20 | ícone **25 × 15** dentro |
| Rótulo | x=55, **15px peso 300**, `#FBF8FE`, `line-height 21,4px` | **família `Inter`** (não Source Sans Pro) — e o Inter **carrega** nesta sessão |
| Rótulo do item **ativo** | **15px peso 500** | muda o peso, não a cor |
| **Indicador do ativo** | `div` **separado** (irmão), **195 × 40**, `margin-left: -20px` → começa em x=**-10** | `linear-gradient(102.35deg, #7D33E6 0%, #431188 100%)`, raio 5px, sombra `rgba(0,0,0,.14) 0 4px 5px 0, …` (4dp) |
| Badge "Beta" / "IA" | **36 × 20** em x=134, raio **2px**, `padding: 1px 4px 0`, `gap: 2px` | fundo **`#5916B6`**, texto `#FBF8FE` **12px peso 500** |

> **O indicador do item ativo não é `background` do botão.** O botão em si é transparente; o
> gradiente vive num `div` irmão que **sangra 20px à esquerda** (`margin-left: -20px`), passando
> por baixo do padding do rail. Pintar o fundo do próprio botão dá um retângulo que começa em
> x=10 em vez de x=-10, e a diferença aparece de imediato.

Os 9 itens, na ordem: **Operação** (ativo, `fas gauge-simple-high`, badge "Beta") · Resumo
(`fal gauge-simple-high`) · Clientes (`address-card`) · Processos (`sliders`) · Documentos
(`file-lines`) · Produtos (`box-dollar`) · Relatórios (`chart-bar`) · Biblioteca
(`graduation-cap`, badge "IA") · Administração (`gear`).

### Barra superior e sub-cabeçalho, por dentro

| Elemento | Medida |
|---|---|
| `horizontal-menu > div` | 50px de altura, `padding: 0 7.5px`, `gap: 10px`, **`justify-content: space-between`**, fundo branco, `border-bottom: 1px solid rgba(27,16,44,.1)`, raio `5px 0 0` |
| ↳ grupo esquerdo | x=203, `gap: 10px` — o "+" (35 × 35) e a busca (300 × 35) |
| ↳ grupo direito | x=1324 — exportação, pílula da IA, os cinco ícones e o botão de usuário |
| `.operation-header-component` | 40px, `padding: 0 15px`, `space-between`, fundo branco, `border-bottom: 1px solid rgba(27,16,44,.05)` — **metade da opacidade da barra acima** |
| ↳ seletor de painel | 135,3 × 30, texto **14px peso 600** |
| ↳ "Menu" | botão 104,4 × 30, raio 5, `padding: 0 5px`, `gap: 5px`, texto 14px/400 |
| ↳ "Customizar" | 114,8 × 30, **`--disabled`: `opacity: .3` no botão inteiro** — não é um tom de texto mais claro |

## O app tem DOIS sistemas de botão — e a tela decide qual

Isto é o que mais faz uma tela reproduzida parecer errada. As folhas do sistema legado
(`main.min.css`, 2,36 MB) foram resgatadas em 04/08 e trazem **105 classes `.button-*` distintas**
em 1207 regras, contra 3 variantes × 6 cores do DS novo.

| | DS novo (`ds-button`) | Legado (`.button`) |
|---|---|---|
| **Telas** | barra superior, sub-cabeçalho, cartões e widgets do Painel, rail | **Funil**, **Negócio**, tabela, formulários, timeline |
| Altura | 25 / 30 / 35 / 40 pela classe de tamanho | **31,5px** (e 25,5px com `.button-short`) |
| Padding | `0 5px` a `0 10px` | `5px 10px` (2px 10px na curta) |
| Anel/borda | `box-shadow: inset 0 0 0 1px` — **nunca `border`** | **`border: 1px solid`** de verdade |
| Peso da fonte | 400 (600 em `ACTION` e selecionado) | **500** em todos |
| Tamanho | 13px no botão, 14px no texto | **13px**, `line-height: 1.5` (19,5px) |
| Transição | `all` | `background-color .3s` |

**Se o pedido é "tela de Funil" ou "tela de Negócio", use o legado. Se é "Painel", use o DS.**
Trocar os dois é o erro mais visível possível.

### `.button` base do legado

```css
.button { padding: 5px 10px; border-radius: 5px; border: 1px solid; font-size: 13px;
          font-weight: 500; line-height: 1.5; display: inline-block; text-align: center;
          transition: background-color .3s; }
```

13 × 1,5 = 19,5 + 10 de padding + 2 de borda = **31,5px** de altura. É de onde vem o número.

Exceção: **`a.button`** (âncora, não `<button>`) é sobrescrito para convergir com o DS —
`display: flex`, `height: 35px`, `padding: 0 5px`, `border: none`, fundo transparente, raio 5px, e
**`:focus-visible` com `background: rgba(24,21,38,.05)`** — o único indicador de foco do app inteiro.

### Variantes legadas, com estados

| Classe | Base | `:hover` | `:active` |
|---|---|---|---|
| `.button-action` (primário) | `#1A94FF`, texto `#FFF`, borda igual | `#2B88DA` | `#247ECC` |
| `.button-delete` | `#F22727` | `#CB3939` | `#BF3232` |
| `.button-success` | `#0AA95A` | `#217E50` | `#1C6E45` |
| `.button-warning` | `#FFB900` | `#C79A23` | `#B68D20` |
| `.button-brand` | `#7625E4` | `#6C1BDA` (`!important` vence) | `#6319C7` |
| `.button-white-no-border` | `#FFF`, texto `#333`, borda `#FFF` | `#F5F5F5` | `#EBEBEB` |
| `.button-white-light-border` | `#FFF`, borda `rgba(23,22,38,.1)` | `#F5F5F5`, ou `rgba(27,16,44,.05)` onde há `!important` | `#EBEBEB` / `rgba(27,16,44,.1)` |
| `.button-neutral` | `#A1A1A9` chapado, texto `#FFF` | — | — |
| `.button-neutral-gray` | texto `#333` peso 600 | `rgba(24,21,38,.1)` | `rgba(24,21,38,.15)` |

> **O primário do legado é azul, não roxo.** `.button-action` = `#1A94FF` chapado com borda da
> mesma cor. Um "Salvar" ou "Nova Oportunidade" em roxo de marca não existe nessas telas.

> **Três roxos de marca coexistem no produto:** `#7625E4` (`.button-brand` legado), `#7D33E6`
> (rail e `ACTION.brand` do app) e `#7E33E6` (o token `--color-brand`). Nenhum é erro de medição.

**Os hovers do legado não seguem os tokens `level_1`.** `.button-action:hover` = `#2B88DA`, mas
`confirmation-level_1` = `#33A0FF`. Onde o legado já foi migrado, aparece `#33A0FF!important` — a
migração está a meio caminho, regra por regra.

### Geometria por classe modificadora

| Classe | Efeito |
|---|---|
| `.button-short` | `padding: 2px 10px` → altura **25,5px** |
| `.button-big` | `padding: 7px 12px` |
| `.button-small` | `padding: 4px 5px` |
| `.button-very-small` | `padding: 1px 4px` |
| `.button-super-small` | `padding: 0 4px` |
| `.button-very-big` | `padding: 10px 16px` |
| `.button-wide` | `padding: 5px 30px` |
| `.button-height` | `padding: 16px 15px` |
| `.button-rounded` | raio **7px** (não existe na escala do pacote) |
| `.button-very-rounded` / `.button-circle` | raio 50% / 100% |
| `.button-square` | raio 0 |
| `.button-full-width` | `width: calc(100% - 12px)` |

### Tipografia do legado — a escala real

| Classe | Tamanho / peso / `line-height` | Cor |
|---|---|---|
| `.font-big` | 15px / 400 / 21,43 | `#333` |
| `.font-semi-big` | 14px / 400 / 21 | `#333` |
| `.font-regular-size` | 13px / 600 / 19,5 | herda |
| `.font-regular-weight` | 13px / **500** / 19,5 | `#333` |
| `.text-muted` | 13px / 400 / 18,57 | `#979797` |
| `.text-neutral` | 13px / **900** / 13 | `#8B8495` |
| `.text-action` | 13px / **500** / 19,5 | `#1A94FF` |
| `.text-warning` | 15px / **300** / 15 | `#FFB900` |
| `.dropdown-subtitle` | 14px / 600 / 20 | `#333` |
| `.timeline-clock` | 11px / 400 / 15,71 | `#979797` |
| `.data-edit` (campo inline) | **12,5px** / 400 / 17,86 | `#333` |

Pesos **500** e **900** e o tamanho **12,5px** não existem na escala do pacote.

### Ícones: os codepoints

Todo ícone do legado é `<i class="fa? fa-nome">` com o glifo em `::before`. Medidos:

| Classe | Codepoint | Peso | Tamanho | Cor |
|---|---|---|---|---|
| `fas fa-search` | **U+F002** | 900 | 13px | `#8B8495` |
| `fal fa-eye` | **U+F06E** | 300 | 13px | `#1A94FF` |
| `fal fa-angle-down` | **U+F107** | 300 | 15px | `#333` |

O prefixo é o peso: `fal` = 300, `far` = 400, `fas` = 900. As rodadas mais recentes confirmam
**ao menos dois pesos** no chrome (`fal` e `fas`); `far` apareceu em captura anterior e pode ser
carregado sob demanda.

> **Reconfirmado e corrigido em 05/08/2026** (chrome-devtools MCP): nesta sessão o app carregou
> Font Awesome 6 Pro em **300 (`fal`) e 900 (`fas`)** — não achei `far`/400 carregado desta vez;
> pode ser porque nenhum ícone `far` apareceu nas telas visitadas, não que ele tenha sumido do
> app. **E o Inter do menu de módulos carregou de verdade** (`document.fonts` trouxe Inter
> 300/400/500 como `loaded`) — o registro anterior de "Inter não carrega, renderiza em sans-serif
> do sistema" pode estar desatualizado; reconfira antes de assumir um ou outro.

## Ícones reais do rail e da barra superior — Font Awesome 6 Pro, path exato

**Confirmado em 05/08/2026, ao vivo: nenhum ícone do rail ou da barra superior é lucide.**
Tudo é Font Awesome 6 Pro (`svg-inline--fa`, atributos `data-icon`/`data-prefix`), a mesma família
do sistema legado — a única diferença é o prefixo de peso. Isso vale **inclusive** para os
`ds-button__icon-button-wrapper` do design system novo: o `Icon` do storybook pode declarar lucide
como padrão, mas **o app em produção, nesta captura, não usa lucide em nenhum ícone medido** —
mais uma divergência do tipo "o pacote declara X, o app roda Y" (mesmo padrão da fonte).

**Regra prática ao gerar mockup fiel:** use os paths abaixo (copiados do DOM, `viewBox` e `d`
reais) em vez de desenhar ícone à mão ou usar lucide. Se precisar de um ícone que não está aqui,
o nome Font Awesome equivalente (ex. `fa-envelope`, `fa-bell`) geralmente existe no catálogo
gratuito ou Pro — não invente path.

**Rail — ordem exata dos 8 itens** (`aside.td-quickly`, sem logo no topo — primeiro item já é
"Resumo" em y=20):

| Item | `data-icon` | Estado | viewBox |
|---|---|---|---|
| Resumo (ativo nesta captura) | `gauge-simple-high` | **`fas`** (sólido, 900) quando ativo | `0 0 512 512` |
| Resumo (inativo) | `gauge-simple-high` | `fal` (contorno, 300) quando inativo | `0 0 512 512` |
| Clientes | `address-card` | `fal` | `0 0 576 512` |
| Processos | `sliders` | `fal` | `0 0 512 512` |
| Documentos | `file-lines` | `fal` | `0 0 384 512` |
| Produtos | `box-dollar` | `fal` | `0 0 448 512` |
| Relatórios | `chart-bar` | `fal` | `0 0 512 512` |
| Biblioteca | `graduation-cap` | `fal` | `0 0 640 512` |
| Administração | `gear` | `fal` | `0 0 512 512` |
| Seta de recolher/expandir (rodapé) | `arrow-left-long` | `fal`, cor `#7D33E6` | `0 0 512 512` |

> **O item ativo troca de família de ícone, não só de cor.** `gauge-simple-high` inativo é
> **`fal`** (contorno); ativo é **`fas`** (sólido/preenchido) — são dois desenhos SVG diferentes
> para o mesmo ícone, não o mesmo path recolorido. Reproduzir só com `currentColor` diferente
> erra a forma do ícone ativo.

Paths completos (`<path d="…">`, copiar como está):

```
Resumo ativo (fas gauge-simple-high, 0 0 512 512):
M0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm320 96c0-15.9-5.8-30.4-15.3-41.6l76.6-147.4c6.1-11.8 1.5-26.3-10.2-32.4s-26.2-1.5-32.4 10.2L262.1 288.3c-2-.2-4-.3-6.1-.3c-35.3 0-64 28.7-64 64s28.7 64 64 64s64-28.7 64-64z

Resumo inativo (fal gauge-simple-high, 0 0 512 512):
M256 32a224 224 0 1 1 0 448 224 224 0 1 1 0-448zm0 480A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-192a32 32 0 1 1 0 64 32 32 0 1 1 0-64zm0 96c35.3 0 64-28.7 64-64c0-18.6-7.9-35.3-20.5-47l82.6-153.4c4.2-7.8 1.3-17.5-6.5-21.7s-17.5-1.3-21.7 6.5L271.3 289.8c-4.9-1.2-10-1.8-15.3-1.8c-35.3 0-64 28.7-64 64s28.7 64 64 64z

Clientes (fal address-card, 0 0 576 512):
M512 64c17.7 0 32 14.3 32 32l0 320c0 17.7-14.3 32-32 32L64 448c-17.7 0-32-14.3-32-32L32 96c0-17.7 14.3-32 32-32l448 0zM64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l448 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64L64 32zm96 160a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm96 0a64 64 0 1 0 -128 0 64 64 0 1 0 128 0zM112 368c0-26.5 21.5-48 48-48l64 0c26.5 0 48 21.5 48 48c0 8.8 7.2 16 16 16s16-7.2 16-16c0-44.2-35.8-80-80-80l-64 0c-44.2 0-80 35.8-80 80c0 8.8 7.2 16 16 16s16-7.2 16-16zM352 160c-8.8 0-16 7.2-16 16s7.2 16 16 16l128 0c8.8 0 16-7.2 16-16s-7.2-16-16-16l-128 0zm0 64c-8.8 0-16 7.2-16 16s7.2 16 16 16l128 0c8.8 0 16-7.2 16-16s-7.2-16-16-16l-128 0zm0 64c-8.8 0-16 7.2-16 16s7.2 16 16 16l128 0c8.8 0 16-7.2 16-16s-7.2-16-16-16l-128 0z

Processos (fal sliders, 0 0 512 512):
M0 416c0 8.8 7.2 16 16 16l65.6 0c7.4 36.5 39.7 64 78.4 64s71-27.5 78.4-64L496 432c8.8 0 16-7.2 16-16s-7.2-16-16-16l-257.6 0c-7.4-36.5-39.7-64-78.4-64s-71 27.5-78.4 64L16 400c-8.8 0-16 7.2-16 16zm112 0a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zM304 256a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm48-80c-38.7 0-71 27.5-78.4 64L16 240c-8.8 0-16 7.2-16 16s7.2 16 16 16l257.6 0c7.4 36.5 39.7 64 78.4 64s71-27.5 78.4-64l65.6 0c8.8 0 16-7.2 16-16s-7.2-16-16-16l-65.6 0c-7.4-36.5-39.7-64-78.4-64zM192 144a48 48 0 1 1 0-96 48 48 0 1 1 0 96zm78.4-64C263 43.5 230.7 16 192 16s-71 27.5-78.4 64L16 80C7.2 80 0 87.2 0 96s7.2 16 16 16l97.6 0c7.4 36.5 39.7 64 78.4 64s71-27.5 78.4-64L496 112c8.8 0 16-7.2 16-16s-7.2-16-16-16L270.4 80z

Documentos (fal file-lines, 0 0 384 512):
M320 480L64 480c-17.7 0-32-14.3-32-32L32 64c0-17.7 14.3-32 32-32l128 0 0 112c0 26.5 21.5 48 48 48l112 0 0 256c0 17.7-14.3 32-32 32zM240 160c-8.8 0-16-7.2-16-16l0-111.5c2.8 .7 5.4 2.1 7.4 4.2L347.3 152.6c2.1 2.1 3.5 4.6 4.2 7.4L240 160zM64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-284.1c0-12.7-5.1-24.9-14.1-33.9L254.1 14.1c-9-9-21.2-14.1-33.9-14.1L64 0zm48 256c-8.8 0-16 7.2-16 16s7.2 16 16 16l160 0c8.8 0 16-7.2 16-16s-7.2-16-16-16l-160 0zm0 64c-8.8 0-16 7.2-16 16s7.2 16 16 16l160 0c8.8 0 16-7.2 16-16s-7.2-16-16-16l-160 0zm0 64c-8.8 0-16 7.2-16 16s7.2 16 16 16l160 0c8.8 0 16-7.2 16-16s-7.2-16-16-16l-160 0z

Seta rodapé rail (fal arrow-left-long, 0 0 512 512):
M4.7 244.7c-6.2 6.2-6.2 16.4 0 22.6l144 144c6.2 6.2 16.4 6.2 22.6 0s6.2-16.4 0-22.6L54.6 272 496 272c8.8 0 16-7.2 16-16s-7.2-16-16-16L54.6 240 171.3 123.3c6.2-6.2 6.2-16.4 0-22.6s-16.4-6.2-22.6 0l-144 144z
```

`Produtos` (`box-dollar`), `Relatórios` (`chart-bar`), `Biblioteca` (`graduation-cap`) e
`Administração` (`gear`) também foram capturados com path completo, omitido aqui só por
espaço; se precisar do path exato, releia o DOM do app ou gere um subset novo a partir das
webfonts do Font Awesome que o app carrega.

**Barra superior** (capturados em `/Deals/all/table`, mesma família):

| Ícone | `data-icon` | `data-prefix` | viewBox | Onde |
|---|---|---|---|---|
| Criar ("+") | `plus` | `fal` | `0 0 448 512` | botão de 35×35 antes da busca |
| Busca | `magnifying-glass` | `fal` | `0 0 512 512` | dentro do `GeneralSearch-component` |
| E-mail | `envelope` | `fal` | `0 0 512 512` | ícone de 35×35 |
| Notificações | `bell` | `fal` | `0 0 448 512` | ícone de 35×35, contador amarelo sobreposto |
| Chat | `comment-lines` | `fal` | `0 0 512 512` | ícone de 35×35 |
| Agenda | `calendar-days` | `fal` | `0 0 448 512` | ícone de 35×35, contador amarelo sobreposto |
| Suporte/ajuda | `user-headset` | `fal` | `0 0 448 512` | ícone de 35×35 (não documentado antes) |
| Exibir (dropdown do widget) | `eye` | `fal` | — | usado também em botão de opções |
| Filtros | `filter` | `fal` | — | dropdown "Ações de filtros" |
| Configurações (botão de opções) | `cog` | `fal` | — | `.button-white-no-border` |
| Sucesso/exportação concluída | `circle-check` | `fas` | `0 0 512 512` | ícone **contextual**: só aparece quando uma exportação acabou de terminar (`.exportation-icon__finished`), antes da pílula "Ploomes IA" — não é permanente, não inclua em toda tela |

O path completo de cada um não está transcrito aqui; leia o SVG inline direto do DOM do app quando precisar dele.

### Tamanho e cor de cada ícone — a régua que mais erra no olho

Medido na segunda passagem de 05/08/2026. **A altura é o que está travado (13–15px); a largura
varia com o `viewBox` de cada ícone.** Nenhum ícone da barra tem 16, 18 ou 20px — desenhar nesses
tamanhos engorda a barra inteira, e é o desvio mais visível depois de errar a família do ícone.

| Ícone | Tamanho medido | Cor | Token |
|---|---|---|---|
| `plus` ("+") | **13,1 × 15** | `rgb(26,148,255)` | `--color-confirmation` |
| `magnifying-glass` | **14 × 14** | `rgb(27,16,44)` | `--color-font` |
| `upload` (exportação) | **15 × 15** | `rgb(26,148,255)` | `--color-confirmation` |
| `circle-check` (exportação concluída) | **10 × 10** | `rgb(59,221,173)` | `--color-success` / `confirmation_alt` |
| `envelope` | **15 × 15** | `rgb(27,16,44)` | `--color-font` |
| `bell` | **13,1 × 15** | `rgb(27,16,44)` | `--color-font` |
| `comment-lines` | **15 × 15** | `rgb(27,16,44)` | `--color-font` |
| `calendar-days` | **13,1 × 15** | `rgb(27,16,44)` | `--color-font` |
| `user-headset` | **13,1 × 15** | `rgb(27,16,44)` | `--color-font` |
| `chevron-down` (dropdown do usuário) | **10 × 10** | `rgb(139,132,149)` | `--color-font-level_2` (≈`#8B8495`) |
| Ícone de item do rail | **25 × 15**, wrapper **35 × 15** | inativo `rgb(135,131,141)` `#87838D` · ativo `rgb(255,255,255)` | — |
| Seta do rodapé do rail | **19 × 15** | `rgb(251,248,254)` `#FBF8FE` | — |

**Passo horizontal da barra:** os ícones soltos ficam em x = 1509 · 1555 · 1599 · 1645 · 1690 —
**~45px de passo** com alvo de 35 × 35 (10px de respiro). O "+" está em x=203 e a busca começa em
248, também 45 de passo.

**O contorno do "+" e o dos outros não é o mesmo.** O "+" é `SOFT_TO_ACTION --outline`: fundo
**`#FFFFFF` chapado** e anel `box-shadow: rgba(27,16,44,.1) 0 0 0 1px inset`, `border: 0px none`.
Os ícones soltos (e-mail, sino, chat, agenda, suporte) são `SOFT`: **fundo transparente e nenhum
anel** em repouso. Igualar os dois é erro visível.

**Botão da IA:** o ícone é `<img src="https://app.ploomes.com/assets/images/ai-assistant-logo.svg">`
— confirma que é imagem, não SVG de biblioteca (já registrado acima, na seção "Botão da IA").

## Tabela (`/Deals/all/table`)

`/Deals/table` redireciona para `/Deals/all/table`. A grade leva ~5s a montar.

| Elemento | Medida | Tipografia | Observação |
|---|---|---|---|
| Wrapper (`.dynamic-table-wrapper`) | 1614 × 669 em (306,90), padding **`5px 10px`** | — | |
| `table` | **2859px** de largura em viewport de 1920 | — | rola na horizontal; classes `.table-reorder .table-hover .white-table-with-header` |
| `thead tr` | altura **43** | — | `#FFF`, `border-bottom: 1px solid rgba(24,21,38,.1)` |
| Cabeçalho (`th.small-cell`) | altura **43**, padding **`12px 15px`** | 13px **peso 500**, cor `#898791` | divisória inferior `1px solid #EAECEC`; **`vertical-align: bottom`** |
| Linha do corpo (`tr`) | altura **41** | 13px peso 400 | `#FFF`, **sem borda própria** |
| Célula (`td`) | padding **0** | 13px | `border-top: 1px solid transparent`; o recuo mora num invólucro dentro da `td` |
| Coluna de opções | **48,5px**, à direita | — | `border-top` vira `#EAECEC` da 2ª linha em diante |
| Ícone de edição inline | **20 × 20** | — | `#FFF`, raio **3px**, cor `#898791`, `display: flex` |
| Célula de destaque | altura 22 | 13px **peso 600**, `#8B8495` | `.text-darkest-neutral.font-bold` |
| Paginação | 408 × 30 | raio **4px** | 13px |

Larguras de coluna medidas: 150 · 250 · 180 · 262 · 161 · 250 — definidas por conteúdo, não por
grade fixa.

**A tabela do produto não tem régua entre as linhas do corpo.** A divisória existe uma vez só, sob
o cabeçalho; o efeito de separação entre linhas vem do `border-top: 1px solid transparent` da `td`,
que só ganha cor na coluna de opções. Debruar cada linha engorda a tabela e não é o que o app faz.

> **Correção da rodada 06/08:** o build atual contém hovers de tabela coexistentes. Regras vendor
> usam `#F5F5F5`; seletores Ploomes e listas de ação também usam `#F4F3F4`. A conclusão anterior
> de que `.table-hover` seria necessariamente uma classe morta não vale para o build atual.
> Confira qual seletor casa com a tabela reproduzida antes de escolher o fundo.

## Funil (Kanban)

Tela do **sistema legado** — botões, tipografia e campos seguem a seção acima, não o `ds-button`.

**A coluna é fluida com piso.** A coluna é `aside.min-width-250`: em viewport de 1920 mede
**309,8px** (útil 278,8 + 31 de padding lateral); em 690 cai para o piso de **250** (útil 219,2).
O que é estável: `min-width: 250px`, o padding lateral (~31px), o primeiro x = **70** (rail 55 + 15)
e a altura de 52px do cabeçalho de etapa.

| Elemento | Medida (viewport 1920) | Raio | Observação |
|---|---|---|---|
| Coluna (`aside.min-width-250`) | **309,8** de largura | — | fundo **`#F4F3F4`**; `min-width: 250px` é o piso — daí a coluna encolher para 250 em viewport estreito |
| **Cabeçalho de etapa** (`.stage-wrapper.height-52`) | **309,8 × 52**, padding **`5px 15px 7px`** | 0 | fundo **`#F4F3F4`**, largura cheia da coluna, `b-b-1` + `b-r-1` (borda inferior e direita `rgba(24,21,38,.05)`) |
| ↳ limitador de texto (`.deal-stage-limiter`) | 278,8 × 40, `position: absolute`, y=95 | 0 | sem fundo; é só o clipe do título dentro do wrapper |
| ↳ título | 278,8 × 21,4 | — | `.font-big` **15px/400**, `#333`, `ellipsis` + `nowrap` |
| ↳ subtítulo (valor + contagem) | 278,8 × 18,6 | — | `.text-muted` **13px/400**, **`#979797`** |
| **Cartão de negócio** (`a.deal`) | **292,8 × 90,3**, `margin: 0 0 10px` | **5px** | `#FFF`, borda **`1px solid rgba(24,21,38,.1)`**, sombra `rgba(0,0,0,.05) 2px 2px 2px` |
| ↳ `:hover` / `:active` | — | — | `rgba(27,16,44,.05)` / `rgba(27,16,44,.1)` — os mesmos `neutral-level_1/2` do DS |
| ↳ **cartão ganho** (`.won-deal`) | idem | 5px | fundo **`#B7FBD9`**, borda `0 solid #76E6AE` |
| Passo vertical entre cartões | **100px** | — | 90,3 de cartão + 10 de margem |
| Corpo do cartão (`aside.deal-details`) | 233,8 × 45,7, padding `5px 8px` | — | `display: table-cell`; cabem duas linhas, não três |
| Coluna de ações (`aside.deal-actions`) | **45** × 45,7, padding `5px 8px` | — | `table-cell`, `vertical-align: middle` |
| Nome do cliente (`.contact-name-deal`) | altura 17,1 | — | **12px**/17,14, **`#979797`**, `nowrap` + `ellipsis` |
| Faixa de marcadores (`.deal-elements-bg`) | 290,8 × **27,6** | — | `overflow: hidden auto` |
| Marcador (`.deal-element`) | 35,1 × 19,7, `margin-left: 10px` | 0 | 12px, `#A1A1A9` |
| Dias inativos (`.inactive-days`) | 35,1 × 19,7, padding `1px 5px` | **3px** | `rgba(24,21,38,.05)`, borda `1px solid rgba(24,21,38,.1)`, **11px peso 600** |
| **Barra de evolução** (`.deal-evolution`) | 290,8 × **3px** | **`0 0 5px 5px`** | trilha transparente, `overflow: hidden` |
| ↳ preenchimento (`.action-content.height-3`) | largura **proporcional ao avanço** | 0 | **`#1A94FF`** |
| Busca da tela (`input-group`) | campo 90 × 30 + botão 34,6 × 30 | `3px 0 0 3px` / `0 5px 5px 0` | campo em **`#F4F3F4`**, 14px peso 500; botão `rgba(27,16,44,.05)`; lupa `fas` peso 900 |

**A barra de 3px no pé do cartão codifica valor** — mesmo padrão do indicador do Painel. Faixa
chapada erra o componente.

A sombra do cartão é de **uma camada só** e muito leve. Os tokens `--shadow-*dp` do pacote são
todos de três camadas e bem mais densos: usar `1dp` aqui pinta o cartão com peso visual que a
tela não tem.

## Negócio (`/deal/<id>`)

Também legado. É a tela com mais densidade de formulário do produto.

| Elemento | Medida | Raio | Observação |
|---|---|---|---|
| Cabeçalho de seção (`.flex-section-header`) | 483,5 × **42,4**, padding **`10px 15px`** | **0** | fundo **`#FAFAFB`** (= `background-level_1` ✅), `uppercase`, 13px/400, **`align-items: baseline`**, `border-bottom: 1px solid rgba(27,16,44,.1)`. ⚠ **A altura não é fixa:** sai do filho mais alto + 20 + 1. Os 42,4 valem porque o lado direito é um flex de ícones de 21,4; com só texto de 13px dá **39,6**. Não fixe `height`. |
| Coluna lateral (`aside.width-500`) | **500px**, padding `5px 8px` | — | fundo `#FAFAFB`, `border-right: 1px` |
| Barra de abas (`ul.nav-tabs`) | altura **40** | 0 | `#FFF`, `border-bottom: 1px solid rgba(24,21,38,.1)` |
| Contador de aba (`.tabs-counter`) | 19 × 17,7 | **100%** | `#F4F3F4`, borda `1px solid rgba(27,16,44,.1)`, **11px peso 600**, `#8B8495` |
| Campo (`textarea.form-control`) | altura 55, padding `6px 30px 6px 12px` | **4px** | `#FFF`, borda `1px solid rgba(27,16,44,.1)`, 14px **peso 500**; **`:focus` → `border-color: #1A94FF`** |
| Campo editável inline (`.data-edit`) | altura 24, padding `0 30px 2px 0` | 3px | transparente, borda transparente, **12,5px** |
| Ícone de edição (`.inline-edit-icon`) | **20 × 20** | 3px | `#FFF`, `#898791` |
| Bolha da timeline (`.timeline-bubble`) | altura variável, `margin-top: 5px` | **10px** | `#FFF` |
| Avatar da timeline | **18 × 18** ou **28 × 28** | **100%** | dois tamanhos, conforme o nível |
| Checkbox redondo (`.round-checkbox`) | 27 × 27 | — | |
| Botão "Perder" (`.button-neutral`) | 58 × **31,5** | 5px | `#A1A1A9` chapado, texto `#FFF` |
| Botão "Salvar" (`.button-action.button-short`) | 55,7 × **25,5**, padding `2px 10px` | 5px | `#1A94FF`; **`:hover` → `#33A0FF!important`** (aqui o legado já segue o token) |
| Botão de opções (`.button-white-light-border.button-short.button-rounded`) | 160 × 25,5 | **7px** | `#FFF`, borda `rgba(23,22,38,.1)`, peso 500 |

## Menu de módulos expandido

| | Recolhido | Expandido |
|---|---|---|
| Largura do `aside.td-quickly` | **55** | **195** |
| Item (`.ds-button-container`) | 40 × 40 em x=5 | **175 × 40** em x=10 |
| Indicador do item ativo | 60 × 40 em x=**−15** | **195 × 40** em x=**−185** |
| Ícone `svg` | 25 × 15 em x=13 | 25 × 15 em x=20, `margin-right: 10px` |

- **Transição `0.15s`** no `aside` e no indicador — é o que dá o deslizar.
- Item: padding `0 10px`, raio 5px, fundo transparente, cor `#FBF8FE`. Passo vertical 50px nos dois
  estados.

### O topo não tem marca; o logo é do rodapé

Erro fácil de cometer e já cometido: **não existe logo no topo do rail.** O primeiro item da lista
começa em **y=20** e já é um módulo — no app, o módulo ativo (`Operação`, com o selo `Beta`).

O rodapé é o único lugar com marca, e ele **muda com o estado**:

| | Recolhido (55px) | Expandido (195px) |
|---|---|---|
| Conteúdo do rodapé | **só o botão de seta**, 40 × 40 em x=8 | **lockup horizontal completo** à esquerda, botão de seta à direita |
| Ícone do botão | seta para a **direita** (`→`, "abrir") | seta para a **esquerda** (`←`, "fechar") |
| Botão | raio 5px, fundo transparente, anel `rgba(246,241,253,.1)` inset 1px | idem |

Medido: o botão fica em **y=895** num viewport de 945 — ou seja, colado no pé, com o contêiner em
`padding: 0 5px 10px`.

### O rodapé, medido ao vivo em 05/08/2026 (expandido, 195px)

| Elemento | Medida exata | Detalhe |
|---|---|---|
| Contêiner do rodapé | **195 × 45** em y=900, `padding: 0 10px 10px`, `display:flex`, `justify-content: space-between`, `align-items: center` | fundo transparente (herda o `#1E0C45` do rail) |
| **Logo** | **`<img>` de 110 × 17,5** em (25, 909) | ⚠️ **é uma imagem, não markup montado** — ver abaixo |
| Botão da seta | **35 × 35** em (150, 900) — **não 40 × 40** | raio 5px, fundo transparente, anel **`rgba(246,241,253,.1)` inset 1px**, `padding: 0` |
| Ícone da seta | **19 × 15**, `fal fa-arrow-left-long`, `viewBox 0 0 512 512` | ⚠️ cor **`#FBF8FE` (branco)** — o botão declara `color: #7D33E6`, mas o SVG renderiza **branco**; não pinte a seta de roxo |

> **O logo do rail é um arquivo único, e é o mesmo que está em `assets/`.** O app serve
> `https://app.ploomes.com/assets/images/ploomes_horizontal_logo.svg`, e o conteúdo é
> **idêntico** ao `assets/horizontal-on-dark.svg` desta skill: `viewBox="0 0 115 15.6"`,
> `width="120" height="19.15"`, dois fills — símbolo **`#843CFF`** e wordmark **`white`**.
> Renderizado a **110px de largura** (altura da caixa 17,5; a arte cabe centrada por
> `preserveAspectRatio`).
>
> **Não componha símbolo + palavra "Ploomes" à mão.** Um mockup fez isso com o símbolo
> todo branco e saiu errado nas duas coisas: o símbolo do lockup é **roxo `#843CFF`**, não
> branco, e a proporção entre símbolo e wordmark não se acerta no olho. Use o arquivo
> (inline ou `data:` URI), largura 110px.
>
> Isto também confirma a ressalva já registrada de que **o roxo varia por arquivo**: o
> lockup usa `#843CFF`, o token de marca é `#7E33E6`, e o `ACTION.brand` renderiza
> `#7D33E6`. Os três coexistem; use o do arquivo quando o artefato é o arquivo.

**A expansão é sempre por clique nesse botão.** O rail nasce recolhido e não expande por hover nem
por foco; um mockup que já apareça aberto mostra um estado que o usuário só vê depois de agir.
- Rótulo (`.menu-item-label`): **15px/21,43 peso 300**, **peso 500 quando ativo**, `nowrap` +
  `text-overflow: ellipsis`. Declara `Inter`; 300/400/500 foram confirmados como carregados em
  05/08. Se a fonte falhar numa sessão futura, a queda é para sans-serif do sistema.
- **Badge "beta"** (`.beta-item-label`): 36 × 20, padding `1px 4px 0`, raio **2px**, fundo
  **`#5916B6`**, texto `#FBF8FE` **12px peso 500**, `gap: 2px`.


## Estados, movimento e iconografia

Medido ao vivo em **06/08/2026** (Chrome via CDP, viewport 1536 × 730, DPR 1,25). Trate os pixels como amostra desse viewport, não como token novo. O `:focus`
foi forçado por CSS para comparação — a ordem real de navegação por teclado não foi aferida.

Na folha principal (2.363.685 bytes) foram contadas 3.427 ocorrências de `:hover`, 1.051 de
`:active`, 125 de `:focus`, 541 de `:focus-visible` e 5 de `:disabled` — cobertura do build,
não número de componentes.

### Estados interativos

#### Design system e chrome do Painel

| Alvo observado | `:hover` | `:focus` forçado | `:active` |
|---|---|---|---|
| `FakeSearch` | anel `box-shadow` inset em `#8B8495` | busca aberta cresce de **300 para 550px** e usa anel inset `#1A94FF` | — |
| `SOFT_TO_ACTION`, cor `confirmation` | fundo `rgba(27,16,44,.05)` + anel inset `#1A94FF` | mesmo fundo e anel do hover | fundo `rgba(27,16,44,.10)` + anel inset `#1A94FF` |
| Controles de Painel/menu aferidos | fundo `rgba(27,16,44,.05)` | fundo `rgba(27,16,44,.05)` | fundo `rgba(27,16,44,.10)` + anel inset `#1A94FF` |

Preserve a mecânica do DS: o contorno de controle é `box-shadow` inset, não
`border`. Não generalize estes valores para componentes que não apareceram nas
rotas varridas.

#### Legado e superfícies clicáveis

| Alvo observado | `:hover` | `:active` |
|---|---|---|
| `.button-action` legado | `#33A0FF` | `#1A94FF` |
| Card `a.deal` | `rgba(27,16,44,.05)` | `rgba(27,16,44,.10)` |
| Linha de tabela vendor | `#F5F5F5` | — |
| Linha de tabela Ploomes | `#F4F3F4` | — |

Escolha o hover de tabela pelo seletor/implementação encontrada na tela; os dois
fundos coexistem no build. A medição ao vivo desta rodada substitui a leitura
anterior de que `.table-hover` não teria efeito.

### Tooltips e dropdowns

#### Tooltip real

O chrome superior usa **Tippy**, não `title=` nativo: fundo branco, raio **4px**,
sem borda, sombra `0 0.6px 5px rgba(0,0,0,.4)` e texto **14px / 19,6px**.
A animação `shift-away` coordena `transform`, `opacity` e `visibility` em
**250ms**.

Rótulos confirmados: **Emails**, **Notificações**, **Registros de interação**,
**Tarefas** e **Central de suporte**. Reproduza o texto visível e use o tooltip do
DS; não converta os rótulos em dados de conta.

#### Dropdown “Painel”

- Caixa aferida: **250 × 218px**, em `x=210,2`, `y=89,8` neste viewport.
- Raio **5px**.
- Sombra em três níveis: `0 8px 10px rgba(0,0,0,.14)`,
  `0 3px 14px rgba(0,0,0,.12)`, `0 5px 5px rgba(0,0,0,.20)`.
- Conteúdo: **6 controles**; faixas medidas de **40 / 73 / 40px**.
- Entrada/saída observada em **150ms ease**.

As coordenadas são evidência de ancoragem, não CSS fixo. Posicione o dropdown a
partir do acionador e mantenha-o dentro do viewport.

#### Dropdown “Menu”

- Caixa **150 × 125px**; padding interno **5px**, `gap: 5px`, raio **5px**.
- Linhas de **35 / 35 / 40px**.
- Sombra em três níveis: `0 4px 5px rgba(0,0,0,.14)`,
  `0 1px 10px rgba(0,0,0,.12)`, `0 2px 4px rgba(0,0,0,.20)`.
- Entrada/saída em **150ms ease**.
- Ações: `pen` em `#1B102C`, `copy` em `#1A94FF` e `trash` em `#F22727`.

### Movimento

| Elemento | Duração | Curva ou observação |
|---|---:|---|
| Rail expandir/recolher | 150ms | transição CSS |
| Rótulos “beta” | 200ms | `linear` |
| Lista de tarefas | 150ms | `slide-right`; entrada `ease-out`, saída `ease-in` |
| Reorganização `grid-stack` | 300ms | deslocamento de widgets |
| Skeleton | 1200ms | `linear`, repetição contínua |
| Loaders | 1500ms / 2000ms | ciclos distintos encontrados no build |
| Tooltip Tippy | 250ms | `shift-away`; transform + fade + visibilidade |
| Font Awesome | variável | utilitários `fa-spin` e afins existem no build |

Keyframes encontrados no CSS principal: `rotate`, `dash`, `color`, `sk-bounce`,
`spin`, `feedback`, `ellipsis-dot`, `part-skeleton-loading`, `rotation`, `pulse`,
`shine`, `shimmer`, `expandWidth`, `reduceWidth`, `fadeOutHidden` e
`loading-bar-spinner`. A folha do Font Awesome acrescenta `fa-spin`, `fa-beat`,
`fa-bounce`, `fa-fade`, `fa-beat-fade`, `fa-flip` e `fa-shake`.

Ao criar movimento novo, preserve `prefers-reduced-motion`. Não aplique as
animações utilitárias do Font Awesome por decoração: use-as apenas quando o
estado do ícone exigir progresso ou atividade.

### Mapa de ícones

O app ao vivo usa **Font Awesome 6 Pro inline** no rail e no chrome. Identifique
o glifo por `data-icon` + `data-prefix` + `viewBox`; essa tríade é a chave de
rastreabilidade. Não copie um path SVG deste documento: obtenha o `path` do
snapshot correspondente ou da variante Font Awesome correta.

#### Rail de módulos

| Módulo | `data-icon` | `viewBox` |
|---|---|---|
| Operação / Resumo | `gauge-simple-high` | `0 0 512 512` |
| Clientes | `address-card` | `0 0 576 512` |
| Processos | `sliders` | `0 0 512 512` |
| Documentos | `file-lines` | `0 0 384 512` |
| Produtos | `box-dollar` | `0 0 448 512` |
| Relatórios | `chart-bar` | `0 0 512 512` |
| Biblioteca IA | `graduation-cap` + `sparkles` decorativo | `0 0 640 512` para `graduation-cap`; conferir o `viewBox` de `sparkles` no snapshot |
| Administração | `gear` | `0 0 512 512` |

Regra de estado do rail: ícone principal inativo = **`fal`**, `#87838D`;
ativo = **`fas`**, branco. O ativo troca desenho/peso, não apenas cor. A caixa do
ícone mede **25 × 15px**, mas o SVG mantém largura proporcional ao próprio
`viewBox`. Em Biblioteca IA, `sparkles` foi observado como **`fas`** decorativo.

#### Barra superior

| Uso | `data-icon` | `data-prefix` | `viewBox` |
|---|---|---|---|
| Criar | `plus` | `fal` | `0 0 448 512` |
| Buscar | `magnifying-glass` | `fal` | `0 0 512 512` |
| Exportar | `upload` | `fal` | `0 0 512 512` |
| Emails | `envelope` | `fal` | `0 0 512 512` |
| Notificações | `bell` | `fal` | `0 0 448 512` |
| Registros de interação | `comment-lines` | `fal` | `0 0 512 512` |
| Tarefas | `calendar-days` | `fal` | `0 0 448 512` |
| Central de suporte | `user-headset` | `fal` | `0 0 448 512` |
| Abrir menu | `chevron-down` | `fal` | `0 0 512 512` |

Renderize esses glifos com **13–15px de altura** e largura automática. A cor
usual é `#1B102C`; ações como criar e exportar usam `#1A94FF`.

#### Subheader e widgets

- Subheader: `chevron-down`, `gear`, `pen-to-square`, `calendar`,
  `grid-dividers`.
- Widgets: `clock`, `industry`, `circle`, `eye`; `comment-lines` e `users`
  foram observados em **`fas`**.

Quando o prefixo ou `viewBox` não estiver explicitado acima, leia os atributos do
snapshot antes de embutir o ícone; não infira a variante pelo nome.

## Sobreposições

Lido das folhas em 04/08 — sem abrir modal em conta de produção.

| Componente | Geometria |
|---|---|
| `.ds_modal_center` | **`min-width: 700px`**, `max-width: 800px` (900 em exportação), `height: fit-content` |
| ↳ `.header-modal` | padding `15px 0`, `border-bottom: 1px solid rgba(27,16,44,.1)` |
| ↳ `.body-modal` | `padding-bottom: 25px` |
| `.ds_modal_side` | **`width: 350px`**, `height: 100%` |
| `.ds_modal_side_background` | `top: 50px`, `height: calc(100% - 50px)`, `z-index: 5` — **começa sob a barra superior, não a cobre** |
| Backdrop | **`rgba(76,85,102,.5)`**, `position: fixed`, 100% × 100% |
| `.ds-dropdown` | `top: calc(100% + 5px)`, `#FFF`, raio **5px**, padding `0 5px`, `z-index: 10`, sombra de **3 camadas**: `0 8px 10px rgba(0,0,0,.14)`, `0 3px 14px rgba(0,0,0,.12)`, `0 5px 5px rgba(0,0,0,.2)` |
| ↳ título de seção | fundo `#F4F3F4` |
| ↳ separador | `border-bottom: 1px solid rgba(27,16,44,.1)`, `margin-left: -5px` |
| `.ds_tooltip` (tippy) | raio 4px, `#FFF`, sombra `rgba(0,0,0,.4) 0 .6px 5px`, **sem borda**; `.tippy-content` com `padding: 0` |

O backdrop `rgba(76,85,102,.5)` tem a mesma cor base do token `--color-background_opacity`
(`#4c5566cc`), com opacidade diferente (.5 medido vs. .8 do token).

### Busca aberta

| Elemento | Medida | Estilo |
|---|---|---|
| `.GeneralSearch-component` fechada | 300 × 35 | anel `rgba(27,16,44,.1)` inset |
| **aberta** | **550 × 35** | `z-index: 100` |
| `input.SearchInput-component__input` | 338 × 35, padding `0 20px 0 10px` | `#FFF`, **anel `#1A94FF` inset 1px**, **14px/20**, cor `#1B102C` |
| `.SearchResults-component` | 530 × 150, começa em y=34 | — |
| ↳ cabeçalho de histórico | 530 × 30, padding `5px 10px 0` | `#8B8495` |

**A busca cresce de 300 para 550px ao focar** e troca o anel neutro pelo azul. Também em hover, o
anel muda para `#8B8495`. É o indicador de foco mais visível do produto.

---

## Escalas observadas

**Tipografia** — `13px` domina o produto inteiro. `15px` no menu de módulos e em `.font-big`.
Depois: `11,05px` em conteúdo denso do Painel, `12,5px` no campo editável inline, `12px` no detalhe
do cartão de negócio, `11px` em badge e contador de aba, `10px` no contador de notificação, `14px`
em aba, campo e texto de botão, `16px` em `big_40`.

**Peso** — `400` é o padrão. `500` em **todo** botão e texto do legado (não existe no pacote).
`600` em `ACTION`, seletor selecionado, badge e destaque de célula. `700` no contador. `300` no
rótulo do menu e em `.text-warning`. `900` só como peso de Font Awesome.

**Raio** — `5px` domina: botão (dos dois sistemas), campo, linha de grupo, cartão de negócio,
dropdown. `10px` em cartão, cabeçalho de widget e bolha da timeline. `15px` no card de tarefas.
`7px` em `.button-rounded`. `4px` em paginação, aba, tooltip e `textarea`. `3px` em badge, trilha,
ícone inline e campo de busca do Funil. `2px` no contador e no badge "beta". `50%`/`100%` em avatar,
ícone de tarefa e contador de aba.

**Altura de controle** — DS: `25` (`tiny_20`), `30`, `35`, `40`. Legado: **`31,5`** e **`25,5`**
(`.button-short`). Barra superior 50, sub-cabeçalho e cabeçalho legado 40, linha de tabela 41,
cabeçalho de tabela 43.

## Onde o produto não tem token equivalente

Divergência entre o medido e o que o `@ploomescrm/ui` publica. **Não arredonde em silêncio** —
se o valor não tem token, ou você escreve o valor arbitrário, ou aceita o token mais próximo de
olhos abertos. Criar token novo na camada de produto para tapar o buraco recria a camada
paralela que este projeto veio eliminar.

| Medido no app | No pacote | O que fazer |
|---|---|---|
| Superfície `#F4F3F4` do `ds-rd__rnd__children-wrapper` | `--color-background-level_1` = `#FAFAFB` (usado no `ds-rd__rnd-wrapper` que o envolve) | **As duas coexistem em camadas**, não é uma escolha entre hex e token: use o **token** no envoltório e o **hex arbitrário** no filho — colapsar os dois num só perde uma camada real. |
| Peso **500** (cabeçalho de tabela, ação) | escala tem 300, 400, 600, 700 | `font-medium` do **Tailwind core** (`--font-weight-medium: 500`), não token novo. |
| Raio **4px** (paginação, aba) | escala tem 2, 3, 5, 15 | Valor arbitrário. |
| Fonte **12px** (detalhe do cartão) | escala começa em 13px | Valor arbitrário. |
| Fonte **11,05px** (linha de grupo, cartão de item) | escala começa em 13px | **Ausente** — e é valor computado a partir de `em`, não uma escolha de design; valor arbitrário. |
| Sombra de 1 camada `rgba(0,0,0,.05) 2px 2px 2px` | `--shadow-*dp`, todas de 3 camadas | Valor literal; nenhum token chega perto. |
| Divisória `#EAECEC` | `--color-neutral-level_2` resolve ~`#E7E6E9` | Token: a diferença é de um dígito por canal. |
| Anel de 1px `rgba(27,16,44,.1)` como `box-shadow` inset | `--color-neutral-level_2` = `rgba(27,16,44,.1)` | **Ok** — o token está certo; o mecanismo é `box-shadow`, nunca `border`. |
| Source Sans Pro 400/600/700 (carregada) | `--font-family-body` = `'Source Sans 3'` | **Divergem** — famílias diferentes, não só nome; a 3.0 revisou métricas e o app nunca migrou. A pasta `fonts/` desta skill traz os arquivos `.woff2` do app (não do pacote) — embuta-os via `@font-face` sob os dois nomes quando a tela for comparada lado a lado com o produto. |
| Font Awesome 6 Pro Light/Solid (carregada no chrome) | o pacote usa **lucide** (`storybook/atoms/Icon.html`) | Divergem por desenho — famílias de ícone incompatíveis; sem de-para 1:1. |
| Inter no menu (declarado e confirmado como carregado em 05/08) | `--font-family-body` = `'Source Sans 3'` | O rail pode usar Inter enquanto o conteúdo usa Source Sans Pro; não force uma família única no chrome inteiro. |
| Gradiente do item ativo do rail: `#7D33E6 → #431188` a 102,35deg | `--color-brand` = `#7E33E6`; `--gradient-brand_gradient` = `linear-gradient(to right, #5a16b6 0%, #431188 100%)` | **Nenhum bate exato.** `#7D33E6` é 1 dígito fora do token de marca; o stop final `#431188` **coincide** com o do gradiente do pacote, mas o stop inicial e o ângulo (102,35deg vs. `to right`) não — não reuse o token, ele produziria um gradiente visivelmente diferente. Valor arbitrário. |
| Gradiente do botão IA: `linear-gradient(92,08deg, rgba(205,61,255,.5) 1,56%, rgba(15,47,255,.5) 100%)` | `--color-ia-gradient` = `linear-gradient(169deg, #CA33FF 0%, #334EFF 100%)` | **Diverge** — ângulo, cores (poucos dígitos por canal) e opacidade (o medido é translúcido a 50%, o token é sólido). Valor arbitrário. |
| Texto do botão IA `rgb(104,81,139)` = `#68518B` | família `ia` tem `DEFAULT #7E33E6`, `level_1 #8D49E9`, `level_2 #701CE3` | **Ausente** — não bate com nenhum tom da família `ia`. Valor arbitrário. |
| Passo de **50px** no menu | existe como `sp-giant` | Existe, mas o nome sugere uso fora de propósito. |
| **hover `neutral-level_1` / active `neutral-level_2`** em todo botão do DS | idênticos no tema claro | ✅ **Use o token.** Vale para `ds-button`, linha de grupo, cartão de negócio e `.button-white-light-border`. |
| **hover/active de `ACTION`** = `--color-<cor>-level_1` / `-level_2` | idênticos no tema claro nas 5 cores | ✅ **Use o token.** `level_1` = hover, `level_2` = active — semântica uniforme. |
| Padding **`7,5px`** na barra superior | escala de espaçamento | Valor arbitrário. |
| `#5916B6` (badge "beta" do menu) | — | **Ausente.** Valor arbitrário. |
| `#B7FBD9` / `#76E6AE` (cartão de negócio ganho) | — | **Ausentes.** Valores arbitrários. |
| `#898791` (texto de `th`, ícone inline) | `--color-font-level_2` ≈ `#8B8495` | ~2 dígitos por canal; provável mesmo intento — use o token. |
| `#979797` (nome do cliente, texto secundário legado) | — | **Ausente.** Valor arbitrário. |
| Raio **7px** (`.button-rounded`) | escala tem 2, 3, 5, 15 | Valor arbitrário. |
| Fonte **12,5px** (campo editável inline) | escala começa em 13px | **Ausente** — valor computado de `em`. |
| Peso **900** (`.text-neutral`, ícone `fas`) | escala tem 300, 400, 600, 700 | **Ausente** — é o peso da Font Awesome, não do texto. |
| `.button-brand` legado `#7625E4` | `--color-brand` `#7E33E6` | **Terceiro roxo de marca do produto.** Valor arbitrário; não confunda com o do rail (`#7D33E6`). |
| Hovers do legado (`#2B88DA`, `#F5F5F5`, `#EBEBEB`…) | os `level_*` do pacote | **Divergem** — o legado tem sua própria escala de estado. Onde a migração já passou, aparece `#33A0FF!important` (o token). Reproduza o que a tela usa. |
| **`ds-button` sem `:focus-visible`** | — | **Falha do app.** Único caso em que **não** replique: adicione anel de foco ao gerar tela. |
| Hovers de tabela `#F5F5F5` e `#F4F3F4` | os `neutral-level_*` do pacote | Os dois coexistem no build; escolha pelo seletor da tela, não por uma regra global. |
| Backdrop `rgba(76,85,102,.5)` | `--color-background_opacity` `#4c5566cc` | Mesma cor base, opacidade diferente (.5 vs .8). |
| Sombra de dropdown, 3 camadas | `--shadow-*dp` | Conferir equivalência exata antes de trocar pelo token. |

Raios **15px**, **10px**, **5px**, **3px**, **2px** e a cor **`#FFC01A`** do contador **têm**
token (`--radius-big-15`, `--radius-large-10`, `-normal-5`, `-small-3`, `-tiny-2`,
`--color-alert`) — use o token. O raio de 10px é o de cartão e cabeçalho de widget; o pacote
documenta o utilitário `rounded-large-10` para cards (`Card`, `ImageGallery`, `GridView`).

---

## Como usar isto

Ao reproduzir uma tela do produto, comece pelo componente equivalente em `storybook/<categoria>/`
(ou pela busca em `storybook/INVENTORY.md`) — ele dá o comportamento, os estados e os tokens.
Volte aqui para a régua: altura de barra, largura de coluna, ritmo de ícone, tamanho de fonte
por contexto.

**A sequência que erra menos:**

1. **Decida o sistema pela tela.** Painel e chrome → `ds-button` e os componentes do DS. Funil,
   Negócio, tabela, formulário → **legado**. Misturar é o erro mais visível.
2. **Cor:** `confirmation` (`#1A94FF`) é o padrão do produto. O chrome é monocromático em azul.
3. **Estado:** hover = `neutral-level_1`, active = `neutral-level_2` no DS; em `ACTION`, hover =
   `level_1` da cor. Isso tem token — use o token.
4. **Anel, não borda**, no DS: `box-shadow: 0 0 0 1px inset`. No legado é `border: 1px solid` de
   verdade.
5. **Adicione foco visível** no botão, ainda que o app não tenha (a única divergência deliberada).

Se você tem um print recente da tela e ele discorda deste arquivo, **o print vence**: ele é de
hoje e a captura mais nova aqui é de 06/08/2026.

> **O app não expõe os tokens como variável CSS em runtime.** Consultar
> `getComputedStyle(document.documentElement)` por `--color-*` no app devolve vazio: o
> `@ploomescrm/ui` compila os valores como literais via styled-components. Consequências: o de-para
> hex → token é sempre manual (esta tabela é o mapa), e **não há troca de tema por variável** — o
> `ploomes-ui.css` do pacote declara `.dark`, mas o app não o usa.

**O que ainda não foi medido:** `/selfinfo`, `/Tasks/calendar`, o detalhamento integral dos itens
do card “Hoje” e dos feeds, um **modal aberto de verdade** (a geometria acima vem das folhas) e
as variantes `ACTION`, `--selected` e as cores `danger`/`alert`/`brand`/`confirmation_alt`
**renderizadas**. Clientes, Produtos e Documentos tiveram o chrome e o cabeçalho/listagem inicial
medidos em 06/08, mas não todos os fluxos internos de edição.
