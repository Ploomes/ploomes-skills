# Acessibilidade

O que o produto garante. Componente do design system já entrega boa parte disso —
o que segue é o contrato que **composições novas** precisam manter.

## Foco visível

- Use `:focus-visible`, não `:focus` — clique de mouse não pinta anel.
- O anel é independente da borda: em campo focado, a borda muda **e** o anel
  aparece em volta.
- **Em componente com wrapper** (campo de formulário, busca, seletor), o anel é do
  **wrapper**, via `:focus-within` — nunca do `<input>` interno, que vai com
  `border: 0; outline: 0`. Anel nos dois gera dois anéis sobrepostos.
- Em fundo saturado (botão de ação, badge escuro), o anel é claro.

**Nunca** `outline: none` sem substituto — viola WCAG 2.4.7. Se esconder o anel,
forneça alternativa com contraste ≥ 3:1.

## Foco em modal e painel

- Ao abrir: foco vai para o primeiro elemento focável de dentro.
- Enquanto aberto: Tab cicla **só** dentro; Shift+Tab cicla para trás.
- Ao fechar: o foco **volta para o elemento que abriu**.
- Confirmação destrutiva: foco inicial em "Cancelar", nunca no botão destrutivo.
- Tooltip não prende foco — aparece com `:focus-visible` no gatilho e some ao sair.

Ordem de tabulação em modal: cabeçalho (botão de fechar por último dentro dele) →
corpo → rodapé. **O botão primário do rodapé é o último da ordem**, para que Enter
caia nele naturalmente.

## Teclado

Ordem de Tab segue a ordem visual. Elementos desabilitados são pulados. Use
`tabindex="0"` para focável customizado e `-1` para foco programático; **nunca**
`tabindex` maior que zero.

Atalhos que o produto garante:

| Contexto | Tecla | Ação |
|---|---|---|
| Botão, checkbox | Enter ou Space | Aciona |
| Gatilho de seleção | Enter, Space ou ↓ | Abre o seletor |
| Gatilho com valor | Backspace ou Delete | Limpa a seleção |
| Lista aberta | ↑ ↓ | Navega opções |
| Lista aberta | Enter | Seleciona a opção em foco |
| Lista aberta | Esc | Fecha sem selecionar |
| Lista aberta | Home / End | Primeira / última opção |
| Lista aberta | letra | Pula para a próxima opção com aquela inicial |
| Lista aberta | **Tab** | Navega como ↓; ao passar da última, **comita e sai para o próximo campo**. Obrigatório — o painel não pode engolir o Tab |
| Busca dentro de lista | Esc | Primeiro limpa a busca; se já vazia, fecha |
| Abas | ← → | Move o foco entre abas (não troca); Enter ou Space troca |
| Modal | Esc | Fecha — salvo confirmação por digitação |
| Linha de tabela | Space / Enter | Seleciona / aciona |
| Cabeçalho ordenável | Enter ou Space | Alterna ordenação |
| Paginação | ← → · Home/End | Anterior/próxima · primeira/última |
| Lista reordenável | Space | Inicia e conclui o arrasto por teclado |
| Lista reordenável em arrasto | setas · Esc | Move · cancela |
| Seção expansível | Enter ou Space | Alterna |
| Texto renomeável | Enter · Esc | Confirma · cancela |

## ARIA

**Estrutura da página** — landmarks estáveis: `banner` no cabeçalho global,
`navigation` na barra primária (com `aria-label`), `main` no conteúdo,
`complementary` em painel de detalhe persistente. Um `<h1>` por página, sem pular
níveis de heading.

**Diálogos** — `role="dialog"` com `aria-modal="true"` e `aria-labelledby`
apontando para o título. Confirmação destrutiva usa `alertdialog`.

**Notificações** — container com `aria-live="polite"`; toast de erro usa
`assertive`.

**Estado de carregamento** — `role="status"` com `aria-live="polite"` e rótulo.
Barra de progresso com `aria-valuenow`/`min`/`max`.

**Formulário** — todo controle tem `<label>` associado. Campo inválido recebe
`aria-invalid="true"` e `aria-describedby` apontando para a mensagem, que por sua
vez é anunciada (`role="alert"` ou `aria-live`). Obrigatório recebe
`aria-required="true"` **e** indicação visual. Grupos de opção usam `fieldset` +
`legend`.

**Ícone** — decorativo vai com `aria-hidden="true"`; informativo (botão só-ícone)
precisa de rótulo acessível com o verbo da ação.

**Avatar** — `alt` com o nome. Quando o nome está adjacente na mesma linha, `alt=""`
é aceitável; omitir o atributo não é.

## Movimento

Respeite `prefers-reduced-motion`: quem pediu menos movimento recebe a transição
reduzida ou suprimida, nunca a animação completa.
