# Vocabulário e regras — funis

Fontes: `business-docs` (`se-funis.txt`, `rc-funis.txt`), artigo oficial de
suporte (*Cards / Negócios*).

---

## O que um funil é — e o erro que essa confusão causa

> "Embora essa entidade se chame 'Negócios', ela é, na realidade, um cadastro de
> **fluxos de trabalho**."

Funil não é "o processo de vendas". É **qualquer** processo com etapas ligado a
cliente. A documentação lista seis famílias:

| Família | O que caracteriza |
|---|---|
| Vendas | guia o vendedor, dá visibilidade ao gestor |
| Licitações | prazos, documentos, múltiplos colaboradores |
| Vendas complexas | várias equipes — pré-vendas, engenharia, financeiro |
| Renovação de contratos | alerta por prazo, assinatura, jurídico |
| Implantação / pós-venda | passagem de bastão de vendas para técnica |
| Chamados técnicos | repositório centralizador, passagem entre equipes |

**O erro mais caro desta skill é espremer tudo num funil só.** Quando o trabalho
muda de dono, muda de funil. Dois times operando o mesmo funil significa que
ninguém consegue olhar para "a minha fila" sem filtrar, e que as etapas de um
atrapalham a leitura do outro.

O sinal de que precisa separar: **a etapa seguinte é executada por outra equipe,
com outro ritmo e outro critério de sucesso.** Aí são dois funis conectados por
automação, não duas etapas.

---

## Parâmetros de configuração

### Identidade
| Parâmetro | Regra |
|---|---|
| **Nome** | até **100 caracteres** |
| Ícone e cor | identificação visual; pode ser padrão |

### Visibilidade
Declara-se **primeiro o tipo** — por usuário, por perfil ou por equipe — e depois
a lista. Não é um campo livre: escolher "por equipe" e listar pessoas é
inconsistente.

### Etapas
Nome e **ordem**. É dentro delas que vivem checklists e automações — por isso
esta skill roda **antes** das duas.

### Formulários
- **Formulário**: conjunto ordenado de campos do negócio
- **Formulário-mini**: um segundo, opcional

### Regras do funil — as que mudam o processo

| Regra | O que decide |
|---|---|
| **Passagem por todos os estágios obrigatória** | o vendedor pode pular etapa? |
| **Proibido voltar de etapa** | o processo é reversível? |
| **Ganhar negócio apenas na última etapa** | ganho é decisão explícita ou chegada? |
| **Criar venda automaticamente ao ganhar** | o backend gera a Venda sozinho |
| **Pode ganhar / Pode perder negócios** | o funil tem desfecho, ou só flui? |
| **Executar automações com o usuário de automação** | quem "assina" as automações |
| **Pode gerar propostas / vendas / documentos** | o que nasce dentro do negócio |
| **Limitar modelos** | quais modelos de PVD valem neste funil |

Essas oito são a codificação do processo. Um funil sem nenhuma ligada é um
quadro Kanban; o valor está em quais o cliente aceita ligar.

> **Ignorar** (falam só com a tela nativa do Ploomes): *Visualizações
> disponíveis*, *Nova venda ao ganhar negócio*, *Abrir janela do produto*.

### Nomenclatura da unidade
Singular, plural e gênero. Num funil de chamados, "negócio" é ruído — vira
"Chamado". Aparece em botão e na timeline.

### Botões de conclusão
Cor e **verbo** de ganhar e perder. Em assistência técnica não se "ganha", se
"conclui". Vale a pena: é a diferença entre o funil falar a língua da operação
ou a língua do CRM.

### Motivos de perda
**Todo funil precisa de pelo menos um.** Negócio perdido sempre exige motivo —
é regra de integridade, não preferência. Funil entregue sem motivo de perda é
configuração incompleta.

### Abas
Quais abas ficam vinculadas ao funil.

---

## Dependências

Esta skill é **upstream**. A ordem canônica de configuração é:

```
Campos → Abas → Filtros → Formulários externos → Modelos de PVD
       → FUNIS → Checklists → Automações de funil → Automações gerais
       → Fluxos de aprovação → Metas
```

Duas consequências que costumam ser invertidas:

1. **Modelos de proposta vêm ANTES do funil** — o funil referencia o modelo
   padrão e a lista de modelos permitidos. Indicar "limitar modelos" sem que os
   modelos existam é referência quebrada.
2. **Checklists e automações vêm DEPOIS** — e citam etapa pelo nome. Nome de
   etapa que mude depois quebra as duas skills seguintes em silêncio.

Por isso o nome da etapa é decisão de contrato, não de estética.

---

## Limites e comportamentos herdados

- **Código sequencial é global**, não por funil. Cards dos funis A e B compartilham
  a mesma numeração cronológica. Se o cliente espera numeração própria por
  processo, isso **não existe** — precisa de campo próprio.
- **Contador "dias no estágio" conta dias corridos**, não úteis, e não é
  configurável. Qualquer SLA em dias úteis precisa de campo calculado.
- **200.000 itens** no total da tabela de negócios (todos os funis somados).
- **Até 100 automações por estágio.**
- Duplicar um negócio **não leva** propostas, vendas e documentos junto.
- Cor do card no Kanban é sempre pela situação (aberto / ganho / perdido), não
  configurável por outro critério.
