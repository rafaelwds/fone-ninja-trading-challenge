import styled from 'styled-components/native';

type TransactionKind = 'buy' | 'sell';

export const Container = styled.View`
  flex-direction: row;
  align-items: center;
  padding-vertical: ${({ theme }) => theme.spacing.sm}px;
`;

export const IconCircle = styled.View<{ $kind: TransactionKind }>`
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  align-items: center;
  justify-content: center;
  margin-right: ${({ theme }) => theme.spacing.sm}px;
  background-color: ${({ theme, $kind }) =>
    $kind === 'buy' ? theme.colors.dangerSoft : theme.colors.primarySoft};
`;

export const Info = styled.View`
  flex: 1;
`;

export const Title = styled.Text`
  color: ${({ theme }) => theme.colors.text};
  font-size: 15px;
  font-weight: 700;
`;

export const Date = styled.Text`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 13px;
  margin-top: 2px;
`;

export const Values = styled.View`
  align-items: flex-end;
`;

export const Amount = styled.Text<{ $kind: TransactionKind }>`
  font-size: 15px;
  font-weight: 700;
  color: ${({ theme, $kind }) => ($kind === 'buy' ? theme.colors.danger : theme.colors.success)};
`;

export const BtcAmount = styled.Text`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 13px;
  margin-top: 2px;
`;
