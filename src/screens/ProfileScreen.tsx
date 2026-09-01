import React from 'react';
import { View } from 'react-native';
import { Screen } from '../components/Screen';
import { AppText } from '../components/AppText';
import { Card } from '../components/Card';
import { colors, spacing } from '../theme';

const menuItems = [
  { icon: '👤', label: 'Dados pessoais' },
  { icon: '🎯', label: 'Metas e objetivos' },
  { icon: '🔔', label: 'Notificações' },
  { icon: '⚙️', label: 'Configurações' },
  { icon: '❓', label: 'Ajuda e suporte' },
];

export function ProfileScreen() {
  return (
    <Screen>
      <AppText variant="display" style={{ marginBottom: spacing.lg }}>
        Perfil
      </AppText>

      <Card style={{ marginBottom: spacing.lg, alignItems: 'center' }}>
        <View
          style={{
            width: 72,
            height: 72,
            borderRadius: 36,
            backgroundColor: colors.surfaceAlt,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: spacing.sm,
          }}
        >
          <AppText variant="title">💪</AppText>
        </View>
        <AppText variant="subtitle">Atleta BGS</AppText>
        <AppText variant="caption" color={colors.textSecondary}>
          Membro desde 2026
        </AppText>
      </Card>

      <View style={{ gap: spacing.xs }}>
        {menuItems.map((item) => (
          <Card key={item.label} onPress={() => {}} style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
            <AppText variant="subtitle">{item.icon}</AppText>
            <AppText variant="body" style={{ flex: 1 }}>
              {item.label}
            </AppText>
            <AppText variant="body" color={colors.textMuted}>
              ›
            </AppText>
          </Card>
        ))}
      </View>
    </Screen>
  );
}
