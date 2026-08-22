<?php

namespace App\Http\Controllers\Api;

use App\Exceptions\InsufficientBalanceException;
use App\Http\Controllers\Controller;
use App\Http\Requests\Trade\BuyRequest;
use App\Http\Requests\Trade\SellRequest;
use App\Http\Resources\TransactionResource;
use App\Services\TradeService;
use Illuminate\Http\JsonResponse;
use OpenApi\Attributes as OA;

class TradeController extends Controller
{
    public function __construct(
        private readonly TradeService $trades,
    ) {}

    #[OA\Post(
        path: '/api/trade/buy',
        summary: 'Comprar Bitcoin',
        description: 'Converte um valor em reais para BTC usando o preco atual do mercado, debita o saldo em BRL e credita o saldo em BTC da carteira.',
        tags: ['Negociacao'],
        security: [['sanctum' => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['amount_brl'],
                properties: [
                    new OA\Property(property: 'amount_brl', type: 'string', example: '1000.00'),
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 201,
                description: 'Compra realizada com sucesso',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'data', properties: [
                            new OA\Property(property: 'id', type: 'integer', example: 1),
                            new OA\Property(property: 'type', type: 'string', example: 'buy'),
                            new OA\Property(property: 'brl_amount', type: 'string', example: '1000.00'),
                            new OA\Property(property: 'btc_amount', type: 'string', example: '0.00400000'),
                            new OA\Property(property: 'btc_unit_price', type: 'string', example: '250000.00'),
                            new OA\Property(property: 'created_at', type: 'string', format: 'date-time'),
                        ], type: 'object'),
                    ]
                )
            ),
            new OA\Response(response: 401, description: 'Nao autenticado', content: new OA\JsonContent(ref: '#/components/schemas/ErrorResponse')),
            new OA\Response(response: 422, description: 'Valor invalido ou saldo em reais insuficiente', content: new OA\JsonContent(ref: '#/components/schemas/ErrorResponse')),
        ]
    )]
    public function buy(BuyRequest $request): JsonResponse
    {
        try {
            $transaction = $this->trades->buy($request->user(), (string) $request->validated('amount_brl'));
        } catch (InsufficientBalanceException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }

        return response()->json([
            'data' => new TransactionResource($transaction),
        ], 201);
    }

    #[OA\Post(
        path: '/api/trade/sell',
        summary: 'Vender Bitcoin',
        description: 'Converte uma quantidade de BTC para reais usando o preco atual do mercado, debita o saldo em BTC e credita o saldo em BRL da carteira.',
        tags: ['Negociacao'],
        security: [['sanctum' => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['amount_btc'],
                properties: [
                    new OA\Property(property: 'amount_btc', type: 'string', example: '0.00100000'),
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 201,
                description: 'Venda realizada com sucesso',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'data', properties: [
                            new OA\Property(property: 'id', type: 'integer', example: 2),
                            new OA\Property(property: 'type', type: 'string', example: 'sell'),
                            new OA\Property(property: 'brl_amount', type: 'string', example: '250.00'),
                            new OA\Property(property: 'btc_amount', type: 'string', example: '0.00100000'),
                            new OA\Property(property: 'btc_unit_price', type: 'string', example: '250000.00'),
                            new OA\Property(property: 'created_at', type: 'string', format: 'date-time'),
                        ], type: 'object'),
                    ]
                )
            ),
            new OA\Response(response: 401, description: 'Nao autenticado', content: new OA\JsonContent(ref: '#/components/schemas/ErrorResponse')),
            new OA\Response(response: 422, description: 'Valor invalido ou saldo em Bitcoin insuficiente', content: new OA\JsonContent(ref: '#/components/schemas/ErrorResponse')),
        ]
    )]
    public function sell(SellRequest $request): JsonResponse
    {
        try {
            $transaction = $this->trades->sell($request->user(), (string) $request->validated('amount_btc'));
        } catch (InsufficientBalanceException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }

        return response()->json([
            'data' => new TransactionResource($transaction),
        ], 201);
    }
}
