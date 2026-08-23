import styled from 'styled-components/native';

export const Container = styled.View<{ $focused: boolean }>`
  align-items: center;
  justify-content: center;
  gap: 3px;
  min-width: 84px;
  height: 48px;
  padding-vertical: ${({ theme }) => theme.spacing.sm}px;
  padding-horizontal: ${({ theme }) => theme.spacing.md}px;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  background-color: ${({ theme, $focused }) =>
    $focused ? theme.colors.backgroundSelected : 'transparent'};
`;

export const Label = styled.Text<{ $focused: boolean }>`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme, $focused }) => ($focused ? theme.colors.primary : theme.colors.textSecondary)};
`;
