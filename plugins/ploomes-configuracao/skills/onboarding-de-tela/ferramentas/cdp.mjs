// Cliente mínimo do DevTools (CDP) para o navegador de TRABALHO aberto com --remote-debugging-port.
// Porta: variável CDP_PORTA (padrão 9333). Só mexa nas abas que você mesmo abriu com "nova".
//   node cdp.mjs lista                      → abas e frames abertos (id | tipo | título | url)
//   node cdp.mjs nova <url>                 → abre uma aba nova e imprime o id
//   node cdp.mjs ir <id> <url>              → navega a aba
//   node cdp.mjs ativar <id>                → traz a aba para a frente (aba em segundo plano congela o fetch e o teste mente)
//   node cdp.mjs foto <id> <arquivo.png>    → print da aba (sai em branco se a janela estiver minimizada)
//   node cdp.mjs clique <id> <x,y>          → clique de mouse de verdade nas coordenadas do print (.click() no JS não abre o editor)
//   node cdp.mjs tecla <id> <Escape|Enter|Tab>  → aperta uma tecla
//   node cdp.mjs digitar <id> <texto|@arquivo>  → escreve no campo que tem o foco (o chat do construtor não é um textarea:
//                                                 clique no campo antes; colar pela área de transferência já gravou senha no lugar errado)
//   node cdp.mjs texto <id>                 → texto visível da aba ou do frame (o id pode ser de um iframe da lista)
//   node cdp.mjs js <id> <expressão|@arquivo.js>                 → avalia JS na página
//   node cdp.mjs jsm <id> <origem-do-frame> <expressão|@arquivo>  → avalia JS no window de um frame (ex.: https://ai-chat.ploomes.com)
// Todo comando tem limite de tempo (CDP_TEMPO, em segundos; padrão 30): um comando preso já travou uma sessão inteira.
import fs from 'node:fs';

const PORTA = process.env.CDP_PORTA || '9333';
const BASE = `http://127.0.0.1:${PORTA}`;
const TEMPO = Number(process.env.CDP_TEMPO || 30) * 1000;
const [, , cmd, a, b, c] = process.argv;
const expr = (x) => (x && x.startsWith('@') ? fs.readFileSync(x.slice(1), 'utf8') : x);

const relogio = setTimeout(() => { console.error(`cdp.mjs: "${cmd}" passou de ${TEMPO / 1000}s — parei. Confira a aba com "lista" e "foto" antes de repetir.`); process.exit(2); }, TEMPO);
const sair = (codigo = 0) => { clearTimeout(relogio); process.exit(codigo); };

let lista;
try {
  lista = await (await fetch(`${BASE}/json/list`)).json();
} catch {
  console.error(`cdp.mjs: o navegador de trabalho não responde em ${BASE}. Abra-o com --remote-debugging-port=${PORTA} e um --user-data-dir próprio.`);
  sair(1);
}

if (cmd === 'lista') {
  for (const x of lista.filter((x) => ['page', 'iframe'].includes(x.type))) console.log(x.id, '|', x.type, '|', (x.title || '').slice(0, 50), '|', x.url.slice(0, 110));
  sair();
}
if (cmd === 'nova') {
  const t = await (await fetch(`${BASE}/json/new?${encodeURI(a)}`, { method: 'PUT' })).json();
  console.log(t.id);
  sair();
}
if (cmd === 'ativar') {
  const r = await fetch(`${BASE}/json/activate/${a}`);
  console.log(r.ok ? 'ok' : `não ativou: ${await r.text()}`);
  sair(r.ok ? 0 : 1);
}

const alvo = lista.find((t) => t.id === a);
if (!alvo) { console.error(`aba ${a} não encontrada (rode "node cdp.mjs lista")`); sair(1); }
const ws = new WebSocket(alvo.webSocketDebuggerUrl);
let n = 0;
const pend = new Map();
const contextos = [];
ws.onmessage = (e) => {
  const m = JSON.parse(e.data);
  if (m.method === 'Runtime.executionContextCreated') contextos.push(m.params.context);
  if (m.id && pend.has(m.id)) { pend.get(m.id)(m); pend.delete(m.id); }
};
const call = (method, params = {}) => new Promise((res) => { const id = ++n; pend.set(id, res); ws.send(JSON.stringify({ id, method, params })); });
await new Promise((r) => (ws.onopen = r));
const valor = (r) => (r.result && r.result.result ? (r.result.result.value ?? r.result.exceptionDetails?.exception?.description ?? r.result.result.description) : r);
const mostra = (v) => console.log(typeof v === 'string' ? v : JSON.stringify(v, null, 1));

try {
  if (cmd === 'ir') { await call('Page.navigate', { url: b }); console.log('ok'); }
  if (cmd === 'foto') { const r = await call('Page.captureScreenshot', { format: 'png' }); fs.writeFileSync(b, Buffer.from(r.result.data, 'base64')); console.log('ok', b); }
  if (cmd === 'clique') {
    const [x, y] = b.split(',').map(Number);
    await call('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y });
    for (const type of ['mousePressed', 'mouseReleased']) await call('Input.dispatchMouseEvent', { type, x, y, button: 'left', clickCount: 1 });
    console.log('ok');
  }
  if (cmd === 'tecla') { for (const type of ['keyDown', 'keyUp']) await call('Input.dispatchKeyEvent', { type, key: b, code: b }); console.log('ok'); }
  if (cmd === 'digitar') { await call('Input.insertText', { text: expr(b) }); console.log('ok'); }
  if (cmd === 'texto') mostra(valor(await call('Runtime.evaluate', { expression: 'document.body.innerText', returnByValue: true })));
  if (cmd === 'js') mostra(valor(await call('Runtime.evaluate', { expression: expr(b), returnByValue: true, awaitPromise: true })));
  if (cmd === 'jsm') {
    await call('Runtime.enable');
    await new Promise((r) => setTimeout(r, 800));
    const arvore = await call('Page.getFrameTree');
    const frames = [];
    const anda = (no) => { frames.push(no.frame); (no.childFrames || []).forEach(anda); };
    anda(arvore.result.frameTree);
    const ids = frames.filter((f) => f.url.startsWith(b)).map((f) => f.id);
    const ctx = contextos.find((x) => x.auxData && x.auxData.isDefault && ids.includes(x.auxData.frameId));
    if (!ctx) console.log(`frame ${b} não encontrado nesta aba`);
    else mostra(valor(await call('Runtime.evaluate', { expression: expr(c), returnByValue: true, awaitPromise: true, contextId: ctx.id })));
  }
} finally {
  ws.close();
  clearTimeout(relogio);
}
