<?php

namespace App\Http\Controllers;

use OpenApi\Attributes as OA;

#[OA\Info(
    version: '1.0.0',
    title: 'Fone Ninja Trading API',
    description: 'API REST para compra e venda simulada de Bitcoin. Cadastro de usuarios, autenticacao via Sanctum, carteira em BRL/BTC, preco simulado do Bitcoin e historico de transacoes.',
    contact: new OA\Contact(name: 'Fone Ninja Trading Challenge')
)]
#[OA\Server(
    url: '/',
    description: 'Servidor da API'
)]
#[OA\SecurityScheme(
    securityScheme: 'sanctum',
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'Token',
    description: 'Informe o token retornado pelo endpoint de login/cadastro. Ex: "Bearer {token}"'
)]
#[OA\Schema(
    schema: 'ErrorResponse',
    properties: [
        new OA\Property(property: 'message', type: 'string', example: 'Mensagem de erro.'),
    ],
    type: 'object'
)]
#[OA\Schema(
    schema: 'ValidationErrorResponse',
    properties: [
        new OA\Property(property: 'message', type: 'string', example: 'The given data was invalid.'),
        new OA\Property(
            property: 'errors',
            type: 'object',
            example: ['field' => ['Mensagem de validacao.']]
        ),
    ],
    type: 'object'
)]
abstract class Controller
{
    //
}
