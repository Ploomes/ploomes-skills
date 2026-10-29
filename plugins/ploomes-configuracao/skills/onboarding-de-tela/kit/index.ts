// Kit de onboarding — NÃO EDITE nesta tela (cópia de kit/ da skill onboarding-de-tela).
// Uso:
//   import { OnboardingProvider, BotaoDeAjuda, Dica, useOnboarding } from './onboarding/kit';
//   import { roteiro } from './onboarding/roteiro';
//   <OnboardingProvider roteiro={roteiro} usuarioId={config.userId} pronto={conexao.fase === 'pronta'}
//     perfil={perfilDeQuemUsa} ativo={ligado} aoConcluirTour={(fim) => …}> … </OnboardingProvider>
//   (perfil, ativo e aoConcluirTour são opcionais)
// e marque os alvos com data-onboarding="<id>"; chame useOnboarding().marcar('<tarefa>') quando a pessoa fizer.
// O registro no Usuário (regra 11): useRegistroDaAbertura({ webhook, tela, usuarioId, pronto }) e, no fim,
// registrar({ webhook, tela, usuarioId, evento: 'concluiu' }) — ver registro.ts.
export { OnboardingProvider, useOnboarding } from './OnboardingProvider';
export type { Onboarding, FimDoTour } from './OnboardingProvider';
export { BotaoDeAjuda, Dica } from './Ajuda';
export type { Roteiro, PassoDoTour, CartaoDeBoasVindas, TarefaDosPrimeirosPassos, Dica as DicaDoRoteiro, Progresso } from './tipos';
export { registrar, useRegistroDaAbertura } from './registro';
export type { EventoDoRegistro, SituacaoDoRegistro, PedidoDeRegistro } from './registro';
