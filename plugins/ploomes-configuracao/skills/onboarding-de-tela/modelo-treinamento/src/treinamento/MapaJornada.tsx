import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { ArrowRight, CheckCircle2, Route as RouteIcon } from 'lucide-react';

import { BotaoDeAjuda } from '../onboarding/kit';
import { APRESENTACAO, FASES, QUANDO_TEXTO, SOBRETITULO, TITULO, TRANSICOES, TRILHAS, funilPorId, rotuloFunil, semPrefixo } from './jornada';
import { useProgresso } from './progresso';
import { RETRATO } from './dados';

interface Seta {
  chave: string;
  de: number;
  para: number;
  caminho: string;
}

/**
 * Tela inicial: o processo inteiro em fases, com cada funil como um cartão e as setas reais entre
 * eles (as automações que abrem um funil a partir de outro). Com trilhas por papel, a pessoa escolhe a
 * dela: os funis de fora ficam apagados e o progresso conta só os dela. A trilha vai na query string
 * (?trilha=hunter) — o link copiado abre na mesma trilha — e fica lembrada para a pessoa: é o caminho dela, e
 * simular todos os funis dele até o fim conclui o onboarding (o evento `concluiu` do registro no Usuário).
 */
export default function MapaJornada() {
  const navigate = useNavigate();
  const [busca, setBusca] = useSearchParams();
  const areaRef = useRef<HTMLDivElement>(null);
  const cartoes = useRef(new Map<number, HTMLButtonElement>());
  const [setas, setSetas] = useState<Seta[]>([]);
  const [foco, setFoco] = useState<number | null>(null);
  const { concluidos, trilha: trilhaGuardada, escolherTrilha, recomecar } = useProgresso();
  const daBusca = busca.get('trilha');
  const trilha = TRILHAS.find((t) => t.id === (daBusca ?? trilhaGuardada)) ?? null;
  // o link com ?trilha= vale como escolha: é o caminho que conta para concluir
  useEffect(() => { if (daBusca && TRILHAS.some((t) => t.id === daBusca) && daBusca !== trilhaGuardada) escolherTrilha(daBusca); },
    [daBusca, trilhaGuardada, escolherTrilha]);
  const naTrilha = (id: number) => !trilha || trilha.funis.includes(id);

  const pares = useMemo(() => {
    const m = new Map<string, { de: number; para: number }>();
    for (const t of TRANSICOES) m.set(t.de + '>' + t.para, { de: t.de, para: t.para });
    return [...m.entries()].map(([chave, v]) => ({ chave, ...v }));
  }, []);

  /* As setas são desenhadas depois do layout, medindo onde cada cartão ficou. */
  const desenhar = useCallback(() => {
    const area = areaRef.current;
    if (!area) return;
    const base = area.getBoundingClientRect();
    const novas: Seta[] = [];
    for (const p of pares) {
      const a = cartoes.current.get(p.de)?.getBoundingClientRect();
      const b = cartoes.current.get(p.para)?.getBoundingClientRect();
      if (!a || !b) continue;
      const mesmaColuna = Math.abs(a.left - b.left) < 20;
      let x1: number, y1: number, x2: number, y2: number, c1x: number, c2x: number;
      if (mesmaColuna) {
        // mesma fase: sai pela direita e volta pela direita, num arco
        x1 = a.right - base.left; y1 = a.top + a.height / 2 - base.top;
        x2 = b.right - base.left; y2 = b.top + b.height / 2 - base.top;
        c1x = x1 + 46; c2x = x2 + 46;
      } else if (b.left > a.left) {
        x1 = a.right - base.left; y1 = a.top + a.height / 2 - base.top;
        x2 = b.left - base.left; y2 = b.top + b.height / 2 - base.top;
        c1x = x1 + (x2 - x1) / 2; c2x = x2 - (x2 - x1) / 2;
      } else {
        x1 = a.left - base.left; y1 = a.top + a.height / 2 - base.top;
        x2 = b.right - base.left; y2 = b.top + b.height / 2 - base.top;
        c1x = x1 - (x1 - x2) / 2; c2x = x2 + (x1 - x2) / 2;
      }
      novas.push({ chave: p.chave, de: p.de, para: p.para, caminho: `M ${x1} ${y1} C ${c1x} ${y1}, ${c2x} ${y2}, ${x2} ${y2}` });
    }
    setSetas(novas);
  }, [pares]);

  useLayoutEffect(() => {
    desenhar();
    const area = areaRef.current;
    if (!area || typeof ResizeObserver === 'undefined') return;
    const obs = new ResizeObserver(() => desenhar());
    obs.observe(area);
    return () => obs.disconnect();
  }, [desenhar]);

  const ligado = (s: Seta) => foco !== null && (s.de === foco || s.para === foco);
  const daTrilha = FASES.flatMap((f) => f.funis).filter(naTrilha);
  const feitos = daTrilha.filter((id) => concluidos.includes(id)).length;
  const fFoco = foco !== null ? funilPorId(foco) : undefined;
  const escolher = (id: string | null) => {
    const p = new URLSearchParams(busca);
    if (id) p.set('trilha', id); else p.delete('trilha');
    escolherTrilha(id);
    setBusca(p);
  };

  return (
    <main className="onb">
      <header className="onb-topo">
        <div>
          <p className="onb-sobretitulo"><RouteIcon size={15} /> {SOBRETITULO}</p>
          <h1 className="onb-titulo">{TITULO}</h1>
          <p className="onb-texto">{APRESENTACAO}</p>
          {TRILHAS.length > 0 && (
            <div className="onb-trilhas" role="group" aria-label="Trilha por papel" data-onboarding="trilhas">
              <span className="sim-rotulo">Ver como</span>
              <button className={'onb-trilha' + (!trilha ? ' onb-trilha--ativa' : '')} aria-pressed={!trilha} onClick={() => escolher(null)}>Todos</button>
              {TRILHAS.map((t) => (
                <button key={t.id} className={'onb-trilha' + (trilha?.id === t.id ? ' onb-trilha--ativa' : '')}
                  aria-pressed={trilha?.id === t.id} onClick={() => escolher(t.id)}>{t.nome}</button>
              ))}
            </div>
          )}
        </div>
        <div className="onb-lado">
          <BotaoDeAjuda />
          <div className="onb-progresso" data-onboarding="progresso">
            <strong>{feitos} de {daTrilha.length}</strong>
            <span>funis simulados{trilha ? ' na trilha ' + trilha.nome : ''}</span>
            {concluidos.length > 0 && <button className="onb-link" onClick={recomecar}>recomeçar</button>}
          </div>
        </div>
      </header>

      <div className="onb-mapa" ref={areaRef} data-onboarding="mapa" style={{ ['--fases' as string]: String(Math.max(1, Math.min(FASES.length, 4))) }}>
        <svg className="onb-setas" aria-hidden="true">
          <defs>
            <marker id="onb-ponta" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" className="onb-ponta" />
            </marker>
            <marker id="onb-ponta-foco" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" className="onb-ponta onb-ponta--foco" />
            </marker>
          </defs>
          {setas.map((s) => (
            <path key={s.chave} d={s.caminho}
              className={'onb-seta' + (ligado(s) ? ' onb-seta--foco' : foco !== null || (trilha && !(naTrilha(s.de) && naTrilha(s.para))) ? ' onb-seta--apagada' : '')}
              markerEnd={ligado(s) ? 'url(#onb-ponta-foco)' : 'url(#onb-ponta)'} />
          ))}
        </svg>

        {FASES.map((fase, i) => (
          <section key={fase.id} className="onb-fase">
            <div className="onb-fase-cab">
              <span className="onb-fase-num">{i + 1}</span>
              <div>
                <h2>{fase.titulo}</h2>
                <p>{fase.resumo}</p>
              </div>
            </div>
            <div className="onb-fase-funis">
              {fase.funis.map((id, n) => {
                const f = funilPorId(id);
                if (!f) return null;
                const feito = concluidos.includes(id);
                return (
                  <button key={id} className={'onb-cartao' + (foco === id ? ' onb-cartao--foco' : '') + (naTrilha(id) ? '' : ' onb-cartao--fora')}
                    ref={(el) => { if (el) cartoes.current.set(id, el); else cartoes.current.delete(id); }}
                    data-onboarding={i === 0 && n === 0 ? 'primeiro-funil' : undefined} data-qa="funil" data-qa-id={id}
                    onMouseEnter={() => setFoco(id)} onMouseLeave={() => setFoco(null)}
                    onFocus={() => setFoco(id)} onBlur={() => setFoco(null)}
                    onClick={() => navigate('/funil/' + id)}>
                    <span className="onb-cartao-faixa" style={{ background: f.cor }} />
                    <span className="onb-cartao-num" style={{ color: f.cor }}>{f.numero ?? '•'}</span>
                    <span className="onb-cartao-corpo">
                      <span className="onb-cartao-titulo">{f.titulo}</span>
                      <span className="onb-cartao-meta">{f.etapas.length} etapas · card: {f.unidade}</span>
                    </span>
                    {feito ? <CheckCircle2 size={18} className="onb-cartao-ok" /> : <ArrowRight size={16} className="onb-cartao-ir" />}
                  </button>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      <footer className="onb-legenda">
        {fFoco ? (
          <div>
            <strong>{rotuloFunil(fFoco)}</strong>
            <ul>
              {TRANSICOES.filter((t) => t.de === fFoco.id).map((t) => {
                const para = funilPorId(t.para);
                return para ? <li key={'s' + t.id}>Envia para <b>{rotuloFunil(para)}</b>: {semPrefixo(t.regra)} ({QUANDO_TEXTO[t.quando]}).</li> : null;
              })}
              {TRANSICOES.filter((t) => t.para === fFoco.id).map((t) => {
                const de = funilPorId(t.de);
                return de ? <li key={'e' + t.id}>Recebe de <b>{rotuloFunil(de)}</b>: {semPrefixo(t.regra)}.</li> : null;
              })}
              {!TRANSICOES.some((t) => t.de === fFoco.id || t.para === fFoco.id) && <li>Este funil não troca cards com outros por automação.</li>}
            </ul>
          </div>
        ) : (
          <span>Passe o mouse num funil para ver de onde o negócio chega e para onde ele vai. Retrato da conta em {RETRATO.retratoEm}.</span>
        )}
      </footer>
    </main>
  );
}
