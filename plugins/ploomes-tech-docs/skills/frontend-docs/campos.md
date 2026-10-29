# Campos — o contrato de valor

Formulário do Ploomes é feito de **campos**, e cada tipo de campo é um TypeId da
configuração da Conta. A aparência de cada um está no design system (uma página
por TypeId, com os estados e o picker aberto). Aqui está o que ele **guarda**, o
que **mostra**, e o que **valida** — que é onde se erra.

## A regra que resolve a maioria dos bugs

> **O valor armazenado é sempre a forma crua. O valor exibido é computado.**

Número guardado como número, data como ISO, cor como hex, documento como dígitos.
A string formatada — com `R$`, com `%`, com ponto e traço — **não entra no
estado**: ela é derivada na renderização. Guardar formatado quebra ordenação,
comparação, soma e o próprio parser na próxima edição.

Alguns campos revertem para a forma crua **ao ganhar foco** (moeda sem separador
de milhar, por exemplo) para facilitar a digitação, e reformatam ao sair.

## Onde o valor é gravado

Campo personalizado vive em `OtherProperties`, identificado por `FieldKey`, e cada
entrada preenche **exatamente uma** coluna de valor conforme o tipo. A tabela
canônica TypeId → coluna está em
[`../api-docs/07-fields-and-entities.md`](../api-docs/07-fields-and-entities.md)
— consulte lá, é a fonte da verdade.

Duas pegadinhas que essa tabela resolve:

- **Opções pré-cadastradas (TypeId 7)** gravam em **`IntegerValue`**, com o Id da
  opção selecionada. O `ObjectValueId` é **somente leitura**, preenchido pelo
  sistema — escrever nele não tem efeito.
- **Acumulador (TypeId 23)** é calculado pelo backend. O frontend **nunca** envia
  esse valor.

## Exibição por tipo

O separador segue o **idioma da Conta**; pt-BR abaixo como exemplo. Ver
[`conta-e-localizacao.md`](./conta-e-localizacao.md).

| Tipo | Exibido (pt-BR) | Armazenado | Regra de entrada |
|---|---|---|---|
| Texto (1) · Texto longo (2) | como digitado | string / string com HTML | multilinha aceita modo texto plano ou rich text |
| Inteiro (4) | dígitos, sem separador | inteiro | só dígitos, aceita `-` inicial; ~19 caracteres |
| Moeda (5) | `1.234,56` (símbolo vem de `Currency.Symbol`) | decimal | na digitação extrai só dígitos e desloca as duas últimas casas para centavos. **`inputmode="decimal"`, nunca `type="number"`** |
| Decimal (6) | `1.234,567`, casas conforme precisão configurada | decimal de alta precisão | aceita `,` ou `.` como separador; mantém um só radical |
| Porcentagem (13) | `12,5%` — **o sufixo é obrigatório** | decimal | mesmo parser do decimal |
| Data (8) | `dd/mm/aaaa` | ISO 8601 com offset local da Conta, **ou** identificador de regra no modo relativo (`TODAY`, `LAST_30_DAYS`) | — |
| Hora (9) | `HH:MM` 24h | data-hora ISO completa — o `HH:MM` é embutido numa data | não confundir com duração |
| Duração de Tarefa (`Length`) | `HH:MM:SS` ou "2 horas e 30 minutos" | inteiro de **segundos** | não é campo de hora |
| Sim/não (10) | conforme o controle | booleano | — |
| Opções (7) | rótulo da opção; múltipla vira chips com "+N" | Id da opção em `IntegerValue` | ver pegadinha acima |
| Telefone (7, variante) | máscara **dinâmica por país** | número sem pontuação + `CountryId` à parte | máscara vem de `Country.PhoneMask`; `?9` = dígito opcional; trocar o país **reaplica** a máscara |
| CPF (11) · CNPJ (12) | `000.000.000-00` · `00.000.000/0000-00` | string | ver nota abaixo |
| CEP | `00000-000` | 8 dígitos (BR); estrangeiro segue máscara do país | — |
| Endereço (17) | texto | texto livre + metadado do lugar quando há | — |
| Cor (20) | hex | string hex (`#7E33E6`) | — |
| Imagem (18) | miniatura | URL/caminho | — |
| Anexo (19) | nome + tamanho em B/KB/MB/GB | lista de `{ Id, nome, tamanho, autor, data, tipo MIME }` | — |
| Desenvolvedor (22) | o resultado do código, executado em contexto isolado | código HTML/CSS/JS em `BigStringValue`, sem limite de tamanho | não é digitado no formulário; somente leitura para o usuário final |

> ⚠️ **Divergência a confirmar — CPF/CNPJ.** O princípio geral e a tabela de
> máscaras diziam "armazene só os dígitos, sem pontuação"; o arquivo específico de
> CPF dizia "texto com a máscara aplicada". A API guarda em `StringValue`, o que
> não decide o formato. **Confirme com o backend antes de gravar**, e siga o que já
> existe no banco da Conta — trocar o formato quebra busca e comparação com o dado
> legado.

## Máscara não é opcional

Renderizar CPF, CNPJ, telefone ou CEP como campo de texto cru é armadilha comum: o
campo passa a aceitar lixo, deixa de validar e diverge do resto do produto. Esses
tipos aplicam máscara **na digitação e em repouso**.

- Máscara usa `9` = dígito, `a` = letra. CPF e CNPJ têm máscara fixa; texto simples
  aceita máscara configurável.
- **Uma máscara por campo.** Quando parece precisar de duas (DDI + número +
  ramal), o caso é um campo composto, não um campo com duas máscaras.
- Texto simples com máscara **não substitui** CPF/CNPJ — os campos específicos
  fazem validação de dígito verificador, que máscara não faz.

## Validação

- **CPF e CNPJ** têm validação de dígito verificador (módulo 11) executada no blur.
  Inválido → status de erro e mensagem no texto auxiliar.
- **Unicidade** ("e-mail já existe") é assíncrona, com debounce de **250 ms**. Cada
  mudança cancela a verificação anterior. Estados: verificando (spinner),
  verificado e único, verificado e duplicado (erro + mensagem).
- **Limite de caracteres** mostra contador, que muda para cor de erro ao se
  aproximar do limite.
- **Conteúdo de campo multilinha não é confiável.** Mostre como texto; se precisar de
  formatação, passe por um sanitizador com lista de permissões de tags antes de
  renderizar, nunca com `innerHTML` direto.

Todo esse estado é agregado num sinal de validade que o formulário escuta para
habilitar o submit — ver [`escrita-e-validacao.md`](./escrita-e-validacao.md).

## Campo que aponta para outro registro

Cliente de um Negócio, Responsável, Produto de uma Proposta: o valor guardado é o
**Id do registro**, não o texto que aparece na tela. Três consequências que viram
bug quando passam batidas:

- **O rótulo do valor salvo é carregado à parte, por Id.** O registro já
  selecionado quase nunca está no primeiro lote de opções — esperar encontrá-lo na
  lista deixa o campo aparentemente vazio ao abrir a ficha.
- **Registro que deixou de existir continua referenciado.** O valor é exibido em
  estado de removido, com o rótulo que houver, em vez de desaparecer em silêncio.
- **A lista de opções é sempre um recorte do servidor**, com busca e paginação —
  contrato em [`dados-e-listagem.md`](./dados-e-listagem.md). Carregar a coleção
  inteira para filtrar no cliente não é uma alternativa a esse recorte.

## Modos, não componentes separados

Somente-leitura e edição-sob-demanda são **modos** do mesmo campo:

- **Somente leitura** — não responde a entrada, valor exibido como texto formatado,
  indicador de bloqueio na área de validação.
- **Edição inline** — botão de lápis aparece no hover; clicar abre o fluxo de
  edição (popover ou modal, a cargo de quem consome).
- **Combinado** — "valor em leitura + editar via popover" é o padrão da ficha de
  registro.
- **Somente-leitura e desabilitado não se combinam.** São conceitos diferentes
  (um é apresentação passiva, o outro é interação desligada); juntos, a semântica
  fica ambígua.

## Campo Desenvolvedor

O valor do campo Desenvolvedor (TypeId 22) é código HTML/CSS/JS, e o produto o
renderiza num contexto isolado. O host injeta nesse contexto o global `PloomesServer`,
que dá acesso à API como o usuário que abriu o registro.

As chamadas à API são **métodos de instância** — `get`, `put`, `post`, `postFile`,
`patch`, `delete` —, cada um recebendo **um único objeto**: `url` relativa,
`headers` opcionais, e o corpo em **`body`** (`formData` no `postFile`). A
instância resolve a URL base pelo host set da Conta e autentica como o usuário logado, então o código do campo não monta autenticação:

```js
const deals = await new PloomesServer().get({ url: "Deals?$filter=Id eq 123" });
```

A Promise resolve o **array de dentro do envelope OData**, não o envelope; resposta
que não é coleção chega como array de um elemento. Ela também expõe `kill()`, que
cancela a requisição em andamento.

Nunca coloque chave de API nem senha no código do campo: o fonte é entregue ao
navegador de quem abre o registro.

## Armadilhas conhecidas

- **Refazer um campo por fora**, montando os componentes internos na mão, perde o
  contrato universal: validação, máscara, estados e acessibilidade vêm junto do
  campo, não do controle genérico.
- **Formatar no estado** em vez de na renderização — ver a regra do topo.
- **Dois campos no mesmo lugar visual** para simular um híbrido não é um campo
  válido; cada posição usa o campo correto do seu tipo.
- **`aria-label` junto de `label` visível** é redundante e pode conflitar com
  `aria-labelledby`.
- **Contorno no controle interno.** O contorno e o anel de foco pertencem ao
  wrapper do campo; o `<input>` interno vai com `border: 0; outline: 0`. Os dois
  juntos geram contorno duplo concêntrico.
- **Controle nativo do browser no lugar do campo.** Lista de opções, data e
  seleção de registro têm campo próprio no produto; o controle cru do navegador
  entra apenas **encapsulado** por ele (hora, cor, arquivo e o calendário de data
  são assim de propósito). Solto, ele traz a altura e o realce do sistema
  operacional e quebra tema e whitelabel.
- **Conjunto de campos escolhido no código.** Quais campos de uma entidade
  aparecem é resposta do metadata resolvido **para o usuário autenticado**, pelo
  `Hidden` de cada campo — é ali que vive a permissão de exibição. Uma lista decidida no código ignora essa permissão.
  Ver [`conta-e-localizacao.md`](./conta-e-localizacao.md).

## Tipos e lacunas

A taxonomia de TypeId é fechada — um tipo por TypeId, e TypeId fora do catálogo não
tem campo correspondente.

Os TypeIds `3`, `14`, `15` e `16` **não existem** — são lacunas na sequência. A
divergência que esta doc registrava (a tabela do backend listava `14`, `15` e `16`
como Order taxes, Discount e Additional taxes) foi medida e resolvida a favor da
documentação de negócio: a plataforma tem 20 tipos — `1`, `2`, `4`–`13` e `17`–`24` —
e a [tabela do backend](../api-docs/07-fields-and-entities.md) foi corrigida.

Validação por tipo, do lado de negócio, em
`ploomes-tech-docs:business-docs`.
