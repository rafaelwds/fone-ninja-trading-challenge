import { apiFetch } from './api';

export type TransactionType = 'buy' | 'sell';

export type Transaction = {
  id: number;
  type: TransactionType;
  brl_amount: string;
  btc_amount: string;
  btc_unit_price: string;
  created_at: string;
};

export type TransactionsMeta = {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
};

export type TransactionsResponse = {
  data: Transaction[];
  meta: TransactionsMeta;
};

export type TransactionsParams = {
  page?: number;
  per_page?: number;
};

/** GET /transactions - historico paginado do usuario autenticado, mais recente primeiro. */
export function getTransactions(token: string, params: TransactionsParams = {}) {
  const query = new URLSearchParams();
  if (params.page) query.set('page', String(params.page));
  if (params.per_page) query.set('per_page', String(params.per_page));

  const queryString = query.toString();

  return apiFetch<TransactionsResponse>(`/transactions${queryString ? `?${queryString}` : ''}`, {
    token,
  });
}
