<?php

namespace Database\Factories;

use App\Enums\TransactionType;
use App\Models\Transaction;
use App\Models\User;
use App\Models\Wallet;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Transaction>
 */
class TransactionFactory extends Factory
{
    protected $model = Transaction::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $unitPrice = $this->faker->randomFloat(2, 200000, 300000);
        $btcAmount = $this->faker->randomFloat(8, 0.0001, 0.01);

        return [
            'user_id' => User::factory(),
            'wallet_id' => Wallet::factory(),
            'type' => $this->faker->randomElement(TransactionType::cases()),
            'brl_amount' => round($btcAmount * $unitPrice, 2),
            'btc_amount' => $btcAmount,
            'btc_unit_price' => $unitPrice,
        ];
    }

    public function buy(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => TransactionType::Buy,
        ]);
    }

    public function sell(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => TransactionType::Sell,
        ]);
    }
}
