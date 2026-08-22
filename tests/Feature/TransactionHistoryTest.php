<?php

use App\Models\Transaction;

it('bloqueia o acesso ao historico sem autenticacao', function () {
    $this->getJson('/api/transactions')->assertStatus(401);
});

it('lista apenas as transacoes do usuario autenticado', function () {
    $userA = userWithWallet();
    $userB = userWithWallet();

    Transaction::factory()->for($userA)->for($userA->wallet, 'wallet')->count(3)->create();
    Transaction::factory()->for($userB)->for($userB->wallet, 'wallet')->count(2)->create();

    $response = $this->actingAs($userA)->getJson('/api/transactions');

    $response->assertOk();
    expect($response->json('meta.total'))->toBe(3);

    foreach ($response->json('data') as $transaction) {
        $this->assertDatabaseHas('transactions', ['id' => $transaction['id'], 'user_id' => $userA->id]);
    }
});

it('ordena o historico da mais recente para a mais antiga', function () {
    $user = userWithWallet();

    $old = Transaction::factory()->for($user)->for($user->wallet, 'wallet')->create(['created_at' => now()->subDays(2)]);
    $newest = Transaction::factory()->for($user)->for($user->wallet, 'wallet')->create(['created_at' => now()]);
    $middle = Transaction::factory()->for($user)->for($user->wallet, 'wallet')->create(['created_at' => now()->subDay()]);

    $response = $this->actingAs($user)->getJson('/api/transactions');

    $ids = array_column($response->json('data'), 'id');

    expect($ids)->toBe([$newest->id, $middle->id, $old->id]);
});

it('pagina o historico respeitando o limite maximo de 100 por pagina', function () {
    $user = userWithWallet();

    Transaction::factory()->for($user)->for($user->wallet, 'wallet')->count(25)->create();

    $response = $this->actingAs($user)->getJson('/api/transactions?per_page=10&page=2');

    $response->assertOk();
    expect($response->json('meta.per_page'))->toBe(10);
    expect($response->json('meta.current_page'))->toBe(2);
    expect($response->json('meta.total'))->toBe(25);
    expect($response->json('meta.last_page'))->toBe(3);
    expect($response->json('data'))->toHaveCount(10);

    $clamped = $this->actingAs($user)->getJson('/api/transactions?per_page=500');
    expect($clamped->json('meta.per_page'))->toBe(100);
});
