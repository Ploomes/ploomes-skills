import type { WhitelabelProperties } from '@ploomescrm/bridge';
import { useLayoutEffect, useMemo } from 'react';
import { deriveWhitelabelTheme } from '../../library/deriveWhitelabelTheme';

/**
 * Applies the account's brand over the accent tokens declared in `index.css`.
 *
 * Writes the variables onto the `<html>` inline style, which beats every rule in
 * the sheet — the `.dark` block included — without depending on import order.
 * A layout effect, not a plain one: the config only arrives after the handshake,
 * and writing before the paint is what keeps the screen from showing the Ploomes
 * purple first and flipping to the account color.
 */
export const useWhitelabelTheme = (
  whitelabel: WhitelabelProperties | null | undefined,
): void => {
  const tokens = useMemo(() => deriveWhitelabelTheme(whitelabel), [whitelabel]);

  useLayoutEffect(() => {
    const entries = Object.entries(tokens);
    if (entries.length === 0) return;

    const { style } = document.documentElement;
    entries.forEach(([name, value]) => style.setProperty(name, value));

    return () => entries.forEach(([name]) => style.removeProperty(name));
  }, [tokens]);
};
