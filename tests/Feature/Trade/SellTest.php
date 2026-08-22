<?php

use App\Models\Transaction;
use App\Models\Wallet;
use App\Services\TradeService;
use Illuminate\Support\Facades\Cache;

beforeEach(function () {
    Cache::store(config('trading.market.cache_store'))->put(
        config('trading.market.cache_key'),
        ['symbol' => 'BTC', 'currency' => 'BRL', 'price' => '250000.00', 'updated_at' => now()->toIso8601String()],
        config('trading.market.cache_ttl')
    );
});

it('realiza uma venda com sucesso', function () {
    $user = userWithWallet([], ['brl_balance' => '0', 'btc_balance' => '0.01000000']);

    $response = $this->actingAs($user)->postJson('/api/trade/sell', ['amount_btc' => '0.00100000']);

    $response->assertCreated()
        ->assertJsonPath('data.type', 'sell')
        ->assertJsonPath('data.btc_amount', '0.00100000')
        ->assertJsonPath('data.btc_unit_price', '250000.00');
});

it('converte BTC para reais corretamente (quantidade x preco)', function () {
    $user = userWithWallet([], ['brl_balance' => '0', 'btc_balance' => '0.01000000']);

    $response = $this->actingAs($user)->postJson('/api/trade/sell', ['amount_btc' => '0.00100000']);

    // 0.001 * 250000 = 250.00
    $response->assertJsonPath('data.brl_amount', '250.00');
});

it('atualiza os dois saldos da carteira apos a venda', function () {
    $user = userWithWallet([], ['brl_balance' => '0', 'btc_balance' => '0.01000000']);

    $this->actingAs($user)->postJson('/api/trade/sell', ['amount_btc' => '0.00100000'])->assertCreated();

    $wallet = $user->wallet()->firstOrFail();

    expect($wallet->brl_balance)->toBe('250.00');
    expect($wallet->btc_balance)->toBe('0.00900000');
});

it('registra a venda no historico de transacoes', function () {
    $user = userWithWallet([], ['brl_balance' => '0', 'btc_balance' => '0.01000000']);

    $this->actingAs($user)->postJson('/api/trade/sell', ['amount_btc' => '0.00100000'])->assertCreated();

    $this->assertDatabaseHas('transactions', [
        'user_id' => $user->id,
        'type' => 'sell',
        'brl_amount' => '250.00',
        'btc_amount' => '0.00100000',
        'btc_unit_price' => '250000.00',
    ]);
});

it('rejeita venda com valor zero ou negativo', function ($amount) {
    $user = userWithWallet();

    $response = $this->actingAs($user)->postJson('/api/trade/sell', ['amount_btc' => $amount]);

    $response->assertStatus(422)->assertJsonValidationErrors('amount_btc');
})->with([
    'zero' => ['0'],
    'negativo' => ['-0.001'],
]);

it('rejeita venda com saldo em BTC insuficiente', function () {
    $user = userWithWallet([], ['brl_balance' => '0', 'btc_balance' => '0.0001']);

    $response = $this->actingAs($user)->postJson('/api/trade/sell', ['amount_btc' => '1.00000000']);

    $response->assertStatus(422)
        ->assertJson(['message' => 'Saldo em Bitcoin insuficiente para realizar a venda.']);

    $wallet = $user->wallet()->firstOrFail();
    expect($wallet->btc_balance)->toBe('0.00010000');
});

it('desfaz a venda por completo se a transacao falhar (rollback)', function () {
    $user = userWithWallet([], ['brl_balance' => '0', 'btc_balance' => '0.01000000']);

    Transaction::creating(function () {
        throw new RuntimeException('Falha simulada ao registrar a transacao.');
    });

    try {
        app(TradeService::class)->sell($user, '0.00100000');
    } catch (RuntimeException) {
        // esperado
    }

    Transaction::flushEventListeners();

    $wallet = Wallet::query()->where('user_id', $user->id)->firstOrFail();

    expect($wallet->brl_balance)->toBe('0.00');
    expect($wallet->btc_balance)->toBe('0.01000000');
    expect(Transaction::where('user_id', $user->id)->count())->toBe(0);
});
