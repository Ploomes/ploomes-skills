const HEX_SHORT = /^#?([0-9a-f])([0-9a-f])([0-9a-f])$/i;
const HEX_LONG = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i;

export type RGB = [number, number, number];
export type HSL = [number, number, number];

export const isValidHex = (value: string): boolean =>
  HEX_SHORT.test(value) || HEX_LONG.test(value);

export const hexToRgb = (hex: string): RGB => {
  const long = HEX_LONG.exec(hex);
  if (long) return [parseInt(long[1], 16), parseInt(long[2], 16), parseInt(long[3], 16)];

  const short = HEX_SHORT.exec(hex);
  if (short) {
    return [
      parseInt(short[1] + short[1], 16),
      parseInt(short[2] + short[2], 16),
      parseInt(short[3] + short[3], 16),
    ];
  }

  throw new Error(`Invalid hex color: "${hex}"`);
};

export const rgbToHex = ([red, green, blue]: RGB): string => {
  const channel = (value: number) =>
    Math.round(Math.max(0, Math.min(255, value)))
      .toString(16)
      .padStart(2, '0');

  return `#${channel(red)}${channel(green)}${channel(blue)}`.toUpperCase();
};

export const rgbToHsl = ([red, green, blue]: RGB): HSL => {
  const normalizedRed = red / 255;
  const normalizedGreen = green / 255;
  const normalizedBlue = blue / 255;
  const max = Math.max(normalizedRed, normalizedGreen, normalizedBlue);
  const min = Math.min(normalizedRed, normalizedGreen, normalizedBlue);
  const lightness = (max + min) / 2;

  if (max === min) return [0, 0, lightness * 100];

  const delta = max - min;
  const saturation = lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);

  let hue: number;
  switch (max) {
    case normalizedRed:
      hue = (normalizedGreen - normalizedBlue) / delta + (normalizedGreen < normalizedBlue ? 6 : 0);
      break;
    case normalizedGreen:
      hue = (normalizedBlue - normalizedRed) / delta + 2;
      break;
    default:
      hue = (normalizedRed - normalizedGreen) / delta + 4;
      break;
  }

  return [(hue / 6) * 360, saturation * 100, lightness * 100];
};

export const hslToRgb = ([hue, saturation, lightness]: HSL): RGB => {
  const normalizedHue = hue / 360;
  const normalizedSaturation = saturation / 100;
  const normalizedLightness = lightness / 100;

  if (normalizedSaturation === 0) {
    const gray = Math.round(normalizedLightness * 255);
    return [gray, gray, gray];
  }

  const hueToChannel = (start: number, end: number, offset: number) => {
    let position = offset;
    if (position < 0) position += 1;
    if (position > 1) position -= 1;
    if (position < 1 / 6) return start + (end - start) * 6 * position;
    if (position < 1 / 2) return end;
    if (position < 2 / 3) return start + (end - start) * (2 / 3 - position) * 6;
    return start;
  };

  const end =
    normalizedLightness < 0.5
      ? normalizedLightness * (1 + normalizedSaturation)
      : normalizedLightness + normalizedSaturation - normalizedLightness * normalizedSaturation;
  const start = 2 * normalizedLightness - end;

  return [
    Math.round(hueToChannel(start, end, normalizedHue + 1 / 3) * 255),
    Math.round(hueToChannel(start, end, normalizedHue) * 255),
    Math.round(hueToChannel(start, end, normalizedHue - 1 / 3) * 255),
  ];
};

export const changeColorLuminous = (hex: string, luminous: number): string => {
  const hsl = rgbToHsl(hexToRgb(hex));
  hsl[2] = luminous * 100;

  return rgbToHex(hslToRgb(hsl));
};

export const rgba = (hex: string, alpha: number): string => {
  const [red, green, blue] = hexToRgb(hex);

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
};
