# -*- coding: utf-8 -*-
"""Confere o onboarding de uma tela contra o código dela — e diz o que ficou para trás.

POR QUE ELE EXISTE: num cliente uma tela andou treze versões com o tour igual, e uma etapa dele passou a
descrever uma regra que não vale mais; ninguém percebeu, porque nada comparava o roteiro com a tela. O roteiro
envelhece sem sintoma. Este script é o sintoma.

O que ele confere:
- o kit em src/onboarding/kit/ é igual ao kit/ da skill (desatualizado ou editado = ERRO);
- cada alvo do roteiro tem um data-onboarding na tela (sem = ERRO; havendo marca dinâmica, AVISO);
- rota da tela sem nenhum passo nem tarefa (AVISO: parte da tela que ninguém explica);
- `desde` maior que a versão do roteiro (ERRO); `parte` sem nome em `partes` (AVISO);
- a tela mudou desde a última conferência registrada e a versão do roteiro não subiu (AVISO, com os arquivos);
- no bloco do mapa da jornada e do simulador: id de funil ou etapa no jornada.ts que não existe no retrato (ERRO);
  funil fora de toda fase, funil sem roteiro e automação sem etapa sem lugar (AVISO); o registro no Usuário desligado
  (AVISO) ou apontando a bancada (ERRO);
- com --retrato: o que mudou na conta desde o retrato embutido (AVISO por mudança).

USO:
    python conferir_onboarding.py --tela <pasta da tela, a que tem src/> [--retrato <pasta de retrato novo>] [--registrar]

--registrar grava o estado de agora (.onboarding-conferido.json, na pasta da tela, acima das codigo-vN) — rode
depois de quem pede aprovar o roteiro atualizado. Sai com 1 se houver ERRO.
"""
import argparse
import hashlib
import importlib.util
import json
import re
import sys
from datetime import datetime
from pathlib import Path

AQUI = Path(__file__).resolve().parent
KIT = AQUI.parent / 'kit'
ESTADO = '.onboarding-conferido.json'


def _modulo(nome):
    spec = importlib.util.spec_from_file_location(nome, AQUI / f'{nome}.py')
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def lf(t):
    return t.replace('\r\n', '\n')


# ---------------------------------------------------------------- leitura do TypeScript, sem compilar

def bloco(texto, chave, abre='[', fecha=']'):
    """O texto entre o primeiro `chave: [` (ou `chave: Tipo = [`) e o colchete que fecha (ou chaves, com abre='{')."""
    m = re.search(r'\b' + re.escape(chave) + r'\b\s*[:=]', texto)
    if not m:
        return None
    resto = texto[m.end():]
    if resto.lstrip().startswith(abre):
        i = m.end() + (len(resto) - len(resto.lstrip()))
    else:   # declaração com tipo: `FASES: { … }[] = [` — o valor começa depois do `=`
        d = re.search(r'=\s*' + re.escape(abre), resto[:600])
        if not d:
            return None
        i = m.end() + d.end() - 1
    nivel = 0
    for j in range(i, len(texto)):
        if texto[j] == abre:
            nivel += 1
        elif texto[j] == fecha:
            nivel -= 1
            if nivel == 0:
                return texto[i + 1:j]
    return None


def objetos(lista):
    """Os objetos de topo de uma lista `{...}, {...}`."""
    saida, nivel, inicio = [], 0, None
    for i, ch in enumerate(lista or ''):
        if ch == '{':
            if nivel == 0:
                inicio = i
            nivel += 1
        elif ch == '}':
            nivel -= 1
            if nivel == 0 and inicio is not None:
                saida.append(lista[inicio:i + 1])
    return saida


def campo(obj, nome):
    m = re.search(rf"\b{nome}\s*:\s*(['\"`])(.*?)\1", obj, re.S)
    return m.group(2) if m else None


def ler_roteiro(arq):
    t = arq.read_text(encoding='utf-8')
    versao = campo(t, 'versao')
    passos = [{k: campo(o, k) for k in ('id', 'alvo', 'rota', 'desde', 'parte')} for o in objetos(bloco(t, 'tour'))]
    tarefas = [{k: campo(o, k) for k in ('id', 'alvo', 'rota', 'desde')} for o in objetos(bloco(t, 'primeirosPassos'))]
    partes = set(re.findall(r"['\"]?([\w-]+)['\"]?\s*:", bloco(t, 'partes', '{', '}') or ''))
    return versao, passos, tarefas, partes


def marcas_da_tela(src):
    """Os valores literais de data-onboarding na tela, e se há marca dinâmica (expressão sem literal)."""
    literais, dinamica = set(), False
    for arq in src.rglob('*.tsx'):
        if 'onboarding' in arq.relative_to(src).parts[:1] and 'kit' in arq.parts:
            continue
        t = arq.read_text(encoding='utf-8', errors='replace')
        for m in re.finditer(r'data-onboarding\s*=\s*(?:"([^"]*)"|\'([^\']*)\'|\{([^}]*)\})', t):
            if m.group(1) is not None or m.group(2) is not None:
                valor = m.group(1) if m.group(1) is not None else m.group(2)
                if '${' in valor:   # seletor montado num template (querySelector), não uma marca
                    continue
                literais.add(valor)
            else:
                achados = re.findall(r"['\"`]([^'\"`]+)['\"`]", m.group(3))
                literais.update(achados)
                if not achados or re.search(r'[a-zA-Z_]\w*\s*(?:\)|$|\+)', m.group(3).replace('undefined', '')):
                    dinamica = True
    return literais, dinamica


def rotas_da_tela(src):
    rotas = set()
    for arq in src.rglob('*.tsx'):
        if 'kit' in arq.parts:
            continue
        for m in re.finditer(r'<Route\s+[^>]*path=["\']([^"\']+)["\']', arq.read_text(encoding='utf-8', errors='replace')):
            if m.group(1) != '*':
                rotas.add(m.group(1))
    return rotas


def assinatura(src):
    """Hash de cada arquivo da tela que não é do onboarding nem da base — é isso que diz "a tela mudou"."""
    saida = {}
    for arq in sorted(src.rglob('*')):
        if not arq.is_file():
            continue
        rel = arq.relative_to(src).as_posix()
        if rel.startswith(('onboarding/', 'lib/', 'assets/')) or rel in ('treinamento/jornada.ts',):
            continue
        saida[rel] = hashlib.sha1(lf(arq.read_text(encoding='utf-8', errors='replace')).encode('utf-8')).hexdigest()[:12]
    return saida


def arquivo_de_estado(tela):
    """O registro mora na pasta da TELA, acima das versões (telas/<slug>/), e não dentro de codigo-vN, que muda a
    cada versão — senão cada versão nova começaria sem história."""
    tela = Path(tela)
    return (tela.parent if tela.name.lower().startswith('codigo-') else tela) / ESTADO


def versao_maior(a, b):
    try:
        return float(a) > float(b)
    except (TypeError, ValueError):
        return (a or '') > (b or '')


# ---------------------------------------------------------------- a conferência

def conferir(tela, retrato_novo=None):
    tela = Path(tela)
    src = tela / 'src'
    achados = []
    erro = lambda o: achados.append(('ERRO', o))
    aviso = lambda o: achados.append(('AVISO', o))
    info = lambda o: achados.append(('INFO', o))
    if not src.is_dir():
        erro(f'{tela} não tem src/ — passe a pasta da tela (a que tem src/App.tsx)')
        return achados, None

    kit = src / 'onboarding' / 'kit'
    if not kit.is_dir():
        erro('a tela não tem o kit em src/onboarding/kit/ — copie o kit/ da skill onboarding-de-tela, sem editar')
    else:
        for ref in sorted(p for p in KIT.iterdir() if p.is_file() and p.name != 'LEIA-ME.md'):
            copia = kit / ref.name
            if not copia.exists():
                erro(f'src/onboarding/kit/{ref.name} falta — o kit desta tela é de uma versão anterior: copie a pasta kit/ inteira de novo')
            elif lf(copia.read_text(encoding='utf-8')) != lf(ref.read_text(encoding='utf-8')):
                erro(f'src/onboarding/kit/{ref.name} difere do kit da skill — desatualizado ou editado; copie de novo, sem editar')

    arq_roteiro = src / 'onboarding' / 'roteiro.ts'
    if not arq_roteiro.exists():
        erro('a tela não tem src/onboarding/roteiro.ts')
        return achados, None
    versao, passos, tarefas, partes = ler_roteiro(arq_roteiro)
    if not versao:
        erro("o roteiro não tem `versao: '<n>'`")
    marcas, dinamica = marcas_da_tela(src)
    for p in passos + tarefas:
        if p.get('alvo') and p['alvo'] not in marcas:
            (aviso if dinamica else erro)(f"o passo '{p.get('id')}' aponta para o alvo '{p['alvo']}', e nenhum data-onboarding da tela tem esse valor"
                                         + (' (há marcas dinâmicas: confira na tela)' if dinamica else ''))
        if p.get('desde') and versao and versao_maior(p['desde'], versao):
            erro(f"o passo '{p.get('id')}' diz desde '{p['desde']}', maior que a versão do roteiro ('{versao}')")
    for p in passos:
        if p.get('parte') and partes and p['parte'] not in partes:
            aviso(f"o passo '{p.get('id')}' é da parte '{p['parte']}', que não tem nome em `partes`")
    explicadas = {p.get('rota') for p in passos + tarefas if p.get('rota')}
    treinamento = (src / 'treinamento' / 'FunilSimulador.tsx').exists()
    for r in sorted(rotas_da_tela(src) - explicadas):
        if ':' in r and any(e and e.split('/')[1:2] == r.split('/')[1:2] for e in explicadas):
            continue
        if treinamento and r.startswith('/funil/'):   # o simulador tem a dica com holofote dele
            continue
        aviso(f"a rota '{r}' não tem nenhum passo nem tarefa — é uma parte da tela que o onboarding não explica")
    sem_uso = sorted(m for m in marcas if m not in {p.get('alvo') for p in passos + tarefas})
    if sem_uso:
        info(f"marcas data-onboarding que o roteiro não usa: {', '.join(sem_uso)}")

    estado_arq = arquivo_de_estado(tela)
    agora = assinatura(src)
    if estado_arq.exists():
        antes = json.loads(estado_arq.read_text(encoding='utf-8'))
        mudou = sorted(k for k in agora.keys() | antes.get('arquivos', {}).keys() if agora.get(k) != antes['arquivos'].get(k))
        if mudou and antes.get('versao') == versao:
            aviso(f"a tela mudou desde a conferência de {antes.get('registrado_em')} e o roteiro continua na versão {versao}: "
                  f"{', '.join(mudou[:8])}{'…' if len(mudou) > 8 else ''} — revise o roteiro; passo que entrar ou mudar de sentido sobe a versão e leva `desde`")
        elif mudou:
            info(f"a tela mudou ({len(mudou)} arquivo(s)) e o roteiro subiu de {antes.get('versao')} para {versao}")
    else:
        info(f'sem conferência registrada ({ESTADO}) — rode com --registrar depois de quem pede aprovar o roteiro')

    jornada, dados = src / 'treinamento' / 'jornada.ts', src / 'treinamento' / 'dados.ts'
    if jornada.exists() and dados.exists():
        comparador = _modulo('comparar_retratos')
        retrato = comparador.carregar(dados)
        ids_funis = {f['id'] for f in retrato['funis']}
        ids_etapas = {e['id'] for f in retrato['funis'] for e in f['etapas']}
        t = jornada.read_text(encoding='utf-8')
        fases = bloco(t, 'FASES') or ''
        nas_fases = {int(x) for x in re.findall(r'\b(\d{4,})\b', fases)}
        if 'RETRATO.funis' not in fases:
            for i in sorted(nas_fases - ids_funis):
                erro(f'o funil {i}, numa fase do jornada.ts, não existe no retrato da conta')
            for f in retrato['funis']:
                if f['id'] not in nas_fases:
                    aviso(f"o funil '{f['nome']}' não está em nenhuma fase — ele não aparece no mapa")
        roteiros = bloco(t, 'ROTEIROS', '{', '}') or ''
        for i in sorted({int(x) for x in re.findall(r'\b(\d{4,})\s*:', roteiros)} - ids_funis - ids_etapas):
            erro(f'o id {i}, no ROTEIROS do jornada.ts, não é funil nem etapa do retrato — a conta mudou ou o id está errado')
        com_roteiro = {int(x) for x in re.findall(r'^\s*(\d{4,})\s*:\s*\{', roteiros, re.M)} & ids_funis
        sem = [f['nome'] for f in retrato['funis'] if f['id'] not in com_roteiro]
        if sem:
            aviso(f"funis sem roteiro (o simulador mostra só o que vem da conta): {', '.join(sem)}")
        for nome in ('ETAPA_DA_EDICAO', 'ETAPA_DA_AUTOMACAO'):
            for i in sorted({int(x) for x in re.findall(r'\b(\d{4,})\b(?!\s*:)', bloco(t, nome, '{', '}') or '')} - ids_etapas):
                erro(f'a etapa {i}, no {nome} do jornada.ts, não existe no retrato')
        # o registro no Usuário (regra 11): o webhook do flow que grava quem abriu e quem concluiu
        hook = re.search(r"WEBHOOK_DO_REGISTRO\s*:[^=]*=\s*(null|(['\"`])(.*?)\2)", t)
        if not hook:
            aviso('o jornada.ts não tem WEBHOOK_DO_REGISTRO (modelo anterior ao registro no Usuário): copie o jornada.ts do '
                  'modelo para ver como, e ligue o flow (regra 11)')
        elif hook.group(1) == 'null':
            aviso('WEBHOOK_DO_REGISTRO é null: a tela não registra no Usuário quem abriu e quem concluiu (regra 11) — crie os '
                  'campos e o flow com o OK de quem pede, ou escreva no MUDANCAS.md por que ficou sem')
        elif re.search(r'localhost|127\.0\.0\.1', hook.group(3)):
            erro(f"WEBHOOK_DO_REGISTRO aponta a bancada ({hook.group(3)}): em produção nada grava — troque pela URL do flow antes de subir")
        ligadas = {int(x) for x in re.findall(r'\b(\d{4,})\s*:', bloco(t, 'ETAPA_DA_AUTOMACAO', '{', '}') or '')}
        for f in retrato['funis']:
            for a in f.get('automacoesSemEtapa', []):
                if a['id'] not in ligadas:
                    aviso(f"a automação '{a['nome']}' ({a['id']}), do funil '{f['nome']}', dispara sem etapa e não aparece no simulador — "
                          'diga em ETAPA_DA_AUTOMACAO em que etapas ela age')
        if retrato_novo:
            for m in comparador.comparar(retrato, comparador.carregar(retrato_novo)):
                aviso(f"a conta mudou — {m['funil']}{' · ' + m['etapa'] if m['etapa'] else ''}: {m['o_que']}")
    return achados, {'versao': versao, 'arquivos': agora}


def main():
    sys.stdout.reconfigure(encoding='utf-8')
    ap = argparse.ArgumentParser()
    ap.add_argument('--tela', required=True)
    ap.add_argument('--retrato')
    ap.add_argument('--registrar', action='store_true')
    a = ap.parse_args()
    achados, estado = conferir(a.tela, a.retrato)
    for nivel, o_que in achados:
        print(f'{nivel:5} {o_que}')
    erros = sum(1 for n, _ in achados if n == 'ERRO')
    avisos = sum(1 for n, _ in achados if n == 'AVISO')
    print(f'\n{erros} erro(s), {avisos} aviso(s).')
    if a.registrar:
        if erros:
            print('Não registrei: com erro, a conferência não vale como ponto de partida.')
        elif estado:
            arquivo_de_estado(a.tela).write_text(json.dumps({**estado, 'registrado_em': datetime.now().isoformat(timespec='seconds')},
                                                          ensure_ascii=False, indent=1), encoding='utf-8')
            print(f'Registrado em {arquivo_de_estado(a.tela)}: a próxima conferência compara com este estado.')
    return 1 if erros else 0


if __name__ == '__main__':
    sys.exit(main())
