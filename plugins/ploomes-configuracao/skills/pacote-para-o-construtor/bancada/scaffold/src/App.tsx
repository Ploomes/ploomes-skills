import { Navigate, Route, Routes } from 'react-router';

/**
 * Tela em branco — ponto de partida para edição pelo código-fonte.
 *
 * Escreva o conteúdo do módulo dentro de <main>. Para novas telas, acrescente
 * uma <Route> abaixo: cada tela com rota própria é o que faz o voltar do
 * navegador andar por elas e um link copiado reabrir onde o usuário estava.
 *
 * O que já vem montado em volta (src/main.tsx):
 * - PloomesProvider → config do host (userKey, userId, apiUrls, whitelabel),
 *                     lida com o hook usePloomesBridge() de 'src/lib'
 * - PloomesRouter   → roteamento integrado à URL do CRM
 * - src/index.css   → tokens do design system: var(--color-brand),
 *                     var(--color-background), var(--color-font), …
 */
function Home() {
  return <main className="app" />;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      {/* Rota que este build não conhece (um link antigo, um host mais novo):
          cai na raiz em vez de renderizar nada. */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
