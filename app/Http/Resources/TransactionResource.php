<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TransactionResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'type' => $this->type->value,
            'brl_amount' => number_format((float) $this->brl_amount, 2, '.', ''),
            'btc_amount' => number_format((float) $this->btc_amount, 8, '.', ''),
            'btc_unit_price' => number_format((float) $this->btc_unit_price, 2, '.', ''),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
