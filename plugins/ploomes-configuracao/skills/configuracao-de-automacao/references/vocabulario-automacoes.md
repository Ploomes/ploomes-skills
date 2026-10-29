# Vocabulário fechado — automações do Ploomes

> Gerado de `/AutomationsTriggers` e `/AutomationsActionsActions` por
> `tools/gerar_vocabulario_automacoes.py`. **Não editar à mão.**

Gatilho ou ação fora destas listas **não existe na plataforma**. Uma
automação proposta com nome inventado não é uma automação ambiciosa —
é uma linha que o implantador não consegue configurar.

## Gatilhos

| # | Gatilho | Exige etapa | Só para |
|---|---|---|---|
| 1 | Negócio entrou neste estágio | **sim** | Negócio |
| 2 | Negócio ganho neste estágio | **sim** | Negócio |
| 3 | Negócio perdido neste estágio | **sim** | Negócio |
| 4 | Negócio reaberto neste estágio | **sim** | Negócio |
| 5 | Quando o item for criado | não | qualquer entidade |
| 6 | Quando o item for editado | não | qualquer entidade |
| 7 | Quando o item for excluído | não | qualquer entidade |
| 8 | Quando o negócio for ganho | não | Negócio |
| 9 | Quando o negócio for perdido | não | Negócio |
| 10 | Quando o negócio for reaberto | não | Negócio |
| 11 | Quando a tarefa for finalizada | não | Tarefa |
| 12 | Quando a tarefa for reaberta | não | Tarefa |
| 13 | Quando a proposta for revisada | não | Proposta |
| 14 | Quando a proposta for aprovada ou reprovada | não | Proposta |
| 17 | Periodicamente | não | qualquer entidade |
| 18 | Quando o lead for convertido | não | Lead |
| 19 | Quando o lead for descartado | não | Lead |
| 20 | Quando o documento for aprovado ou reprovado | não | Documento |
| 21 | Quando a venda for aprovada ou reprovada | não | Venda |
| 22 | Quando a venda for aprovada ou reprovada (online) | não | Venda |
| 23 | Quando a proposta for aprovada ou reprovada (online) | não | Proposta |
| 24 | Quando o documento for aprovado ou reprovado (online) | não | Documento |
| 25 | Negócio editado nesse estágio | **sim** | Negócio |

**Regra dura:** gatilho com *Exige etapa* = sim obriga a coluna `Filtro` a
nomear funil e etapa, e essa etapa tem de existir no XML de funis. Gatilho
com entidade restrita não aceita outra entidade na coluna `Entidade`.

## Ações

| # | Ação | Exige detalhamento |
|---|---|---|
| 1 | Editar dados | não |
| 2 | Alterar estágio do negócio | não |
| 3 | Duplicar negócio em novo estágio | não |
| 4 | Enviar e-mail | não |
| 5 | Criar tarefa | **sim** |
| 7 | Criar negócio | **sim** |
| 8 | Criar registro de interação | **sim** |
| 10 | Perder negócio | não |
| 11 | Ganhar negócio | não |
| 12 | Enviar mensagem de WhatsApp via Neppo | não |
| 13 | Finalizar tarefas com observações | **sim** |
| 14 | Finalizar tarefas | não |
| 15 | Enviar Lead para Meetime | não |
| 16 | Criar preço praticado | **sim** |

**Regra dura:** ação com *Exige detalhamento* = sim não pode sair com
`Detalhamento N` vazio — o Ploomes exige corpo na configuração.

### Ações que só se aplicam a Negócio

- Alterar estágio do negócio
- Duplicar negócio em novo estágio
- Perder negócio
- Ganhar negócio

### Ações que dependem de integração contratada

- **Enviar mensagem de WhatsApp via Neppo** — exige Neppo na conta. Sem a integração,
  a linha vira LACUNA, não indicação.
- **Enviar Lead para Meetime** — exige Meetime na conta. Sem a integração,
  a linha vira LACUNA, não indicação.

## O que se usa de fato

Medido em 225 automações de uma conta real em produção.
Serve de âncora de plausibilidade: uma proposta em que a ação mais
comum é rara, ou o gatilho mais comum não aparece, provavelmente
está desenhando outra coisa.

| Gatilho | Uso |
|---|---:|
| Quando o item for criado | 151 |
| Negócio entrou neste estágio | 33 |
| Periodicamente | 23 |
| Quando o item for editado | 5 |
| Negócio ganho neste estágio | 4 |
| Quando o negócio for ganho | 4 |
| Quando o negócio for perdido | 2 |
| Quando a proposta for aprovada ou reprovada | 1 |
| Quando o item for excluído | 1 |
| Negócio perdido neste estágio | 1 |

| Ação | Uso |
|---|---:|
| Editar dados | 182 |
| Criar tarefa | 36 |
| Enviar e-mail | 12 |
| Criar registro de interação | 7 |
| Criar negócio | 7 |
| Enviar Lead para Meetime | 5 |
| Perder negócio | 4 |
| Finalizar tarefas | 2 |
| Duplicar negócio em novo estágio | 1 |
| Enviar mensagem de WhatsApp via Neppo | 1 |
| Finalizar tarefas com observações | 1 |
