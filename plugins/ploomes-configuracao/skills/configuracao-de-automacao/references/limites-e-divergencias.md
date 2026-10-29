# Limites, entidades e divergências — automações

Fonte primária: **Catálogo de funcionalidades e limites do Ploomes** (artigo oficial
da Central de Ajuda, atualizado pela Ploomes em 2026-04-13), seções *Automações de
funil* e *Automações gerais*.
Fonte de contraste: configuração real observada (225 automações em produção,
2026-09-15).

---

## Os dois tipos — confirmados pela fonte oficial

A coluna `Tipo` do CSV tem exatamente dois valores, e não é convenção nossa: o
artigo trata **Automações de funil** e **Automações gerais** como funcionalidades
distintas, com gatilhos e limites próprios.

| | Automação de funil | Automação geral |
|---|---|---|
| Dispara por | movimentação do card dentro de um processo | evento no cadastro/tabela |
| Amarrada a | uma etapa específica | uma entidade |
| No CSV | `Tipo = Funil`, `Filtro` nomeia funil e etapa | `Tipo = Geral` |
| Teto declarado | **100 por estágio** | **100 por cadastro/tabela** |

## Entidades que aceitam automação geral

Clientes · Cards/negócios · Vendas · Propostas · Produtos · Tarefas · Usuários ·
Registros de interação · Documentos · Produtos do cliente

> "As ações disponíveis **variam de acordo com o cadastro / tabela** na qual a
> automação está sendo configurada." Ou seja: entidade e ação não são
> independentes. O vocabulário gerado da API carrega a restrição por gatilho; a
> restrição por ação depende da conta e deve ser conferida na configuração.

## "Edição de dados" tem três formas — o `Detalhamento` precisa dizer qual

É a ação mais usada de longe, e sair sem dizer a forma
deixa a linha ambígua para quem vai configurar:

1. **Valor fixo** — sempre o mesmo valor.
2. **Puxar de outro campo** — copia o valor de um campo para outro.
3. **Fórmula (JavaScript)** — executa e grava o retorno.

Escreva no `Detalhamento`: `Campo "X" = valor fixo "Y"`, `Campo "X" ← campo "Z"`,
ou `Campo "X" = fórmula: <descrição do cálculo>`.

---

## Divergências registradas

O catálogo é a fonte pública; a conta em produção é o comportamento real. Onde
divergem, o achado fica aqui em vez de ser resolvido em silêncio.

### 1. Gatilho por edição de campo específico — RESOLVIDA: existe

Três fontes, duas contra uma:

| Fonte | Diz |
|---|---|
| Catálogo público (art. de suporte) | "**Não é possível** construir automações que sejam disparadas com a edição de um campo específico" |
| `business-docs`, *rc-automacoes-de-funil* | No gatilho `Negócio editado nesse estágio`, "é possível selecionar **até 4 campos específicos** (caso qualquer um deles seja editado, **e somente eles**, a automação roda)" |
| Conta de cliente, em produção | automação `Criar negocio para reativação`, **ativa**, gatilho `Quando o item for editado`, `TriggerFields` = campo **Marcadores** |

**Veredito: a capacidade existe, e o artigo público está errado.** A documentação
de configuração descreve a tela, e a conta real confirma o comportamento.

**Regra para a skill:** pode indicar, com **teto de 4 campos** por automação.
Diga quais campos no `Filtro`. Vale tanto no gatilho de etapa (`Negócio editado
nesse estágio`) quanto no geral (`Quando o item for editado`).

### 1b. A lista de ações é por conta, não universal

O vocabulário gerado da API dessa conta trouxe **14 ações**; a documentação de
configuração lista **12** para automação de funil. As listas não coincidem:

| Só na conta (API) | Só na documentação |
|---|---|
| Enviar mensagem de WhatsApp via Neppo | Criar produto do cliente |
| Enviar Lead para Meetime | |
| Criar preço praticado | |

As duas primeiras dependem de **integração contratada**; as outras, de **módulo**
(Produtos do cliente, CPQ). Ou seja: **a lista de ações disponíveis é função da
conta**, não da plataforma.

**Consequência prática:** gerar o vocabulário de uma conta só **sub-representa**.
Rode `gerar_vocabulario_automacoes.py` em cada conta do acervo e use a **união**,
marcando cada ação com a condição que a habilita. Enquanto o acervo tiver uma
conta, trate ação ausente como "não confirmada nesta conta", não como inexistente.

### 1c. Field-path é pré-requisito, e a skill precisa checar

De `md-field-path.txt`: sem field-path entre a entidade raiz e a vinculada, **é
impossível**:

- filtrar o gatilho por campo da entidade vinculada;
- fazer a automação **editar** dado da entidade vinculada;
- puxar dado da vinculada para preencher campo.

E a armadilha: **campo dinâmico do tipo Produto, Cliente ou Usuário não gera
field-path.** Uma automação que tente ler o segmento do cliente através de um
campo personalizado do tipo Cliente simplesmente não funciona — precisa de
segunda requisição na API ou campo acumulador.

**Regra para a skill:** toda indicação que atravesse entidades tem de citar o
field-path usado, conferido em `rc-lista-de-field-paths.txt` da `business-docs`.
Sem field-path confirmado, a linha vira LACUNA com a alternativa nomeada.

### 2. Teto de 100 automações por cadastro — a conta observada passa

> Artigo: "É possível criar até 100 automações para cada cadastro / tabela."

**Observado nessa conta:** **166 automações gerais na entidade Negócio**, das quais
**150 ativas**. Bem acima do teto declarado.

**Leitura:** ou o teto não é aplicado nessa granularidade, ou conta de outra
forma, ou foi elevado sem atualizar o artigo. **Não use 100 como impedimento
absoluto ao indicar**; use como sinal de que a conta está pesada e o desenho
merece consolidação.

Na mesma conta, automações de funil: 37 no total, no máximo 2 por etapa — muito
longe do teto de 100 por estágio. Esse teto não é restrição prática.

---

## Como o portão trata isso

| Regra | Severidade |
|---|---|
| Entidade fora da lista oficial de 10 | **bloqueio** |
| `Tipo = Funil` sem funil/etapa no `Filtro` | **bloqueio** |
| Mais de 100 indicações para a mesma etapa | **bloqueio** (teto de funil é folgado; passar dele é erro de desenho) |
| Mais de 100 indicações gerais para a mesma entidade | **aviso** (o teto é contestado pelo dado real) |
| `Edição de dados` sem a forma declarada no `Detalhamento` | **aviso** |
