import { createContext } from 'react';

/** Uma rota do módulo, do jeito que ela cruza o bridge: caminho absoluto + como escrever no histórico. */
export type HostRouteListener = (to: string, replace: boolean) => void;

/**
 * Canal de rota entre o módulo e o host, nos dois sentidos. É **interno da lib**
 * — quem o usa é o `PloomesRouter`; o módulo navega com o `useNavigate` do
 * router e não encosta aqui.
 *
 * Ele é separado do `PloomesContext` de propósito: aquele só existe depois da
 * config chegar, e uma rota reportada no boot (a raiz, ou um redirect do próprio
 * módulo) acontece antes disso. Aqui o canal está de pé desde o primeiro render;
 * o que sair antes do handshake é guardado e reenviado quando ele completa.
 */
export interface IPloomesHostRouteChannel {
  /** Reporta ao host a rota em que o módulo está agora. */
  report: HostRouteListener;
  /** Escuta as rotas que o host manda (voltar/avançar do navegador, deep link). */
  subscribe: (listener: HostRouteListener) => () => void;
}

export const PloomesHostRouteContext = createContext<IPloomesHostRouteChannel | null>(null);
