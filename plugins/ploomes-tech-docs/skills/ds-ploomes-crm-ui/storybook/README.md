# Ploomes DS — snapshot HTML das stories

HTML renderizado (DOM real, pós-React) de **todas as 618 stories** do Storybook,
agrupadas em uma página por componente — o equivalente estático das páginas *Docs*
do Storybook. Serve de referência visual de "o que existe", "quais variações tem"
e "como se usa".

Gerado em 2026-07-29 a partir do Storybook do design system (build estático + Chrome headless).

## Estrutura

| Caminho | Conteúdo |
| --- | --- |
| `index.html` | inventário navegável: 77 componentes, agrupados por categoria, com nº de stories |
| `INVENTORY.md` | tabela **HTML nativo → componente do DS** + `import`, `meta.args` e o código de todas as stories |
| `assets/design-system.css` | Tailwind v4 + tokens (light/dark) + CSS de vendors — compartilhado |
| `assets/page.css` | chrome das páginas (títulos, canvas, blocos de código). Só seletores `.ds-*`, não faz parte do DS |
| `foundations/` (4) | Colors, Tokens, Typography, Whitelabel |
| `atoms/` 10 · `components/` 20 · `fields/` 19 · `organisms/` 23 · `providers/` 1 | uma página por componente, com todas as suas stories |

## Cada página de componente

- Cabeçalho com o `import` real usado pela story e o `meta.args` (props padrão).
- Uma seção por story: nome, id do Storybook, export de origem, o componente
  renderizado dentro de um canvas e o código da story em `<details>`.
- Componentes atrás de gatilho têm um segundo canvas com o **estado aberto**,
  capturado clicando no gatilho via CDP — 58 capturas: modais (`ModalCenter`,
  `ModalSide`, `AlertModal`) e a lista de opções dos campos (`Field07Options`,
  `Field10Checkbox`, `Field07Phone`, `Field08Date`, `Field02TextMultiline`,
  `Field22Developer`). O overlay `fixed` fica contido no canvas (o canvas tem
  `transform`, o que o torna o containing block).
- Tema light por padrão; trocar `<html lang="pt-BR">` por `<html lang="pt-BR" class="dark">`
  renderiza o tema escuro (os tokens `--color-*` são sobrescritos por `.dark`).
- Abre direto no navegador via `file://` — a única dependência externa é a fonte
  Source Sans 3 do Google Fonts.

## Limitações

- Fora das 58 capturas de estado aberto, é o estado inicial de cada story: sem
  hover, focus ou tooltip visível.
- `Field09Time`, `Field20Color`, `Field18Image` e `Field19Attachment` não têm
  captura de estado aberto porque encapsulam de propósito o picker nativo do
  browser (`showPicker()`, `<input type="color">`, `<input type="file">`) — não há
  popover próprio do DS para capturar.
- Helpers citados no `render` (`<XDemo />`, dados de exemplo, ícones) ficam no
  arquivo `.stories.tsx` indicado em cada seção — não foram inlineados.
- Onde a story escrevia `background: var(--...)` inline, o Chrome perde o shorthand
  na serialização; os swatches de gradiente de `Colors`/`Whitelabel` foram
  reescritos para `background-image: var(--gradient-*)`.
- As páginas *Docs* nativas do Storybook não foram usadas: em build de produção o
  emotion injeta o CSS via `insertRule`, então o dump sai sem o estilo dos blocos
  de docs. Estas páginas reproduzem o mesmo conteúdo com CSS próprio — e sem os
  controles interativos mortos nem o código escondido atrás de "Show code".
