import { Redirect, Tabs } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useAuthStore } from '@/stores/authStore';
import { theme } from '@/constants/Colors';

export default function TabLayout() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textTertiary,
        tabBarStyle: {
          backgroundColor: theme.surface,
          borderTopColor: theme.border,
          height: 60,
          paddingBottom: 8,
        },
        headerStyle: { backgroundColor: theme.surface },
        headerTitleStyle: { fontWeight: '700', color: theme.text },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'My CVs',
          tabBarIcon: ({ color }) => (
            <SymbolView name={{ ios: 'doc.text', android: 'description', web: 'description' }} tintColor={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="templates"
        options={{
          title: 'Templates',
          tabBarIcon: ({ color }) => (
            <SymbolView name={{ ios: 'rectangle.grid.2x2', android: 'grid_view', web: 'grid_view' }} tintColor={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => (
            <SymbolView name={{ ios: 'gearshape', android: 'settings', web: 'settings' }} tintColor={color} size={24} />
          ),
        }}
      />
    </Tabs>
  );
}
