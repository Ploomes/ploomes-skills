// Kit de onboarding — NÃO EDITE nesta tela (cópia de kit/ da skill onboarding-de-tela).
// O registro do onboarding no cadastro do Usuário (regra 11 da skill): a tela manda o evento ao webhook de um flow do
// Ploomes Flows, e o flow grava os quatro campos — Vezes que assistiu, Vezes que consultou, Concluiu e Última
// conclusão — com a chave de integração. A tela nunca grava no Usuário: com a chave de quem abriu, o perfil que não
// pode alterar o próprio usuário recebe 403, e nada se grava.
//   abriu    — uma vez por sessão do navegador, quando a pessoa abre a tela (useRegistroDaAbertura);
//   concluiu — quando a tela diz que o onboarding fechou (o tour inteiro, os funis do caminho…): registrar(…).
// O evento vai como text/plain: application/json faz o navegador mandar antes um OPTIONS (CORS), que o webhook do
// Flows pode não responder — e aí nada chega. Registrar nunca trava a tela.
//
//   useRegistroDaAbertura({ webhook: WEBHOOK, tela: 'minha-tela', usuarioId: config?.userId, pronto: !isLoading });
//   <OnboardingProvider … aoConcluirTour={(fim) => { if (fim.tipo === 'completo' && fim.concluiu) registrar({ webhook: WEBHOOK, tela: 'minha-tela', usuarioId, evento: 'concluiu' }); }}>
import { useEffect } from 'react';

export type EventoDoRegistro = 'abriu' | 'concluiu';
export type SituacaoDoRegistro = 'desligado' | 'gravado-pelo-flow' | 'sem-resposta' | 'erro';
export type PedidoDeRegistro = { webhook: string | null | undefined; tela: string; usuarioId: number | null | undefined; evento: EventoDoRegistro };

declare global {
  interface Window { __onboardingDaConta?: { registro: { evento: EventoDoRegistro; situacao: SituacaoDoRegistro; quando: string }[] } }
}

/** Fica no window para o QA do avanço conferir o que a tela mandou. */
function anotar(evento: EventoDoRegistro, situacao: SituacaoDoRegistro): void {
  (window.__onboardingDaConta ??= { registro: [] }).registro.push({ evento, situacao, quando: new Date().toISOString() });
  if (situacao === 'erro' || situacao === 'sem-resposta') console.warn(`Onboarding: o evento "${evento}" não teve confirmação do flow (${situacao}).`);
}

/** Manda um evento ao flow. Sem webhook (o flow ainda não existe) ou sem usuário, só anota "desligado". */
export function registrar(p: PedidoDeRegistro): void {
  if (!p.webhook || !p.usuarioId) { anotar(p.evento, 'desligado'); return; }
  fetch(p.webhook, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
    body: JSON.stringify({ tela: p.tela, usuarioId: p.usuarioId, evento: p.evento, quando: new Date().toISOString() }),
    keepalive: true,
  })
    .then((r) => anotar(p.evento, r.ok ? 'gravado-pelo-flow' : 'erro'))
    // sem resposta legível (rede, ou o webhook sem o cabeçalho de CORS na resposta): o evento pode ter chegado
    .catch(() => anotar(p.evento, 'sem-resposta'));
}

/** `abriu`, uma vez por sessão do navegador, quando a ponte já disse quem é a pessoa (`pronto`). */
export function useRegistroDaAbertura(p: { webhook: string | null | undefined; tela: string; usuarioId: number | null | undefined; pronto: boolean }): void {
  const { webhook, tela, usuarioId, pronto } = p;
  useEffect(() => {
    if (!pronto || !usuarioId) return;
    try {
      const k = `onboarding:${tela}:${usuarioId}:abriu-nesta-sessao`;
      if (window.sessionStorage.getItem(k)) return;
      window.sessionStorage.setItem(k, '1');
    } catch {
      // sem armazenamento de sessão: registra a cada carga da tela
    }
    registrar({ webhook, tela, usuarioId, evento: 'abriu' });
  }, [webhook, tela, usuarioId, pronto]);
}
