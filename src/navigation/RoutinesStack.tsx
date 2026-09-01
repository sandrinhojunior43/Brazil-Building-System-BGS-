import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RoutinesStackParamList } from './types';
import { HomeScreen } from '../screens/HomeScreen';
import { RoutineDetailScreen } from '../screens/RoutineDetailScreen';
import { Exercise3DScreen } from '../screens/Exercise3DScreen';
import { colors } from '../theme';

const Stack = createNativeStackNavigator<RoutinesStackParamList>();

export function RoutinesStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.textPrimary,
        headerShadowVisible: false,
        headerTitleStyle: { color: colors.textPrimary },
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="RoutineDetail"
        component={RoutineDetailScreen}
        options={{ title: 'Rotina' }}
      />
      <Stack.Screen
        name="Exercise3D"
        component={Exercise3DScreen}
        options={{ title: 'Execução' }}
      />
    </Stack.Navigator>
  );
}
