# Escrever e validar

## Quando o dado persiste

A gravação é disparada pelo usuário — clique em "Salvar" no popover de edição
inline, no modal ou no formulário. Clicar fora de um popover de edição
**cancela**; não grava.

> ⚠️ **Ponto em aberto.** A documentação anterior descrevia também autosave por
> blur no drawer lateral de registro ("cada campo salva ao perder foco"), e no
> mesmo arquivo dizia que o botão "Salvar" do rodapé começa desabilitado e habilita
> ao primeiro campo modificado — dois mecanismos que não convivem. Enquanto o time
> do produto não confirma qual vale, **construa com gravação explícita**: é o
> comportamento que nunca surpreende o usuário. Se for construir sobre o drawer de
> um módulo existente, confirme antes.

Durante a gravação:

- O botão "Salvar" vira `"Salvando…"` com spinner pequeno e fica desabilitado.
- **Sucesso** → toast de confirmação e fechamento do popover/modal.
- **Falha** → o popover/modal **permanece aberto com os dados preservados**, e o
  erro vai para toast. Nunca descarte o que o usuário digitou por causa de falha
  de gravação.

## Quando validar

Não existe um momento único de validação. São três, e usar o errado é o que
produz formulário que "grita" enquanto a pessoa digita:

| Tipo de regra | Valida em |
|---|---|
| Formato definido (e-mail, telefone, CPF/CNPJ, número) | **blur** — ao sair do campo |
| Apenas obrigatório (campo vazio) | **submit** — nunca durante a digitação |
| Unicidade ("já existe") | **assíncrono**, com debounce de 250 ms após a digitação parar |

## Onde o erro aparece

- **Erro de campo** → logo abaixo do campo, texto curto, cor de erro, dizendo o
  que está errado **e como corrigir**. A borda do campo também muda para a cor de
  erro.
- **Erro sistêmico da operação** (falha ao gravar no servidor) → notificação
  flutuante, **não** banner inline.
- **Exceção**: formulário longo de múltiplas seções pode ter um banner discreto no
  topo resumindo "Existem campos com erro" antes de listar.

## Validade agregada controla o submit

Todo o estado de validação de um campo — mensagem informativa, alerta, contador de
caracteres, fórmula presente, status, verificação de unicidade — é agregado num
conjunto coerente. Quando esse conjunto muda, o campo emite um sinal de mudança de
validade, e o formulário usa esse sinal para habilitar ou desabilitar o submit.

Isso significa que **o formulário não precisa reimplementar validação de campo** —
ele escuta. Detalhe do contrato em [`campos.md`](./campos.md).

## Processamento assíncrono depois da edição

Editar um campo pode disparar trabalho **antes de o valor assentar**: recálculo de
fórmula (inclusive fórmula externa, que faz requisição HTTP e pode demorar) e
automações acionadas pela edição.

Enquanto isso corre, a interface mostra um **indicador transitório de "em
andamento"**, distinto do "Salvando…" (que é só a gravação) e dos toasts de
resultado:

- **Onde** — cartão compacto com spinner, ancorado na região das notificações. Não
  é toast: não fecha por tempo nem tem botão de fechar. A presença dele espelha o
  estado do formulário.
- **Rótulo** — `"Calculando fórmulas"` (cobre fórmula interna e externa) ou
  `"Automações em andamento"` / `"Automação em andamento"`.
- **Piso de ~2 s** — mesmo que termine instantaneamente, fica um tempo mínimo para
  não piscar.
- **Salvamento bloqueado durante fórmula** — o botão de salvar fica desabilitado
  com tooltip `"Fórmulas em andamento, aguarde para salvar"`, e o formulário conta
  como inválido até resolver.

Contratos de fórmula e de automação em `ploomes-tech-docs:business-docs`.

## Descartar alterações

Fechar um painel ou modal com alteração pendente **não** descarta em silêncio.
Aparece confirmação central:

> "Existem alterações não salvas. Deseja realmente sair?"
> — botões "Cancelar" (volta) e "Fechar sem salvar" (descarta e fecha).

Isso vale para o overlay, o Esc e o botão de fechar — os três caminhos passam pela
mesma verificação.

## Ação destrutiva

Confirmação em modal central. Título curto com a ação ("Excluir cliente"), corpo
descrevendo a consequência no padrão *"Tem certeza que deseja {ação} o {entidade}
**{nome}**?"*, e o aviso de irreversibilidade quando couber.

- O foco inicial vai para **"Cancelar"** — nunca para o botão destrutivo. Enter
  acidental não pode excluir.
- Para destruição irreversível de peso, exigir **palavra digitada** para confirmar.
- O botão destrutivo é a ação principal do grupo, com cor de perigo — não um botão
  rebaixado.

## Edição em célula de tabela

Commita ao perder o foco ou ao pressionar **Enter**; **Esc** cancela e restaura o
valor anterior. Validação ao sair do campo.
