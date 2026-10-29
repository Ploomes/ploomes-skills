import type { ReactNode } from 'react';
import { MemoryRouter } from 'react-router';
import { useHostRouteSync } from './useHostRouteSync';

interface IPloomesRouterProps {
  children: ReactNode;
}

/** Roda a sincronia dentro do router — hook de rota precisa de um router acima. */
const HostRouteSync = (): null => {
  useHostRouteSync();
  return null;
};

/**
 * O router do módulo. Envolva a aplicação com ele e declare as telas com
 * `<Routes>`; navegue com o `useNavigate` do `react-router`, como em qualquer
 * app. Cada tela e cada item aberto ganham rota própria, e o resto sai de graça:
 * o voltar do navegador anda por elas e um link copiado reabre onde o usuário
 * estava.
 *
 * **Router em memória, não `BrowserRouter`.** Quem é dono da barra de endereços
 * é o CRM: ele espelha a rota do módulo na URL dele
 * (`/ai-screen/<tela>/<rota>`) e devolve as mudanças pelo bridge. Um router que
 * mexesse na URL do iframe brigaria com isso — e, como a tela publicada é
 * servida como arquivo estático, recarregar numa sub-rota daria 404.
 *
 * Filtro, ordenação e paginação vão na **query string** da rota: o host colapsa
 * variações de query na mesma entrada de histórico, então mexer num filtro não
 * custa um "voltar" a mais.
 */
export const PloomesRouter = ({ children }: IPloomesRouterProps) => (
  <MemoryRouter>
    <HostRouteSync />
    {children}
  </MemoryRouter>
);
