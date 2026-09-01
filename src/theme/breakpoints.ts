/**
 * Breakpoints de largura (dp) usados para adaptar o layout do BGS
 * a diferentes tamanhos de tela: celulares pequenos, celulares grandes,
 * tablets em retrato e tablets/telas grandes em paisagem.
 */
export const breakpoints = {
  xs: 0, // celulares compactos (ex: iPhone SE)
  sm: 360, // celulares médios
  md: 400, // celulares grandes / phablets
  lg: 768, // tablets em retrato
  xl: 1024, // tablets em paisagem / telas grandes
} as const;

export type Breakpoint = keyof typeof breakpoints;

export function getBreakpoint(width: number): Breakpoint {
  if (width >= breakpoints.xl) return 'xl';
  if (width >= breakpoints.lg) return 'lg';
  if (width >= breakpoints.md) return 'md';
  if (width >= breakpoints.sm) return 'sm';
  return 'xs';
}

export const isTabletWidth = (width: number) => width >= breakpoints.lg;
