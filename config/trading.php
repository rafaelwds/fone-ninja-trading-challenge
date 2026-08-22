<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Carteira
    |--------------------------------------------------------------------------
    */

    'wallet' => [
        'initial_brl_balance' => (float) env('WALLET_INITIAL_BRL_BALANCE', 10000.00),
    ],

    /*
    |--------------------------------------------------------------------------
    | Mercado simulado de Bitcoin
    |--------------------------------------------------------------------------
    */

    'market' => [
        'min_price' => (float) env('BTC_MARKET_MIN_PRICE', 200000),
        'max_price' => (float) env('BTC_MARKET_MAX_PRICE', 300000),
        'cache_ttl' => (int) env('BTC_MARKET_CACHE_TTL', 30),
        'cache_key' => env('BTC_MARKET_CACHE_KEY', 'market:btc:brl'),
        'cache_store' => env('BTC_MARKET_CACHE_STORE', 'redis'),
    ],

];
