import { useMutation } from '@tanstack/react-query';

import { login, type LoginCredentials } from '@/services/auth';
import { useAuthStore } from '@/store/auth-store';

/**
 * Faz a chamada POST /login (via TanStack Query `useMutation`, que da pra gente
 * `isPending` / `error` / `mutate` de graca) e, quando ela da certo, salva o
 * usuario + token na Zustand store - dali em diante qualquer tela do app pode
 * ler `useAuthStore((s) => s.user)` pra saber quem esta logado.
 */
export function useLogin() {
  const setSession = useAuthStore((state) => state.setSession);

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => login(credentials),
    onSuccess: ({ data }) => {
      setSession(data.user, data.token);
    },
  });
}
