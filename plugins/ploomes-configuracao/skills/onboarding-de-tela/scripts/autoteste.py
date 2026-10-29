# -*- coding: utf-8 -*-
"""Autoteste da skill onboarding-de-tela. Rode depois de mexer em qualquer script, no kit ou no modelo.

    python autoteste.py              os scripts, o hook, o retrato contra uma API falsa local e a conferência, em
                                     pasta temporária (segundos)
    python autoteste.py --compilar   e também monta o bloco do mapa da jornada e do simulador, com o kit e
                                     o retrato do exemplo, e compila (npm install na base da pacote-para-o-construtor:
                                     precisa de rede, ~1 min)
    python autoteste.py --compilar --qa   e roda o QA do avanço no exemplo, na bancada (abre um Edge/Chrome sem janela):
                                     cada funil até o fim, as correções de 27/10/2026 e o registro pelo flow simulado

Não toca conta nenhuma.
"""
import importlib.util
import json
import os
import shutil
import socket
import subprocess
import sys
import tempfile
import time
from pathlib import Path

sys.stdout.reconfigure(encoding='utf-8')
AQUI = Path(__file__).resolve().parent
SKILL = AQUI.parent
PLUGIN = SKILL.parent.parent
falhas = []


def caso(nome, cond, visto=''):
    print(('  OK     ' if cond else '  FALHOU ') + nome + ('' if cond else f' — {visto}'))
    if not cond:
        falhas.append(nome)


def modulo(caminho, nome):
    spec = importlib.util.spec_from_file_location(nome, caminho)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def rodar(*args, **kw):
    return subprocess.run([sys.executable, *map(str, args)], capture_output=True, text=True, encoding='utf-8',
                          env={**os.environ, 'PYTHONIOENCODING': 'utf-8'}, **kw)


print('1. Gerador de dados (o filtro lido da Url, as passagens, o dados.ts)')
r = rodar(AQUI / 'gerar_dados.py', '--autoteste')
caso('autoteste do gerar_dados.py', r.returncode == 0, r.stdout[-400:])

print('2. Hook do lembrete')
r = rodar(PLUGIN / 'hooks' / 'onboarding_lembrete.py', '--autoteste')
caso('autoteste do onboarding_lembrete.py', r.returncode == 0, r.stdout[-400:])

print('2a. O retrato da conta (só GET, sem redirecionamento, a chave mascarada no erro), contra uma API falsa local')
r = rodar(AQUI / 'retrato_da_conta.py', '--autoteste')
caso('autoteste do retrato_da_conta.py', r.returncode == 0, r.stdout[-400:])

# A busca no acervo de telas só existe no uso interno: a cópia pública vem sem o script e sem este caso. Na fonte,
# o script faltando é FALHA, não pulo.
ACERVO = None
if ACERVO is None:
    print('2b. Acervo de telas: pulado — esta cópia não traz a busca no acervo.')
else:
    print('2b. O acervo de telas (a busca nas telas já construídas, só leitura)')
    r = rodar(ACERVO, '--autoteste')
    caso('autoteste do acervo de telas', ACERVO.exists() and r.returncode == 0, r.stdout[-400:] or r.stderr[-400:])

print('3. Comparar retratos')
comp = modulo(AQUI / 'comparar_retratos.py', 'comparar_retratos')
etapa = lambda i, nome, cks=(), autos=(): {'id': i, 'nome': nome, 'checklists': list(cks), 'automacoes': list(autos)}
ck = lambda nome, campos, cond=None: {'nome': nome, 'condicao': cond, 'regras': [], 'campos': campos}
cp = lambda nome, chave, ob=True: {'nome': nome, 'chave': chave, 'obrigatorio': ob}
antes = {'retratoEm': '01/10/2026', 'transicoes': [{'id': 9, 'de': 1, 'para': 2, 'regra': 'Abre a implantação', 'deEtapa': None, 'quando': 'ganho', 'paraEtapa': 20}],
         'funis': [{'id': 1, 'nome': 'Vendas', 'automacoesSemEtapa': [], 'etapas': [
             etapa(10, 'Contato', [ck('Básico', [cp('Cidade', 'k1'), cp('Origem', 'k2', False)])], [{'id': 50, 'nome': 'Avisar'}]),
             etapa(11, 'Proposta')]},
                   {'id': 2, 'nome': 'Implantação', 'automacoesSemEtapa': [], 'etapas': [etapa(20, 'Início')]}]}
depois = json.loads(json.dumps(antes))
depois['funis'][0]['etapas'][0]['checklists'][0]['campos'][1]['obrigatorio'] = True
depois['funis'][0]['etapas'][0]['automacoes'] = []
depois['funis'][0]['etapas'].append(etapa(12, 'Fechamento'))
depois['transicoes'] = []
mud = [m['o_que'] for m in comp.comparar(antes, depois)]
caso('item que virou obrigatório', any("'Origem' virou obrigatório" in m for m in mud), mud)
caso('automação que saiu', any("'Avisar' saiu" in m for m in mud), mud)
caso('etapa nova sem roteiro', any('etapa nova' in m for m in mud), mud)
caso('passagem que saiu', any("'Abre a implantação' saiu" in m for m in mud), mud)
caso('sem mudança, lista vazia', comp.comparar(antes, json.loads(json.dumps(antes))) == [])

print('4. Conferência do onboarding')
with tempfile.TemporaryDirectory() as tmp:
    tela = Path(tmp) / 'mesa'
    src = tela / 'src'
    (src / 'lib').mkdir(parents=True)
    shutil.copytree(SKILL / 'kit', src / 'onboarding' / 'kit', ignore=shutil.ignore_patterns('LEIA-ME.md'))
    (src / 'App.tsx').write_text(
        "import { Route, Routes } from 'react-router';\n"
        "export default function App() { return <Routes><Route path=\"/\" element={<div data-onboarding=\"quadro\" />} />"
        "<Route path=\"/contratos\" element={<div />} /><Route path=\"*\" element={null} /></Routes>; }\n", encoding='utf-8')
    roteiro = src / 'onboarding' / 'roteiro.ts'
    roteiro.write_text(
        "import type { Roteiro } from './kit';\nexport const roteiro: Roteiro = { tela: 'mesa', versao: '1', nome: 'Mesa',\n"
        "  boasVindas: [{ titulo: 'Oi', texto: 'x' }],\n"
        "  tour: [{ id: 'quadro', alvo: 'quadro', rota: '/', titulo: 'Q', texto: 'q' }, { id: 'sumido', alvo: 'botao-velho', rota: '/', titulo: 'S', texto: 's' },\n"
        "         { id: 'novo', alvo: 'quadro', rota: '/', titulo: 'N', texto: 'n', desde: '3' }],\n"
        "  primeirosPassos: [], dicas: {} };\n", encoding='utf-8')
    conf = modulo(AQUI / 'conferir_onboarding.py', 'conferir_onboarding')
    achados, _ = conf.conferir(tela)
    texto = '\n'.join(f'{n} {o}' for n, o in achados)
    caso('alvo do roteiro sem marca na tela é ERRO', "ERRO o passo 'sumido'" in texto, texto)
    caso('desde maior que a versão é ERRO', "diz desde '3'" in texto, texto)
    caso('rota sem passo é AVISO', "AVISO a rota '/contratos'" in texto, texto)
    roteiro.write_text(roteiro.read_text(encoding='utf-8').replace("alvo: 'botao-velho'", "alvo: 'quadro'").replace("desde: '3'", "desde: '1'"), encoding='utf-8')
    r = rodar(AQUI / 'conferir_onboarding.py', '--tela', tela, '--registrar')
    caso('sem erro, registra o estado', r.returncode == 0 and (tela / '.onboarding-conferido.json').exists(), r.stdout)
    (src / 'App.tsx').write_text((src / 'App.tsx').read_text(encoding='utf-8') + '// mudou\n', encoding='utf-8')
    achados, _ = conf.conferir(tela)
    caso('tela mudou e a versão não subiu é AVISO, com o arquivo', any(n == 'AVISO' and 'App.tsx' in o and 'continua na versão 1' in o for n, o in achados), achados)
    (src / 'onboarding' / 'kit' / 'Tour.tsx').write_text('// mexido\n', encoding='utf-8')
    achados, _ = conf.conferir(tela)
    caso('kit editado é ERRO', any(n == 'ERRO' and 'Tour.tsx difere' in o for n, o in achados), achados)

print('5. O bloco do mapa e do simulador, com o exemplo, conferido (o registro no Usuário)')
EXEMPLO = SKILL / 'modelo-treinamento' / 'exemplo'
WEBHOOK_DA_BANCADA = 'http://localhost:8780/_bancada/flow/onboarding'
SEM_WEBHOOK = 'export const WEBHOOK_DO_REGISTRO: string | null = null;'
gerador = modulo(AQUI / 'gerar_dados.py', 'gerar_dados')


def montar_modelo(tela):
    """O bloco do mapa e do simulador, com o kit e o dados.ts gerado do retrato do exemplo."""
    shutil.copytree(SKILL / 'modelo-treinamento' / 'src', tela / 'src', dirs_exist_ok=True)
    shutil.copytree(SKILL / 'kit', tela / 'src' / 'onboarding' / 'kit', ignore=shutil.ignore_patterns('LEIA-ME.md'), dirs_exist_ok=True)
    (tela / 'src' / 'lib').mkdir(exist_ok=True)
    retrato, resumo = gerador.montar(EXEMPLO / 'retrato')
    gerador.gravar(retrato, tela)
    return retrato, resumo


def trocar_webhook(tela, url):
    """Liga o registro no jornada.ts da cópia: o modelo vem com o webhook null."""
    j = tela / 'src' / 'treinamento' / 'jornada.ts'
    t = j.read_text(encoding='utf-8')
    if SEM_WEBHOOK not in t:
        return False
    j.write_text(t.replace(SEM_WEBHOOK, f"export const WEBHOOK_DO_REGISTRO: string | null = '{url}';"), encoding='utf-8')
    return True


with tempfile.TemporaryDirectory() as tmp:
    tela = Path(tmp) / 'onboarding'
    retrato, resumo = montar_modelo(tela)
    caso('o retrato do exemplo gera os três funis e as duas passagens, sem aviso',
         len(retrato['funis']) == 3 and len(retrato['transicoes']) == 2 and not resumo['avisos'], resumo)
    caso('o filtro do checklist do exemplo se lê pela Url', resumo['filtros_sem_regra'] == 0 and resumo['com_condicao'] == 1, resumo)
    achados, _ = conf.conferir(tela)
    caso('o modelo sem o webhook: AVISO de registro desligado (regra 11), sem ERRO',
         not any(n == 'ERRO' for n, _ in achados) and any(n == 'AVISO' and 'WEBHOOK_DO_REGISTRO é null' in o for n, o in achados), achados)
    caso('o webhook ligado no jornada.ts do modelo', trocar_webhook(tela, WEBHOOK_DA_BANCADA))
    achados, _ = conf.conferir(tela)
    caso('o webhook apontando a bancada é ERRO (em produção nada grava)', any(n == 'ERRO' and 'aponta a bancada' in o for n, o in achados), achados)
    j = tela / 'src' / 'treinamento' / 'jornada.ts'
    j.write_text(j.read_text(encoding='utf-8').replace(WEBHOOK_DA_BANCADA, 'https://flows.exemplo/webhook'), encoding='utf-8')
    achados, _ = conf.conferir(tela)
    caso('com a URL do flow, nada sobre o registro', not any('WEBHOOK_DO_REGISTRO' in o for _, o in achados), achados)

print('6. O registro e as correções de 27/10/2026 no código do modelo')
SIM = (SKILL / 'modelo-treinamento' / 'src' / 'treinamento' / 'FunilSimulador.tsx').read_text(encoding='utf-8')
REG = (SKILL / 'kit' / 'registro.ts').read_text(encoding='utf-8')
CSS = (SKILL / 'modelo-treinamento' / 'src' / 'treinamento' / 'treinamento.css').read_text(encoding='utf-8')
TOUR = (SKILL / 'kit' / 'Tour.tsx').read_text(encoding='utf-8')
envio = REG.split('export function registrar')[1][:700]
caso('o evento vai como text/plain (sem o OPTIONS de CORS)', "'Content-Type': 'text/plain" in envio and 'application/json' not in envio)
caso('a roda do mouse anda o quadro, com o ouvinte nativo passive: false', "addEventListener('wheel', roda, { passive: false })" in SIM)
caso('o aviso não some sozinho e tem o X', 'setAviso(null), 6000' not in SIM and 'aviso-fechar' in SIM)
caso('a dica mede por ResizeObserver, sem o relógio de 300 ms', 'setInterval' not in SIM and 'ResizeObserver' in SIM)
caso('o "Chega aqui por" é etiqueta, e o detalhe abre no clique', 'ChipDeEntrada' in SIM and 'sim-entrada-detalhe' in SIM)
caso('o balão da dica rola por dentro e a largura não oscila', 'max-height: calc(100vh - 32px)' in CSS and 'scrollbar-gutter: stable' in CSS)
caso('o mapa empilha no celular, sem setas', '.onb-setas { display: none; }' in CSS)
caso('o tour não pede a camada de tela cheia da ponte', 'useViewportOverlay(' not in TOUR)
caso('passo a passo: o balão move o card e ganha', "botao: 'Mover para ' + prox.nome" in SIM and "botao: 'Ganhar', aoBotao: ganhar" in SIM)
caso('o último "Entendi" da etapa preenche o checklist', 'const entendi = ' in SIM and 'if (preencher) preencherExemplo();' in SIM)
caso('o que o Ploomes faz sozinho é explicado uma vez por funil', "vistos['auto|' + funil.id]" in SIM and "'|auto']" not in SIM)
caso('a linha do tempo destaca o novo e volta ao fundo no fim', 'neg-novo' in SIM and 'ease-out 0.4s backwards' in CSS)

print('7. QA do avanço (sintaxe; o QA de verdade roda com --compilar --qa)')
v = subprocess.run(['node', '--check', str(AQUI / 'qa_do_avanco.mjs')], capture_output=True, text=True)
caso('qa_do_avanco.mjs sem erro de sintaxe', v.returncode == 0, v.stderr[-300:])

if '--compilar' in sys.argv:
    print('8. O bloco do mapa e do simulador, com o kit e o exemplo, compilado')
    scaffold = PLUGIN / 'skills' / 'pacote-para-o-construtor' / 'bancada' / 'scaffold'
    with tempfile.TemporaryDirectory() as tmp:
        tela = Path(tmp) / 'onboarding'
        shutil.copytree(scaffold, tela, ignore=shutil.ignore_patterns('node_modules', 'dist'))
        montar_modelo(tela)
        # portas livres: a 8780 costuma estar com a bancada de outra tela, e o QA leria a bancada errada
        socks = [socket.socket() for _ in range(2)]
        for x in socks:
            x.bind(('127.0.0.1', 0))
        porta_host, porta_tela = (x.getsockname()[1] for x in socks)
        for x in socks:
            x.close()
        trocar_webhook(tela, f'http://localhost:{porta_host}/_bancada/flow/onboarding')   # o flow simulado desta bancada
        npm = 'npm.cmd' if os.name == 'nt' else 'npm'
        npx = 'npx.cmd' if os.name == 'nt' else 'npx'
        i = subprocess.run([npm, 'install', '--no-audit', '--no-fund', '--loglevel=error'], cwd=tela, capture_output=True, text=True)
        caso('npm install da base', i.returncode == 0, i.stderr[-400:])
        t = subprocess.run([npx, 'tsc', '--noEmit'], cwd=tela, capture_output=True, text=True)
        caso('tsc --noEmit sem erro', t.returncode == 0, (t.stdout + t.stderr)[-800:])
        if '--qa' in sys.argv:
            print('9. O QA do avanço no exemplo, na bancada (abre um Edge/Chrome sem janela)')
            b = subprocess.run([npx, 'vite', 'build'], cwd=tela, capture_output=True, text=True)
            caso('vite build', b.returncode == 0, (b.stdout + b.stderr)[-400:])
            bancada = subprocess.Popen(['node', str(scaffold.parent / 'servidor.mjs'), '--pacote', str(EXEMPLO / 'bancada'),
                                        '--tela', str(tela / 'dist'), '--porta-host', str(porta_host), '--porta-tela', str(porta_tela)],
                                       stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            try:
                time.sleep(2)
                q = subprocess.run(['node', str(AQUI / 'qa_do_avanco.mjs'), '--host', f'http://localhost:{porta_host}/', '--saida', str(Path(tmp) / 'qa'),
                                    '--larguras', '1366x768,390x844'], capture_output=True, text=True, encoding='utf-8', timeout=900)
                caso('QA do avanço sem ERRO', q.returncode == 0 and '0 erro(s)' in q.stdout, (q.stdout + q.stderr)[-1500:])
                rel = next((Path(tmp) / 'qa').glob('qa-*/relatorio.md'), None)
                texto = rel.read_text(encoding='utf-8') if rel else ''
                caso('a abertura e a conclusão gravadas no Usuário pelo flow, e a volta soma em "consultou"',
                     'abriu:gravado-pelo-flow' in texto and 'concluiu:gravado-pelo-flow' in texto
                     and 'Vezes que assistiu o onboarding = 1' in texto and 'Vezes que consultou o onboarding = 1' in texto
                     and 'Concluiu o onboarding = true' in texto, texto[-1200:])
                caso('o nome interno da automação ("P6 ·") não aparece para a pessoa', 'prefixo-interno' not in texto, texto[-800:])
                caso('o evento chega ao flow com a tela, o usuário e o evento', '"evento":"concluiu"' in texto and '"tela":"mapa-da-jornada"' in texto, texto[-800:])
            finally:
                bancada.terminate()

print(f"\n{'FALHOU' if falhas else 'PASSOU'} — {len(falhas)} falha(s).")
sys.exit(1 if falhas else 0)
