import { darkColors, lightColors, type ColorTokens } from './colors';
import { layout } from './layout';
import { motion } from './motion';
import { radius } from './radius';
import { shadows } from './shadows';
import { spacing } from './spacing';
import { fonts, typography } from './typography';

export type ThemeMode = 'light' | 'dark';

export type AppTheme = {
  mode: ThemeMode;
  colors: ColorTokens;
  spacing: typeof spacing;
  radius: typeof radius;
  shadows: typeof shadows;
  motion: typeof motion;
  typography: typeof typography;
  fonts: typeof fonts;
  layout: typeof layout;
};

const sharedTokens = {
  spacing,
  radius,
  shadows,
  motion,
  typography,
  fonts,
  layout,
} as const;

export const lightTheme: AppTheme = {
  mode: 'light',
  colors: lightColors,
  ...sharedTokens,
};

export const darkTheme: AppTheme = {
  mode: 'dark',
  colors: darkColors,
  ...sharedTokens,
};

export const themes: Record<ThemeMode, AppTheme> = {
  light: lightTheme,
  dark: darkTheme,
};
