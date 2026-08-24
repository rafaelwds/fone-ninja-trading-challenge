import styled from 'styled-components/native';

export const Container = styled.ScrollView.attrs(() => ({
  contentContainerStyle: {
    flexGrow: 1,
  },
}))`
  padding: 0 ${({ theme }) => theme.spacing.md}px;
  background-color: ${({ theme }) => theme.colors.background};
`;

export const Title = styled.Text`
  color: ${({ theme }) => theme.colors.text};
  font-size: 24px;
  font-weight: 700;
`;

export const TabsContainer = styled.View`
  flex-direction: row;
  background-color: ${({ theme }) => theme.colors.backgroundSelected};
  border-radius: ${({ theme }) => theme.radius.full}px;
  padding: 4px;
  margin-top: ${({ theme }) => theme.spacing.sm}px;
`;

export const TabButton = styled.Pressable<{ $active: boolean }>`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding-vertical: ${({ theme }) => theme.spacing.sm}px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  background-color: ${({ theme, $active }) => ($active ? theme.colors.backgroundElement : 'transparent')};
`;

export const TabButtonText = styled.Text<{ $active: boolean }>`
  font-size: 15px;
  font-weight: 700;
  color: ${({ theme, $active }) => ($active ? theme.colors.primary : theme.colors.textSecondary)};
`;

export const FormCard = styled.View`
  margin-top: ${({ theme }) => theme.spacing.lg}px;
  background-color: ${({ theme }) => theme.colors.backgroundElement};
  border-radius: ${({ theme }) => theme.radius.xl}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.spacing.lg}px;
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

export const FormHeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const FormLabel = styled.Text`
  color: ${({ theme }) => theme.colors.text};
  font-size: 15px;
  font-weight: 700;
`;

export const AvailableLabel = styled.Text`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 13px;
`;

export const InputRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: ${({ theme }) => theme.spacing.sm}px;
  padding: ${({ theme }) => theme.spacing.md}px;
  background-color: ${({ theme }) => theme.colors.background};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg}px;
`;

export const InputPrefix = styled.Text`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 20px;
  font-weight: 700;
`;

export const AmountInput = styled.TextInput`
  flex: 1;
  min-width: 0px;
  margin-left: ${({ theme }) => theme.spacing.sm}px;
  text-align: right;
  color: ${({ theme }) => theme.colors.text};
  font-size: 26px;
  font-weight: 700;
`;

export const PreviewRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: ${({ theme }) => theme.spacing.md}px;
`;

export const PreviewLabel = styled.Text`
  flex-shrink: 0;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 14px;
`;

export const PreviewValue = styled.Text`
  flex-shrink: 1;
  margin-left: ${({ theme }) => theme.spacing.sm}px;
  text-align: right;
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
  font-weight: 700;
`;

export const ErrorText = styled.Text`
  color: ${({ theme }) => theme.colors.danger};
  font-size: 13px;
  margin-top: ${({ theme }) => theme.spacing.sm}px;
`;

export const SuccessText = styled.Text`
  color: ${({ theme }) => theme.colors.success};
  font-size: 13px;
  margin-top: ${({ theme }) => theme.spacing.sm}px;
`;

export const ConfirmButtonWrapper = styled.View`
  margin-top: ${({ theme }) => theme.spacing.lg}px;
`;

export const InfoNote = styled.View`
  flex-direction: row;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.sm}px;
  margin-top: ${({ theme }) => theme.spacing.lg}px;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

export const InfoIconCircle = styled.View`
  width: 20px;
  height: 20px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.primarySoft};
`;

export const InfoIconText = styled.Text`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 11px;
  font-weight: 700;
`;

export const InfoText = styled.Text`
  flex: 1;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 13px;
  line-height: 18px;
`;
