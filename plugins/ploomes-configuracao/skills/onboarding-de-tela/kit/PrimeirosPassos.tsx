// Kit de onboarding — NÃO EDITE nesta tela (cópia de kit/ da skill onboarding-de-tela).
// Primeiros passos: um botão flutuante com o progresso e um painel com as tarefas reais da tela.
// A tela marca cada uma com marcar(id) quando a pessoa faz. Itens entram em cascata (stagger);
// a tarefa feita ganha o check com mola; ao terminar tudo, uma comemoração curta.
import { useEffect, useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import { useLocation, useNavigate } from 'react-router';
import { useOnboarding } from './OnboardingProvider';
import { Icone } from './Icone';
import { achar, esperarAlvo } from './Tour';

export function PrimeirosPassos() {
  const o = useOnboarding();
  const navigate = useNavigate();
  const location = useLocation();
  const tarefas = o.roteiro.primeirosPassos;
  const feitas = tarefas.filter((t) => o.progresso.feitas.includes(t.id)).length;
  const tudo = tarefas.length > 0 && feitas === tarefas.length;
  const [comemorou, setComemorou] = useState(false);

  useEffect(() => {
    if (tudo && !comemorou) { setComemorou(true); o.abrirPainel(true); }
  }, [tudo, comemorou, o]);

  // Só aparece depois que a pessoa viu (ou dispensou) as boas-vindas, e fora do tour.
  if (!tarefas.length || !o.progresso.viuBoasVindas || o.estado !== 'parado') return <Realce />;

  const irPara = async (t: (typeof tarefas)[number]) => {
    if (t.rota && location.pathname !== t.rota) navigate(t.rota + location.search);
    o.abrirPainel(false);
    if (t.alvo) {
      const el = await esperarAlvo(t.alvo);
      el?.scrollIntoView({ block: 'center', inline: 'center', behavior: 'smooth' });
      o.realcar(t.alvo);
    }
  };

  const fracao = tarefas.length ? feitas / tarefas.length : 0;
  return createPortal(
    <>
      <Realce />
      <motion.button type="button" className="ob-lancador" onClick={() => o.abrirPainel(!o.painelAberto)}
        aria-expanded={o.painelAberto} aria-controls="ob-painel" initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
        <svg width={28} height={28} viewBox="0 0 36 36" aria-hidden="true" className="ob-anel">
          <circle cx={18} cy={18} r={15} className="ob-anel-fundo" />
          <motion.circle cx={18} cy={18} r={15} className="ob-anel-frente" pathLength={1}
            initial={false} animate={{ pathLength: fracao }} style={{ rotate: -90, transformOrigin: '50% 50%' }} />
        </svg>
        <span>{tudo ? 'Tudo pronto' : 'Primeiros passos'}</span>
        <span className="ob-lancador-conta">{feitas}/{tarefas.length}</span>
      </motion.button>
      <AnimatePresence>
        {o.painelAberto && (
          <motion.aside id="ob-painel" className="ob-painel" role="dialog" aria-label="Primeiros passos"
            initial={{ opacity: 0, y: 16, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: 0.98 }}>
            <header className="ob-painel-topo">
              <div>
                <p className="ob-sobretitulo">{o.roteiro.nome}</p>
                <h3>{tudo ? 'Você já sabe usar a tela' : 'Primeiros passos'}</h3>
              </div>
              <button type="button" className="ob-fechar" onClick={() => o.abrirPainel(false)} aria-label="Fechar"><Icone nome="fechar" tamanho={16} /></button>
            </header>
            {tudo && <Comemoracao />}
            <motion.ul className="ob-lista" initial="fora" animate="dentro"
              variants={{ dentro: { transition: { staggerChildren: 0.05 } }, fora: {} }}>
              {tarefas.map((t) => {
                const feita = o.progresso.feitas.includes(t.id);
                return (
                  <motion.li key={t.id} variants={{ fora: { opacity: 0, x: -8 }, dentro: { opacity: 1, x: 0 } }}>
                    <button type="button" className={'ob-tarefa' + (feita ? ' ob-tarefa-feita' : '')} onClick={() => irPara(t)}>
                      <span className="ob-caixinha" aria-hidden="true">
                        <AnimatePresence>{feita && (
                          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 18 }}><Icone nome="check" tamanho={14} /></motion.span>
                        )}</AnimatePresence>
                      </span>
                      <span className="ob-tarefa-texto">
                        <strong>{t.titulo}</strong>
                        {t.texto && <small>{t.texto}</small>}
                      </span>
                      {!feita && <Icone nome="seta" tamanho={16} className="ob-tarefa-seta" />}
                      <span className="ob-oculto">{feita ? ' (feito)' : ''}</span>
                    </button>
                  </motion.li>
                );
              })}
            </motion.ul>
            <footer className="ob-painel-rodape">
              {o.roteiro.tour.length > 0 && <button type="button" className="ob-botao" onClick={() => o.iniciarTour()}>Fazer o tour</button>}
              {o.roteiro.boasVindas.length > 0 && <button type="button" className="ob-botao ob-botao-leve" onClick={o.reverBoasVindas}>Rever a apresentação</button>}
            </footer>
          </motion.aside>
        )}
      </AnimatePresence>
    </>,
    document.body,
  );
}

/** Anel que pulsa em volta do alvo por alguns segundos (depois de um clique nos primeiros passos). */
function Realce() {
  const o = useOnboarding();
  const [r, setR] = useState<DOMRect | null>(null);
  useLayoutEffect(() => {
    if (!o.realcado) { setR(null); return; }
    const medir = () => { const el = achar(o.realcado!); setR(el ? el.getBoundingClientRect() : null); };
    medir();
    window.addEventListener('scroll', medir, true);
    window.addEventListener('resize', medir);
    const t = window.setInterval(medir, 250);
    return () => { window.removeEventListener('scroll', medir, true); window.removeEventListener('resize', medir); window.clearInterval(t); };
  }, [o.realcado]);
  return createPortal(
    <AnimatePresence>
      {r && (
        <motion.div className="ob-realce" aria-hidden="true"
          style={{ left: r.left - 6, top: r.top - 6, width: r.width + 12, height: r.height + 12 }}
          initial={{ opacity: 0, scale: 1.08 }} animate={{ opacity: [0, 1, 0.6, 1], scale: [1.08, 1, 1.02, 1] }}
          exit={{ opacity: 0 }} transition={{ duration: 1.2 }} />
      )}
    </AnimatePresence>,
    document.body,
  );
}

/** Comemoração curta e discreta: pontos que saem do centro (sem biblioteca de confete). */
function Comemoracao() {
  const pontos = Array.from({ length: 14 }, (_, n) => {
    const a = (n / 14) * Math.PI * 2;
    return { x: Math.cos(a) * (60 + (n % 3) * 18), y: Math.sin(a) * (34 + (n % 4) * 8), d: (n % 5) * 0.03 };
  });
  return (
    <div className="ob-comemoracao" aria-hidden="true">
      {pontos.map((p, n) => (
        <motion.span key={n} className={'ob-confete ob-confete-' + (n % 3)} initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{ x: p.x, y: p.y, opacity: 0, scale: 0.6 }} transition={{ duration: 0.9, delay: p.d, ease: 'easeOut' }} />
      ))}
      <motion.span className="ob-comemoracao-check" initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 320, damping: 14 }}><Icone nome="check" tamanho={22} /></motion.span>
    </div>
  );
}
