<?php

use App\Models\User;

it('retorna os dados do usuario autenticado', function () {
    $user = User::factory()->create(['name' => 'Rafael Fernando']);

    $response = $this->actingAs($user)->getJson('/api/me');

    $response->assertOk()
        ->assertJsonPath('data.id', $user->id)
        ->assertJsonPath('data.name', 'Rafael Fernando')
        ->assertJsonPath('data.email', $user->email);
});

it('bloqueia o acesso sem autenticacao', function () {
    $response = $this->getJson('/api/me');

    $response->assertStatus(401);
});
