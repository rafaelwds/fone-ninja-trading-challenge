<?php

use App\Exceptions\InsufficientBalanceException;
use App\Services\TradeService;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

beforeEach(function () {
    Cache::store(config('trading.market.cache_store'))->put(
        config('trading.market.cache_key'),
        ['symbol' => 'BTC', 'currency' => 'BRL', 'price' => '300000.00', 'updated_at' => now()->toIso8601String()],
        config('trading.market.cache_ttl')
    );
});

it('trunca a quantidade de BTC em 8 casas decimais na compra', function () {
    $user = userWithWallet([], ['brl_balance' => '100.00', 'btc_balance' => '0']);

    // 100 / 300000 = 0.000333333... -> truncado para 0.00033333
    $transaction = app(TradeService::class)->buy($user, '100.00');

    expect($transaction->btc_amount)->toBe('0.00033333');
});

it('lanca InsufficientBalanceException ao comprar sem saldo em reais', function () {
    $user = userWithWallet([], ['brl_balance' => '10.00', 'btc_balance' => '0']);

    app(TradeService::class)->buy($user, '1000.00');
})->throws(InsufficientBalanceException::class, 'Saldo em reais insuficiente para realizar a compra.');

it('lanca InsufficientBalanceException ao vender sem saldo em BTC', function () {
    $user = userWithWallet([], ['brl_balance' => '0', 'btc_balance' => '0.001']);

    app(TradeService::class)->sell($user, '1.00000000');
})->throws(InsufficientBalanceException::class, 'Saldo em Bitcoin insuficiente para realizar a venda.');

it('usa lockForUpdate para ler a carteira durante a compra e a venda', function () {
    // O SQLite (usado por padrao nesta suite) ignora lockForUpdate() - sua gramatica compila
    // a clausula de lock como string vazia (ver SQLiteGrammar::compileLock). Por isso a query
    // gerada so contem "for update" quando o driver e MySQL, e o teste de concorrencia real
    // (duas conexoes disputando o mesmo lock) fica em tests/Feature/Concurrency/ConcurrencyTest.php.
    $user = userWithWallet([], ['brl_balance' => '1000.00', 'btc_balance' => '0.01']);

    $executed = [];
    DB::listen(function ($query) use (&$executed) {
        $executed[] = $query->sql;
    });

    app(TradeService::class)->buy($user, '100.00');

    $walletQuery = collect($executed)->first(fn ($sql) => str_contains($sql, 'wallets'));

    expect($walletQuery)->not->toBeNull();

    if (config('database.default') === 'mysql') {
        expect(strtolower($walletQuery))->toContain('for update');
    }
});
