import { FlashList } from '@shopify/flash-list';
import { Link, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { RefreshControl } from 'react-native';
import { useTheme } from 'styled-components/native';

import { Button } from '@/components/Button';
import { Header } from '@/components/Header';
import { TransactionItem, type TransactionItemProps } from '@/components/TransactionItem';
import { useMarketPrice } from '@/hooks/use-market-price';
import { useTransactions } from '@/hooks/use-transactions';
import { useWallet } from '@/hooks/use-wallet';
import { useAuthStore } from '@/store/auth-store';
import { formatBtc, formatCurrencyBRL, formatTransactionDate } from '@/utils/format';
import type { Transaction } from '@/services/transactions';
import { SafeAreaView } from 'react-native-safe-area-context';

import * as S from './styles';

function toTransactionItemProps(transaction: Transaction): TransactionItemProps & { id: string } {
  const isBuy = transaction.type === 'buy';

  return {
    id: String(transaction.id),
    kind: transaction.type,
    title: isBuy ? 'Compra de BTC' : 'Venda de BTC',
    date: formatTransactionDate(transaction.created_at),
    amountLabel: `${isBuy ? '−' : '+'}${formatCurrencyBRL(transaction.brl_amount)}`,
    btcAmountLabel: formatBtc(transaction.btc_amount),
  };
}

export function Home() {
  const router = useRouter();
  const theme = useTheme();
  const clearSession = useAuthStore((state) => state.clearSession);

  const wallet = useWallet();
  const market = useMarketPrice();
  const transactions = useTransactions({ per_page: 2 });

  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([wallet.refetch(), market.refetch(), transactions.refetch()]);
    setRefreshing(false);
  }, [wallet, market, transactions]);

  const brlBalance = wallet.data?.data.brl_balance;
  const btcBalance = wallet.data?.data.btc_balance;
  const btcPrice = market.data?.data.price;

  const estimatedNetWorthLabel =
    brlBalance !== undefined && btcBalance !== undefined && btcPrice !== undefined
      ? formatCurrencyBRL(Number(brlBalance) + Number(btcBalance) * Number(btcPrice))
      : '—';

  const items = transactions.data?.data.map(toTransactionItemProps) ?? [];

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
      <S.Container
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
          />
        }
      >
        <Header variant="walet" title="Sua carteira" />
        <S.Card>
          <S.TitleCard>Patrimônio estimado</S.TitleCard>
          <S.PriceCard>{estimatedNetWorthLabel}</S.PriceCard>
          <S.SubtitleCard>Ambiente de simulação</S.SubtitleCard>
        </S.Card>
        <S.ViewBalances>
          <S.CardBalanceBRL>
            <S.ViewBalanceInternal>
              <S.CircleIcon typeBalance="BRL">
                <S.TextCircleIcon>R$</S.TextCircleIcon>
              </S.CircleIcon>
              <S.ViewBalanceInternalData>
                <S.TexTitletCircle>Saldo em reais</S.TexTitletCircle>
                <S.TextDecriptionCircle>
                  {brlBalance !== undefined ? formatCurrencyBRL(brlBalance) : '—'}
                </S.TextDecriptionCircle>
              </S.ViewBalanceInternalData>
            </S.ViewBalanceInternal>
          </S.CardBalanceBRL>
          <S.CardBalanceBTC>
            <S.ViewBalanceInternal>
              <S.CircleIcon typeBalance="BTC">
                <S.TextCircleIcon>B</S.TextCircleIcon>
              </S.CircleIcon>
              <S.ViewBalanceInternalData>
                <S.TexTitletCircle>Bitcoin</S.TexTitletCircle>
                <S.TextDecriptionCircle>
                  {btcBalance !== undefined ? formatBtc(btcBalance) : '—'}
                </S.TextDecriptionCircle>
              </S.ViewBalanceInternalData>
            </S.ViewBalanceInternal>
          </S.CardBalanceBTC>
        </S.ViewBalances>
        <S.CardPainelBTC>
          <S.ViewBalanceInternal>
            <S.CircleIcon typeBalance="BTC">
              <S.TextCircleIcon>B</S.TextCircleIcon>
            </S.CircleIcon>
            <S.ViewBalanceInternalData>
              <S.TexTitletCircle>Bitcoin</S.TexTitletCircle>
              <S.TextDecriptionCircle>BTC / BRLC</S.TextDecriptionCircle>
            </S.ViewBalanceInternalData>
          </S.ViewBalanceInternal>
          <S.BalancesData>
            <S.PriceCardPainel>
              {btcPrice !== undefined ? formatCurrencyBRL(btcPrice) : '—'}
            </S.PriceCardPainel>
          </S.BalancesData>
        </S.CardPainelBTC>

        <Button
          title="Comprar Bitcoin"
          variant="primary"
          onPress={() => router.push('/negociar')}
        />
        {/* <Button title="Sair" variant="outline" onPress={clearSession} /> */}

        <S.SectionHeaderRow>
          <S.SectionTitle>Últimas movimentações</S.SectionTitle>
          <Link href="/historico">
            <S.SeeAllLink>Ver todas</S.SeeAllLink>
          </Link>
        </S.SectionHeaderRow>

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
          scrollEnabled={false}
        />
      </S.Container>
    </SafeAreaView>
  );
}
