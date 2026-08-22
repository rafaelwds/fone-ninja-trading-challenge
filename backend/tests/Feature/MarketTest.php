<?php

use Illuminate\Support\Facades\Cache;

it('bloqueia o acesso ao mercado sem autenticacao', function () {
    $this->getJson('/api/market/btc')->assertStatus(401);
});

it('retorna o preco do BTC sempre entre R$ 200.000,00 e R$ 300.000,00', function () {
    $user = userWithWallet();

    for ($i = 0; $i < 15; $i++) {
        Cache::store(config('trading.market.cache_store'))->forget(config('trading.market.cache_key'));

        $response = $this->actingAs($user)->getJson('/api/market/btc');

        $response->assertOk()
            ->assertJsonPath('data.symbol', 'BTC')
            ->assertJsonPath('data.currency', 'BRL');

        $price = (float) $response->json('data.price');

        expect($price)->toBeGreaterThanOrEqual(200000.0)
            ->and($price)->toBeLessThanOrEqual(300000.0);
    }
});

it('mantem o mesmo preco enquanto o cache estiver valido', function () {
    $user = userWithWallet();

    Cache::store(config('trading.market.cache_store'))->forget(config('trading.market.cache_key'));

    $first = $this->actingAs($user)->getJson('/api/market/btc')->json('data');
    $second = $this->actingAs($user)->getJson('/api/market/btc')->json('data');

    expect($second['price'])->toBe($first['price']);
    expect($second['updated_at'])->toBe($first['updated_at']);
});

it('gera um novo preco depois que o cache expira', function () {
    $user = userWithWallet();

    $store = config('trading.market.cache_store');
    $key = config('trading.market.cache_key');

    Cache::store($store)->forget($key);

    $before = $this->actingAs($user)->getJson('/api/market/btc')->json('data.price');

    // Simula a expiracao do TTL de 30s sem esperar de verdade.
    Cache::store($store)->forget($key);

    $after = $this->actingAs($user)->getJson('/api/market/btc')->json('data.price');

    expect(Cache::store($store)->has($key))->toBeTrue();
    // Extremamente improvavel (1 em ~10 milhoes) que o novo preco sorteado coincida com o anterior.
    expect($after)->not->toBe($before);
});
