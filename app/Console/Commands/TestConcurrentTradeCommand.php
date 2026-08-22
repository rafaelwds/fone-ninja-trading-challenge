<?php

namespace App\Console\Commands;

use App\Exceptions\InsufficientBalanceException;
use App\Models\User;
use App\Services\TradeService;
use Illuminate\Console\Command;

/**
 * Comando utilitario usado apenas pelo teste de concorrencia (tests/Feature/Concurrency).
 *
 * Executa uma unica compra em um processo PHP separado, permitindo simular duas
 * requisicoes de compra concorrentes disputando o mesmo saldo de carteira via lockForUpdate.
 */
class TestConcurrentTradeCommand extends Command
{
    protected $signature = 'trade:test-buy {user_id} {amount_brl} {delay_ms=0}';

    protected $description = 'Executa uma compra de BTC para uso exclusivo do teste automatizado de concorrencia.';

    public function handle(TradeService $trades): int
    {
        $user = User::query()->findOrFail((int) $this->argument('user_id'));

        if ((int) $this->argument('delay_ms') > 0) {
            usleep(((int) $this->argument('delay_ms')) * 1000);
        }

        try {
            $trades->buy($user, (string) $this->argument('amount_brl'));
        } catch (InsufficientBalanceException $e) {
            $this->line('INSUFFICIENT_BALANCE');

            return self::FAILURE;
        }

        $this->line('OK');

        return self::SUCCESS;
    }
}
