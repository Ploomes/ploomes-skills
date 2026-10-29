import { useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { DragEvent, ReactNode } from 'react';
import { Navigate, useNavigate, useParams, useSearchParams } from 'react-router';
import { motion, useReducedMotion } from 'motion/react';
import {
  AlertTriangle, ArrowRight, Bot, CalendarDays, CheckCircle2, ChevronDown, Columns3, Eye, Filter, Flag, Folder,
  HelpCircle, Lock, Move, Plus, Search, Settings, ThumbsDown, Trophy, UserCircle2, Users, X,
} from 'lucide-react';

import { CARD_EXEMPLO, ETAPA_DA_AUTOMACAO, ETAPA_DA_EDICAO, ROTEIROS, TRANSICOES, funilPorId, nomeEtapa, rotuloFunil, semPrefixo } from './jornada';
import { useProgresso } from './progresso';
import { RotaDoMapa } from './rotas';
import type { Automacao, Checklist, Etapa, Transicao } from './tipos';

type Fim = 'ganho' | 'perda' | null;

const igual = (a: string | undefined, b: string) => (a ?? '').trim().toLowerCase() === b.trim().toLowerCase();
const bate = (a: string | undefined, valores: string[]) => valores.some((v) => igual(a, v));

/**
 * Um funil desenhado como o funil nativo do Ploomes, com um card de exemplo. Clicar no card abre o
 * negócio como no Ploomes (cabeçalho, barra de etapas, checklist da etapa à esquerda, linha do tempo
 * à direita) e uma dica com holofote vai guiando: quem faz a etapa, o que o Ploomes faz sozinho,
 * o que preencher e como mover o card. Item obrigatório trava o avanço, como no Ploomes; um checklist
 * com filtro só aparece quando a resposta do filtro é dada. Nada é gravado na conta.
 * Etapa, card aberto e fim ficam na query string (?etapa=N&card=1): voltar do navegador funciona.
 */
export default function FunilSimulador() {
  const { id } = useParams();
  const [busca, setBusca] = useSearchParams();
  const navigate = useNavigate();
  const rotaDoMapa = useContext(RotaDoMapa);
  const reduzir = useReducedMotion();
  const funil = funilPorId(Number(id));
  const total = funil?.etapas.length ?? 0;
  const indice = Math.min(Math.max(Number(busca.get('etapa') ?? 0) || 0, 0), Math.max(total - 1, 0));
  const fim = (busca.get('fim') as Fim) || null;
  const aberto = busca.get('card') === '1' && !fim;
  /* O valor fica pelo campo de verdade (FieldKey): o mesmo campo em outra etapa já vem preenchido, como no Ploomes;
     itens com o mesmo rótulo e campos diferentes (o farol de cada visita) ficam separados. */
  const [valores, setValores] = useState<Record<string, string>>({});
  /* Checklist com filtro que não depende de um campo desta simulação: o usuário liga o caso à mão. */
  const [casos, setCasos] = useState<Record<string, boolean>>({});
  const [editando, setEditando] = useState<{ chave: string; rascunho: string } | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);
  const [tentou, setTentou] = useState(false);
  const [alvoArraste, setAlvoArraste] = useState<number | null>(null);
  const [vistos, setVistos] = useState<Record<string, boolean>>({});
  /* Etapas cujo checklist o simulador preencheu com o exemplo: o balão seguinte avisa que foi ele, não o usuário. */
  const [preenchidas, setPreenchidas] = useState<Record<string, boolean>>({});
  const [dicas, setDicas] = useState(true);
  /* A passagem do "Chega aqui por" aberta: o clique na etiqueta mostra o porquê; só o botão do detalhe navega. */
  const [entradaAberta, setEntradaAberta] = useState<Transicao | null>(null);
  const quadro = useRef<HTMLDivElement | null>(null);
  const { marcar: marcarConcluido } = useProgresso();

  useEffect(() => { window.scrollTo?.(0, 0); setEntradaAberta(null); }, [id]);
  /* A roda do mouse anda o quadro para o lado (no notebook, com mouse comum, o funil não rolava para
     as etapas da direita). Só enquanto o quadro tem para onde ir; nas pontas, a roda volta a rolar a página. Precisa
     do ouvinte nativo com passive: false, porque o onWheel do React não deixa cancelar a rolagem. */
  useEffect(() => {
    const q = quadro.current;
    if (!q) return;
    const roda = (ev: WheelEvent) => {
      if (ev.shiftKey || Math.abs(ev.deltaX) >= Math.abs(ev.deltaY)) return;
      const fimDoQuadro = q.scrollWidth - q.clientWidth;
      if (fimDoQuadro <= 0) return;
      if ((ev.deltaY < 0 && q.scrollLeft <= 0) || (ev.deltaY > 0 && q.scrollLeft >= fimDoQuadro - 1)) return;
      ev.preventDefault();
      q.scrollLeft += ev.deltaY;
    };
    q.addEventListener('wheel', roda, { passive: false });
    return () => q.removeEventListener('wheel', roda);
  }, [id, aberto, fim]);
  useEffect(() => { setTentou(false); setEditando(null); setAviso(null); }, [indice, aberto]);

  const etapa = funil?.etapas[indice];
  /* As automações da etapa, mais as do funil sem etapa que o jornada.ts liga a ela (ETAPA_DA_AUTOMACAO). */
  const automacoesDa = (e: Etapa | undefined): Automacao[] => (e && funil
    ? [...e.automacoes, ...funil.automacoesSemEtapa.filter((a) => (ETAPA_DA_AUTOMACAO[a.id] ?? []).includes(e.id))]
    : []);
  const roteiro = funil ? ROTEIROS[funil.id] : undefined;
  const entradas = useMemo(() => TRANSICOES.filter((t) => t.para === funil?.id), [funil]);
  const saidasDaEtapa = useMemo(() => TRANSICOES.filter((t) => t.de === funil?.id && t.deEtapa === etapa?.id), [funil, etapa]);
  const saidasDoFunil = useMemo(() => TRANSICOES.filter((t) => t.de === funil?.id && t.deEtapa === null), [funil]);
  /* Ao entrar na etapa, o que as automações de entrada gravam já aparece preenchido, como no Ploomes (sem apagar o que o usuário pôs). */
  useEffect(() => {
    const grava = Object.assign({}, ...automacoesDa(etapa).filter((a) => a.quando === 'entra na etapa').map((a) => a.preenche));
    if (Object.keys(grava).length) setValores((v) => ({ ...grava, ...v }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [etapa]);
  const edicaoAqui = saidasDoFunil.filter((t) => t.quando === 'edicao' && (ETAPA_DA_EDICAO[t.id] ?? etapa?.id) === etapa?.id);

  if (!funil || !etapa) return <Navigate to="/" replace />;

  /* O filtro do checklist se liga sozinho ao item que responde aquele campo, pela chave (FieldKey) que o gerador leu
     na Url do filtro. Vale item de qualquer etapa do funil, porque o filtro pode olhar uma resposta dada antes.
     Rótulos: primeiro os da etapa atual. */
  const rotuloDaChave = new Map<string, string>();
  const opcoesDaChave = new Map<string, string[]>();
  [etapa, ...funil.etapas.filter((e) => e !== etapa)].forEach((e) => e.checklists.forEach((c) => c.campos.forEach((x) => {
    if (!rotuloDaChave.has(x.chave)) rotuloDaChave.set(x.chave, x.nome);
    if (x.opcoes?.length && !opcoesDaChave.has(x.chave)) opcoesDaChave.set(x.chave, x.opcoes);
  })));
  const camposDaEtapa = new Set(etapa.checklists.flatMap((c) => c.campos.map((x) => x.chave)));
  const nomeDaChave = new Map(etapa.checklists.flatMap((c) => c.campos.map((x) => [x.chave, x.nome] as const)));
  const caixas = new Set(funil.etapas.flatMap((e) => e.checklists.flatMap((c) => c.campos.filter((x) => x.caixa).map((x) => x.chave))));
  /* As regras do filtro, lidas da Url dele pelo gerador e já ligadas aos campos; null quando o filtro não se liga a um
     campo que a simulação pergunta (aí o usuário liga o caso à mão, em "simular este caso"). */
  const ligadoPorCampo = (c: Checklist): { campo: string; chave: string; valores: string[]; negar: boolean }[] | null =>
    c.regras.length && c.regras.every((r) => rotuloDaChave.has(r.chave))
      ? c.regras.map((r) => ({ ...r, campo: rotuloDaChave.get(r.chave)! }))
      : null;
  const cumpre = (vals: Record<string, string>) => (r: { chave: string; valores: string[]; negar: boolean }) => bate(vals[r.chave], r.valores) !== r.negar;
  const valeCom = (vals: Record<string, string>) => (c: Checklist): boolean => {
    if (!c.condicao) return true;
    const regras = ligadoPorCampo(c);
    return regras ? regras.every(cumpre(vals)) : !!casos[etapa.id + '|' + c.nome];
  };
  const vale = valeCom(valores);
  /* Sugestões de resposta: as opções reais do campo de lista, os valores que algum filtro usa, e Sim/Não para pergunta. */
  const sugestoes = (chave: string): string[] => {
    const lista = [
      ...(opcoesDaChave.get(chave) ?? []),
      ...funil.etapas.flatMap((e) => e.checklists).flatMap((c) => ligadoPorCampo(c) ?? []).filter((x) => x.chave === chave && !x.negar).flatMap((x) => x.valores),
    ];
    if ((rotuloDaChave.get(chave) ?? '').trim().endsWith('?')) lista.unshift('Sim', 'Não');
    return [...new Set(lista.map((v) => v.charAt(0).toUpperCase() + v.slice(1)))];
  };
  const visiveis = etapa.checklists.filter(vale);
  const pendentes = (vals: Record<string, string>, lista: Checklist[]) =>
    [...new Set(lista.flatMap((c) => c.campos.filter((x) => x.obrigatorio && !(vals[x.chave] ?? '').trim()).map((x) => x.chave)))];
  const faltando = pendentes(valores, visiveis).map((k) => nomeDaChave.get(k) ?? k);
  const faltam = faltando.length;
  const ultima = indice === total - 1;
  const plural = (n: number) => n + ' ' + (n === 1 ? funil.unidade : funil.unidadePlural).toLowerCase();
  const tituloCard = roteiro?.cardExemplo ?? CARD_EXEMPLO;
  const unidade = funil.unidade.toLowerCase();
  const autosEntrada = (e: Etapa) => automacoesDa(e).filter((a) => a.quando === 'entra na etapa');
  const tarefas = autosEntrada(etapa).flatMap((a) => a.tarefas);
  const primeiraLigada = etapa.checklists.flatMap((c) => ligadoPorCampo(c) ?? [])
    .find((x) => !x.negar && camposDaEtapa.has(x.chave) && !caixas.has(x.chave) && !bate(valores[x.chave], x.valores));

  /* O aviso fica até a pessoa fechar (o X), mover o card ou trocar de etapa: sumindo sozinho em 6 s, não dava tempo
     de ler. */
  const avisar = (texto: string) => setAviso(texto);
  const irPara = (n: number, opcoes: { card?: boolean; fim?: Fim } = {}) => {
    const p = new URLSearchParams();
    p.set('etapa', String(n));
    if (opcoes.card) p.set('card', '1');
    if (opcoes.fim) p.set('fim', opcoes.fim);
    setBusca(p);
  };
  const travado = () => {
    setTentou(true);
    avisar('Preencha os itens obrigatórios do checklist antes de mover: ' + faltando.join(' · ') + '.');
  };
  const ganhar = () => {
    if (faltam > 0) return travado();
    marcarConcluido(funil.id);
    irPara(indice, { fim: 'ganho' });
  };
  const perder = () => { marcarConcluido(funil.id); irPara(indice, { fim: 'perda' }); };
  /* Mover pela barra de etapas (card aberto) ou arrastando no quadro: para trás sempre; para a frente, uma por vez e com o checklist completo. */
  const mover = (destino: number, manterAberto: boolean) => {
    if (fim || destino === indice) return;
    if (destino < indice) return irPara(destino, { card: manterAberto });
    if (destino > indice + 1) return avisar('Na simulação, avance uma etapa por vez para ver o que cada uma pede.');
    if (faltam > 0) return travado();
    irPara(destino, { card: manterAberto });
  };
  const soltar = (e: DragEvent, destino: number) => {
    e.preventDefault();
    setAlvoArraste(null);
    mover(destino, false);
  };
  const salvar = (chave: string, valor: string) => {
    setValores((v) => ({ ...v, [chave]: valor.trim() }));
    setEditando(null);
  };
  /* "Preencher por mim": responde Sim nas perguntas e "Exemplo" no resto, até não sobrar obrigatório (filtros podem abrir mais itens). */
  const preencherExemplo = () => {
    let vals = { ...valores };
    let preencheu = false;
    for (let volta = 0; volta < 6; volta++) {
      const vazios = pendentes(vals, etapa.checklists.filter(valeCom(vals)));
      if (!vazios.length) break;
      vazios.forEach((k) => { vals = { ...vals, [k]: caixas.has(k) || (nomeDaChave.get(k) ?? '').trim().endsWith('?') ? 'Sim' : 'Exemplo' }; });
      preencheu = true;
    }
    if (!preencheu) return;
    setValores(vals);
    setPreenchidas((p) => ({ ...p, [etapa.id]: true }));
  };
  /* O que o Ploomes faz sozinho é explicado uma vez por funil, na primeira etapa com automação, apontando a linha do
     tempo; nas outras etapas o que a automação faz só chega destacado ali, sem balão. */
  const explicarAutos = automacoesDa(etapa).length > 0 && !vistos['auto|' + funil.id];
  /* Passo a passo (contra cliques demais e um passo a passo pouco claro): todo passo anda pelo botão
     do próprio balão, e o último "Entendi" da etapa já preenche o checklist com o exemplo. */
  const entendi = (chave: string, preencher: boolean) => () => {
    setVistos((v) => ({ ...v, [chave]: true }));
    if (preencher) preencherExemplo();
  };
  const preenchida = !!preenchidas[etapa.id];

  const BotaoFunil = ({ t, texto, abrirCard }: { t: Transicao; texto: 'de' | 'para'; abrirCard?: boolean }) => {
    const destino = funilPorId(texto === 'de' ? t.de : t.para);
    if (!destino) return null;
    const etapaNome = nomeEtapa(texto === 'de' ? t.deEtapa : t.paraEtapa);
    return (
      <button className="sim-ponte" onClick={() => navigate('/funil/' + destino.id + (abrirCard ? '?card=1' : ''))}>
        <span className="sim-ponte-cor" style={{ background: destino.cor }} />
        <span>
          <b>{rotuloFunil(destino)}</b>
          <small>{semPrefixo(t.regra)}{etapaNome ? ' · ' + (texto === 'de' ? 'sai da etapa ' : 'entra em ') + etapaNome : ''}</small>
        </span>
        <ArrowRight size={15} />
      </button>
    );
  };

  /* "Chega aqui por" compacto: o cartão inteiro de cada origem fazia o cabeçalho alto e empurrava o
     quadro para baixo, e no notebook o funil ficava pequeno. Agora é uma etiqueta com o número e o nome do funil; o
     clique abre o porquê e o botão para o funil. */
  const ChipDeEntrada = ({ t }: { t: Transicao }) => {
    const origem = funilPorId(t.de);
    if (!origem) return null;
    const ativo = entradaAberta?.id === t.id;
    return (
      <button className={'sim-chip' + (ativo ? ' sim-chip--ativo' : '')} aria-expanded={ativo} title={semPrefixo(t.regra)}
        onClick={() => setEntradaAberta(ativo ? null : t)}>
        <span className="sim-ponte-cor" style={{ background: origem.cor }} />
        <span className="sim-chip-nome">{rotuloFunil(origem)}</span>
      </button>
    );
  };
  const origemAberta = entradaAberta ? funilPorId(entradaAberta.de) : undefined;
  const etapaDaOrigem = entradaAberta ? nomeEtapa(entradaAberta.deEtapa) : null;

  /* ---------- a dica da vez: sai do estado da simulação, não de uma lista fixa ---------- */
  const passo: Passo | null = (() => {
    if (fim || !dicas || editando) return null;
    const selo = 'Etapa ' + (indice + 1) + ' de ' + total;
    if (!aberto) {
      return {
        chave: 'card' + indice, alvo: 'card', selo, titulo: indice === 0 ? 'Abra o card' : 'Abra o card de novo',
        texto: indice === 0
          ? <>Cada card deste funil é uma {unidade}. Este é o card de exemplo, na primeira etapa. <b>Clique nele</b> para abrir, como no Ploomes.</>
          : <>O card está em <b>{etapa.nome}</b>. Clique nele para continuar, ou arraste para outra coluna.</>,
        acao: true, botao: 'Abrir o card', aoBotao: () => irPara(indice, { card: true }),
      };
    }
    const rot = roteiro?.etapas[etapa.id];
    if (!vistos[etapa.id + '|roteiro']) {
      return {
        chave: 'rot' + etapa.id, alvo: 'etapa-atual', selo, titulo: etapa.nome, quem: rot?.quem,
        texto: rot?.texto ?? 'Esta é a etapa em que o card está. A barra mostra todas as etapas do funil, da esquerda para a direita.',
        botao: 'Entendi', aoBotao: entendi(etapa.id + '|roteiro', !explicarAutos),
      };
    }
    if (explicarAutos) {
      return {
        chave: 'auto' + funil.id, alvo: 'lado-direito', selo, titulo: 'O que o Ploomes faz sozinho',
        texto: (
          <>
            Aqui, na linha do tempo do card, aparece tudo o que o Ploomes faz sozinho: tarefa criada, campo gravado, card
            aberto em outro funil. Nesta etapa:
            <ul className="dica-lista">
              {automacoesDa(etapa).map((a, i) => <li key={i}><Bot size={13} /> <span>Quando o card {a.quando}: <b>{semPrefixo(a.nome)}</b></span></li>)}
            </ul>
            Nas próximas etapas, o que for novo chega destacado aqui.
          </>
        ),
        botao: 'Entendi', aoBotao: entendi('auto|' + funil.id, true),
      };
    }
    if (faltam > 0) {
      return {
        chave: 'ck' + etapa.id, alvo: 'checklist', selo, titulo: 'Preencha o checklist da etapa',
        texto: (
          <>
            {faltam === 1 ? 'Falta 1 item obrigatório' : `Faltam ${faltam} itens obrigatórios`} (triângulo vermelho): clique em <b>Adicionar…</b> ao lado {faltam === 1 ? 'dele' : 'de cada um'}.
            Sem eles o Ploomes não deixa o card avançar.
            {primeiraLigada && <> Algumas respostas abrem um checklist a mais: experimente responder <b>{primeiraLigada.valores[0]}</b> em <b>{primeiraLigada.campo}</b>.</>}
          </>
        ),
        acao: true, extra: 'Preencher por mim', aoExtra: preencherExemplo,
      };
    }
    if (ultima && !funil.podeGanhar) {
      return {
        chave: 'fimauto' + etapa.id, alvo: 'etapa-atual', selo, titulo: 'Última etapa',
        texto: 'Neste funil o card não é ganho nem perdido à mão: quem conclui é o Ploomes, sozinho. Veja no roteiro da etapa quando isso acontece.',
        botao: 'Concluir a simulação', aoBotao: () => { marcarConcluido(funil.id); irPara(indice, { fim: 'ganho' }); },
      };
    }
    if (ultima) {
      return {
        chave: 'fim' + etapa.id, alvo: funil.podeGanhar ? 'ganhar' : 'etapa-atual', selo, titulo: preenchida ? 'Checklist preenchido' : 'Checklist completo',
        texto: (
          <>
            {preenchida && <>Preenchemos o checklist com um exemplo (os itens com ✓). No dia a dia, quem preenche é você. </>}
            Esta é a última etapa: <b>Ganhar</b> conclui o card{saidasDoFunil.some((t) => t.quando === 'ganho') ? ', e conforme as respostas do checklist o Ploomes abre o próximo funil sozinho' : ''}.
          </>
        ),
        acao: true, botao: 'Ganhar', aoBotao: ganhar,
      };
    }
    const prox = funil.etapas[indice + 1];
    return {
      chave: 'av' + etapa.id, alvo: 'proxima', selo,
      titulo: preenchida ? 'Checklist preenchido: mova o card'
        : etapa.checklists.length > 0 && visiveis.length === 0 ? 'Nada a preencher aqui: mova o card' : 'Checklist completo: mova o card',
      texto: (
        <>
          {preenchida && <>Preenchemos o checklist com um exemplo (os itens com ✓). No dia a dia, quem preenche é você: clique num item para mudar a resposta. </>}
          Mova o card para <b>{prox.nome}</b> pelo botão abaixo ou pela barra de etapas.
          {saidasDaEtapa.length + edicaoAqui.length > 0 && <> Desta etapa o negócio também pode abrir outro funil: veja em <b>Negócios derivados</b>.</>}
        </>
      ),
      acao: true, botao: 'Mover para ' + prox.nome, aoBotao: () => mover(indice + 1, true),
    };
  })();

  return (
    <main className="onb sim">
      <header className="sim-topo">
        <button className="onb-link sim-voltar" onClick={() => navigate(rotaDoMapa)}>Voltar ao mapa da jornada</button>
        <div className="sim-titulo">
          <span className="sim-num" style={{ background: funil.cor }}>{funil.numero ?? '•'}</span>
          <div>
            <h1>{funil.titulo}</h1>
            <p>{roteiro?.resumo ?? `Cada card deste funil é uma ${unidade}. ${total} etapas.`}</p>
          </div>
          {!dicas && !fim && (
            <button className="sim-botao sim-dicas" onClick={() => setDicas(true)}><HelpCircle size={15} /> Mostrar dicas</button>
          )}
        </div>
        <div className="sim-entradas">
          <span className="sim-rotulo">Chega aqui por</span>
          {entradas.length
            ? entradas.map((t) => <ChipDeEntrada key={t.id} t={t} />)
            : <span className="sim-nota">cadastro direto: o usuário cria o card neste funil, no botão "Nova {unidade}".</span>}
        </div>
        {entradaAberta && origemAberta && (
          <div className="sim-entrada-detalhe" role="region" aria-label={'Como o card chega de ' + rotuloFunil(origemAberta)}>
            <p><b>{rotuloFunil(origemAberta)}</b> · {semPrefixo(entradaAberta.regra)}{etapaDaOrigem ? ' · sai da etapa ' + etapaDaOrigem : ''}</p>
            <div className="sim-entrada-acoes">
              <button className="sim-botao" onClick={() => navigate('/funil/' + origemAberta.id)}>Abrir este funil <ArrowRight size={14} /></button>
              <button className="onb-link" onClick={() => setEntradaAberta(null)}>Fechar</button>
            </div>
          </div>
        )}
      </header>

      {aberto ? (
        /* ===== O card aberto, como no Ploomes ===== */
        <section className="nat neg" aria-label={'Card ' + tituloCard + ', aberto como no Ploomes'}>
          <button className="neg-migalha" onClick={() => irPara(indice)}>Voltar ao funil</button>
          <div className="neg-cab">
            <span className="neg-icone" style={{ background: funil.cor }}><Users size={30} /></span>
            <div className="neg-cab-txt">
              <div className="neg-titulo">{tituloCard}</div>
              <span className="neg-chip"><Folder size={14} /> {funil.nome}</span>
            </div>
            <div className="neg-acoes">
              {ultima && funil.podeGanhar && <button className="neg-ganhar" data-onboarding="ganhar" onClick={ganhar}>Ganhar</button>}
              {funil.podePerder && <button className="neg-perder" onClick={perder}>Perder</button>}
              <span className="neg-bt"><Move size={14} /> Remanejar {funil.unidade}</span>
              <button className="neg-bt" onClick={() => irPara(indice)} title="Fechar o card"><X size={14} /> Fechar</button>
            </div>
          </div>

          <nav className="neg-etapas" aria-label="Etapas do funil">
            {funil.etapas.map((e, i) => (
              <button key={e.id} title={e.nome}
                className={'neg-etapa' + (i < indice ? ' neg-etapa--passada' : '') + (i === indice ? ' neg-etapa--atual' : '')}
                data-onboarding={i === indice ? 'etapa-atual' : i === indice + 1 ? 'proxima' : undefined}
                onClick={() => mover(i, true)}>
                <span>{e.nome}</span>
              </button>
            ))}
          </nav>

          {aviso && <div className="neg-aviso" role="alert"><Lock size={15} /> <span>{aviso}</span><button className="aviso-fechar" onClick={() => setAviso(null)} aria-label="Fechar o aviso"><X size={14} /></button></div>}

          <div className="neg-corpo">
            <aside className="neg-esq" data-onboarding="checklist">
              {etapa.checklists.length === 0 && <p className="neg-vazio">Esta etapa não tem checklist. É só mover o card quando o trabalho estiver feito.</p>}
              {etapa.checklists.length > 0 && visiveis.length === 0 && (
                <p className="neg-vazio">Nenhum checklist desta etapa vale para este card, pelas respostas dadas antes. É só mover o card.</p>
              )}
              {etapa.checklists.map((c) => {
                const ligado = ligadoPorCampo(c);
                const ok = vale(c);
                if (!ok && ligado) return null; /* no Ploomes, checklist com filtro só aparece quando o filtro bate */
                return (
                  <div key={c.nome} className="neg-secao">
                    <div className="neg-secao-cab"><span>{c.nome}</span><ChevronDown size={14} /></div>
                    {c.condicao && (
                      <div className="neg-cond">
                        {ligado
                          ? <>Apareceu porque {ligado.map((r, i) => (
                              <span key={r.chave}>{i > 0 && ' e '}<b>{r.campo}</b>{' '}
                                {caixas.has(r.chave) ? <b>{valores[r.chave] ? 'marcado' : 'desmarcado'}</b> : <>= <b>{valores[r.chave]}</b></>}
                              </span>
                            ))}</>
                          : <>
                              <span>Só quando: <b>{c.condicao}</b></span>
                              <button className="onb-link" onClick={() => setCasos((m) => ({ ...m, [etapa.id + '|' + c.nome]: !m[etapa.id + '|' + c.nome] }))}>
                                {ok ? 'este caso não se aplica' : 'simular este caso'}
                              </button>
                            </>}
                      </div>
                    )}
                    {ok && (
                      <ul className="neg-itens">
                        {c.campos.map((x) => {
                          const valor = (valores[x.chave] ?? '').trim();
                          const falta = tentou && x.obrigatorio && !valor;
                          const aqui = editando?.chave === x.chave;
                          const opcoes = sugestoes(x.chave);
                          return (
                            <li key={x.chave} className={'neg-item' + (falta ? ' neg-item--falta' : '')}>
                              <span className="neg-item-icone">
                                {valor ? <CheckCircle2 size={14} className="neg-ok" />
                                  : x.obrigatorio ? <AlertTriangle size={14} className="neg-obrig" /> : <CheckCircle2 size={14} className="neg-opc" />}
                              </span>
                              <span className="neg-item-nome">{x.nome}</span>
                              {/* Campo Sim/Não: caixa de marcar, como no Ploomes. Obrigatório só passa marcado. */}
                              {x.caixa
                                ? <button role="checkbox" aria-checked={!!valor} aria-label={x.nome}
                                    className={'neg-caixa' + (valor ? ' neg-caixa--marcada' : '')}
                                    onClick={() => salvar(x.chave, valor ? '' : 'Sim')}>{valor ? '✓' : ''}</button>
                                : <button className={'neg-item-valor' + (valor ? '' : ' neg-item-valor--vazio')}
                                    onClick={() => setEditando({ chave: x.chave, rascunho: valor })}>
                                    {valor || 'Adicionar ...'}
                                  </button>}
                              {aqui && (
                                <form className="neg-editar" onSubmit={(ev) => { ev.preventDefault(); salvar(x.chave, editando.rascunho); }}>
                                  <div className="neg-editar-cab">Editar</div>
                                  <label>
                                    <span>{x.nome}</span>
                                    <input autoFocus value={editando.rascunho}
                                      onChange={(ev) => setEditando({ chave: x.chave, rascunho: ev.target.value })}
                                      onKeyDown={(ev) => { if (ev.key === 'Escape') setEditando(null); }} />
                                  </label>
                                  {opcoes.length > 0 && (
                                    <div className="neg-editar-opcoes">
                                      {opcoes.map((o) => <button type="button" key={o} onClick={() => salvar(x.chave, o)}>{o}</button>)}
                                    </div>
                                  )}
                                  <div className="neg-editar-rodape">
                                    <button type="submit" className="neg-salvar">Salvar</button>
                                    <button type="button" className="neg-cancelar" onClick={() => setEditando(null)}>Cancelar</button>
                                  </div>
                                </form>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                );
              })}
              <div className="neg-secao">
                <div className="neg-secao-cab"><span>Dados básicos</span><ChevronDown size={14} /></div>
                <ul className="neg-itens neg-itens--dados">
                  <li className="neg-item"><span className="neg-item-rot">Título</span><span>{tituloCard}</span></li>
                  <li className="neg-item"><span className="neg-item-rot">Valor</span><span>0,00</span></li>
                </ul>
              </div>
            </aside>

            <div className="neg-dir">
              <div className="neg-abas"><b>Linha do tempo</b><span>Vendas</span><span>Negócios derivados</span><span>Anexos</span></div>
              <div className="neg-dir-corpo" data-onboarding="lado-direito">
                <div className="neg-registro">
                  <div className="neg-registro-abas"><b>Registrar interação</b><span>Agendar tarefa</span><span>Novo Negócio</span><span>Enviar e-mail</span></div>
                  <div className="neg-registro-caixa">Marque um usuário com @</div>
                </div>

                <h4 className="neg-subtitulo">Tarefas em aberto</h4>
                {tarefas.length
                  ? <ul className="neg-tarefas">{tarefas.map((t, i) => <li key={etapa.id + '-' + i} className="neg-novo"><CalendarDays size={14} /> {t}<em>criada pelo Ploomes</em></li>)}</ul>
                  : <p className="neg-tarefa-vazia"><CalendarDays size={14} /> Nenhuma tarefa agendada.</p>}

                {(saidasDaEtapa.length > 0 || edicaoAqui.length > 0) && (
                  <>
                    <h4 className="neg-subtitulo">Negócios derivados</h4>
                    <p className="neg-nota">Daqui o Ploomes pode abrir um card em outro funil:</p>
                    <div className="sim-pontes">
                      {saidasDaEtapa.map((t) => <BotaoFunil key={t.id} t={t} texto="para" />)}
                      {edicaoAqui.map((t) => <BotaoFunil key={t.id} t={t} texto="para" />)}
                    </div>
                  </>
                )}

                <h4 className="neg-subtitulo">Histórico completo</h4>
                <ol className="neg-historico">
                  {funil.etapas.slice(0, indice + 1).flatMap((e, i) => [
                    ...(i > 0 ? [{ k: 'm' + e.id, robo: false, novo: false, texto: <>{funil.unidade} movida para <b>{e.nome}</b>.</> }] : []),
                    ...autosEntrada(e).map((a, j) => ({ k: 'a' + e.id + j, robo: true, novo: i === indice, texto: <>{semPrefixo(a.nome)}</> })),
                  ]).reverse().concat([{ k: 'criada', robo: true, novo: false, texto: <>{funil.unidade} criada.</> }]).map((h) => (
                    <motion.li key={h.k} className={h.novo ? 'neg-novo' : undefined}
                      initial={h.novo && !reduzir ? { opacity: 0, y: -8 } : false} animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: h.novo ? 0.4 : 0 }}>
                      <span className="neg-hist-avatar">{h.robo ? <Bot size={16} /> : <UserCircle2 size={16} />}</span>
                      <div><b>{h.robo ? 'Automação' : 'Você'}</b><small>Hoje</small><p>{h.texto}</p></div>
                    </motion.li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </section>
      ) : (
        /* ===== O funil como no Ploomes ===== */
        <section className="nat" aria-label={'Funil ' + funil.nome + ', como no Ploomes'}>
          <div className="nat-barra">
            <span className="nat-seletor" title="Seletor de funis (na simulação, fica neste funil)">
              <Users size={16} style={{ color: funil.cor }} />
              <span className="nat-seletor-nome">{funil.nome}</span>
              <ChevronDown size={14} />
            </span>
            <span className="nat-busca"><span>Pesquise título ou pelo …</span><Search size={15} /></span>
            <span className="nat-acoes">
              <span><Eye size={14} /> Exibir <ChevronDown size={12} /></span>
              <span><Filter size={14} /> Filtros <ChevronDown size={12} /></span>
              <span><Columns3 size={14} /> Funil <ChevronDown size={12} /></span>
              <span><Settings size={14} /> Menu</span>
              <span className="nat-novo"><Plus size={14} /> Nova {funil.unidade}</span>
            </span>
          </div>
          <div className="nat-quadro" role="list" ref={quadro}>
            {funil.etapas.map((e, i) => {
              const aqui = i === indice;
              return (
                <div key={e.id} role="listitem"
                  className={'nat-coluna' + (alvoArraste === i ? ' nat-coluna--alvo' : '') + (aqui && !fim ? ' nat-coluna--atual' : '')}
                  onDragOver={(ev) => { ev.preventDefault(); if (alvoArraste !== i) setAlvoArraste(i); }}
                  onDragLeave={() => setAlvoArraste((a) => (a === i ? null : a))}
                  onDrop={(ev) => soltar(ev, i)}>
                  <div className="nat-coluna-cab">
                    <span className="nat-coluna-nome">{e.nome}</span>
                    <span className="nat-coluna-qtd">{plural(aqui ? 1 : 0)}</span>
                  </div>
                  <div className="nat-coluna-corpo">
                    {aqui && (
                      <motion.div layoutId="nat-card" className="nat-card-mov"
                        transition={reduzir ? { duration: 0 } : { type: 'spring', stiffness: 380, damping: 32 }}>
                      {/* O arraste é o nativo do navegador (HTML5), num div comum: o motion.div tem o próprio onDragStart. */}
                      <div draggable={!fim} onDragStart={(ev) => ev.dataTransfer.setData('text/plain', 'card')}
                        role="button" tabIndex={0} data-onboarding="card"
                        onClick={() => !fim && irPara(indice, { card: true })}
                        onKeyDown={(ev) => { if (!fim && (ev.key === 'Enter' || ev.key === ' ')) { ev.preventDefault(); irPara(indice, { card: true }); } }}
                        className={'nat-card' + (fim ? ' nat-card--' + fim : '')}>
                        <span className="nat-card-linha">
                          <span className="nat-card-titulo">{tituloCard}</span>
                          <CalendarDays size={15} className="nat-card-agenda" />
                        </span>
                        <span className="nat-card-cliente">{tituloCard}</span>
                        <span className="nat-card-rodape">
                          <UserCircle2 size={18} className="nat-card-avatar" />
                          <span className="nat-card-dias">{fim === 'ganho' ? 'ganho' : fim === 'perda' ? 'perdido' : '0d'}</span>
                        </span>
                        {!fim && <span className="nat-card-barra" />}
                      </div>
                      </motion.div>
                    )}
                    {aqui && !fim && <span className="nat-dica">clique no card para abrir</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {!aberto && aviso && <div className="nat-aviso" role="status"><Lock size={15} /> <span>{aviso}</span><button className="aviso-fechar" onClick={() => setAviso(null)} aria-label="Fechar o aviso"><X size={14} /></button></div>}

      {fim && (
        <section className={'sim-fim sim-fim--' + fim}>
          {fim === 'ganho' ? <Trophy size={22} /> : <ThumbsDown size={22} />}
          <div>
            <h2>{fim === 'ganho' ? 'Card ganho: o funil terminou aqui.' : 'Card perdido.'}</h2>
            {(() => {
              const lista = saidasDoFunil.filter((t) => t.quando === fim);
              return lista.length ? (
                <>
                  <p>O Ploomes abre automaticamente:</p>
                  <div className="sim-pontes">{lista.map((t) => <BotaoFunil key={t.id} t={t} texto="para" abrirCard />)}</div>
                </>
              ) : <p>Nenhum outro funil é aberto automaticamente {fim === 'ganho' ? 'no ganho' : 'na perda'}.</p>;
            })()}
            {funil.aoFinal.some((a) => a.quando === fim) && (
              <>
                <p>O Ploomes também faz sozinho:</p>
                <ul className="sim-final">{funil.aoFinal.filter((a) => a.quando === fim).map((a) => <li key={a.nome}><Bot size={13} /> {semPrefixo(a.nome)}</li>)}</ul>
              </>
            )}
            <div className="sim-acoes">
              <button className="sim-botao" onClick={() => { setValores({}); setCasos({}); setVistos({}); setPreenchidas({}); irPara(0); }}><Flag size={15} /> Simular de novo</button>
              <button className="sim-botao sim-botao--principal" onClick={() => navigate(rotaDoMapa)}>Voltar ao mapa</button>
            </div>
          </div>
        </section>
      )}

      {passo && <Dica passo={passo} aoFechar={() => setDicas(false)} reduzir={!!reduzir} />}
    </main>
  );
}

/* ---------- a dica com holofote (a mesma do tour do kit, refinada para o simulador de funis) ---------- */

interface Passo {
  /** Muda quando a dica muda: reposiciona e reanima. */
  chave: string;
  /** O data-onboarding do que a dica aponta. */
  alvo: string;
  selo: string;
  titulo: string;
  quem?: string;
  texto: ReactNode;
  /** Botão que fecha esta dica (dicas de leitura). */
  botao?: string;
  aoBotao?: () => void;
  /** A dica some sozinha quando o usuário faz o que ela pede. */
  acao?: boolean;
  extra?: string;
  aoExtra?: () => void;
}
type Caixa = { top: number; left: number; width: number; height: number };
const FOLGA = 6;

/**
 * O holofote escurece a tela em volta do alvo e o balão explica. Tudo deixa o clique passar
 * (pointer-events: none), menos o balão: o usuário faz o que a dica pede no próprio card.
 * Sem alvo na tela, o balão fica no rodapé, sem holofote. Esc esconde as dicas.
 */
function Dica({ passo, aoFechar, reduzir }: { passo: Passo; aoFechar: () => void; reduzir: boolean }) {
  const [caixa, setCaixa] = useState<Caixa | null>(null);
  /* Até a primeira medida o balão não aparece: senão ele nasce no rodapé e voa até o alvo. */
  const [medido, setMedido] = useState(false);
  const [tela, setTela] = useState({ w: window.innerWidth, h: window.innerHeight });
  const balao = useRef<HTMLDivElement | null>(null);
  const [alturaBalao, setAlturaBalao] = useState(180);

  useEffect(() => {
    let vivo = true;
    const medir = (rolar: boolean) => {
      if (!vivo) return;
      /* medir sem mudança não pode re-renderizar nada (senão a tela treme no notebook) */
      setTela((t) => (t.w === window.innerWidth && t.h === window.innerHeight ? t : { w: window.innerWidth, h: window.innerHeight }));
      const el = document.querySelector<HTMLElement>(`[data-onboarding="${passo.alvo}"]`);
      if (!el) { setCaixa(null); setMedido(true); return; }
      let r = el.getBoundingClientRect();
      if (rolar && (r.top < 0 || r.top > window.innerHeight - 80)) {
        el.scrollIntoView({ block: 'center', behavior: reduzir ? 'auto' : 'smooth' });
        window.setTimeout(() => medir(false), 380);
        return;
      }
      r = el.getBoundingClientRect();
      const nova = { top: r.top - FOLGA, left: r.left - FOLGA, width: r.width + FOLGA * 2, height: r.height + FOLGA * 2 };
      setMedido(true);
      setCaixa((c) => (c && Math.abs(c.top - nova.top) + Math.abs(c.left - nova.left) + Math.abs(c.width - nova.width) + Math.abs(c.height - nova.height) < 1 ? c : nova));
    };
    const t = window.setTimeout(() => medir(true), 60);
    /* O card chega animado e o checklist cresce ao preencher: mede quando a página ou o alvo mudam de tamanho, e duas
       vezes depois da animação de entrada. Um relógio de 300 ms que remedisse sem parar fazia a tela tremer num
       monitor de 14". */
    const depois = [450, 900].map((ms) => window.setTimeout(() => medir(false), ms));
    const sempre = () => medir(false);
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(sempre) : null;
    const alvo = document.querySelector<HTMLElement>(`[data-onboarding="${passo.alvo}"]`);
    if (ro) { ro.observe(document.body); if (alvo) ro.observe(alvo); }
    window.addEventListener('resize', sempre);
    window.addEventListener('scroll', sempre, true);
    return () => {
      vivo = false;
      window.clearTimeout(t);
      depois.forEach((x) => window.clearTimeout(x));
      ro?.disconnect();
      window.removeEventListener('resize', sempre);
      window.removeEventListener('scroll', sempre, true);
    };
  }, [passo.chave, passo.alvo, reduzir]);

  useLayoutEffect(() => {
    if (balao.current) setAlturaBalao(balao.current.offsetHeight);
  }, [passo.chave, caixa]);

  useEffect(() => {
    const tecla = (e: KeyboardEvent) => { if (e.key === 'Escape') aoFechar(); };
    document.addEventListener('keydown', tecla);
    return () => document.removeEventListener('keydown', tecla);
  }, [aoFechar]);

  /* Alvo alto (a coluna do checklist): balão ao lado. Senão, embaixo; sem espaço, em cima; senão, no rodapé. */
  const largura = Math.min(360, tela.w - 32);
  const pos = (() => {
    if (!caixa) return { top: tela.h - alturaBalao - 24, left: Math.max(16, (tela.w - largura) / 2) };
    const alto = caixa.height > tela.h * 0.45;
    if (alto && caixa.left + caixa.width + 16 + largura < tela.w - 16) {
      return { top: Math.min(Math.max(16, caixa.top + 24), tela.h - alturaBalao - 16), left: caixa.left + caixa.width + 16 };
    }
    const left = Math.min(Math.max(16, caixa.left), tela.w - largura - 16);
    const embaixo = caixa.top + caixa.height + 12;
    if (embaixo + alturaBalao < tela.h - 8) return { top: embaixo, left };
    const emcima = caixa.top - alturaBalao - 12;
    if (emcima > 8) return { top: emcima, left };
    return { top: Math.max(16, tela.h - alturaBalao - 24), left };
  })();
  const mola = reduzir ? { duration: 0 } : { type: 'spring' as const, visualDuration: 0.4, bounce: 0.1 };

  if (!medido) return null;
  return (
    <div className="dica" aria-live="polite">
      {caixa && (
        <motion.div className={'dica-holofote' + (passo.acao ? ' dica-holofote--acao' : '')}
          initial={false} animate={{ top: caixa.top, left: caixa.left, width: caixa.width, height: caixa.height }} transition={mola} />
      )}
      <motion.div ref={balao} className="dica-balao" role="dialog" aria-label={'Dica: ' + passo.titulo} style={{ width: largura }}
        initial={{ opacity: 0, top: pos.top, left: pos.left }} animate={{ opacity: 1, top: pos.top, left: pos.left }} transition={mola}>
        <motion.div key={passo.chave} className="dica-conteudo" initial={reduzir ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.18 }}>
          <div className="dica-topo">
            <span className="dica-selo">{passo.selo}</span>
            <button className="dica-fechar" aria-label="Esconder as dicas" title="Esconder as dicas (Esc)" onClick={aoFechar}><X size={14} /></button>
          </div>
          <h3>{passo.titulo}</h3>
          {passo.quem && <span className="sim-quem">{passo.quem}</span>}
          <div className="dica-texto">{passo.texto}</div>
        </motion.div>
        {(passo.botao || passo.extra) && (
          <div className="dica-rodape">
            {passo.extra && <button className="onb-link" onClick={passo.aoExtra}>{passo.extra}</button>}
            <span className="dica-espaco" />
            {passo.botao && <button className="dica-botao" autoFocus onClick={passo.aoBotao}>{passo.botao}</button>}
          </div>
        )}
      </motion.div>
    </div>
  );
}
