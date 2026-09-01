/** Modelos de domínio do BGS: rotinas de treino, exercícios e progresso. */

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  sets: number;
  reps: string; // ex: "8-12" ou "até a falha"
  restSeconds: number;
  /** Identificador do modelo 3D de demonstração (asset .glb futuro). */
  model3dId: string;
  thumbnail?: string;
}

export interface Routine {
  id: string;
  name: string;
  description: string;
  level: 'iniciante' | 'intermediário' | 'avançado';
  durationMinutes: number;
  exercises: Exercise[];
}

export interface ProgressEntry {
  date: string; // ISO date
  routineId: string;
  completed: boolean;
  durationMinutes: number;
}
