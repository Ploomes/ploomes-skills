# Estados e feedback

## Toda tela tem quatro estados, não um

Construir só o caminho feliz é o erro mais comum. Antes de considerar uma tela
pronta: carregando, vazio, erro e sem permissão.

| Estado | O que mostrar |
|---|---|
| **Carregando** | Esqueleto quando o layout é conhecido; spinner só quando não é |
| **Vazio** | Ícone + título + explicação + no máximo **um** CTA |
| **Erro** | O que falhou, em linguagem de negócio, + "Tentar novamente" |
| **Sem permissão** | Explicação + para quem pedir. **Sem CTA** |

## Carregando: esqueleto ou spinner

- **Esqueleto** — carregamento inicial de tela, lista ou cartão, sempre que o
  layout final é conhecido. Antecipa onde cada peça vai aparecer, o usuário calibra
  os olhos, e evita salto de layout. A altura do bloco corresponde à altura final do
  conteúdo que ele substitui.
- **Spinner pequeno** — ação pontual dentro de um elemento já renderizado: botão
  "Salvando…", célula recalculando, busca em curso.
- **Spinner central com overlay** — só quando a operação **precisa** impedir
  interação: submissão longa, transição entre etapas, sincronização inicial. Acima
  de ~2 s, com legenda.
- **Barra fina no topo, não bloqueante** — navegação entre rotas e recarga em
  segundo plano, deixando o conteúdo antigo visível e utilizável.
- **Barra de progresso com porcentagem** — operação longa de progresso conhecido
  (upload, importação, lote). Em importação, mostre também `{processados}/{total}`.

Não use spinner e esqueleto no mesmo bloco. E quando houver operação crítica em
curso, avise antes de o usuário sair: *"Por favor, não recarregue a página até que
a operação seja concluída."*

## Vazio: sempre com ícone

Container que poderia ter N itens e tem 0 mostra o estado vazio do design system,
**com ícone**. Nunca texto solto ("Nada aqui") nem área em branco: texto solto
parece tela em construção, área em branco parece erro de renderização. Em container
pequeno — popover sem resultado, linha sem filhos — vale a variante compacta, mas o
ícone permanece.

Escolha do ícone pelo **motivo** do vazio, não pela tela:

| Motivo | Ícone |
|---|---|
| Nunca teve registro | caixa vazia (`inbox`) |
| Filtro/busca sem resultado | lupa (`search`) |
| Sem permissão | alerta em círculo |
| Erro de carregamento | alerta em círculo, cor de perigo |
| Nada pendente / fim do dia | check |

E pelo motivo muda também o texto e a ação:

- **Nunca teve registro** — "Nenhuma {entidade} cadastrada", explicação do valor de
  criar o primeiro, CTA com o verbo de criação.
- **Filtro sem resultado** — "Não existem registros para os filtros selecionados." ·
  "Selecione outros filtros e tente novamente." Ação discreta: link "Limpar
  filtros", não botão.
- **Erro de carregamento** — "Erro ao carregar o módulo" · "Tente atualizar a
  página. Caso o erro persistir, acesse nosso canal de suporte." CTA "Recarregar".
- **Sem permissão** — "Você não tem permissão para ver essa página!" · "Entre em
  contato com o administrador da sua conta." **Sem CTA** — não há o que o usuário
  possa fazer ali.

O CTA de estado vazio é **um só** e executa a ação diretamente — não abre menu nem
leva a tela intermediária.

## Notificação flutuante

**Quando usar:** só para resultado de operação que o usuário iniciou
explicitamente — criar, editar, excluir, enviar, confirmar.

**Quando não usar:** gravação automática (tem indicador próprio), navegação,
abertura e fechamento de modal, troca de aba, carregamento em segundo plano. Toast
para tudo vira ruído e o usuário para de ler.

**Comportamento:** aparece no canto inferior esquerdo, fecha sozinho em ~4 s. Passar
o mouse **pausa** o cronômetro; tirar reinicia do zero. Até 4 empilhados; o quinto
remove o mais antigo.

**Conteúdo:** mensagem de uma ou duas linhas. Quando o conteúdo é longo, ofereça
"Ver detalhes" em vez do texto inteiro. Ação opcional à direita ("Desfazer", "Ver
detalhes").

**Categorias:** sucesso, erro, alerta (aviso não bloqueante), informação, e IA —
esta reservada a retorno de funcionalidade de IA.

## Erro inline versus toast

- **Erro de campo** → junto do campo. Ver
  [`escrita-e-validacao.md`](./escrita-e-validacao.md).
- **Erro de uma seção inteira** (aba que falhou ao carregar) → banner no topo da
  seção, com "Tentar novamente".
- **Erro da operação** → toast.

## Mensagens canônicas do produto

Use estas quando couberem; consistência de mensagem é parte do produto.

| Situação | Mensagem |
|---|---|
| Salvo | "Alterações salvas com sucesso!" |
| Criado | "Criado com sucesso!" |
| Excluído | "Excluído com sucesso!" |
| Falha ao salvar | "Erro ao salvar alterações!" — com entidade: "Erro ao salvar {entidade}!" |
| Falha sem detalhe do servidor | Título "Erro!" · corpo "Tente novamente mais tarde." |
| Sem permissão para a ação | "Você não tem permissão para realizar essa ação! Por favor, entre em contato com o administrador do sistema" |
| Credencial inválida | "Usuário ou senha inválidos!" |
| Alterações pendentes ao sair | "Existem alterações não salvas. Deseja realmente sair?" — "Cancelar" / "Fechar sem salvar" |
| Operação crítica em curso | "Por favor, não recarregue a página até que a operação seja concluída." |

## 401 depende de o usuário estar autenticado

Tratar todo `401` do mesmo jeito quebra a tela de login.

- **Já autenticado** (sessão expirou durante o uso) → logout e volta para o login.
- **Na tela de login** (ainda não autenticado) → `401` é a resposta **normal** de
  credencial inválida. Mostre a mensagem e **mantenha os campos preenchidos** para
  correção. Não há logout nem re-render global.

> ⚠️ **Armadilha clássica.** Um handler genérico que reseta o estado em *todo*
> `401` apaga a mensagem de erro antes de ela aparecer: para o usuário, o botão
> "Entrar" simplesmente não faz nada. O reset destrutivo tem que ser condicionado a
> "estava autenticado".

**Erro de rede** (sem resposta) tem mensagem própria, distinta do 401: "Erro!" ·
"Tente novamente mais tarde." Um "Failed to fetch" cru nunca chega ao usuário.

## Contadores de pendência

Numeral sobreposto a ícone de menu para tarefa atrasada, mensagem não lida,
aprovação aguardando. Acima de 99 vira "99+".
