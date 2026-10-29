import { createContext } from 'react';

/** Onde o mapa da jornada mora: no bloco montado sozinho, a raiz. Uma tela que monte o mapa noutra rota (dentro de
 *  outra tela do cliente, por exemplo) fornece o caminho com RotaDoMapa.Provider. O simulador volta para cá. */
export const RotaDoMapa = createContext('/');
