import { Ionicons } from '@expo/vector-icons';
import { useTheme } from 'styled-components/native';

import * as S from './styles';

export type TransactionKind = 'buy' | 'sell';

export type TransactionItemProps = {
  kind: TransactionKind;
  title: string;
  date: string;
  amountLabel: string;
  btcAmountLabel: string;
};

export function TransactionItem({
  kind,
  title,
  date,
  amountLabel,
  btcAmountLabel,
}: TransactionItemProps) {
  const theme = useTheme();
  const isBuy = kind === 'buy';

  return (
    <S.Container>
      <S.IconCircle $kind={kind}>
        <Ionicons
          testID={isBuy ? 'transaction-icon-buy' : 'transaction-icon-sell'}
          name={isBuy ? 'arrow-down' : 'arrow-up'}
          size={18}
          color={isBuy ? theme.colors.danger : theme.colors.success}
        />
      </S.IconCircle>
      <S.Info>
        <S.Title>{title}</S.Title>
        <S.Date>{date}</S.Date>
      </S.Info>
      <S.Values>
        <S.Amount $kind={kind}>{amountLabel}</S.Amount>
        <S.BtcAmount>{btcAmountLabel}</S.BtcAmount>
      </S.Values>
    </S.Container>
  );
}
