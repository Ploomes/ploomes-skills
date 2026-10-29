import { useContext, useLayoutEffect } from 'react';
import { ViewportOverlayContext } from '../../context/viewportOverlay';

/**
 * Declara uma camada que cobre a tela — modal, drawer, alert.
 *
 * Dentro do iframe, o backdrop pararia na borda do frame: o header e o menu do
 * CRM continuariam acesos, clique neles não fecharia nada e "centralizado"
 * seria no frame, não na tela. Com este hook o CRM estica o frame sobre a
 * viewport enquanto a camada estiver aberta, e o shell é congelado no lugar
 * para nada re-layoutar atrás dela.
 *
 * ```tsx
 * const ConfirmarExclusao = ({ aberto, aoFechar }) => {
 *   useViewportOverlay(aberto);
 *   if (!aberto) return null;
 *   return createPortal(<div className="fixed inset-0 …" />, document.body);
 * };
 * ```
 *
 * A camada precisa ser `position: fixed` **e** estar em portal no
 * `document.body`. O que fica dentro do `#root` é congelado junto e continuaria
 * recortado no retângulo antigo.
 *
 * Efeito de layout, não efeito comum: a mensagem sai antes do paint que inicia
 * a animação da camada, que é o instante com que o CRM alinha o dele.
 */
export const useViewportOverlay = (open: boolean): void => {
  const overlay = useContext(ViewportOverlayContext);

  useLayoutEffect(() => {
    if (!open || overlay === null) return;

    overlay.acquire();
    return () => overlay.release();
  }, [open, overlay]);
};
