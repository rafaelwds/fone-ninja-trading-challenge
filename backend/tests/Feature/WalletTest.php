<?php

it('retorna a carteira do usuario autenticado', function () {
    $user = userWithWallet([], ['brl_balance' => '5000.00', 'btc_balance' => '0.12345678']);

    $response = $this->actingAs($user)->getJson('/api/wallet');

    $response->assertOk()
        ->assertJsonPath('data.brl_balance', '5000.00')
        ->assertJsonPath('data.btc_balance', '0.12345678');
});

it('nao permite acessar a carteira sem autenticacao', function () {
    $this->getJson('/api/wallet')->assertStatus(401);
});

it('cada usuario ve apenas a propria carteira', function () {
    $userA = userWithWallet([], ['brl_balance' => '1111.11']);
    $userB = userWithWallet([], ['brl_balance' => '2222.22']);

    $this->actingAs($userA)->getJson('/api/wallet')->assertJsonPath('data.brl_balance', '1111.11');
    $this->actingAs($userB)->getJson('/api/wallet')->assertJsonPath('data.brl_balance', '2222.22');
});
