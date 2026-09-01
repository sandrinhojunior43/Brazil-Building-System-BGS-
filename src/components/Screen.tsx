import React from 'react';
import { ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import { SafeAreaView, Edge } from 'react-native-safe-area-context';
import { colors } from '../theme';
import { useResponsive } from '../hooks/useResponsive';

interface ScreenProps {
  children: React.ReactNode;
  scroll?: boolean;
  style?: ViewStyle;
  edges?: Edge[];
}

/**
 * Wrapper padrão de tela: respeita safe areas (notch, barra de status,
 * home indicator) e aplica padding horizontal responsivo com base no
 * tamanho real do dispositivo (celular pequeno até tablet).
 */
export function Screen({ children, scroll = true, style, edges }: ScreenProps) {
  const { contentPadding, isTablet, width } = useResponsive();

  // Em telas largas (tablet), limita a largura do conteúdo e centraliza,
  // para o texto/cards não esticarem de ponta a ponta.
  const maxContentWidth = isTablet ? Math.min(width * 0.85, 900) : undefined;

  const content = (
    <View
      style={[
        styles.inner,
        {
          paddingHorizontal: contentPadding,
          maxWidth: maxContentWidth,
          width: maxContentWidth ? '100%' : undefined,
          alignSelf: maxContentWidth ? 'center' : undefined,
        },
        style,
      ]}
    >
      {children}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={edges}>
      {scroll ? (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {content}
        </ScrollView>
      ) : (
        <View style={styles.flexOne}>{content}</View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flexOne: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 32,
  },
  inner: {
    flex: 1,
    paddingTop: 16,
  },
});
