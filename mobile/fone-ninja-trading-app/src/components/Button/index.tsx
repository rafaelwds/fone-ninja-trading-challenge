import { ActivityIndicator, Pressable, PressableProps } from 'react-native';
import styled, { useTheme } from 'styled-components/native';

import type { AppTheme } from '@/theme';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger';

export type ButtonSize = 'medium' | 'large';

export type ButtonProps = Omit<PressableProps, 'children'> & {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
};

function getBackgroundColor(theme: AppTheme, variant: ButtonVariant, pressed: boolean) {
  switch (variant) {
    case 'primary':
      return pressed ? theme.colors.primaryPressed : theme.colors.primary;
    case 'secondary':
      return pressed ? theme.colors.backgroundSelected : theme.colors.primarySoft;
    case 'outline':
      return pressed ? theme.colors.backgroundSelected : 'transparent';
    case 'danger':
      return theme.colors.danger;
  }
}

function getTextColor(theme: AppTheme, variant: ButtonVariant) {
  switch (variant) {
    case 'primary':
    case 'danger':
      return theme.colors.onPrimary;
    case 'secondary':
    case 'outline':
      return theme.colors.primary;
  }
}

export function Button({
  title,
  variant = 'primary',
  size = 'large',
  loading = false,
  fullWidth = true,
  disabled = false,
  ...rest
}: ButtonProps) {
  const theme = useTheme();
  const isTrulyDisabled = Boolean(disabled);
  const isDisabled = isTrulyDisabled || loading;

  return (
    <Container
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      {...rest}
    >
      {({ pressed }) => (
        <Content
          $variant={variant}
          $size={size}
          $fullWidth={fullWidth}
          $pressed={pressed}
          $disabled={isTrulyDisabled}
        >
          {loading ? (
            <ActivityIndicator color={getTextColor(theme, variant)} />
          ) : (
            <Label $variant={variant} $size={size}>
              {title}
            </Label>
          )}
        </Content>
      )}
    </Container>
  );
}

const Container = styled(Pressable)`
  align-self: stretch;
`;

const Content = styled.View<{
  $variant: ButtonVariant;
  $size: ButtonSize;
  $fullWidth: boolean;
  $pressed: boolean;
  $disabled: boolean;
}>`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  align-self: ${({ $fullWidth }) => ($fullWidth ? 'stretch' : 'flex-start')};
  opacity: ${({ $disabled, $variant, $pressed }) =>
    $disabled ? 0.5 : $variant === 'danger' && $pressed ? 0.85 : 1};
  background-color: ${({ theme, $variant, $pressed }) =>
    getBackgroundColor(theme, $variant, $pressed)};
  border-width: ${({ $variant }) => ($variant === 'outline' ? 1 : 0)}px;
  border-color: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.radius.lg}px;
  padding-vertical: ${({ theme, $size }) =>
    $size === 'large' ? theme.spacing.md : theme.spacing.sm}px;
  padding-horizontal: ${({ theme, $size }) =>
    $size === 'large' ? theme.spacing.xl : theme.spacing.lg}px;
`;

const Label = styled.Text<{ $variant: ButtonVariant; $size: ButtonSize }>`
  color: ${({ theme, $variant }) => getTextColor(theme, $variant)};
  font-size: ${({ $size }) => ($size === 'large' ? 16 : 14)}px;
  font-weight: 600;
`;
