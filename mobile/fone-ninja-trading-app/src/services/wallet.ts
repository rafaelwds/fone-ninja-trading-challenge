import { apiFetch } from './api';

export type Wallet = {
  brl_balance: string;
  btc_balance: string;
};

export type WalletResponse = {
  data: Wallet;
};

/** GET /wallet - saldo em reais e em BTC da carteira do usuario autenticado. */
export function getWallet(token: string) {
  return apiFetch<WalletResponse>('/wallet', { token });
}
