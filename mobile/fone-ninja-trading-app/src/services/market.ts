import { apiFetch } from './api';

export type MarketPrice = {
  symbol: string;
  currency: string;
  price: string;
  updated_at: string;
};

export type MarketPriceResponse = {
  data: MarketPrice;
};

/** GET /market/btc - preco simulado do BTC (cacheado 30s no backend). */
export function getMarketPrice(token: string) {
  return apiFetch<MarketPriceResponse>('/market/btc', { token });
}
