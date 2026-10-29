# O protótipo na base do construtor

O protótipo é um `prototipo.html` de arquivo único, mas é desenhado **como se já estivesse na base
em branco do construtor de telas**. A cópia exata dessa base está na skill irmã:
`pacote-para-o-construtor/bancada/scaffold/src/`, exportada do construtor em 16/10/2026.

Tudo o que o protótipo define o construtor copia, inclusive o que estiver errado (ver
`licoes-da-producao.md`, item 5). Por isso as regras abaixo valem já no protótipo, e não só
na construção.

## 1. O que a base já tem, e o protótipo imita

| Base | No protótipo |
|---|---|
| `react-router` com `MemoryRouter`: uma rota por tela e por registro aberto; o CRM mostra a rota em `/ai-screen/<tela>/<rota>`; voltar e link copiado funcionam | cada aba e cada registro aberto têm **rota própria**, escrita na especificação (`/`, `/atendimentos`, `/negocio/:id`). No protótipo, a rota vai no `location.hash`, e o filtro e o registro escolhido vão na query (`?negocio=123&unidade=sul`) |
| tokens CSS em `src/index.css` (`--color-brand`, `--color-background`, `--color-font`, `--color-neutral-level_1..3`, `--color-success`, `--color-alert`, `--color-danger`…) e `.dark` | copie os blocos `:root` e `.dark` do `index.css` da base para o `<style>` e use **só** `var(--color-*)`. Cor de categoria do cliente (unidade de negócio, por exemplo) fica num mapa de dados, mas com o texto e a borda nos tokens |
| `useViewportOverlay` + portal: o modal cobre o CRM inteiro, não só o iframe | modal e gaveta em `position: fixed` sobre a página toda |
| `usePloomesBridge().navigate`: abre uma tela do CRM pelo catálogo (`/deals/detail` com `{id}`) | "Abrir no Ploomes" é um link para o registro nativo, marcado na especificação como navegação do CRM — nunca `window.open` de URL montada à mão |
| sem login: a sessão vem do CRM (`userKey`, `userId`, `whitelabel`, `language`) | nenhum login, logout, logo ou menu de perfil. O "usuário logado" é dado de exemplo. ⚠️ O código da tela roda com a sessão de quem a abre: a chave nunca vai a log, a URL nem a serviço de terceiro |
| pacotes: `react`, `react-dom`, `react-router` e `@ploomescrm/bridge`; o construtor tem também `motion` e `lucide-react`, que telas em produção já importam | nenhuma biblioteca de gráfico ou de componente. Gráfico em SVG à mão, ícone em SVG embutido. A animação é a do kit de onboarding (`motion`), que a tela copia da skill `onboarding-de-tela`: o protótipo não precisa animar |

## 2. Padrões que entram sem pedido

Saíram da revisão de uma tela que foi para o ar (`licoes-da-producao.md`, item 6), e valem para
qualquer tela:

- **Contexto no cabeçalho, um só:** o seletor de contexto (unidade, equipe), o responsável e o
  período ficam juntos, num grupo de filtros, no mesmo lugar em todas as abas. O contexto ativo
  aparece **uma vez**.
- **Ajuda do campo em tooltip**, num ícone ao lado do rótulo — nunca numa legenda embaixo, com a
  mesma cara do rótulo.
- **Número só aceita número** (`inputmode="decimal"` ou `"numeric"`), com a unidade ao lado.
- **Texto livre com sugestão** do que já foi usado, quando o campo é texto na conta mas se repete.
- **Campo de valor fixo não aparece**: grava o valor e não mostra o campo.
- **Ação destrutiva em vermelho** (`var(--color-danger)`). Perder pede o motivo.
- **Muitos registros em paralelo:** cada registro aberto vira uma aba, e uma lista lateral com
  busca serve para escolher. Fechar a aba não altera o registro.
- **Os quatro estados em todo bloco:** carregando, vazio, erro e sem permissão.
- **Bloco que espera integração** mostra "aguardando a integração com <nome>" e o que vai aparecer
  ali. Ele não some e não mostra dado inventado.

## 3. A camada de dados do protótipo

Continua sendo **um** `const api = {...}`, com uma função por leitura e por escrita. Cada função
leva a rota do Ploomes num comentário e devolve o dado de exemplo. Em cada leitura, o comentário
diz também:

- **o recorte:** filtro, ordenação, `$select`, `$expand`;
- **o volume esperado e como pagina**, por exemplo `// ~400 abertos por unidade; 50 por página,
  carregar mais`. Lista que pode passar de algumas centenas nunca é lida inteira para calcular
  indicador: o indicador vem de uma leitura própria, com filtro de data;
- **a data certa:** fechamento é `FinishDate` (negócio) ou a data do documento, **nunca**
  `LastUpdateDate`.

E três proibições:

- ⛔ **Nenhuma URL de webhook ou de flow no protótipo.** Integração que a tela dispara é escrita no
  Ploomes (um campo, uma tarefa, um registro de interação) que uma automação leva ao flow. URL de
  webhook no navegador é pública para qualquer usuário da conta, e quem a tem dispara o flow sem
  passar pelo Ploomes (`licoes-da-producao.md`, item 4).
- ⛔ **Nenhuma recarga automática** abaixo de 60 s, e nenhuma com a aba escondida.
- ⛔ **Campo pelo nome exato**, o mesmo do `requisitos-da-cadeia.csv`, nunca por FieldKey inventado
  (`TOBE0001…`). A chave real só existe depois que a cadeia cria o campo, e a
  `pacote-para-o-construtor` a confere na conta.
