# Fone Ninja Trading API

API REST desenvolvida em Laravel para o teste tecnico "Fone Ninja Trading Challenge": uma
plataforma simulada de compra e venda de Bitcoin. O escopo deste repositorio e **exclusivamente
o backend** (API). Nao ha frontend, aplicativo mobile ou integracao com corretoras reais - todo o
mercado de Bitcoin e simulado.

> Este repositorio e um monolito: quando a parte mobile for desenvolvida, ela vivera em um
> diretorio proprio (ex: `mobile/`) dentro do mesmo repositorio.

## 1. Apresentacao do projeto

A API permite que um usuario se cadastre, autentique-se, consulte sua carteira (saldo em reais e
em BTC), veja o preco simulado do Bitcoin, compre e venda BTC e consulte seu historico de
transacoes. Toda a logica de negocio de compra/venda fica isolada em um `TradeService`, com
controle de concorrencia via `lockForUpdate` para evitar que duas operacoes simultaneas usem o
mesmo saldo.

## 2. Tecnologias utilizadas

- PHP 8.3+ (imagem Docker usa PHP 8.4)
- Laravel 13
- Laravel Sanctum (autenticacao via Bearer token)
- MySQL 8
- Redis (cache do preco simulado do BTC)
- Pest (testes automatizados, sobre PHPUnit)
- Laravel Pint (estilo de codigo)
- Docker / Docker Compose
- darkaonline/l5-swagger (Swagger UI / OpenAPI 3)

## 3. Requisitos

**Com Docker (recomendado):** Docker e Docker Compose. Nada mais e necessario na maquina host.

**Sem Docker:** PHP 8.3+, Composer, extensao `bcmath` habilitada, MySQL 8 (ou compativel) e Redis
disponiveis localmente.

## 4. Instalacao sem Docker

```bash
composer install
cp .env.example .env
php artisan key:generate
```

Edite o `.env` apontando `DB_*` para o seu MySQL e `REDIS_*` para o seu Redis (o `.env.example` ja
vem com valores plausiveis para instancias locais). Se preferir nao instalar MySQL/Redis apenas
para explorar a API manualmente, e possivel trocar `DB_CONNECTION` para `sqlite` (crie o arquivo
com `touch database/database.sqlite`) e `CACHE_STORE` para `array` - os testes automatizados,
alias, ja rodam dessa forma por padrao (ver secao 8).

```bash
php artisan migrate
php artisan serve
```

A API sobe em `http://localhost:8000`.

## 5. Instalacao com Docker

```bash
cp .env.example .env
docker compose up -d --build
docker compose exec app php artisan migrate
docker compose exec app php artisan test
```

Isso sobe 4 containers: `app` (PHP-FPM), `nginx` (porta `8000`), `mysql` (porta `3307` no host,
`3306` internamente) e `redis` (porta `6379`). O container `app` gera o `APP_KEY` automaticamente
no primeiro start (via `docker/php/entrypoint.sh`) caso o `.env` ainda nao tenha uma, e as
variaveis de conexao com MySQL/Redis do compose sao injetadas diretamente no container `app`
(sobrescrevendo o `.env` local), entao nao ha necessidade de editar nada manualmente para subir
via Docker.

A API fica disponivel em `http://localhost:8000`.

> Rodar `docker compose exec app php artisan test` executa `migrate:fresh` como parte do teste de
> concorrencia (ver secao 14) e portanto **apaga os dados** do MySQL do compose. Isso e esperado
> em um ambiente de desenvolvimento/teste.

## 6. Configuracao do .env

Principais variaveis (ver `.env.example` para a lista completa):

| Variavel | Descricao |
|---|---|
| `DB_CONNECTION`, `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD` | Conexao com o MySQL |
| `REDIS_CLIENT`, `REDIS_HOST`, `REDIS_PORT` | Conexao com o Redis (`predis`, sem exigir extensao nativa) |
| `CACHE_STORE` | Store de cache padrao da aplicacao (`redis` em producao/Docker) |
| `WALLET_INITIAL_BRL_BALANCE` | Saldo inicial em reais criado para toda nova carteira (padrao `10000.00`) |
| `BTC_MARKET_MIN_PRICE` / `BTC_MARKET_MAX_PRICE` | Faixa do preco simulado do BTC (padrao R$ 200.000,00 - R$ 300.000,00) |
| `BTC_MARKET_CACHE_TTL` | TTL em segundos do cache do preco do BTC (padrao `30`) |
| `BTC_MARKET_CACHE_KEY` | Chave usada no Redis para o preco (padrao `market:btc:brl`) |

Nenhum arquivo `.env` real, credencial ou token esta versionado neste repositorio - apenas
`.env.example`, sem segredos.

## 7. Execucao das migrations

```bash
# sem Docker
php artisan migrate

# com Docker
docker compose exec app php artisan migrate
```

Tabelas criadas (alem das padrao do Laravel/Sanctum): `wallets` e `transactions`.

## 8. Execucao dos testes

```bash
# sem Docker (SQLite em memoria, rapido, nao precisa de MySQL/Redis)
php artisan test

# com Docker (MySQL/Redis reais do compose)
docker compose exec app php artisan test
```

A suite tem **46 testes** (Pest), cobrindo autenticacao, carteira, mercado, compra, venda,
historico e concorrencia. Detalhes de execucao na secao 14.

## 9. Acesso ao Swagger

Com a aplicacao no ar (Docker ou `php artisan serve`):

- Swagger UI: `http://localhost:8000/api/documentation`
- JSON OpenAPI 3 cru: `http://localhost:8000/docs`

Clique em **Authorize** e informe `Bearer {token}` (token retornado por `/api/register` ou
`/api/login`) para testar os endpoints autenticados diretamente pela UI.

Para regenerar a documentacao apos alterar as anotações OpenAPI nos controllers:

```bash
php artisan l5-swagger:generate
```

## 10. Lista resumida dos endpoints

| Metodo | Rota | Autenticado | Descricao |
|---|---|---|---|
| POST | `/api/register` | Nao | Cadastra usuario + cria carteira (R$ 10.000,00 / 0 BTC) |
| POST | `/api/login` | Nao | Autentica e retorna token Bearer |
| GET | `/api/me` | Sim | Dados do usuario autenticado |
| POST | `/api/logout` | Sim | Revoga o token atual |
| GET | `/api/wallet` | Sim | Saldo da carteira do usuario autenticado |
| GET | `/api/market/btc` | Sim | Preco simulado do BTC (cache Redis, 30s) |
| POST | `/api/trade/buy` | Sim | Compra BTC com reais (`amount_brl`) |
| POST | `/api/trade/sell` | Sim | Vende BTC por reais (`amount_btc`) |
| GET | `/api/transactions` | Sim | Historico paginado (`page`, `per_page`, max. 100) |

## 11. Exemplos de autenticacao

Cadastro:

```bash
curl -X POST http://localhost:8000/api/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Rafael Fernando","email":"rafael@example.com","password":"password","password_confirmation":"password"}'
```

Login:

```bash
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"rafael@example.com","password":"password"}'
```

Ambos retornam `{"data": {"user": {...}, "token": "1|..."}}`. Use o token em requisicoes
autenticadas:

```bash
curl http://localhost:8000/api/me -H "Authorization: Bearer 1|..."
```

## 12. Regra de compra e venda

Toda a logica fica em [`app/Services/TradeService.php`](app/Services/TradeService.php), fora dos
controllers:

- **Compra:** `quantidade_btc = valor_em_reais / preco_do_bitcoin`, truncado em 8 casas decimais
  (via `bcdiv`). O valor em reais e debitado da carteira e a quantidade de BTC calculada e
  creditada.
- **Venda:** `valor_em_reais = quantidade_btc * preco_do_bitcoin`, truncado em 2 casas decimais
  (via `bcmul`). O BTC e debitado e o valor em reais calculado e creditado.

Todos os calculos usam `bcmath` (nunca `float`) para evitar erros de arredondamento em valores
financeiros. O truncamento (em vez de arredondamento) e proposital: garante que o usuario nunca
recebe uma fracao a mais do que o valor efetivamente pago/vendido.

Cada operacao roda dentro de `DB::transaction()`: o preco atual e consultado, a carteira e lida
com `lockForUpdate()`, o saldo e validado **novamente** apos o lock, a carteira e atualizada e a
transacao e registrada - tudo atomicamente. Qualquer excecao durante esse fluxo desfaz (rollback)
todas as alteracoes.

## 13. Explicacao do cache Redis

O preco do BTC e gerado por [`app/Services/BitcoinMarketService.php`](app/Services/BitcoinMarketService.php),
que usa `Cache::store('redis')->remember('market:btc:brl', 30, ...)`: dentro da janela de 30
segundos (`BTC_MARKET_CACHE_TTL`), todas as chamadas retornam exatamente o mesmo preco e o mesmo
`updated_at`; apos expirar, um novo preco aleatorio (entre `BTC_MARKET_MIN_PRICE` e
`BTC_MARKET_MAX_PRICE`) e gerado e cacheado novamente.

Se o Redis estiver indisponivel, a chamada ao cache lanca uma excecao que e capturada: o servico
gera o preco na hora (sem cache) e registra um `warning` no log, em vez de derrubar a API.

## 14. Explicacao do controle de concorrencia

`TradeService::buy()` e `TradeService::sell()` leem a carteira com:

```php
Wallet::query()->where('user_id', $user->id)->lockForUpdate()->firstOrFail();
```

dentro de um `DB::transaction()`. O `lockForUpdate()` (equivalente a `SELECT ... FOR UPDATE` no
MySQL) bloqueia a linha da carteira ate o commit da transacao: se duas requisicoes de
compra/venda do mesmo usuario chegarem ao mesmo tempo, a segunda so consegue ler o saldo **depois**
que a primeira ja tiver commitado sua alteracao - eliminando a possibilidade de as duas lerem o
mesmo saldo original e ambas serem aprovadas (double-spend).

**Teste automatizado real:** [`tests/Concurrency/ConcurrencyTest.php`](tests/Concurrency/ConcurrencyTest.php)
dispara duas compras simultaneas, em **dois processos PHP inteiramente separados** (cada um com
sua propria conexao MySQL, via `php artisan trade:test-buy`, um comando de apoio criado so para
esse teste), tentando gastar o saldo total da mesma carteira. O teste garante que exatamente uma
das duas seja aceita e a outra falhe com saldo insuficiente, e que o saldo final da carteira nunca
fique negativo.

Esse teste **so roda em MySQL** (e pulado automaticamente em qualquer outro driver, com
`markTestSkipped`), por dois motivos:

1. O SQLite ignora `lockForUpdate()` por completo - sua gramatica (`SQLiteGrammar::compileLock`)
   compila a clausula de lock como string vazia, entao nao ha nada real para testar.
2. O restante da suite usa `RefreshDatabase`, que envolve cada teste em uma unica transacao de
   banco; processos filhos com conexoes proprias nao enxergariam dados criados dentro dessa
   transacao ainda nao commitada. Por isso esse teste especifico (pasta `tests/Concurrency`, fora
   de `tests/Feature`/`tests/Unit`) tem seu proprio `beforeEach` sem `RefreshDatabase`, chamando
   `migrate:fresh` manualmente.

Rodando `docker compose exec app php artisan test` (MySQL real do compose), esse teste executa de
verdade e passa. Rodando `php artisan test` localmente sem Docker (SQLite), ele aparece como
*skipped* - o restante dos 45 testes continua rodando normalmente e de forma independente.

Ha tambem um teste de nivel unitario ([`tests/Unit/Services/TradeServiceTest.php`](tests/Unit/Services/TradeServiceTest.php))
que confirma, via `DB::listen()`, que a query da carteira realmente inclui `FOR UPDATE` quando o
driver e MySQL.

## 15. Decisoes tecnicas

- **Sem Repository/CQRS/Clean Architecture:** o escopo nao justifica essas camadas extras; a regra
  de negocio fica isolada em `TradeService`/`BitcoinMarketService`, e os models usam Eloquent
  diretamente.
- **`bcmath` em vez de `float`:** todos os calculos de compra/venda usam funcoes `bc*` para evitar
  imprecisao de ponto flutuante em valores financeiros. Colunas `decimal(15,2)` (BRL) e
  `decimal(20,8)` (BTC).
- **Truncamento em vez de arredondamento:** tanto o calculo de BTC na compra quanto o de BRL na
  venda truncam (nao arredondam) o resultado, evitando creditar ao usuario uma fracao maior do que
  o valor efetivamente negociado.
- **Predis em vez da extensao `phpredis`:** evita depender de uma extensao PHP compilada nativa,
  simplificando o `Dockerfile` e a instalacao local.
- **`.env` montado por bind mount no container `app`:** simplifica o fluxo de setup (o
  `entrypoint.sh` cria o `.env` e gera a `APP_KEY` automaticamente no primeiro start), enquanto as
  variaveis de conexao com MySQL/Redis do proprio compose sao explicitamente sobrescritas via
  `environment:` no `docker-compose.yml`, garantindo que o container sempre fale com os servicos
  corretos independentemente do que estiver no `.env` local.
- **Mensagens de erro em portugues:** as respostas de validacao e de saldo insuficiente usam
  mensagens claras em portugues, conforme pedido no enunciado.

## 16. Possiveis melhorias futuras

- Rate limiting dedicado para os endpoints de compra/venda (alem do throttle padrao da API).
- Historico de precos do BTC (serie temporal), em vez de apenas o preco atual.
- Webhooks/eventos de dominio (`TransactionCreated`) para integracoes futuras (ex: notificacoes).
- Suporte a mais de uma moeda simulada (hoje o desafio restringe a apenas BTC/BRL, de proposito).
- Testes de carga/performance para o endpoint de compra/venda sob concorrencia mais alta (o teste
  atual valida corretude com 2 requisicoes simultaneas, nao volume).

---

## Anexos

- Collection do Postman: [`docs/postman_collection.json`](docs/postman_collection.json)
