import type { WhitelabelProperties } from '@ploomescrm/bridge';
import { changeColorLuminous, isValidHex, rgba } from './colorMath.ts';

/**
 * Recolors the accent tokens from the account's brand, with the same recipe the
 * CRM design system uses (`WhitelabelProvider`, in `@ploomescrm/ui`): the brand
 * color drives the `brand` family and the gradient, the action color drives the
 * `confirmation` family.
 *
 * Surface (`background`/`font`/`neutral`) and status (`alert`/`success`/
 * `danger`) are left out on purpose — they are fixed hues that carry meaning.
 */

const TONE_DEFAULT = 0.55;
const TONE_HOVER = 0.6;
const TONE_ACTIVE = 0.5;
const TONE_GRADIENT_END = 0.3;
const MUTED_ALPHA = 0.3;

export type WhitelabelTokens = Record<string, string>;

const accentTokens = (prefix: string, color: string): WhitelabelTokens => {
  const value = changeColorLuminous(color, TONE_DEFAULT);

  return {
    [`--color-${prefix}`]: value,
    [`--color-${prefix}-level_1`]: changeColorLuminous(color, TONE_HOVER),
    [`--color-${prefix}-level_2`]: changeColorLuminous(color, TONE_ACTIVE),
    [`--color-${prefix}-default_30`]: rgba(value, MUTED_ALPHA),
  };
};

const solidGradient = (color: string) => `linear-gradient(to right, ${color} 0%, ${color} 100%)`;

const brandGradientTokens = (brandColor: string): WhitelabelTokens => ({
  '--gradient-brand_gradient': `linear-gradient(to right, ${changeColorLuminous(
    brandColor,
    TONE_DEFAULT,
  )} 0%, ${changeColorLuminous(brandColor, TONE_GRADIENT_END)} 100%)`,
  '--gradient-brand_gradient-level_1': solidGradient(changeColorLuminous(brandColor, TONE_HOVER)),
  '--gradient-brand_gradient-level_2': solidGradient(changeColorLuminous(brandColor, TONE_ACTIVE)),
});

const readColor = (value: string | undefined): string | undefined =>
  value !== undefined && isValidHex(value) ? value : undefined;

export const deriveWhitelabelTheme = (
  whitelabel: WhitelabelProperties | null | undefined,
): WhitelabelTokens => {
  if (!whitelabel?.enabled) return {};

  const brandColor = readColor(whitelabel.brandColor);
  const actionColor = readColor(whitelabel.actionColor);

  return {
    ...(brandColor === undefined
      ? {}
      : { ...accentTokens('brand', brandColor), ...brandGradientTokens(brandColor) }),
    ...(actionColor === undefined ? {} : accentTokens('confirmation', actionColor)),
  };
};
