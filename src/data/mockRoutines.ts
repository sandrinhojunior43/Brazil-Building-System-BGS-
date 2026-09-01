import { Routine, ProgressEntry } from '../types/workout';

/**
 * Dados de exemplo para desenvolvimento das telas.
 * Devem ser substituídos pela integração com o backend/API do BGS.
 */
export const mockRoutines: Routine[] = [
  {
    id: 'r1',
    name: 'Treino A — Peito e Tríceps',
    description: 'Foco em hipertrofia de peitoral e tríceps.',
    level: 'intermediário',
    durationMinutes: 55,
    exercises: [
      {
        id: 'e1',
        name: 'Supino Reto',
        muscleGroup: 'Peito',
        sets: 4,
        reps: '8-10',
        restSeconds: 90,
        model3dId: 'bench-press',
      },
      {
        id: 'e2',
        name: 'Crucifixo Inclinado',
        muscleGroup: 'Peito',
        sets: 3,
        reps: '10-12',
        restSeconds: 60,
        model3dId: 'incline-fly',
      },
      {
        id: 'e3',
        name: 'Tríceps Corda',
        muscleGroup: 'Tríceps',
        sets: 3,
        reps: '12-15',
        restSeconds: 60,
        model3dId: 'triceps-pushdown',
      },
    ],
  },
  {
    id: 'r2',
    name: 'Treino B — Costas e Bíceps',
    description: 'Puxadas e remadas para largura e espessura de costas.',
    level: 'intermediário',
    durationMinutes: 50,
    exercises: [
      {
        id: 'e4',
        name: 'Puxada Frontal',
        muscleGroup: 'Costas',
        sets: 4,
        reps: '8-10',
        restSeconds: 90,
        model3dId: 'lat-pulldown',
      },
      {
        id: 'e5',
        name: 'Remada Curvada',
        muscleGroup: 'Costas',
        sets: 4,
        reps: '8-10',
        restSeconds: 90,
        model3dId: 'bent-over-row',
      },
      {
        id: 'e6',
        name: 'Rosca Direta',
        muscleGroup: 'Bíceps',
        sets: 3,
        reps: '10-12',
        restSeconds: 60,
        model3dId: 'bicep-curl',
      },
    ],
  },
  {
    id: 'r3',
    name: 'Treino C — Pernas',
    description: 'Quadríceps, posterior e glúteos.',
    level: 'avançado',
    durationMinutes: 65,
    exercises: [
      {
        id: 'e7',
        name: 'Agachamento Livre',
        muscleGroup: 'Pernas',
        sets: 5,
        reps: '6-8',
        restSeconds: 120,
        model3dId: 'barbell-squat',
      },
      {
        id: 'e8',
        name: 'Leg Press',
        muscleGroup: 'Pernas',
        sets: 4,
        reps: '10-12',
        restSeconds: 90,
        model3dId: 'leg-press',
      },
    ],
  },
];

export const mockProgress: ProgressEntry[] = [
  { date: '2026-08-25', routineId: 'r1', completed: true, durationMinutes: 52 },
  { date: '2026-08-27', routineId: 'r2', completed: true, durationMinutes: 48 },
  { date: '2026-08-29', routineId: 'r3', completed: false, durationMinutes: 20 },
];
