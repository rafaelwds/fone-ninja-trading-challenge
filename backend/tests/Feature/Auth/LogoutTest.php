<?php

use App\Models\User;
use Illuminate\Support\Facades\Auth;

it('revoga o token atual no logout', function () {
    $user = User::factory()->create();
    $token = $user->createToken('api')->plainTextToken;

    $response = $this->withHeader('Authorization', "Bearer {$token}")->postJson('/api/logout');

    $response->assertOk();

    $this->assertDatabaseCount('personal_access_tokens', 0);

    // O guard do Sanctum cacheia o usuario resolvido durante o ciclo de testes; em producao
    // cada requisicao HTTP e um processo novo, entao esse cache nunca existe de verdade.
    Auth::forgetGuards();

    $this->withHeader('Authorization', "Bearer {$token}")
        ->getJson('/api/me')
        ->assertStatus(401);
});
