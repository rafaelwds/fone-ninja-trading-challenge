import { Pressable, TextInput } from 'react-native';
import styled from 'styled-components/native';

export const Screen = styled.View`
  flex: 1;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.lg}px;
  background-color: ${({ theme }) => theme.colors.background};
`;

export const Card = styled.View`
  background-color: ${({ theme }) => theme.colors.backgroundElement};
  border-radius: ${({ theme }) => theme.radius.xl}px;
  padding: ${({ theme }) => theme.spacing.lg}px;
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

export const Header = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
  margin-bottom: ${({ theme }) => theme.spacing.xl}px;
`;

export const Avatar = styled.View`
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.radius.full}px;
  background-color: ${({ theme }) => theme.colors.primary};
`;

export const AvatarLabel = styled.Text`
  color: ${({ theme }) => theme.colors.onPrimary};
  font-size: 15px;
  font-weight: 700;
`;

export const Brand = styled.Text`
  flex: 1;
  color: ${({ theme }) => theme.colors.text};
  font-size: 16px;
  font-weight: 700;
`;

export const DemoBadge = styled.View`
  background-color: ${({ theme }) => theme.colors.primarySoft};
  border-radius: ${({ theme }) => theme.radius.full}px;
  padding-vertical: ${({ theme }) => theme.spacing.xxs}px;
  padding-horizontal: ${({ theme }) => theme.spacing.sm}px;
`;

export const DemoBadgeLabel = styled.Text`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 12px;
  font-weight: 700;
`;

export const Eyebrow = styled.Text`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
`;

export const Title = styled.Text`
  color: ${({ theme }) => theme.colors.text};
  font-size: 28px;
  font-weight: 700;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

export const Subtitle = styled.Text`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 15px;
  line-height: 21px;
  margin-bottom: ${({ theme }) => theme.spacing.xl}px;
`;

export const FormBox = styled.View`
  gap: ${({ theme }) => theme.spacing.md}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg}px;
  padding: ${({ theme }) => theme.spacing.lg}px;
`;

export const Field = styled.View`
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

export const Label = styled.Text`
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
  font-weight: 600;
`;

export const Input = styled(TextInput)`
  background-color: ${({ theme }) => theme.colors.background};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md}px;
  padding-vertical: ${({ theme }) => theme.spacing.sm}px;
  padding-horizontal: ${({ theme }) => theme.spacing.md}px;
  font-size: 15px;
  color: ${({ theme }) => theme.colors.text};
`;

export const ErrorText = styled.Text`
  color: ${({ theme }) => theme.colors.danger};
  font-size: 13px;
`;

export const CreateAccountLink = styled(Pressable)`
  align-items: center;
  padding-top: ${({ theme }) => theme.spacing.xs}px;
`;

export const CreateAccountLabel = styled.Text`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 14px;
  font-weight: 600;
`;
