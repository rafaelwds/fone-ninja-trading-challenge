<?php

namespace App\Http\Requests\Trade;

use Illuminate\Foundation\Http\FormRequest;

class BuyRequest extends FormRequest
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
            'amount_brl' => ['required', 'numeric', 'gt:0'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'amount_brl.required' => 'O valor em reais e obrigatorio.',
            'amount_brl.numeric' => 'O valor em reais deve ser numerico.',
            'amount_brl.gt' => 'O valor em reais deve ser maior que zero.',
        ];
    }
}
