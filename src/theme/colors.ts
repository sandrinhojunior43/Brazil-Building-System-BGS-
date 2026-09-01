/**
 * Paleta de cores do Brazil Building System (BGS).
 * Inspirada nas cores do Brasil (verde e amarelo) sobre um tema escuro,
 * comum em apps de fitness/performance.
 */
export const colors = {
  // Marca
  primary: '#00A859', // verde Brasil
  primaryDark: '#00753C',
  primaryLight: '#3DD68C',
  secondary: '#FFCC29', // amarelo Brasil
  secondaryDark: '#E0AC00',

  // Superfícies
  background: '#0D0F0E',
  backgroundElevated: '#151816',
  surface: '#1C201E',
  surfaceAlt: '#242926',
  border: '#2C312E',

  // Texto
  textPrimary: '#F5F7F6',
  textSecondary: '#A9B3AE',
  textMuted: '#6F786F',
  textOnPrimary: '#04140C',

  // Estados
  success: '#34C759',
  warning: '#FFB020',
  danger: '#FF453A',
  info: '#3DA9FC',

  // Utilidade
  white: '#FFFFFF',
  black: '#000000',
  overlay: 'rgba(0,0,0,0.6)',
} as const;

export type AppColors = typeof colors;
