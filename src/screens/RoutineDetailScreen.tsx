import React from 'react';
import { View } from 'react-native';
import { Screen } from '../components/Screen';
import { AppText } from '../components/AppText';
import { Card } from '../components/Card';
import { AppButton } from '../components/AppButton';
import { mockRoutines } from '../data/mockRoutines';
import { colors, spacing } from '../theme';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RoutinesStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RoutinesStackParamList, 'RoutineDetail'>;

export function RoutineDetailScreen({ route, navigation }: Props) {
  const routine = mockRoutines.find((r) => r.id === route.params.routineId);

  if (!routine) {
    return (
      <Screen>
        <AppText>Rotina não encontrada.</AppText>
      </Screen>
    );
  }

  return (
    <Screen>
      <AppText variant="label" color={colors.primary}>
        {routine.level.toUpperCase()}
      </AppText>
      <AppText variant="title" style={{ marginTop: spacing.xxs }}>
        {routine.name}
      </AppText>
      <AppText variant="body" color={colors.textSecondary} style={{ marginTop: spacing.xs, marginBottom: spacing.lg }}>
        {routine.description}
      </AppText>

      <View style={{ gap: spacing.sm }}>
        {routine.exercises.map((exercise, index) => (
          <Card
            key={exercise.id}
            onPress={() =>
              navigation.navigate('Exercise3D', {
                routineId: routine.id,
                exerciseId: exercise.id,
              })
            }
            style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}
          >
            <View
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: colors.surfaceAlt,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <AppText variant="caption" weight="bold">
                {index + 1}
              </AppText>
            </View>
            <View style={{ flex: 1 }}>
              <AppText variant="body" weight="semibold">
                {exercise.name}
              </AppText>
              <AppText variant="caption" color={colors.textSecondary}>
                {exercise.sets}x {exercise.reps} · descanso {exercise.restSeconds}s
              </AppText>
            </View>
            <AppText variant="body" color={colors.primary}>
              ▶
            </AppText>
          </Card>
        ))}
      </View>

      <AppButton
        label="Iniciar treino"
        fullWidth
        style={{ marginTop: spacing.xl }}
        onPress={() =>
          navigation.navigate('Exercise3D', {
            routineId: routine.id,
            exerciseId: routine.exercises[0].id,
          })
        }
      />
    </Screen>
  );
}
