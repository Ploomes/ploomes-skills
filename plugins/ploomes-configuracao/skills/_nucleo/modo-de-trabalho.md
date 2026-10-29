# Modo de trabalho — onde as skills de configuração leem e gravam

As skills de configuração (`configuracao-de-funis`, `configuracao-de-checklists`,
`configuracao-de-automacao`, `configuracao-de-fluxo-de-aprovacao` e `configuracao-de-proposta`)
leem o que se sabe do cliente e gravam os arquivos de configuração numa pasta. Este arquivo diz
**qual pasta**, **o que procurar nela** e **onde fica a entrega**. Cada skill diz só o que é dela: os
arquivos que grava e a entrada que exige.

⚠️ **Rodar por cima de uma pasta que já tem os arquivos regrava o que uma pessoa editou à mão** —
confirme antes de gravar.


## Modo pasta local

**A pasta de trabalho é a pasta atual da sessão**, ou a que a pessoa indicar. É dela que a skill lê,
e é nela que grava: os CSVs vão para `arquivos-de-configuracao/`, dentro dela, e os demais arquivos
ficam na raiz dela. Nas skills, essa pasta se chama **pasta de entrega**. As skills de tela (a
`pacote-para-o-construtor`, a `onboarding-de-tela` e as que trabalham com elas) gravam cada tela em
`telas/<slug>/`, dentro da pasta de entrega.

Nada aqui é obrigatório, a não ser o que cada skill declara como insumo obrigatório. O que estiver na
pasta, a skill lê; o que faltar, ela pergunta na conversa, **uma vez**, e não preenche com palpite.

| Insumo | Na pasta de trabalho | Sem o arquivo |
|---|---|---|
| conta do cliente | `conta.md`: nome da empresa, Id da conta no Ploomes e site | a skill pergunta |
| contexto do cliente | `conta.md`: segmento, tipo de venda, porte, ERP | a skill pergunta; sem ele, a indicação sai sem precedente comparável |
| processo atual | `as-is.bpmn`, se houver; senão `processo.md`, com o processo descrito | a pessoa descreve o processo na conversa |
| escopo | `escopo.md`: a proposta que a sua consultoria fez ao cliente, o que foi vendido | a pessoa declara o escopo na conversa |
| notas | `notas/`: atas, transcrições, o que a sua equipe levantou com o cliente | o porquê de cada decisão vem da conversa |
| documentos do cliente | `documentos/`: a proposta atual, a tabela de preço, o contrato | a skill declara a lacuna |
| pontos em aberto | `pontos-em-aberto.md`, onde a skill anota o que ficou por confirmar | a skill o cria |
| saídas das peças anteriores | `arquivos-de-configuracao/`, com os CSVs que outra skill já gravou | a skill que precisa deles diz qual rodar antes |

🔴 **A chave da conta nunca vem pela conversa.** Script que lê a conta recebe a chave de um arquivo
que a pessoa aponta com `--env <arquivo>`; ⛔ não peça o valor dela no chat e não o escreva em arquivo
da pasta.
