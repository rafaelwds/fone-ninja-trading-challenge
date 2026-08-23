import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { AuthUser } from '@/services/auth';

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

/**
 * Adaptador para o middleware `persist` do zustand usar o SecureStore do Expo
 * (Keychain no iOS / Keystore no Android) em vez do AsyncStorage puro - o
 * token de autenticacao e sensivel, entao guardamos ele de forma criptografada.
 *
 * SecureStore nao existe na Web (nao ha Keychain/Keystore no navegador), entao
 * ali caimos para `localStorage` - menos seguro, mas suficiente pra esta demo.
 */
const secureStorage = {
  getItem: (name: string) => {
    if (Platform.OS === 'web') {
      return Promise.resolve(globalThis.localStorage?.getItem(name) ?? null);
    }
    return SecureStore.getItemAsync(name);
  },
  setItem: (name: string, value: string) => {
    if (Platform.OS === 'web') {
      globalThis.localStorage?.setItem(name, value);
      return Promise.resolve();
    }
    return SecureStore.setItemAsync(name, value);
  },
  removeItem: (name: string) => {
    if (Platform.OS === 'web') {
      globalThis.localStorage?.removeItem(name);
      return Promise.resolve();
    }
    return SecureStore.deleteItemAsync(name);
  },
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
      storage: createJSONStorage(() => secureStorage),
      // So persistimos user/token; `hasHydrated` e recalculado a cada boot do app.
      partialize: (state) => ({ user: state.user, token: state.token }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
