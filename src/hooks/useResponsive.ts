import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';
import { getBreakpoint, isTabletWidth, type Breakpoint } from '../theme/breakpoints';

// Largura de referência usada no design (celular médio, ex: iPhone 11/Pixel).
const BASE_WIDTH = 375;
// Limites para não deixar o texto/elementos gigantes em tablets nem
// minúsculos em telas muito pequenas.
const MIN_SCALE = 0.85;
const MAX_SCALE = 1.35;

export interface Responsive {
  width: number;
  height: number;
  breakpoint: Breakpoint;
  isTablet: boolean;
  isLandscape: boolean;
  /** Escala um tamanho (px/dp) proporcionalmente à largura da tela, com limites. */
  scale: (size: number) => number;
  /** Escala pensada para fontes: usa uma curva mais suave que `scale`. */
  scaleFont: (size: number) => number;
  /** Número de colunas sugerido para grades de cards, conforme o breakpoint. */
  columns: number;
  /** Padding horizontal de conteúdo sugerido para a tela atual. */
  contentPadding: number;
}

/**
 * Hook central de responsividade do BGS.
 *
 * Usa `useWindowDimensions`, que (diferente de `Dimensions.get`) reage
 * automaticamente a rotação de tela, modo split-screen e telas dobráveis,
 * garantindo que a UI se recalcule em tempo real.
 */
export function useResponsive(): Responsive {
  const { width, height } = useWindowDimensions();

  return useMemo(() => {
    const breakpoint = getBreakpoint(width);
    const isTablet = isTabletWidth(width);
    const isLandscape = width > height;

    const rawRatio = width / BASE_WIDTH;
    const clampedRatio = Math.min(Math.max(rawRatio, MIN_SCALE), MAX_SCALE);

    const scale = (size: number) => Math.round(size * clampedRatio);
    // Fontes escalam mais devagar (metade da razão) para não ficarem
    // desproporcionais em telas muito grandes ou muito pequenas.
    const scaleFont = (size: number) => Math.round(size * (1 + (clampedRatio - 1) / 2));

    let columns = 1;
    if (breakpoint === 'xl') columns = 4;
    else if (breakpoint === 'lg') columns = 3;
    else if (breakpoint === 'md' || breakpoint === 'sm') columns = 2;

    let contentPadding = 16;
    if (breakpoint === 'xl') contentPadding = 40;
    else if (breakpoint === 'lg') contentPadding = 32;
    else if (breakpoint === 'xs') contentPadding = 12;

    return {
      width,
      height,
      breakpoint,
      isTablet,
      isLandscape,
      scale,
      scaleFont,
      columns,
      contentPadding,
    };
  }, [width, height]);
}
