// Junta as licenças de todos os pacotes que o esbuild embutiu em saida/index.js.
const fs = require('fs');
const m = JSON.parse(fs.readFileSync('meta.json', 'utf8'));
const pacotes = new Set();
for (const f of Object.keys(m.inputs)) {
  const x = f.replace(/\\/g, '/').match(/node_modules\/((?:@[^/]+\/)?[^/]+)/);
  if (x) pacotes.add(x[1]);
}
// A lógica de use-sync-external-store/shim/with-selector foi portada para ESM
// (use-sync-external-store-with-selector.mjs): o pacote não entra compilado, mas a licença dele vai.
pacotes.add('use-sync-external-store');
let out = 'Pacotes embutidos em index.js — compilados com esbuild 0.25.10 a partir de @xyflow/react 12.12.0.\n'
  + 'Cada um com a sua licença, reproduzida abaixo (exigência da MIT e da ISC).\n';
for (const n of [...pacotes].sort()) {
  const pj = JSON.parse(fs.readFileSync(`node_modules/${n}/package.json`, 'utf8'));
  const arq = ['LICENSE', 'LICENSE.md', 'license', 'LICENSE.txt', 'license.md'].map((f) => `node_modules/${n}/${f}`).find((f) => fs.existsSync(f));
  out += `\n================================================================\n${n} ${pj.version} — ${pj.license}\n================================================================\n`
    + (arq ? fs.readFileSync(arq, 'utf8').trim() : `(o pacote não traz arquivo de licença; licença declarada: ${pj.license})`) + '\n';
  console.log(n, pj.version, pj.license, arq ? 'ok' : 'SEM ARQUIVO');
}
fs.writeFileSync('saida/LICENCAS.txt', out);
