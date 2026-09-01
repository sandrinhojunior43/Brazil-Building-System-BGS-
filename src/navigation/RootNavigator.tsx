import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { AppText } from '../components/AppText';
import { RoutinesStack } from './RoutinesStack';
import { ProgressScreen } from '../screens/ProgressScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { RootTabParamList } from './types';
import { colors } from '../theme';

const Tab = createBottomTabNavigator<RootTabParamList>();

const navigationTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.background,
    card: colors.backgroundElevated,
    border: colors.border,
    primary: colors.primary,
    text: colors.textPrimary,
  },
};

const tabIcons: Record<keyof RootTabParamList, string> = {
  RoutinasTab: '🏋️',
  ProgressoTab: '📈',
  PerfilTab: '👤',
};

const tabLabels: Record<keyof RootTabParamList, string> = {
  RoutinasTab: 'Rotinas',
  ProgressoTab: 'Progresso',
  PerfilTab: 'Perfil',
};

export function RootNavigator() {
  return (
    <NavigationContainer theme={navigationTheme}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textMuted,
          tabBarStyle: {
            backgroundColor: colors.backgroundElevated,
            borderTopColor: colors.border,
          },
          tabBarIcon: () => <AppText variant="subtitle">{tabIcons[route.name]}</AppText>,
          tabBarLabel: tabLabels[route.name],
        })}
      >
        <Tab.Screen name="RoutinasTab" component={RoutinesStack} />
        <Tab.Screen name="ProgressoTab" component={ProgressScreen} />
        <Tab.Screen name="PerfilTab" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
