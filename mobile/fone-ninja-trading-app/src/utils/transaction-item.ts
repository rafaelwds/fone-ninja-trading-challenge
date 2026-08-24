import type { TransactionItemProps } from '@/components/TransactionItem';
import type { Transaction } from '@/services/transactions';

import { formatBtc, formatCurrencyBRL, formatTransactionDate } from './format';

/** Converte uma transacao vinda da API no formato que o `TransactionItem` espera pra exibir. */
export function toTransactionItemProps(
  transaction: Transaction
): TransactionItemProps & { id: string } {
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
