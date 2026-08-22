<?php

use App\Models\Transaction;
use App\Models\User;
use App\Models\Wallet;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Symfony\Component\Process\Process;

/*
|--------------------------------------------------------------------------
| Teste de concorrencia real (lockForUpdate)
|--------------------------------------------------------------------------
|
| Este teste dispara duas compras simultaneas, em dois processos PHP totalmente
| separados (cada um com sua propria conexao com o banco), tentando gastar o
| mesmo saldo em reais da mesma carteira. Sem o lockForUpdate em TradeService,
| seria possivel que os dois processos lessem o saldo original antes de qualquer
| um deles commitar, resultando em saldo negativo (double-spend). Com o lock,
| o segundo processo so consegue ler o saldo depois que o primeiro commitar,
| entao no maximo uma das duas compras deve ser aceita.
|
| Por que isso nao roda em SQLite: o SQLite (especialmente em :memory:, usado no
| restante da suite) nao oferece locking de linha real entre conexoes concorrentes
| e a suite usa RefreshDatabase (uma unica transacao por teste), o que impede que
| processos filhos enxerguem dados ainda nao commitados. Por isso este teste exige
| MySQL (o mesmo banco usado no docker-compose) e e pulado em qualquer outro driver.
|
*/

beforeEach(function () {
    if (DB::connection()->getDriverName() !== 'mysql') {
        $this->markTestSkipped('Teste de concorrencia real requer MySQL (rode via docker-compose). Ver README, secao "Controle de concorrencia".');
    }

    Artisan::call('migrate:fresh');
});

it('impede que duas compras simultaneas gastem o mesmo saldo (lockForUpdate)', function () {
    $user = User::factory()->create();
    $wallet = Wallet::factory()->for($user)->create([
        'brl_balance' => '1000.00',
        'btc_balance' => '0.00000000',
    ]);

    $command = static fn () => [
        PHP_BINARY,
        base_path('artisan'),
        'trade:test-buy',
        (string) $user->id,
        '1000.00',
    ];

    $processA = new Process($command());
    $processB = new Process($command());

    // Inicia os dois processos o mais proximo possivel um do outro para maximizar a
    // chance de disputarem o lock da mesma linha ao mesmo tempo.
    $processA->start();
    $processB->start();

    $processA->wait();
    $processB->wait();

    $outputs = [trim($processA->getOutput()), trim($processB->getOutput())];

    expect($outputs)->toContain('OK');
    expect($outputs)->toContain('INSUFFICIENT_BALANCE');

    $wallet->refresh();

    // Apenas uma compra deve ter sido efetivada: sem double-spend do saldo em reais.
    expect(Transaction::where('user_id', $user->id)->count())->toBe(1);
    expect((float) $wallet->brl_balance)->toBe(0.0);
    expect((float) $wallet->btc_balance)->toBeGreaterThan(0.0);
});
