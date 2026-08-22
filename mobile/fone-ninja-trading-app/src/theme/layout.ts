import { Platform } from 'react-native';

export const layout = {
  maxContentWidth: 800,
  bottomTabInset: Platform.select({ ios: 50, android: 80 }) ?? 0,
} as const;

export type Layout = typeof layout;
