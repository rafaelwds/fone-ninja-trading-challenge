import { renderWithTheme } from '@/test-utils/render-with-theme';

import { TransactionItem } from './index';

describe('TransactionItem', () => {
  it('mostra titulo, data, valor e quantidade em BTC de uma compra', async () => {
    const { getByText } = await renderWithTheme(
      <TransactionItem
        kind="buy"
        title="Compra de BTC"
        date="Hoje, 10:42"
        amountLabel="−R$ 500,00"
        btcAmountLabel="0,00200803 BTC"
      />
    );

    expect(getByText('Compra de BTC')).toBeTruthy();
    expect(getByText('Hoje, 10:42')).toBeTruthy();
    expect(getByText('−R$ 500,00')).toBeTruthy();
    expect(getByText('0,00200803 BTC')).toBeTruthy();
  });

  it('mostra o icone de seta para baixo numa compra (e nao o de venda)', async () => {
    const { getByTestId, queryByTestId } = await renderWithTheme(
      <TransactionItem
        kind="buy"
        title="Compra de BTC"
        date="Hoje, 10:42"
        amountLabel="−R$ 500,00"
        btcAmountLabel="0,00200803 BTC"
      />
    );

    expect(getByTestId('transaction-icon-buy')).toBeTruthy();
    expect(queryByTestId('transaction-icon-sell')).toBeNull();
  });

  it('mostra o icone de seta para cima numa venda (e nao o de compra)', async () => {
    const { getByTestId, queryByTestId } = await renderWithTheme(
      <TransactionItem
        kind="sell"
        title="Venda de BTC"
        date="Ontem, 16:20"
        amountLabel="+R$ 107,28"
        btcAmountLabel="0,00050000 BTC"
      />
    );

    expect(getByTestId('transaction-icon-sell')).toBeTruthy();
    expect(queryByTestId('transaction-icon-buy')).toBeNull();
  });
});
