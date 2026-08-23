import { useMutation, useQueryClient } from '@tanstack/react-query';

import { buyBitcoin, sellBitcoin } from '@/services/trade';
import { useAuthStore } from '@/store/auth-store';

/**
 * POST /trade/buy e /trade/sell. Em ambos, ao dar certo, invalidamos os
 * caches de carteira e transacoes - assim a Home e o Historico se atualizam
 * sozinhos na proxima vez que forem exibidos, sem precisar de refetch manual.
 */
export function useBuyBitcoin() {
  const token = useAuthStore((state) => state.token);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (amountBrl: string) => buyBitcoin(token!, amountBrl),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
}

export function useSellBitcoin() {
  const token = useAuthStore((state) => state.token);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (amountBtc: string) => sellBitcoin(token!, amountBtc),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
}
