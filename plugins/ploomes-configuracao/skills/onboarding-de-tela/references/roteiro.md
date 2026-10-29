# O roteiro: como se escreve um onboarding que ensina

> O kit (`kit/`) é igual em toda tela e **não se edita**. O que muda de tela para tela é só o
> `src/onboarding/roteiro.ts` e as marcas `data-onboarding` no código. Este arquivo diz como escrever os dois.

## 1. A voz

- **No vocabulário de quem usa**, nunca no de quem configura: "oportunidade" e não "deal"; "a carteira do Farmer" e não
  "o funil 6". O nome das coisas é o da tela e o do processo.
- **Curto.** Quem lê está começando a usar a tela agora: uma ideia por cartão, uma ação por passo.
- **Diga o que a pessoa ganha**, não o que o botão é: "Escolha o funil e o período para ver só o que é seu" e não
  "Este é o filtro".
- **Verbo no imperativo** para o que ela faz ("Abra", "Arraste", "Preencha") e no presente para o que o Ploomes
  faz sozinho ("O Ploomes cria a tarefa da visita").

## 2. As cinco partes, e o tamanho de cada uma

| Parte | Tamanho | O que entra |
|---|---|---|
| **Boas-vindas** | 2 a 4 cartões, uma frase cada | para que serve a tela · o que se vê primeiro · a ação principal · onde pedir ajuda |
| **Tour** | 4 a 8 passos, na ordem em que a pessoa trabalha | cada passo: o alvo (`data-onboarding`), a rota, o título, o texto e o "experimente" — uma ação que ela faz ali |
| **Primeiros passos** | 3 a 6 tarefas reais | a tarefa e quando a tela chama `marcar('<id>')`: "Abra uma etapa" → ao abrir a gaveta da etapa |
| **Dicas** | uma por número ou termo que alguém não entenda | o "?" ao lado do rótulo: "Conversão" → "Ganhos sobre o total de negócios que saíram do funil no período" |
| **Estados vazios que ensinam** | um por bloco que pode vir vazio | o que dizer e qual botão oferecer: "Nenhum negócio parado há mais de 7 dias. Bom sinal." |

⛔ Tour de 20 passos não ensina: ninguém chega ao fim. Tela grande se divide em **partes** (seção 4), e cada parte
tem o tour dela.

## 3. As marcas na tela

- `data-onboarding="<id>"` no elemento **que já existe** — nunca um elemento novo só para o tour.
- O id descreve o que o elemento é (`filtros`, `quadro`, `aba-contratos`), não onde está (`div-esquerda`).
- Elemento que só aparece com um item aberto (a gaveta, o card): o passo leva a `rota` que abre o item, e o tour
  espera o alvo aparecer. Sem como abrir, o passo vai **sem alvo** (cartão no centro) e diz onde a coisa fica.
- O `conferir_onboarding.py` acusa alvo do roteiro sem marca na tela — é o erro mais comum depois que a tela muda.

## 4. Os recursos do kit além do básico

| Recurso | Como se escreve | Quando usar |
|---|---|---|
| **Roteiro por perfil** | `perfis: ['gestor']` no cartão, no passo ou na tarefa; o provider recebe `perfil={...}` | quando papéis diferentes usam partes diferentes da tela. Sem `perfis`, o item vale para todos |
| **Tour por parte** | `parte: 'contratos'` nos passos e `partes: { contratos: 'aba Contratos' }` no roteiro | tela com abas: o "?" oferece "Tour só desta parte" na aba em que a pessoa está |
| **O que há de novo** | suba `versao` ('1' → '2'), marque o passo novo ou mudado com `desde: '2'` e escreva `notasDaVersao: { '2': '…' }` | **toda vez que um passo entra ou muda de sentido.** Quem já viu a versão anterior vê só as novidades, não a apresentação inteira |
| **O acompanhamento no Usuário** | `useRegistroDaAbertura(…)` no `App.tsx` e `registrar(…)` no `aoConcluirTour={(fim) => …}` do provider — os dois do kit — mandam o evento (`abriu`, `concluiu`) ao webhook do flow que atualiza os campos do Usuário (`registro-pelo-flow.md`) | **sempre** (SKILL.md, regra 11), com os campos criados com o OK de quem pede |
| **Ligar e desligar** | `ativo={false}` no provider | tela em validação: o onboarding fica pronto e desligado, e liga numa linha |

## 5. Versão: quando sobe e quando não

| Mudou na tela | O roteiro |
|---|---|
| um botão mudou de lugar, o alvo continua o mesmo | nada (o tour acha o alvo onde ele estiver) |
| um passo passou a descrever errado o que a tela faz | corrija o texto, **suba a versão** e marque o passo com `desde` |
| entrou uma aba, um bloco ou uma ação nova | passo novo com `desde`, versão sobe, nota da versão |
| saiu um bloco | tire o passo (e a marca); a versão sobe se o que sobrou mudou de sentido |
| só cor, espaço, texto de botão sem mudar o sentido | nada |

➜ *Por quê:* subir a versão é o que faz a pessoa que já usa a tela ver o que mudou. Versão que não sobe esconde a
mudança de quem mais precisa saber dela; versão que sobe à toa ensina a pessoa a fechar a caixa sem ler.

## 6. Exemplo

```ts
import type { Roteiro } from './kit';

export const roteiro: Roteiro = {
  tela: 'mesa-de-contratos',
  versao: '2',
  nome: 'Mesa de Contratos',
  boasVindas: [
    { icone: 'lista', titulo: 'Seus contratos num lugar só', texto: 'Aqui você acompanha cada contrato da assinatura ao pagamento.' },
    { icone: 'filtro', titulo: 'Comece pelo que é seu', texto: 'O filtro do topo já mostra só a sua carteira.' },
    { icone: 'conversa', titulo: 'Ajuda sempre à mão', texto: 'O botão Ajuda, no canto, refaz este tour quando você quiser.' },
  ],
  tour: [
    { id: 'filtros', alvo: 'filtros', rota: '/', parte: 'carteira', titulo: 'Sua carteira', texto: 'Escolha a unidade e o período.', experimente: 'Troque para os últimos 30 dias.' },
    { id: 'contratos', alvo: 'aba-contratos', rota: '/contratos', parte: 'contratos', titulo: 'Contratos', texto: 'Cada linha é um contrato, com o status da entrega.', desde: '2' },
    { id: 'meta', alvo: 'meta-da-equipe', rota: '/', titulo: 'A meta da equipe', texto: 'Só o gestor vê este bloco.', perfis: ['gestor'] },
  ],
  primeirosPassos: [
    { id: 'abrir-contrato', titulo: 'Abra um contrato', rota: '/contratos', alvo: 'aba-contratos', desde: '2' },
  ],
  dicas: { 'dias-em-aberto': { titulo: 'Dias em aberto', texto: 'Desde a assinatura até hoje.' } },
  partes: { carteira: 'a carteira', contratos: 'aba Contratos' },
  notasDaVersao: { '2': 'A aba Contratos chegou.' },
};
```
