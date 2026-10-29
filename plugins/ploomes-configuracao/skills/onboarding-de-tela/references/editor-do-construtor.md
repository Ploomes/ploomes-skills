# Subir para o construtor: pela API, pelo editor (DevTools) ou pelo `.zip`

> A rota padrão é a **API** (seção 0): grava a versão sem a IA do Ploomes e cria arquivo novo sem mensagem no
> chat. O **editor** (seções 1 a 4) é o caminho que funcionou nas primeiras contas e fica como
> alternativa. O **`.zip`** (seção 5) sai em toda subida, por qualquer rota. Qual rota usar e
> quando trocar está no passo 9 da skill `pacote-para-o-construtor`
> ([`SKILL.md`, passo 9](../../pacote-para-o-construtor/SKILL.md)). As ferramentas do editor estão em
> `ferramentas/`; rode-as com Node 22 ou mais novo.

## 0. A rota da API

Por ela a tela nasce, é baixada e ganha versão nova **sem a IA do Ploomes**: o arquivo vai inteiro, e o crédito
de IA da conta não se move. O script é o `construtor_api.py` da skill `pacote-para-o-construtor`
(`<pacote-para-o-construtor>/scripts/`); as rotas e as armadilhas estão no
[`api-do-construtor.md`](../../pacote-para-o-construtor/references/api-do-construtor.md) dela — leia antes da
primeira subida.

- **A chave** vem do arquivo apontado com `--env <arquivo>` (linha `UK_PLOOMES_CLIENTE`) — o mesmo arquivo do
  retrato. O `--conta <Id>` é o do retrato. Sem a chave no arquivo, peça a quem pede que a preencha — nunca na
  conversa — ou suba pelo editor.
- ⛔ **Escrita só com o plano aprovado.** `criar` e `salvar` sem `--executar` só simulam. Mostre a quem pede o plano
  (no `salvar`, também o diff), espere o OK em texto e só então repita com `--executar --confirmo "CONFIRMO <n>"`,
  com o número que o plano mostrou. ⛔ **Publicar é de quem pede**, pela interface.

**Primeira vez — a base:**
1. **Tela nova:** `construtor_api.py criar --env <arquivo> --conta <Id> --nome "<nome>" --emails <quem vai
   usar>`. Pergunte a quem pede quem pode usar a tela; o script inclui o usuário da chave, sem o qual a chave não edita
   a tela depois. ➜ Nesta rota quem pede não cria a tela em branco pela interface: quem cria é a skill.
2. `construtor_api.py baixar --env <arquivo> --projeto <GUID> --pasta <tela>/codigo-v1`. O `criar` imprime o
   GUID; numa tela que já existe, o `listar` dá. Grava o código e o `.construtor.json` (a tela e a versão), que é o
   que faz da pasta uma base.

**A base de cada subida** é a última `codigo-v…-salva` — na primeira subida de tela nova, a `codigo-v1`. Ela
precisa do `.construtor.json` da versão mais recente do construtor; sem ele, veja *Trocar de rota*, abaixo.

**Cada subida:**
1. **O `.zip`, antes, em toda subida.** ➜ *Por quê:* é a cópia portátil, que deixa quem pede editar a tela localmente
   a qualquer momento, sem depender da API nem do editor. Reprovou? Não sobe por rota nenhuma.
   ```
   python -I <pacote-para-o-construtor>/scripts/empacotar_importacao.py <tela>/codigo-vN <tela>/<slug>-<AAAAMMDD-HHMM>.zip [--tela-existente <base>]
   ```
   O nome leva a data e a hora em que o `.zip` foi gerado, e o empacotador recusa saída que já existe: o `.zip` sai
   antes da subida, quando a versão ainda não existe, e a `pacote-para-o-construtor` grava `.zip` na mesma pasta.
   Quem liga uma pasta a uma versão do construtor é o `.construtor.json`. O modo, em toda subida: **tela nova do onboarding, sem a flag; tela que já existia, com ela** (o porquê está
   abaixo, em *O modo do portão*).
2. **Simule o `salvar`** — roda o mesmo portão do `.zip` e para se a versão mais recente do construtor não é a da
   base:
   ```
   python -I <pacote-para-o-construtor>/scripts/construtor_api.py salvar --env <arquivo> --conta <Id> --base <base> --editado <tela>/codigo-vN [--tela-existente] --permitir-novos
   ```
   O mesmo modo do passo 1: **tela nova do onboarding, sem a flag; tela que já existia, com ela.** Mostre a quem pede os
   prints, o diff e o plano. Com o OK em texto, repita com `--executar --confirmo "CONFIRMO <n>"`.
3. **Build pronto:** o script grava o `.construtor.json` novo na `codigo-vN`. Copie-a inteira para
   `codigo-vN-salva` (N = a versão do construtor), com o `.construtor.json` dentro, e escreva no `MUDANCAS.md` o que
   mudou. **Build que não ficou pronto:** o script não declara sucesso e grava a versão com `"build": "falhou"`; ela
   existe no construtor, então também vira `codigo-vN-salva`, e a correção vai numa `codigo-vN` nova. **Tempo
   esgotado:** nunca repita o comando; o script mostra as versões que existem, e você confere antes de qualquer outra
   tentativa.
4. Quem pede abre a tela em Telas personalizadas → "Ir para edição" e percorre: boas-vindas, tour inteiro numa sessão
   só, cada parte. **Publicar é dele.**

⚠️ **O modo do portão.** A tela que o onboarding criou — a tela de treinamento, o onboarding do processo — **sobe
sem `--tela-existente` em toda subida**, no `.zip` e no `salvar`; a flag é só da tela que já existia e ganha o
onboarding. ➜ *Por quê:* esse modo protege a tela em produção que só ganha, e por isso só aceita arquivo novo em
`src/onboarding/`; a tela nova ganha também o `src/treinamento/` do mapa e do simulador, e o portão a reprovaria.
Sem o modo, o portão confere a base do construtor intacta e as regras de código, e o onboarding fica com a
`conferir_onboarding.py`, que já rodou. Sem o modo, duas paradas:
- **"a base do construtor mudou: atualize bancada/scaffold/src…"** — o `salvar` (e o `.zip`) exige que a
  `src/main.tsx` e a `src/lib/` sejam iguais às da `bancada/scaffold/src/` da `pacote-para-o-construtor`. O
  construtor mudou a base: faça o que manda *Cuidados deste ambiente* na
  [`SKILL.md`](../../pacote-para-o-construtor/SKILL.md) dela e suba depois;
- **"src/lib/… sumiu"** — a cópia de trabalho não tem a `src/lib/` (baixada pelo editor, com a `lib` recolhida), e
  cada arquivo que falta é um bloqueio. Baixe a versão pelo `baixar` numa `codigo-vN-baixada`, que vem completa: ela
  é a base do `.zip` e do `salvar`, e a `codigo-vN` de trabalho parte dela.

🔴 **Arquivo novo sobe junto, sem mensagem no chat do construtor**: o `--permitir-novos` o aceita, e o crédito de IA
não se move. Na rota do editor, arquivo novo continua exigindo uma mensagem ao chat (seção 3). **Apagar arquivo**
não tem rota na API — o `code/save` não apaga, e o arquivo que sai de uso fica na tela, sem uso.

**Trocar de rota no meio.** A cópia local tem o mesmo nome nas duas rotas (`codigo-vN` → `codigo-vN-salva`), e o
`.construtor.json` vai junto em toda cópia — também na rota do editor, sem editar. ➜ *Por quê:* é ele que guarda a
versão da última subida pela API, e assim a troca não perde a trava. As duas rotas pegam a versão que a outra
criou:
- **depois de uma subida pelo editor**, o `salvar` para na trava de versão (ou pela falta do `.construtor.json`).
  Baixe a versão mais recente numa pasta nova, `codigo-vN-baixada`, e compare o `src/` dela com a `codigo-vN-salva`:
  iguais, ela é a base e a `codigo-vN` de trabalho parte dela — copiada da baixada, ou com o `.construtor.json` dela
  copiado por cima, senão o `salvar` para com *"a tela mudou no construtor desde a sua última subida"*; diferentes,
  alguém mexeu — mostre a quem pede e combine o que vale;
- **depois de uma subida pela API**, o `comparar-todos` do editor contra a `codigo-vN-salva` (seção 3, *Cada
  subida*, passo 1) é o que confere antes de trocar arquivo.

## 1. O navegador de trabalho (uma vez por máquina)

Um Chrome (ou Edge) **com perfil próprio e porta de depuração**, numa janela separada do navegador do dia a dia.
Quem pede roda isto e entra no Ploomes com o login dele:

```
"C:\Program Files\Google\Chrome\Application\chrome.exe" --remote-debugging-port=9333 --user-data-dir="%USERPROFILE%\.chrome-ploomes-devtools" https://app.ploomes.com
```

- O `--user-data-dir` é obrigatório: o Chrome recusa a porta no perfil padrão, e o perfil próprio não enxerga as
  abas, os logins nem as extensões do Chrome pessoal.
- Confira: `curl http://127.0.0.1:9333/json/version` responde.
- ⛔ **Nunca o navegador pessoal**, e nunca o MCP `chrome-devtools` com `--auto-connect` — ele se liga ao Chrome
  que estiver aberto, que costuma ser o pessoal. Com o MCP, use `--browserUrl=http://127.0.0.1:9333`.
- ⛔ **Login e segredo são de quem pede.** Nunca digite senha nem chave em campo nenhum. A tela recebe a chave do usuário
  pelo Ploomes (`config.userKey`); nada de chave no código, e nada de chave capturada do tráfego do navegador.

## 2. As ferramentas

| Comando | Para quê |
|---|---|
| `node cdp.mjs nova <url>` | abre a tela numa aba nova e devolve o id — guarde-o |
| `node cdp.mjs foto <id> <png>` | **sempre leia o print antes de clicar**: as coordenadas mudam com a largura dos painéis |
| `node cdp.mjs clique <id> <x,y>` | clique de mouse de verdade (`.click()` pelo JavaScript não abre o editor) |
| `node cdp.mjs ativar <id>` | traz a aba para a frente — **aba em segundo plano congela o `fetch`** e o teste dá resultado falso |
| `node cdp.mjs digitar <id> <texto\|@arq>` | escreve no campo com foco (o chat do construtor não é um textarea) |
| `node cdp.mjs texto <id>` · `js` · `jsm` | lê o texto, roda JS na página ou num frame |
| `node editor.mjs baixar <aba> <pasta-nova>` | baixa os arquivos **abertos na árvore** — recusa pasta que já tem arquivo |
| `node editor.mjs comparar-todos <aba> <pasta>` | todos os arquivos abertos contra a cópia local |
| `node editor.mjs trocar <aba> <pasta> <src/…>` | troca um arquivo pelo da pasta local |
| `node editor.mjs erros <aba>` | os erros de TypeScript que o editor aponta |

Todo comando para sozinho em 30 s (`CDP_TEMPO`): um comando preso já travou uma sessão inteira.

## 3. O ciclo

**Primeira vez — baixar a base:**
1. Quem pede cria a tela em branco (Ploomes IA → Telas personalizadas → Nova tela) e passa o link `…/ai-chat/<id>`.
2. Abra, clique em "Visualizar código", expanda as pastas e **abra cada arquivo da árvore** (o editor só conhece o
   arquivo aberto). Recolher `assets` e `lib` encurta a árvore.
3. `node editor.mjs baixar <aba> <tela>/codigo-v1` e confira o total com o topo da árvore ("ARQUIVOS · N"). O
   `hero.png` não vem, e nenhum código usa.

**Arquivos novos:** 🔴 **arquivo novo só nasce por mensagem no chat do construtor, e isso gasta crédito de IA da
conta**; o editor só troca o conteúdo de um arquivo que já existe. Por isso a lista de arquivos se fecha **antes** da
primeira subida — o kit, os blocos, o roteiro —, e o desenho evita arquivo que só existe para guardar dado (os módulos
de print da seção 4 são o caso). Mande **uma** mensagem ao chat do construtor pedindo **todos** os
arquivos vazios de uma vez, com o caminho de cada um ("Crie estes arquivos vazios, sem conteúdo: src/onboarding/kit/
Tour.tsx, …"). Custa 4 a 8 mil tokens; o resto do trabalho não gasta crédito. ⚠️ Para o onboarding com o kit são doze
arquivos — os onze do kit e o roteiro —, mais os do bloco do mapa e do simulador, quando entra; e o CSS
(`onboarding.css`) pode não abrir no editor: confira; não abrindo, avise quem pede antes de seguir. **Apagar arquivo também
exige o chat**: o que sai de uso fica no construtor, sem uso, até a próxima mensagem.

**Cada subida:**
1. `comparar-todos` contra a última cópia salva (`codigo-vN-salva`). Algum **DIFERENTE**? **Pare**: alguém mexeu
   pelo construtor. Baixe numa pasta nova, mostre a diferença a quem pede e combine o que vale.
2. Para cada arquivo: abra na árvore → `trocar` → confira no painel "Alterações do código" → próximo. O construtor
   só registra a troca do arquivo **aberto na tela**.
3. `comparar-todos` de novo — abrir um arquivo pode **recarregar a versão anterior** de outro. Depois `erros`:
   "nenhum erro".
4. "Salvar alterações" (painel da esquerda) cria a versão nova; espere uns 40 s e confirme no print.
5. **`comparar-todos` depois de salvar.** ➜ *Por quê:* uma versão já foi salva sem o estilo do tour com o
   `comparar` dizendo IGUAL.
6. Esconda o código e percorra o preview: boas-vindas, tour inteiro numa sessão só (com a aba ativa), cada parte.
7. Copie para `codigo-vN-salva` (N = a versão do construtor) e escreva no `MUDANCAS.md` o que mudou.
8. Diga a quem pede a versão salva. **Publicar é dele.**

## 4. Armadilhas que já custaram tempo

- **Git Bash converte caminho com barra no começo** (`/src/…` vira `C:/Program Files/Git/src/…`): passe `src/…`.
- **Script grande em `node -e` quebra** nas aspas: escreva num arquivo e rode o arquivo.
- **Área de transferência, nunca**: duas vezes ela trouxe o que quem pede copiou no meio — uma vez um texto que parecia
  uma senha, gravado no lugar de um arquivo. Tudo passa pelo `editor.mjs`.
- **Foco no editor por clique não pega** às vezes: `tecla Tab` contando os itens da árvore resolve.
- **Tela em branco no preview**: antes de mexer no código, abra outra tela personalizada. Também em branco? É o
  Ploomes, não o código.
- **Erro 500 ou instabilidade**: pare, avise quem pede e não repita a mesma chamada em loop.
- **O Python no Windows grava CRLF** e o construtor trabalha em LF: os scripts desta skill gravam LF, e o `trocar`
  padroniza.
- 🔴 **Nada de imagem embutida em código** (print em base64 num módulo `.ts`). Num cliente, oito prints da conta em
  base64 levaram o build do construtor a 5 min 29 s, e a montagem passou a estourar o tempo
  limite — *"Não foi possível montar a tela desta vez"* — com o código compilando limpo: a versão com o código idêntico
  ao de uma que tinha montado também falhou. Mais um motivo para o onboarding ensinar pelo simulador e pelo tour sobre a
  tela real, e não por print.
- 🔴 **O tour não pede a camada de tela cheia da ponte** (`useViewportOverlay`): com ela, a ponte congela a página — o
  `#root` fica fixo e o `html` perde a altura — e nada rola; soltar a camada só descongela 1 s depois. No construtor do
  mesmo cliente os passos com alvo abaixo da dobra ficavam no escuro, e a bancada não pegava, porque não imita o
  congelamento. O `Tour` do kit já não pede; as boas-vindas, que não rolam, continuam pedindo.
- **A ponte do construtor só navega pelas rotas do catálogo do Ploomes** (`ModuleNavigationRoute`), e os tipos da
  bancada aceitam texto: o `App.tsx` que compila na bancada pode ser recusado no build do construtor (aconteceu no
  mesmo cliente). Navegação ao CRM só pelos valores do catálogo.

## 5. O `.zip`

O `.zip` sai **em toda subida**, pela API ou pelo editor, com o comando da seção 0 (*Cada subida*, passo 1): é a
cópia portátil da versão. O `scripts/empacotar_importacao.py` da `pacote-para-o-construtor` confere o kit, o roteiro
e o provider e, com `--tela-existente <base>`, compara com a cópia salva; a tela que o onboarding criou empacota
sem esse modo (seção 0). Importar o `.zip` no construtor é a terceira rota: no projeto da tela, nunca num projeto
novo, e primeiro numa cópia se o construtor permitir. A importação ainda não foi usada num cliente.
