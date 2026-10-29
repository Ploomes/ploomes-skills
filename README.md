# Ploomes CRM no Claude Code

Plugins públicos de Claude Code para configurar uma conta do Ploomes CRM: a documentação técnica do produto e as skills que transformam um processo comercial em configuração da conta e em telas próprias. Servem a quem administra a própria conta, a consultorias que implantam o Ploomes e a quem mais configura o CRM.

## Pré-requisitos

- **Claude Code**, onde os plugins rodam;
- **Python 3**, para os scripts das skills, que usam só a biblioteca padrão;
- **Node 22** ou mais novo, com o `npm`, para a `pacote-para-o-construtor` montar e testar a tela e para a `onboarding-de-tela`.

## Instalação

No Claude Code:

```
/plugin marketplace add Ploomes/ploomes-skills
/plugin install ploomes-tech-docs@ploomes-skills
/plugin install ploomes-configuracao@ploomes-skills
```

O sufixo `@ploomes-skills` é obrigatório. Instale os dois: as skills de configuração consultam a documentação técnica o tempo todo, e sem ela as regras do produto somem em silêncio.

Para receber versões novas:

```
/plugin marketplace update ploomes-skills
/plugin update ploomes-configuracao@ploomes-skills
/plugin update ploomes-tech-docs@ploomes-skills
```

## O que cada plugin faz

**`ploomes-tech-docs`** responde como o Ploomes funciona:

- `business-docs`: regras de negócio, o que a plataforma permite configurar e o que ela não faz;
- `api-docs`: a API do Ploomes, com autenticação, rotas, consultas e limites;
- `frontend-docs`: como as telas do CRM se comportam;
- `ds-ploomes-crm-ui`: o design system do CRM Web, para a tela própria parecer parte do produto.

**`ploomes-configuracao`** faz o trabalho:

- as skills `configuracao-de-funis`, `configuracao-de-checklists`, `configuracao-de-automacao`, `configuracao-de-fluxo-de-aprovacao` e `configuracao-de-proposta` leem o processo comercial e entregam a configuração em arquivos para importação, cada decisão com o motivo;
- `indicacao-de-tela` aponta onde a configuração nativa não basta e vale uma tela própria;
- `pacote-para-o-construtor` constrói essa tela para o construtor de telas do Ploomes e a testa antes de você importá-la;
- `onboarding-de-tela` cria o onboarding de quem vai usar a tela;
- `ploomes-flows-builder` gera o JSON de importação de um flow do Ploomes Flows a partir do pedido em linguagem natural, já com a checagem e a simulação dos passos de código.

## Como trabalhar: a pasta local

Crie uma pasta para cada conta que você vai configurar e abra o Claude Code dentro dela. As skills leem o que estiver ali e gravam ali mesmo. O que ajuda ter na pasta:

| Arquivo | O que é |
|---|---|
| `conta.md` | o nome e o Id da conta no Ploomes |
| `processo.md` | o processo comercial descrito: etapas, quem faz o quê, o que trava |
| `escopo.md` | o que entra no projeto: o que vai ser configurado agora e o que fica para depois |
| `as-is.bpmn` | o desenho do processo atual, se você tiver |
| `notas/` | anotações e transcrições das conversas sobre o processo |

Nada disso é obrigatório: o que faltar, a skill pergunta na conversa.

## A chave da conta

Os scripts que leem ou testam a conta recebem a chave de API por um arquivo, com `--env <arquivo>`. Guarde a chave num arquivo fora da pasta da conta e **nunca a cole no chat**: o que entra na conversa fica no histórico.

## Publicar a tela é com você

A `pacote-para-o-construtor` constrói e testa a tela e a sobe como **versão nova** do construtor de telas, pela API dele, só depois de você aprovar o plano na conversa, e entrega sempre o `.zip` da versão, que você importa no construtor quando a subida pela API não cabe (sem a chave da conta, por exemplo). Em nenhum dos dois caminhos ela publica: testar e publicar a versão na conta é sempre feito por você, pela interface do Ploomes.

## Sobre este repositório

Este repositório é gerado automaticamente a partir de um repositório interno da Ploomes, e cada atualização chega por lá. Por isso, pull requests aqui não são incorporados: para relatar um problema ou sugerir uma melhoria, abra uma issue.
