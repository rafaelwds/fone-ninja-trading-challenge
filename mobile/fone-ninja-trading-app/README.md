# Fone Ninja Trading App

Aplicativo mobile (Expo / React Native) do teste tecnico "Fone Ninja Trading Challenge": uma
plataforma simulada de compra e venda de Bitcoin. Esta pasta e **exclusivamente o app mobile** -
ele consome a API REST que vive em [`backend/`](../../backend), na raiz do repositorio.

> **Este app precisa do backend rodando para funcionar.** Antes de seguir os passos abaixo, suba
> a API seguindo o [`backend/README.md`](../../backend/README.md) (o jeito mais rapido e via
> Docker: `cd backend && docker compose up -d --build && docker compose exec app php artisan migrate`).

## 1. Telas e funcionalidades

- **Login** - autenticacao via e-mail/senha (Sanctum).
- **Início (carteira)** - saldo em reais e em BTC, patrimonio estimado, preco atual do BTC e as
  ultimas movimentacoes; puxar a tela para baixo atualiza os dados (pull-to-refresh).
- **Negociar** - compra e venda simulada de BTC, com estimativa em tempo real do valor
  recebido/gasto antes de confirmar.
- **Histórico** - lista completa de transacoes, com total comprado/vendido.
- **Perfil** - dados do usuario logado, escolha de tema (claro/escuro) e logout.

## 2. Tecnologias utilizadas

- Expo SDK 57 / React Native 0.86 / React 19
- Expo Router (navegacao por arquivos, com `Stack.Protected` para autenticacao)
- TanStack Query (estado de rede: cache, loading, mutations)
- Zustand com persistencia em `expo-secure-store` (sessao do usuario e preferencia de tema)
- styled-components (tema com paleta clara/escura, tokens de spacing/radius/etc.)
- Jest + `@testing-library/react-native` (47 testes automatizados)

## 3. Pre-requisitos

- **Node.js 20 LTS ou superior** e npm (vem junto com o Node).
- O **backend rodando** (ver aviso no topo deste README).
- Para efetivamente *ver* o app rodando, escolha uma das opcoes:
  - **Navegador** - nao precisa instalar nada alem do Node (`npm run web`).
  - **Celular fisico** - instale o app [Expo Go](https://expo.dev/go) (iOS ou Android) e garanta
    que o celular esteja **na mesma rede Wi-Fi** do computador.
  - **Simulador iOS** - precisa de um Mac com Xcode instalado.
  - **Emulador Android** - precisa do Android Studio instalado, com um emulador (AVD) configurado.

Nao e necessario ter o Expo CLI instalado globalmente; os comandos abaixo usam `npx`/os scripts do
`package.json`, que baixam a versao certa automaticamente.

## 4. Instalacao

```bash
cd mobile/fone-ninja-trading-app
npm install
```

## 5. Configuracao do `.env`

```bash
cp .env.example .env
```

O `.env.example` ja vem com a variavel `EXPO_PUBLIC_API_URL` apontando para
`http://localhost:8000/api` (funciona direto para **Web** e **Simulador iOS**, que enxergam a
maquina host normalmente). Dependendo de como voce for rodar o app, ajuste essa variavel no
`.env`:

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

## 6. Executando o app

```bash
npm start
```

Isso abre o Metro Bundler com um menu interativo no terminal. A partir dele:

- Pressione `w` para abrir no **navegador**.
- Pressione `i` para abrir no **Simulador iOS** (precisa de Xcode; abre automaticamente se ja
  houver um simulador instalado).
- Pressione `a` para abrir no **Emulador Android** (precisa do Android Studio com um AVD já criado
  e rodando).
- Escaneie o **QR code** exibido no terminal com o app **Expo Go** para rodar no seu **celular
  fisico** (lembre-se de ajustar o `.env` como na tabela acima antes disso).

Atalhos equivalentes direto por comando, sem passar pelo menu:

```bash
npm run web       # navegador
npm run ios       # simulador iOS
npm run android   # emulador Android
```

## 7. Criando uma conta para testar

O app ainda **nao tem uma tela de cadastro** (o link "Criar uma conta" na tela de login e apenas
visual, ainda nao esta ligado a nenhuma rota). Para conseguir logar, crie um usuario direto na API
antes de abrir o app - com o backend rodando em `http://localhost:8000`:

```bash
curl -X POST http://localhost:8000/api/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Rafael Fernando","email":"rafael@example.com","password":"password","password_confirmation":"password"}'
```

Isso cria o usuario **e** a carteira dele (R$ 10.000,00 iniciais, 0 BTC). Depois disso, use esse
mesmo e-mail/senha para logar no app. Alternativamente, use o Swagger UI do backend
(`http://localhost:8000/api/documentation`) para criar a conta pela interface.

## 8. Testes automatizados

```bash
npm test              # roda a suite inteira uma vez
npm run test:watch    # modo watch, reroda so o que mudou
npm run test:coverage # gera relatorio de cobertura (coverage/lcov-report/index.html)
```

47 testes (Jest + `@testing-library/react-native`), cobrindo funcoes de formatacao, o store de
autenticacao, componentes compartilhados (Button, TransactionItem) e as telas de Login e Negociar
(mockando os hooks de rede).

## 9. Qualidade de codigo

```bash
npx tsc --noEmit        # checagem de tipos
npx expo lint           # ESLint
npx prettier --check .  # formatacao
```

## 10. Estrutura do projeto

| Pasta | Responsabilidade |
|---|---|
| `src/app` | Rotas (Expo Router) - arquivos finos que so renderizam uma screen |
| `src/screens` | A UI de cada tela (Login, Home, Negotiate, History, Profile) |
| `src/components` | Componentes reutilizaveis (Button, Header, TransactionItem, TabBarItem) |
| `src/services` | Funcoes que chamam a API (fetch), tipadas |
| `src/hooks` | Hooks do TanStack Query em cima dos services |
| `src/store` | Zustand: sessao do usuario e preferencia de tema |
| `src/theme` | Design tokens: cores (clara/escura), spacing, radius, tipografia |
| `src/utils` | Formatacao (moeda, BTC, datas) e mapeadores de dados para UI |

## 11. Solucao de problemas

- **"Não foi possível conectar à API"** - o `EXPO_PUBLIC_API_URL` no `.env` provavelmente esta
  errado para o jeito que voce esta rodando o app (ver tabela na secao 5), ou o backend nao esta
  no ar (`docker compose ps` dentro de `backend/` deve mostrar os 4 containers `Up`).
- **Alterei o `.env` e nada mudou** - reinicie o Metro com `npx expo start -c` (cache limpo).
- **Erro de tipos do Jest ao rodar `tsc`** - rode `npm install` de novo; o `tsconfig.json` ja
  declara `"types": ["jest", "node"]`.
