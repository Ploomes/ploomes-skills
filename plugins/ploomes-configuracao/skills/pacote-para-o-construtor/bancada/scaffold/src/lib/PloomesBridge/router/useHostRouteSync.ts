import { useContext, useEffect, useRef } from 'react';
import { useLocation, useNavigate, useNavigationType } from 'react-router';
import { PloomesContext } from '../context';
import { PloomesHostRouteContext } from '../context/hostRoute';

/** Rota do módulo no formato que cruza o bridge: caminho + query, sempre absoluto. */
const currentRoute = (pathname: string, search: string): string => `${pathname}${search}`;

/** Rota em que o `MemoryRouter` nasce, antes de o host dizer onde o módulo deve abrir. */
const BOOT_ROUTE = '/';

/**
 * Mantém a rota do módulo e a URL do CRM em sincronia, **nos dois sentidos** — é
 * o que faz as setas do navegador andarem pelas telas do módulo mesmo ele
 * vivendo dentro de um iframe:
 *
 * - módulo → host: toda rota nova é reportada, e o host a escreve na URL dele
 *   sem recriar o iframe;
 * - host → módulo: voltar/avançar e deep link chegam pelo bridge e o router
 *   daqui os segue.
 *
 * O eco é o cuidado central: a rota que **veio** do host não volta para ele. Sem
 * isso, cada ida ao passado empilharia uma entrada nova e o botão voltar nunca
 * sairia do lugar.
 */
export const useHostRouteSync = (): void => {
  const navigate = useNavigate();
  const location = useLocation();
  const navigationType = useNavigationType();
  const hostRoute = useContext(PloomesHostRouteContext);
  const ploomes = useContext(PloomesContext);

  // `useNavigate` **troca de identidade a cada navegação**. Numa lista de deps
  // ele faria todo efeito daqui rodar de novo a cada rota — e o de baixo, que
  // aplica a rota inicial, arrastaria o usuário de volta para ela. Por ref, os
  // efeitos ficam presos ao que realmente os dispara.
  const navigateRef = useRef(navigate);
  navigateRef.current = navigate;

  // Última rota que host e módulo já sabem um do outro. `null` até a primeira
  // sincronia — antes disso não há o que reportar nem o que comparar.
  const syncedRouteRef = useRef<string | null>(null);

  // Rota em que o host mandou o módulo abrir. Chega na config, e não como
  // `host:navigate`, porque no boot ainda não havia módulo montado para receber.
  const initialRoute = ploomes?.config.initialRoute;
  // Guardada à parte da rota corrente: o que decide se ela ainda vale é **ela
  // ter mudado**, não o usuário ter saído dela. Comparar com a rota corrente
  // faria toda navegação parecer uma rota inicial pendente.
  const appliedInitialRouteRef = useRef<string | null>(null);

  useEffect(() => {
    if (!initialRoute || initialRoute === appliedInitialRouteRef.current) return;
    appliedInitialRouteRef.current = initialRoute;

    // Marcada ANTES de navegar: foi o host que escolheu esta rota, então ela não
    // volta para ele. Reportá-la reescreveria a entrada de histórico de onde o
    // usuário veio.
    syncedRouteRef.current = initialRoute;
    // Empilhada, e não reescrita: assim a raiz do módulo fica embaixo da tela que
    // um link abriu, e um voltar de dentro dela tem para onde ir. Com `replace`, o
    // histórico do router ficaria com uma entrada só.
    navigateRef.current(initialRoute, { replace: initialRoute === BOOT_ROUTE });
  }, [initialRoute]);

  useEffect(() => {
    if (hostRoute === null) return undefined;

    return hostRoute.subscribe((to, replace) => {
      if (!to || to === syncedRouteRef.current) return;
      syncedRouteRef.current = to;
      navigateRef.current(to, { replace });
    });
  }, [hostRoute]);

  useEffect(() => {
    const route = currentRoute(location.pathname, location.search);
    if (route === syncedRouteRef.current) return;

    syncedRouteRef.current = route;
    // Um `replace` daqui (o redirect do próprio módulo, uma rota que se corrige)
    // reescreve a entrada lá também — senão voltar cairia na mesma tela.
    hostRoute?.report(route, navigationType === 'REPLACE');
    // `navigationType` fora das deps de propósito: quem dispara o reporte é a
    // rota mudar, e lê-lo junto evita reportar de novo quando só ele muda.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, location.search, hostRoute]);
};
