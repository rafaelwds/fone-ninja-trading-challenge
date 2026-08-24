import {
  DarkTheme as NavDarkTheme,
  DefaultTheme as NavDefaultTheme,
  ThemeProvider as NavThemeProvider,
} from 'expo-router';
import type { PropsWithChildren } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components/native';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeStore } from '@/store/theme-store';

import { darkTheme, lightTheme, type ThemeMode } from './themes';

export function AppThemeProvider({ children }: PropsWithChildren) {
  const scheme = useColorScheme();
  const themeOverride = useThemeStore((state) => state.themeOverride);
  // Se o usuario escolheu um tema na tela de Perfil, ele manda; senao seguimos o sistema.
  const mode: ThemeMode = themeOverride ?? (scheme === 'dark' ? 'dark' : 'light');
  const styledTheme = mode === 'dark' ? darkTheme : lightTheme;
  const navTheme = mode === 'dark' ? NavDarkTheme : NavDefaultTheme;

  return (
    <NavThemeProvider value={navTheme}>
      <StyledThemeProvider theme={styledTheme}>{children}</StyledThemeProvider>
    </NavThemeProvider>
  );
}
