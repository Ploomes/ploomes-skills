import { Navigate, Route, Routes } from 'react-router';

import './treinamento/treinamento.css';
import { usePloomesBridge } from './lib';
import { OnboardingProvider } from './onboarding/kit';
import { roteiro } from './onboarding/roteiro';
import MapaJornada from './treinamento/MapaJornada';
import FunilSimulador from './treinamento/FunilSimulador';
import { useRegistroDaAbertura } from './treinamento/progresso';

/**
 * O bloco "mapa da jornada e simulador": o mapa (raiz), com os funis da conta do cliente em fases e as passagens entre
 * eles, e o simulador de cada funil — o card de exemplo, o checklist, as automações e as dicas com holofote. Por cima,
 * o onboarding do kit: boas-vindas na primeira visita e o tour do mapa. A abertura e a conclusão vão ao cadastro do
 * Usuário pelo flow do registro (progresso.ts). Cada tela tem rota própria: o voltar do navegador anda por elas e um
 * link copiado reabre onde a pessoa estava.
 */
function App() {
  const { config, isLoading } = usePloomesBridge();
  useRegistroDaAbertura();
  return (
    <OnboardingProvider roteiro={roteiro} usuarioId={config?.userId ?? 0} pronto={!isLoading}>
      <Routes>
        <Route path="/" element={<MapaJornada />} />
        <Route path="/funil/:id" element={<FunilSimulador />} />
        {/* Rota que este build não conhece (um link antigo, um host mais novo): cai na raiz. */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </OnboardingProvider>
  );
}

export default App;
