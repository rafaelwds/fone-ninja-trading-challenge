<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\WalletResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class WalletController extends Controller
{
    #[OA\Get(
        path: '/api/wallet',
        summary: 'Consultar a carteira do usuario autenticado',
        tags: ['Carteira'],
        security: [['sanctum' => []]],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Saldo da carteira',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'data', properties: [
                            new OA\Property(property: 'brl_balance', type: 'string', example: '10000.00'),
                            new OA\Property(property: 'btc_balance', type: 'string', example: '0.00000000'),
                        ], type: 'object'),
                    ]
                )
            ),
            new OA\Response(response: 401, description: 'Nao autenticado', content: new OA\JsonContent(ref: '#/components/schemas/ErrorResponse')),
        ]
    )]
    public function show(Request $request): JsonResponse
    {
        return response()->json([
            'data' => new WalletResource($request->user()->wallet),
        ]);
    }
}
