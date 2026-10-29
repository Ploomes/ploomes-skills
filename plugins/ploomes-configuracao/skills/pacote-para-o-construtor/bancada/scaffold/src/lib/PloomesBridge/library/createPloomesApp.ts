import type { HostConfig, ModuleNavigateTarget } from '../types';
import {
  createApp,
  createIframeAppTransport,
  createWebViewAppTransport,
  type App,
  type NavigatePayload,
  type Transport,
} from '@ploomescrm/bridge';

/**
 * Origem do host do CRM. Varia por conta/whitelabel (domínios customizados) e
 * não é fixável aqui, então usamos `'*'` — o bridge ainda protege o canal pelo
 * envelope versionado (`__ploomesBridge`).
 */
const HOST_ORIGIN = '*';

/**
 * O mesmo build do módulo roda em dois hosts: o iframe do CRM web e a WebView do
 * app mobile. A WebView não tem janela pai — o canal é o bridge do React Native
 * (`ReactNativeWebView`), então o transporte é escolhido pelo ambiente. Sem isso
 * o handshake não completa no mobile e o módulo nunca recebe config nenhuma.
 */
const resolveTransport = (): Transport => 'ReactNativeWebView' in window
  ? createWebViewAppTransport()
  : createIframeAppTransport({ hostOrigin: HOST_ORIGIN });

interface ICreatePloomesAppParams {
  /** Chamado no INIT inicial e a cada `host.sendConfig()` (ex.: userKey renovada). */
  onConfig: (config: HostConfig) => void;
  /**
   * Chamado quando o **host** manda o módulo navegar: voltar/avançar do
   * navegador, ou um link aberto com o módulo já montado. Quem trata é o
   * `PloomesRouter`.
   */
  onNavigate: (request: NavigatePayload<ModuleNavigateTarget>) => void;
}

/**
 * Cria o lado "app" do bridge para o módulo embutido. Quem
 * chama deve rodar `app.connect()` para disparar o handshake e `app.dispose()`
 * no teardown.
 *
 * O tipo de rota é o `ModuleNavigateTarget`, e ele é largo porque o canal
 * carrega **dois assuntos**: uma rota do catálogo pede uma tela do CRM (quem
 * resolve o destino é o host), e qualquer outra é a rota interna do próprio
 * módulo, que o host espelha na URL dele.
 */
export const createPloomesApp = (params: ICreatePloomesAppParams): App<HostConfig, ModuleNavigateTarget> => {
  const { onConfig, onNavigate } = params;

  return createApp<HostConfig, ModuleNavigateTarget>({ transport: resolveTransport(), onConfig, onNavigate });
};
