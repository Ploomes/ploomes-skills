# Renderizar o documento gerado (Proposta / Venda / Documento)

O HTML gerado do trio PVD chega em **fragmentos**: cada página (`Pages[]`, via
`$expand=Pages`) traz o corpo em `BodySourceCode` e, quando há,
`HeaderSourceCode` / `FooterSourceCode`. São conteúdo interno — sem estrutura de
página e sem folha de estilo. **Injetados crus, aparecem sem formatação.**

Reproduzir a apresentação do produto exige três coisas: a estrutura de DOM que
envelopa as páginas, a folha de estilo do documento, e algumas limpezas no HTML.
O resultado é montado em **contexto isolado** (no produto, um `iframe`) para que só
a folha do documento incida sobre o fragmento.

## Fluxo

1. Ler a entidade com `$expand=Pages`. Se `Pages` vier vazio, forçar
   `TriggerHTMLGeneration` — ver a seção "HTML da …" da entidade.
2. Ordenar `Pages[]` por `Ordination`.
3. Limpar cada `*SourceCode` e dividir o corpo pelo marcador de quebra.
4. Montar o DOM.
5. Carregar [`assets/proposta.css`](./assets/proposta.css) no `<head>` do contexto
   isolado.
6. Ajustar a altura das folhas e do contêiner.

## Estrutura de DOM

```html
<div class="wrapper">
  <!-- por página, na ordem de Ordination -->
  <div class="pag-proposta">
    <div id="header">{{HeaderSourceCode}}</div>

    <div class="pag-corpo"
         style="padding: {{TopMargin}}mm {{SideMargin}}mm {{BottomMargin}}mm {{SideMargin}}mm">
      {{BodySourceCode}}
    </div>

    <div id="footer">{{FooterSourceCode}}</div>
  </div>
</div>
```

- **Padding do corpo** são as margens da página em `mm`, na ordem topo, lateral,
  base, lateral.
- **Capa (`HasCoverPage`)**: quando o modelo tem capa, a **primeira página não
  recebe `#header` nem `#footer`** — a capa ocupa a folha inteira. Da segunda em
  diante, cabeçalho e rodapé se repetem.

## Quebra de página interna

Um único `BodySourceCode` pode conter várias folhas. A quebra é este marcador
literal:

```html
<div style="page-break-after:always"><span style="display:none">&nbsp;</span></div>
```

Divida o corpo por ele; **cada segmento vira um `.pag-proposta` próprio**, repetindo
cabeçalho e rodapé (respeitada a regra da capa na primeira folha).

## Altura da folha

Proporção A4. Cada `.pag-corpo` recebe altura mínima calculada: **1123 px** (A4 a
96 dpi) menos a altura renderizada do `#header` menos a do `#footer`. O
`min-height: 350px` da folha de estilo é só um piso — a altura real sai da medição
depois de renderizar cabeçalho e rodapé. A altura do contêiner acompanha a do
`.wrapper`, sem rolagem interna.

## Limpezas obrigatórias

Cada `*SourceCode` passa por duas limpezas antes de ser injetado — são resíduos do
editor de modelos, e sem removê-los aparecem artefatos na tela:

```js
// 1. spans de alça de widget
html = html.replace(/<span[^>]*widget\/images\/handle\.png[^>]*>.*?<\/span>/gs, '')

// 2. GIFs espaçadores transparentes embutidos em base64
html = html.replaceAll(
  '<img alt="" height="15" src="data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==" width="15">',
  ''
)
```

## Folha de estilo

[`assets/proposta.css`](./assets/proposta.css) — a folha que o HTML gerado espera.
No produto entra como `<link>`; embutir as mesmas regras num `<style>` dá o mesmo
resultado.

Ela serve **dois** contextos: a leitura do documento e o editor de modelos. Os
seletores escopados a `.cke_editable` são do editor e **não incidem** na leitura,
porque o corpo é `.pag-corpo`. Para a apresentação importam a tipografia base
(`body`, `table`, `p`, títulos), `.wrapper`, `.pag-proposta`, `.pag-corpo`, tabelas,
`blockquote`, `figure`, `img.left`/`img.right`, `hr` e listas.

Essa folha **não** usa os tokens do design system — é a apresentação do documento
impresso, com vida própria. Não tente alinhá-la à UI do produto.

## Ver também

- Proposta § HTML da Proposta (`ploomes-tech-docs:business-docs`)
- Venda § HTML da Venda (`ploomes-tech-docs:business-docs`)
- Documento § HTML do Documento (`ploomes-tech-docs:business-docs`)
- Modelo de Documento (`ploomes-tech-docs:business-docs`)
