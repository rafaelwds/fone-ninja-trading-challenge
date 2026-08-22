<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WalletResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'brl_balance' => number_format((float) $this->brl_balance, 2, '.', ''),
            'btc_balance' => number_format((float) $this->btc_balance, 8, '.', ''),
        ];
    }
}
