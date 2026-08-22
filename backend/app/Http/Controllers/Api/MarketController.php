<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\BitcoinMarketService;
use Illuminate\Http\JsonResponse;
use OpenApi\Attributes as OA;

class MarketController extends Controller
{
    public function __construct(
        private readonly BitcoinMarketService $market,
    ) {}

    #[OA\Get(
        path: '/api/market/btc',
        summary: 'Consultar o preco simulado do Bitcoin',
        description: 'O preco e simulado, sempre entre R$ 200.000,00 e R$ 300.000,00, e permanece igual por 30 segundos (cache Redis).',
        tags: ['Mercado'],
        security: [['sanctum' => []]],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Preco atual do BTC',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'data', properties: [
                            new OA\Property(property: 'symbol', type: 'string', example: 'BTC'),
                            new OA\Property(property: 'currency', type: 'string', example: 'BRL'),
                            new OA\Property(property: 'price', type: 'string', example: '250000.00'),
                            new OA\Property(property: 'updated_at', type: 'string', format: 'date-time'),
                        ], type: 'object'),
                    ]
                )
            ),
            new OA\Response(response: 401, description: 'Nao autenticado', content: new OA\JsonContent(ref: '#/components/schemas/ErrorResponse')),
        ]
    )]
    public function show(): JsonResponse
    {
        return response()->json([
            'data' => $this->market->getPrice(),
        ]);
    }
}
