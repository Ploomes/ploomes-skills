# Protocolo de indicação — o núcleo comum das cinco skills

As cinco skills de indicação são a mesma máquina com cinco peças. Este arquivo é
o que elas têm em comum; cada uma carrega só o que é dela — o vocabulário do seu
domínio, as decisões que toma e o seu portão.

**Leia este arquivo antes de rodar qualquer uma delas** — e, antes dele, o
[modo de trabalho](modo-de-trabalho.md), que diz onde cada insumo está e onde a saída é gravada.

```
  ENTRADA                        ACERVO                     SAÍDA
  contexto do cliente      →   perfil que pesa        →   CSV para ingestão
  documentos                    busca                      racional com procedência
  as-is (BPMN)                  leitura com higiene        lacunas nomeadas
  transcrições                                             portão passado
  escopo da proposta
```

Quem consome a saída é **quem configura a conta**. Essa pessoa não estava na
reunião em que o dado foi levantado, vai configurar a conta a partir do que a peça entregar, e vai
apresentar ao cliente o que ela justificar. Isso define o padrão: **nada sai sem
procedência, e nada sai que ele não consiga configurar.**

---

## 1. O dossiê de entrada

Sempre os mesmos sete insumos. Cada skill usa um recorte, mas o dossiê é um só.

| Insumo | O que é | Sem ele |
|---|---|---|
| **Contexto do cliente** | segmento, CNAE, MOC (modelo de operação comercial da empresa), tipo de venda, porte, ERP | não há contas comparáveis: a busca sai sem peso de operação e sem o `N de M` |
| **Documentos** | proposta atual, tabela de preço, identidade visual, contrato | a peça inventa forma |
| **As-is** | o BPMN do processo atual | a peça inventa processo |
| **Transcrições** | o que foi dito na imersão, e por quem | a peça perde o porquê |
| **Escopo** | a proposta comercial ao cliente — o que foi vendido | a peça indica o que não foi contratado |
| **Saídas das peças anteriores** | os CSVs já produzidos na cadeia | a peça recria o que já foi decidido |
| **Dados do ERP** | volumes, ticket, carteira, quando houver | a peça dimensiona no escuro |

### As três regras de entrada

**O escopo manda — e muitas vezes já responde.** A proposta comercial não é só
fronteira: ela costuma **declarar** parte do desenho. "O cliente terá três funis:
vendas, qualificação e reativação" não é contexto, é a resposta da peça de funis,
escrita e assinada.

Leia o escopo em duas passadas:

1. **o que ele já decide** — número de funis, módulos contratados, integrações,
   número de usuários, o que está em fase 1 e o que ficou para depois. Isso a
   peça **não redecide**; transcreve e detalha.
2. **o que ele limita** — o que está fora não entra, por mais óbvio que pareça e
   por mais que o acervo mostre que todo mundo faz. Vira observação para uma
   fase 2, nunca linha no CSV.

Divergir do escopo é possível, e às vezes necessário — mas sempre **declarado**:
diga o que o escopo disse, o que você indica em vez disso, e por quê. Nunca em
silêncio.

**Falta de insumo é pergunta, não preenchimento.** Se ninguém disse qual é o
limite de desconto, a resposta é perguntar — não escolher um número plausível.

**Insumo obrigatório ausente para a peça.** Cada skill declara o seu. Sem ele,
pare e diga o que falta. Entregar meia indicação custa mais caro que não entregar.

---

## 2. Consulta ao acervo

O acervo é uma base de referência que não acompanha este plugin: sem ela, a consulta devolve "sem precedente" e a indicação segue pelas outras fontes. Três fases,
**sempre nesta ordem** — e elas são executáveis, não só descritas:

```bash
python "${CLAUDE_PLUGIN_ROOT}/skills/_nucleo/consultar_acervo.py" --tipo automacao --segmento industria --moc "bens intermediarios"        --busca "cobrança de proposta"
```

🔴 **Sem o acervo, a consulta não para a peça.** O acervo nem sempre está instalado junto com as
skills. Sem ele, a ferramenta responde `acervo não distribuído` e sai sem erro; a peça segue, sem
precedente, e o campo **Precedente** de cada linha do racional sai
`sem precedente (acervo não disponível)`. ⛔ Não invente precedente para preencher o campo.

Com o acervo, a ferramenta faz as três fases e devolve o que o racional exige: os documentos, a
conta de origem de cada um — marcada **comparável** ou **outra operação** —, a contagem
`N de M contas comparáveis` e a linha **Ordem**, que diz como a lista foi ordenada. Ela
também **avisa quando a amostra é pequena demais** para virar frequência.

### Fase 1 — o perfil do cliente, antes de qualquer busca

Passe os metadados do cliente: **segmento, MOC principal (o modelo de operação comercial da empresa), tipo de venda, porte, e ERP
quando relevante**. Eles fazem duas coisas: definem as **contas comparáveis** — o `M` do
"N de M" que o racional cita — e **pesam na ordem**, puxando para cima o que vem de
operação parecida. ⚠️ **Não descartam o resto:** com poucas contas no acervo, o filtro duro
zerava a consulta, e precedente bom de outra operação entra marcado *outra operação* —
cabe a você dizer, no racional, se ele serve. Para o recorte que descarta, `--estrito`.

Isso não é otimização, é o que separa precedente de coincidência. Automação de
cobrança de proposta numa distribuidora de material médico não ensina nada a uma
indústria de bens intermediários — por mais parecido que o texto seja. **O que se
compara é a operação, não a palavra** — e é por isso que a marca de cada resultado importa.

### Fase 2 — a busca

Só agora procure, filtrando pelo tipo de documento da sua peça (`funil`, `checklist`,
`automacao`, `regra`, `modelo_documento`, `estrutura_cpq`). **Escreva a `--busca` como a
necessidade, em palavras de consultor** — *cobrar retorno do cliente depois que a proposta
foi enviada*, não o nome do campo nem da etapa do cliente.

A ferramenta busca por palavra (BM25, com radical em português e sinônimos do domínio) e
ordena os resultados pela nota.

### Fase 3 — leitura, com quatro regras de higiene

**Configuração desligada não é precedente.** Automação com `Enabled: false`,
funil arquivado, regra sem uso — é tentativa que não funcionou. `DisabledDueToError`
é mais forte ainda: a plataforma desligou sozinha.

Isso é **default da ferramenta**, não lembrete: `consultar_acervo.py` descarta
config desligada e informa quantas descartou. Só volta com `--incluir-mortos`, que
serve para estudar o que falhou — nunca para indicar.

**Conte contas, não ocorrências.** Uma conta com 40 automações parecidas é uma
conta, não 40 evidências.

**Declare o tamanho da amostra, sempre.** "4 de 7 contas comparáveis" é
evidência. "É comum" não é nada. E frequência tirada de **uma** conta não é
frequência — é anedota, e deve ser apresentada como tal.

**Vocabulário é por conta.** A lista de ações de automação, os módulos
disponíveis, as integrações contratadas — tudo isso varia. Ausência numa conta
não é ausência na plataforma.

---

## 3. O contrato de saída

Toda peça entrega **três coisas**. Faltar uma é entrega incompleta.

### 3.1 O CSV — vai para ingestão

Cabeçalho exato, todas as células entre aspas duplas, `"` interno escapado como
`""`. Cada skill tem o seu contrato de colunas.

### 3.2 O racional — vai para quem configura

Uma entrada por linha do CSV, com cinco campos:

```
<identificador> — <o que é>
  Origem: de onde saiu no dossiê (etapa, transcrição, documento, com a referência)
  Precedente: <N> de <M> contas comparáveis fazem isso  [ou: sem precedente;
              ou, sem o acervo: sem precedente (acervo não disponível)]
  Escopo: coberto pelo item <X> da proposta
  Custo: o que o cliente perde ao aceitar isso
  Atenção: efeito colateral, dependência, ou risco conhecido
```

**Sem procedência, é palpite com aparência de método.** Quem configura não estava na
reunião: se a linha não diz de onde veio, ele não consegue defendê-la nem
corrigi-la.

O campo **Custo** é o que separa indicação de lista de desejos. Toda regra ligada
tira alguma coisa de alguém — autonomia, tempo de ciclo, velocidade. Dizer qual
é o custo é o que permite ao cliente decidir em vez de só concordar.

### 3.3 As lacunas — vão para o escopo

Quando o dossiê pede algo que a plataforma não faz, **declare** em vez de
aproximar. Uma linha inventada custa uma reunião de implantação; uma lacuna
declarada vira escopo, e às vezes vira venda.

```
LACUNA — <o que se pediu>
  Por que não configura: <o limite concreto da plataforma>
  Caminhos: <alternativa 1>; <alternativa 2>
  A confirmar: <com quem, e o quê>
```

Aproximar é o pior desfecho possível: entrega algo que parece atender, passa pelo
diagnóstico, e falha na implantação — quando já não dá para renegociar.

---

## 4. Disciplina do portão

Cada skill tem um validador determinístico. Ele existe para tirar do prompt as
regras que um script confere melhor: formato, vocabulário fechado, coerência
entre campos, referência a coisa que existe.

- **Bloqueio não entrega.** Corrija e rode de novo.
- **Aviso entrega, com a ressalva declarada** no racional.
- **Nunca "corrija" afrouxando a regra.** Se o portão está errado, conserte o
  portão e diga que consertou — não contorne.

---

## 5. A ordem das peças

A ordem não é preferência: é dependência de configuração, e vem da documentação
do Ploomes.

```
Campos → Abas → Filtros → Formulários externos
       → PROPOSTA (modelos de PVD)
       → FUNIS
       → CHECKLISTS
       → AUTOMAÇÕES de funil e gerais
       → FLUXOS DE APROVAÇÃO
       → Metas
```

Três dependências que costumam ser invertidas:

1. **Proposta antes de funil** — o funil referencia o modelo padrão e a lista de
   modelos permitidos.
2. **Funil antes de checklist e automação** — as duas citam **etapa pelo nome**.
   Nome de etapa é contrato: renomear depois não dá erro, quebra em silêncio.
3. **Aprovação por último** — age sobre o documento que o funil permite gerar.

O `etapas.csv` da skill de funis é o arquivo que amarra a cadeia: os validadores
de checklist e de automação conferem contra ele.

🔴 **No fim das peças de configuração, confira a costura entre elas** — o que nenhum portão
individual enxerga (etapa citada que o desenho de funis não tem, modelo que a proposta não criou):

```bash
python -I "${CLAUDE_PLUGIN_ROOT}/skills/_nucleo/validar_coerencia.py" <pasta de entrega>/arquivos-de-configuracao
```

Ele roda com o que existir na pasta, então serve também entre dois passos. Bloqueio não entrega.

---

## 6. O que nenhuma das cinco faz

- **Não decide escopo.** Isso foi vendido antes; a peça traduz, não amplia.
- **Não estima esforço nem preço.** Ela nomeia o que exige plano acima, add-on ou
  integração; quem cota é outra peça.
- **Não inventa dado que o cliente não deu.**
- **Não invade a peça vizinha.** Funil não escreve checklist; checklist não
  escreve automação; automação não escreve aprovação.
- **Não entrega sem passar no portão.**
