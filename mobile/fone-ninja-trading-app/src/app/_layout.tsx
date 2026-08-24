import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';

import { useAuthStore } from '@/store/auth-store';
import { useThemeStore } from '@/store/theme-store';
import { AppThemeProvider } from '@/theme/provider';

// Uma unica instancia por vida do app: o QueryClient guarda o cache de todas
// as chamadas feitas com o TanStack Query (useMutation/useQuery).
const queryClient = new QueryClient();

/**
 * Rotas protegidas (Stack.Protected, API atual do Expo Router para auth-gating):
 * cada bloco so fica "visivel" enquanto seu `guard` for true. O router decide
 * sozinho pra onde mandar o usuario quando o guard muda - sem `<Redirect>`
 * manual espalhado pelos layouts, que e o que causava loop de redirecionamento
 * (dois arquivos tentando mandar um pro outro ao mesmo tempo).
 */
export default function RootLayout() {
  const user = useAuthStore((state) => state.user);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const themeHasHydrated = useThemeStore((state) => state.hasHydrated);

  // Espera o SecureStore/localStorage ser lido antes de decidir a rota/tema, senao
  // a gente mostraria o login por 1 frame mesmo quando ja existe sessao salva, ou
  // um flash do tema errado quando ha uma preferencia de tema salva.
  if (!hasHydrated || !themeHasHydrated) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AppThemeProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Protected guard={Boolean(user)}>
            <Stack.Screen name="(tabs)" />
          </Stack.Protected>

          <Stack.Protected guard={!user}>
            <Stack.Screen name="index" />
          </Stack.Protected>
        </Stack>
      </AppThemeProvider>
    </QueryClientProvider>
  );
}
