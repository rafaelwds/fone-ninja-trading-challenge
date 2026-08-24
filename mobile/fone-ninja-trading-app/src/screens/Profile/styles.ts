import styled from 'styled-components/native';

export const Container = styled.ScrollView.attrs(() => ({
  contentContainerStyle: {
    flexGrow: 1,
  },
}))`
  padding: 0 ${({ theme }) => theme.spacing.md}px;
  background-color: ${({ theme }) => theme.colors.background};
`;

export const TitleScreen = styled.Text`
  color: ${({ theme }) => theme.colors.text};
  font-size: 32px;
  font-weight: 700;
  margin-top: ${({ theme }) => theme.spacing.md}px;
`;

export const UserCard = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md}px;
  background-color: ${({ theme }) => theme.colors.backgroundElement};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.xl}px;
  padding: ${({ theme }) => theme.spacing.lg}px;
  margin-top: ${({ theme }) => theme.spacing.lg}px;
`;

export const UserInfo = styled.View`
  flex-shrink: 1;
  gap: 2px;
`;

export const UserName = styled.Text`
  color: ${({ theme }) => theme.colors.text};
  font-size: 18px;
  font-weight: 700;
`;

export const UserEmail = styled.Text`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 13px;
`;

export const SectionLabel = styled.Text`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: ${({ theme }) => theme.spacing.xl}px;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

export const ThemeToggleContainer = styled.View`
  flex-direction: row;
  background-color: ${({ theme }) => theme.colors.backgroundSelected};
  border-radius: ${({ theme }) => theme.radius.full}px;
  padding: 4px;
`;

export const ThemeToggleButton = styled.Pressable<{ $active: boolean }>`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xs}px;
  padding-vertical: ${({ theme }) => theme.spacing.sm}px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  background-color: ${({ theme, $active }) =>
    $active ? theme.colors.backgroundElement : 'transparent'};
`;

export const ThemeToggleText = styled.Text<{ $active: boolean }>`
  font-size: 15px;
  font-weight: 700;
  color: ${({ theme, $active }) => ($active ? theme.colors.primary : theme.colors.textSecondary)};
`;

export const LogoutSection = styled.View`
  margin-top: ${({ theme }) => theme.spacing.xxl}px;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;
