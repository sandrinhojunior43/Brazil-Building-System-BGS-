import React from 'react';
import { View } from 'react-native';
import { Screen } from '../components/Screen';
import { AppText } from '../components/AppText';
import { Card } from '../components/Card';
import { ResponsiveGrid } from '../components/ResponsiveGrid';
import { mockRoutines, mockProgress } from '../data/mockRoutines';
import { colors, spacing } from '../theme';
import { useResponsive } from '../hooks/useResponsive';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RoutinesStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RoutinesStackParamList, 'Home'>;

export function HomeScreen({ navigation }: Props) {
  const { scale } = useResponsive();
  const completedThisWeek = mockProgress.filter((p) => p.completed).length;

  return (
    <Screen>
      <AppText variant="label" color={colors.primary}>
        BRAZIL BUILDING SYSTEM
      </AppText>
      <AppText variant="display" style={{ marginTop: spacing.xxs, marginBottom: spacing.lg }}>
        Olá, atleta 💪
      </AppText>

      <Card style={{ marginBottom: spacing.lg, backgroundColor: colors.primaryDark }}>
        <AppText variant="caption" color={colors.textOnPrimary}>
          Resumo da semana
        </AppText>
        <AppText variant="title" color={colors.textOnPrimary} style={{ marginTop: spacing.xxs }}>
          {completedThisWeek} treinos concluídos
        </AppText>
      </Card>

      <AppText variant="subtitle" style={{ marginBottom: spacing.sm }}>
        Suas rotinas
      </AppText>

      <ResponsiveGrid>
        {mockRoutines.map((routine) => (
          <Card
            key={routine.id}
            onPress={() => navigation.navigate('RoutineDetail', { routineId: routine.id })}
          >
            <View
              style={{
                width: scale(40),
                height: scale(40),
                borderRadius: scale(20),
                backgroundColor: colors.surfaceAlt,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: spacing.sm,
              }}
            >
              <AppText variant="subtitle">🏋️</AppText>
            </View>
            <AppText variant="body" weight="semibold">
              {routine.name}
            </AppText>
            <AppText variant="caption" color={colors.textSecondary} style={{ marginTop: spacing.xxs }}>
              {routine.exercises.length} exercícios · {routine.durationMinutes} min
            </AppText>
          </Card>
        ))}
      </ResponsiveGrid>
    </Screen>
  );
}
