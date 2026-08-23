import { FlashList } from '@shopify/flash-list';
import { Link } from 'expo-router';

import { Button } from '@/components/Button';
import { TransactionItem } from '@/components/TransactionItem';
import { useAuthStore } from '@/store/auth-store';

import * as S from './styles';
import { Header } from '@/components/Header';
import { SafeAreaView } from 'react-native-safe-area-context';
import { mockTransactions } from './mock-transactions';

export function Home() {
  const name = useAuthStore((state) => state.user?.name);
  const clearSession = useAuthStore((state) => state.clearSession);

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
      <S.Container>
        <Header variant="walet" title="Sua carteira" />
        <S.Card>
          <S.TitleCard>Patrimônio estimado</S.TitleCard>
          <S.PriceCard>R$ 10.622,50</S.PriceCard>
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
                <S.TextDecriptionCircle>R$ 10.000,00</S.TextDecriptionCircle>
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
                <S.TextDecriptionCircle>0,00250000 BTC</S.TextDecriptionCircle>
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
            <S.PriceCardPainel>R$ 200.000,00</S.PriceCardPainel>
            <S.SubtitleCardPainel>+ 5,00%</S.SubtitleCardPainel>
          </S.BalancesData>
        </S.CardPainelBTC>

        <Button title="Comprar Bitcoin" variant="primary" onPress={clearSession} />
        {/* <Button title="Sair" variant="outline" onPress={clearSession} /> */}

        <S.SectionHeaderRow>
          <S.SectionTitle>Últimas movimentações</S.SectionTitle>
          <Link href="/historico">
            <S.SeeAllLink>Ver todas</S.SeeAllLink>
          </Link>
        </S.SectionHeaderRow>

        <FlashList
          data={mockTransactions}
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
          scrollEnabled={false}
        />
      </S.Container>
    </SafeAreaView>
  );
}
