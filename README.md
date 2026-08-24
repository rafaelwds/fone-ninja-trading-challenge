# Fone Ninja Trading Challenge

Monorepo do teste tecnico "Fone Ninja Trading Challenge": uma plataforma simulada de compra e
venda de Bitcoin, com API em Laravel e app mobile em Expo/React Native.

## Estrutura

- [`backend/`](backend) - API REST em Laravel (compra/venda simulada de Bitcoin, autenticacao via
  Sanctum, carteira, historico de transacoes, Docker, testes e Swagger).
- [`mobile/fone-ninja-trading-app/`](mobile/fone-ninja-trading-app) - app mobile em Expo/React
  Native (login, carteira, negociacao, historico e perfil).

Este README traz o passo a passo completo para rodar os dois. Cada pasta tem tambem seu proprio
README com detalhes mais profundos (endpoints, decisoes tecnicas, etc.) - linkados na secao
[Documentacao complementar](#documentacao-complementar) no fim.

## Pre-requisitos

| Ferramenta | Para que | Necessario? |
|---|---|---|
| **Docker + Docker Compose** | Rodar o backend (API + MySQL + Redis com um comando so) | Recomendado |
| **PHP 8.3+, Composer, MySQL, Redis** | Alternativa a rodar o backend sem Docker | Só se não usar Docker |
| **Node.js 20 LTS+ e npm** | Rodar o app mobile | Sim |
| **Expo Go** (app gratuito na App Store/Play Store) | Ver o app rodando no seu celular fisico | Opcional |
| **Xcode** (só macOS) | Ver o app rodando no Simulador iOS | Opcional |
| **Android Studio** (com um AVD configurado) | Ver o app rodando no Emulador Android | Opcional |

O app mobile tambem roda direto no **navegador**, sem precisar de nenhuma das 3 ultimas opcoes.

---

## Parte 1 - Backend (API Laravel)

Todos os comandos desta parte sao executados dentro da pasta `backend/`.

### 1.1. Instalacao com Docker (recomendado)

```bash
cd backend
cp .env.example .env
docker compose up -d --build
docker compose exec app php artisan migrate
```

Isso sobe 4 containers: `app` (PHP-FPM), `nginx` (porta `8000`), `mysql` (porta `3307` no host) e
`redis` (porta `6379`). O `APP_KEY` e gerado automaticamente no primeiro start - nao e preciso
editar o `.env` manualmente para rodar via Docker (as variaveis de conexao com MySQL/Redis do
proprio compose ja sao injetadas no container `app`).

A API fica disponivel em `http://localhost:8000`.

Para conferir que os 4 containers subiram certo:

```bash
docker compose ps
```

### 1.2. Instalacao sem Docker (alternativa)

Requer PHP 8.3+ (extensao `bcmath` habilitada), Composer, e um MySQL/Redis acessiveis (ou SQLite +
cache `array`, para so explorar a API sem instalar nada disso):

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```

Edite o `.env` apontando `DB_*` para o seu MySQL e `REDIS_*` para o seu Redis (ou troque
`DB_CONNECTION` para `sqlite` e `CACHE_STORE` para `array`, criando o arquivo com
`touch database/database.sqlite`).

```bash
php artisan migrate
php artisan serve
```

A API sobe em `http://localhost:8000`.

### 1.3. Testes automatizados do backend

```bash
# com Docker
docker compose exec app php artisan test

# sem Docker
php artisan test
```

46 testes (Pest), cobrindo autenticacao, carteira, mercado, compra, venda, historico e
concorrencia (o teste de concorrencia so roda de verdade com MySQL - via Docker; sem Docker,
usando SQLite, ele aparece como *skipped* e o resto da suite roda normalmente).

### 1.4. Documentacao interativa (Swagger)

Com a API no ar:

- Swagger UI: `http://localhost:8000/api/documentation`
- JSON OpenAPI 3 cru: `http://localhost:8000/docs`

Clique em **Authorize** e informe `Bearer {token}` (token retornado por `/api/register` ou
`/api/login`) para testar os endpoints autenticados direto pela UI.

### 1.5. Criando um usuario de teste

O app mobile **ainda nao tem tela de cadastro** (o link "Criar uma conta" na tela de login e
apenas visual). Para conseguir logar no app, crie um usuario direto na API, com o backend rodando:

```bash
curl -X POST http://localhost:8000/api/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Rafael Fernando","email":"rafael@example.com","password":"password","password_confirmation":"password"}'
```

Isso cria o usuario **e** a carteira dele (R$ 10.000,00 iniciais, 0 BTC). Anote o e-mail/senha
usados - voce vai usa-los pra logar no app mobile. Alternativamente, use o Swagger UI (secao 1.4)
para criar a conta pela interface, em vez do curl.

---

## Parte 2 - Mobile (Expo / React Native)

Todos os comandos desta parte sao executados dentro da pasta `mobile/fone-ninja-trading-app/`. O
**backend precisa estar rodando** (Parte 1) antes de seguir esta parte.

### 2.1. Instalacao

```bash
cd mobile/fone-ninja-trading-app
npm install
```

### 2.2. Configuracao do `.env`

```bash
cp .env.example .env
```

O `.env.example` ja vem com `EXPO_PUBLIC_API_URL=http://localhost:8000/api`, que funciona sem
alterar nada para **Web** e **Simulador iOS**. Dependendo de como voce for rodar o app, ajuste essa
variavel no `.env`:

| Como voce vai rodar | Valor de `EXPO_PUBLIC_API_URL` |
|---|---|
| Web (`npm run web`) ou Simulador iOS | `http://localhost:8000/api` (padrao, nao precisa mudar) |
| Emulador Android | `http://10.0.2.2:8000/api` (o `localhost` do emulador nao e o mesmo da maquina host) |
| Celular fisico (Expo Go) | `http://SEU_IP_NA_REDE_LOCAL:8000/api`, ex: `http://192.168.0.10:8000/api` |

Para descobrir o IP da sua maquina na rede local: `ipconfig getifaddr en0` (macOS) ou `ipconfig`
(Windows, campo "Endereco IPv4"). O celular precisa estar na **mesma rede Wi-Fi** do computador
para conseguir alcancar esse IP.

> Depois de editar o `.env`, reinicie o Metro com cache limpo (`npx expo start -c`) - variaveis
> `EXPO_PUBLIC_*` sao embutidas no bundle em tempo de build, entao um simples reload nao pega a
> mudanca.

### 2.3. Executando o app

```bash
npm start
```

Isso abre o Metro Bundler com um menu interativo no terminal. A partir dele:

- Pressione `w` para abrir no **navegador**.
- Pressione `i` para abrir no **Simulador iOS** (precisa de Xcode).
- Pressione `a` para abrir no **Emulador Android** (precisa do Android Studio com um AVD rodando).
- Escaneie o **QR code** exibido no terminal com o app **Expo Go** para rodar no seu **celular
  fisico** (ajuste o `.env` como na tabela da secao 2.2 antes disso).

Atalhos equivalentes direto por comando, sem passar pelo menu:

```bash
npm run web       # navegador
npm run ios       # simulador iOS
npm run android   # emulador Android
```

Ao abrir, faca login com o usuario criado na secao 1.5.

### 2.4. Testes automatizados do mobile

```bash
npm test              # roda a suite inteira uma vez
npm run test:watch    # modo watch, reroda so o que mudou
npm run test:coverage # gera relatorio de cobertura
```

47 testes (Jest + `@testing-library/react-native`), cobrindo formatacao, o store de autenticacao,
componentes compartilhados e as telas de Login e Negociar.

---

## Solucao de problemas

- **"Não foi possível conectar à API"** no app mobile - o `EXPO_PUBLIC_API_URL` no `.env` (secao
  2.2) provavelmente esta errado para o jeito que voce esta rodando o app, ou o backend nao esta
  no ar (`docker compose ps` dentro de `backend/` deve mostrar os 4 containers `Up`).
- **Alterei o `.env` do mobile e nada mudou** - reinicie com `npx expo start -c` (cache limpo).
- **`docker compose up` falha ou a porta 8000/3307/6379 ja esta em uso** - outro processo na sua
  maquina esta usando essa porta; pare-o ou ajuste as portas no `docker-compose.yml`.
- **Erro ao logar no app ("Credenciais inválidas")** - confira se voce realmente criou o usuario
  (secao 1.5) e esta usando o mesmo e-mail/senha.

## Documentacao complementar

- [`backend/README.md`](backend/README.md) - endpoints, regras de negocio (compra/venda, bcmath),
  cache Redis, controle de concorrencia, Docker e decisoes tecnicas em detalhe.
- [`mobile/fone-ninja-trading-app/README.md`](mobile/fone-ninja-trading-app/README.md) - telas,
  tecnologias usadas e estrutura de pastas do app em detalhe.
