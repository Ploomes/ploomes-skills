import type { App, ViewportOverlay } from '@ploomescrm/bridge';
import { createViewportOverlay } from '@ploomescrm/bridge';
import type { HostConfig, ModuleNavigateTarget } from '../types';
import type { IPloomesProviderProps } from './types';
import type { IPloomesContextValue } from '../context';
import type { HostRouteListener, IPloomesHostRouteChannel } from '../context/hostRoute';
import { useEffect, useRef, useState } from 'react';
import { PloomesContext } from '../context';
import { PloomesHostRouteContext } from '../context/hostRoute';
import { ViewportOverlayContext } from '../context/viewportOverlay';
import { createPloomesApp } from '../library';
import { useWhitelabelTheme } from '../hooks/useWhitelabelTheme';

export const PloomesProvider = (props: IPloomesProviderProps) => {
  const { children } = props;

  const [config, setConfig] = useState<HostConfig | null>(null);
  const appRef = useRef<App<HostConfig, ModuleNavigateTarget> | null>(null);
  const [overlay, setOverlay] = useState<ViewportOverlay | null>(null);

  useWhitelabelTheme(config?.whitelabel);

  // Canal de rota do host, criado uma única vez e estável para sempre: o
  // `subscribe` do `PloomesRouter` não pode trocar de identidade a cada render, e
  // o `report` precisa existir antes do handshake (a rota de boot sai antes de o
  // `app` existir, porque os efeitos dos filhos rodam antes do daqui). O que sair
  // nessa janela fica guardado e é reenviado quando o handshake completa — o
  // `useHostRouteSync` marca a rota como sincronizada e não a reenvia.
  const hostRouteRef = useRef<{
    channel: IPloomesHostRouteChannel;
    emit: HostRouteListener;
    flushPendingReport: () => void;
  } | null>(null);
  if (hostRouteRef.current === null) {
    const listeners = new Set<HostRouteListener>();
    let pendingReport: string | null = null;

    hostRouteRef.current = {
      channel: {
        report: (to, replace) => {
          if (appRef.current === null) {
            pendingReport = to;
            return;
          }

          pendingReport = null;
          appRef.current.navigate({ to, replace });
        },
        subscribe: (listener) => {
          listeners.add(listener);
          return () => {
            listeners.delete(listener);
          };
        },
      },
      emit: (to, replace) => listeners.forEach((listener) => listener(to, replace)),
      flushPendingReport: () => {
        if (pendingReport === null) return;

        const to = pendingReport;
        pendingReport = null;
        // `replace`: reescreve a entrada corrente do histórico do host, não empilha outra.
        appRef.current?.navigate({ to, replace: true });
      },
    };
  }
  const hostRoute = hostRouteRef.current;

  useEffect(() => {
    let disposed = false;
    const app = createPloomesApp({
      onConfig: setConfig,
      // Rota escolhida pelo HOST: voltar/avançar do navegador, ou um link aberto
      // com o módulo já montado. O `replace` vem dele — a entrada já existe no
      // histórico de lá, então empilhar aqui custaria dois "voltar" por tela.
      onNavigate: (request) => hostRoute.emit(request.to, request.replace === true),
    });
    appRef.current = app;
    // Camada de tela cheia: enquanto uma estiver aberta, o CRM estica este frame
    // sobre a viewport. Ver `useViewportOverlay`.
    const viewportOverlay = createViewportOverlay(app);
    setOverlay(viewportOverlay);

    // `connect()` dispara o handshake READY→INIT; a config chega via `onConfig`.
    // Ele rejeita (nunca pendura) em timeout, erro do host ou dispose.
    app
      .connect()
      .then(() => {
        if (disposed) return;
        hostRoute.flushPendingReport();
      })
      .catch((error) => {
        // `dispose()` (unmount, ou double-mount do StrictMode em dev) rejeita o
        // handshake ainda pendente — não é falha real, então não logamos.
        if (disposed) return;
        console.warn('[PloomesBridge] handshake com o host do CRM não completou:', error);
      });

    return () => {
      disposed = true;
      appRef.current = null;
      setOverlay(null);
      viewportOverlay.dispose();
      app.dispose();
    };
  }, [hostRoute]);

  // Renderiza `children` mesmo antes de conectar — quem consome `usePloomesBridge()` trata `isLoading`;
  // o gate de "esperar conectar" não é responsabilidade do provider.
  // `navigate` fica disponível junto da config: antes do handshake não há host
  // escutando do outro lado e o pedido seria perdido em silêncio.
  const value: IPloomesContextValue | null = config === null
    ? null
    : {
      config,
      navigate: (request) => appRef.current?.navigate(request),
    };

  return (
    <PloomesHostRouteContext.Provider value={hostRoute.channel}>
      <ViewportOverlayContext.Provider value={overlay}>
        <PloomesContext.Provider value={value}>{children}</PloomesContext.Provider>
      </ViewportOverlayContext.Provider>
    </PloomesHostRouteContext.Provider>
  );
};
