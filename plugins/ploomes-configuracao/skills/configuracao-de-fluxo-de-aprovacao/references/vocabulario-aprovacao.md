# Vocabulário e regras — fluxos de aprovação

Três fontes, e nesta peça elas **convergem**: o artigo público, a documentação de
configuração (`business-docs`, `rc-fluxos-de-aprovacao.txt`) e uma conta de
cliente (66 regras em produção) descrevem a mesma coisa.

---

## Onde vive

Fluxo de aprovação é **controle de política comercial sobre documento gerado**.
Só existe em três entidades:

**Proposta · Venda · Documento**

Não existe fluxo de aprovação em Negócio, Cliente, Tarefa ou Produto. Se a
regra que o cliente quer é sobre o avanço do negócio, o instrumento é **checklist**
ou **regra de funil** — outra skill.

## As três ações

| Ação | O que faz | Quando usar |
|---|---|---|
| **Bloqueio** | impede que a proposta/venda/documento seja criado | regra inegociável: item sem autorização, quebra regulatória |
| **Fluxo de aprovação** | congela o item (não pode ser compartilhado) e envia aos aprovadores; podem reprovar e comentar | alçada: passa do limite, alguém decide |
| **Alerta** | avisa quem está criando, mas o item é gerado e pode ser compartilhado | política que se quer visível, não travada |

A escolha entre as três é a decisão de negócio da peça. Bloqueio custa
autonomia; alerta custa cumprimento; aprovação custa tempo de ciclo.

## Os 8 operadores das condições

`Igual a` · `Diferente de` · `Maior que` · `Maior ou igual a` · `Menor que` ·
`Menor ou igual a` · `Contém` · `Não contém`

**Faixa se constrói com duas condições no mesmo campo.** Não existe operador
"entre". Alçada por faixa de desconto sai assim:

```
Desconto adicional Maior que 28  E  Desconto adicional Menor que 33
```

Essa é a forma observada em produção, e é o padrão a seguir.

## Parâmetros de configuração

Da documentação de configuração — o que o implantador precisa receber:

1. **Entidade** — proposta, venda ou documento
2. **Nome do fluxo**
3. **Condições** — os filtros que disparam a regra (podem usar field-path)
4. **Mensagem de aprovação** — **obrigatória**; é o texto que o usuário vê.
   Aceita campos dinâmicos via field-path
5. **Ação** — Fluxo de aprovação | Bloqueio | Alerta
6. **Níveis** — só quando a ação é Fluxo de aprovação. Um ou mais níveis, cada um
   com um ou mais aprovadores, em cascata
7. **Notificação por e-mail** — só com Fluxo de aprovação: sim ou não
8. **Destinatários** — todos os aprovadores, ou alguns

---

## O trade-off que precisa ser dito ao cliente

> "A modificação visual só estará disponível para a utilização **caso não existam
> fluxos de aprovação configurados na conta**." — artigo oficial

Configurar o **primeiro** fluxo de aprovação desliga a edição visual de documento
**na conta inteira**, para todo mundo. Não é por fluxo, é por conta.

Se o cliente valoriza ajustar o PDF antes de enviar, isso entra em conflito
direto com qualquer alçada. **A skill tem de declarar esse custo junto com a
primeira indicação de fluxo** — não depois, na implantação.

Complemento: no **modo offline** não é possível disparar travas nem validações de
fluxo de aprovação. Operação de campo sem sinal não é protegida pela alçada.

---

## O que se usa de fato

Medido em 66 regras de uma conta em produção (2026-09-15):

| Ação | Uso |
|---|---:|
| Bloqueio | 51 |
| Fluxo de aprovação | 8 |
| Alerta | 7 |

| Entidade | Uso |
|---|---:|
| Proposta | 66 |
| Venda | 0 |
| Documento | 0 |

| Condições por regra | Regras |
|---|---:|
| 1 | 15 |
| 2 | 44 |
| 3 | 6 |
| 4 | 1 |

| Níveis de aprovação | Regras |
|---|---:|
| 0 (bloqueio/alerta) | 58 |
| 1 | 8 |

**Três leituras que valem como âncora:**

1. **Bloqueio domina.** 51 de 66. Na prática o cliente usa fluxo de aprovação
   para travar, não para escalar decisão.
2. **Alçada é rasa.** Nenhuma regra usa mais de um nível, apesar de a plataforma
   suportar cascata. Indicar três níveis onde o acervo mostra um exige
   justificativa.
3. **Só Proposta.** Venda e documento não têm nenhuma regra. Antes de indicar
   fluxo em Venda, confirme que o cliente de fato gera venda como documento.

## Anti-padrão observado — não repetir

Na conta real existe:

```
Aprovação de nível de desconto 1 - Marcadores
  Desconto adicional Maior que 0 E Menor que 30
  E Nome Contém <NOME DE UMA PESSOA>
  E Nome Contém <SOBRENOME DE OUTRA>
```

**Nome de pessoa cravado na condição.** Funciona até a pessoa sair da empresa, e
aí a alçada silenciosamente deixa de valer — sem erro, sem aviso.

Condicione por **equipe**, por **perfil** ou por **campo do cliente**. Nunca por
nome digitado. Se a regra precisa mesmo apontar uma pessoa, use o campo nativo
`Criador` comparado a um usuário, que a plataforma mantém referenciado.
