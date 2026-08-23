import { Platform, type TextStyle } from 'react-native';

export const fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
})!;

export type TypeVariant =
  'default' | 'title' | 'subtitle' | 'small' | 'smallBold' | 'link' | 'linkPrimary' | 'code';

export const typography = {
  default: { fontSize: 16, lineHeight: 24, fontWeight: '500' },
  title: { fontSize: 48, lineHeight: 52, fontWeight: '600' },
  subtitle: { fontSize: 32, lineHeight: 44, fontWeight: '600' },
  small: { fontSize: 14, lineHeight: 20, fontWeight: '500' },
  smallBold: { fontSize: 14, lineHeight: 20, fontWeight: '700' },
  link: { fontSize: 14, lineHeight: 30, fontWeight: '500' },
  linkPrimary: { fontSize: 14, lineHeight: 30, fontWeight: '500' },
  code: {
    fontFamily: fonts.mono,
    fontSize: 12,
    fontWeight: Platform.select({ android: '700' }) ?? '500',
  },
} as const satisfies Record<TypeVariant, TextStyle>;

export type Typography = typeof typography;
