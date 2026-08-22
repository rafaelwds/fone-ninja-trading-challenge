<?php

namespace App\Http\Requests\Trade;

use Illuminate\Foundation\Http\FormRequest;

class SellRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'amount_btc' => ['required', 'numeric', 'gt:0'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'amount_btc.required' => 'A quantidade de BTC e obrigatoria.',
            'amount_btc.numeric' => 'A quantidade de BTC deve ser numerica.',
            'amount_btc.gt' => 'A quantidade de BTC deve ser maior que zero.',
        ];
    }
}
