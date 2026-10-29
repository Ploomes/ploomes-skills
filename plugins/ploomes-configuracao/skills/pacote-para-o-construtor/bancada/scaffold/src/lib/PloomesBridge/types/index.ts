import type { HostConfig as BridgeHostConfig } from '@ploomescrm/bridge';
import type { ModuleNavigateRequest, ModuleNavigationRoute } from '@ploomescrm/api-types';

/**
 * A config que o host do CRM entrega no handshake. É o `HostConfig` do bridge
 * mais o que o host da tela publicada acrescenta.
 */
export interface HostConfig extends BridgeHostConfig {
  /**
   * Rota interna em que o módulo deve abrir, lida pelo host da URL do CRM.
   * Sempre absoluta, `/` na raiz. É o que faz um link copiado reabrir na mesma
   * tela — quem a aplica é o `PloomesRouter`.
   */
  initialRoute?: string;
  /** Identificador da tela gerada, quando o host o informa. */
  projectId?: string;
  /** Idioma do usuário no CRM (`pt-BR`, `en-US`, …). */
  language?: string;
}

// Catálogo de rotas do Ploomes: vocabulário compartilhado entre os módulos e os
// hosts que os embutem, então vive no pacote de tipos, não aqui.
export type {
  ModuleNavigationRoute,
  ModuleNavigateRequest,
  ModuleNavigateTarget,
} from '@ploomescrm/api-types';

/**
 * Pedido para abrir uma **tela do CRM** — o catálogo, e só ele.
 *
 * A navegação **dentro** do módulo não passa por aqui: ela é o `useNavigate` do
 * router, e quem reporta a rota nova ao host é o `PloomesRouter`. Pedir uma rota
 * interna por este canal mudaria a URL do CRM sem mudar a tela.
 */
export type ModuleScreenRequest = ModuleNavigateRequest & { to: ModuleNavigationRoute };
