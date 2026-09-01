import React from 'react';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import { colors, radius, spacing } from '../theme';
import { AppText } from './AppText';
import { useResponsive } from '../hooks/useResponsive';

type Variant = 'primary' | 'secondary' | 'outline';

interface AppButtonProps {
  label: string;
  onPress: () => void;
  variant?: Variant;
  style?: ViewStyle;
  fullWidth?: boolean;
  disabled?: boolean;
}

/**
 * Botão padrão do BGS. A altura mínima de toque (48dp) é garantida em
 * qualquer tamanho de tela, atendendo às diretrizes de acessibilidade
 * de área tocável mínima do iOS/Android.
 */
export function AppButton({
  label,
  onPress,
  variant = 'primary',
  style,
  fullWidth,
  disabled,
}: AppButtonProps) {
  const { scale } = useResponsive();

  const backgroundColor =
    variant === 'primary' ? colors.primary : variant === 'secondary' ? colors.secondary : 'transparent';
  const textColor =
    variant === 'outline' ? colors.textPrimary : colors.textOnPrimary;
  const borderColor = variant === 'outline' ? colors.border : 'transparent';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor,
          borderColor,
          borderWidth: variant === 'outline' ? 1 : 0,
          minHeight: Math.max(48, scale(48)),
          width: fullWidth ? '100%' : undefined,
          alignSelf: fullWidth ? 'stretch' : 'flex-start',
          opacity: disabled ? 0.5 : pressed ? 0.85 : 1,
        },
        style,
      ]}
    >
      <AppText variant="body" weight="semibold" color={textColor}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
});
