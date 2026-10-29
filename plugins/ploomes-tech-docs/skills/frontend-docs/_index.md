# Frontend — como o Ploomes CRM se comporta

Esta camada descreve **o que o frontend do produto se preocupa em fazer**:
como carrega dado, quando persiste, o que valida, como fala com o usuário, o que
a Conta manda e o que nunca pode vazar para a tela.

**Não descreve forma.** Componente, token, cor, medida, raio, sombra, anatomia e
variante são responsabilidade do **design system** — que tem o snapshot renderizado
de todos os componentes, com o DOM real e os tokens medidos. Se a pergunta é
"como isso *é*", a resposta está lá. Aqui está "como isso *se comporta*".

Essa fronteira é rígida de propósito: quando as duas fontes descreviam a mesma
coisa, elas divergiam, e a divergência virava bug — a doc chegou a prescrever
sombra em cartão em repouso, que o design system não faz.

## Os arquivos

| Arquivo | Responde |
|---|---|
| [`principios.md`](./principios.md) | Como este frontend pensa: densidade, viewport cheia, configurabilidade, feedback não-bloqueante, e a regra de nunca esconder informação sem dar como recuperá-la. |
| [`dados-e-listagem.md`](./dados-e-listagem.md) | Carregar coleção: paginação obrigatória, ordenação estável, ordem definida pela Conta, busca, cache, debounce, e como se seleciona um registro (Contato, Usuário, Produto). |
| [`escrita-e-validacao.md`](./escrita-e-validacao.md) | Persistir: quando salva, o que valida e quando, processamento assíncrono (fórmulas, automações), descarte de alterações. |
| [`campos.md`](./campos.md) | Contrato de campo por TypeId: forma armazenada × forma exibida, máscaras, validação, unicidade, sanitização, campo que aponta para outro registro, e o contexto do campo Desenvolvedor. |
| [`conta-e-localizacao.md`](./conta-e-localizacao.md) | O que vem da Conta e não pode ser fixado no código: idioma, moeda, fuso, IDs configuráveis, cor de status, permissão, o conjunto de campos resolvido por usuário, whitelabel. |
| [`linguagem.md`](./linguagem.md) | Voz, terminologia canônica, e os termos internos que nunca aparecem na tela — incluindo como traduzir erro cru da API. |
| [`estados-e-feedback.md`](./estados-e-feedback.md) | Vazio, carregando, erro, sem permissão; toasts e mensagens canônicas do produto. |
| [`acessibilidade.md`](./acessibilidade.md) | Teclado, foco, ARIA, landmarks. |
| [`documento-gerado.md`](./documento-gerado.md) | Renderização do HTML gerado de Proposta/Venda/Documento (PVD). |

## Como usar

Leia o arquivo da preocupação que a tarefa toca — não a camada inteira. A maioria
das tarefas toca dois ou três.

Quando esta camada e o design system parecerem discordar sobre **forma**, o design
system vence. Quando parecerem discordar sobre **comportamento**, esta camada vence.
Se a discordância for real e não couber nessa divisão, é bug de documentação:
reporte em vez de escolher.

## Precedência

Vale a ordem de precedência: **regra de negócio** →
**contrato de API** → **comportamento de frontend** → **forma visual**. Um
invariante de domínio sobrescreve o default de um componente, nunca o contrário.
