import { useEffect } from 'react';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/authStore';
import '@/i18n';
import 'react-native-reanimated';

export { ErrorBoundary } from 'expo-router';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 5 * 60 * 1000 },
  },
});

export default function RootLayout() {
  const loadSession = useAuthStore((s) => s.loadSession);
  const isLoading = useAuthStore((s) => s.isLoading);

  useEffect(() => {
    loadSession().finally(() => {
      SplashScreen.hideAsync();
    });
  }, []);

  if (isLoading) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="cv" />
        <Stack.Screen name="paywall" options={{ presentation: 'modal' }} />
      </Stack>
    </QueryClientProvider>
  );
}
