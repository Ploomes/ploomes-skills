# Como este frontend pensa

O usuário do Ploomes passa o dia inteiro dentro da ferramenta e trabalha com
volume: centenas de negócios, contatos, propostas. As decisões abaixo derivam
disso — não de preferência estética.

## Densidade é a feature

**Eficiência acima de minimalismo.** Muitas ações visíveis ao mesmo tempo para
evitar clique. Menu de contexto, atalho e ação em massa são onipresentes. Uma tela
que mostra pouco obriga o usuário a navegar mais, e navegar é o custo que ele não
tem.

**Viewport cheia, sempre.** Listagem, quadro, ficha, calendário e mapa esticam até
as bordas da área de conteúdo. O conteúdo **não** é centralizado com `max-width`
fixo — em monitor amplo isso desperdiça metade da tela, e o usuário de CRM precisa
ver muitos registros de uma vez.

## A Conta configura quase tudo

Coluna de tabela, campo de formulário, estágio de funil, filtro salvo, painel: o
administrador estende o sistema sem código. Ao construir, assuma que **a estrutura
vem do servidor** — não fixe lista de campos, de estágios ou de colunas. Detalhe em
[`conta-e-localizacao.md`](./conta-e-localizacao.md).

## Consistência entre módulos

As mesmas mecânicas — filtro, seleção em massa, exportação, alternância de
visualização, paginação — aparecem iguais em todos os módulos de entidade. Um
usuário que aprendeu a listagem de Contatos sabe operar a de Propostas. Inventar
uma mecânica nova para um módulo específico cobra esse aprendizado de novo.

## Feedback imediato e não-bloqueante

A maioria das operações retorna via notificação flutuante, sem interromper o
fluxo. Modal de confirmação é reservado a ação destrutiva ou irreversível. Ver
[`estados-e-feedback.md`](./estados-e-feedback.md).

## Persistência é explícita

O usuário decide o que persiste. Edição inline acontece via popover ancorado com
**"Salvar" / "Cancelar"** explícitos — clicar fora **cancela**, não salva. A
ausência de gravação silenciosa é deliberada: preserva a expectativa de controle.

> ⚠️ **Ponto em aberto.** A documentação anterior descrevia, em paralelo, autosave
> por blur no drawer lateral de registro. As duas descrições coexistiam e se
> contradiziam. Até alguém confirmar com o time do produto, **construa com
> persistência explícita** — é o comportamento seguro: nunca grava sem o usuário
> mandar. Ver [`escrita-e-validacao.md`](./escrita-e-validacao.md).

## Nunca esconda informação sem dar como recuperá-la

Densidade alta comprime informação, e comprimir sem escape deixa o usuário vendo
que "tem algo ali" sem conseguir ler. **Todo elemento que corta, trunca ou conta
conteúdo precisa expor o valor completo.**

| Padrão que comprime | O que precisa estar acessível |
|---|---|
| Chip/badge truncado com ellipsis | Nome completo do item |
| Indicador "+N" de itens ocultos ("+2 marcadores", "+5 anexos") | Lista dos itens ocultos, separada por `, `. Se longa: primeiros N + "e mais X" |
| Avatares empilhados com "+N" | Mesma regra |
| Célula de tabela com ellipsis | Texto completo da célula |
| Botão só-ícone, sem rótulo visível | Verbo da ação ("Editar", "Excluir", "Mais ações") |
| Métrica abreviada ("1,2 M", "3,4 k") | Valor cru com unidade explícita |
| Pílula de tempo ("1849d") | "1849 dias no estágio atual" |
| Gatilho de seleção com rótulo truncado | Rótulo completo do valor selecionado |

**Só quando há corte de verdade.** Tooltip sobre texto que já cabe inteiro é ruído
e atrapalha a leitura — é tão ruim quanto não ter quando trunca. Detecte overflow
real (`scrollWidth > clientWidth`) e só então ative.

O veículo é o componente de tooltip do design system. O atributo nativo `title`
não serve nem como degradação: aparência inconsistente entre navegadores, não lê
os tokens, não tem seta, e o leitor de tela o trata de forma imprevisível. Se a
estrutura do DOM torna o tooltip custoso, a composição está errada — refatore a
estrutura, não troque o componente.

## Sem emoji na interface

Toda iconografia visível usa o componente de ícone do design system (SVG com
`currentColor`). Emoji não responde a `color`, tema claro/escuro nem estado de
hover; renderiza diferente em cada sistema operacional; borra em densidade alta; e
o leitor de tela fala o nome dele ("polegar para cima") em vez do verbo da ação.

Quando o ícone necessário não existe no catálogo, **pare** — não improvise com
emoji nem com caractere gráfico (`▾`, `×`, `✓`). Peça o ícone ao design system ou
escolha o mais próximo que existe.
