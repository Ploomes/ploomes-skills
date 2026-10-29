# Exemplo completo: Agenda de reposição

A skill rodada do começo ao fim sobre um caso real de uma conta de teste, em 2026-10-01. Use
como referência do que cada passo produz e de quanto tempo e trabalho ele custa.

**A tela:** o pós-venda de EPI acompanha clientes que recompram em ciclos. Abre na *janela da
semana* (quem tem reposição prevista até daqui a 7 dias), com um quadro por etapa do funil
"Reposição Programada" e uma ficha com os checklists, onde parte dos itens é **do cliente**, não do
negócio.

---

## Passo 1 — Entender a tela

Tarefa: contatar quem está na janela, registrar o consumo confirmado e confirmar a reposição.
Vista inicial: lista da semana + quadro. Ações: mover de etapa, registrar consumo, preencher
checklist, confirmar, reabrir.

## Passo 2 — Conferir a conta (só leitura)

| O que foi visto | Como |
|---|---|
| Funil "Reposição Programada", 3 etapas, **nenhum negócio** | `buscar_pipeline`, `buscar_negocio` |
| 3 campos do negócio para o cartão (data prevista, consumo confirmado, consumo mensal) | `buscar_campos` por nome |
| Opções de "Consumo confirmado na janela" (4) e de "Periodicidade" (5) | `buscar_opcoes_tabela` |
| Checklists das 3 etapas: **2 itens apontam para campo do cliente** (`contact_…`) | `Checklists` na `public-api2` |
| **5 itens obrigatórios com condição invertida** ("igual a vazio") | idem |

➜ **A conferência achou uma lacuna da própria skill:** o `api.ts` só lia e gravava campo do
negócio. Corrigido no gerador — `checklistsDaEtapa` agora diz a `entidade` de cada item e
`salvarItemDoChecklist` grava no cliente quando o campo é do cliente. A API falsa e o autoteste
passaram a cobrir esse caso.

➜ Os 5 itens invertidos vão para quem pede corrigir no Ploomes (é configuração existente da conta).

Saída: [`pacote-construtor/conferencia-da-conta.json`](pacote-construtor/conferencia-da-conta.json).

## Passo 3 — Contrato

Três leituras e quatro escritas, tudo por nome:
- `reposicoesDaEtapa({ etapaId })` — cada coluna do quadro pagina sozinha;
- `janelaDeReposicao({ ate })` — filtro por **data** num campo personalizado
  (`OtherProperties/any(… DateTimeValue le {param:ate})`);
- `reposicaoPorId(id)` — recarregar a ficha;
- `moverDeEtapa`, `registrarConsumo`, `confirmarReposicao` (Win), `reabrirReposicao` (Reopen).

Saída: [`pacote-construtor/contrato-de-dados.json`](pacote-construtor/contrato-de-dados.json).

## Passo 4 — Gerar a camada de dados

`python scripts/gerar_api.py …` → `src/ploomes/api.ts` com 23 funções exportadas, incluindo
`checklistsDaEtapa`, `salvarItemDoChecklist`, `validarChecklist` e `textosDoFunil`, que nenhum
contrato precisa declarar.

## Passo 5 — Pedido

[`pacote-construtor/PEDIDO.md`](pacote-construtor/PEDIDO.md): três blocos (janela, quadro, ficha),
cada dado e cada ação citando a função do `api.ts`, e seis critérios de aceite.

## Passo 6 — Portão

`APROVADO — 0 bloqueio(s), 0 aviso(s).`

## Passo 7 — Bancada

- **Dados de teste** com a estrutura da conta (mesmos campos, opções e checklists, inclusive os do
  cliente) e cinco reposições em torno da data de hoje:
  [`pacote-construtor/dados-de-teste.json`](pacote-construtor/dados-de-teste.json).
- **Construção às cegas:** um agente que só recebeu o `PEDIDO.md` e o `api.ts` construiu a tela em
  **1 rodada, 19 chamadas de ferramenta, ~113 mil tokens, 4,8 min**. Typecheck e build de primeira.
  **Nenhuma função faltou no `api.ts`.**
- **Visto no browser:** a janela mostrou só as 3 reposições até +7 dias e marcou a atrasada; "▶"
  numa reposição com checklist pendente não moveu e disse o que faltava; o item foi preenchido pelo
  checklist e deixou de ser pendente; o botão de confirmar usou o verbo do funil e explicou por que
  estava desabilitado (só na última etapa).

## Passo 8 — API real (só leitura)

`testar-api-real.ps1 -Pacote …` na conta de teste: **PASSOU, 10 chamadas, nenhuma escrita.**
Funil e opções resolvidos por nome, as leituras por etapa e a **leitura por data** responderam na
API real, e os verbos reais do funil vieram ("Ganhar" / "Encerrar"). A seção 4 listou os 5 itens de
checklist invertidos.

## Passo 9 — Empacotar e entregar

Em 2026-10-19 a tela foi refeita na base do construtor e empacotada com
`empacotar_importacao.py <tela> agenda-de-reposicao.zip --pacote exemplo-reposicao/pacote-construtor`:
37 arquivos de `src/`, aprovado. Para o construtor: importar o `.zip` (sem importação, uma mensagem com o
`PEDIDO.md` e os anexos `api.ts` e `useConexao.ts`). Para quem pede: corrigir
os 5 itens de checklist antes de pôr a tela em uso — com eles invertidos, a etapa só libera com o
campo vazio.

---

## Em números

| | Valor |
|---|---|
| Rodadas para a tela ficar pronta | 1 |
| Chamadas de ferramenta do construtor (simulado aqui) | 19 |
| Funções que faltaram | 0 |
| Problemas de configuração da conta achados antes da tela ir ao ar | 5 |
| Lacunas da skill achadas e corrigidas | 1 (checklist com campo do cliente) |
