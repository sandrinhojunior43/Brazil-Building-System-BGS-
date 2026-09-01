/** Tipos de navegação do BGS, para autocomplete e checagem de rotas/params. */

export type RoutinesStackParamList = {
  Home: undefined;
  RoutineDetail: { routineId: string };
  Exercise3D: { routineId: string; exerciseId: string };
};

export type RootTabParamList = {
  RoutinasTab: undefined;
  ProgressoTab: undefined;
  PerfilTab: undefined;
};
