import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { AuthUser } from '@/services/auth';

import { secureStorage } from './secure-storage';

/**
 * Estado global de autenticacao ("quem esta logado agora").
 *
 * Divisao de responsabilidades neste projeto:
 * - TanStack Query cuida do ciclo de vida de UMA requisicao (loading, error, cache) -
 *   ver `useLogin` em src/hooks/use-login.ts.
 * - Zustand guarda o RESULTADO que o app inteiro precisa consultar depois: o
 *   usuario e o token atuais, disponiveis em qualquer tela via `useAuthStore`.
 */
type AuthState = {
  user: AuthUser | null;
  token: string | null;
  /** Fica `true` assim que o SecureStore foi lido, mesmo se nao havia sessao salva. */
  hasHydrated: boolean;
  setSession: (user: AuthUser, token: string) => void;
  clearSession: () => void;
  setHasHydrated: (value: boolean) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      hasHydrated: false,
      setSession: (user, token) => set({ user, token }),
      clearSession: () => set({ user: null, token: null }),
      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: 'fone-ninja-auth',
      // O token e sensivel, entao guardamos ele de forma criptografada (Keychain/Keystore).
      storage: createJSONStorage(() => secureStorage),
      // So persistimos user/token; `hasHydrated` e recalculado a cada boot do app.
      partialize: (state) => ({ user: state.user, token: state.token }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
