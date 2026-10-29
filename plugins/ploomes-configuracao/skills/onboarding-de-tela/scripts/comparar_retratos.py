# -*- coding: utf-8 -*-
"""O que mudou na conta entre dois retratos — e, por isso, que roteiro do simulador rever.

POR QUE ELE EXISTE: num cliente, o que pediu atualização do treinamento foi sempre a conta mudar — alguém de lá mexia
nos funis durante a montagem, uma automação sumiu e a mensagem de boas-vindas foi desligada. A tela embute o
retrato; sem comparar, ela segue ensinando o funil de antes.

Cada lado pode ser um dados.ts gerado (o que está na tela) ou uma pasta de retrato (o que a conta tem hoje).

USO:
    python comparar_retratos.py --antes <dados.ts ou pasta> --depois <dados.ts ou pasta>
"""
import argparse
import importlib.util
import json
import sys
from pathlib import Path

AQUI = Path(__file__).resolve().parent


def _gerador():
    spec = importlib.util.spec_from_file_location('gerar_dados', AQUI / 'gerar_dados.py')
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def carregar(caminho):
    """dados.ts -> o RETRATO embutido; pasta -> o retrato montado pelo gerador, sem gravar nada."""
    p = Path(caminho)
    if p.is_dir():
        return _gerador().montar(p)[0]
    texto = p.read_text(encoding='utf-8')
    inicio = texto.index('=', texto.index('RETRATO')) + 1
    return json.loads(texto[inicio:].strip().rstrip(';'))


def comparar(antes, depois):
    """Lista de mudanças: {funil, etapa, o_que}. Funil e etapa pelo nome de agora (ou o de antes, se saiu)."""
    mud = []
    fa = {f['id']: f for f in antes.get('funis', [])}
    fd = {f['id']: f for f in depois.get('funis', [])}
    for i in fa.keys() - fd.keys():
        mud.append({'funil': fa[i]['nome'], 'etapa': None, 'o_que': 'o funil saiu da conta (ou foi arquivado)'})
    for i in fd.keys() - fa.keys():
        mud.append({'funil': fd[i]['nome'], 'etapa': None, 'o_que': 'funil novo na conta — ele ainda não tem fase nem roteiro'})
    for i in fa.keys() & fd.keys():
        a, d = fa[i], fd[i]
        if a['nome'] != d['nome']:
            mud.append({'funil': d['nome'], 'etapa': None, 'o_que': f"renomeado (era '{a['nome']}')"})
        ea = {e['id']: e for e in a['etapas']}
        ed = {e['id']: e for e in d['etapas']}
        for j in ea.keys() - ed.keys():
            mud.append({'funil': d['nome'], 'etapa': ea[j]['nome'], 'o_que': 'a etapa saiu'})
        for j in ed.keys() - ea.keys():
            mud.append({'funil': d['nome'], 'etapa': ed[j]['nome'], 'o_que': 'etapa nova — sem roteiro'})
        if [e['id'] for e in a['etapas'] if e['id'] in ed] != [e['id'] for e in d['etapas'] if e['id'] in ea]:
            mud.append({'funil': d['nome'], 'etapa': None, 'o_que': 'a ordem das etapas mudou'})
        for j in ea.keys() & ed.keys():
            x, y = ea[j], ed[j]
            if x['nome'] != y['nome']:
                mud.append({'funil': d['nome'], 'etapa': y['nome'], 'o_que': f"etapa renomeada (era '{x['nome']}')"})
            ca = {c['nome']: c for c in x['checklists']}
            cd = {c['nome']: c for c in y['checklists']}
            for n in ca.keys() - cd.keys():
                mud.append({'funil': d['nome'], 'etapa': y['nome'], 'o_que': f"checklist '{n}' saiu"})
            for n in cd.keys() - ca.keys():
                mud.append({'funil': d['nome'], 'etapa': y['nome'], 'o_que': f"checklist novo: '{n}'"})
            for n in ca.keys() & cd.keys():
                c1, c2 = ca[n], cd[n]
                if (c1.get('condicao') or '') != (c2.get('condicao') or ''):
                    mud.append({'funil': d['nome'], 'etapa': y['nome'], 'o_que': f"checklist '{n}': a condição mudou ('{c1.get('condicao')}' → '{c2.get('condicao')}')"})
                k1 = {f['chave']: f for f in c1['campos']}
                k2 = {f['chave']: f for f in c2['campos']}
                for k in k1.keys() - k2.keys():
                    mud.append({'funil': d['nome'], 'etapa': y['nome'], 'o_que': f"checklist '{n}': o item '{k1[k]['nome']}' saiu"})
                for k in k2.keys() - k1.keys():
                    mud.append({'funil': d['nome'], 'etapa': y['nome'], 'o_que': f"checklist '{n}': item novo '{k2[k]['nome']}'"})
                for k in k1.keys() & k2.keys():
                    if k1[k]['obrigatorio'] != k2[k]['obrigatorio']:
                        estado = 'virou obrigatório' if k2[k]['obrigatorio'] else 'deixou de ser obrigatório'
                        mud.append({'funil': d['nome'], 'etapa': y['nome'], 'o_que': f"checklist '{n}': '{k2[k]['nome']}' {estado}"})
            aa = {u['id']: u for u in x['automacoes']}
            ad = {u['id']: u for u in y['automacoes']}
            for u in aa.keys() - ad.keys():
                mud.append({'funil': d['nome'], 'etapa': y['nome'], 'o_que': f"a automação '{aa[u]['nome']}' saiu ou foi desligada"})
            for u in ad.keys() - aa.keys():
                mud.append({'funil': d['nome'], 'etapa': y['nome'], 'o_que': f"automação nova: '{ad[u]['nome']}'"})
        sa = {u['id'] for u in a.get('automacoesSemEtapa', [])}
        sd = {u['id']: u for u in d.get('automacoesSemEtapa', [])}
        for u in sd.keys() - sa:
            mud.append({'funil': d['nome'], 'etapa': None, 'o_que': f"automação sem etapa nova: '{sd[u]['nome']}' — diga em que etapa ela aparece (ETAPA_DA_AUTOMACAO)"})
    ta = {t['id']: t for t in antes.get('transicoes', [])}
    td = {t['id']: t for t in depois.get('transicoes', [])}
    nome = {f['id']: f['nome'] for f in list(fa.values()) + list(fd.values())}
    for i in ta.keys() - td.keys():
        mud.append({'funil': nome.get(ta[i]['de'], '?'), 'etapa': None, 'o_que': f"a passagem '{ta[i]['regra']}' saiu — a seta do mapa some"})
    for i in td.keys() - ta.keys():
        mud.append({'funil': nome.get(td[i]['de'], '?'), 'etapa': None, 'o_que': f"passagem nova: '{td[i]['regra']}' → {nome.get(td[i]['para'], '?')}"})
    return mud


def main():
    sys.stdout.reconfigure(encoding='utf-8')
    ap = argparse.ArgumentParser()
    ap.add_argument('--antes', required=True)
    ap.add_argument('--depois', required=True)
    a = ap.parse_args()
    antes, depois = carregar(a.antes), carregar(a.depois)
    mud = comparar(antes, depois)
    print(json.dumps({'retrato_antes': antes.get('retratoEm'), 'retrato_depois': depois.get('retratoEm'),
                      'mudancas': len(mud), 'lista': mud,
                      'nota': 'cada linha com funil e etapa diz que roteiro rever; sem mudança, o treinamento continua valendo'},
                     ensure_ascii=False, indent=1))
    return 0


if __name__ == '__main__':
    sys.exit(main())
