// Lê e escreve os arquivos do editor de código do construtor de telas do Ploomes (Monaco dentro do frame
// https://ai-chat.ploomes.com), pela aba de trabalho aberta com cdp.mjs. Porta: CDP_PORTA (padrão 9333).
//   node editor.mjs listar <aba>                                → arquivos carregados no editor (caminho e tamanho)
//   node editor.mjs baixar <aba> <pasta-nova>                   → grava os arquivos carregados numa pasta NOVA (recusa pasta que já
//                                                                 tem arquivo: uma cópia salva não se sobrescreve; --sobrescrever força)
//   node editor.mjs comparar <aba> <pasta-local> <src/…/arquivo> → diz se o editor está igual à cópia local
//   node editor.mjs comparar-todos <aba> <pasta-local>           → compara TODOS os arquivos abertos com a pasta local; rode antes de
//                                                                 trocar, depois de trocar e de novo depois de salvar
//   node editor.mjs trocar <aba> <pasta-local> <src/…/arquivo>   → troca o conteúdo do arquivo pelo da pasta local
//   node editor.mjs erros <aba>                                 → erros que o Monaco aponta (TypeScript/sintaxe)
// Atenção:
// - O Monaco só tem o arquivo depois que ele foi ABERTO na árvore (clique no nome). "baixar" grava só os abertos.
// - "trocar" só é registrado pelo construtor no arquivo que está aberto na tela: abra o arquivo, troque, confira
//   o painel "Alterações do código" e só então passe para o próximo.
// - Abrir um arquivo na árvore pode RECARREGAR a versão anterior: depois de trocar todos, rode comparar-todos antes
//   de salvar; e de novo depois de salvar — uma versão já foi salva sem o estilo do tour com "comparar" dizendo IGUAL.
// - Caminho sem barra no começo (src/App.tsx): no Git Bash, "/src/…" vira "C:/Program Files/Git/src/…".
// Todo comando tem limite de tempo (CDP_TEMPO, em segundos; padrão 30).
import fs from 'node:fs';
import path from 'node:path';

const PORTA = process.env.CDP_PORTA || '9333';
const TEMPO = Number(process.env.CDP_TEMPO || 30) * 1000;
const FRAME = 'https://ai-chat.ploomes.com';
const [, , cmd, aba, pasta, arquivo] = process.argv;

const relogio = setTimeout(() => { console.error(`editor.mjs: "${cmd}" passou de ${TEMPO / 1000}s — parei. Confira a aba antes de repetir.`); process.exit(2); }, TEMPO);
const sair = (codigo = 0) => { clearTimeout(relogio); process.exit(codigo); };

if (cmd === 'baixar' && fs.existsSync(pasta) && fs.readdirSync(pasta).length && !process.argv.includes('--sobrescrever')) {
  console.error(`editor.mjs: ${pasta} já tem arquivos — baixe numa pasta nova (codigo-vN) ou passe --sobrescrever.`);
  sair(1);
}

let lista;
try {
  lista = await (await fetch(`http://127.0.0.1:${PORTA}/json/list`)).json();
} catch {
  console.error(`editor.mjs: o navegador de trabalho não responde na porta ${PORTA}.`);
  sair(1);
}
const alvo = lista.find((t) => t.id === aba);
if (!alvo) { console.error(`aba ${aba} não encontrada`); sair(1); }
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
await call('Runtime.enable');
await new Promise((r) => setTimeout(r, 800));
const arvore = await call('Page.getFrameTree');
const frames = [];
const anda = (no) => { frames.push(no.frame); (no.childFrames || []).forEach(anda); };
anda(arvore.result.frameTree);
const ids = frames.filter((f) => f.url.startsWith(FRAME)).map((f) => f.id);
const ctx = contextos.find((x) => x.auxData && x.auxData.isDefault && ids.includes(x.auxData.frameId));
if (!ctx) { ws.close(); console.error('o editor do construtor não está aberto nesta aba (abra "Visualizar código")'); sair(1); }
const roda = async (codigo) => {
  const r = await call('Runtime.evaluate', { expression: codigo, returnByValue: true, awaitPromise: true, contextId: ctx.id });
  if (r.result?.exceptionDetails) throw new Error(r.result.exceptionDetails.exception?.description || r.result.exceptionDetails.text);
  return r.result.result.value;
};
const lf = (t) => t.replace(/\r\n/g, '\n').replace(/\n$/, '');
const local = (p) => fs.readFileSync(path.join(pasta, p), 'utf8').replace(/\r\n/g, '\n');
const noEditor = (p) => '/' + p.replace(/^\/+/, '').replace(/\\/g, '/');
const todos = () => roda(`window.monaco.editor.getModels().filter((m) => m.uri.scheme === 'file').map((m) => [m.uri.path, m.getValue()])`);

try {
  if (cmd === 'listar') for (const [p, t] of await todos()) console.log(p, t.length);
  if (cmd === 'baixar') {
    const lidos = await todos();
    for (const [p, t] of lidos) {
      const destino = path.join(pasta, p.replace(/^\/+/, ''));
      fs.mkdirSync(path.dirname(destino), { recursive: true });
      fs.writeFileSync(destino, t.replace(/\r\n/g, '\n'));
    }
    console.log(`${lidos.length} arquivo(s) gravados em ${pasta} — confira o total com o topo da árvore ("ARQUIVOS · N")`);
  }
  if (cmd === 'comparar') {
    const atual = await roda(`window.monaco.editor.getModels().find((m) => m.uri.path === ${JSON.stringify(noEditor(arquivo))})?.getValue() ?? null`);
    if (atual === null) console.log(`${arquivo}: não está aberto no editor (clique nele na árvore)`);
    else console.log(`${arquivo}: ${lf(atual) === lf(local(arquivo)) ? 'IGUAL à cópia local' : 'DIFERENTE da cópia local — baixe e confira antes de trocar'}`);
  }
  if (cmd === 'comparar-todos') {
    let diferentes = 0;
    for (const [p, t] of await todos()) {
      const rel = p.replace(/^\/+/, '');
      const arq = path.join(pasta, rel);
      const estado = !fs.existsSync(arq) ? 'só no editor' : lf(t) === lf(local(rel)) ? 'IGUAL' : 'DIFERENTE';
      if (estado !== 'IGUAL') diferentes++;
      console.log(`${estado.padEnd(12)} ${rel}`);
    }
    console.log(diferentes ? `${diferentes} arquivo(s) fora da cópia local — não salve antes de entender cada um` : 'todos os arquivos abertos iguais à cópia local');
    sair(diferentes ? 3 : 0);
  }
  if (cmd === 'trocar') {
    const texto = local(arquivo);
    const r = await roda(`(() => {
      const m = window.monaco.editor.getModels().find((x) => x.uri.path === ${JSON.stringify(noEditor(arquivo))});
      if (!m) return 'não está aberto no editor (clique nele na árvore primeiro)';
      const t = ${JSON.stringify(texto)};
      // arquivo criado pelo chat pode nascer com quebra de linha do Windows (CRLF): padroniza em LF antes de trocar
      if (m.getEOL() !== String.fromCharCode(10)) m.pushEOL(window.monaco.editor.EndOfLineSequence.LF);
      m.pushEditOperations([], [{ range: m.getFullModelRange(), text: t }], () => null);
      return m.getValue() === t ? 'trocado' : 'DIFERENTE depois da troca';
    })()`);
    console.log(`${arquivo}: ${r}`);
  }
  if (cmd === 'erros') {
    const r = await roda(`window.monaco.editor.getModelMarkers({}).filter((x) => x.severity >= 8).map((x) => x.resource.path + ':' + x.startLineNumber + ' ' + x.message).slice(0, 30)`);
    console.log(r.length ? r.join('\n') : 'nenhum erro apontado pelo editor');
  }
} finally {
  ws.close();
  clearTimeout(relogio);
}
