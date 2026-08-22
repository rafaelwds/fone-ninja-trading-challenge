<?php

use App\Models\User;
use App\Models\Wallet;

it('cadastra um usuario com sucesso e retorna o token', function () {
    $response = $this->postJson('/api/register', [
        'name' => 'Rafael Fernando',
        'email' => 'rafael@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $response->assertCreated()
        ->assertJsonPath('data.user.name', 'Rafael Fernando')
        ->assertJsonPath('data.user.email', 'rafael@example.com')
        ->assertJsonStructure(['data' => ['user' => ['id', 'name', 'email', 'created_at'], 'token']]);

    $this->assertDatabaseHas('users', ['email' => 'rafael@example.com']);
});

it('cria automaticamente a carteira com R$ 10.000,00 e 0 BTC ao cadastrar', function () {
    $response = $this->postJson('/api/register', [
        'name' => 'Rafael Fernando',
        'email' => 'rafael@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $userId = $response->json('data.user.id');

    $wallet = Wallet::query()->where('user_id', $userId)->firstOrFail();

    expect($wallet->brl_balance)->toBe('10000.00');
    expect($wallet->btc_balance)->toBe('0.00000000');
});

it('nao permite cadastrar com e-mail duplicado', function () {
    User::factory()->create(['email' => 'rafael@example.com']);

    $response = $this->postJson('/api/register', [
        'name' => 'Rafael Fernando',
        'email' => 'rafael@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $response->assertStatus(422)->assertJsonValidationErrors('email');
});

it('exige nome, e-mail e senha valida no cadastro', function () {
    $response = $this->postJson('/api/register', [
        'name' => '',
        'email' => 'nao-e-email',
        'password' => '123',
        'password_confirmation' => 'diferente',
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['name', 'email', 'password']);
});
