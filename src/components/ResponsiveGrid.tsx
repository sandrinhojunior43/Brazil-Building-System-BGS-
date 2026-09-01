import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useResponsive } from '../hooks/useResponsive';
import { spacing } from '../theme';

interface ResponsiveGridProps {
  children: React.ReactNode;
  gap?: number;
}

/**
 * Grade que reflui o número de colunas conforme o tamanho da tela:
 * 1 coluna em celulares pequenos, 2 em celulares grandes, 3-4 em tablets.
 * Cada filho deve ser um elemento único (ex: <Card />).
 */
export function ResponsiveGrid({ children, gap = spacing.md }: ResponsiveGridProps) {
  const { columns } = useResponsive();
  const items = React.Children.toArray(children);

  return (
    <View style={[styles.wrap, { marginHorizontal: -gap / 2 }]}>
      {items.map((child, index) => (
        <View
          key={index}
          style={{
            width: `${100 / columns}%`,
            padding: gap / 2,
          }}
        >
          {child}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
