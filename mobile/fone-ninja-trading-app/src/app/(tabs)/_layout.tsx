import { Tabs } from 'expo-router';
import { useTheme } from 'styled-components/native';

import { TabBarItem } from '@/components/TabBarItem';

export default function TabsLayout() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: theme.colors.backgroundElement,
          borderTopWidth: 1,
          borderTopColor: theme.colors.border,
          height: 88,
          paddingTop: 8,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarItem label="Início" icon="home-outline" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="negociar"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarItem label="Negociar" icon="swap-horizontal-outline" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="historico"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarItem label="Histórico" icon="list-outline" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
