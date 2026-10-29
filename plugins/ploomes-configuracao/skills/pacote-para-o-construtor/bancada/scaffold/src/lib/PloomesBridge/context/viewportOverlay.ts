import type { ViewportOverlay } from '@ploomescrm/bridge';
import { createContext } from 'react';

/**
 * Overlay de viewport, separado do `PloomesContext` de propósito: aquele só
 * existe depois do handshake, e uma camada aberta antes disso ainda precisa ser
 * contada.
 */
export const ViewportOverlayContext = createContext<ViewportOverlay | null>(null);
