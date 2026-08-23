import { apiFetch } from './api';

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  created_at?: string;
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export type LoginResponse = {
  data: {
    user: AuthUser;
    token: string;
  };
};

/** POST /login - autentica o usuario e retorna o usuario + o token Bearer (Sanctum). */
export function login(credentials: LoginCredentials) {
  return apiFetch<LoginResponse>('/login', {
    method: 'POST',
    body: credentials,
  });
}
