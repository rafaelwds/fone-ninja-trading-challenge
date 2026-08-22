<?php

namespace App\Services;

use App\Enums\TransactionType;
use App\Exceptions\InsufficientBalanceException;
use App\Models\Transaction;
use App\Models\User;
use App\Models\Wallet;
use Illuminate\Support\Facades\DB;

class TradeService
{
    public function __construct(
        private readonly BitcoinMarketService $market,
    ) {}

    /**
     * Compra BTC com reais da carteira do usuario.
     */
    public function buy(User $user, string $amountBrl): Transaction
    {
        return DB::transaction(function () use ($user, $amountBrl) {
            $price = $this->currentPrice();

            // lockForUpdate: bloqueia a linha da carteira ate o fim da transacao, impedindo que
            // duas compras/vendas simultaneas leiam o mesmo saldo antes de uma delas ser commitada.
            $wallet = Wallet::query()->where('user_id', $user->id)->lockForUpdate()->firstOrFail();

            if (bccomp($wallet->brl_balance, $amountBrl, 2) < 0) {
                throw new InsufficientBalanceException('Saldo em reais insuficiente para realizar a compra.');
            }

            $btcAmount = bcdiv($amountBrl, $price, 8);

            $wallet->brl_balance = bcsub($wallet->brl_balance, $amountBrl, 2);
            $wallet->btc_balance = bcadd($wallet->btc_balance, $btcAmount, 8);
            $wallet->save();

            return Transaction::create([
                'user_id' => $user->id,
                'wallet_id' => $wallet->id,
                'type' => TransactionType::Buy,
                'brl_amount' => $amountBrl,
                'btc_amount' => $btcAmount,
                'btc_unit_price' => $price,
            ]);
        });
    }

    /**
     * Vende BTC da carteira do usuario por reais.
     */
    public function sell(User $user, string $amountBtc): Transaction
    {
        return DB::transaction(function () use ($user, $amountBtc) {
            $price = $this->currentPrice();

            // lockForUpdate: mesma justificativa do metodo buy(), agora protegendo o saldo em BTC.
            $wallet = Wallet::query()->where('user_id', $user->id)->lockForUpdate()->firstOrFail();

            if (bccomp($wallet->btc_balance, $amountBtc, 8) < 0) {
                throw new InsufficientBalanceException('Saldo em Bitcoin insuficiente para realizar a venda.');
            }

            $brlAmount = bcmul($amountBtc, $price, 2);

            $wallet->btc_balance = bcsub($wallet->btc_balance, $amountBtc, 8);
            $wallet->brl_balance = bcadd($wallet->brl_balance, $brlAmount, 2);
            $wallet->save();

            return Transaction::create([
                'user_id' => $user->id,
                'wallet_id' => $wallet->id,
                'type' => TransactionType::Sell,
                'brl_amount' => $brlAmount,
                'btc_amount' => $amountBtc,
                'btc_unit_price' => $price,
            ]);
        });
    }

    private function currentPrice(): string
    {
        return $this->market->getPrice()['price'];
    }
}
