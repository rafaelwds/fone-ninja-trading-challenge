<?php

use App\Models\User;
use Illuminate\Support\Facades\Hash;

it('autentica com credenciais corretas e retorna o token', function () {
    $user = User::factory()->create([
        'email' => 'rafael@example.com',
        'password' => Hash::make('password'),
    ]);

    $response = $this->postJson('/api/login', [
        'email' => 'rafael@example.com',
        'password' => 'password',
    ]);

    $response->assertOk()
        ->assertJsonPath('data.user.id', $user->id)
        ->assertJsonStructure(['data' => ['user' => ['id', 'name', 'email'], 'token']]);
});

it('rejeita login com senha incorreta', function () {
    User::factory()->create([
        'email' => 'rafael@example.com',
        'password' => Hash::make('password'),
    ]);

    $response = $this->postJson('/api/login', [
        'email' => 'rafael@example.com',
        'password' => 'senha-errada',
    ]);

    $response->assertStatus(401);
});

it('rejeita login com e-mail inexistente', function () {
    $response = $this->postJson('/api/login', [
        'email' => 'nao-existe@example.com',
        'password' => 'password',
    ]);

    $response->assertStatus(401);
});

it('exige e-mail e senha para o login', function () {
    $response = $this->postJson('/api/login', []);

    $response->assertStatus(422)->assertJsonValidationErrors(['email', 'password']);
});
