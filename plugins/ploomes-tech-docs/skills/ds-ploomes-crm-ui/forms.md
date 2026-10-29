# Formulários e seletores — a grade, as medidas e as receitas

Formulário é a parte do produto com menos latitude. A grade, a altura do campo e a
mecânica dos seletores são **contrato**: o usuário preenche formulário do Ploomes
todos os dias, e qualquer desvio nessas três dimensões é percebido na hora, antes
do conteúdo da tela.

As medidas abaixo saem do **código do design system** (`Field*`, `Dropdown`,
`DeepSelector`, `SearchInput`, `useFloatingDropdown`) e da **grade real do
formulário do produto** — não são preferência. Nada aqui contradiz a
[latitude criativa](./SKILL.md#latitude-criativa): a liberdade está no layout da
tela, não na mecânica de um campo.

> **Contexto do scaffold:** `@ploomescrm/ui` não é dependência aqui, então você
> **compõe** cada campo em CSS próprio nos tokens. As receitas abaixo não são
> "inspiração": são a anatomia a reproduzir. Falta de componente importável não é
> motivo para usar o controle cru do browser.

---

## 1. A grade: 4 colunas, e a largura sai do span

O formulário do Ploomes é uma **grade de 4 colunas iguais**. Campo não tem
largura própria: ele preenche a célula, e a largura é quantas colunas ele ocupa.

```css
.form-section__content {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 20px;          /* gap entre campos — sempre 20 */
  padding: 15px;
  width: 100%;
}

.form-field            { grid-column: span 2; }  /* DEFAULT: 50% */
.form-field--wide      { grid-column: span 4; }  /* 100% */
.form-field--narrow    { grid-column: span 1; }  /* 25% — só quando a conta pede */
.form-field--large     { grid-column: span 3; }  /* 75% — só quando a conta pede */
.form-section          { grid-column: 1 / -1; }  /* seção ocupa a linha inteira */
```

**As regras:**

- **O default é `span 2` — 50%.** Um campo sem motivo para ser diferente é meio.
- **`span 4` (100%)** para o que é naturalmente longo: texto longo, editor,
  endereço, anexo, lista de produtos, e o título/nome do registro.
- **`span 1` e `span 3` existem, mas não são sua escolha** — vêm da configuração
  do campo na conta (`ColumnSize`). Se você não está lendo essa config, não use.
- **Container estreito — modal, drawer, coluna lateral — clampa em 2 colunas.**
  É o que o produto faz: no formulário embutido ele limita o span máximo a 2, e
  as larguras possíveis passam a ser **50% e 100%, nada mais**. Numa tela de
  módulo dentro de modal, é isso que você tem.
- **Nunca largura em px, `%` solto ou `flex:1` num campo.** Largura de campo é
  sempre número de colunas. Dois campos vizinhos com larguras que não são fração
  da grade — um "Valor" estreito ao lado de uma "Moeda" larga — é layout em flex
  ocupando o lugar da grade.
- `minmax(0, 1fr)` não é detalhe: sem o `minmax`, um valor longo estica a coluna
  e desalinha a linha toda.

**Seção** (o "PRINCIPAIS", "OUTRAS INFORMAÇÕES" do produto): ocupa a linha
inteira, cabeçalho de **50px**, rótulo **14px semibold** `var(--color-font)`,
sublabel 14px regular `var(--color-font-level_2)`, e o conteúdo é outra grade de
4 colunas. O padrão de cabeçalho de bloco em ficha de registro é 13px
**maiúsculo** com borda inferior `neutral-level_2` (é o que o `DataView` faz).
Escolha um dos dois e mantenha em toda a tela.

---

## 2. Alturas: uma só por formulário

| Tamanho | Altura | Onde |
|---|---|---|
| `sm` | **30px** | **default de campo em formulário** — é este que você usa |
| `md` | 35px | busca dentro de painel/seletor, formulário deliberadamente mais folgado |
| `lg` | 40px | **default em célula de tabela** (`theme=cell`) |
| `xl` | 60px | só texto longo / multiline (default dele em formulário) |

- **Todos os campos do mesmo formulário têm a mesma altura.** Altura é do
  formulário, não do campo: um campo não escolhe a sua. Vizinhos com alturas
  diferentes quebram a linha da grade, e a origem costuma ser um controle nativo
  (`<input type="date">`, `<select>`) trazendo a altura do sistema operacional —
  30px é a medida; 32, 34 ou 38 significam que o campo não passou pela receita.
- Multiline é a **única** exceção legítima (60px), porque é uma caixa de texto.
- Chips dentro de um campo de opção múltipla acompanham: 25px (`sm`), 30px
  (`md`), 35px (`lg`).

---

## 3. Anatomia do campo

Header (label + validação) → **wrapper com o contorno** → helper. O contorno é
**sempre do wrapper**; o controle interno é transparente e sem borda.

```css
/* wrapper — é ele que tem borda, raio e foco */
.field__frame {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;                                  /* preenche a célula da grade */
  height: 30px;                                 /* a altura do formulário */
  padding: 0 10px;
  gap: 10px;
  background: var(--color-background);
  border: 1px solid var(--color-neutral-level_2);
  border-radius: 5px;
  transition: border-color var(--transition-quickly);
}
.field__frame:hover        { border-color: var(--color-font-level_2); }
.field__frame:focus-within { border-color: var(--color-confirmation); }
.field__frame--danger      { border-color: var(--color-danger); }
.field__frame--alert       { border-color: var(--color-alert); }
.field__frame--disabled    { background: var(--color-neutral-level_1); }

/* controle interno — zerado, sempre */
.field__frame input,
.field__frame textarea {
  flex: 1;
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  font-size: 14px;
  color: var(--color-font);
}
.field__frame input::placeholder { color: var(--color-font-level_2); }
```

**Label e mensagens:**

- Label: **14px**, `line-height: 18px`, `var(--color-font)`, `padding-bottom: 5px`.
- **Obrigatório não é asterisco vermelho.** O DS marca com um **ícone de
  validação** de 10px em `font-level_2` ao lado do label, com tooltip "Campo
  obrigatório". Os outros marcadores da mesma faixa: chave, máscara, fórmula,
  info, alerta.
- Contador `atual/máximo`: 13px `font-level_2`, alinhado à direita na linha do label.
- Helper / erro: **13px**, `line-height: 18px`, `padding: 3px 10px 0`,
  `font-level_2` — e `var(--color-danger)` quando é erro.
- Carregando: barra `neutral-level_1` pulsando dentro do frame (não troque o
  campo por um spinner).

**Foco em célula de tabela** (`theme=cell`) é diferente: borda de 0.5px, sem
raio, e no foco ganha `box-shadow`/ring de 2px em `confirmation-default_30`.

---

## 4. Campo de opção (o substituto do `<select>`)

`<select>` nativo não é uma opção neste produto: ele ignora os tokens, não tem
dark mode nem whitelabel, e pinta o item selecionado com o realce do sistema
operacional. A anatomia a reproduzir:

**Gatilho** = o `.field__frame` acima, com `role="combobox"`,
`aria-haspopup="listbox"`, `aria-expanded`, `tabIndex=0`, abrindo no clique,
Enter/Espaço e fechando no Escape:

- placeholder: 14px `font-level_2`;
- chevron 15px à direita — `chevronDown` fechado, `chevronUp` aberto, em
  `font-level_2` e **`confirmation` quando aberto**;
- aberto, a borda do gatilho vira `confirmation`;
- com valor único selecionado, o chip preenche a linha e o chevron **desaparece**;
- múltiplo: chips com botão de remover; `padding: 2.5px 10px 2.5px 2.5px`,
  `min-height` no lugar de `height`.

**Painel de opções** (portal no `body`, `position: fixed` — ver §7):

```css
.options-menu {
  max-height: 265px;            /* o cap do DS para lista de opção de campo */
  overflow-y: auto;
  padding: 5px 0;
  background: var(--color-background);
  border-radius: 5px;
  box-shadow: var(--shadow-4dp);   /* sombra sim, borda NÃO */
}
.options-menu__item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  height: 40px;                 /* linha de opção = 40px */
  padding: 0 15px;
  font-size: 14px;
  color: var(--color-font);
  text-align: left;
  cursor: pointer;
  transition: background-color var(--transition-quickly);
}
.options-menu__item:hover  { background: var(--color-neutral-level_1); }
.options-menu__item:active { background: var(--color-neutral-level_2); }
.options-menu__item img    { width: 20px; height: 20px; border-radius: 9999px; object-fit: cover; }
.options-menu__empty {
  display: flex; align-items: center; height: 40px; padding: 0 15px;
  font-size: 13px; color: var(--color-font-level_1);
}
```

- Vazio: uma linha de 40px com **"Nenhum resultado encontrado"**.
- A opção já selecionada **sai da lista** (não fica marcada) no padrão do campo
  de opção único/múltiplo.
- Cada linha aceita **imagem redonda de 20px** ou ícone de 20px à esquerda — é
  por aqui que entra a foto do usuário.

**Dropdown de ação / filtro / menu** é outro componente (não é campo):
painel de **200px**, `padding: 5px`, `gap: 5px`, raio 5, `var(--shadow-4dp)`,
`max-height: 340px` quando rola. Linha: 35px (ou **55px** quando tem subtítulo),
`padding: 0 10px`, `gap: 10px`, raio 5, hover `neutral-level_1`, active
`neutral-level_2`, foco `ring 2px confirmation` com offset 1, desabilitado a 40%
de opacidade. Rótulo 14px; subtítulo 13px `font-level_1`; ícone 15px em slot de
20px; imagem 20px redonda. Separador: `padding: 10px 5px 0`, título opcional
13px `font-level_2`, régua de 1px `neutral-level_2`.

---

## 5. Seletor de registro da conta (Cliente, Responsável, Produto)

Campo que aponta para um registro da conta — Cliente/Contato,
Responsável/Usuário, Produto, Negócio — **nunca** é uma lista completa. Não é
questão de tamanho de tela: a conta tem milhares de contatos e centenas de
usuários, e o produto sempre resolve isso do mesmo jeito — buscando no servidor e
trazendo um lote por vez.

O contrato, em três partes que **não são opcionais**:

1. **Busca dentro do painel**, com foco automático ao abrir.
2. **Resultado paginado, em lotes de 20**, com o lote seguinte carregando quando
   a lista chega perto do fim (rolagem infinita) — nunca um "carregar mais" que
   o usuário precisa achar, nunca `$top` alto para "trazer tudo".
3. **Cada linha identifica o registro**: Usuário vai com **a foto** (`AvatarUrl`)
   e o e-mail na linha secundária; Contato vai com ícone de pessoa/empresa,
   razão social e documento; e o trecho que casou com a busca vem em **negrito**.

O comportamento completo (cascata de busca, dedupe, cancelamento, ordenação)
está na doc de frontend, `dados-e-listagem.md`. A forma é esta:

```css
.record-picker {                     /* painel flutuante do seletor */
  display: flex; flex-direction: column;
  width: 350px;                      /* 350 é o padrão do DS para este painel */
  max-height: 420px;
  background: var(--color-background);
  border-radius: 5px;
  box-shadow: var(--shadow-8dp);     /* 8dp: é um seletor, não um menu */
  overflow: hidden;
}
.record-picker__search { display: flex; gap: 5px; padding: 10px; flex-shrink: 0; }
.record-picker__list   { flex: 1; min-height: 0; overflow-y: auto; padding: 0 10px 5px; }

.record-picker__row {                /* linha de registro: 35px, COM borda */
  display: flex; align-items: center; gap: 5px;
  height: 35px; padding: 0 5px;
  background: var(--color-background);
  border: 1px solid var(--color-neutral-level_2);
  border-radius: 5px;
  transition: background-color var(--transition-quickly);
}
.record-picker__row:hover  { background: var(--color-neutral-level_1); }
.record-picker__row:active { background: var(--color-neutral-level_2); }
.record-picker__avatar { width: 20px; height: 20px; border-radius: 9999px; object-fit: cover; flex-shrink: 0; }
.record-picker__name   { font-size: 14px; color: var(--color-font); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.record-picker__meta   { font-size: 13px; color: var(--color-font-level_1); }
.record-picker__group  { font-size: 12px; font-weight: 600; color: var(--color-font-level_2); padding: 0 5px; }
```

- **Campo de busca** = o `SearchInput` do DS: 35px (`md`), fundo
  `neutral-level_1`, borda transparente que vira `confirmation` no
  `:focus-within`, ícone 15px à direita que troca de **lupa** para **limpar**
  quando há texto. Ele **não** tem o contorno do campo de formulário.
- **Carregando**: **7 linhas-fantasma** de 35px em `neutral-level_1` pulsando —
  não um spinner no meio do painel. `role="status"`,
  `aria-label="Carregando opções"`.
- **Carregando o próximo lote**: sentinela no fim da lista com spinner de 20px em
  `confirmation`. É esse elemento que o `IntersectionObserver` observa.
- **Vazio**: o padrão de estado vazio do DS (ícone + texto), "Nenhum resultado
  encontrado" — não uma linha de texto solta.
- **Teclado**: ↑/↓ e Tab andam pelas linhas, Enter seleciona, Escape fecha.
- **Avatar sem imagem**: `AvatarUrl` vazio cai em **ícone genérico de pessoa** no
  mesmo recorte circular de 20px — **nunca** iniciais do nome nem círculo
  colorido com letras: o produto não gera avatar de iniciais nem cor por usuário.
  O slot é reservado do mesmo jeito, para o texto não dançar entre linhas.
- **Tamanhos canônicos do avatar de usuário**: 20px em item de lista, chip e
  célula de "Responsável"; 25px em comentário, timeline e ficha inline; 40–50px
  em cabeçalho de ficha e modal de detalhes.
- Quando o seletor navega em hierarquia (funil → etapa, família → produto), a
  linha ganha um botão aninhado de 25px com `chevronRight` à direita, e o
  caminho aparece como breadcrumb no cabeçalho do painel.

**O valor selecionado no gatilho** é um chip com a mesma foto de 20px + o nome, e
o botão de remover à direita — não texto solto.

---

## 6. Data, hora, cor e arquivo: a única forma legítima de usar o controle nativo

No formulário, data é campo do produto — não o controle de data do browser, que
traz altura, ícone e tipografia próprios. O nativo entra, mas por dentro:

- O campo é um **texto mascarado** `dd/mm/aaaa` (`inputMode="numeric"`) dentro do
  `.field__frame` normal, com o valor mascarado na digitação.
- À direita, um botão de ícone `calendar` de 15px em `font-level_2`.
- O `<input type="date">` **existe**, mas escondido: `position:absolute; inset:0;
  width:100%; height:100%; opacity:0; pointer-events:none; z-index:-1`. O botão
  chama `showPicker()` nele — o browser ancora o calendário na caixa do campo, e
  o usuário vê o calendário nativo saindo do campo do Ploomes.
- O valor volta em ISO e é reexibido mascarado. Mesmo padrão em hora
  (`showPicker()`), cor (`<input type="color">` sobreposto ao swatch) e arquivo.

Data relativa ("Hoje", "Últimos 30 dias") é um segundo controle ao lado do
campo — dois frames com `gap: 5px`, o de opção com largura fixa.

---

## 7. Toda camada aberta: portal no body, `position: fixed`

Painel de opção, dropdown, seletor e popover **saem do fluxo** e são renderizados
por portal no `<body>`, posicionados com `position: fixed`. Isso não é
preferência: dentro de um modal, drawer ou container com `overflow`, um painel
`absolute` é **cortado** ou faz o container crescer.

O contrato do DS (`useFloatingDropdown`):

- `position: fixed`, coordenadas calculadas do `getBoundingClientRect()` do
  gatilho, **gap de 1px**;
- largura **igual à do gatilho** por padrão (`matchWidth`) — o painel de campo
  acompanha a largura do campo; painel de largura própria (200/350px) é o do
  menu e do seletor;
- `z-index: 60` — acima do modal (que é 50), senão o painel abre atrás;
- **flip só quando precisa**: abre para baixo, e só sobe se não couber abaixo
  **e** houver mais espaço acima;
- `max-height` = `min(cap de design, espaço até a borda da viewport - 8px)`;
- **fecha** em `pointerdown` fora (contando gatilho e painel como "dentro") e em
  Escape; **reposiciona** em `scroll` (com captura, para pegar scroll de
  ancestral) e `resize`;
- invisível até a primeira medição, para não piscar em (0,0).

Sombra na camada flutuante e **nunca borda junto** — 4dp em menu/picker de campo,
8dp em seletor/painel, 24dp em modal/drawer. Ver
[Sombra](./SKILL.md#sombra-borda-xor-sombra).

---

## 8. Rodapé, escrita e retorno

- Ordem dos botões: **soft antes, action por último à direita**, gap 10px. Ver
  [a seção de botões](./SKILL.md#ordem-num-grupo-de-botões-soft-primeiro-action-por-último).
- O `action` fica **desabilitado** enquanto a validade agregada do formulário
  falha — e o motivo aparece no campo, não só no botão.
- Toda gravação termina em **toast**: sucesso no particípio ("Negócio criado") ou
  erro com o que fazer. Sem retorno, o usuário repete a ação.
- Campo que só existe depois de o registro ser criado não entra como campo
  desabilitado explicando isso no placeholder: ou fica fora do formulário de
  criação, ou vira texto auxiliar da seção.

---

## Checklist de formulário

1. A grade é de 4 colunas com `gap: 20px`, e cada campo é `span 2` (50%) ou
   `span 4` (100%)? Em modal/drawer, só 50% e 100%?
2. **Todos** os campos têm a mesma altura (30px), e nenhum controle nativo trouxe
   altura própria?
3. Nenhum `<select>`, `<input type="date">` visível, `<input type="time">` ou
   botão cru — cada um pela receita das §4 e §6?
4. O contorno está no wrapper e o input interno está zerado (sem contorno duplo)?
5. Obrigatório está marcado com o ícone de validação + tooltip, e não com
   asterisco vermelho?
6. Cliente / Responsável / Produto têm **busca**, **lotes de 20 com rolagem
   infinita** e **foto + linha secundária** na identificação do registro?
7. O painel aberto é portal no `body` com `position: fixed`, `z-index: 60`, flip
   quando não cabe, e fecha em Escape/clique fora?
8. Camada flutuante tem sombra e **nenhuma** borda; superfície no fluxo tem borda
   e **nenhuma** sombra?
9. O grupo de botões termina no `action`, e toda gravação dá toast?
