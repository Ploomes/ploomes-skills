# O QA do avanço: a tela percorrida como uma pessoa percorreria

> O QA completo do avanço acha onde a rolagem vertical trava, onde o comportamento muda e onde a tela quebra. O
> `scripts/qa_do_avanco.mjs` faz isso na bancada, antes de mostrar a quem pede e antes de subir — **toda tela com
> onboarding passa por ele**.

## 1. Como rodar

```bash
# 1. a bancada, com a tela compilada (noutro terminal) — com portas livres: a 8780 pode estar com a bancada de outra tela
node <pacote-para-o-construtor>/bancada/servidor.mjs --pacote <pasta com dados-de-teste.json> --tela <codigo-vN>/dist --porta-host 8850 --porta-tela 8851
# 2. o QA (abre um Edge/Chrome próprio, sem janela e com perfil temporário — nunca o navegador de trabalho)
node scripts/qa_do_avanco.mjs --host http://localhost:8850/ --saida "<tela>/qa" --fotos
```

| Opção | Para quê |
|---|---|
| `--larguras` | padrão `1366x768,1366x768+menu,1920x1080,390x844`: o notebook com o menu do Ploomes fechado e aberto (`+menu`, 240 px), o monitor grande e o celular (o app abre a tela inteira) |
| `--fotos` | o print de **todo** estado, não só dos que falharam — é o que se mostra a quem pede antes de subir |
| `--rotas /funil/123,/contratos` | rotas a mais para auditar (uma aba que o percurso não abre) |
| `--host` | a porta da bancada (`--porta-host` do servidor) |

O `dados-de-teste.json` precisa de **um usuário por papel**, dos quatro campos `user_…` do registro e do
`"flowDoOnboarding"` — o flow simulado, que grava quando a tela chama o webhook
`http://localhost:<porta>/_bancada/flow/onboarding`. O do `modelo-treinamento/exemplo/bancada/` é o ponto de partida.
⚠️ Na bancada, o webhook da tela aponta a porta dela; a conferência acusa essa URL como ERRO até ela virar a do flow.

## 2. O percurso

Em cada largura, do zero (armazenamento limpo, bancada reiniciada):

1. **as boas-vindas** e o **tour inteiro**, passo por passo — esperando o kit achar o alvo;
2. **com o bloco do mapa e do simulador** (`bloco-mapa-e-simulador.md`): **o mapa** (no celular, empilhado em uma
   coluna e sem setas), e **cada funil do caminho, do quadro até o fim**, pelo botão do balão — abre o card, lê cada
   dica (o "Entendi" já preenche o checklist), move e ganha (ou conclui, no funil que não se ganha à mão); sem botão
   no balão, cai no card, no "Preencher por mim", na barra de etapas ou no Ganhar. No fim, o progresso tem de dizer
   *N de N*. Na primeira largura confere ainda as correções de 27/10/2026: **a roda vertical do mouse anda o quadro**
   para o lado; **o aviso** de obrigatório faltando (conferido antes do primeiro "Entendi", com o checklist ainda
   vazio) **continua na tela depois de
   6,6 s** e fecha no X; **o "Chega aqui por"** abre o detalhe com *Abrir este funil*; **a dica não se mexe** com a tela
   parada (o tremor);
3. sem o mapa: a tela, como ela abre;
4. na primeira largura, ainda: **o que a tela mandou ao flow e o que ficou em cada campo do Usuário** — com o mapa,
   também **a volta numa sessão nova** (as boas-vindas não abrem de novo, e a abertura soma em *Vezes que consultou*) e
   **cada outro usuário da bancada** na primeira visita.

## 3. O que ele acusa

| Tipo | Gravidade | O que é |
|---|---|---|
| `rolagem-travada` | ERRO | o conteúdo passa da altura e a página não rola (ou rola e para antes do fim) |
| `conteudo-cortado` | ERRO | um bloco com `overflow: hidden` corta o texto de baixo, sem rolagem vertical |
| `rolagem-horizontal` | ERRO | a página ganha rolagem para o lado; diz quais elementos passam da largura |
| `dialogo-fora-da-tela` | ERRO | o cartão do tour, o balão da dica, as boas-vindas, o menu de ajuda ou um modal passam da tela, sem rolagem |
| `botao-fora-da-tela` | ERRO | um botão fora da largura — ninguém clica. Dentro de um bloco que rola para o lado (o quadro, a barra de etapas) não conta |
| `alvo-do-tour-sumiu` | ERRO | o passo do tour aponta um `data-onboarding` que não está na tela |
| `imagem-quebrada` | ERRO | a imagem não abriu |
| `travou` | ERRO | o avanço não chegou aonde devia (o funil não chegou ao fim, a roda não anda o quadro, o aviso sumiu sozinho, a dica treme, o mapa não empilhou) |
| `erro-no-console` | ERRO | exceção ou `console.error` durante o estado |
| `prefixo-interno` | AVISO | o nome interno da automação (*"P6 ·"*) aparece para a pessoa |
| `cabecalho-alto` | AVISO | o cabeçalho do simulador passa de 200 px: o quadro fica pequeno no notebook |
| `botao-coberto` | AVISO | outro elemento por cima do botão |
| `texto-cortado` | AVISO | texto cortado na largura, sem reticências |
| `chamada-recusada` | AVISO | a API recusou uma chamada |

🔴 **ERRO bloqueia a subida.** Corrija na tela (ou no kit e no bloco, com autoteste, se o defeito é deles) e rode de
novo. AVISO se lê com quem pede: pode ser aceito, com o motivo no `MUDANCAS.md`.

➜ *Por que confiar:* o autoteste (`--compilar --qa`) roda o QA no exemplo do bloco e exige zero erro e o registro
certo no Usuário; numa cópia com o aviso sumindo em 3 s e sem a roda do mouse, o QA acusou as duas.

## 4. O relatório

`<saida>/qa-<data>/relatorio.md`: os erros e os avisos (largura, estado, tipo, onde, o que, o print), **o registro no
Usuário** (o que cada pessoa mandou — `abriu:gravado-pelo-flow`, `concluiu:gravado-pelo-flow` —, **o valor que ficou
em cada campo** e o que o flow simulado recebeu) e o percurso inteiro. O `qa.json` tem o mesmo, para comparar rodadas.

## 5. O que ele não vê

- **O construtor de verdade.** A bancada imita o Ploomes, mas não o congelamento da página pela camada de tela cheia
  da ponte, nem o tempo de montagem: depois de subir, abra a prévia do construtor e percorra o tour e um funil.
- **O flow de verdade.** O da bancada é simulado: o teste com um usuário de teste é na conta (`registro-pelo-flow.md`).
- **Se o texto ensina certo.** Isso é de quem pede, com os prints do `--fotos`.
