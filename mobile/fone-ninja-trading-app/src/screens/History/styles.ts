import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  padding: 0 ${({ theme }) => theme.spacing.md}px;
  background-color: ${({ theme }) => theme.colors.background};
`;

export const Title = styled.Text`
  color: ${({ theme }) => theme.colors.text};
  font-size: 24px;
  font-weight: 700;
`;

export const SummaryCard = styled.View`
  flex-direction: row;
  background-color: ${({ theme }) => theme.colors.backgroundElement};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.xl}px;
  padding: ${({ theme }) => theme.spacing.lg}px;
  margin-top: ${({ theme }) => theme.spacing.sm}px;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

export const SummaryItem = styled.View`
  flex: 1;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

export const SummaryLabel = styled.Text`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 13px;
`;

export const SummaryValue = styled.Text`
  color: ${({ theme }) => theme.colors.text};
  font-size: 18px;
  font-weight: 700;
`;

export const SummaryDivider = styled.View`
  width: 1px;
  background-color: ${({ theme }) => theme.colors.border};
  margin-horizontal: ${({ theme }) => theme.spacing.lg}px;
`;

export const ItemSeparator = styled.View`
  height: 1px;
  background-color: ${({ theme }) => theme.colors.border};
`;

export const EmptyListText = styled.Text`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 14px;
  padding-vertical: ${({ theme }) => theme.spacing.md}px;
`;
