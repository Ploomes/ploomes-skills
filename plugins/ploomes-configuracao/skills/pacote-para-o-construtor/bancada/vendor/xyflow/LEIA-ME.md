# React Flow embutido (`@xyflow/react` 12.12.0)

O construtor de telas só tem `react`, `react-dom`, `react-router` e `@ploomescrm/bridge`. Para uma
tela usar o React Flow, ele vai **dentro do código da tela**: a tela copia esta pasta para
`src/vendor/xyflow/`, **sem editar**, e importa de `./vendor/xyflow` (com `import './vendor/xyflow/style.css'`).
O `empacotar_importacao.py` confere a cópia arquivo a arquivo e só então a deixa fora das outras
checagens (os comentários dos tipos citam `@xyflow/react`, e o CSS padrão tem cor fixa — a tela
liga as variáveis `--xy-*` aos tokens no CSS dela).

| Arquivo | O que é |
|---|---|
| `index.js` | `@xyflow/react` e as dependências (`@xyflow/system`, `zustand`, `classcat`, `d3-*`, `use-sync-external-store`) num ESM minificado; só importa `react`, `react-dom` e `react/jsx-runtime` |
| `index.d.ts` | os tipos, num arquivo só (só importa de `react`) |
| `style.css` | o CSS do React Flow, sem alteração |
| `LICENCAS.txt` | as licenças de cada pacote embutido (MIT, ISC, BSD-3-Clause) — vão junto, como as licenças exigem |

Este `LEIA-ME.md` não vai para a tela.

## Recompilar (outra versão)

Numa pasta vazia, com Node 18+ (no Windows, `npm` pelo PowerShell):

```bash
npm init -y
npm install --save-exact @xyflow/react@<versão> react@19.2.0 react-dom@19.2.0 @types/react@19.2.2 @types/react-dom@19.2.2 esbuild@0.25.10 dts-bundle-generator@9.5.1 typescript@5.9.3
cp <skill>/scripts/embutir-xyflow/* .
npx esbuild entrada.ts --bundle --format=esm --platform=browser --target=es2020 --minify --legal-comments=none --external:react --external:react-dom --external:react/jsx-runtime "--alias:use-sync-external-store/shim/with-selector.js=./use-sync-external-store-with-selector.mjs" --metafile=meta.json --outfile=saida/index.js
npx dts-bundle-generator -o saida/index.d.ts entrada.ts --project tsconfig.json --external-inlines @xyflow/react @xyflow/system zustand classcat d3-zoom d3-selection d3-drag d3-interpolate d3-color d3-dispatch d3-ease d3-timer d3-transition --external-imports react react-dom --no-banner --export-referenced-types false --no-check
node licencas.cjs
cp node_modules/@xyflow/react/dist/style.css saida/
```

⚠️ **O `--alias` é obrigatório.** O `use-sync-external-store` (que o `zustand` usa) só existe em CommonJS e
chama `require("react")` ao carregar; com o React externo, isso vira um require dinâmico que o navegador
não tem, e a tela fica em branco. O `use-sync-external-store-with-selector.mjs` é a mesma lógica em ESM.
Depois de compilar, `grep -c require saida/index.js` tem de dar 0.

Ponha o cabeçalho de licença no topo do `index.js` (veja o atual), confira numa cópia da base
(`npx tsc --noEmit` e `npx vite build`), troque os arquivos desta pasta e rode `node scripts/autoteste.mjs`.
Use versão publicada há pelo menos duas semanas.
