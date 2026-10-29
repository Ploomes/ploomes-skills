# -*- coding: utf-8 -*-
"""Gera o src/treinamento/dados.ts do simulador de funil a partir do retrato da conta (retrato_da_conta.py).

POR QUE ELE EXISTE: o simulador mostra cada funil como ele está na conta, e isso muda — alguém do cliente mexe num funil, uma
automação sai. O dado vem da conta, por código; o que a pessoa lê (o roteiro) vem do jornada.ts, à mão. Os dois
não se misturam: assim a conta pode mudar e o gerador roda de novo sem apagar o roteiro.

O que ele resolve sozinho, sem convenção de nome nem remendo por conta:
- o filtro de cada checklist, lido da Url dele: E entre campos, OU entre valores, "não", caixa Sim/Não e opção de
  lista pelo nome. Filtro que não se lê (outro campo nativo, OU entre campos diferentes) vira condição sem regra:
  o simulador oferece "simular este caso" em vez de adivinhar;
- a origem da passagem que dispara no ganho, na perda ou na edição: o funil ou a etapa do filtro da automação;
- as automações do funil sem etapa (quando o card é atualizado): vão para automacoesSemEtapa, e o jornada.ts diz
  em que etapa cada uma aparece.

USO:
    python gerar_dados.py --retrato <pasta do retrato> --tela <pasta da tela, a que tem src/>
    python gerar_dados.py --autoteste

Sai: <tela>/src/treinamento/dados.ts (LF, como no construtor) e um resumo em JSON com os avisos.
"""
import argparse
import json
import re
import sys
import tempfile
import urllib.parse
from pathlib import Path

# Ações e gatilhos de automação, como a conta os numera (conferidos numa conta real).
ACAO = {1: 'Edita dados', 2: 'Muda a etapa', 3: 'Abre negócio em outro funil', 4: 'Envia e-mail', 5: 'Cria tarefa',
        7: 'Cria negócio', 8: 'Registra interação', 10: 'Perde o negócio', 11: 'Ganha o negócio', 12: 'Envia WhatsApp',
        13: 'Finaliza tarefas', 14: 'Finaliza tarefas', 15: 'Envia ao Meetime', 16: 'Cria comodato'}
GATILHO = {1: 'entra na etapa', 2: 'é ganho na etapa', 3: 'é perdido na etapa', 4: 'é reaberto na etapa', 25: 'é editado na etapa',
           8: 'é ganho', 9: 'é perdido', 10: 'é reaberto', 5: 'é criado', 6: 'é atualizado'}
QUANDO = {1: 'etapa', 25: 'etapa', 2: 'ganho', 8: 'ganho', 3: 'perda', 9: 'perda', 6: 'edicao', 5: 'edicao'}
TIPO_CAIXA, TIPO_LISTA = 10, 7


# ---------------------------------------------------------------- o filtro

def _separa_no_topo(texto, palavra):
    """Divide pelo conectivo (' and ', ' or ') só fora dos parênteses."""
    partes, nivel, atual, i = [], 0, '', 0
    alvo = f' {palavra} '
    while i < len(texto):
        ch = texto[i]
        if ch == '(':
            nivel += 1
        elif ch == ')':
            nivel -= 1
        if nivel == 0 and texto.startswith(alvo, i):
            partes.append(atual)
            atual, i = '', i + len(alvo)
            continue
        atual += ch
        i += 1
    partes.append(atual)
    return [p.strip() for p in partes if p.strip()]


def _sem_parenteses_externos(t):
    t = t.strip()
    while t.startswith('(') and t.endswith(')'):
        nivel = 0
        for i, ch in enumerate(t):
            nivel += ch == '('
            nivel -= ch == ')'
            if nivel == 0 and i < len(t) - 1:
                return t
        t = t[1:-1].strip()
    return t


RE_ANY = re.compile(r"^OtherProperties/any\(\s*(\w+)\s*:\s*\1/FieldId eq (\d+) and (.+)\)$", re.S)
RE_VALOR = re.compile(r"^(\w+)/(IntegerValue|BoolValue|StringValue|DecimalValue|BigStringValue) eq (.+)$")


def ler_filtro(url, campo_por_id, opcoes_por_id):
    """A Url do filtro -> (regras, legível). regras None = não se lê (o simulador oferece "simular este caso").
    Lista vazia = vale sempre ($filter=true)."""
    if not url:
        return None, None
    q = urllib.parse.unquote_plus(url)
    m = re.search(r"\$filter=(.*?)(?:&\$|$)", q, re.S)
    if not m:
        return None, None
    corpo = _sem_parenteses_externos(m.group(1))
    if corpo.lower() == 'true':
        return [], None
    regras = []
    for termo in _separa_no_topo(corpo, 'and'):
        termo = _sem_parenteses_externos(termo)
        negar = False
        if termo.startswith('not '):
            negar, termo = True, _sem_parenteses_externos(termo[4:])
        if len(_separa_no_topo(termo, 'or')) > 1:   # OU entre campos diferentes: o simulador não liga sozinho
            return None, None
        mm = RE_ANY.match(termo)
        if not mm:
            return None, None
        campo_id, expressao = int(mm.group(2)), _sem_parenteses_externos(mm.group(3))
        campo = campo_por_id.get(campo_id)
        if not campo:
            return None, None
        valores = []
        for alternativa in _separa_no_topo(expressao, 'or'):
            mv = RE_VALOR.match(_sem_parenteses_externos(alternativa))
            if not mv:
                return None, None
            tipo, bruto = mv.group(2), mv.group(3).strip()
            if tipo == 'BoolValue':
                valores.append('Sim' if bruto.lower() == 'true' else 'Não')
            elif tipo == 'IntegerValue' and campo.get('TypeId') == TIPO_LISTA:
                if not bruto.isdigit():
                    return None, None
                valores.append(opcoes_por_id.get(int(bruto), bruto))
            else:
                valores.append(bruto.strip("'"))
        regras.append({'chave': campo['Key'], 'valores': valores, 'negar': negar, '_nome': campo['Name']})
    legivel = ' e '.join(f"{r['_nome']} {'≠' if r['negar'] else '='} {' ou '.join(r['valores'])}" for r in regras)
    for r in regras:
        del r['_nome']
    return regras, legivel


def origem_do_filtro(url):
    """('funil', id) ou ('etapa', id) pelo PipelineId / StageId que o filtro da automação olha; None sem nenhum."""
    q = urllib.parse.unquote_plus(url or '')
    m = re.search(r"\bStageId eq (\d+)", q)
    if m:
        return ('etapa', int(m.group(1)))
    m = re.search(r"\bPipelineId eq (\d+)", q)
    return ('funil', int(m.group(1))) if m else None


# ---------------------------------------------------------------- a montagem

def montar(pasta):
    ler = lambda nome: json.loads((Path(pasta) / f'{nome}.json').read_text(encoding='utf-8'))
    conta, funis, checklists, campos, autos = ler('conta'), ler('funis'), ler('checklists'), ler('campos'), ler('automacoes')
    avisos = []
    campo_por_id = {c['Id']: c for c in campos}
    caixas = {c['Key'] for c in campos if c.get('TypeId') == TIPO_CAIXA}
    opcoes_por_id, opcoes_da_chave = {}, {}
    for c in campos:
        ops = ((c.get('OptionsTable') or {}).get('Options') or [])
        for o in ops:
            opcoes_por_id[o.get('Id')] = o.get('Name')
        if c.get('TypeId') == TIPO_LISTA and ops:
            opcoes_da_chave[c['Key']] = [o.get('Name') for o in ops if o.get('Name')]
    ativos = [p for p in funis if not p.get('Archived')]
    etapa_funil = {s['Id']: p['Id'] for p in ativos for s in p.get('Stages', [])}
    ids_funis = {p['Id'] for p in ativos}
    # Automação sem etapa cujo filtro não diz o funil: quem pede informa, em origens.json ao lado do retrato
    # ({"<Id da automação>": <Id do funil>}). É dado do cliente, e não remendo no código.
    arq_origens = Path(pasta) / 'origens.json'
    origens = {int(k): v for k, v in json.loads(arq_origens.read_text(encoding='utf-8')).items()} if arq_origens.exists() else {}

    def funil_da_automacao(a):
        if a.get('TriggerDealStageId'):
            return etapa_funil.get(a['TriggerDealStageId'])
        o = origem_do_filtro((a.get('TriggerFilter') or {}).get('Url'))
        if o and o[0] == 'etapa':
            return etapa_funil.get(o[1])
        if o and o[1] in ids_funis:
            return o[1]
        return origens.get(a['Id']) if origens.get(a['Id']) in ids_funis else None

    def tarefas(a):
        titulos = []
        for x in a.get('Actions', []):
            if x.get('ActionId') == 5 and x.get('RequestBody'):
                try:
                    titulos.append(json.loads(x['RequestBody']).get('Title') or '')
                except (ValueError, AttributeError):
                    pass
        return [t for t in titulos if t]

    def automacao(a):
        return {'id': a['Id'], 'nome': (a.get('Name') or '').strip(), 'quando': GATILHO.get(a.get('TriggerId'), 'dispara'),
                'acoes': sorted({ACAO.get(x.get('ActionId'), 'Outra ação') for x in a.get('Actions', [])}), 'tarefas': tarefas(a),
                'preenche': {x['FieldKey']: x['ObjectValueName'] for x in a.get('Actions', [])
                             if x.get('ActionId') == 1 and x.get('FieldKey') and x.get('ObjectValueName')}}

    ligadas = [a for a in autos if a.get('Enabled') and a.get('EntityId') == 2]
    sem_regra = 0
    saida_funis = []
    for p in sorted(ativos, key=lambda p: (numero(p['Name']) or 999, p.get('Ordination') or 0, p['Id'])):
        etapas = []
        for s in sorted(p.get('Stages', []), key=lambda s: s.get('Ordination') or 0):
            cks = []
            for c in sorted((c for c in checklists if c.get('DealStageId') == s['Id']), key=lambda c: c['Id']):
                regras, legivel = (None, None)
                if c.get('DealFilterId'):
                    regras, legivel = ler_filtro((c.get('DealFilter') or {}).get('Url'), campo_por_id, opcoes_por_id)
                    if regras is None:
                        sem_regra += 1
                        nome = (c.get('DealFilter') or {}).get('Name') or ''
                        mm = re.search(r'\((.+)\)\s*$', nome)
                        legivel = (mm.group(1) if mm else nome).strip() or 'só para alguns cards'
                        avisos.append(f"checklist '{c['Name']}' ({p['Name']} · {s['Name']}): o filtro não se lê pela Url — "
                                      "o simulador oferece 'simular este caso'")
                cks.append({'nome': c['Name'], 'condicao': legivel or None, 'regras': regras or [],
                            'campos': [{'nome': f['Name'], 'chave': f['FieldKey'], 'obrigatorio': bool(f.get('Required')),
                                        **({'caixa': True} if f['FieldKey'] in caixas else {}),
                                        **({'opcoes': opcoes_da_chave[f['FieldKey']]} if f['FieldKey'] in opcoes_da_chave else {})}
                                       for f in sorted(c.get('Fields', []), key=lambda f: f.get('Ordination') or 0)]})
            aus = [automacao(a) for a in ligadas if a.get('TriggerDealStageId') == s['Id']]
            etapas.append({'id': s['Id'], 'nome': s['Name'], 'checklists': cks, 'automacoes': aus})
        sem_etapa = [automacao(a) for a in ligadas if not a.get('TriggerDealStageId') and a.get('TriggerId') in (5, 6)
                     and funil_da_automacao(a) == p['Id'] and not any(x.get('ActionId') in (3, 7) for x in a.get('Actions', []))]
        fim = [{'quando': 'ganho' if a.get('TriggerId') in (2, 8) else 'perda', 'nome': (a.get('Name') or '').strip()}
               for a in ligadas if a.get('TriggerId') in (2, 3, 8, 9) and funil_da_automacao(a) == p['Id']
               and not any(x.get('ActionId') in (3, 7) for x in a.get('Actions', []))]
        saida_funis.append({'id': p['Id'], 'nome': p['Name'], 'titulo': re.sub(r'^\d+\.\s*', '', p['Name']), 'numero': numero(p['Name']),
                            'unidade': p.get('SingularUnitName') or 'Negócio', 'unidadePlural': p.get('PluralUnitName') or 'Negócios',
                            'cor': p.get('Color') or '#7E33E6', 'ganhaNaUltima': bool(p.get('WinDealOnLastStage')),
                            'podeGanhar': p.get('MayWinDeals', True) is not False, 'podePerder': p.get('MayLoseDeals', True) is not False,
                            'etapas': etapas, 'automacoesSemEtapa': sem_etapa, 'aoFinal': fim})
    sem_funil = [a for a in ligadas if not a.get('TriggerDealStageId') and funil_da_automacao(a) is None
                 and a.get('TriggerId') in (2, 3, 5, 6, 8, 9)]
    for a in sem_funil:
        avisos.append(f"automação '{a.get('Name')}' ({a['Id']}) dispara sem etapa e o filtro dela não diz o funil — fora do simulador; "
                      "pergunte a quem pede de qual funil ela é e grave em origens.json, ao lado do retrato")

    transicoes = []
    for r in ligadas:
        for x in r.get('Actions', []):
            if x.get('ActionId') not in (3, 7):
                continue
            destino = x.get('DealStageId')
            if x.get('ActionId') == 7 and x.get('RequestBody'):
                try:
                    rb = json.loads(x['RequestBody'])
                    destino = rb.get('StageId') or rb.get('DealStageId') or destino
                except (ValueError, AttributeError):
                    pass
            de_etapa = r.get('TriggerDealStageId')
            de, para = funil_da_automacao(r), etapa_funil.get(destino)
            if not de or not para:
                avisos.append(f"passagem '{r.get('Name')}' ({r['Id']}) sem origem ou destino resolvido — fora do mapa")
                continue
            transicoes.append({'id': r['Id'], 'de': de, 'deEtapa': de_etapa, 'quando': QUANDO.get(r.get('TriggerId'), 'etapa'),
                               'para': para, 'paraEtapa': destino, 'regra': (r.get('Name') or '').strip()})
    retrato = {'retratoEm': conta.get('retratoEm') or '', 'conta': f"{conta.get('Id')} · {conta.get('Name')}",
               'funis': saida_funis, 'transicoes': transicoes}
    resumo = {'funis': len(saida_funis), 'checklists': sum(len(e['checklists']) for f in saida_funis for e in f['etapas']),
              'com_condicao': sum(1 for f in saida_funis for e in f['etapas'] for c in e['checklists'] if c['condicao']),
              'filtros_sem_regra': sem_regra, 'passagens': len(transicoes), 'avisos': avisos}
    return retrato, resumo


def numero(nome):
    m = re.match(r'(\d+)\.', nome or '')
    return int(m.group(1)) if m else None


def gravar(retrato, tela):
    destino = Path(tela) / 'src' / 'treinamento' / 'dados.ts'
    destino.parent.mkdir(parents=True, exist_ok=True)
    with open(destino, 'w', encoding='utf-8', newline='\n') as out:   # LF, como no construtor
        out.write(f"// GERADO pelo gerar_dados.py (skill onboarding-de-tela) a partir do retrato da conta {retrato['conta']} "
                  f"de {retrato['retratoEm']}. Não edite à mão: rode o retrato e o gerador de novo.\n")
        out.write("import type { Retrato } from './tipos';\n\n")
        out.write('export const RETRATO: Retrato = ' + json.dumps(retrato, ensure_ascii=False, indent=1) + ';\n')
    return destino


# ---------------------------------------------------------------- autoteste

def autoteste():
    ok = True

    def caso(nome, cond):
        nonlocal ok
        print(('✓ ' if cond else '✗ ') + nome)
        ok = ok and cond

    campos = {10: {'Id': 10, 'Key': 'deal_A', 'Name': 'Documentação coletada?', 'TypeId': TIPO_LISTA},
              11: {'Id': 11, 'Key': 'deal_B', 'Name': 'Cliente é MEI?', 'TypeId': TIPO_CAIXA},
              12: {'Id': 12, 'Key': 'deal_C', 'Name': 'Farol', 'TypeId': TIPO_LISTA}}
    opcoes = {500: 'Sim', 501: 'Não', 600: 'Amarelo', 601: 'Vermelho'}
    composto = ('$filter=((OtherProperties/any(o:+o/FieldId+eq+10+and+(o/IntegerValue+eq+500)))+and+not+'
                '(OtherProperties/any(o:+o/FieldId+eq+11+and+o/BoolValue+eq+true)))')
    r, leg = ler_filtro(composto, campos, opcoes)
    caso('filtro composto: E, opção pelo nome e "não" na caixa',
         r == [{'chave': 'deal_A', 'valores': ['Sim'], 'negar': False}, {'chave': 'deal_B', 'valores': ['Sim'], 'negar': True}]
         and leg == 'Documentação coletada? = Sim e Cliente é MEI? ≠ Sim')
    r, leg = ler_filtro('$filter=OtherProperties/any(o:+o/FieldId+eq+12+and+(o/IntegerValue+eq+600+or+o/IntegerValue+eq+601))', campos, opcoes)
    caso('OU entre opções do mesmo campo', r == [{'chave': 'deal_C', 'valores': ['Amarelo', 'Vermelho'], 'negar': False}] and leg == 'Farol = Amarelo ou Vermelho')
    caso('$filter=true vale sempre', ler_filtro('$filter=true', campos, opcoes) == ([], None))
    caso('filtro com campo nativo não se lê', ler_filtro('$filter=Amount+gt+1000', campos, opcoes)[0] is None)
    caso('OU entre campos diferentes não se lê',
         ler_filtro('$filter=OtherProperties/any(o:+o/FieldId+eq+10+and+o/IntegerValue+eq+500)+or+OtherProperties/any(o:+o/FieldId+eq+12+and+o/IntegerValue+eq+600)', campos, opcoes)[0] is None)
    caso('origem da passagem pelo filtro', origem_do_filtro('$filter=PipelineId+eq+77') == ('funil', 77) and origem_do_filtro('$filter=StageId+eq+5') == ('etapa', 5))

    with tempfile.TemporaryDirectory() as tmp:
        pasta = Path(tmp) / 'retrato'
        pasta.mkdir()
        escreve = lambda n, d: (pasta / f'{n}.json').write_text(json.dumps(d, ensure_ascii=False), encoding='utf-8')
        escreve('conta', {'Id': 1, 'Name': 'Teste', 'retratoEm': '26/10/2026'})
        escreve('funis', [
            {'Id': 100, 'Name': '1. Vendas', 'SingularUnitName': 'Oportunidade', 'PluralUnitName': 'Oportunidades', 'Color': '#123456',
             'WinDealOnLastStage': True, 'MayWinDeals': True, 'MayLoseDeals': True,
             'Stages': [{'Id': 1001, 'Name': 'Contato', 'Ordination': 0}, {'Id': 1002, 'Name': 'Proposta', 'Ordination': 1}]},
            {'Id': 200, 'Name': 'Implantação', 'Stages': [{'Id': 2001, 'Name': 'Início', 'Ordination': 0}]},
            {'Id': 300, 'Name': 'Velho', 'Archived': True, 'Stages': []}])
        escreve('campos', [{**c, **({'OptionsTable': {'Options': [{'Id': 500, 'Name': 'Sim'}, {'Id': 501, 'Name': 'Não'}]}} if c['Id'] == 10 else {})}
                           for c in campos.values()])
        escreve('checklists', [
            {'Id': 1, 'Name': 'Documentos', 'DealStageId': 1002, 'DealFilterId': 9, 'DealFilter': {'Name': 'filtro', 'Url': composto},
             'Fields': [{'Name': 'Contrato social', 'Required': True, 'Ordination': 0, 'FieldKey': 'deal_X'}]},
            {'Id': 2, 'Name': 'Básico', 'DealStageId': 1001, 'DealFilterId': None,
             'Fields': [{'Name': 'Documentação coletada?', 'Required': True, 'Ordination': 0, 'FieldKey': 'deal_A'},
                        {'Name': 'Cliente é MEI?', 'Required': False, 'Ordination': 1, 'FieldKey': 'deal_B'}]},
            {'Id': 3, 'Name': 'Estranho', 'DealStageId': 1001, 'DealFilterId': 8, 'DealFilter': {'Name': 'Grandes (Valor > 1000)', 'Url': '$filter=Amount+gt+1000'}, 'Fields': []}])
        escreve('automacoes', [
            {'Id': 50, 'Name': 'Avisar', 'EntityId': 2, 'TriggerId': 1, 'TriggerDealStageId': 1002, 'Enabled': True,
             'Actions': [{'ActionId': 5, 'RequestBody': json.dumps({'Title': 'Ligar para o cliente'})}]},
            {'Id': 51, 'Name': 'Abre a implantação', 'EntityId': 2, 'TriggerId': 8, 'TriggerDealStageId': None, 'Enabled': True,
             'TriggerFilter': {'Url': '$filter=PipelineId+eq+100'}, 'Actions': [{'ActionId': 7, 'DealStageId': 2001}]},
            {'Id': 52, 'Name': 'Farol', 'EntityId': 2, 'TriggerId': 6, 'TriggerDealStageId': None, 'Enabled': True,
             'TriggerFilter': {'Url': '$filter=PipelineId+eq+100'}, 'Actions': [{'ActionId': 1, 'FieldKey': 'deal_C', 'ObjectValueName': 'Amarelo'}]},
            {'Id': 53, 'Name': 'Desligada', 'EntityId': 2, 'TriggerId': 1, 'TriggerDealStageId': 1001, 'Enabled': False, 'Actions': []}])
        retrato, resumo = montar(pasta)
        f1 = retrato['funis'][0]
        caso('funil arquivado fica fora; o numerado vem primeiro', [f['id'] for f in retrato['funis']] == [100, 200] and f1['numero'] == 1 and f1['titulo'] == 'Vendas')
        doc = f1['etapas'][1]['checklists'][0]
        caso('checklist com filtro composto ganha as regras', doc['regras'][1]['negar'] is True and doc['condicao'].startswith('Documentação'))
        estranho = f1['etapas'][0]['checklists'][1]
        caso('filtro que não se lê: condição pelo nome, sem regra, e aviso', estranho['regras'] == [] and estranho['condicao'] == 'Valor > 1000'
             and resumo['filtros_sem_regra'] == 1)
        basico = f1['etapas'][0]['checklists'][0]
        caso('caixa e opções de lista marcadas nos campos', basico['campos'][1].get('caixa') is True and basico['campos'][0].get('opcoes') == ['Sim', 'Não'])
        caso('tarefa da automação de entrada', f1['etapas'][1]['automacoes'][0]['tarefas'] == ['Ligar para o cliente'])
        caso('automação desligada fica fora', all(a['id'] != 53 for e in f1['etapas'] for a in e['automacoes']))
        caso('passagem no ganho com a origem pelo filtro', retrato['transicoes'] == [{'id': 51, 'de': 100, 'deEtapa': None, 'quando': 'ganho', 'para': 200, 'paraEtapa': 2001, 'regra': 'Abre a implantação'}])
        caso('automação sem etapa vai para automacoesSemEtapa', [a['id'] for a in f1['automacoesSemEtapa']] == [52])
        destino = gravar(retrato, Path(tmp) / 'tela')
        texto = destino.read_bytes()
        caso('dados.ts em LF, com o cabeçalho de gerado', b'\r\n' not in texto and texto.startswith('// GERADO'.encode('utf-8')))
    return 0 if ok else 1


def main():
    sys.stdout.reconfigure(encoding='utf-8')
    if '--autoteste' in sys.argv:
        return autoteste()
    ap = argparse.ArgumentParser()
    ap.add_argument('--retrato', required=True)
    ap.add_argument('--tela', required=True)
    a = ap.parse_args()
    retrato, resumo = montar(a.retrato)
    resumo['gravado'] = str(gravar(retrato, a.tela))
    print(json.dumps(resumo, ensure_ascii=False, indent=1))
    return 0


if __name__ == '__main__':
    sys.exit(main())
