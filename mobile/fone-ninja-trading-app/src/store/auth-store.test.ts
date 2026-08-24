import type { AuthUser } from '@/services/auth';

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn().mockResolvedValue(null),
  setItemAsync: jest.fn().mockResolvedValue(undefined),
  deleteItemAsync: jest.fn().mockResolvedValue(undefined),
}));

import { useAuthStore } from './auth-store';

const user: AuthUser = { id: 1, name: 'Rafael Fernando', email: 'rafael@example.com' };

describe('useAuthStore', () => {
  beforeEach(() => {
    // A store e um singleton (mesma instancia entre testes) - reseta antes de cada um.
    useAuthStore.setState({ user: null, token: null, hasHydrated: false });
  });

  it('comeca sem usuario e sem token', () => {
    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().token).toBeNull();
  });

  it('setSession grava o usuario e o token', () => {
    useAuthStore.getState().setSession(user, 'abc123');

    expect(useAuthStore.getState().user).toEqual(user);
    expect(useAuthStore.getState().token).toBe('abc123');
  });

  it('clearSession apaga o usuario e o token (usado no logout)', () => {
    useAuthStore.getState().setSession(user, 'abc123');

    useAuthStore.getState().clearSession();

    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().token).toBeNull();
  });

  it('setHasHydrated marca que o SecureStore ja foi lido', () => {
    expect(useAuthStore.getState().hasHydrated).toBe(false);

    useAuthStore.getState().setHasHydrated(true);

    expect(useAuthStore.getState().hasHydrated).toBe(true);
  });
});
