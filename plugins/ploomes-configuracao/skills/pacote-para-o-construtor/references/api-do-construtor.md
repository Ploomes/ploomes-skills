# A API do construtor de telas

O construtor de telas (AI Builder, o Estúdio IA da interface) tem uma API própria, a mesma que a interface
usa. Por ela a tela **nasce, é baixada e ganha versão nova sem passar pela IA do Ploomes**: o arquivo vai
inteiro, o construtor compila e guarda a versão, e o crédito de IA da conta não se move. É a rota padrão
do passo 9 da `SKILL.md`; o script que a usa é o `scripts/construtor_api.py`.

| | |
|---|---|
| Host | `https://ai-builder.ploomes.com/api` |
| Autenticação | cabeçalho `user-key`: a mesma User-Key da API pública do Ploomes (usuário de integração serve) |
| Chave | o arquivo apontado com `--env`, na linha `UK_PLOOMES_CLIENTE=<chave>`. ⛔ Nunca na conversa, no pacote, na tela nem na saída do script |

⚠️ **A API não é documentada pelo produto.** O que está aqui foi medido no construtor em uso e no teste
em produção de 2026-10-28, abaixo. ➜ Se a API divergir do que está aqui, vale o
construtor: suba pelo editor (a outra rota do passo 9) e corrija este arquivo.

## 1. O teste em produção (2026-10-28)

Numa conta de teste, em `https://ai-builder.ploomes.com/api`:

| Passo | Resultado |
|---|---|
| `POST /projects` com `hasScreen: true` | a tela nasceu em Telas personalizadas, ainda sem versão |
| `code/save` num projeto sem versão | gerou a primeira versão a partir do modelo; build `ready` |
| `baixar` dessa versão | 26 arquivos de texto; o `hero.png`, binário, fica de fora |
| segundo `code/save`, com um arquivo alterado e um arquivo **novo** | versão nova, build `ready`; os arquivos relidos idênticos ao enviado; a tela **não** foi publicada |

➜ **Arquivo novo nasce pelo `code/save`, sem mensagem no chat.** Pelo editor (DevTools), arquivo novo só
nasce pedindo ao chat do construtor, e isso gasta crédito: é a principal razão de a API ser a rota padrão.

## 2. As rotas que o script usa

| Rota | Corpo | Resposta e efeito | Comando |
|---|---|---|---|
| `GET /templates` | — | `[{id, name}]`. Tela: `f9f2b866-f94b-435d-a58d-787e8202fccf` (`ploomes-ai-builder-module-scaffold`); CPQ: `e0f7d84e-e113-47ba-8db1-0286ddd22d4c` | `listar`, `criar` |
| `GET /projects?templateId=<t>&hasScreen=<true\|false>&limit=100` | — | a lista. 🔴 **Sem filtro, a lista esconde projetos**: varra modelos × `hasScreen` | `listar` |
| `GET /projects/<id>` | — | `name`, `state`, `hasScreen`, `previewUrl`, `deploymentUrl`, `deployedAt`, `lastVersionAt` | `baixar`, `salvar` |
| `POST /projects` | `{accountId, name, nameSource:"user", templateId, hasScreen:true, permissionType:"users", allowedUsers:[Ids], iconClass}` | 201 com o projeto, **ainda sem versão**. `hasScreen` não muda depois | `criar` |
| `GET /modules/<id>` | — | `{name, iconClass, permissionType, allowedUsers, deploymentUrl}` | `listar`, `criar` |
| `PATCH /modules/<id>/permissions` | `{permissionType:"users", grantIds:[Ids], iconClass}` | 204. 🔴 A lista é **inteira**: substitui, não soma | `criar`, só se a permissão não saiu como pedida |
| `GET /projects/<id>/snapshots` | — | as versões, **a mais recente primeiro**: `{id, deployed, buildStatus, createdAt}` | `baixar`, `salvar` |
| `GET /projects/<id>/snapshots/<s>/source` | — | `{paths:[…]}` | `baixar`, `salvar` |
| `GET /projects/<id>/snapshots/<s>/source/content?path=<p>` | — | o arquivo, como texto JSON; `.json` volta como objeto. ⛔ **Binário chega corrompido** | `baixar`, `salvar` (releitura) |
| `POST /projects/<id>/code/save` | `{files:[{path, content}]}`, cada arquivo **inteiro** | 202 `{status:"accepted", runId}`; versão nova em 10 a 30 s, não publicada. Caminho que não existe **cria** o arquivo. Num projeto sem versão, gera a primeira a partir do modelo. Registra no chat uma entrada `code_save` com custo 0 | `criar`, `salvar` |

Da API pública do Ploomes (`https://public-api2.ploomes.com`), o script lê `Account` (a conta que a chave
abre), `Self` (o usuário da chave) e `Users` (para achar quem pode usar a tela pelo e-mail); no `ler-conta`,
também `DealsPipelines`, `Fields`, `Checklists`, `DocumentTemplates` e `Fields@OptionsTables@Options`, só GET.

## 3. O que a skill não faz pela API

Publicar, restaurar versão e conversar com a IA do construtor são pela interface.

**Sem rota conhecida:** excluir a tela (só pela interface) e excluir arquivo — o `code/save` não apaga;
o arquivo que sai de uso fica na tela.

## 4. O script

`<skill>` é o caminho absoluto da skill `pacote-para-o-construtor`; as pastas também vão em caminho absoluto.

```
python -I <skill>/scripts/construtor_api.py ler-conta --env <arquivo> --conta <Id> --saida <arquivo .json> [--tabelas <Ids>] [--entidades <Ids>]
python -I <skill>/scripts/construtor_api.py listar    --env <arquivo> [--conta <Id>]
python -I <skill>/scripts/construtor_api.py baixar    --env <arquivo> --projeto <GUID> --pasta <pasta NOVA> [--versao <id>]
python -I <skill>/scripts/construtor_api.py criar     --env <arquivo> --conta <Id> --nome "<nome>" (--usuarios <Ids> | --emails <e-mails>)
                                                      [--icone fa-sparkles] [--permitir-mesmo-nome]
python -I <skill>/scripts/construtor_api.py salvar    --env <arquivo> --conta <Id> --base <pasta do baixar> --editado <pasta da tela>
                                                      [--pacote <pacote-construtor> | --tela-existente] [--permitir-novos]
python -I <skill>/scripts/construtor_api.py --autoteste
```

| Opção | O que faz |
|---|---|
| `--env` | o arquivo da chave, com a linha `UK_PLOOMES_CLIENTE=<chave>`; `--variavel` lê outra linha |
| `--conta` | o Id da conta que a chave tem de abrir, conferido em `Account`. **Obrigatório na escrita e no `ler-conta`**: chave de outra conta para tudo antes de gravar ou de ler |
| `--executar --confirmo "CONFIRMO <n>"` | sem elas, `criar` e `salvar` só simulam e mostram o plano. O `<n>` é o número que o plano mostra (1 no `criar`; o total de arquivos no `salvar`) |
| `--pacote` | tela construída aqui: o `api.ts`, o `useConexao.ts` e o onboarding conferem com o pacote |
| `--tela-existente` | tela já em produção: a referência é a base baixada, e o que ela já tinha é herdado |
| `--permitir-novos` | aceita arquivo que a base não tem. Sem ela, arquivo novo para o `salvar` |
| `--permitir-mesmo-nome` | o `criar` cria mesmo havendo tela com o mesmo nome. Sem ela, ele para antes de gravar |

- **`ler-conta`** é a conferência da conta do passo 2 sem o MCP. Só GET, pelas rotas que o `api.ts` gerado
  usa, com paginação por Id (nunca `$skip`), e grava num `.json` a conta, os funis com as etapas, os campos
  (`Key`, `Name`, `EntityId`, `TypeId`, `OptionsTableId`), os checklists com os itens, os modelos de documento
  e, com `--tabelas`, as opções dessas tabelas. Com `--entidades`, só os campos dessas entidades.
- **`criar`** para se a chave já enxerga tela com o mesmo nome (sem diferença de maiúscula), faz o
  `POST /projects` com `hasScreen: true`, põe o usuário da chave entre quem pode usar a tela e grava um
  `src/App.tsx` mínimo, que gera a primeira versão.
- **`baixar`** grava o código da versão e o `.construtor.json` numa pasta **nova**. Pula binário. Se falhar
  no meio, apaga a pasta parcial: base pela metade nunca vira base. No Windows grava com caminho longo,
  porque a pasta da tela pode passar dos 260 caracteres.
- **`salvar`**, antes de chamar a rede, para se o `.construtor.json` da pasta editada (o da última subida
  dela) aponta outra versão da mesma tela que a base, compara a pasta editada com a base e roda **o mesmo
  portão do `.zip`** (`empacotar_importacao.py`), numa cópia do `src/` num caminho curto, porque o Windows não
  lê além de 260 caracteres. Depois para se a versão mais recente não for a base, mostra o diff e o plano,
  envia só o que mudou (em LF), espera o build, relê cada arquivo e confere que a publicação não mudou. Grava
  o `.construtor.json` novo na pasta editada.
- **`.construtor.json`:** `projeto`, `nome`, `versao`, `versao_mais_recente`, `versao_publicada`, `build`,
  `arquivos`, `binarios_nao_baixados`, `gravado_em`. O `build`: no `baixar`, `pronto`, `falhou` ou o estado
  que a API devolveu, como veio (o build ainda em curso); no `salvar`, `pronto` ou `falhou` — e `falhou`
  também cobre o build que não terminou no tempo de espera.
- **O que ele nunca faz:** chamar a IA do Ploomes, publicar, imprimir ou gravar a chave (em erro ela sai
  como `<USER_KEY>`), enviar `src/main.tsx`, `src/lib/` ou binário, reenviar escrita sem resposta certa, e
  chamar host que não seja os dois acima — `CONSTRUTOR_API` e `CONSTRUTOR_CRM` só aceitam
  `http://127.0.0.1:<porta>`, do autoteste.

## 5. Armadilhas

Cada uma aconteceu de verdade. Sintoma → causa → o que fazer.

**A tela aparece como conversa, não em Telas personalizadas.** A aba Telas lista só `hasScreen: true`. A
interface cria com `false` quando a pessoa começa pelo chat, e quem liga o campo é o evento
`screen_enabled`, que só a IA dispara. `PATCH /projects` com `hasScreen` é aceito e ignorado, e o
`code/save` não liga o campo: **criada com `false`, vira só conversa.** ➜ O `criar` sempre cria com `true`.
A tela errada se exclui pela interface.

**A tela foi criada e a chave não consegue editar, ou ela some do `listar`.** Com `permissionType:
"users"`, só quem está em `allowedUsers` acessa — **inclusive a própria chave**. ➜ O `criar` sempre
inclui o usuário da chave. Numa tela que já existe, alguém com acesso inclui o usuário da chave em "Quem
pode usar essa tela"; sem ninguém para isso, suba pelo editor.

**`PATCH /modules/<id>/permissions` tirou gente da tela.** `grantIds` substitui a lista inteira. ➜ Leia
`GET /modules/<id>` antes e mande a lista completa.

**Salvou e a mudança de outra pessoa sumiu.** O `code/save` não leva versão base: grava por cima do que
estiver lá. ➜ O `salvar` tem duas travas. Só grava se a versão mais recente ainda for a base do `.construtor.json`;
parou nela? Alguém salvou pelo editor, pelo chat ou restaurou uma versão depois do `baixar`: baixe de novo
numa pasta nova e refaça a edição sobre ela. E, como a base é baixada de novo a cada entrega, só grava se a
pasta editada ainda estiver na versão da base: parou com *"a tela mudou no construtor desde a sua última
subida"*? A base nova já traz a mudança de outra pessoa. Compare o `src/` dela com a pasta editada, traga o
que fica e copie o `.construtor.json` da base para a pasta editada antes de repetir.

**O build não ficou `ready`.** Erro de TypeScript no construtor, ou o build não terminou no tempo de
espera. O construtor roda `tsc -b` com variável e parâmetro sem uso como erro (TS6133); a `tsconfig.json` da
bancada tem as mesmas duas regras, para o erro aparecer aqui antes de subir. ➜ O `salvar` não declara sucesso e grava a versão com `"build": "falhou"` nos dois casos, para a
próxima trava comparar com ela; confira na interface qual foi. Revise os imports: tipo importado
explicitamente (`import { type FormEvent } from 'react'`, não `React.FormEvent`), nada sem uso, `type` no
import só de tipo. Corrija e salve de novo.

**Tempo esgotado, 5xx ou conexão caída no `code/save` ou no `POST /projects`.** O servidor pode ter
aplicado; só a recusa com 4xx é certa. ➜ Nunca reenvie. No `code/save`, o script consulta `snapshots` e diz
o que existe. No `POST /projects` ele não tem o Id da tela para consultar: confira em Telas personalizadas,
ou com o `listar`, se a tela nasceu. Um segundo `criar` deixaria duas telas no CRM do cliente, e não há rota
para excluir — por isso o `criar` para quando já há tela com o mesmo nome.

**Imagem ou fonte quebrada depois de baixar e salvar.** O `source/content` corrompe binário. ➜ O script
não baixa nem envia binário. Use imagem por URL ou SVG dentro de um `.tsx`.

**Arquivo `.json` voltou formatado diferente.** A API devolve `.json` como objeto, e o script o reescreve
com recuo de 2. Arquivo que não foi editado não entra no diff e não é enviado.

**Salvou e o usuário não vê a mudança.** Salvar cria versão **não publicada**. ➜ Quem pede testa em "Ir para
edição" e publica pela interface. O endereço publicado nasce na primeira publicação.
