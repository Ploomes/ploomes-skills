# Formato do `contrato-de-dados.json`

É a **única** coisa sobre dados que o modelo escreve. O `api.ts` sai dele pelo `gerar_api.py`, e o
portão confere cada nome dele contra a `conferencia-da-conta.json`. Exemplo completo em
`exemplo/contrato-de-dados.json`.

```jsonc
{
  "versao": 1,
  "tela": { "nome": "Cockpit de embarques", "slug": "cockpit-embarques" },

  // Resolvidos POR NOME na abertura da tela (iniciar()). Nunca ID.
  "funis": {
    "<chave>": { "nome": "<nome exato no Ploomes>",
                 "etapas": { "<chave>": "<nome exato da etapa>" } }
  },
  "modelos": {                      // modelos de proposta, venda e documento (DocumentTemplates)
    "<chave>": { "nome": "<nome exato>" }
  },

  // FieldKey é o ÚNICO identificador fixo permitido.
  "campos": {
    "<chave>": {
      "fieldKey": "deal_ED1FFDFA-…",
      "typeId": 8,                  // de buscar_campos; decide a coluna do valor
      "opcoes": true,               // opcional: TypeId 7 — carrega as opções em iniciar()
      "multiplo": false,            // opcional: campo Multiple
      "coluna": "ContactValueId"    // opcional: só para campo dinâmico (Cliente, Usuário, Produto)
    }
  },

  "leituras": {
    "<nomeDaFuncao>": {
      "rota": "Deals",
      "select": ["Id", "Title", "StageId"],
      "expand": ["Contact($select=Id,Name)"],
      "outrosCampos": ["<chave de campo>"],     // traz OtherProperties
      "filtro": "PipelineId eq {funil:embarques} and StatusId eq 1 and OwnerId eq {usuario}",
      "parametros": { "<nome>": "number | string | date | boolean" },
      "ordem": "Id",                             // Id = paginação por cursor; outro = página única
      "pagina": 50
    },
    "<nomePorId>": { "rota": "Deals", "select": ["Id", "Title"], "outrosCampos": ["<chave>"],
                     "umRegistro": true }             // gera (id) => registro | null — para recarregar a ficha,
    "<nomeAgregado>": { "rota": "Deals", "filtro": "StatusId eq 1",                // gera (p) => linhas[]
                        "agregar": { "por": ["PipelineId", "StageId"],           // groupby; sem "por", um total
                                     "medidas": { "Quantidade": "$count", "Valor": "Amount with sum" } } }
  }
  },

  "escritas": {
    "<nomeDaFuncao>": { "rota": "Deals", "metodo": "POST",  "nativos": ["Title", "ContactId"], "campos": ["<chave>"] },
    "<nomeDaFuncao>": { "rota": "Deals", "metodo": "PATCH", "nativos": ["StageId"],            "campos": [] },
    "<nomeDaFuncao>": { "rota": "Deals", "acao": "Win" }
  }
}
```

## Marcadores do `filtro`

| Marcador | Vira |
|---|---|
| `{funil:<chave>}` | Id do funil, resolvido pelo nome |
| `{etapa:<funil>.<etapa>}` | Id da etapa |
| `{modelo:<chave>}` | Id do modelo |
| `{opcao:<campo>.<nome da opção>}` | Id da opção da tabela do campo |
| `{campo:<chave>}` | FieldKey do campo, entre aspas — para `OtherProperties/any(op: op/FieldKey eq {campo:x} and …)` |
| `{usuario}` | `userId` que a ponte entregou |
| `{param:<nome>}` | parâmetro da função; string sai entre aspas simples e escapada |

⛔ **Número literal ≥ 1000 comparado a um `…Id` é bloqueio no portão.** É ID de conta disfarçado.
`StatusId eq 1` (aberto), `2` (ganho) e `3` (perdido) são do sistema e passam.

## Escritas

- **`metodo` POST** cria na `rota`. **PATCH** altera: a função gerada recebe `(id, dados)`.
- **`nativos`** lista as propriedades nativas aceitas; **`campos`**, as chaves de `campos` aceitas.
  A função gerada recusa o que não estiver listado — é o que impede o agente de escrever onde não foi
  combinado.
- **`acao`** é ação OData sobre um registro: `Win`, `Lose`, `Reopen` (Deals), `Finish` (Tasks). Sai
  como `POST Rota({id})/Acao`.
- Com ação `Lose`, o `api.ts` traz `motivosDePerda(funil)`; a tela envia `{ LossReasonId }` no corpo.
- Sempre: `textosDoFunil(funil)` dá o verbo de ganhar e perder e o nome da unidade que a conta usa.
- Quando o contrato usa `Deals`, o `api.ts` já traz `checklistsDaEtapa(id)` (itens com o valor
  lido na coluna certa), `salvarItemDoChecklist(id, fieldKey, valor)` e `validarChecklist(id)` →
  `{ valido, pendentes, bruto }`. Não declare essas no contrato.

## Regras que o portão cobra

- Toda `rota` + método (ou ação) existe em `references/rotas-api.txt`.
- `pagina` ≤ 1000 (MaxTop); acima de 300 é aviso.
- Nenhum `$skip`: a paginação é por cursor (`Id gt <último>`), como manda a `api-docs`.
- Toda chave usada em `outrosCampos`, `campos`, `{opcao:…}`, `{etapa:…}`, `{funil:…}` e
  `{modelo:…}` está declarada no contrato.

## Leitura agregada (`agregar`)

Para número de painel — quantos, quanto, tempo médio — sem baixar os registros. Vira
`$apply=filter(<filtro>)/groupby((<por>),aggregate(<medidas>))`, conferido na API real (ver
`formatos-reais-da-api.md`). A função gerada devolve **a lista de linhas**, sem paginação.

- `medidas`: `"<Nome>": "$count"` ou `"<Nome>": "<Campo> with sum|average|min|max|countdistinct"`.
- `por`: só propriedade nativa. A API recusa `OtherProperties` no `groupby`.
- **Recorte com `filtro`** (status, data): a API materializa o agregado em memória. Agregado sem filtro
  em `Deals`, `Contacts`, `Tasks` ou `InteractionRecords` é aviso.

## Nomes que não podem ser usados

Leitura ou escrita com o nome de uma função interna do `api.ts` não compila: `funis`, `modelos`,
`opcoes`, `ler`, `iniciar`, `configurar`, `checklistsDaEtapa`… O portão bloqueia e sugere outro nome
(`funisDaConta`). A lista está em `RESERVADOS`, no `validar_pacote.py`.

## Segredo

`Webhooks`, `AccountIntegrations` e `Automations` devolvem campo secreto: a URL e a chave do webhook,
a chave da integração e o corpo das ações. A leitura dessas rotas precisa de `select`, e o portão
bloqueia o campo secreto no `select` e no `$expand`.

## Campo por nome (`porNome`)

A chave de um campo personalizado **não se escolhe na criação** e muda de conta para conta. Tela
genérica, que vai para várias contas, declara o campo pelo nome e pela entidade:

```jsonc
"campos": { "asIs": { "porNome": { "entidade": 15, "nome": "Mapeamento as-is (tela)" }, "typeId": 2, "opcional": true } }
```

- O `iniciar()` acha a chave (`Fields?$filter=EntityId eq 15 and Name eq '…'`).
- Sem o campo, `ErroConfiguracao` lista o que falta. Com `"opcional": true`, a tela abre assim mesmo, e
  `campoDisponivel('asIs')` diz se a conta tem o campo — a tela mostra como criá-lo, em vez de quebrar.
- Na conferência, o campo vai em `camposPorNome` (nome → `{ entidade, typeId }`).
- ⛔ Campo por nome não entra em `{campo:x}` de filtro: a chave só existe depois do `iniciar()`.

## Biblioteca embutida

O construtor só tem quatro pacotes. Biblioteca a mais vai **dentro da tela**, compilada aqui, em
`bancada/vendor/<nome>/` (hoje, o React Flow: `vendor/xyflow`). O PEDIDO manda copiar a pasta para
`src/vendor/<nome>/` sem editar, e o empacotador confere a cópia arquivo a arquivo. Como recompilar
está no `LEIA-ME.md` da pasta.
