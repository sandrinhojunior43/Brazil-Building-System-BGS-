import React from 'react';
import { View } from 'react-native';
import { Screen } from '../components/Screen';
import { AppText } from '../components/AppText';
import { Card } from '../components/Card';
import { mockProgress, mockRoutines } from '../data/mockRoutines';
import { colors, spacing } from '../theme';

export function ProgressScreen() {
  const completed = mockProgress.filter((p) => p.completed).length;
  const totalMinutes = mockProgress.reduce((acc, p) => acc + p.durationMinutes, 0);

  return (
    <Screen>
      <AppText variant="display" style={{ marginBottom: spacing.lg }}>
        Progresso
      </AppText>

      <View style={{ flexDirection: 'row', gap: spacing.md, marginBottom: spacing.lg }}>
        <Card style={{ flex: 1 }}>
          <AppText variant="caption" color={colors.textSecondary}>
            Treinos concluídos
          </AppText>
          <AppText variant="title" color={colors.primary} style={{ marginTop: spacing.xxs }}>
            {completed}
          </AppText>
        </Card>
        <Card style={{ flex: 1 }}>
          <AppText variant="caption" color={colors.textSecondary}>
            Minutos treinados
          </AppText>
          <AppText variant="title" color={colors.secondary} style={{ marginTop: spacing.xxs }}>
            {totalMinutes}
          </AppText>
        </Card>
      </View>

      <AppText variant="subtitle" style={{ marginBottom: spacing.sm }}>
        Histórico
      </AppText>

      <View style={{ gap: spacing.sm }}>
        {mockProgress.map((entry, idx) => {
          const routine = mockRoutines.find((r) => r.id === entry.routineId);
          return (
            <Card key={idx} style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ flex: 1 }}>
                <AppText variant="body" weight="semibold">
                  {routine?.name ?? 'Rotina'}
                </AppText>
                <AppText variant="caption" color={colors.textSecondary}>
                  {entry.date} · {entry.durationMinutes} min
                </AppText>
              </View>
              <AppText
                variant="caption"
                color={entry.completed ? colors.success : colors.warning}
                weight="semibold"
              >
                {entry.completed ? 'Concluído' : 'Incompleto'}
              </AppText>
            </Card>
          );
        })}
      </View>
    </Screen>
  );
}
