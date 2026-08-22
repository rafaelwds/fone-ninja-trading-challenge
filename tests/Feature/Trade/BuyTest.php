<?php

use App\Models\Transaction;
use App\Models\Wallet;
use App\Services\TradeService;
use Illuminate\Support\Facades\Cache;

beforeEach(function () {
    // Fixa o preco do BTC para tornar os calculos previsiveis nos testes.
    Cache::store(config('trading.market.cache_store'))->put(
        config('trading.market.cache_key'),
        ['symbol' => 'BTC', 'currency' => 'BRL', 'price' => '250000.00', 'updated_at' => now()->toIso8601String()],
        config('trading.market.cache_ttl')
    );
});

it('realiza uma compra com sucesso', function () {
    $user = userWithWallet([], ['brl_balance' => '10000.00', 'btc_balance' => '0']);

    $response = $this->actingAs($user)->postJson('/api/trade/buy', ['amount_brl' => '1000.00']);

    $response->assertCreated()
        ->assertJsonPath('data.type', 'buy')
        ->assertJsonPath('data.brl_amount', '1000.00')
        ->assertJsonPath('data.btc_unit_price', '250000.00');
});

it('converte reais para BTC corretamente (valor / preco)', function () {
    $user = userWithWallet([], ['brl_balance' => '10000.00', 'btc_balance' => '0']);

    $response = $this->actingAs($user)->postJson('/api/trade/buy', ['amount_brl' => '1000.00']);

    // 1000 / 250000 = 0.004
    $response->assertJsonPath('data.btc_amount', '0.00400000');
});

it('atualiza os dois saldos da carteira apos a compra', function () {
    $user = userWithWallet([], ['brl_balance' => '10000.00', 'btc_balance' => '0']);

    $this->actingAs($user)->postJson('/api/trade/buy', ['amount_brl' => '1000.00'])->assertCreated();

    $wallet = $user->wallet()->firstOrFail();

    expect($wallet->brl_balance)->toBe('9000.00');
    expect($wallet->btc_balance)->toBe('0.00400000');
});

it('registra a compra no historico de transacoes', function () {
    $user = userWithWallet([], ['brl_balance' => '10000.00', 'btc_balance' => '0']);

    $this->actingAs($user)->postJson('/api/trade/buy', ['amount_brl' => '1000.00'])->assertCreated();

    $this->assertDatabaseHas('transactions', [
        'user_id' => $user->id,
        'type' => 'buy',
        'brl_amount' => '1000.00',
        'btc_amount' => '0.00400000',
        'btc_unit_price' => '250000.00',
    ]);
});

it('rejeita compra com valor zero ou negativo', function ($amount) {
    $user = userWithWallet();

    $response = $this->actingAs($user)->postJson('/api/trade/buy', ['amount_brl' => $amount]);

    $response->assertStatus(422)->assertJsonValidationErrors('amount_brl');
})->with([
    'zero' => ['0'],
    'negativo' => ['-100.00'],
]);

it('rejeita compra com saldo em reais insuficiente', function () {
    $user = userWithWallet([], ['brl_balance' => '100.00', 'btc_balance' => '0']);

    $response = $this->actingAs($user)->postJson('/api/trade/buy', ['amount_brl' => '1000.00']);

    $response->assertStatus(422)
        ->assertJson(['message' => 'Saldo em reais insuficiente para realizar a compra.']);

    $wallet = $user->wallet()->firstOrFail();
    expect($wallet->brl_balance)->toBe('100.00');
});

it('desfaz a compra por completo se a transacao falhar (rollback)', function () {
    $user = userWithWallet([], ['brl_balance' => '10000.00', 'btc_balance' => '0']);

    Transaction::creating(function () {
        throw new RuntimeException('Falha simulada ao registrar a transacao.');
    });

    try {
        app(TradeService::class)->buy($user, '1000.00');
    } catch (RuntimeException) {
        // esperado
    }

    Transaction::flushEventListeners();

    $wallet = Wallet::query()->where('user_id', $user->id)->firstOrFail();

    expect($wallet->brl_balance)->toBe('10000.00');
    expect($wallet->btc_balance)->toBe('0.00000000');
    expect(Transaction::where('user_id', $user->id)->count())->toBe(0);
});
