---
name: ds-ploomes-crm-ui
description: >-
  Use ao desenhar, prototipar, mocar, replicar ou refinar interfaces visuais do
  Ploomes CRM Web: telas do produto, componentes, dashboards, demos e prints em
  alta fidelidade. Reúne o snapshot renderizado do design system (77 componentes,
  618 stories), tokens light/dark, voz e terminologia pt-BR, geometria do app em
  produção, estados de interação, animações e iconografia do sistema novo e do
  legado. Ative sempre que o pedido envolver criar, estilizar ou reproduzir
  visualmente uma experiência dentro do CRM Ploomes. Não use para API,
  integrações, identidade de marketing fora do produto ou apps mobile nativos.
---

# Ploomes Design System — Skill

## Quando usar

- Telas e componentes de módulos que rodam **dentro** do CRM e precisam parecer nativos
- Mockups, protótipos e variações de UX sobre o produto
- Dashboards, relatórios, visões de acompanhamento
- Decks comerciais ou de produto com prints/screens em alta fidelidade
- Componentes isolados (button, modal, tabela, drawer, form) com aparência Ploomes
- Qualquer pedido que cite Ploomes, "nosso CRM", pipeline, funil, negócio, proposta **com intenção visual** (renderizar, mostrar, mocar, estilizar)

## Quando NÃO usar

- Sites institucionais, landing pages de marketing (vocabulário e proporções são diferentes)
- Branding novo, exploração de identidade visual fora do produto
- Apps mobile nativos (este DS é desktop/web)
- Suporte funcional, treinamento comercial, billing, planos

## O que esta skill é — e o que ela não é

**É** o vocabulário visual do produto: os componentes que existem, com que nome,
em quais variantes e medidas; os tokens de cor/tipo/raio/sombra nos dois temas; a
terminologia e a voz em pt-BR. Serve para o que você entrega **parecer nativo** —
o usuário não deve sentir que saiu do CRM.

**Não é** um teto de ambição. Ela não manda fazer tela pequena, pobre ou
centralizada. Não proíbe componente novo, layout novo, paleta própria, gráfico,
animação ou densidade alta. Se o pedido pede uma tela cheia e impressionante,
entregue uma tela cheia e impressionante — **nos tokens e no vocabulário do
produto**. Ver [Latitude criativa](#latitude-criativa), que tem o mesmo peso das
invariantes.

## Setup inicial — leitura por necessidade

Não leia tudo. Leia o que a tarefa exige:

| Tarefa | Abrir |
|---|---|
| **Montar formulário, campo, dropdown, ou seletor de cliente/responsável/produto** | **`forms.md`** — a grade de 4 colunas, as alturas, e as receitas de composição (opção, seletor de registro com busca e paginação, data, camada flutuante) |
| **Qualquer filtro, seletor, período ou ordenação numa tela** — inclusive num dashboard, num quadro ou numa listagem, fora de qualquer formulário | **`forms.md`** — §4 é o substituto do `<select>` e traz a linha do dropdown de filtro/menu; §7, a camada flutuante. Um filtro no topo de um dashboard **não** é exceção por não ser formulário |
| **Saber se um componente existe e como se chama** | `storybook/index.html` (inventário navegável) ou a tabela de `storybook/INVENTORY.md` |
| **Ver um componente real: variantes, estados, medidas** | `storybook/<categoria>/<Componente>.html` |
| **Ver o `import`, o `meta.args` e o código de todas as stories** | `storybook/INVENTORY.md` (seção do componente) |
| **Tokens reais (cor, fonte, raio, sombra, light/dark)** | `storybook/foundations/Tokens.html` · `Colors.html` · `Typography.html` — ou a [tabela abaixo](#contrato-de-tokens) |
| Conta com marca própria (whitelabel) | `storybook/foundations/Whitelabel.html` |
| Terminologia, voz, microcopy | [Padrões de copy](#padrões-de-copy), neste arquivo |
| **Tela de Funil, Negócio, tabela ou formulário** (sistema legado, fora do storybook) | **[Dois sistemas de UI](#dois-sistemas-de-ui-o-novo-e-o-legado)**, abaixo, e `ploomes-produto.css` |
| Componente que o storybook não tem story própria (botão de IA, cartão de negócio do Kanban, cabeçalho de Estágio) | `ploomes-produto.css` (classes `.ploo-*`) |
| Medida que nenhuma story mostra — chrome montado (rail, barra superior), geometria do legado, o que não tem token | **[`geometria-do-produto.md`](geometria-do-produto.md)** |
| **Hover, focus, active, tooltip, dropdown, animação ou ícone do app em produção** | `geometria-do-produto.md`, seção **"Estados, movimento e iconografia"** |
| **Montar o Painel** (tela inicial) | `geometria-do-produto.md`, seção **"Composição do Painel"** — Hoje, 3 KPIs com barra de meta, Publicações e Atividades. Não invente dashboard genérico |
| Ícone fiel, ou comparação lado a lado com o produto | `fonts/` — Source Sans Pro (4 pesos) e o subset Font Awesome (ver [Tipografia e ícones](#tipografia-e-ícones-fontes-self-hosted)) |

## `storybook/` — o design system renderizado

```
storybook/
├── index.html          inventário navegável: 77 componentes por categoria, com nº de stories
├── INVENTORY.md        o mesmo inventário em Markdown: import, meta.args e o código de TODAS as stories
├── README.md           como o snapshot foi gerado e o que ele não cobre
├── assets/
│   ├── design-system.css   tokens light/dark + build de utilitários + CSS de vendors
│   └── page.css            chrome das páginas (`.ds-*`) — NÃO faz parte do DS
├── foundations/  (4)   Colors · Tokens · Typography · Whitelabel
├── atoms/       (10)   DraggableList · Icon · NestedButton · NotifyBadge · ProfileGroup ·
│                       ProfileImage · ProgressBar · RenameableText · Spinner · Tooltip
├── components/  (20)   AlertMessage · Badge · Breadcrumbs · ButtonAction · ButtonCheck ·
│                       ButtonFavorite · ButtonSoft · ButtonSoftToAction · CardButton ·
│                       CodeInput · DataView · Dropdown · FooterModal · HeaderModal ·
│                       Pagination · SearchInput · Skeleton · SpeechToTextButton · Text · Toaster
├── fields/      (19)   uma página por tipo de campo personalizado, nomeada pelo TypeId
├── organisms/   (23)   ActionDock · AlertModal · Card · Collapse · DeepSelector · EmptyLabel ·
│                       FieldSelector · FilterGroup · GridView · HorizontalMenu · HorizontalTabs ·
│                       ImageGallery · InfiniteScroll · Loader · ModalCenter · ModalFloating ·
│                       ModalSide · ResizableDrawer · SearchableList · Stepper ·
│                       SubMenuHorizontal · Table · VerticalMenu
└── providers/    (1)   IconProvider
```

**Como cada página é composta:** cabeçalho com o `import` real e o `meta.args`
(props padrão); uma seção por story com nome, id do Storybook, export de origem,
o componente **renderizado** num canvas e o código da story em `<details>`.

**Campos = TypeId.** `storybook/fields/` tem 19 páginas e o nome do arquivo já
traz o TypeId do campo personalizado (`Field05NumberCurrency` = TypeId 5) — é a
ponte direta entre a config da conta e o componente que renderiza o campo.

**Tema escuro:** as páginas abrem em light; trocar `<html lang="pt-BR">` por
`<html lang="pt-BR" class="dark">` renderiza o dark. O mecanismo do DS é a
classe **`.dark` na raiz** sobrescrevendo os `--color-*`.

**Limites do snapshot:**
- É o **estado inicial** de cada story: sem hover, focus ou tooltip visível.
  Exceção — **58 capturas de estado aberto**, num segundo canvas: os modais
  (`ModalCenter`, `ModalSide`, `AlertModal`) e a lista/picker aberto dos campos
  (`Field07Options`, `Field10Checkbox`, `Field07Phone`, `Field08Date`,
  `Field02TextMultiline`, `Field22Developer`). **Consulte esse canvas antes de
  montar qualquer popover, dropdown ou lista de opções** — é a única fonte de como
  a camada aberta realmente é.
- Para os estados do **app montado em produção** — hover, active, focus, tooltips,
  menus, transições e ícones do chrome — complemente o snapshot com
  `geometria-do-produto.md`, seção "Estados, movimento e iconografia".
- `Field09Time`, `Field20Color`, `Field18Image` e `Field19Attachment` não têm
  captura de estado aberto de propósito: encapsulam o picker **nativo** do browser
  (`showPicker()`, `<input type="color">`, `<input type="file">`), então não há
  popover próprio do DS para capturar.
- Helpers citados no `render` (`<XDemo />`, dados de exemplo) ficam no arquivo de
  story de origem — não foram inlineados.
- Depende de rede para a fonte (Source Sans 3, Google Fonts) e para as imagens de
  exemplo. Offline, o texto cai em sans-serif genérica e os avatares quebram —
  **não é bug do DS**. Para não depender de rede — obrigatório em mockup
  renderizado em sandbox sem host externo — use os arquivos em `fonts/` desta
  skill; ver [Tipografia e ícones](#tipografia-e-ícones-fontes-self-hosted).

## Dois sistemas de UI: o novo e o legado

**O storybook cobre um sistema só, e não é o app inteiro.** As 618 stories são
do design system **novo** — o que roda hoje no Painel, na barra superior, no
rail e nos widgets. **Funil, Negócio, tabela e formulários rodam um sistema
anterior**, com 105 classes `.button-*` próprias, que não tem story alguma
aqui: altura de botão **31,5px** (não 25/30/35/40), `border` de verdade (não
`box-shadow` inset), peso de fonte **500** (a escala do storybook não tem
500). Gerar uma tela de Funil ou Negócio com os componentes do storybook
produz a tela errada de forma imediatamente visível — é o erro mais comum
e mais visível ao reproduzir o produto.

**Decida o sistema pela tela, não pelo pedido genérico de "Ploomes":**

| Tela | Sistema | Fonte |
|---|---|---|
| Painel, barra superior, rail, widgets | **Novo** (este storybook) | `storybook/` |
| Funil, Negócio, tabela, formulário, timeline | **Legado** | `ploomes-produto.css`, classes `.ploo-lg-*` |

Além do legado, há peças que o produto tem e **nenhuma story do storybook
cobre** — não por serem legado, mas por não terem entrado na captura:
botão inline da IA, cartão de negócio do Kanban (com a barra de evolução no
pé), cabeçalho de Etapa, faixa de processamento em lote, e a composição de
grade do próprio Kanban. Essas vivem em `ploomes-produto.css` como classes
`.ploo-*` (sem o `-lg-`) — todas escritas só com os tokens do
`storybook/assets/design-system.css`, nunca hex literal.

**Em código React de verdade** (não mockup estático) nenhuma dessas classes se
importa: componha a partir da story equivalente em `storybook/`. E antes de
escrever uma classe nova, confira se o componente **já existe** — a barra
superior é `HorizontalMenu` e o rail é `VerticalMenu`, os dois com story própria.
Recriá-los em CSS é o erro que a camada `.ploo-*` existe para **não** repetir:
ela cobre só o que não tem story.

**A régua de medida de tudo isso — chrome montado, os dois sistemas de botão
lado a lado, geometria do Kanban e do Negócio, e o que não tem token
equivalente — é [`geometria-do-produto.md`](geometria-do-produto.md).** O
storybook mostra o componente isolado; aquele arquivo mostra a tela montada,
medida direto no app rodando (`app.ploomes.com`). Onde os dois divergirem,
o storybook vence para o que é componente novo; `geometria-do-produto.md`
vence para o que é geometria do app real (chrome, legado) que o storybook
não captura.

### Tipografia e ícones: fontes self-hosted

O DS usa **Source Sans 3**; o app em produção carrega **Source Sans Pro**
(família irmã, métricas diferentes — a 3.0 revisou o desenho e o app nunca
migrou). Nenhuma das duas está embutida no snapshot — o `storybook/` depende
de Google Fonts por rede. Em qualquer mockup renderizado num sandbox sem
acesso a host externo (é o caso do Claude/Artifact), a fonte cai para
sans-serif do sistema.

A pasta **`fonts/`** resolve isso, e traz **só o que o produto usa**:

| Arquivo | O quê | Quando |
|---|---|---|
| `SourceSansPro-{Light,Regular,Semibold,Bold}.ttf.woff2` | os **4 pesos** do app (300/400/600/700 — não existe 500, nem itálico na UI) | comparação lado a lado com o produto, deck, print de proposta |

Embuta via `@font-face` com `data:` URI. Para iteração interna rápida,
sans-serif do sistema basta.

> **Ícones:** no chrome e no rail o app usa SVG inline — copie do DOM do storybook. Para
> o ícone que no sistema legado é glifo de fonte, use um ícone do `lucide-react`, que já
> vem na base do construtor de telas, em vez de desenhar um path de memória.

## Como consumir o CSS do snapshot

`storybook/assets/design-system.css` tem duas partes, e elas têm confiabilidade
**diferente**:

- **A camada de tokens (`@layer theme` + `.dark`) é completa.** Todos os
  `--color-*`, `--radius-*`, `--shadow-*`, `--font-*` estão lá, nos dois temas.
  Pode confiar 100%.
- **A camada de utilitários é purgada** — só contém as classes que as 618 stories
  usaram. `p-4`, `gap-6`, `text-font`, `bg-brand`, `shadow-2dp` existem;
  `p-7`, `rounded-xl`, `w-1/3`, `grid-cols-7`, `backdrop-blur` **não existem**.

**Consequência prática:** linke o CSS pelos **tokens** e escreva seu próprio CSS
com `var(--color-*)`. Não presuma que uma classe utilitária existe só porque o
Tailwind teria — se não veio numa story, não está no build.

```html
<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@300;400;600;700&display=swap">
  <link rel="stylesheet" href="storybook/assets/design-system.css">
  <style>
    body { font-family: "Source Sans 3", sans-serif; color: var(--color-font);
           background: var(--color-background); }
    .cta { background: var(--color-confirmation); color: #fff;
           border-radius: var(--radius-normal-5); padding: 8px 14px; font-weight: 600; }
  </style>
</head>
<body>
  <button class="cta">Criar negócio</button>
</body>
</html>
```

Tema escuro: `class="dark"` no `<html>`.

**Para módulo React no scaffold:** o snapshot é referência visual e de
comportamento — reproduza anatomia, medidas e estados em CSS próprio nos tokens.
As classes utilitárias que aparecem no DOM (`h-[30px]`, `text-font-level_1`)
leem-se como **especificação** ("altura 30px, texto no token `font-level_1`"), não
se copiam: o scaffold não tem Tailwind.

### ⚠️ O `import` das stories não é consumível neste projeto

`INVENTORY.md` e as páginas mostram `import { Table } from '@ploomescrm/ui'`
porque foi assim que a story foi escrita no projeto do design system. **Aqui esse
pacote não é dependência** — a integração foi removida de propósito: não há
pacote de componentes pronto, você **compõe** a UI. Nunca adicione esse `import`
ao código de um módulo: não resolve no build.

## Contrato de tokens

Cada token existe em light e dark; o par abaixo é `light / dark` quando difere.

**Cor — marca e semântica**

| Token | Light | Dark | Uso |
|---|---|---|---|
| `--color-brand` | `#7E33E6` | = | Roxo da marca: estado ativo, seleção, hover, ênfase |
| `--color-brand-level_1` | `#8D49E9` | = | Hover |
| `--color-brand-level_2` | `#701CE3` | = | Active |
| `--color-confirmation` | `#1A94FF` | = | **CTA primário** (azul), info, ação neutra |
| `--color-confirmation_alt` | `#3BDDAD` | = | Sucesso alternativo (verde-ciano) |
| `--color-success` | `#3BDDAD` | = | Sucesso |
| `--color-alert` | `#FFC01A` | = | Atenção |
| `--color-danger` | `#F22727` | = | Erro, destrutivo |
| `--gradient-ai` | `linear-gradient(to right, #CD3DFF 0%, #0F2FFF 100%)` | = | IA ("Ploo") — hero/badge destacado |
| `--gradient-brand_gradient` | `#5A16B6 → #431188` | `#5A16B6 → #2D0B5B` | Fundo de marca |

> **O roxo da marca é `#7E33E6`, e é o único.** Os roxos válidos são
> `--color-brand` `#7E33E6`, seus estados `--color-brand-level_1` `#8D49E9` e
> `level_2` `#701CE3`, e os roxos escuros **dentro do gradiente de marca**
> (`#5A16B6 → #431188`) — que existem só como gradiente, nunca chapados.
> **Qualquer outro roxo está fora da marca** — inclusive o roxo escuro
> acinzentado da família do `#5A337B`, que não existe em token nenhum nem no
> snapshot. Roxo de marca se lê do token; não se escolhe de memória nem se deriva
> "para escurecer um pouco".

**Cor — superfície e texto**

| Token | Light | Dark |
|---|---|---|
| `--color-background` | `#FFFFFF` | `#121119` |
| `--color-background-level_1` | `#FAFAFB` | `#1B1A22` |
| `--color-font` | `#1B102C` | `#FBF8FE` |
| `--color-font-level_1` | `#1B102C` a 70% | `#FBF8FE` a 70% |
| `--color-font-level_2` | `#1B102C` a 50% | `#FBF8FE` a 50% |
| `--color-neutral-level_1` | `#1B102C` a 5% | `#F6F1FD` a 5% |
| `--color-neutral-level_2` | `#1B102C` a 10% | `#F6F1FD` a 10% |
| `--color-neutral-level_3` | `#1B102C` a 15% | `#F6F1FD` a 15% |

As neutras são o **mesmo tom do texto com alpha** — é assim que o DS mantém
hierarquia nos dois temas com um token só. Borda de tabela/card =
`neutral-level_2`; hover de linha = `neutral-level_1`.

**Tipografia** — `--font-family-body: "Source Sans 3", sans-serif`.
Pesos: `300 light · 400 regular · 600 semibold · 700 bold` (**não há 500**).
Escala: `--text-xs 12px · --text-sm 14px · --text-base 16px · --text-lg 18px`.
Na prática o produto usa **13px** em header de tabela/metadado e **14px** em
corpo/célula. Para título de dashboard, número de destaque ou hero, subir livre —
a escala é o piso do texto corrido, não o teto da hierarquia.

**Raio** — o que o DS usa de fato, contado no DOM das 618 stories:

| Raio | Onde | Frequência |
|---|---|---|
| **5px** | o default de quase tudo: input, botão, badge, **modal**, dropdown, painel | 2.573 |
| 3px · 2.5px · 2px | elementos miúdos (check, swatch, marcador) | 318 |
| **10px** | card de conteúdo/mídia — `Card`, `GridView`, `ImageGallery` | 82 |
| `rounded-full` | pílulas e avatares | 132 |

O token `--radius-big-15` **existe mas nenhum componente o usa** — só aparece na
página de documentação de tokens. Não use 15px achando que é o raio de modal: o
modal do DS é **5px**. Quando em dúvida, 5px.

**Elevação — leia a seção [Sombra](#sombra-borda-xor-sombra) antes de usar.**
Existem `--shadow-{1,2,3,4,6,8,12,16,24}dp`, mas o DS os aplica só em camada
flutuante, e nunca junto de borda.

**Ícones** — `lucide-react` via o componente `Icon` (galeria em
`storybook/atoms/Icon.html`; o `IconProvider` permite trocar o set). Tamanhos:
`tiny_10 · small_15 · normal_20 · big_30 · giant_90`. Cores: `default · brand ·
success · danger · alert · confirmation · inverse`. O scaffold já tem
`lucide-react` instalado.

> ⚠️ **Divergência confirmada ao vivo em 05/08/2026**: o componente `Icon` do pacote declara
> lucide, mas **nenhum ícone do rail ou da barra superior no app em produção é lucide** — tudo é
> Font Awesome 6 Pro (`fal`/`fas`), com o item ativo do rail trocando de família (contorno →
> sólido), não só de cor. Mesmo padrão de divergência da tipografia (Source Sans 3 declarado,
> Source Sans Pro renderizado). Para reproduzir a tela **atual** fielmente, use os paths reais
> em `geometria-do-produto.md`, seção "Ícones reais do rail e da barra superior"; para **código
> novo** sobre o pacote, use `Icon`/lucide normalmente — a divergência é do app legado, não do
> componente.

**Movimento** — o DS tem escala de duração nomeada; use ela em vez de cravar ms:
`--transition-quickly 100ms` (troca de cor, hover) · `--transition-promptly 150ms`
(dropdown, popover, modal central) · `--transition-slowly 250ms` (toast, drawer,
painel lateral) · `--transition-super-slowly 500ms` (raro, transição de contexto).
Easing: `--ease-out` para entrada com deslocamento, `--ease-in` para saída,
linear para fade puro. Sempre respeitando `prefers-reduced-motion`.

**Medidas de controle e de camada** — também são token, não número solto:
`--size-s-extra-tiny 20px · s-tiny 25 · s-small 30 · s-normal 35 · s-normal-big 40 · s-big 50`
(alturas de campo, botão, linha) · `--modal-size-ms-small 300px · ms-normal 600 · ms-big 800`
· `--drawer-size-ds-small 200px · ds-normal 250 · ds-big 350`.

**Espaçamento** — múltiplos de 5 como default do produto (5 · 10 · 15 · 20 · 25 ·
30 · 40 · 50 · 60). Padding interno de componente 5–20; gap entre componentes
15–30; margem de seção 30–60.

## Sombra: borda XOR sombra

O DS separa as duas por camada, e a regra sai de contagem no DOM das 618 stories,
não de gosto:

> **Borda XOR sombra. Superfície de página tem borda. Só o que flutua sobre o
> conteúdo tem sombra. Nunca os dois no mesmo elemento.**

**O DS é plano.** Em 618 stories, `border-neutral-level_2` aparece **1.729 vezes**;
sombra de elevação em repouso, **136** — e todas em camada flutuante. Nas
superfícies de página a contagem de sombra é **zero**:

| Componente | Sombra | Borda |
|---|---|---|
| `Table` | 0 | 104 |
| `DataView` | 0 | 84 |
| `Collapse` | 0 | 36 |
| `GridView` | 0 | 33 |
| `Badge` | 0 | — |
| `Card` (em repouso) | **0** | sim (`border-neutral-level_2`, raio 10) |

`Card` é a prova mais forte: o componente mais "cartão" do DS **não tem sombra
parado**. Ele tem borda, e ganha `8dp` só em `active:` — enquanto o dedo está em
cima. Elevação ali é feedback de interação, não decoração.

**Quem tem sombra, e quanto** — todos flutuam sobre o conteúdo, e **nenhum tem
borda**:

| Elevação | Componentes |
|---|---|
| `1dp` | `ActionDock` (barra fixa) |
| `~2dp` | `VerticalMenu` |
| `4dp` | `Dropdown` · `Toaster` |
| `~4dp` | picker aberto dos campos (`Field07Options`, `Field10Checkbox`, `Field07Phone`, `Field08Date`) |
| `8dp` | `DeepSelector` · `FieldSelector` · `SearchableList` · `ModalFloating` · `Card` **em `active:`** |
| `24dp` | `ModalCenter` · `ModalSide` · `AlertModal` · `ImageGallery` (lightbox) |

`6dp`, `12dp` e `16dp` existem como token e **nenhum componente os usa**. Popover
é `4dp`, não 6dp. Modal é `24dp`, não 16dp.

**Como decidir, sem pensar:** o elemento sai do fluxo (`position: fixed/absolute`)
e cobre conteúdo? Sombra, sem borda. Está no fluxo da página — tile de métrica,
painel, card de conteúdo, linha de lista, seção? **Borda
`1px solid var(--color-neutral-level_2)`, sombra nenhuma.**

**O caso limite, porque ele engana.** Faixa de métricas, painel de lista e card de
barra lateral são superfícies **no fluxo**: borda e nenhuma sombra. Somar
`box-shadow: var(--shadow-1dp)` à borda nesses três é uma alteração de três
regras de CSS que se multiplica na tela — cada tile, cada painel e cada card viram
retângulos flutuando, a página perde o plano de leitura e o dark mode fica lavado.
Acertar as camadas flutuantes não compensa: o piso é as superfícies planas
continuarem planas. E quando a camada flutuante entra, ela entra no valor real —
dropdown e toast são `4dp`, não `6dp`.

Se você quer separar uma superfície plana da que está atrás dela sem borda, o DS
resolve com **fundo**: `--color-background-level_1` para o plano de fundo e
`--color-background` para a superfície. Sem sombra.

## Contorno: `box-shadow` inset no DS, `border` no legado

> **Todo contorno de controle no design system é `box-shadow: 0 0 0 1px inset` —
> nunca `border`. No sistema legado é o oposto: `border: 1px solid` de verdade.**

Parece detalhe e não é: `border` **soma 2px à caixa** (1 de cada lado) e empurra o
conteúdo; `box-shadow` inset é desenhado **por dentro**, sem alterar a geometria.
Um botão de 35px feito com `border` mede 37 e desalinha a linha inteira da barra;
o mesmo botão com o anel inset mede 35 e encaixa. É o tipo de erro que não aparece
num elemento isolado e desmonta a barra quando há seis deles lado a lado.

**Medido ao vivo em 05/08/2026** (`/operations`), botão "+" da barra superior
(`ds-button normal_35 SOFT_TO_ACTION --outline --not-text`):

| Propriedade | Valor exato |
|---|---|
| caixa | **35 × 35**, `padding: 0 5px`, `gap: 5px`, raio **5px** |
| fundo | **`#FFFFFF` chapado** (`--color-background`) — não é transparente |
| contorno | **`box-shadow: rgba(27,16,44,.1) 0 0 0 1px inset`** = `--color-neutral-level_2` |
| `border` | **`0px none`** — literalmente ausente |
| ícone | 13,1 × 15, cor `#1A94FF` (`--color-confirmation`) |

Como escrever, nos dois sistemas:

```css
/* DS (Painel, barra superior, rail, widgets) — o anel é sombra inset */
.controle-ds {
  height: 35px; border-radius: 5px;
  background: var(--color-background);
  box-shadow: inset 0 0 0 1px var(--color-neutral-level_2);
  border: 0;                     /* explícito: nada de border aqui */
}

/* Legado (Funil, Negócio, tabela, formulário) — border de verdade */
.controle-legado {
  padding: 5px 10px; border-radius: 5px;
  border: 1px solid var(--color-neutral-level_2);  /* 13×1,5 + 10 + 2 = 31,5px */
  font-weight: 500;
}
```

**A variante decide se existe anel, e isso não se adivinha:**

| Variante | Fundo | Anel |
|---|---|---|
| `SOFT` | transparente | **nenhum** |
| `SOFT_TO_ACTION` | transparente | **nenhum** |
| `SOFT` / `SOFT_TO_ACTION` **`--outline`** | **branco chapado** | inset 1px `neutral-level_2` |
| `ACTION` | chapado na cor | nenhum |

Erro já cometido nesta skill: tratar `SOFT` (transparente, sem anel) como
`SOFT_TO_ACTION --outline` (branco com anel) — o cinza vazou pela barra inteira.
Os ícones soltos da barra (e-mail, sino, chat, agenda, suporte) são `SOFT`:
**fundo transparente e nenhum anel** em repouso; só o "+" é `--outline`.

**Campo de formulário:** o contorno é do **wrapper**, e o `<input>` interno vai
`border:0; outline:0; background:transparent` — dois contornos empilhados produzem
a linha dupla que denuncia formulário montado sem a receita (`forms.md` §3).

**Foco é a única divergência deliberada contra o produto:** o `ds-button` do app
tem `outline: none` e nenhuma regra `:focus-visible`. Não replique essa falha —
acrescente um anel de foco (`box-shadow: 0 0 0 2px rgba(26,148,255,.5)`, que
compõe com a mecânica de anel do sistema) com contraste ≥ 3:1.

## Tamanho de ícone: 13–15px, não 16–20px

**Medido ao vivo em 05/08/2026.** Todo ícone da barra superior e do rail cabe na
faixa **13–15px**, dentro de um alvo de toque de 35 × 35. Desenhar 16, 18 ou 20px
"porque parece certo" engorda a barra inteira — é a divergência mais visível
depois da família de ícone errada.

| Ícone | Tamanho | Cor |
|---|---|---|
| `plus` ("+") | **13,1 × 15** | `#1A94FF` `--color-confirmation` |
| `magnifying-glass` (busca) | **14 × 14** | `#1B102C` `--color-font` |
| `upload` (exportação) | **15 × 15** | `#1A94FF` |
| `circle-check` (exportação concluída) | **10 × 10** | `#3BDDAD` `--color-success` |
| `envelope` · `comment-lines` | **15 × 15** | `#1B102C` |
| `bell` · `calendar-days` · `user-headset` | **13,1 × 15** | `#1B102C` |
| `chevron-down` (dropdown do usuário) | **10 × 10** | `#8B8495` `--color-font-level_2` |
| Ícone de item do rail | **25 × 15** (wrapper 35 × 15) | inativo `#87838D`, ativo `#FFFFFF` |
| Seta do rodapé do rail | **19 × 15** | **`#FBF8FE` branco** — não roxo |

A largura varia (13,1 · 14 · 15 · 19) porque cada ícone tem `viewBox` próprio e a
**altura** é o que está travado. Fixe a altura e deixe a largura seguir a
proporção — `width: auto` ou o valor da tabela; nunca `width == height` para todos.

**Contador de notificação** (`.component__counter-badge`): **17 × 16**, raio
**2px**, fundo **`#FFC01A`** (`--color-alert`), texto `rgb(18,18,18)` em
**10px/700**. É amarelo, não vermelho, e não é pílula — confirmado nos três
contadores da barra (e-mail, sino, agenda) em 05/08/2026.

## Invariantes

Poucas, e essas valem sempre:

1. **Copy em português (pt-BR)**. Sem inglês na UI, exceto nomes próprios e integrações.
2. **Verbos no infinitivo em botões**: "Criar negócio", "Enviar proposta", "Excluir".
3. **Terminologia fixa**: **Negócio · Contato · Cliente · Funil · Estágio · Proposta · Atividade · Automação**. Nunca "Deal", "Lead", "Pipeline", "Stage" na UI.
   **"Estágio", não "Etapa"** — a posição de um Negócio no Funil é Estágio, inclusive no rótulo do campo; "Etapa" só serve para passo de um wizard ou construtor passo-a-passo. A tabela em [Terminologia canônica](#terminologia-canônica) é a fonte única.
4. **Não inventar dado da conta.** Nome de funil, estágio, campo ou usuário vem da conta real. Em mockup sem dado, use exemplo obviamente fictício e diga que é exemplo.
5. **Não inventar API de componente.** Se for reproduzir um componente do DS, as props e variantes são as que estão em `INVENTORY.md`.
6. **Zero controle nativo do browser — em qualquer parte da tela, não só em formulário.** `<select>`, `<input type="date">`, `<button>`, `<table>` e `title=` de tooltip ignoram os tokens e trazem a altura e o realce do sistema operacional. **Vale em toda a tela**: o filtro, o seletor de período e a ordenação no topo de um dashboard ou de uma listagem estão incluídos — não ser formulário não abre exceção. E a verificação é no código, não na tela: um `<select>` fechado tem moldura, chevron e altura plausíveis, e só se distingue de um composto quando aberto. Receita de composição em `forms.md` §4 (campo de opção, e a linha do dropdown de filtro/menu) e §7 (camada flutuante); a tabela completa de equivalências está na seção **HTML nativo tem equivalente no DS**. Única exceção: hora, cor e arquivo, que encapsulam o picker nativo de propósito (`forms.md` §6).
7. **Cor nomeada, não hex solto.** Toda cor sai de um token (`var(--color-*)`) ou de uma variável que você declarou com nome no próprio artefato. O que se proíbe é hex mágico espalhado inline — não é proibido existir cor fora da paleta (ver abaixo).
8. **O roxo da marca é `#7E33E6`.** Nenhum outro roxo representa o Ploomes; roxo escuro acinzentado é a marca antiga (ver [Contrato de tokens](#contrato-de-tokens)).
9. **Formulário segue o contrato de `forms.md`** — grade de 4 colunas, altura única, e seletor de registro com busca e paginação.
10. **Contorno de controle do DS é `box-shadow: inset 0 0 0 1px`, nunca `border`** — e no sistema legado é `border: 1px solid` de verdade. Ver [Contorno](#contorno-box-shadow-inset-no-ds-border-no-legado): `border` soma 2px à caixa e desalinha a barra.
11. **Ícone da barra e do rail tem 13–15px de altura**, não 16–20 — e a largura segue a proporção do `viewBox`, não é igual à altura. Ver [Tamanho de ícone](#tamanho-de-ícone-1315px-não-1620px).
12. **Não montar o logo a partir de peças.** O lockup horizontal é um arquivo único (`assets/horizontal-on-dark.svg`, o mesmo que o app serve como `ploomes_horizontal_logo.svg`) — símbolo `#843CFF` + wordmark branco, `viewBox 0 0 115 15.6`. Compor símbolo + palavra "Ploomes" à mão sai com proporção e cor erradas. **E o rail não tem logo no topo:** o primeiro item já é um módulo; a marca fica no rodapé, só no estado expandido.

## Defaults do produto

Estes são o **padrão**, não uma cerca. Vale sair deles com intenção e dizer por quê.

- **CTA primário azul** `--color-confirmation` `#1A94FF`. O roxo `--color-brand`
  `#7E33E6` é estado ativo, seleção, hover e ênfase — não botão principal.
- **IA = "Ploo"**. Botão inline da IA é discreto (fundo claro, texto roxo); o
  gradient `--gradient-ai` é para hero e badge destacado.
- **Densidade de CRM**: 13/14px no texto corrido, linha de tabela em 40px, header
  em 30px.
- **Raio 5** em quase tudo, inclusive modal e dropdown; **10** em card de
  conteúdo/mídia; `full` em pílula e avatar.
- **Superfície plana é plana**: borda `--color-neutral-level_2`, sem sombra.
  Sombra só em camada flutuante — ver [Sombra](#sombra-borda-xor-sombra). Este é
  um default que raramente vale quebrar: um hero ou uma peça de deck pode pedir
  elevação decorativa, uma tela de módulo praticamente nunca.
- **Tema claro é o padrão. Sempre.** Entregue em light e pare aí. Só produza dark
  quando o usuário **pedir** — "modo escuro", "dark", "tema escuro", ou o pedido
  claramente for sobre isso. Não infira do contexto, não entregue "os dois para
  ele escolher", não adicione um botão de alternância que ninguém pediu.
  O DS **suporta** dark (os tokens têm o par, a classe `.dark` na raiz troca), mas
  suportar não é entregar: escrever dark sem pedido dobra o custo de revisão e
  vira retrabalho quando o usuário só queria a tela.

## Latitude criativa

O DS é o piso de fidelidade, não o teto de ambição. Nas dimensões abaixo,
**decidir grande é o comportamento certo**:

- **Preencher a tela.** Módulo do CRM ocupa a viewport. Um card centralizado com
  três elementos e 60% de vazio é entrega pobre, não entrega sóbria. Use grid,
  colunas, painéis laterais, faixas de métrica, listas densas.
- **Densidade de dado.** CRM é denso por natureza. Na dúvida entre mostrar mais
  ou menos, mostre mais: agregados, totais, contagens, secundários, comparativo
  com período anterior, quem é o responsável, quanto tempo parado. Dado a mais
  bem hierarquizado é valor; tela vazia é fricção.
- **Hierarquia forte.** Um foco por tela, e ele pode ser grande: número em 32px+,
  gráfico dominante, coluna destacada. A escala de texto do produto é o piso do
  corpo, não o limite do título.
- **Movimento.** Animar é parte do acabamento, não enfeite. Entrada em stagger,
  transição de estado, skeleton→conteúdo, número que conta. Rápido e funcional
  (150–300ms), respeitando `prefers-reduced-motion`.
- **Paleta própria quando o pedido pede.** Se o usuário pede outra cor, um tema,
  uma marca, um clima — **obedeça**. Declare as cores como variáveis nomeadas,
  derive uma escala coerente (base, hover, active, superfície com alpha) e
  mantenha o resto do vocabulário. O próprio produto faz isso: whitelabel troca a
  cor da marca da conta inteira (`storybook/foundations/Whitelabel.html`).
- **Gráfico e dataviz.** A paleta semântica do produto (sucesso/alerta/erro) não
  é escala categórica — usar verde e âmbar como série de gráfico apaga a leitura.
  Para gráfico, derive uma escala própria com contraste verificado.
- **Componente que não existe.** Compor um componente novo é normal. A regra é só
  não **reinventar** o que já existe com outro nome — por isso a busca no
  inventário vem antes.

### Isto NÃO é erro

- Layout que não se parece com nenhuma tela existente do produto
- Componente novo, composto por você
- Cor fora da paleta, quando pedida ou quando o artefato pede um clima próprio
- Tipografia maior que 18px em título, número de destaque ou hero
- Espaçamento fora do múltiplo de 5 num hero, dashboard ou peça de deck
- Mais animação do que o produto tem hoje
- Gradiente, ilustração, vazio negativo generoso — quando é decisão, não descuido

O que **é** erro é o oposto de tudo isso: entrega tímida, tela pela metade,
componente reinventado à toa, e jargão/terminologia fora do padrão.

**Uma exceção que não é latitude:** sombra em superfície plana. "Dar profundidade"
a tile, card e painel parece acabamento, mas o DS é plano por definição — elevação
ali significa outra coisa (camada flutuante), e usá-la como decoração desmonta
essa leitura. Ambição de layout se expressa em densidade, hierarquia, cor e
movimento, **não** em elevação. Ver [Sombra](#sombra-borda-xor-sombra).

## Componentes — onde encontrar

**Ordem de busca, sempre:**

1. **`storybook/index.html`** ou a tabela de **`storybook/INVENTORY.md`** — existe? Qual o nome canônico?
2. **`storybook/<categoria>/<Componente>.html`** — como ele é: variantes, estados, medidas, tokens.
3. **`storybook/INVENTORY.md`**, seção do componente — `meta.args` e o código de cada story: é ali que estão os nomes de prop reais (`variant`, `color`, `size`, `active`, `selected`, `leftIcon`, `rightIcon`, …).
4. Não existe? Componha, usando os tokens. Isso é esperado — ver [Latitude criativa](#latitude-criativa).

**Vocabulário de variação** — recorre em quase todo componente, vale memorizar:
`size` (`sm/md/lg` ou `tiny_10…giant_90`) · `color` (`default · brand ·
confirmation · success · alert · danger · ai · neutral · inverse`) · `variant`
(`outline` / `ghost`) · estados `active` / `selected` / `disabled` · slots
`leftIcon` / `rightIcon`.

**Botões são vários componentes, não um só** — escolher errado é erro de
fidelidade: `ButtonAction` (CTA sólido) · `ButtonSoft` (secundário
outline/ghost) · `ButtonSoftToAction` (soft que virou ação, com cor semântica) ·
`ButtonCheck` (seleção) · `ButtonFavorite` (estrela) · `NestedButton`
(ícone-only dentro de outro componente) · `CardButton` (item de lista clicável).

### Ordem num grupo de botões: soft primeiro, action por último

> **O `ButtonSoft` vem antes do `ButtonAction`.** A ação principal é sempre a
> **última** do grupo, na direita.

Vale para rodapé de modal, drawer, card, formulário, linha de lista — qualquer
lugar onde dois ou mais botões aparecem juntos. Não é preferência: é o que o DS
faz em **todos** os casos, sem exceção. Alguns exemplos, na ordem do DOM:

| Componente | Ordem |
|---|---|
| `FooterModal` | Cancelar `soft` → **Salvar** `action` · Cancelar → **Aplicar** · Voltar → **Próximo** |
| `AlertModal` | Cancelar `soft` → **Confirmar** `action` · Cancelar → **Excluir** · Recusar → **Aceitar** |
| `ModalCenter` | Cancelar `soft` → **Criar** `action` |

Consequências que decorrem disso:

- **Vários secundários?** Todos antes, o action ainda por último —
  `AlertModal` faz `Voltar` `soft` → `Cancelar` `soft` → **`Confirmar`** `action`.
- **Ação destrutiva continua sendo o `action`**, não um soft: `Cancelar` `soft` →
  **`Excluir`** `action`. O peso vem da cor (`danger`), não de rebaixar o botão.
- **Grupo sem ação principal** — quando os botões são pares entre si, como no
  `ActionDock` (`Duplicar` · `Excluir`) — é **só soft**, nenhum action.
- **Alinhamento**: o grupo vai à direita (`justify-end`, gap 10px). Use
  `justify-between` só quando houver um elemento à esquerda (um "Voltar" de
  wizard, uma contagem, um link auxiliar).

**Erro típico:** pôr o CTA azul primeiro e o secundário depois — "Concluir"
`action` seguido de "Editar" `soft`. Fica ao contrário do produto inteiro. O
certo é "Editar" `soft` → "Concluir" `action`.

**Estado de tela vazia/carregando/erro tem componente próprio:** `EmptyLabel`,
`Loader`, `Skeleton`, `Spinner`, `Toaster`, `AlertMessage`, `AlertModal`.

### Feedback ao usuário é provider global, não componente que você monta

`Toaster` e `AlertModal` são **providers** montados uma vez na raiz; você os
**chama** de qualquer lugar (`addToast({ type, title, message })`,
`addAlertModal({ title, message, onConfirm })`). Não construa uma pilha de
notificação nem um modal de confirmação do zero — e não deixe de dar retorno só
porque "não tem onde colocar o toast": o lugar já existe.

Consequência prática: **toda operação que o usuário disparou e que grava tem
retorno.** Salvou, criou, excluiu, enviou → toast de sucesso. Falhou → toast de
erro com o que fazer. Sem retorno, o usuário não sabe se funcionou e repete a ação.

### HTML nativo tem equivalente no DS — use o do DS

Um `<select>`, `<input type="date">` ou `<button>` cru sai do padrão visual **e
quebra dark mode e whitelabel**, porque não lê os tokens. A tabela completa de
equivalências está em **`storybook/INVENTORY.md`, seção "Não use HTML nativo"** —
consulte-a ao montar formulário ou controle. As que mais aparecem:

| Em vez de | Use |
|---|---|
| `<select>` / `<select multiple>` | `Field07Options` (`options`, `multiple` → chips) |
| `<input type="text">` · `<textarea>` | `Field01TextSimple` · `Field02TextMultiline` |
| `<input type="number">` | `Field04NumberInteger` · `Field06NumberDouble` · R$ `Field05NumberCurrency` · % `Field13NumberPercentage` |
| `<input type="date">` · `time` | `Field08Date` · `Field09Time` |
| `<input type="checkbox">` | `Field10Checkbox` (dropdown Sim/Não ou toggle) |
| `<button>` | `ButtonAction` · `ButtonSoft` · `ButtonCheck` · `NestedButton` · `CardButton` |
| `<table>` | `Table` · arrastável `GridView` · ficha `DataView` |
| `<dialog>` / modal ad-hoc | `ModalCenter` · `ModalSide` · `ModalFloating` · `AlertModal` |
| menu/dropdown ad-hoc | `Dropdown` · hierárquico `DeepSelector` |
| `title=""` como tooltip | `Tooltip` |
| `<details>` / accordion | `Collapse` |
| `<progress>` | `ProgressBar` |
| `<nav>` / tabs | `HorizontalTabs` · `HorizontalMenu` · `VerticalMenu` · `Breadcrumbs` |

Hora, cor e arquivo **encapsulam de propósito** o picker nativo do browser — o
componente do DS entra em volta, trazendo label, validação, tamanhos e tema. Data
faz o mesmo: texto mascarado `dd/mm/aaaa` + botão de calendário que chama
`showPicker()` num `<input type="date">` invisível sobre a caixa do campo.

**No scaffold esses componentes não são importáveis — então você os compõe, e a
anatomia está escrita.** `forms.md` traz medidas, tokens, estados e teclado de
campo, campo de opção, dropdown, seletor de registro com busca e paginação, data e
camada flutuante. Não haver componente importável **não libera o controle cru**:
`<select>` e `<input type="date">` nus trazem a altura e o realce do sistema
operacional, ignoram os tokens e não têm dark mode nem whitelabel. A composição é
o caminho normal aqui, não uma saída de emergência.

Isso não contradiz a [latitude criativa](#latitude-criativa): compor um
componente que o DS **não tem** é livre. O que não vale é usar o controle cru do
browser no lugar de um que existe.

## Campos de formulário

Todo formulário do Ploomes é feito de **campos**, e cada tipo corresponde a um
TypeId de campo personalizado da conta. Abra a página do tipo em
`storybook/fields/` antes de montar o form — ela mostra o campo em todos os
estados e modos.

| Tipo | Página |
|---|---|
| Texto simples / longo / rich text | `Field01TextSimple` · `Field02TextMultiline` · `Field02TextEditor` |
| Número inteiro / decimal / moeda / porcentagem | `Field04NumberInteger` · `Field06NumberDouble` · `Field05NumberCurrency` · `Field13NumberPercentage` |
| Data / hora | `Field08Date` · `Field09Time` |
| Opção (única/múltipla) | `Field07Options` |
| Sim/não | `Field10Checkbox` |
| Telefone / CPF / CNPJ / endereço | `Field07Phone` · `Field11CPF` · `Field12CNPJ` · `Field17Address` |
| Cor | `Field20Color` |
| Imagem / anexo | `Field18Image` · `Field19Attachment` |
| Código | `Field22Developer` |

Anatomia comum: header (label + validação) → **wrapper com contorno** → helper.
Estados `error` / `alert` / `disabled`; foco via `:focus-within`.

**Cinco regras que decidem se o formulário parece do Ploomes** — o detalhamento,
com CSS pronto nos tokens, está em **`forms.md`**:

1. **Largura sai da grade, não do campo.** O formulário é uma grade de **4
   colunas iguais** com `gap: 20px`; o campo é sempre `width: 100%` da célula e
   ocupa **`span 2` (50%, o default)** ou **`span 4` (100%)**. `span 1`/`span 3`
   só quando a configuração do campo na conta pede. Em modal, drawer ou coluna
   lateral, o produto clampa em 2 colunas: as larguras possíveis são **50% e
   100%, nada mais**. Largura em px, `%` solto ou `flex: 1` num campo é desvio.
2. **Altura única no formulário inteiro: 30px** (`sm` é o default de `theme=form`
   — não 35). 35px é para busca dentro de painel; 40px é o default de **célula de
   tabela**; 60px só para texto longo. Alturas diferentes entre campos vizinhos
   quebram a linha da grade, e a origem costuma ser um controle nativo trazendo a
   altura do sistema operacional.
3. **Contorno é do wrapper.** O `<input>`/`<textarea>` interno é `border:0;
   outline:0; background:transparent`; adornos (ícone, chevron, `R$`, `%`, botão)
   entram nos slots laterais. Borda no input interno soma uma segunda linha →
   contorno duplo.
4. **Obrigatório é ícone de validação + tooltip "Campo obrigatório"**, 10px em
   `font-level_2` ao lado do label — **não** asterisco vermelho. Label 14px com
   `padding-bottom: 5px`; helper/erro 13px em `padding: 3px 10px 0`.
5. **Campo que aponta para registro da conta (Cliente, Responsável, Produto) tem
   busca, paginação e identidade visual.** Lote de **20** com rolagem infinita,
   busca com foco automático no painel, e cada linha com o que identifica o
   registro — **foto do usuário** (`AvatarUrl`) + e-mail, ou ícone
   pessoa/empresa + razão social + documento no contato, com o trecho buscado em
   negrito. A coleção inteira num dropdown não é uma variação aceitável do padrão:
   a conta tem milhares de contatos, e o produto nunca lista todos.

## Padrões de copy

| Situação | Padrão |
|---|---|
| Botão primário | Verbo + objeto: "Criar negócio", "Salvar alterações" |
| Botão secundário | "Cancelar", "Voltar", "Fechar" |
| Confirmação destrutiva | "Excluir" + nome do recurso. Diálogo: "Excluir negócio?" |
| Empty state | "Nenhum [recurso] [contexto]." + CTA |
| Toast sucesso | Particípio: "Negócio criado", "Proposta enviada" |
| Toast erro | O que aconteceu + o que fazer |
| Loading | "Carregando…" ou processo específico: "Enviando proposta…" |

Voz: direta e operacional, verbo no infinitivo em ação, segunda pessoa implícita
("Minhas tarefas"), números concretos ("3 negócios atrasados", não "alguns
negócios precisam de atenção"), zero jargão de marketing. Proibidos: empoderar,
jornada, sinergia, unleash, journey. Em estado consumado, presente do indicativo
("Negócio criado"). Público é B2B comercial — gestor, SDR, closer.

### Terminologia canônica

| Termo | Uso | Nunca |
|---|---|---|
| **Negócio** | A oportunidade no funil | Deal, Oportunidade |
| **Contato** | Pessoa física | Lead, Person |
| **Cliente** | Pessoa jurídica / empresa | Account, Company |
| **Funil** | O fluxo de estágios | Pipeline |
| **Estágio** | A posição do Negócio dentro do Funil | Stage, **Etapa** |
| **Proposta** | Documento comercial | Quote |
| **Atividade** / **Tarefa** | Compromisso vinculado | Task |
| **Automação** | Regra que dispara sozinha | Workflow |

⚠️ **"Estágio", não "Etapa"** — inclusive no rótulo do campo. "Etapa" só serve
para passo de wizard ou construtor passo-a-passo.
Esta linha já esteve escrita das duas formas em arquivos diferentes desta skill;
a tabela acima é a fonte única.

## Exemplo end-to-end: comando → entrega

**Usuário:** "quero acompanhar meus negócios por etapa"

**Resolução (raciocínio explícito antes do código):**

1. **Existe no DS?** Kanban inteiro não; as peças sim — `Card` (o card do
   negócio), `Badge` (estágio, marcador), `ProfileImage`/`ProfileGroup`
   (responsável), `DraggableList` (reordenar), `EmptyLabel` (coluna vazia),
   `Skeleton` (carregando). Abrir cada uma e copiar anatomia e medidas.
2. **Compor o que falta**: a coluna do funil e a régua horizontal do quadro não
   existem como componente — são minhas, nos tokens. Isso é esperado.
3. **Preencher a tela**: quadro em largura total, colunas com scroll próprio,
   faixa de métrica no topo (total em aberto, valor por estágio, quantos parados).
   Não é "extra": é o que faz a tela servir para acompanhar.
4. **Hierarquia**: valor total em destaque grande; título de coluna com contagem
   e soma; card denso mas legível (cliente, valor, responsável, dias parado).
5. **Cor**: estágio ganha cor de identidade — deriva da paleta ou da cor do
   estágio configurada na conta. Sucesso/perda só nos estados terminais.
6. **Superfície**: coluna, card e faixa de métrica estão no fluxo da página →
   **borda `neutral-level_2`, sombra nenhuma**. Sombra entra só se abrir um menu
   de ações no card (`4dp`) ou o drawer do negócio (`24dp`).
7. **Movimento**: colunas entram em stagger; card reage no hover (fundo
   `neutral-level_1`, não sombra); número da faixa conta ao carregar.
8. **Copy**: "Negócio", "Estágio", "Funil"; empty de coluna "Nenhum negócio
   neste estágio." + "Criar negócio".
9. **Estados**: skeleton no carregamento, `EmptyLabel` no funil sem negócio,
   `AlertMessage` no erro.

O que **não** fazer aqui: um card centralizado listando negócios em texto, três
colunas fixas sem métrica, `1dp` em cada card "para dar profundidade", ou
reinventar um `Badge` porque não olhei o inventário.

## Checklist antes de entregar

Num módulo do CRM, este checklist não é auto-avaliação: percorra-o item por
item e com evidência — `arquivo:linha`, contagem de `grep` ou o que se vê no
screenshot. Os itens de **comportamento** (os quatro estados, notificação,
terminologia, nada que corta sem escape) não são do design system — vivem na
skill irmã `frontend-docs`, e não se repetem aqui.

**Fidelidade**

1. Procurei o componente em `storybook/` antes de escrever do zero — e usei o nome canônico?
2. Terminologia: Negócio (não Deal), Contato/Cliente (não Lead), Funil (não Pipeline), Estágio (não Stage, não Etapa)?
3. Verbos em botões no infinitivo (Criar, Salvar) — não imperativo (Crie, Salve)?
4. Toda cor é token ou variável nomeada — nenhum hex mágico inline?
5. CTA primário azul (ou a cor que o usuário pediu, aplicada com escala coerente)?
6. **Em todo grupo de botões, o `soft` vem antes e o `action` é o último, à direita?**
7. **Nenhum elemento com borda E sombra juntos?** Toda superfície no fluxo da página está com borda e **sem** `box-shadow`, e só o que flutua (dropdown `4dp`, modal/drawer `24dp`) tem sombra?
8. No DS novo, pesos `300/400/600/700` (sem 500), raio `5` no geral e `10` em card de conteúdo? No legado, use 500/900 apenas onde `geometria-do-produto.md` mediu esses pesos.
9. Nenhum `<select>`, `<input type="date">`, `<button>` cru ou `title=""` de tooltip onde o DS tem componente — **inclusive nos filtros e no seletor de período da tela**, que não são formulário e valem igual? (Confira no código: fechado, um `<select>` é indistinguível de um composto.)
10. Está em **light**? (dark só se o usuário pediu — e aí, funcionando via `.dark`)
11. Em campos: contorno no wrapper, input interno sem borda (evitar contorno duplo)?
12. Se é módulo React: nenhum `import` de `@ploomescrm/ui`, nenhuma classe Tailwind copiada do snapshot?
13. O roxo padrão é `#7E33E6`; exceções medidas do app (rail, botão de IA e arquivos de marca) vieram de `geometria-do-produto.md`, não de aproximação no olho?
14. **Formulário**: grade de 4 colunas com campos em 50%/100%, **uma só altura** (30px), nenhum controle nativo visível, e obrigatório marcado com ícone (não asterisco)?
15. **Seletor de Cliente / Responsável / Produto**: tem busca, carrega em lotes de 20 com rolagem infinita, e mostra foto + linha secundária em cada registro?
16. **Camada aberta** (dropdown, painel de opção, seletor): portal no `body`, `position: fixed`, `z-index: 60`, fecha em Escape e clique fora?
17. **Estados e movimento**: comparei hover, active, focus, tooltip, dropdown e duração com `geometria-do-produto.md` (seção "Estados, movimento e iconografia") — sem inventar animação que a produção não usa?

**Ambição** — igualmente obrigatório

1. A tela está **cheia**? Ocupa a viewport, ou sobrou vazio sem propósito?
2. Tem densidade de CRM — números, agregados, secundários — ou ficou uma casca?
3. Tem um foco visual claro e grande, ou tudo tem o mesmo peso?
4. Tem movimento no carregamento e nos estados?
5. Cobri vazio, carregando e erro?
6. Se o usuário pediu uma cor/tema específico, eu **obedeci** — em vez de cair no default do produto?

## Logos

Em `assets/`. O nome diz **composição** + **tinta ou fundo de destino**:
`<símbolo|horizontal|vertical>-<tinta ou on-light/on-dark>.<ext>`.

**Símbolo** (só a folha)

| Arquivo | Tinta | Usar em |
|---|---|---|
| `symbol-purple.svg` | `#7E33E6` (= `--color-brand`) | **padrão** — funciona em fundo claro e escuro |
| `symbol-purple.webp` | `#7D40FF` | mesma coisa, para deck/print |
| `symbol-white.svg` | branco | fundo escuro ou colorido |
| `symbol-dark.svg` · `symbol-dark.webp` | `#181526` · `#1C0D42` | monocromático, fundo claro |

**Horizontal** (símbolo + "Ploomes" lado a lado)

| Arquivo | Usar em |
|---|---|
| `horizontal-on-light.svg` | fundo claro — símbolo roxo + texto escuro, fundo transparente |
| `horizontal-on-dark.svg` | fundo escuro/colorido — símbolo roxo + texto branco |
| `horizontal-on-light-plate.svg` | sobre foto ou cor imprevisível — mesma arte, com **chapa branca embutida** |

**Vertical** (símbolo sobre "Ploomes")

| Arquivo | Usar em |
|---|---|
| `vertical-on-light.webp` | fundo claro — símbolo roxo + texto escuro |
| `vertical-on-dark.webp` | fundo escuro — símbolo roxo + texto branco |
| `vertical-mono-dark.webp` | 1 cor escura (`#1C0D42`), fundo claro |
| `vertical-mono-black.svg` | 1 cor preta — **ver ressalva abaixo** |

**App icon / favicon** — símbolo branco em quadrado roxo arredondado:
`favicon-32.webp` (aba) · `favicon-128.webp` (home screen) · `favicon-256.webp` (loja).

Regra: SVG sempre que existir; **nunca recriar o logo em código**. Para deck/print
onde SVG não pode ser embutido, usar a `.webp` correspondente.

**Ressalvas conhecidas destes arquivos:**
- `vertical-mono-black.svg` tem o `<defs>` **vazio** — o bloco `<style>` que
  definia as classes `.cls-1`/`.cls-2` se perdeu no export, então ele renderiza
  preto puro e **não** dá para recolorir. Se precisar do lockup vertical colorido
  em vetor, ele não existe aqui: use `vertical-on-light.webp`.
- O roxo varia entre arquivos: `#7E33E6` (o token da marca), `#7D40FF` e `#843CFF`
  (app icon e horizontais). Ao compor UI em volta, use o token
  `--color-brand`; a diferença é do arquivo, não sua.

**Conta com whitelabel** tem marca própria — cor e logo vêm da conta, não daqui.
Ver `storybook/foundations/Whitelabel.html`.

## Fonte de verdade

1. **O código do design system** vence sempre, se você tiver acesso a ele.
2. **`storybook/`** — snapshot renderizado, gerado em 2026-07-29. Autoritativo
   sobre o DS **novo** até alguém regerar o snapshot de uma versão nova.
3. **[`geometria-do-produto.md`](geometria-do-produto.md)** — autoritativo sobre
   o que o storybook não captura: chrome montado (rail, barra superior),
   sistema **legado** (Funil, Negócio, tabela), e a lista do que não tem token
   equivalente. Atualizado com medição direta no app em 06/08/2026; **se um print recente da
   tela discordar deste arquivo, o print vence** — o produto muda.
4. Quando o DS divergir do **produto em produção**, priorize o que o usuário vê
   na tela hoje e **sinalize a divergência** na resposta quando ela for relevante
   para a decisão de design.

**Esta skill tem três arquivos de conteúdo, e cada assunto vive em um só:**
`SKILL.md` (as regras e os tokens) · `geometria-do-produto.md` (a régua medida no
app, incluindo estados e ícones) · `forms.md` (o contrato de formulário). Mais
`storybook/` (a forma renderizada), `ploomes-produto.css` (o que não tem story),
`assets/` (marca) e `fonts/`. **Não crie um quarto arquivo de doc**: já houve
`README.md` e `interacoes-e-iconografia.md` duplicando estes, e a duplicação
produziu uma contradição real — um dizia "Etapa" onde o outro dizia "Estágio".

**Mockup é saída, não conteúdo desta skill.** Não guarde telas produzidas aqui:
elas envelhecem sem sinal e passam a competir com as regras como fonte de
verdade. O que fica é a régua para produzi-las.
