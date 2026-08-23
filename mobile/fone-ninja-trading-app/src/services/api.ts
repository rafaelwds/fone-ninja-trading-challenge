import { Platform } from 'react-native';

/**
 * URL base da API (backend Laravel em ../../backend).
 *
 * Pode ser definida via EXPO_PUBLIC_API_URL no arquivo .env. Em qualquer caso,
 * se o host configurado for "localhost" e o app estiver rodando no emulador
 * Android, trocamos para 10.0.2.2 automaticamente: "localhost" ali dentro
 * aponta pro proprio emulador, nao pra maquina host onde o backend roda (Web
 * e iOS Simulator enxergam "localhost" normalmente, entao ficam como estao).
 */
function resolveBaseUrl(): string {
  const configured = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8000/api';

  if (Platform.OS === 'android' && configured.includes('localhost')) {
    return configured.replace('localhost', '10.0.2.2');
  }

  return configured;
}

export const API_BASE_URL = resolveBaseUrl();

/**
 * Erro lancado quando a API responde com um status HTTP de erro (4xx/5xx).
 * Guarda a mensagem e os erros de validacao por campo (quando existirem), no
 * mesmo formato que o backend Laravel retorna: { message, errors: { campo: [...] } }.
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  token?: string | null;
};

/**
 * Client HTTP minimo para conversar com a API - so `fetch`, sem dependencias
 * extras. Sempre manda/recebe JSON e converte respostas de erro em ApiError,
 * pra quem chamar poder tratar (ex: mostrar `error.message` na tela).
 */
export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, token } = options;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const json = await response.json().catch(() => null);

  if (!response.ok) {
    const message: string = json?.message ?? 'Nao foi possivel completar a requisicao.';
    throw new ApiError(message, response.status, json?.errors);
  }

  return json as T;
}
