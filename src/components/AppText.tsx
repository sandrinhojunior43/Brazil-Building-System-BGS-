import React from 'react';
import { Text, TextProps, TextStyle } from 'react-native';
import { colors, fontSizes, fontWeights } from '../theme';
import { useResponsive } from '../hooks/useResponsive';

type Variant = 'display' | 'title' | 'subtitle' | 'body' | 'caption' | 'label';

interface AppTextProps extends TextProps {
  variant?: Variant;
  color?: string;
  weight?: keyof typeof fontWeights;
  center?: boolean;
}

const variantSize: Record<Variant, number> = {
  display: fontSizes.display,
  title: fontSizes.xxl,
  subtitle: fontSizes.lg,
  body: fontSizes.md,
  caption: fontSizes.sm,
  label: fontSizes.xs,
};

const variantWeight: Record<Variant, keyof typeof fontWeights> = {
  display: 'bold',
  title: 'bold',
  subtitle: 'semibold',
  body: 'regular',
  caption: 'regular',
  label: 'medium',
};

/**
 * Texto padrão do BGS. Aplica escala de fonte responsiva automaticamente
 * (via useResponsive) e respeita as configurações de acessibilidade do
 * sistema (o próprio RN já escala com fontScale do usuário).
 */
export function AppText({
  variant = 'body',
  color = colors.textPrimary,
  weight,
  center,
  style,
  ...rest
}: AppTextProps) {
  const { scaleFont } = useResponsive();

  const resolvedStyle: TextStyle = {
    fontSize: scaleFont(variantSize[variant]),
    fontWeight: fontWeights[weight ?? variantWeight[variant]],
    color,
    textAlign: center ? 'center' : undefined,
  };

  return <Text style={[resolvedStyle, style]} {...rest} />;
}
