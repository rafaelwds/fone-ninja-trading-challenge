import { useQuery } from '@tanstack/react-query';

import { getMarketPrice } from '@/services/market';
import { useAuthStore } from '@/store/auth-store';

/**
 * GET /market/btc. O backend cacheia o preco por 30s (Redis), entao refazemos
 * a busca nesse mesmo intervalo para acompanhar quando ele muda.
 */
export function useMarketPrice() {
  const token = useAuthStore((state) => state.token);

  return useQuery({
    queryKey: ['market', 'btc'],
    queryFn: () => getMarketPrice(token!),
    enabled: Boolean(token),
    refetchInterval: 30_000,
  });
}
