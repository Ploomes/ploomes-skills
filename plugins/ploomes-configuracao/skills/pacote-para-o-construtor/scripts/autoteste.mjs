// Autoteste da skill: rode depois de mexer no gerador, no portão, na bancada ou nos modelos.
//   node scripts/autoteste.mjs
// Gera o api.ts do exemplo, passa no portão, sobe a bancada numa porta livre e roda o teste de
// fumaça contra ela, conferindo os resultados que o exemplo precisa dar. Não toca conta nenhuma.
import { spawn, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { appendFileSync, cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';

const SK = join(dirname(fileURLToPath(import.meta.url)), '..');
const EX = join(SK, 'exemplo', 'pacote-construtor');
const PORTA = 8795;
let falhas = 0;
const ok = (m) => console.log('  OK     ' + m);
const erro = (m) => { falhas++; console.log('  FALHOU ' + m); };
const py = process.platform === 'win32' ? 'python' : 'python3';
const rodar = (cmd, args, env = {}) => spawnSync(cmd, args, { encoding: 'utf-8', env: { ...process.env, PYTHONIOENCODING: 'utf-8', ...env } });

console.log('1. Gerador');
let r = rodar(py, [join(SK, 'scripts', 'gerar_api.py'), join(EX, 'contrato-de-dados.json'), join(EX, 'src', 'ploomes', 'api.ts')]);
r.status === 0 ? ok('api.ts do exemplo gerado') : erro('gerar_api.py: ' + r.stderr);

console.log('2. Portão');
r = rodar(py, [join(SK, 'scripts', 'validar_pacote.py'), EX]);
/APROVADO — 0 bloqueio/.test(r.stdout) ? ok('exemplo aprovado') : erro('portão:\n' + r.stdout);

console.log('3. Bancada + teste de fumaça');
const bancada = spawn(process.execPath, [join(SK, 'bancada', 'servidor.mjs'), '--pacote', EX, '--tela', join(SK, 'bancada', 'scaffold'), '--porta-host', String(PORTA), '--porta-tela', String(PORTA + 1)], { stdio: 'ignore' });
try {
  await new Promise((ok) => setTimeout(ok, 1500));
  const api = `http://localhost:${PORTA}/api/`;
  const q = await fetch(api + "Deals?$select=Id&$filter=" + encodeURIComponent("Title eq 'PED-2026-002 · Insumo B 80 t'"), { headers: { 'User-Key': 'chave-da-bancada' } });
  const dealId = (await q.json()).value?.[0]?.Id;
  dealId ? ok(`negócio de teste ${dealId}`) : erro('negócio de teste não encontrado na bancada');
  r = rodar(process.execPath, [join(SK, 'scripts', 'testar_na_conta.ts'), EX],
    { PLOOMES_API_URL: api, PLOOMES_USER_KEY: 'chave-da-bancada', PLOOMES_USER_ID: '1', PLOOMES_DEAL_ID: String(dealId ?? 0) });
  const saida = r.stdout;
  const espera = [
    [/PASSOU — 0 falha/, 'teste de fumaça sem falha'],
    [/embarquesDaEtapa \/ Aguardando carregamento: 42 itens/, 'leitura por etapa'],
    [/validarChecklist: valido=false — pendentes: Nota fiscal, Data de embarque/, 'validarChecklist lê a lista de pendências'],
    [/Data de embarque \[TypeId 8\] PENDENTE/, 'item de checklist com tipo e veredito do servidor'],
    [/embarquePorId\(\d+\): "PED-2026-002/, 'leitura umRegistro'],
    [/textosDoFunil\(embarques\): \{"unidade"/, 'textos do funil'],
    [/nenhuma escrita/, 'nenhuma escrita'],
    [/4\. Configuração dos checklists[\s\S]*Aguardando carregamento › "Nota fiscal": diferente de vazio/, 'conferência da configuração dos checklists'],
  ];
  for (const [re, nome] of espera) re.test(saida) ? ok(nome) : erro(nome);
  if (falhas) console.log('\n--- saída do teste de fumaça ---\n' + saida + r.stderr);
} finally {
  bancada.kill();
}

// Segundo exemplo: checklist com campo do CLIENTE e leitura com parâmetro de data.
console.log('4. Exemplo de reposição (campo de cliente no checklist)');
const EX2 = join(SK, 'exemplo-reposicao', 'pacote-construtor');
r = rodar(py, [join(SK, 'scripts', 'gerar_api.py'), join(EX2, 'contrato-de-dados.json'), join(EX2, 'src', 'ploomes', 'api.ts')]);
r.status === 0 ? ok('api.ts gerado') : erro('gerar_api.py: ' + r.stderr);
r = rodar(py, [join(SK, 'scripts', 'validar_pacote.py'), EX2]);
/APROVADO — 0 bloqueio/.test(r.stdout) ? ok('portão aprovado') : erro('portão:\n' + r.stdout);
const bancada2 = spawn(process.execPath, [join(SK, 'bancada', 'servidor.mjs'), '--pacote', EX2, '--tela', join(SK, 'bancada', 'scaffold'), '--porta-host', String(PORTA + 2), '--porta-tela', String(PORTA + 3)], { stdio: 'ignore' });
try {
  await new Promise((ok) => setTimeout(ok, 1500));
  const api = `http://localhost:${PORTA + 2}/api/`;
  const q = await fetch(api + "Deals?$select=Id&$filter=" + encodeURIComponent("Title eq 'Reposição outubro · luvas e protetores'"), { headers: { 'User-Key': 'chave-da-bancada' } });
  const dealId = (await q.json()).value?.[0]?.Id;
  r = rodar(process.execPath, [join(SK, 'scripts', 'testar_na_conta.ts'), EX2],
    { PLOOMES_API_URL: api, PLOOMES_USER_KEY: 'chave-da-bancada', PLOOMES_DEAL_ID: String(dealId ?? 0) });
  const saida = r.stdout;
  const espera = [
    [/PASSOU — 0 falha/, 'teste de fumaça sem falha'],
    [/Itens de consumo recorrente \[TypeId 2\] ok — valor: Luva nitrílica/, 'item de checklist lido do CLIENTE'],
    [/Periodicidade de reposição \[TypeId 7\] ok — valor: Mensal/, 'opção de campo do cliente pelo nome'],
    [/janelaDeReposicao \(ate = hoje \+ 7 dias\): \d+ itens/, 'leitura com parâmetro de data'],
  ];
  for (const [re, nome] of espera) re.test(saida) ? ok(nome) : erro(nome);
  if (falhas) console.log('\n--- saída do teste de fumaça (reposição) ---\n' + saida + r.stderr);
} finally {
  bancada2.kill();
}

// Empacotador da importação: a base em branco passa; uma cópia que mexe na base e chama fetch fora
// do api.ts não passa. A cópia fica dentro da skill (o Python daqui nem sempre enxerga o temp) e é apagada.
console.log('5. Empacotador da importação');
const BASE = join(SK, 'bancada', 'scaffold');
const TMP = join(SK, '.autoteste-tmp');
rmSync(TMP, { recursive: true, force: true });
try {
  mkdirSync(TMP);
  r = rodar(py, [join(SK, 'scripts', 'empacotar_importacao.py'), BASE, join(TMP, 'base.zip')]);
  /APROVADO — \d+ arquivos/.test(r.stdout) ? ok('base em branco aprovada') : erro('empacotar (base):\n' + r.stdout + r.stderr);
  // o .zip de uma versão nunca se sobrescreve: a mesma saída de novo reprova e não toca o arquivo
  const antes = readFileSync(join(TMP, 'base.zip'));
  r = rodar(py, [join(SK, 'scripts', 'empacotar_importacao.py'), BASE, join(TMP, 'base.zip')]);
  r.status !== 0 && /já existe/.test(r.stdout) && readFileSync(join(TMP, 'base.zip')).equals(antes)
    ? ok('zip existente não se sobrescreve') : erro('empacotar (sobrescrever):\n' + r.stdout + r.stderr);
  const RUIM = join(TMP, 'tela');
  cpSync(join(BASE, 'src'), join(RUIM, 'src'), { recursive: true });
  appendFileSync(join(RUIM, 'src', 'main.tsx'), '\n// mexido\n');
  appendFileSync(join(RUIM, 'src', 'App.tsx'), "\nexport const x = () => fetch('/api/Deals', { headers: { 'User-Key': 'k' } });\n");
  r = rodar(py, [join(SK, 'scripts', 'empacotar_importacao.py'), RUIM, join(TMP, 'ruim.zip')]);
  const reprovou = /REPROVADO/.test(r.stdout) && /main\.tsx foi alterado/.test(r.stdout) && /App\.tsx chama a rede/.test(r.stdout);
  reprovou ? ok('base alterada e fetch fora do api.ts reprovados') : erro('empacotar (ruim):\n' + r.stdout + r.stderr);
  existsSync(join(TMP, 'ruim.zip')) ? erro('gerou zip mesmo reprovado') : ok('reprovado não gera zip');
  // biblioteca embutida (React Flow): cópia exata passa; alterada ou desconhecida reprova
  const COM = join(TMP, 'com-vendor');
  cpSync(join(BASE, 'src'), join(COM, 'src'), { recursive: true });
  cpSync(join(SK, 'bancada', 'vendor', 'xyflow'), join(COM, 'src', 'vendor', 'xyflow'), { recursive: true, filter: (f) => !f.endsWith('LEIA-ME.md') });
  // o React Flow embutido não pode ter require(): no navegador não existe, e a tela fica em branco (2026-10-20)
  /\brequire\s*\(/.test(readFileSync(join(SK, 'bancada', 'vendor', 'xyflow', 'index.js'), 'utf-8')) ? erro('vendor/xyflow/index.js tem require() — recompile com o --alias do LEIA-ME') : ok('React Flow embutido sem require()');
  r = rodar(py, [join(SK, 'scripts', 'empacotar_importacao.py'), COM, join(TMP, 'com.zip')]);
  /APROVADO/.test(r.stdout) && !/vendor/.test(r.stdout.split('APROVADO')[0]) ? ok('React Flow embutido, cópia exata, aprovado sem aviso') : erro('empacotar (vendor):\n' + r.stdout);
  appendFileSync(join(COM, 'src', 'vendor', 'xyflow', 'index.js'), '\n// mexido\n');
  mkdirSync(join(COM, 'src', 'vendor', 'outra'));
  writeFileSync(join(COM, 'src', 'vendor', 'outra', 'x.ts'), 'export const x = 1;\n');
  r = rodar(py, [join(SK, 'scripts', 'empacotar_importacao.py'), COM, join(TMP, 'com2.zip')]);
  /xyflow\/index\.js foi alterado/.test(r.stdout) && /vendor\/outra\/ não é biblioteca conhecida/.test(r.stdout) ? ok('vendor alterado ou desconhecido reprovado') : erro('empacotar (vendor ruim):\n' + r.stdout);
} finally {
  rmSync(TMP, { recursive: true, force: true });
}

// Terceiro exemplo: tela genérica que lê a configuração da conta — leitura agregada ($apply),
// automações, histórico de etapas, webhooks e integrações na bancada.
console.log('6. Exemplo do mapa do processo (leitura agregada e configuração da conta)');
const EX3 = join(SK, 'exemplo-mapa-do-processo', 'pacote-construtor');
r = rodar(py, [join(SK, 'scripts', 'gerar_api.py'), join(EX3, 'contrato-de-dados.json'), join(EX3, 'src', 'ploomes', 'api.ts')]);
r.status === 0 ? ok('api.ts gerado') : erro('gerar_api.py: ' + r.stderr);
r = rodar(py, [join(SK, 'scripts', 'validar_pacote.py'), EX3]);
/APROVADO — 0 bloqueio/.test(r.stdout) ? ok('portão aprovado') : erro('portão:\n' + r.stdout);
const bancada3 = spawn(process.execPath, [join(SK, 'bancada', 'servidor.mjs'), '--pacote', EX3, '--tela', join(SK, 'bancada', 'scaffold'), '--porta-host', String(PORTA + 4), '--porta-tela', String(PORTA + 5)], { stdio: 'ignore' });
try {
  await new Promise((ok) => setTimeout(ok, 1500));
  const api = `http://localhost:${PORTA + 4}/api/`;
  r = rodar(process.execPath, [join(SK, 'scripts', 'testar_na_conta.ts'), EX3], { PLOOMES_API_URL: api, PLOOMES_USER_KEY: 'chave-da-bancada' });
  const saida = r.stdout;
  const espera = [
    [/PASSOU — 0 falha/, 'teste de fumaça sem falha'],
    [/abertosPorEtapa: \d+ grupo\(s\) — \{"PipelineId":\d+,"StageId":\d+,"Quantidade":\d+/, 'agregado por funil e etapa'],
    [/passagensPorEtapa \(desde = há 90 dias\): \d+ grupo\(s\) — \{"StageId":\d+,"Advanced":/, 'histórico de etapas agregado'],
    [/automacoes: 9 itens/, 'automações da bancada'],
    [/webhooks: 3 itens/, 'webhooks da bancada'],
  ];
  for (const [re, nome] of espera) re.test(saida) ? ok(nome) : erro(nome);
  // o segredo não sai na leitura combinada: webhooks com select não traz CallbackUrl
  const wh = await (await fetch(api + 'Webhooks?$select=Id,EntityId,Active', { headers: { 'User-Key': 'chave-da-bancada' } })).json();
  JSON.stringify(wh).includes('CallbackUrl') ? erro('Webhooks com $select trouxe CallbackUrl') : ok('Webhooks com $select não traz o segredo');
  const ac = await (await fetch(api + 'Automations?$select=Id&$expand=Actions($select=Id,ActionId)', { headers: { 'User-Key': 'chave-da-bancada' } })).json();
  JSON.stringify(ac).includes('RequestBody') ? erro('Actions com $select trouxe RequestBody') : ok('Actions com $select não traz o corpo');
  // campo por nome ("Sua empresa"): acha pela entidade + nome, grava e lê de volta; dado nativo da conta é barrado
  /contaComAsIs: 1 itens/.test(saida) ? ok('conta com o as-is lida') : erro('contaComAsIs');
  // a chave do campo por nome fica fora de CAMPOS: o build minificado dobrava campoDisponivel para false (2026-10-20)
  { const g = readFileSync(join(EX3, 'src', 'ploomes', 'api.ts'), 'utf-8'); /const CHAVES: Record<string, string>/.test(g) && /return !!chaveDo\(campo as string\)/.test(g) && !/def\.fieldKey =/.test(g) ? ok('chave do campo por nome guardada fora de CAMPOS') : erro('api.ts grava a chave dentro de CAMPOS'); }
  const H = { 'User-Key': 'chave-da-bancada', 'Content-Type': 'application/json' };
  const fk = (await (await fetch(api + "Fields?$select=Key&$filter=" + encodeURIComponent("EntityId eq 15 and Name eq 'Mapeamento as-is (tela)'"), { headers: H })).json()).value?.[0]?.Key;
  fk ? ok('campo achado pelo nome na entidade 15') : erro('campo por nome não achado');
  const conta = (await (await fetch(api + 'Account?$select=Id&$expand=OtherProperties', { headers: H })).json()).value[0];
  const w = await fetch(api + `Account(${conta.Id})`, { method: 'PATCH', headers: H, body: JSON.stringify({ OtherProperties: [{ FieldKey: fk, BigStringValue: '{"formato":"ploomes-mapa-asis","x":"<b>&"}' }] }) });
  const lido = (await (await fetch(api + 'Account?$select=Id&$expand=OtherProperties', { headers: H })).json()).value[0].OtherProperties.find((o) => o.FieldKey === fk)?.BigStringValue;
  w.status === 200 && lido === '{"formato":"ploomes-mapa-asis","x":"<b>&"}' ? ok('PATCH Account grava o as-is e lê igual') : erro(`PATCH Account: ${w.status} ${lido}`);
  const n = await fetch(api + `Account(${conta.Id})`, { method: 'PATCH', headers: H, body: JSON.stringify({ Name: 'outro' }) });
  n.status === 403 ? ok('dado nativo da conta barrado') : erro(`PATCH Account com Name: ${n.status}`);
  if (falhas) console.log('\n--- saída do teste de fumaça (mapa) ---\n' + saida + r.stderr);
} finally {
  bancada3.kill();
}

// O portão barra segredo, agregação mal escrita e nome reservado.
console.log('7. Portão: segredo, agregação e nome reservado');
const TMP2 = join(SK, '.autoteste-tmp2');
rmSync(TMP2, { recursive: true, force: true });
try {
  cpSync(EX3, TMP2, { recursive: true });
  const c = JSON.parse(readFileSync(join(TMP2, 'contrato-de-dados.json'), 'utf-8'));
  c.leituras.webhooks.select.push('CallbackUrl');
  c.leituras.integracoesDaConta = { rota: 'AccountIntegrations', pagina: 50 };
  c.leituras.automacoes.expand = ['Actions'];
  c.leituras.abertosPorEtapa.agregar.por.push('OtherProperties/IntegerValue');
  c.leituras.abertosPorEtapa.agregar.medidas.Valor = 'Amount with soma';
  c.leituras.funis = { rota: 'DealsPipelines', select: ['Id'], pagina: 10 };
  c.campos.semNome = { porNome: { entidade: 15 }, typeId: 2 };
  c.leituras.porCampo = { rota: 'Account', select: ['Id'], filtro: "OtherProperties/any(op: op/FieldKey eq {campo:asIs})", pagina: 1 };
  writeFileSync(join(TMP2, 'contrato-de-dados.json'), JSON.stringify(c, null, 2));
  rodar(py, [join(SK, 'scripts', 'gerar_api.py'), join(TMP2, 'contrato-de-dados.json'), join(TMP2, 'src', 'ploomes', 'api.ts')]);
  r = rodar(py, [join(SK, 'scripts', 'validar_pacote.py'), TMP2]);
  for (const [re, nome] of [[/'CallbackUrl' é segredo/, 'CallbackUrl no select'], [/AccountIntegrations sem 'select'/, 'rota com segredo sem select'],
    [/\$expand=Actions sem \$select/, 'Actions sem select'], [/agrupar por 'OtherProperties/, 'groupby por OtherProperties'],
    [/medida 'Valor' = 'Amount with soma'/, 'medida inválida'], [/'funis' já é nome do api.ts/, 'nome reservado'],
    [/'semNome': 'porNome' precisa/, 'campo por nome sem nome'], [/\{campo:asIs\} é campo por nome/, 'marcador de campo por nome']])
    re.test(r.stdout) ? ok(`bloqueia ${nome}`) : erro(`não bloqueou ${nome}:\n${r.stdout}`);
} finally {
  rmSync(TMP2, { recursive: true, force: true });
}

// Onboarding (2026-10-21): tela entregue com --pacote precisa do kit sem edição, do roteiro e do provider.
console.log('8. Onboarding no empacotador');
const TMP3 = join(SK, '.autoteste-tmp3');
rmSync(TMP3, { recursive: true, force: true });
try {
  const TELA = join(TMP3, 'tela');
  cpSync(join(BASE, 'src'), join(TELA, 'src'), { recursive: true });
  cpSync(join(EX, 'src', 'ploomes'), join(TELA, 'src', 'ploomes'), { recursive: true });
  cpSync(join(SK, '..', 'onboarding-de-tela', 'kit'), join(TELA, 'src', 'onboarding', 'kit'), { recursive: true, filter: (f) => !f.endsWith('LEIA-ME.md') });
  writeFileSync(join(TELA, 'src', 'onboarding', 'roteiro.ts'), "import type { Roteiro } from './kit';\nexport const roteiro: Roteiro = { tela: 't', versao: '1', nome: 'T', boasVindas: [], tour: [{ id: 'p1', alvo: 'quadro', titulo: 'Q', texto: 'q' }, { id: 'p2', alvo: 'sumido', titulo: 'S', texto: 's' }], primeirosPassos: [{ id: 'abrir', titulo: 'Abra' }], dicas: {} };\n");
  writeFileSync(join(TELA, 'src', 'App.tsx'), "import { Navigate, Route, Routes } from 'react-router';\nimport { OnboardingProvider, useOnboarding } from './onboarding/kit';\nimport { roteiro } from './onboarding/roteiro';\nfunction T() { const o = useOnboarding(); return <main className=\"app\"><div data-onboarding=\"quadro\" onClick={() => o.marcar('abrir')} /></main>; }\nexport default function App() { return <OnboardingProvider roteiro={roteiro} usuarioId={0} pronto><Routes><Route path=\"/\" element={<T />} /><Route path=\"*\" element={<Navigate to=\"/\" replace />} /></Routes></OnboardingProvider>; }\n");
  r = rodar(py, [join(SK, 'scripts', 'empacotar_importacao.py'), TELA, join(TMP3, 'ok.zip'), '--pacote', EX]);
  /APROVADO/.test(r.stdout) ? ok('tela com kit, roteiro e provider aprovada') : erro('empacotar (onboarding):\n' + r.stdout);
  /alvo 'sumido', que nenhum data-onboarding/.test(r.stdout) ? ok('alvo do roteiro sem data-onboarding avisado') : erro('não avisou o alvo sumido:\n' + r.stdout);
  appendFileSync(join(TELA, 'src', 'onboarding', 'kit', 'Tour.tsx'), '\n// mexido\n');
  rmSync(join(TELA, 'src', 'onboarding', 'roteiro.ts'));
  r = rodar(py, [join(SK, 'scripts', 'empacotar_importacao.py'), TELA, join(TMP3, 'ruim.zip'), '--pacote', EX]);
  /kit\/Tour\.tsx foi alterado/.test(r.stdout) && /falta src\/onboarding\/roteiro\.ts/.test(r.stdout) ? ok('kit editado e roteiro ausente reprovados') : erro('empacotar (onboarding ruim):\n' + r.stdout);
  rmSync(join(TELA, 'src', 'onboarding'), { recursive: true });
  r = rodar(py, [join(SK, 'scripts', 'empacotar_importacao.py'), TELA, join(TMP3, 'sem.zip'), '--pacote', EX]);
  /a tela não tem onboarding/.test(r.stdout) ? ok('tela sem onboarding reprovada') : erro('empacotar (sem onboarding):\n' + r.stdout);
} finally {
  rmSync(TMP3, { recursive: true, force: true });
}

// Tela em produção (2026-10-21): o export do construtor ganha o onboarding. A referência é o export,
// não a base daqui; o que o export já tinha (fetch fora do api.ts, cor fixa) é herdado; o que mudou, não.
console.log('9. Onboarding numa tela em produção (--tela-existente)');
const TMP4 = join(SK, '.autoteste-tmp4');
rmSync(TMP4, { recursive: true, force: true });
try {
  const EXP = join(TMP4, 'export', 'minha-tela', 'src');
  mkdirSync(join(EXP, 'app'), { recursive: true });
  writeFileSync(join(EXP, 'main.tsx'), "import { createRoot } from 'react-dom/client';\nimport './index.css';\nimport App from './App';\nimport { PloomesProvider, PloomesRouter } from './lib';\ncreateRoot(document.getElementById('root')!).render(<PloomesProvider><PloomesRouter><App /></PloomesRouter></PloomesProvider>);\n");
  writeFileSync(join(EXP, 'index.css'), readFileSync(join(BASE, 'src', 'index.css'), 'utf-8'));
  writeFileSync(join(EXP, 'app', 'dados.ts'), "export const ler = () => fetch('https://public-api2.ploomes.com/Deals');\n");
  writeFileSync(join(EXP, 'App.tsx'), "import { Navigate, Route, Routes } from 'react-router';\nimport { ler } from './app/dados';\nfunction Quadro() { return <main style={{ color: '#123456' }} onClick={() => ler()}><nav className=\"abas\">Abas</nav></main>; }\nexport default function App() {\n  return (\n    <Routes>\n      <Route path=\"/\" element={<Quadro />} />\n      <Route path=\"*\" element={<Navigate to=\"/\" replace />} />\n    </Routes>\n  );\n}\n");
  const TRAB = join(TMP4, 'trabalho');
  r = rodar(py, [join(SK, 'scripts', 'preparar_tela_existente.py'), join(TMP4, 'export'), TRAB]);
  existsSync(join(TRAB, 'tela', 'src', 'onboarding', 'kit', 'Tour.tsx')) && existsSync(join(TRAB, 'tela', 'src', 'lib')) && existsSync(join(TRAB, 'original', 'minha-tela', 'src', 'App.tsx'))
    ? ok('preparar: original guardado, kit copiado e src/lib da base para compilar') : erro('preparar_tela_existente:\n' + r.stdout + r.stderr);
  const T4 = join(TRAB, 'tela'), ORIG = join(TRAB, 'original');
  r = rodar(py, [join(SK, 'scripts', 'empacotar_importacao.py'), T4, join(TMP4, 'sem.zip'), '--tela-existente', ORIG]);
  /falta src\/onboarding\/roteiro\.ts/.test(r.stdout) ? ok('tela em produção sem roteiro reprovada') : erro('empacotar (existente sem roteiro):\n' + r.stdout);
  writeFileSync(join(T4, 'src', 'onboarding', 'roteiro.ts'), "import type { Roteiro } from './kit';\nexport const roteiro: Roteiro = { tela: 'minha', versao: '1', nome: 'M', boasVindas: [], tour: [{ id: 'abas', alvo: 'abas', titulo: 'A', texto: 'a' }], primeirosPassos: [], dicas: {} };\n");
  const app = readFileSync(join(T4, 'src', 'App.tsx'), 'utf-8')
    .replace("import { ler } from './app/dados';\n", "import { ler } from './app/dados';\nimport { OnboardingProvider } from './onboarding/kit';\nimport { roteiro } from './onboarding/roteiro';\n")
    .replace('<nav className="abas">', '<nav className="abas" data-onboarding="abas">')
    .replace('    <Routes>', '    <OnboardingProvider roteiro={roteiro} usuarioId={0} pronto>\n    <Routes>')
    .replace('    </Routes>', '    </Routes>\n    </OnboardingProvider>');
  writeFileSync(join(T4, 'src', 'App.tsx'), app);
  r = rodar(py, [join(SK, 'scripts', 'empacotar_importacao.py'), T4, join(TMP4, 'ok.zip'), '--tela-existente', ORIG]);
  /APROVADO/.test(r.stdout) && /src\/App\.tsx: \+5 -1/.test(r.stdout) ? ok('tela em produção com onboarding aprovada, herdando o fetch e a cor do export') : erro('empacotar (existente ok):\n' + r.stdout);
  const nomes = rodar(py, ['-c', 'import sys,zipfile; print("\\n".join(zipfile.ZipFile(sys.argv[1]).namelist()))', join(TMP4, 'ok.zip')]).stdout;
  /^minha-tela\/src\/App\.tsx$/m.test(nomes) && /^minha-tela\/src\/onboarding\/kit\/Tour\.tsx$/m.test(nomes) && !/\/src\/lib\//.test(nomes)
    ? ok('zip com a forma do export (pasta raiz) e sem a src/lib/ local') : erro('zip da tela em produção:\n' + nomes);
  rmSync(join(T4, 'src', 'app', 'dados.ts'));
  writeFileSync(join(T4, 'src', 'Extra.tsx'), 'export const x = 1;\n');
  writeFileSync(join(T4, 'src', 'App.tsx'), app.replace('onClick={() => ler()}', "onClick={() => { ler(); fetch('/x'); }}"));
  r = rodar(py, [join(SK, 'scripts', 'empacotar_importacao.py'), T4, join(TMP4, 'ruim.zip'), '--tela-existente', ORIG]);
  /src\/app\/dados\.ts sumiu/.test(r.stdout) && /src\/Extra\.tsx é novo/.test(r.stdout) && /App\.tsx chama a rede/.test(r.stdout)
    ? ok('arquivo do export apagado, arquivo novo fora de onboarding/ e fetch novo reprovados') : erro('empacotar (existente ruim):\n' + r.stdout);
} finally {
  rmSync(TMP4, { recursive: true, force: true });
}

console.log(`\n${falhas ? 'FALHOU' : 'PASSOU'} — ${falhas} falha(s).`);
process.exit(falhas ? 1 : 0);
