<?php

use App\Services\BitcoinMarketService;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Config;

it('gera precos sempre dentro do intervalo configurado', function () {
    $service = app(BitcoinMarketService::class);

    for ($i = 0; $i < 20; $i++) {
        Cache::store(config('trading.market.cache_store'))->forget(config('trading.market.cache_key'));

        $price = (float) $service->getPrice()['price'];

        expect($price)->toBeGreaterThanOrEqual(config('trading.market.min_price'))
            ->and($price)->toBeLessThanOrEqual(config('trading.market.max_price'));
    }
});

it('mantem o preco em cache pelo TTL configurado', function () {
    $service = app(BitcoinMarketService::class);

    Cache::store(config('trading.market.cache_store'))->forget(config('trading.market.cache_key'));

    $first = $service->getPrice();
    $second = $service->getPrice();

    expect($second)->toBe($first);
});

it('gera o preco normalmente mesmo se o cache configurado nao existir (Redis indisponivel)', function () {
    Config::set('trading.market.cache_store', 'store-inexistente-simulando-redis-fora-do-ar');

    $service = app(BitcoinMarketService::class);

    $price = $service->getPrice();

    expect($price)->toHaveKeys(['symbol', 'currency', 'price', 'updated_at']);
    expect((float) $price['price'])->toBeGreaterThanOrEqual(config('trading.market.min_price'));
});
