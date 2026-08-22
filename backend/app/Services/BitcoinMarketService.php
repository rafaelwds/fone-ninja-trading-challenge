<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\Log;
use Throwable;

class BitcoinMarketService
{
    /**
     * Retorna o preco simulado do BTC em BRL, cacheado por alguns segundos.
     *
     * @return array{symbol: string, currency: string, price: string, updated_at: string}
     */
    public function getPrice(): array
    {
        $store = config('trading.market.cache_store');
        $key = config('trading.market.cache_key');
        $ttl = config('trading.market.cache_ttl');

        try {
            return Cache::store($store)->remember($key, $ttl, fn () => $this->generatePrice());
        } catch (Throwable $e) {
            // Redis indisponivel: gera o preco na hora, sem cache, para nao derrubar a API.
            Log::warning('Cache Redis indisponivel ao consultar o preco do BTC.', [
                'exception' => $e->getMessage(),
            ]);

            return $this->generatePrice();
        }
    }

    /**
     * @return array{symbol: string, currency: string, price: string, updated_at: string}
     */
    private function generatePrice(): array
    {
        $min = (int) round(config('trading.market.min_price') * 100);
        $max = (int) round(config('trading.market.max_price') * 100);

        $priceInCents = random_int($min, $max);

        return [
            'symbol' => 'BTC',
            'currency' => 'BRL',
            'price' => number_format($priceInCents / 100, 2, '.', ''),
            'updated_at' => Date::now()->toIso8601String(),
        ];
    }
}
