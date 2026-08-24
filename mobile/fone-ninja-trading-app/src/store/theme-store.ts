import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { ThemeMode } from '@/theme';

import { secureStorage } from './secure-storage';

/**
 * Preferencia de tema escolhida manualmente pelo usuario na tela de Perfil.
 * `null` significa "ainda nao escolheu" - nesse caso o app segue o tema do
 * sistema operacional (comportamento padrao, ver src/theme/provider.tsx).
 */
type ThemeState = {
  themeOverride: ThemeMode | null;
  hasHydrated: boolean;
  setThemeOverride: (mode: ThemeMode) => void;
  setHasHydrated: (value: boolean) => void;
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      themeOverride: null,
      hasHydrated: false,
      setThemeOverride: (mode) => set({ themeOverride: mode }),
      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: 'fone-ninja-theme',
      storage: createJSONStorage(() => secureStorage),
      partialize: (state) => ({ themeOverride: state.themeOverride }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
