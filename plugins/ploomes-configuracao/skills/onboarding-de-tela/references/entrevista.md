# A entrevista: o que perguntar antes de construir

> Leia antes da primeira linha de código. Cada pergunta aqui custou retrabalho quando ficou para depois — a coluna
> *Por quê* diz qual. Pergunte **em blocos curtos**, com a sua proposta já escrita para quem pede só confirmar ou
> corrigir: o que já está no processo, na especificação ou no retrato da conta não se pergunta, se propõe.

## Bloco 1 — o pedido (sempre)

| Pergunte | Proponha a partir de | Por quê |
|---|---|---|
| **O que o onboarding precisa ensinar**, nas palavras de quem pede: o processo comercial inteiro? uma tela do construtor? um funil novo? | a frase do pedido | é o que o desenho tem de cumprir. Desenho tirado de um caso anterior, e não do pedido, foi recusado num cliente |
| **Para quem:** os papéis (vendedor, Hunter, Farmer, gestor, CS, técnico) e **se cada papel vê um caminho próprio** | o processo (as raias, quando há BPMN), a especificação da tela | num cliente ninguém perguntou, e o onboarding saiu igual para o Hunter e para o técnico |
| **Qual tela e qual conta.** Tela nova: o nome dela e quem vai usá-la — a skill a cria pela API (`editor-do-construtor.md`, seção 0); pela rota do editor, quem pede cria a tela em branco antes (Ploomes IA → Telas personalizadas → Nova tela) e passa o link. Tela que já existe: o link dela | a pasta de entrega (`conta.md`) | sem a tela não há o que baixar; sem quem vai usá-la, a tela nasce só para a chave; sem a conta, o retrato lê a conta errada |
| **O vocabulário:** como quem usa chama as coisas (o card é "oportunidade", "chamado", "amostra"?) | a unidade de cada funil no retrato, o contexto do cliente | o onboarding escrito no vocabulário de quem configura não ensina ninguém |
| **O que conta como concluir** | o tour inteiro (tela com o kit) ou todos os funis do caminho (bloco do mapa) | é quando o evento `concluiu` sai para o Usuário (regra 11) |

## Bloco 2 — os blocos e o que reaproveitar

**Mostre a lista curta** e pergunte só o que ela não decide:

| Pergunte | Proponha | Por quê |
|---|---|---|
| **Os blocos:** o kit (boas-vindas, tour sobre a tela real, primeiros passos, dicas, "O que há de novo"), o **mapa da jornada e o simulador** de cada funil, ou os dois | o do pedido: para ensinar uma tela, o kit; para ensinar o processo, o mapa e o simulador | são os blocos que a skill mantém e corrige; o resto se desenha para o pedido |
| **Fidelidade ao Ploomes:** o simulador desenha o funil e o card **iguais ao nativo**? | sim — o bloco já tem as medidas | foi a 1ª correção num cliente: o funil tem de sair desenhado como o nativo |
| **O "?" da ajuda** e o tour **só na primeira vez ou sempre** que a pessoa quiser | à direita do título; boas-vindas na 1ª vez, tour sempre pelo menu | pedido de um cliente: o tour sempre à mão |
| **O acompanhamento no Usuário** (regra 11): os quatro campos deste onboarding e o flow que os atualiza | **sim, sempre** — a pergunta é só o OK para criar os campos e quem importa o flow | regra desde 27/10/2026: onboarding sem rastro não se mede. Criar campo é escrita na conta — só com OK explícito. Sem o Ploomes Flows na conta, o registro fica desligado e o motivo vai para o `MUDANCAS.md` |

## Bloco 3 — de onde vem a verdade e quem valida

| Pergunte | Proponha | Por quê |
|---|---|---|
| **A conta está congelada durante a montagem?** Quem mais mexe nela? | combinar: mudança na conta durante a montagem avisa no grupo | num cliente, alguém de lá mexia nos funis durante a montagem: uma automação sumiu no meio do trabalho |
| **Quem valida os textos** antes de publicar, e quando | quem pede e alguém do cliente que opera o funil | num cliente a validação ficou como pendência aberta |
| **A ordem e as fases dos funis** no mapa | as jornadas do processo, da esquerda para a direita | num cliente o Claude escolheu sozinho — e acertou por sorte |
| **Um negócio de teste** (`[TESTE]` no título), se precisar medir o card nativo | — | para medir o card, um negócio **real** foi aberto. Nunca de novo |
| **Crédito do construtor**, só na rota do editor: pode gastar no chat dele? | só para criar os arquivos vazios, numa mensagem (4 a 8 mil tokens). Pela API não se pergunta: arquivo novo sobe sem o chat | pelo editor, arquivo novo só nasce pelo chat; a conta de um cliente estava com 90% dos créditos gastos |

## Bloco 4 — o transporte (uma vez por máquina)

| Pergunte | Por quê |
|---|---|
| **O navegador de trabalho já existe?** Um Chrome ou Edge com perfil próprio e porta de depuração, logado no Ploomes (`editor-do-construtor.md`, seção 1) — só quando a subida for pelo editor | o código sobe pela API (`editor-do-construtor.md`, seção 0), com a chave do arquivo `--env`; o editor é a alternativa, e o critério de troca é o passo 9 da `pacote-para-o-construtor`. Nunca o navegador pessoal |

## O que nunca se pergunta

- O que está no processo, na especificação ou no retrato da conta — **proponha**.
- A chave da conta — ela vem do arquivo apontado com `--env`, e ninguém a cola na conversa.
- Se pode publicar — publicar é sempre de quem pede, e a skill nunca clica em "Publicar".
