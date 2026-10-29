// Kit de onboarding — NÃO EDITE nesta tela (cópia de kit/ da skill onboarding-de-tela).
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { MotionConfig } from 'motion/react';
import type { PassoDoTour, Progresso, Roteiro } from './tipos';
import { BoasVindas } from './BoasVindas';
import { Novidades } from './Novidades';
import { Tour } from './Tour';
import { PrimeirosPassos } from './PrimeirosPassos';
import './onboarding.css';

type Estado = 'parado' | 'boas-vindas' | 'novidades' | 'tour';
/** Como o tour terminou: a tela pode gravar a conclusão (no perfil do usuário, por exemplo). */
export type FimDoTour = { tipo: 'completo' | 'parte' | 'novidades'; concluiu: boolean };

export type Onboarding = {
  /** O roteiro já filtrado pelo perfil de quem usa. */
  roteiro: Roteiro;
  estado: Estado;
  progresso: Progresso;
  perfil: string | null;
  /** Desligado (`ativo={false}` no provider): nada do kit aparece, e `marcar` só guarda. */
  ativo: boolean;
  /** Abre as boas-vindas (o "Rever a apresentação" do menu de ajuda). */
  reverBoasVindas: () => void;
  /** Começa o tour do primeiro passo (ou de um passo pelo id). */
  iniciarTour: (passoId?: string) => void;
  /** Tour só dos passos de uma parte da tela (uma aba, uma seção). */
  iniciarTourDaParte: (parte: string) => void;
  /** Os passos que entraram ou mudaram depois da última versão que a pessoa viu. */
  novidades: PassoDoTour[];
  /** Os passos marcados com `desde` igual à versão atual — o "O que há de novo" do menu. */
  novosNestaVersao: PassoDoTour[];
  verNovidades: () => void;
  fechar: () => void;
  /** A tela chama quando a pessoa faz uma tarefa dos primeiros passos. */
  marcar: (tarefaId: string) => void;
  /** Painel dos primeiros passos aberto? */
  painelAberto: boolean;
  abrirPainel: (aberto: boolean) => void;
  /** Realça um alvo por alguns segundos (usado pelos primeiros passos). */
  realcar: (alvo: string) => void;
  realcado: string | null;
};

const Contexto = createContext<Onboarding | null>(null);

const VAZIO: Progresso = { viuBoasVindas: false, terminouTour: false, feitas: [] };

function normalizar(v: Record<string, unknown>, versao?: string): Progresso {
  return {
    viuBoasVindas: !!v.viuBoasVindas,
    terminouTour: !!v.terminouTour,
    feitas: Array.isArray(v.feitas) ? v.feitas.filter((x: unknown): x is string => typeof x === 'string') : [],
    versaoVista: typeof v.versaoVista === 'string' ? v.versaoVista : versao,
  };
}

/** O progresso da pessoa. A versão anterior do kit guardava uma chave por versão
 *  (`onboarding:<tela>:<usuário>:<versão>`): achando uma dessas, ela vale, e a versão vista é a do fim da chave. */
function ler(chave: string): Progresso {
  try {
    const t = window.localStorage.getItem(chave);
    if (t) return normalizar(JSON.parse(t));
    let antiga: Progresso | null = null;
    for (let n = 0; n < window.localStorage.length; n++) {
      const k = window.localStorage.key(n);
      if (!k || !k.startsWith(chave + ':')) continue;
      const v = window.localStorage.getItem(k);
      const versao = k.slice(chave.length + 1);
      if (v && (!antiga || Number(versao) > Number(antiga.versaoVista))) antiga = normalizar(JSON.parse(v), versao);
    }
    return antiga ?? VAZIO;
  } catch {
    return VAZIO;
  }
}

function gravar(chave: string, p: Progresso): void {
  try { window.localStorage.setItem(chave, JSON.stringify(p)); } catch { /* navegador sem armazenamento: o onboarding só não lembra */ }
}

const doPerfil = <T extends { perfis?: string[] }>(lista: T[], perfil: string | null): T[] =>
  lista.filter((x) => !x.perfis || !x.perfis.length || (perfil !== null && x.perfis.includes(perfil)));

/** Versão como número quando dá ("2" > "10" erraria como texto). */
const depois = (a: string | undefined, b: string | undefined): boolean => {
  if (a === undefined) return false;
  if (b === undefined) return true;
  const na = Number(a), nb = Number(b);
  return Number.isFinite(na) && Number.isFinite(nb) ? na > nb : a > b;
};

/**
 * Envolve a tela. `pronto` = os dados já carregaram (a conexão está 'pronta' e a primeira vista
 * apareceu): as boas-vindas só abrem depois disso, para não cobrir um carregando.
 * `perfil`: o perfil de quem usa, quando o roteiro tem itens por perfil. `ativo={false}` desliga o
 * onboarding inteiro (a tela segue igual). `aoConcluirTour`: a tela grava a conclusão onde quiser.
 */
export function OnboardingProvider(p: {
  roteiro: Roteiro;
  usuarioId: number;
  pronto: boolean;
  children: ReactNode;
  perfil?: string | null;
  ativo?: boolean;
  aoConcluirTour?: (fim: FimDoTour) => void;
}) {
  const perfil = p.perfil ?? null;
  const ativo = p.ativo !== false;
  const chave = `onboarding:${p.roteiro.tela}:${p.usuarioId}`;
  const [progresso, setProgresso] = useState<Progresso>(() => ler(chave));
  const [estado, setEstado] = useState<Estado>('parado');
  const [passosDoTour, setPassosDoTour] = useState<{ passos: PassoDoTour[]; inicial?: string; tipo: FimDoTour['tipo'] } | null>(null);
  const [painelAberto, abrirPainel] = useState(false);
  const [realcado, setRealcado] = useState<string | null>(null);
  const tempoDoRealce = useRef<number | undefined>(undefined);
  const aoConcluir = useRef(p.aoConcluirTour);
  aoConcluir.current = p.aoConcluirTour;

  useEffect(() => { setProgresso(ler(chave)); }, [chave]);

  const roteiro = useMemo<Roteiro>(() => ({
    ...p.roteiro,
    boasVindas: doPerfil(p.roteiro.boasVindas, perfil),
    tour: doPerfil(p.roteiro.tour, perfil),
    primeirosPassos: doPerfil(p.roteiro.primeirosPassos, perfil),
  }), [p.roteiro, perfil]);

  const novidades = useMemo(
    () => (progresso.viuBoasVindas ? roteiro.tour.filter((x) => depois(x.desde, progresso.versaoVista)) : []),
    [roteiro.tour, progresso.viuBoasVindas, progresso.versaoVista],
  );
  const novosNestaVersao = useMemo(() => roteiro.tour.filter((x) => x.desde === roteiro.versao), [roteiro.tour, roteiro.versao]);

  const atualizar = useCallback((f: (x: Progresso) => Progresso) => {
    setProgresso((atual) => { const novo = f(atual); gravar(chave, novo); return novo; });
  }, [chave]);
  const viuEstaVersao = useCallback(
    () => atualizar((x) => ({ ...x, viuBoasVindas: true, versaoVista: roteiro.versao })),
    [atualizar, roteiro.versao],
  );

  // Primeira visita: as boas-vindas. Quem já viu uma versão anterior: só o que há de novo.
  useEffect(() => {
    if (!ativo || !p.pronto || estado !== 'parado') return;
    if (!progresso.viuBoasVindas && roteiro.boasVindas.length) {
      const t = window.setTimeout(() => setEstado('boas-vindas'), 600);
      return () => window.clearTimeout(t);
    }
    if (progresso.viuBoasVindas && progresso.versaoVista !== roteiro.versao) {
      if (novidades.length) {
        const t = window.setTimeout(() => setEstado('novidades'), 600);
        return () => window.clearTimeout(t);
      }
      viuEstaVersao(); // a versão subiu sem passo novo para mostrar: só registra
    }
  }, [ativo, p.pronto, estado, progresso.viuBoasVindas, progresso.versaoVista, roteiro.boasVindas.length, roteiro.versao, novidades.length, viuEstaVersao]);

  const fechar = useCallback(() => {
    setEstado((e) => {
      if (e === 'boas-vindas' || e === 'novidades') viuEstaVersao();
      return 'parado';
    });
  }, [viuEstaVersao]);

  const comecar = useCallback((passos: PassoDoTour[], tipo: FimDoTour['tipo'], inicial?: string) => {
    if (!passos.length) return;
    viuEstaVersao();
    abrirPainel(false);
    setPassosDoTour({ passos, inicial, tipo });
    setEstado('tour');
  }, [viuEstaVersao]);

  const iniciarTour = useCallback((passoId?: string) => comecar(roteiro.tour, 'completo', passoId), [comecar, roteiro.tour]);
  const iniciarTourDaParte = useCallback(
    (parte: string) => comecar(roteiro.tour.filter((x) => x.parte === parte), 'parte'),
    [comecar, roteiro.tour],
  );
  const verNovidades = useCallback(
    () => comecar(novidades.length ? novidades : novosNestaVersao, 'novidades'),
    [comecar, novidades, novosNestaVersao],
  );

  const terminarTour = useCallback((concluiu: boolean) => {
    const tipo = passosDoTour?.tipo ?? 'completo';
    if (tipo === 'completo' && concluiu) atualizar((x) => ({ ...x, terminouTour: true }));
    setEstado('parado');
    setPassosDoTour(null);
    try { aoConcluir.current?.({ tipo, concluiu }); } catch { /* gravar a conclusão é conveniência da tela */ }
  }, [atualizar, passosDoTour]);

  const marcar = useCallback((tarefaId: string) => {
    atualizar((x) => (x.feitas.includes(tarefaId) ? x : { ...x, feitas: [...x.feitas, tarefaId] }));
  }, [atualizar]);

  const realcar = useCallback((alvo: string) => {
    setRealcado(alvo);
    window.clearTimeout(tempoDoRealce.current);
    tempoDoRealce.current = window.setTimeout(() => setRealcado(null), 2600);
  }, []);

  const valor = useMemo<Onboarding>(() => ({
    roteiro, estado, progresso, perfil, ativo, fechar, marcar, iniciarTour, iniciarTourDaParte, novidades, novosNestaVersao,
    verNovidades, painelAberto, abrirPainel, realcar, realcado,
    reverBoasVindas: () => { abrirPainel(false); setEstado('boas-vindas'); },
  }), [roteiro, estado, progresso, perfil, ativo, fechar, marcar, iniciarTour, iniciarTourDaParte, novidades, novosNestaVersao, verNovidades, painelAberto, realcar, realcado]);

  return (
    // reducedMotion="user": quem pediu menos movimento no sistema vê transições sem deslocamento.
    <MotionConfig reducedMotion="user" transition={{ type: 'spring', stiffness: 420, damping: 34, mass: 0.8 }}>
      <Contexto.Provider value={valor}>
        {p.children}
        {ativo && estado === 'boas-vindas' && <BoasVindas />}
        {ativo && estado === 'novidades' && <Novidades />}
        {ativo && estado === 'tour' && passosDoTour && (
          <Tour passos={passosDoTour.passos} passoInicial={passosDoTour.inicial} aoTerminar={terminarTour} />
        )}
        {ativo && <PrimeirosPassos />}
      </Contexto.Provider>
    </MotionConfig>
  );
}

export function useOnboarding(): Onboarding {
  const c = useContext(Contexto);
  if (!c) throw new Error('useOnboarding precisa estar dentro de <OnboardingProvider>.');
  return c;
}
