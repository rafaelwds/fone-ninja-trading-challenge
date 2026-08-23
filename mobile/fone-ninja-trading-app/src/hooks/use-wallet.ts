import { useQuery } from '@tanstack/react-query';

import { getWallet } from '@/services/wallet';
import { useAuthStore } from '@/store/auth-store';

/** GET /wallet, so dispara com o usuario autenticado (precisa do token). */
export function useWallet() {
  const token = useAuthStore((state) => state.token);

  return useQuery({
    queryKey: ['wallet'],
    queryFn: () => getWallet(token!),
    enabled: Boolean(token),
  });
}
