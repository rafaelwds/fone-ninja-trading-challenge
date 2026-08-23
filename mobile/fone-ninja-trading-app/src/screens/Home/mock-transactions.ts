import type { TransactionItemProps } from '@/components/TransactionItem';

// Mock temporario so pra desenhar a tela - troca pela chamada real da API
// (GET /transactions) quando a integracao do historico for feita.
export const mockTransactions: (TransactionItemProps & { id: string })[] = [
  {
    id: '1',
    kind: 'buy',
    title: 'Compra de BTC',
    date: 'Hoje, 10:42',
    amountLabel: '−R$ 500,00',
    btcAmountLabel: '0,00200803 BTC',
  },
  {
    id: '2',
    kind: 'sell',
    title: 'Venda de BTC',
    date: 'Ontem, 16:20',
    amountLabel: '+R$ 248,50',
    btcAmountLabel: '0,00100000 BTC',
  },
];
