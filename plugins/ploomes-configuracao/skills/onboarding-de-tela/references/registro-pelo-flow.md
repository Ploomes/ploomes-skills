# O registro pelo flow

> Decisão de 27/10/2026: **todo onboarding atualiza no Usuário os campos de acompanhamento** — quantas vezes
> a pessoa assistiu, quantas vezes voltou, se concluiu e quando (SKILL.md, regra 11) —, e **quem grava é um flow do
> Ploomes Flows**, com a chave de integração: "é mais seguro". A tela só avisa o que aconteceu; o flow decide e grava.
> É a parte que ficou de todos os desenhos de onboarding testados num cliente: o que ele aprovou foram os campos
> para medir. Cada onboarding tem o seu conjunto de campos e manda o slug dele em `tela`.

## 1. Por que o flow

A tela roda com a chave de quem abriu. Gravando direto (`PATCH Users`), o perfil que não pode alterar o próprio
usuário recebe 403 e nada se grava — e liberar essa permissão no perfil abre mais do que o onboarding precisa. O flow
grava com a chave de integração, igual para todo perfil, e a regra de quanto somar mora num lugar só.

## 2. Os campos no Usuário

Proponha a quem pede e crie **só com o OK explícito dele** na conversa — pelo MCP do Ploomes (`salvar_campo`, entidade
Usuário) ou, sem ele, quem pede os cria pela interface do Ploomes. É escrita na conta do cliente. Com mais de um
onboarding na conta, o nome da tela entra no nome do campo.

| Campo (Usuário) | Tipo | O que o flow grava |
|---|---|---|
| Vezes que assistiu o onboarding | Número inteiro | +1 a cada conclusão |
| Vezes que consultou o onboarding | Número inteiro | +1 a cada vez que a pessoa volta a abrir (uma vez por sessão) |
| Concluiu o onboarding | Sim/Não | **vazio** = nunca abriu · **Não** = abriu e não terminou · **Sim** = concluiu |
| Última conclusão do onboarding | Data e hora | a data da última conclusão |

Depois, retrato novo: as FieldKeys (`user_…`) saem do `campos_do_usuario.json` e vão para a configuração do flow.

## 3. O contrato

A tela manda, a cada evento, um `POST` para a URL do webhook do flow:

```
Content-Type: text/plain;charset=UTF-8
{"tela":"mapa-da-jornada","usuarioId":1234567,"evento":"abriu","quando":"2026-10-27T18:15:49.241Z"}
```

🔴 **O corpo é JSON, mas vai como `text/plain`.** Com `application/json` o navegador manda antes um `OPTIONS` (o
preflight de CORS), que o webhook do Flows pode não responder — e aí o `POST` nem sai. `text/plain` é pedido simples:
vai direto. O flow lê o corpo como texto e converte em JSON no primeiro passo.

| `evento` | Quando | O que o flow grava no Usuário `usuarioId` |
|---|---|---|
| `abriu` | uma vez por sessão do navegador, quando a pessoa abre a tela | *Concluiu* vazio → grava **Não** (a primeira abertura). Já tem Sim ou Não → *Vezes que consultou* **+1** |
| `concluiu` | quando o onboarding daquela tela fecha — o que "fechar" quer dizer é decisão do desenho e fica escrito na especificação: no bloco do mapa, simular até o fim todos os funis do caminho da pessoa; numa tela com o kit, o tour inteiro | *Vezes que assistiu* **+1**, *Concluiu* = **Sim**, *Última conclusão* = agora |

**Na tela, é o kit** (`kit/registro.ts`): `useRegistroDaAbertura({ webhook, tela, usuarioId, pronto })` no `App.tsx` e
`registrar({ webhook, tela, usuarioId, evento: 'concluiu' })` onde o onboarding fecha — numa tela com o kit, no
`aoConcluirTour` do provider (`fim.tipo === 'completo' && fim.concluiu`). O bloco do mapa já vem ligado
(`WEBHOOK_DO_REGISTRO`, no `jornada.ts`). Sem webhook, nada sai e a tela só anota *desligado*; a conferência avisa.

A resposta do flow pode não trazer o cabeçalho de CORS: a tela então não lê a resposta e anota *sem-resposta* — o
evento pode ter chegado. Confira no cadastro do usuário de teste, não no console.

## 4. O flow, passo a passo

1. **Gatilho:** webhook.
2. **Lê o corpo como texto e converte em JSON.** Confere: `evento` é `abriu` ou `concluiu`; `usuarioId` é número;
   `tela` é a deste onboarding. Fora disso, para sem gravar.
3. **Lê o usuário:** `GET Users?$filter=Id eq {usuarioId}&$select=Id&$expand=OtherProperties` — sem resultado, para.
4. **Calcula** pela tabela da seção 3, a partir dos valores atuais (vazio conta como zero).
5. **Grava:** `PATCH Users({usuarioId})` só com `OtherProperties` — `IntegerValue` nos dois contadores, `BoolValue`
   no *Concluiu*, `DateTimeValue` na *Última conclusão*. Nunca outro campo do usuário.
6. **Responde 200.**

As FieldKeys entram no flow como configuração, não fixas no código.

## 5. Como montar

⚠️ **Em aberto (27/10/2026):** o JSON deste flow ainda não foi gerado nem testado numa conta real.

- Gere o JSON de importação com a skill **`anthropic-skills:ploomes-flows-builder`**, em modo genérico, passando este
  arquivo como especificação — ou, sem ela, monte o flow à mão no Ploomes Flows, pela seção 4. Importe no Ploomes
  Flows da conta do cliente, ponha as quatro FieldKeys e a chave de integração, e copie a URL do webhook para a tela.
- Teste antes de ligar a tela: um `POST` (`text/plain`) com `abriu` para um usuário de teste, e confira no cadastro
  dele que *Concluiu* virou Não; outro `abriu`, e *Vezes que consultou* foi a 1.
- Na bancada, o flow é simulado: `"flowDoOnboarding"` no `dados-de-teste.json` (as quatro FieldKeys) e o webhook em
  `http://localhost:<porta da bancada>/_bancada/flow/onboarding` — é o que o exemplo do bloco usa
  (`modelo-treinamento/exemplo/bancada/`), e o QA do avanço confere o que ficou gravado em cada usuário. 🔴 **A URL
  da bancada nunca sobe**: a conferência dá ERRO quando o webhook aponta `localhost`.

## 6. O cuidado com o webhook

⚠️ **É a exceção declarada a duas regras de outras skills.** A `indicacao-de-tela` manda disparar flow pelo registro no
Ploomes, com a automação chamando o flow, e nunca por URL de webhook no navegador; e o empacotador da
`pacote-para-o-construtor` só deixa o `api.ts` falar com a rede. O evento do onboarding não tem registro no Ploomes
que o dispare — abrir uma tela não grava nada —, então ele vai pelo webhook, e só pelo `kit/registro.ts` igual ao da
skill, que o empacotador aceita. ⛔ A URL não entra na especificação nem no protótipo (o portão da indicação bloqueia):
ela só existe no código da tela.

A URL vai no código da tela e qualquer um com ela consegue mandar um evento. O pior que se faz com isso é mexer num
contador do onboarding — por isso o flow só grava esses quatro campos e confere o pedido no passo 2. ⛔ Nunca ponha a
chave de integração na tela: ela fica no flow.
