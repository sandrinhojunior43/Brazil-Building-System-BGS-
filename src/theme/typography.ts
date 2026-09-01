import { Platform, TextStyle } from 'react-native';

const fontFamily = Platform.select({
  ios: 'System',
  android: 'sans-serif',
  default: 'System',
});

/**
 * Tamanhos-base da tipografia (em dp @ referência de tela de 375dp de largura).
 * Os componentes de texto devem usar `useResponsive().scaleFont` para
 * ajustar esses valores à largura real do dispositivo.
 */
export const fontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 22,
  xxl: 28,
  display: 34,
} as const;

export const fontWeights: Record<string, TextStyle['fontWeight']> = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
};

export const typography = {
  fontFamily,
  fontSizes,
  fontWeights,
} as const;
