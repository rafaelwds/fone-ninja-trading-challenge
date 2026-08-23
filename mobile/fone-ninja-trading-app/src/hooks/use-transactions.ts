import { useQuery } from '@tanstack/react-query';

import { getTransactions, type TransactionsParams } from '@/services/transactions';
import { useAuthStore } from '@/store/auth-store';

/** GET /transactions - historico paginado do usuario autenticado. */
export function useTransactions(params: TransactionsParams = {}) {
  const token = useAuthStore((state) => state.token);

  return useQuery({
    queryKey: ['transactions', params],
    queryFn: () => getTransactions(token!, params),
    enabled: Boolean(token),
  });
}
