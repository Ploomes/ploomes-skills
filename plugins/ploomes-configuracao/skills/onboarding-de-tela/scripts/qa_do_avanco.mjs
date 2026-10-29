// QA do avanço: percorre a tela na bancada como uma pessoa percorreria — as boas-vindas, o tour passo a passo e, no
// bloco do mapa da jornada e do simulador, o mapa e cada funil do simulador até o fim (o card aberto, as dicas, o checklist, o
// Ganhar), a conclusão e a reabertura —, em várias larguras de tela, e em cada estado confere o que a pessoa veria
// quebrado:
//   rolagem-travada      o conteúdo passa da altura e a página não rola (o fim fica inalcançável)
//   conteudo-cortado     um bloco com overflow escondido corta o texto de baixo, sem rolagem vertical
//   rolagem-horizontal   a página ganha rolagem para o lado (algo passa da largura)
//   dialogo-fora-da-tela o cartão do tour, o balão da dica, as boas-vindas ou um modal passam da tela e o botão some
//   botao-fora-da-tela   um botão fica fora da largura; botao-coberto: outro elemento por cima dele
//   alvo-do-tour-sumiu   o passo do tour aponta um data-onboarding que não está na tela
//   imagem-quebrada      a imagem não carregou; travou: o avanço não chegou aonde devia
//   erro-no-console      exceção ou console.error durante o estado
//   prefixo-interno      o nome interno da automação ("P6 ·") aparece para a pessoa
// e, nesse bloco, as correções do simulador (a roda do mouse anda o quadro, o aviso fica até fechar, o
// "Chega aqui por" abre o detalhe, a dica não treme, o mapa empilha no celular) e o que o flow gravou no Usuário
// (abriu, concluiu, reabriu) — em toda tela que manda o registro.
//
//   node servidor.mjs --pacote <modelo-treinamento/exemplo/bancada> --tela <codigo-vN>/dist     (a bancada, noutro terminal)
//   node qa_do_avanco.mjs [--host http://localhost:8780/] [--saida <pasta>] [--larguras 1366x768,1366x768+menu,1920x1080,390x844]
//                         [--rotas /funil/123] [--navegador <exe>] [--fotos]   (--fotos: o print de todo estado, para mostrar a quem pede)
//
// Abre um Edge/Chrome próprio, sem janela e com perfil temporário (nunca o navegador de trabalho), e devolve 1 se
// houver ERRO. Sem dependências: Node 22+.
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const args = Object.fromEntries(process.argv.slice(2).reduce((a, v, i, l) => (v.startsWith('--') ? [...a, [v.slice(2), l[i + 1] && !l[i + 1].startsWith('--') ? l[i + 1] : true]] : a), []));
const HOST = String(args.host ?? 'http://localhost:8780/').replace(/\/?$/, '/');
const PREFIXO = '#/ai-screen/bancada';
const LARGURAS = String(args.larguras ?? '1366x768,1366x768+menu,1920x1080,390x844').split(',');
const ROTAS_EXTRAS = args.rotas ? String(args.rotas).split(',') : [];
const hoje = new Date().toISOString().slice(0, 16).replace(/[T:]/g, '-');
const SAIDA = resolve(String(args.saida ?? '.'), `qa-${hoje}`);
const NAVEGADORES = ['C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', 'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe', '/usr/bin/google-chrome', '/usr/bin/chromium', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'];
const dormir = (ms) => new Promise((ok) => setTimeout(ok, ms));

// ------------------------------------------------------------------ o auditor (roda dentro da tela)
const AUDITOR = String.raw`(() => {
  const achados = [], W = innerWidth, H = innerHeight, doc = document.scrollingElement || document.documentElement;
  const add = (gravidade, tipo, onde, detalhe) => achados.push({ gravidade, tipo, onde, detalhe });
  const nome = (el) => {
    if (!el || el === document.body) return 'body';
    const qa = el.getAttribute('data-qa') || el.getAttribute('data-onboarding');
    const cls = typeof el.className === 'string' && el.className.trim() ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : '';
    const txt = (el.innerText || el.getAttribute('aria-label') || '').trim().replace(/\s+/g, ' ').slice(0, 40);
    return el.tagName.toLowerCase() + (qa ? '[' + qa + ']' : cls) + (txt ? ' "' + txt + '"' : '');
  };
  const visivel = (el) => {
    // o conteúdo de um <details> fechado ainda tem caixa no Chrome, mas ninguém vê nem clica
    const fechado = el.closest('details:not([open])');
    if (fechado && !el.closest('summary') && el !== fechado) return false;
    const r = el.getBoundingClientRect(); if (r.width < 2 || r.height < 2) return false; const cs = getComputedStyle(el); return cs.visibility !== 'hidden' && cs.display !== 'none' && Number(cs.opacity) > 0.05;
  };
  const fixo = (el) => { for (let x = el; x && x !== document.body; x = x.parentElement) if (getComputedStyle(x).position === 'fixed') return true; return false; };
  if ((document.body.innerText || '').trim().length < 15) add('ERRO', 'tela-vazia', 'body', 'a tela não mostra conteúdo (quebrou ao carregar?)');
  const sobreposto = document.querySelector('.ob-camada, .ob-boas-vindas, [aria-modal="true"]');
  const travaH = [getComputedStyle(document.documentElement).overflowY, getComputedStyle(document.body).overflowY].some((v) => v === 'hidden' || v === 'clip');
  if (doc.scrollHeight > H + 2 && travaH && !sobreposto) add('ERRO', 'rolagem-travada', 'html/body', 'o conteúdo tem ' + doc.scrollHeight + ' px numa tela de ' + H + ' px e a página não rola');
  if (doc.scrollWidth > W + 2) {
    const fora = [...document.querySelectorAll('body *')].filter((el) => visivel(el) && el.getBoundingClientRect().right > W + 2);
    const folhas = fora.filter((el) => !fora.some((c) => c !== el && el.contains(c))).slice(0, 3).map(nome);
    add('ERRO', 'rolagem-horizontal', folhas.join(' · ') || 'página', 'a página passa ' + (doc.scrollWidth - W) + ' px da largura de ' + W + ' px');
  }
  for (const el of document.querySelectorAll('body *')) {
    if (!visivel(el)) continue;
    const cs = getComputedStyle(el);
    if ((cs.overflowY === 'hidden' || cs.overflowY === 'clip') && el.clientHeight > 20 && el.scrollHeight > el.clientHeight + 8 && cs.webkitLineClamp === 'none') {
      const r = el.getBoundingClientRect();
      const escondido = [...el.querySelectorAll('*')].some((f) => { const rf = f.getBoundingClientRect(); return rf.height > 0 && rf.top >= r.bottom - 2 && (f.innerText || '').trim() && getComputedStyle(f).visibility !== 'hidden'; });
      if (escondido) add('ERRO', 'conteudo-cortado', nome(el), 'o bloco tem ' + el.scrollHeight + ' px de conteúdo em ' + el.clientHeight + ' px, sem rolagem vertical: o fim some');
    }
    if ((cs.overflowX === 'hidden' || cs.overflowX === 'clip') && el.clientWidth > 20 && el.scrollWidth > el.clientWidth + 8 && cs.textOverflow !== 'ellipsis' && !el.querySelector('img,svg,canvas,video'))
      add('AVISO', 'texto-cortado', nome(el), 'o conteúdo passa ' + (el.scrollWidth - el.clientWidth) + ' px da largura e é cortado sem reticências');
  }
  for (const el of document.querySelectorAll('[role="dialog"], .ob-cartao-tour, .ob-boas-vindas, .ob-painel, .ob-menu, .ob-dica-balao, .dica-balao')) {
    if (!visivel(el) || !fixo(el)) continue;
    const r = el.getBoundingClientRect(), cs = getComputedStyle(el), rola = cs.overflowY === 'auto' || cs.overflowY === 'scroll';
    if (!rola && (r.bottom > H + 1 || r.top < -1)) add('ERRO', 'dialogo-fora-da-tela', nome(el), 'vai de ' + Math.round(r.top) + ' a ' + Math.round(r.bottom) + ' px numa tela de ' + H + ' px, sem rolagem: o botão do fim some');
    if (r.right > W + 1 || r.left < -1) add('ERRO', 'dialogo-fora-da-tela', nome(el), 'passa da largura (' + Math.round(r.left) + ' a ' + Math.round(r.right) + ' de ' + W + ' px)');
  }
  // janela aberta (tour, boas-vindas): só o que está nela conta; menu aberto por cima da página, também
  const camada = document.querySelector('.ob-camada, [aria-modal="true"]');
  const porCima = (x) => !!(x.closest && x.closest('[role="menu"], [role="dialog"], [aria-modal="true"]'));
  for (const el of document.querySelectorAll('button, a[href], input, select, textarea, summary, [role="button"], [role="tab"]')) {
    if (!visivel(el) || (camada && !camada.contains(el))) continue;
    const r = el.getBoundingClientRect();
    // dentro de um bloco que rola para o lado (o quadro do funil, a barra de etapas do card) o botão fora da largura se
    // alcança rolando o bloco: não é botão perdido
    let rolaDeLado = false;
    for (let x = el.parentElement; x && x !== document.body && !rolaDeLado; x = x.parentElement) {
      const ox = getComputedStyle(x).overflowX;
      rolaDeLado = (ox === 'auto' || ox === 'scroll') && x.scrollWidth > x.clientWidth;
    }
    if (rolaDeLado) continue;
    if (r.right > W + 1 || r.left < -1) { add('ERRO', 'botao-fora-da-tela', nome(el), 'fica fora da largura (' + Math.round(r.left) + ' a ' + Math.round(r.right) + ' de ' + W + ' px)'); continue; }
    if (doc.scrollTop > 0 || r.top < 0 || r.bottom > H) continue;
    const em = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
    if (em && em !== el && !el.contains(em) && !em.contains(el) && !(camada && !camada.contains(em)) && !(porCima(em) && !porCima(el))) add('AVISO', 'botao-coberto', nome(el), 'coberto por ' + nome(em));
  }
  for (const img of document.images) if (img.complete && img.naturalWidth === 0 && visivel(img)) add('ERRO', 'imagem-quebrada', nome(img), img.src.slice(0, 80));
  for (const el of document.querySelectorAll('[data-qa-erro]')) add('ERRO', el.getAttribute('data-qa-erro'), nome(el), '');
  const nota = document.querySelector('.ob-cartao-tour .ob-nota');
  if (nota) add('ERRO', 'alvo-do-tour-sumiu', 'passo ' + (document.querySelector('.ob-cartao-tour').getAttribute('aria-labelledby') || '').replace('ob-passo-', ''), 'o passo aponta um data-onboarding que não está na tela');
  const prefixo = (document.body.innerText || '').match(/(^|\s)(P\d+\s*[·–—]\s*[^\n]{0,40})/);
  if (prefixo) add('AVISO', 'prefixo-interno', 'texto', 'o nome interno da automação aparece para a pessoa: "' + prefixo[2] + '"');
  return achados;
})()`;

const AO_FIM = String.raw`(() => { const d = document.scrollingElement || document.documentElement; d.scrollTop = d.scrollHeight;
  return { alcancou: d.scrollTop + innerHeight >= d.scrollHeight - 2, altura: d.scrollHeight, tela: innerHeight }; })()`;
const AO_TOPO = `(() => { (document.scrollingElement || document.documentElement).scrollTop = 0; return true; })()`;

// ------------------------------------------------------------------ CDP mínimo
class Cdp {
  constructor(ws) {
    this.ws = ws; this.n = 0; this.pend = new Map(); this.ouvintes = [];
    ws.onmessage = (e) => {
      const m = JSON.parse(e.data);
      if (m.id && this.pend.has(m.id)) { const p = this.pend.get(m.id); this.pend.delete(m.id); if (m.error) p.falha(new Error(m.error.message)); else p.ok(m.result); }
      else if (m.method) for (const f of this.ouvintes) f(m);
    };
  }
  static async abrir(url) { const ws = new WebSocket(url); await new Promise((ok, falha) => { ws.onopen = ok; ws.onerror = () => falha(new Error('CDP não abriu')); }); return new Cdp(ws); }
  send(method, params = {}) {
    const id = ++this.n;
    this.ws.send(JSON.stringify({ id, method, params }));
    return new Promise((ok, falha) => {
      this.pend.set(id, { ok, falha });
      setTimeout(() => { if (this.pend.has(id)) { this.pend.delete(id); falha(new Error('tempo esgotado: ' + method)); } }, 20000);
    });
  }
  on(f) { this.ouvintes.push(f); }
}

// ------------------------------------------------------------------ o navegador próprio
const exe = args.navegador ?? NAVEGADORES.find((x) => existsSync(x));
if (!exe) { console.error('Não achei Edge nem Chrome: passe --navegador <caminho do executável>.'); process.exit(2); }
try { await fetch(HOST + '_bancada/estado'); } catch { console.error(`A bancada não responde em ${HOST}. Suba antes: node servidor.mjs --pacote … --tela …/dist`); process.exit(2); }
const PORTA = Number(args['porta-cdp'] ?? 9400 + Math.floor(Math.random() * 400));
const perfil = mkdtempSync(join(tmpdir(), 'qa-onboarding-'));
const nav = spawn(exe, ['--headless=new', `--remote-debugging-port=${PORTA}`, `--user-data-dir=${perfil}`, '--no-first-run', '--no-default-browser-check', '--disable-extensions', '--hide-scrollbars', 'about:blank'], { stdio: 'ignore' });
const encerrar = (codigo) => { try { nav.kill(); } catch { /* já saiu */ } setTimeout(() => { try { rmSync(perfil, { recursive: true, force: true }); } catch { /* o Windows segura o perfil por um instante */ } process.exit(codigo); }, 600); };
// qualquer falha do próprio QA fecha o navegador que ele abriu
process.on('uncaughtException', (e) => { console.error('O QA parou: ' + (e?.stack ?? e)); encerrar(2); });
process.on('unhandledRejection', (e) => { console.error('O QA parou: ' + (e?.stack ?? e)); encerrar(2); });
let alvo = null;
for (let i = 0; i < 50 && !alvo; i++) { await dormir(200); try { alvo = await (await fetch(`http://127.0.0.1:${PORTA}/json/new?about:blank`, { method: 'PUT' })).json(); } catch { /* subindo */ } }
if (!alvo) { console.error('O navegador não abriu a porta de depuração.'); encerrar(2); }
const cdp = await Cdp.abrir(alvo.webSocketDebuggerUrl);

const contextos = new Map();
let doConsole = [];
cdp.on((m) => {
  if (m.method === 'Runtime.executionContextCreated' && m.params.context.auxData?.isDefault) contextos.set(m.params.context.auxData.frameId, m.params.context.id);
  if (m.method === 'Runtime.executionContextDestroyed') for (const [f, id] of contextos) if (id === m.params.executionContextId) contextos.delete(f);
  if (m.method === 'Runtime.executionContextsCleared') contextos.clear();
  if (m.method === 'Runtime.exceptionThrown') doConsole.push(m.params.exceptionDetails?.exception?.description?.split('\n')[0] ?? m.params.exceptionDetails?.text ?? 'exceção');
  if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') doConsole.push(m.params.args.map((a) => a.value ?? a.description ?? '').join(' ').slice(0, 200));
  if (m.method === 'Log.entryAdded' && m.params.entry.level === 'error' && !/favicon/.test(m.params.entry.url ?? '')) doConsole.push(m.params.entry.text.slice(0, 200));
});
await cdp.send('Page.enable'); await cdp.send('Runtime.enable'); await cdp.send('Log.enable');

const avaliar = async (expressao, contextId) => {
  const r = await cdp.send('Runtime.evaluate', { expression: expressao, returnByValue: true, awaitPromise: true, ...(contextId ? { contextId } : {}) });
  if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description ?? r.exceptionDetails.text);
  return r.result.value;
};
async function quadroDaTela() {
  const { frameTree } = await cdp.send('Page.getFrameTree');
  return (frameTree.childFrames ?? []).map((f) => f.frame).find((f) => !f.url.startsWith(HOST)) ?? null;
}
async function naTela(expressao) {
  for (let i = 0; i < 20; i++) {
    const q = await quadroDaTela();
    const ctx = q && contextos.get(q.id);
    if (ctx) { try { return await avaliar(expressao, ctx); } catch (e) { if (!/context|Cannot find/i.test(e.message)) throw e; } }
    await dormir(150);
  }
  throw new Error('a tela não carregou no iframe');
}
async function esperar(expressao, ms = 6000) {
  const fim = Date.now() + ms;
  while (Date.now() < fim) { try { if (await naTela(`!!(${expressao})`)) return true; } catch { /* recarregando */ } await dormir(150); }
  return false;
}
const clicar = (seletor) => naTela(`(() => { const el = document.querySelector(${JSON.stringify(seletor)}); if (!el) return false; el.scrollIntoView({ block: 'center' }); el.click(); return true; })()`);
const irPara = async (rota) => { await avaliar(`location.hash = ${JSON.stringify(PREFIXO + (rota === '/' ? '' : rota))}; true`); await dormir(450); };
const bancada = async (cmd, corpo) => (await fetch(HOST + '_bancada/' + cmd, corpo ? { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(corpo) } : {})).json();
// sessionStorage não tem tipo no Storage.clearDataForOrigin: limpa de dentro da tela (a mesma origem)
const limparArmazenamento = (tambemLocal = true) =>
  naTela(`(() => { sessionStorage.clear(); ${tambemLocal ? 'localStorage.clear();' : ''} return true; })()`).catch(() => false);
async function trocarUsuario(id) {
  await avaliar(`(() => { const s = document.getElementById('usuario'); s.value = ${JSON.stringify(String(id))}; s.onchange(); return true; })()`);
  await dormir(500);
}


// ------------------------------------------------------------------ o percurso
mkdirSync(SAIDA, { recursive: true });
const achados = [];
const percurso = [];
const registros = [];
let largura = '';
let nPrint = 0;

async function auditar(estado) {
  await dormir(250);
  let lista = [];
  try {
    lista = await naTela(AUDITOR);
    const fim = await naTela(AO_FIM);
    if (fim.altura > fim.tela + 2 && !fim.alcancou) lista.push({ gravidade: 'ERRO', tipo: 'rolagem-travada', onde: 'página', detalhe: `rolei até o fim e parei antes: ${fim.altura} px de conteúdo` });
    if (fim.altura > fim.tela + 2) {
      await dormir(150);
      lista.push(...(await naTela(AUDITOR)).filter((a) => a.tipo !== 'botao-coberto'));
      await naTela(AO_TOPO);
    }
  } catch (e) { lista.push({ gravidade: 'ERRO', tipo: 'travou', onde: estado, detalhe: e.message }); }
  // recurso recusado (401/403/404 da API) é aviso: o que a tela fez com a recusa aparece no registro e no próprio estado
  for (const t of doConsole.splice(0)) lista.push(/Failed to load resource/.test(t) ? { gravidade: 'AVISO', tipo: 'chamada-recusada', onde: estado, detalhe: t } : { gravidade: 'ERRO', tipo: 'erro-no-console', onde: estado, detalhe: t });
  const vistos = new Set();
  lista = lista.filter((a) => { const k = a.tipo + a.onde + a.detalhe; if (vistos.has(k)) return false; vistos.add(k); return true; });
  let print = null;
  if (lista.length || args.fotos) {
    const { data } = await cdp.send('Page.captureScreenshot', { format: 'png' });
    print = `${largura}-${String(++nPrint).padStart(3, '0')}.png`;
    writeFileSync(join(SAIDA, print), Buffer.from(data, 'base64'));
  }
  for (const a of lista) achados.push({ largura, estado, ...a, print });
  percurso.push({ largura, estado, erros: lista.filter((a) => a.gravidade === 'ERRO').length, avisos: lista.filter((a) => a.gravidade === 'AVISO').length, print });
}
const travou = (estado, detalhe) => { achados.push({ largura, estado, gravidade: 'ERRO', tipo: 'travou', onde: estado, detalhe, print: null }); percurso.push({ largura, estado, erros: 1, avisos: 0 }); };
const avisar = (estado, tipo, detalhe) => { achados.push({ largura, estado, gravidade: 'AVISO', tipo, onde: estado, detalhe, print: null }); percurso.push({ largura, estado, erros: 0, avisos: 1 }); };

async function boasVindasETour() {
  if (await esperar(`document.querySelector('.ob-boas-vindas')`, 3000)) {
    for (let n = 1; n <= 8; n++) {
      await auditar(`boas-vindas, cartão ${n}`);
      if (!(await clicar('.ob-boas-vindas .ob-botao-principal'))) break;
      await dormir(450);
      if (!(await naTela(`!!document.querySelector('.ob-boas-vindas')`))) break;
    }
  }
  if (!(await esperar(`document.querySelector('.ob-cartao-tour')`, 1500))) {
    if (await naTela(`!!document.querySelector('.ob-botao-ajuda')`)) {
      await clicar('.ob-botao-ajuda'); await dormir(300);
      await naTela(`(() => { const b = [...document.querySelectorAll('.ob-menu [role="menuitem"]')].find((x) => /tour/i.test(x.textContent)); b?.click(); return !!b; })()`);
    }
  }
  for (let n = 1; n <= 40 && (await esperar(`document.querySelector('.ob-cartao-tour')`, 1500)); n++) {
    // o kit procura o alvo por até 2,5 s com o cartão apagado (opacidade 0,6): espera ele acender ou o aviso de
    // "não está à vista". O holofote do passo anterior ainda está na tela, então ele não serve de sinal.
    await dormir(350);
    await esperar(`(() => { const c = document.querySelector('.ob-cartao-tour'); return !c || c.querySelector('.ob-nota') || Number(getComputedStyle(c).opacity) > 0.95; })()`, 3500);
    await dormir(350);
    const id = await naTela(`(document.querySelector('.ob-cartao-tour')?.getAttribute('aria-labelledby') || '').replace('ob-passo-', '')`);
    await auditar(`tour, passo ${n} (${id})`);
    if (!(await clicar('.ob-cartao-tour .ob-botao-principal'))) break;
  }
}

// ---- as correções de uma revisão interna e do retorno de um cliente, conferidas uma vez por largura completa
const RODA = `(() => { const q = document.querySelector('.nat-quadro'); if (!q) return null; const sobra = q.scrollWidth - q.clientWidth;
  if (sobra <= 0) return { sobra }; q.scrollLeft = 0; const ev = new WheelEvent('wheel', { deltaY: 300, bubbles: true, cancelable: true });
  q.dispatchEvent(ev); return { sobra, andou: q.scrollLeft, cancelou: ev.defaultPrevented }; })()`;

async function conferirRoda(estado) {
  const r = await naTela(RODA);
  if (!r) return travou(estado, 'o quadro do funil (.nat-quadro) não está na tela');
  if (r.sobra <= 0) return; // o funil cabe na largura: não há para onde rolar
  if (!(r.andou > 0 && r.cancelou)) travou(estado, `a roda vertical do mouse não anda o quadro para o lado (sobram ${r.sobra} px; andou ${r.andou})`);
  await naTela(`(() => { document.querySelector('.nat-quadro').scrollLeft = 0; return true; })()`);
}

async function conferirChegada(estado) {
  if (!(await naTela(`!!document.querySelector('.sim-chip')`))) return;
  const alto = await naTela(`document.querySelector('.sim-topo').getBoundingClientRect().height`);
  await clicar('.sim-chip'); await dormir(250);
  if (!(await esperar(`document.querySelector('.sim-entrada-detalhe') && [...document.querySelectorAll('.sim-entrada-detalhe button')].some((b) => /Abrir este funil/.test(b.textContent))`, 1500)))
    travou(estado, 'o clique na etiqueta do "Chega aqui por" não abriu o detalhe com o botão "Abrir este funil"');
  else await auditar(`${estado}, "Chega aqui por" aberto`);
  await naTela(`(() => { [...document.querySelectorAll('.sim-entrada-detalhe button')].find((b) => /Fechar/.test(b.textContent))?.click(); return true; })()`);
  await dormir(200);
  if (alto > 200) avisar(estado, 'cabecalho-alto', `o cabeçalho do simulador tem ${Math.round(alto)} px: o quadro do funil fica pequeno no notebook`);
}

async function conferirDicaParada(estado) {
  const pos = `(() => { const b = document.querySelector('.dica-balao'), h = document.querySelector('.dica-holofote'); const r = (x) => x ? x.getBoundingClientRect() : null;
    const a = r(b), c = r(h); return a ? [a.top, a.left, c?.top ?? 0, c?.left ?? 0, c?.width ?? 0, c?.height ?? 0].map(Math.round).join(',') : null; })()`;
  await dormir(1300);
  const a = await naTela(pos);
  await dormir(900);
  const b = await naTela(pos);
  if (a && b && a !== b) travou(estado, `a dica se mexeu sem nada mudar na tela (${a} → ${b}): é o tremor`);
}

async function conferirAviso(estado) {
  await clicar('[data-onboarding="proxima"]');
  await dormir(300);
  if (!(await naTela(`!!document.querySelector('.neg-aviso')`))) return travou(estado, 'mover com obrigatório faltando não mostrou o aviso');
  await dormir(6600);
  if (!(await naTela(`!!document.querySelector('.neg-aviso')`))) return travou(estado, 'o aviso sumiu sozinho antes de a pessoa fechar');
  await auditar(`${estado}, o aviso depois de 6,6 s`);
  if (!(await clicar('.neg-aviso .aviso-fechar'))) return travou(estado, 'o aviso não tem o X para fechar');
  await dormir(250);
  if (await naTela(`!!document.querySelector('.neg-aviso')`)) travou(estado, 'o X não fechou o aviso');
}

/** Um funil do simulador, do quadro até o fim: abre o card, lê cada dica, preenche o checklist e move até ganhar. */
async function simularFunil(id, completo, conferidos) {
  const nome = await naTela(`document.querySelector('[data-qa="funil"][data-qa-id="${id}"] .onb-cartao-titulo')?.textContent ?? '${id}'`).catch(() => String(id));
  await irPara('/funil/' + id);
  const onde = `funil ${nome}`;
  if (!(await esperar(`document.querySelector('.nat-quadro')`, 5000))) return travou(onde, 'o simulador não abriu');
  await auditar(`${onde}, o quadro`);
  if (completo) { await conferirRoda(`${onde}, o quadro`); await conferirChegada(onde); }
  const etapasVistas = new Set();
  for (let n = 0; n < 120; n++) {
    await dormir(200);
    if (await naTela(`!!document.querySelector('.sim-fim')`)) { await auditar(`${onde}, o fim`); return true; }
    const etapa = await naTela(`document.querySelector('.neg-etapa--atual span')?.textContent ?? ''`);
    if (etapa && !etapasVistas.has(etapa)) {
      etapasVistas.add(etapa);
      await esperar(`document.querySelector('.dica-balao')`, 1500);
      if (completo && !conferidos.dica) { conferidos.dica = true; await conferirDicaParada(`${onde}, ${etapa}`); }
      if (completo || etapasVistas.size === 1) await auditar(`${onde}, card aberto em ${etapa}`);
    }
    // o aviso de obrigatório se confere antes do "Entendi", que já preenche o checklist com o exemplo
    if (completo && !conferidos.aviso && await naTela(`!!document.querySelector('.neg .neg-obrig') && !!document.querySelector('[data-onboarding="proxima"]')`)) {
      conferidos.aviso = true; await conferirAviso(`${onde}, ${etapa}`);
    }
    if (await clicar('.dica .dica-botao')) continue;                                  // "Abrir o card", "Entendi", "Mover para…", "Ganhar"
    if (!(await naTela(`!!document.querySelector('.neg')`))) {                          // o card fechado: abrir
      if (!(await clicar('[data-onboarding="card"]'))) return travou(onde, 'o card de exemplo não está no quadro');
      continue;
    }
    if (await naTela(`[...document.querySelectorAll('.dica .onb-link')].some((b) => /Preencher por mim/.test(b.textContent))`)) {
      await naTela(`(() => { [...document.querySelectorAll('.dica .onb-link')].find((b) => /Preencher por mim/.test(b.textContent)).click(); return true; })()`);
      continue;
    }
    if (await clicar('[data-onboarding="ganhar"]')) continue;
    if (await clicar('[data-onboarding="proxima"]')) continue;
    return travou(`${onde}, ${etapa}`, 'a dica não mostra o que fazer e não há próxima etapa nem Ganhar');
  }
  return travou(onde, 'passei de 120 ações sem chegar ao fim do funil');
}

const lerRegistro = async () => { try { return (await naTela(`(window.__onboardingDaConta?.registro || []).map((r) => r.evento + ':' + r.situacao)`)) ?? []; } catch { return []; } };
const NO_MAPA = `document.querySelector('.onb-mapa [data-qa="funil"]')`;

async function contaInteira(completo) {
  await irPara('/');
  if (!(await esperar(NO_MAPA, 6000))) return travou('mapa', 'o mapa da jornada não mostrou nenhum funil');
  await auditar('o mapa da jornada');
  if (Number(largura.split('x')[0]) < 640) {
    const empilhado = await naTela(`(() => { const m = document.querySelector('.onb-mapa'); return getComputedStyle(m).gridTemplateColumns.trim().split(/\\s+/).length === 1
      && getComputedStyle(document.querySelector('.onb-setas')).display === 'none'; })()`);
    if (!empilhado) travou('mapa no celular', 'o mapa não empilhou em uma coluna sem setas');
  }
  const ids = await naTela(`[...document.querySelectorAll('.onb-mapa [data-qa="funil"]:not(.onb-cartao--fora)')].map((x) => x.getAttribute('data-qa-id'))`);
  const conferidos = {};
  for (const id of ids) {
    await simularFunil(id, completo, conferidos);
    await irPara('/');
    await esperar(NO_MAPA, 4000);
  }
  const placar = await naTela(`document.querySelector('[data-onboarding="progresso"] strong')?.textContent ?? ''`);
  if (placar !== `${ids.length} de ${ids.length}`) travou('mapa, todos simulados', `simulei os ${ids.length} funis e o progresso diz "${placar}"`);
  await auditar('o mapa, todos os funis simulados');
}

const estado0 = await bancada('estado');
const usuarios = estado0.usuarios ?? [];
const campos = async (id) => (await bancada('estado')).usuarios?.find((x) => x.id === id)?.campos ?? {};
for (const [n, l] of LARGURAS.entries()) {
  largura = l;
  const [w, h] = l.replace('+menu', '').split('x').map(Number);
  await cdp.send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: w < 600 });
  await bancada('reiniciar', {});
  // a consulta ?qa=n força recarregar o host: só trocar o # não recarrega, e o menu aberto da largura anterior ficaria
  await cdp.send('Page.navigate', { url: `${HOST}?qa=${n}${PREFIXO}` });
  await dormir(1200);
  // +menu: o menu do Ploomes aberto (240 px) estreita a área da tela
  if (l.includes('+menu')) await avaliar(`document.getElementById('area').style.left = '240px'; true`);
  else if (w < 600) await avaliar(`document.body.classList.add('embutido'); true`); // no celular a tela ocupa tudo, como no app
  // a primeira carga só serve para limpar o armazenamento da tela; a bancada zera depois, e a abertura que conta é a seguinte
  if (usuarios[0]) await trocarUsuario(usuarios[0].id);
  await limparArmazenamento();
  await bancada('reiniciar', {});
  await trocarUsuario(usuarios[0]?.id ?? '');
  await esperar(`document.body && document.body.innerText.trim().length > 15`, 8000);
  await boasVindasETour();
  const ehConta = await esperar(NO_MAPA, 4000);
  if (ehConta) await contaInteira(n === 0);
  else {
    await auditar('tela');
    // a tela com o kit também manda o registro (abriu; concluiu no fim do tour): o que ela mandou e o que ficou no Usuário
    if (n === 0) { await dormir(600); registros.push({ usuario: usuarios[0]?.nome, passos: await lerRegistro(), campos: await campos(usuarios[0]?.id) }); }
  }
  for (const r of ROTAS_EXTRAS) { await irPara(r); await auditar(`rota ${r}`); }
  if (ehConta && n === 0) {
    const u0 = usuarios[0];
    await dormir(600);
    registros.push({ usuario: u0?.nome, passos: await lerRegistro(), campos: await campos(u0?.id) });
    // a volta, numa sessão nova: as boas-vindas não abrem de novo, e a abertura soma em "Vezes que consultou"
    await limparArmazenamento(false);
    await trocarUsuario(u0?.id ?? '');
    await esperar(NO_MAPA, 8000);
    await dormir(2500);
    if (await naTela(`!!document.querySelector('.ob-boas-vindas')`)) travou('a volta', 'as boas-vindas abriram de novo: depois da primeira visita, só pelo "?"');
    await auditar('a volta, sem pop-up');
    registros.push({ usuario: u0?.nome, passos: await lerRegistro(), nota: 'reaberto numa sessão nova', campos: await campos(u0?.id) });
    // os outros usuários da bancada, na primeira visita: as boas-vindas e a abertura no Usuário
    for (const u of usuarios.slice(1)) {
      await limparArmazenamento();
      await trocarUsuario(u.id);
      if (!(await esperar(`document.querySelector('.ob-boas-vindas')`, 5000))) travou(`primeira visita de ${u.nome}`, 'as boas-vindas não abriram');
      await dormir(800);
      registros.push({ usuario: u.nome, passos: await lerRegistro(), campos: await campos(u.id) });
    }
    const log = (await bancada('estado')).registro ?? [];
    registros.push({ api: log.filter((x) => /^flow/.test(x.rota)).map((x) => `${x.metodo} ${x.rota.split('?')[0]} → ${x.status}${x.corpo ? ' ' + x.corpo : ''}`) });
  }
}

// ------------------------------------------------------------------ o relatório
const erros = achados.filter((a) => a.gravidade === 'ERRO'), avisos = achados.filter((a) => a.gravidade === 'AVISO');
const linha = (a) => `| ${a.largura} | ${a.estado} | ${a.tipo} | ${String(a.onde).replace(/\|/g, '/')} | ${String(a.detalhe).replace(/\|/g, '/')} | ${a.print ?? ''} |`;
const md = [
  `# QA do avanço — ${estado0.tela ?? 'tela'} — ${hoje}`, '',
  `**${erros.length} erro(s) e ${avisos.length} aviso(s)** em ${percurso.length} estados, nas larguras ${LARGURAS.join(', ')}.`,
  erros.length ? 'ERRO bloqueia a subida: corrija na tela e rode de novo.' : 'Nenhum erro: pode mostrar a quem pede.', '',
  '## Erros', '', '| Largura | Estado | Tipo | Onde | O que | Print |', '|---|---|---|---|---|---|', ...erros.map(linha), '',
  '## Avisos', '', '| Largura | Estado | Tipo | Onde | O que | Print |', '|---|---|---|---|---|---|', ...avisos.map(linha), '',
  '## O registro no cadastro do Usuário', '',
  ...(registros.length ? registros.map((r) => r.api ? `- O flow: ${r.api.join(' · ') || 'nenhuma chamada ao flow'}`
    : `- ${r.usuario}${r.nota ? ', ' + r.nota : ''}: ${r.passos.join(', ') || 'nada registrado'}`
      + (r.campos && Object.keys(r.campos).length ? ` · no Usuário: ${Object.entries(r.campos).map(([k, v]) => `${k} = ${v}`).join('; ')}` : ''))
    : ['- Sem o percurso do mapa: o registro desta tela se confere na bancada pelo `window.__onboardingDaConta` e pelo flow simulado.']), '',
  '## O percurso', '', '| Largura | Estado | Erros | Avisos | Print |', '|---|---|---|---|---|', ...percurso.map((p) => `| ${p.largura} | ${p.estado} | ${p.erros} | ${p.avisos} | ${p.print ?? ''} |`), '',
];
writeFileSync(join(SAIDA, 'relatorio.md'), md.join('\n'), 'utf-8');
writeFileSync(join(SAIDA, 'qa.json'), JSON.stringify({ quando: hoje, larguras: LARGURAS, achados, percurso, registros }, null, 1), 'utf-8');
console.log(`QA do avanço: ${erros.length} erro(s), ${avisos.length} aviso(s) em ${percurso.length} estados → ${join(SAIDA, 'relatorio.md')}`);
for (const a of erros.slice(0, 15)) console.log(`  ERRO  ${a.largura} · ${a.estado} · ${a.tipo} · ${a.onde} · ${a.detalhe}`);
encerrar(erros.length ? 1 : 0);
