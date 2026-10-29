// Kit de onboarding — NÃO EDITE nesta tela (cópia de kit/ da skill onboarding-de-tela).
// Tour guiado: um holofote sobre o elemento real (data-onboarding="<alvo>") que desliza de um
// passo para o outro com mola, e um cartão ao lado. Dentro do recorte a pessoa pode clicar
// (o "experimente"); fora, quatro faixas seguram o clique. Navega até a rota do passo e espera o
// alvo aparecer; no fim, devolve a pessoa à rota de onde ela começou. Teclado: → próximo, ← voltar, Esc pula.
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import { useLocation, useNavigate } from 'react-router';
import { Icone } from './Icone';
import type { PassoDoTour } from './tipos';

type Caixa = { x: number; y: number; w: number; h: number };
const FOLGA = 8;
const LARGURA_DO_CARTAO = 340;

export function achar(alvo: string): HTMLElement | null {
  return document.querySelector<HTMLElement>(`[data-onboarding="${CSS.escape(alvo)}"]`);
}

/** Espera o alvo existir e ter tamanho (depois de navegar ou de um carregando). */
export function esperarAlvo(alvo: string, limiteMs = 2500): Promise<HTMLElement | null> {
  return new Promise((ok) => {
    const inicio = performance.now();
    const olhar = () => {
      const el = achar(alvo);
      if (el && el.getBoundingClientRect().width > 0) return ok(el);
      if (performance.now() - inicio > limiteMs) return ok(null);
      requestAnimationFrame(olhar);
    };
    olhar();
  });
}

function caixaDe(el: HTMLElement): Caixa {
  const r = el.getBoundingClientRect();
  return { x: r.left - FOLGA, y: r.top - FOLGA, w: r.width + FOLGA * 2, h: r.height + FOLGA * 2 };
}

function posicaoDoCartao(c: Caixa | null, lado: PassoDoTour['lado'], alturaDoCartao: number) {
  // a área visível sem a barra de rolagem: com innerWidth o cartão vazava na beira direita
  const W = document.documentElement.clientWidth || window.innerWidth, H = document.documentElement.clientHeight || window.innerHeight, m = 16;
  const w = Math.min(LARGURA_DO_CARTAO, W - m * 2);
  if (!c) return { left: (W - w) / 2, top: Math.max(m, (H - alturaDoCartao) / 2), w };
  const espaco = { baixo: H - (c.y + c.h), cima: c.y, direita: W - (c.x + c.w), esquerda: c.x };
  let l = lado && lado !== 'auto' ? lado : (['baixo', 'cima', 'direita', 'esquerda'] as const).find((s) =>
    (s === 'baixo' || s === 'cima') ? espaco[s] > alturaDoCartao + m * 2 : espaco[s] > w + m * 2) ?? 'baixo';
  if ((l === 'baixo' || l === 'cima') && espaco[l] < alturaDoCartao + m) l = espaco.baixo > espaco.cima ? 'baixo' : 'cima';
  let left = l === 'direita' ? c.x + c.w + m : l === 'esquerda' ? c.x - w - m : c.x + c.w / 2 - w / 2;
  let top = l === 'baixo' ? c.y + c.h + m : l === 'cima' ? c.y - alturaDoCartao - m : c.y + c.h / 2 - alturaDoCartao / 2;
  left = Math.max(m, Math.min(left, W - w - m));
  top = Math.max(m, Math.min(top, H - alturaDoCartao - m));
  return { left, top, w };
}

export function Tour(p: { passos: PassoDoTour[]; passoInicial?: string; aoTerminar: (concluiu: boolean) => void }) {
  const passos = p.passos;
  const navigate = useNavigate();
  const location = useLocation();
  // De onde a pessoa saiu: o tour troca de rota (de aba) para mostrar os passos, e no fim volta.
  const origem = useRef(location.pathname + location.search);
  const terminar = useCallback((concluiu: boolean) => {
    if (location.pathname + location.search !== origem.current) navigate(origem.current);
    p.aoTerminar(concluiu);
  }, [location.pathname, location.search, navigate, p]);
  const [i, setI] = useState(() => Math.max(0, passos.findIndex((x) => x.id === p.passoInicial)));
  const [caixa, setCaixa] = useState<Caixa | null>(null);
  const [procurando, setProcurando] = useState(true);
  const [alturaDoCartao, setAlturaDoCartao] = useState(200);
  const cartao = useRef<HTMLDivElement>(null);
  const elemento = useRef<HTMLElement | null>(null);
  /* O tour NÃO pede a camada de tela cheia da ponte (useViewportOverlay): com ela, a ponte congela a página (o #root
     fica fixo e o html perde a altura) e nada rola — e soltar a camada só descongela 1 s depois, ou nunca, quando a tela
     ocupa uma área do Ploomes. No Ploomes de verdade os passos com alvo abaixo da dobra ficavam no escuro; a bancada
     não imita o congelamento e não pegava. O véu cobre só a tela, e a página rola até o alvo. */

  const passo = passos[i];

  // Navega até a rota do passo, espera o alvo e mede.
  useEffect(() => {
    let vivo = true;
    setProcurando(true);
    elemento.current = null;
    if (passo?.rota && location.pathname !== passo.rota) navigate(passo.rota + location.search);
    if (!passo?.alvo) { setCaixa(null); setProcurando(false); return; }
    esperarAlvo(passo.alvo).then((el) => {
      if (!vivo) return;
      elemento.current = el;
      if (el) {
        el.scrollIntoView({ block: 'center', inline: 'center', behavior: 'auto' });
        // mede de novo depois que a página assenta na altura do alvo
        window.setTimeout(() => { if (vivo && elemento.current) setCaixa(caixaDe(elemento.current)); }, 120);
        setCaixa(caixaDe(el));
      } else setCaixa(null);
      setProcurando(false);
    });
    return () => { vivo = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i]);

  // Acompanha rolagem, redimensionamento e mudança de tamanho do alvo.
  useEffect(() => {
    const medir = () => { if (elemento.current) setCaixa(caixaDe(elemento.current)); };
    window.addEventListener('resize', medir);
    window.addEventListener('scroll', medir, true);
    const ro = typeof ResizeObserver !== 'undefined' && elemento.current ? new ResizeObserver(medir) : null;
    if (ro && elemento.current) ro.observe(elemento.current);
    return () => { window.removeEventListener('resize', medir); window.removeEventListener('scroll', medir, true); ro?.disconnect(); };
  }, [caixa === null, i]);

  useLayoutEffect(() => {
    if (cartao.current) setAlturaDoCartao(cartao.current.getBoundingClientRect().height);
  });
  useEffect(() => { cartao.current?.focus(); }, [i]);

  const ir = useCallback((n: number) => {
    if (n >= passos.length) return terminar(true);
    setI(Math.max(0, n));
  }, [passos.length, terminar]);

  useEffect(() => {
    const tecla = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); terminar(false); }
      else if (e.key === 'ArrowRight') ir(i + 1);
      else if (e.key === 'ArrowLeft') ir(i - 1);
    };
    window.addEventListener('keydown', tecla);
    return () => window.removeEventListener('keydown', tecla);
  }, [i, ir, terminar]);

  if (!passo) return null;
  const pos = posicaoDoCartao(caixa, passo.lado, alturaDoCartao);
  const W = window.innerWidth, H = window.innerHeight;
  const c = caixa ?? { x: W / 2, y: H / 2, w: 0, h: 0 };
  const faixas = caixa
    ? [{ left: 0, top: 0, width: W, height: Math.max(0, c.y) }, { left: 0, top: c.y + c.h, width: W, height: Math.max(0, H - c.y - c.h) },
       { left: 0, top: c.y, width: Math.max(0, c.x), height: c.h }, { left: c.x + c.w, top: c.y, width: Math.max(0, W - c.x - c.w), height: c.h }]
    : [{ left: 0, top: 0, width: W, height: H }];

  // largura e altura sem mola: a mola passa do zero quando o alvo some, e o SVG recusa tamanho negativo (o QA do
  // avanço pegou: dezenas de erros no console a cada passo sem alvo)
  const semMola = { width: { type: 'tween' as const, duration: 0.22 }, height: { type: 'tween' as const, duration: 0.22 } };

  return createPortal(
    <div className="ob-camada ob-camada-tour" aria-live="polite">
      {/* véu com o recorte: a máscara SVG desenha o escuro; as faixas seguram o clique fora do recorte */}
      <svg className="ob-holofote" width={W} height={H} aria-hidden="true">
        <defs>
          <mask id="ob-recorte">
            <rect x={0} y={0} width={W} height={H} fill="white" />
            <motion.rect fill="black" rx={12} animate={{ x: c.x, y: c.y, width: c.w, height: c.h }} transition={semMola} initial={false} />
          </mask>
        </defs>
        <rect x={0} y={0} width={W} height={H} className="ob-holofote-escuro" mask="url(#ob-recorte)" />
        {caixa && <motion.rect className="ob-holofote-borda" rx={12} fill="none" initial={false} animate={{ x: c.x, y: c.y, width: c.w, height: c.h }} transition={semMola} />}
      </svg>
      {faixas.map((f, n) => <div key={n} className="ob-faixa" style={f} />)}
      <motion.div ref={cartao} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby={`ob-passo-${passo.id}`}
        className="ob-cartao-tour" style={{ width: pos.w }} initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: procurando ? 0.6 : 1, scale: 1, left: pos.left, top: pos.top }}>
        <div className="ob-progresso" aria-hidden="true">
          <motion.div className="ob-progresso-barra" animate={{ width: `${((i + 1) / passos.length) * 100}%` }} />
        </div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={passo.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.16 }}>
            <p className="ob-contagem">Passo {i + 1} de {passos.length}</p>
            <h3 id={`ob-passo-${passo.id}`}>{passo.titulo}</h3>
            <p className="ob-texto">{passo.texto}</p>
            {passo.experimente && caixa && (
              <p className="ob-experimente"><Icone nome="alvo" tamanho={16} /> {passo.experimente}</p>
            )}
            {passo.alvo && !caixa && !procurando && (
              <p className="ob-nota">Este item não está à vista agora. Siga para o próximo passo.</p>
            )}
          </motion.div>
        </AnimatePresence>
        <div className="ob-acoes">
          <button type="button" className="ob-botao ob-botao-leve" onClick={() => terminar(false)}>Pular o tour</button>
          <div className="ob-acoes-direita">
            {i > 0 && <button type="button" className="ob-botao" onClick={() => ir(i - 1)}>Voltar</button>}
            <motion.button type="button" className="ob-botao ob-botao-principal" whileTap={{ scale: 0.97 }} onClick={() => ir(i + 1)}>
              {i === passos.length - 1 ? 'Concluir' : 'Próximo'}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>,
    document.body,
  );
}
