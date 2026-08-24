import { FlashList } from '@shopify/flash-list';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Header } from '@/components/Header';
import { TransactionItem } from '@/components/TransactionItem';
import { useTransactions } from '@/hooks/use-transactions';
import { formatCurrencyBRL } from '@/utils/format';
import { toTransactionItemProps } from '@/utils/transaction-item';

import * as S from './styles';

export function History() {
  // per_page no maximo permitido pelo backend (100): o suficiente pra listar e somar
  // os totais desta demo. Se o historico crescer alem disso, os totais e a lista
  // passam a refletir so as 100 transacoes mais recentes - useTransactions ja aceita
  // "page", entao paginacao real pode ser adicionada aqui depois se for preciso.
  const transactions = useTransactions({ per_page: 100 });

  const rawTransactions = transactions.data?.data ?? [];
  const operationsCount = transactions.data?.meta.total ?? 0;

  const totalBought = rawTransactions
    .filter((transaction) => transaction.type === 'buy')
    .reduce((sum, transaction) => sum + Number(transaction.brl_amount), 0);

  const totalSold = rawTransactions
    .filter((transaction) => transaction.type === 'sell')
    .reduce((sum, transaction) => sum + Number(transaction.brl_amount), 0);

  const items = rawTransactions.map(toTransactionItemProps);

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
      <S.Container>
        <Header variant="history" title="Histórico" operationsCount={operationsCount} />

        <S.SummaryCard>
          <S.SummaryItem>
            <S.SummaryLabel>Total comprado</S.SummaryLabel>
            <S.SummaryValue>{formatCurrencyBRL(totalBought)}</S.SummaryValue>
          </S.SummaryItem>
          <S.SummaryDivider />
          <S.SummaryItem>
            <S.SummaryLabel>Total vendido</S.SummaryLabel>
            <S.SummaryValue>{formatCurrencyBRL(totalSold)}</S.SummaryValue>
          </S.SummaryItem>
        </S.SummaryCard>

        <FlashList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TransactionItem
              kind={item.kind}
              title={item.title}
              date={item.date}
              amountLabel={item.amountLabel}
              btcAmountLabel={item.btcAmountLabel}
            />
          )}
          ItemSeparatorComponent={() => <S.ItemSeparator />}
          ListEmptyComponent={
            transactions.isLoading ? null : (
              <S.EmptyListText>Nenhuma movimentação ainda.</S.EmptyListText>
            )
          }
        />
      </S.Container>
    </SafeAreaView>
  );
}
