import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Screen } from '../components/Screen';
import { AppText } from '../components/AppText';
import { Card } from '../components/Card';
import { AppButton } from '../components/AppButton';
import { mockRoutines } from '../data/mockRoutines';
import { colors, radius, spacing } from '../theme';
import { useResponsive } from '../hooks/useResponsive';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RoutinesStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RoutinesStackParamList, 'Exercise3D'>;

/**
 * Tela de execução do exercício com demonstração em modelo 3D.
 *
 * O viewport abaixo é um placeholder: a integração real do modelo 3D
 * (ex: via `expo-gl` + `three.js`/`react-three-fiber`, renderizando um
 * asset .glb por exercício a partir de `exercise.model3dId`) entra aqui
 * no lugar do bloco `Viewport3DPlaceholder`, sem alterar o restante do
 * layout responsivo já pronto.
 *
 * Responsividade: em telas largas (tablet/paisagem) o modelo 3D e os
 * controles ficam lado a lado; em celulares em retrato, empilhados.
 */
export function Exercise3DScreen({ route, navigation }: Props) {
  const { routineId, exerciseId } = route.params;
  const { isTablet, isLandscape } = useResponsive();

  const routine = mockRoutines.find((r) => r.id === routineId);
  const exercise = routine?.exercises.find((e) => e.id === exerciseId);
  const exerciseIndex = routine?.exercises.findIndex((e) => e.id === exerciseId) ?? -1;
  const nextExercise = routine?.exercises[exerciseIndex + 1];

  if (!routine || !exercise) {
    return (
      <Screen>
        <AppText>Exercício não encontrado.</AppText>
      </Screen>
    );
  }

  const sideBySide = isTablet || isLandscape;

  return (
    <Screen scroll={!sideBySide}>
      <AppText variant="label" color={colors.primary}>
        {routine.name}
      </AppText>
      <AppText variant="title" style={{ marginTop: spacing.xxs, marginBottom: spacing.md }}>
        {exercise.name}
      </AppText>

      <View style={[styles.layout, sideBySide && styles.layoutRow]}>
        <View style={[styles.viewportWrap, sideBySide && styles.viewportWrapRow]}>
          <Viewport3DPlaceholder modelId={exercise.model3dId} />
        </View>

        <View style={[styles.infoWrap, sideBySide && styles.infoWrapRow]}>
          <Card style={{ marginBottom: spacing.md }}>
            <Row label="Grupo muscular" value={exercise.muscleGroup} />
            <Row label="Séries" value={String(exercise.sets)} />
            <Row label="Repetições" value={exercise.reps} />
            <Row label="Descanso" value={`${exercise.restSeconds}s`} last />
          </Card>

          <AppButton
            label={nextExercise ? 'Concluir e ir para o próximo' : 'Concluir treino'}
            fullWidth
            onPress={() => {
              if (nextExercise) {
                navigation.setParams({ exerciseId: nextExercise.id });
              } else {
                navigation.goBack();
              }
            }}
          />
        </View>
      </View>
    </Screen>
  );
}

function Row({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <View
      style={[
        styles.row,
        !last && { borderBottomWidth: 1, borderBottomColor: colors.border },
      ]}
    >
      <AppText variant="caption" color={colors.textSecondary}>
        {label}
      </AppText>
      <AppText variant="body" weight="semibold">
        {value}
      </AppText>
    </View>
  );
}

function Viewport3DPlaceholder({ modelId }: { modelId: string }) {
  return (
    <View style={styles.viewport}>
      <AppText variant="display">🧍</AppText>
      <AppText variant="caption" color={colors.textSecondary} style={{ marginTop: spacing.xs }}>
        Modelo 3D: {modelId}
      </AppText>
      <AppText variant="label" color={colors.textMuted} center style={{ marginTop: spacing.xxs, paddingHorizontal: spacing.lg }}>
        Visualizador 3D interativo será integrado aqui
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  layout: {
    flex: 1,
  },
  layoutRow: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  viewportWrap: {
    marginBottom: spacing.md,
  },
  viewportWrapRow: {
    flex: 3,
    marginBottom: 0,
  },
  infoWrap: {},
  infoWrapRow: {
    flex: 2,
  },
  viewport: {
    aspectRatio: 4 / 3,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
});
