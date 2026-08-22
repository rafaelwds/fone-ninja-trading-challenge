# Fone Ninja Trading Challenge

Monorepo do teste tecnico "Fone Ninja Trading Challenge": uma plataforma simulada de compra e
venda de Bitcoin.

## Estrutura

- [`backend/`](backend) - API REST em Laravel (compra/venda simulada de Bitcoin, autenticacao via
  Sanctum, carteira, historico de transacoes, Docker, testes e Swagger). Ver
  [`backend/README.md`](backend/README.md) para instalacao, configuracao e documentacao completa.
- `mobile/` - reservado para o aplicativo mobile (ainda nao iniciado).

Todos os comandos (Composer, Artisan, Docker Compose, testes) devem ser executados de dentro da
pasta `backend/`:

```bash
cd backend
cp .env.example .env
docker compose up -d --build
docker compose exec app php artisan migrate
docker compose exec app php artisan test
```
