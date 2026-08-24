import type { Transaction } from '@/services/transactions';
import { formatCurrencyBRL } from '@/utils/format';

import { toTransactionItemProps } from './transaction-item';

function makeTransaction(overrides: Partial<Transaction> = {}): Transaction {
  return {
    id: 1,
    type: 'buy',
    brl_amount: '500.00',
    btc_amount: '0.00200803',
    btc_unit_price: '249000.00',
    created_at: '2026-08-23T10:42:00Z',
    ...overrides,
  };
}

describe('toTransactionItemProps', () => {
  it('mapeia uma compra com titulo, sinal negativo e kind "buy"', () => {
    const result = toTransactionItemProps(makeTransaction({ type: 'buy', id: 7 }));

    expect(result.id).toBe('7');
    expect(result.kind).toBe('buy');
    expect(result.title).toBe('Compra de BTC');
    expect(result.amountLabel).toBe(`−${formatCurrencyBRL('500.00')}`);
    expect(result.btcAmountLabel).toBe('0,00200803 BTC');
  });

  it('mapeia uma venda com titulo, sinal positivo e kind "sell"', () => {
    const result = toTransactionItemProps(
      makeTransaction({ type: 'sell', brl_amount: '107.28', btc_amount: '0.00050000' })
    );

    expect(result.kind).toBe('sell');
    expect(result.title).toBe('Venda de BTC');
    expect(result.amountLabel).toBe(`+${formatCurrencyBRL('107.28')}`);
    expect(result.btcAmountLabel).toBe('0,00050000 BTC');
  });

  it('converte o id numerico da API para string (chave da lista)', () => {
    const result = toTransactionItemProps(makeTransaction({ id: 42 }));
    expect(result.id).toBe('42');
    expect(typeof result.id).toBe('string');
  });
});
