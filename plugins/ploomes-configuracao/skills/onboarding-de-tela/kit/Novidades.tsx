// Kit de onboarding — NÃO EDITE nesta tela (cópia de kit/ da skill onboarding-de-tela).
// "O que há de novo": quem já viu uma versão anterior do roteiro não revê a apresentação inteira;
// vê só os passos que entraram ou mudaram (os de `desde` maior que a última versão vista) e pode
// fazer o tour só deles.
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'motion/react';
import { useViewportOverlay } from '../../lib';
import { useOnboarding } from './OnboardingProvider';
import { Icone } from './Icone';

export function Novidades() {
  const o = useOnboarding();
  const principal = useRef<HTMLButtonElement>(null);
  useViewportOverlay(true);
  useEffect(() => { principal.current?.focus(); }, []);
  useEffect(() => {
    const tecla = (e: KeyboardEvent) => { if (e.key === 'Escape') o.fechar(); };
    window.addEventListener('keydown', tecla);
    return () => window.removeEventListener('keydown', tecla);
  }, [o]);

  const nota = o.roteiro.notasDaVersao?.[o.roteiro.versao];
  return createPortal(
    <motion.div className="ob-camada" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="ob-veu" onClick={o.fechar} aria-hidden="true" />
      <motion.section className="ob-boas-vindas" role="dialog" aria-modal="true" aria-labelledby="ob-nov-titulo"
        initial={{ y: 24, scale: 0.96, opacity: 0 }} animate={{ y: 0, scale: 1, opacity: 1 }}>
        <button type="button" className="ob-fechar" onClick={o.fechar} aria-label="Fechar as novidades"><Icone nome="fechar" tamanho={16} /></button>
        <p className="ob-sobretitulo">{o.roteiro.nome}</p>
        <div className="ob-cartao">
          <div className="ob-icone"><Icone nome="alvo" tamanho={28} /></div>
          <h2 id="ob-nov-titulo">O que há de novo</h2>
          {nota && <p>{nota}</p>}
          <motion.ul className="ob-novidades" initial="fora" animate="dentro"
            variants={{ dentro: { transition: { staggerChildren: 0.05 } } }}>
            {o.novidades.map((x) => (
              <motion.li key={x.id} variants={{ fora: { opacity: 0, y: 6 }, dentro: { opacity: 1, y: 0 } }}>
                <Icone nome="check" tamanho={16} /> <span><strong>{x.titulo}</strong> {x.texto}</span>
              </motion.li>
            ))}
          </motion.ul>
        </div>
        <div className="ob-acoes">
          <button type="button" className="ob-botao ob-botao-leve" onClick={o.fechar}>Agora não</button>
          <motion.button ref={principal} type="button" className="ob-botao ob-botao-principal" whileTap={{ scale: 0.97 }}
            onClick={o.verNovidades}>
            Ver o que mudou
          </motion.button>
        </div>
      </motion.section>
    </motion.div>,
    document.body,
  );
}
