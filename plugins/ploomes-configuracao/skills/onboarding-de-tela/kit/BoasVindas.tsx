// Kit de onboarding — NÃO EDITE nesta tela (cópia de kit/ da skill onboarding-de-tela).
// Boas-vindas: poucos cartões, um de cada vez. Transição com direção (o cartão sai para o lado
// contrário ao que se anda), indicador com layoutId e mola — como o Motion recomenda para
// sequência de estados: AnimatePresence com `custom` e mode="popLayout".
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import { useViewportOverlay } from '../../lib';
import { useOnboarding } from './OnboardingProvider';
import { Icone } from './Icone';

const variantes = {
  entra: (dir: number) => ({ x: dir * 48, opacity: 0 }),
  fica: { x: 0, opacity: 1 },
  sai: (dir: number) => ({ x: dir * -48, opacity: 0 }),
};

export function BoasVindas() {
  const o = useOnboarding();
  const cartoes = o.roteiro.boasVindas;
  const [[i, dir], setI] = useState<[number, number]>([0, 1]);
  const primeiro = useRef<HTMLButtonElement>(null);
  useViewportOverlay(true);

  const ir = (n: number) => setI(([atual]) => [Math.max(0, Math.min(cartoes.length - 1, n)), n > atual ? 1 : -1]);
  const ultimo = i === cartoes.length - 1;

  useEffect(() => { primeiro.current?.focus(); }, []);
  useEffect(() => {
    const tecla = (e: KeyboardEvent) => {
      if (e.key === 'Escape') o.fechar();
      else if (e.key === 'ArrowRight') ir(i + 1);
      else if (e.key === 'ArrowLeft') ir(i - 1);
    };
    window.addEventListener('keydown', tecla);
    return () => window.removeEventListener('keydown', tecla);
  });

  const c = cartoes[i];
  return createPortal(
    <motion.div className="ob-camada" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="ob-veu" onClick={o.fechar} aria-hidden="true" />
      <motion.section className="ob-boas-vindas" role="dialog" aria-modal="true" aria-labelledby="ob-bv-titulo"
        initial={{ y: 24, scale: 0.96, opacity: 0 }} animate={{ y: 0, scale: 1, opacity: 1 }}>
        <button type="button" className="ob-fechar" onClick={o.fechar} aria-label="Fechar as boas-vindas"><Icone nome="fechar" tamanho={16} /></button>
        <p className="ob-sobretitulo">{o.roteiro.nome}</p>
        <div className="ob-palco">
          <AnimatePresence mode="popLayout" custom={dir} initial={false}>
            <motion.div key={i} className="ob-cartao" custom={dir} variants={variantes} initial="entra" animate="fica" exit="sai">
              <motion.div className="ob-icone" initial={{ scale: 0.6, rotate: -8 }} animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 16, delay: 0.05 }}>
                <Icone nome={c.icone ?? 'alvo'} tamanho={28} />
              </motion.div>
              <h2 id="ob-bv-titulo">{c.titulo}</h2>
              <p>{c.texto}</p>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="ob-pontos" role="tablist" aria-label="Cartões">
          {cartoes.map((x, n) => (
            <button key={n} type="button" role="tab" aria-selected={n === i} aria-label={`Cartão ${n + 1}: ${x.titulo}`}
              className="ob-ponto" onClick={() => ir(n)}>
              {n === i && <motion.span layoutId="ob-ponto-ativo" className="ob-ponto-ativo" />}
            </button>
          ))}
        </div>
        <div className="ob-acoes">
          <button type="button" className="ob-botao ob-botao-leve" onClick={o.fechar}>Agora não</button>
          <div className="ob-acoes-direita">
            {i > 0 && <button type="button" className="ob-botao" onClick={() => ir(i - 1)}>Voltar</button>}
            {ultimo
              ? <motion.button ref={primeiro} type="button" className="ob-botao ob-botao-principal" whileTap={{ scale: 0.97 }}
                  onClick={() => (o.roteiro.tour.length ? o.iniciarTour() : o.fechar())}>
                  {o.roteiro.tour.length ? 'Fazer o tour' : 'Começar'}
                </motion.button>
              : <motion.button ref={primeiro} type="button" className="ob-botao ob-botao-principal" whileTap={{ scale: 0.97 }} onClick={() => ir(i + 1)}>
                  Próximo
                </motion.button>}
          </div>
        </div>
      </motion.section>
    </motion.div>,
    document.body,
  );
}
