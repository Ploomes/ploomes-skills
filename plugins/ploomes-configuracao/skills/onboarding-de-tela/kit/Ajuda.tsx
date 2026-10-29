// Kit de onboarding — NÃO EDITE nesta tela (cópia de kit/ da skill onboarding-de-tela).
// <BotaoDeAjuda/>: o "?" do cabeçalho, com o menu Fazer o tour / Tour desta parte / O que há de novo /
// Primeiros passos / Rever a apresentação.
// <Dica id="..."/>: o "?" pequeno ao lado de um rótulo, que abre a explicação do roteiro.dicas[id].
// Com o onboarding desligado (ativo={false} no provider), os dois não desenham nada.
import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import { useLocation } from 'react-router';
import { useOnboarding } from './OnboardingProvider';
import { Icone } from './Icone';

function useFecharFora(aberto: boolean, fechar: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!aberto) return;
    const fora = (e: PointerEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) fechar(); };
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') fechar(); };
    document.addEventListener('pointerdown', fora);
    document.addEventListener('keydown', esc);
    return () => { document.removeEventListener('pointerdown', fora); document.removeEventListener('keydown', esc); };
  }, [aberto, fechar]);
  return ref;
}

export function BotaoDeAjuda(p: { rotulo?: string }) {
  const o = useOnboarding();
  const location = useLocation();
  const [aberto, setAberto] = useState(false);
  const ref = useFecharFora(aberto, () => setAberto(false));
  const id = useId();
  if (!o.ativo) return null;
  // A parte em que a pessoa está: a dos passos desta rota. Só vira opção se for menor que o tour inteiro.
  const parte = o.roteiro.tour.find((x) => x.parte && x.rota === location.pathname)?.parte;
  const passosDaParte = parte ? o.roteiro.tour.filter((x) => x.parte === parte).length : 0;
  const nomeDaParte = parte ? (o.roteiro.partes?.[parte] ?? parte) : '';
  return (
    <div className="ob-ajuda" ref={ref} data-onboarding="ajuda">
      <motion.button type="button" className="ob-botao-ajuda" aria-haspopup="menu" aria-expanded={aberto} aria-controls={id}
        onClick={() => setAberto((x) => !x)} whileTap={{ scale: 0.94 }} title="Ajuda">
        <Icone nome="ajuda" tamanho={18} /> {p.rotulo ?? 'Ajuda'}
      </motion.button>
      <AnimatePresence>
        {aberto && (
          <motion.div id={id} role="menu" className="ob-menu" initial={{ opacity: 0, y: -6, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }} style={{ transformOrigin: 'top right' }}>
            {o.roteiro.tour.length > 0 && <button role="menuitem" type="button" onClick={() => { setAberto(false); o.iniciarTour(); }}>Fazer o tour</button>}
            {parte && passosDaParte > 0 && passosDaParte < o.roteiro.tour.length && (
              <button role="menuitem" type="button" onClick={() => { setAberto(false); o.iniciarTourDaParte(parte); }}>Tour só desta parte ({nomeDaParte})</button>
            )}
            {o.novosNestaVersao.length > 0 && <button role="menuitem" type="button" onClick={() => { setAberto(false); o.verNovidades(); }}>O que há de novo</button>}
            {o.roteiro.primeirosPassos.length > 0 && <button role="menuitem" type="button" onClick={() => { setAberto(false); o.abrirPainel(true); }}>Primeiros passos</button>}
            {o.roteiro.boasVindas.length > 0 && <button role="menuitem" type="button" onClick={() => { setAberto(false); o.reverBoasVindas(); }}>Rever a apresentação</button>}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Dica(p: { id: string }) {
  const o = useOnboarding();
  const d = o.roteiro.dicas[p.id];
  // passar o mouse mostra; clicar fixa (e clicar de novo solta). Separados para o clique não desfazer o hover.
  const [sobre, setSobre] = useState(false);
  const [fixa, setFixa] = useState(false);
  const [pos, setPos] = useState<{ left: number; top: number; acima: boolean } | null>(null);
  const botao = useRef<HTMLButtonElement>(null);
  const idBalao = useId();
  const aberta = sobre || fixa;

  useLayoutEffect(() => {
    if (!aberta || !botao.current) return;
    const medir = () => {
      const r = botao.current!.getBoundingClientRect();
      const acima = r.top > 140;
      setPos({ left: Math.max(140, Math.min(r.left + r.width / 2, window.innerWidth - 140)), top: acima ? r.top - 8 : r.bottom + 8, acima });
    };
    medir();
    window.addEventListener('scroll', medir, true);
    window.addEventListener('resize', medir);
    return () => { window.removeEventListener('scroll', medir, true); window.removeEventListener('resize', medir); };
  }, [aberta]);

  useEffect(() => {
    if (!aberta) return;
    const fora = (e: PointerEvent) => { if (!botao.current?.contains(e.target as Node)) setFixa(false); };
    // Esc fecha só a dica, não a gaveta ou o modal em que ela está
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') { e.stopPropagation(); setFixa(false); setSobre(false); } };
    document.addEventListener('pointerdown', fora);
    window.addEventListener('keydown', esc, true);
    return () => { document.removeEventListener('pointerdown', fora); window.removeEventListener('keydown', esc, true); };
  }, [aberta]);

  if (!d || !o.ativo) return null;
  return (
    <span className="ob-dica">
      <button ref={botao} type="button" className="ob-dica-botao" aria-label={`Ajuda: ${d.titulo}`} aria-expanded={aberta}
        aria-describedby={aberta ? idBalao : undefined}
        onClick={(e) => { e.stopPropagation(); setFixa((x) => !x); }} onMouseEnter={() => setSobre(true)} onMouseLeave={() => setSobre(false)}
        onFocus={() => setSobre(true)} onBlur={() => setSobre(false)}>?</button>
      {createPortal(
        <AnimatePresence>
          {aberta && pos && (
            <motion.span id={idBalao} role="tooltip" className={`ob-dica-balao ${pos.acima ? 'ob-dica-acima' : ''}`}
              style={{ left: pos.left, top: pos.top }} initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.14 }}>
              <strong>{d.titulo}</strong>
              <span>{d.texto}</span>
            </motion.span>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </span>
  );
}
