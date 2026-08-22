import { Text as RNText, type TextProps } from 'react-native';
import styled from 'styled-components/native';

import { typography, type ColorTokens, type TypeVariant } from '@/theme';

export type ThemeColorToken = keyof ColorTokens;

export type ThemedTextProps = TextProps & {
  variant?: TypeVariant;
  themeColor?: ThemeColorToken;
};

const StyledText = styled(RNText).attrs<{
  $variant: TypeVariant;
  $color?: ThemeColorToken;
}>(({ $variant, $color, theme }) => ({
  style: [
    typography[$variant],
    { color: $color ? theme.colors[$color] : theme.colors[resolveDefaultColor($variant)] },
  ],
}))``;

function resolveDefaultColor(variant: TypeVariant): ThemeColorToken {
  if (variant === 'linkPrimary') return 'link';
  return 'text';
}

export function ThemedText({
  variant = 'default',
  themeColor,
  style,
  ...rest
}: ThemedTextProps) {
  return <StyledText $variant={variant} $color={themeColor} style={style} {...rest} />;
}
