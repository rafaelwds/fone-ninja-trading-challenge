import { apiFetch } from './api';
import type { Transaction } from './transactions';

export type TradeResponse = {
  data: Transaction;
};

/** POST /trade/buy - compra BTC usando `amount_brl` reais da carteira do usuario. */
export function buyBitcoin(token: string, amountBrl: string) {
  return apiFetch<TradeResponse>('/trade/buy', {
    method: 'POST',
    token,
    body: { amount_brl: amountBrl },
  });
}

/** POST /trade/sell - vende `amount_btc` BTC da carteira do usuario por reais. */
export function sellBitcoin(token: string, amountBtc: string) {
  return apiFetch<TradeResponse>('/trade/sell', {
    method: 'POST',
    token,
    body: { amount_btc: amountBtc },
  });
}
