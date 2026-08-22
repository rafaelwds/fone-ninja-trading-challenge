<?php

use App\Models\User;
use App\Models\Wallet;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/*
|--------------------------------------------------------------------------
| Test Case
|--------------------------------------------------------------------------
*/

pest()->extend(TestCase::class)
    ->use(RefreshDatabase::class)
    ->in('Feature', 'Unit');

/*
 * O teste de concorrencia real (tests/Concurrency) precisa de conexoes de banco independentes
 * (processos PHP separados) para provar o lockForUpdate. RefreshDatabase envolve o teste numa
 * transacao unica que os processos filhos nao enxergariam, entao essa pasta usa setup proprio
 * (migrate:fresh manual) e por isso fica fora de tests/Feature e tests/Unit.
 */
pest()->extend(TestCase::class)
    ->in('Concurrency');

/*
|--------------------------------------------------------------------------
| Functions
|--------------------------------------------------------------------------
*/

function userWithWallet(array $userAttributes = [], array $walletAttributes = []): User
{
    $user = User::factory()->create($userAttributes);

    Wallet::factory()->for($user)->create($walletAttributes);

    return $user->fresh('wallet');
}
