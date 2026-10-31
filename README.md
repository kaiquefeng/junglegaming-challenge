# NFT Marketplace — Desafio Frontend

## Stack

React 19 · TypeScript · Vite · TanStack Router · TanStack Query · Axios · Socket.IO · Tailwind CSS 4 · shadcn/ui ·
MSW (+ `@mswjs/socket.io-binding`) · Playwright · Lighthouse · Biome. Gerenciador: **bun**.
Estrutura de pastas: [`architecture-core`](https://www.npmjs.com/package/architecture-core) (ver `ARCHITECTURE.md`).

## Setup

```bash
bun install
bunx playwright install chromium   # necessário para E2E e Lighthouse
bun run dev                        # http://localhost:5173, com mocks MSW
```

## Variáveis de ambiente

Copie `.env.example` para `.env` (o `.env` do repositório já vem com os valores de demonstração).

| Variável | Padrão | Uso |
| --- | --- | --- |
| `VITE_API_URL` | `/api` | Base do cliente Axios |
| `VITE_WS_URL` | _(vazio)_ | Servidor Socket.IO |
| `VITE_ENABLE_MOCKS` | `true` | Liga o MSW (também no build de demonstração) |
| `VITE_MOCK_SCENARIO` | `default` | Cenário inicial dos mocks (ver abaixo) |

## Comandos

| Comando | Ação |
| --- | --- |
| `bun run dev` | Desenvolvimento com mocks |
| `bun run build` | Typecheck + build de produção |
| `bun run preview` | Serve o build (porta 4173) |
| `bun run typecheck` | `tsc -b` |
| `bun run lint` / `bun run format` | Biome (verifica / corrige) |
| `bun run test:e2e` | Playwright (Chromium, desktop 1440 e mobile 390); relatório em `playwright-report/` |
| `bun run lighthouse` | Build + preview + 3 execuções por página/perfil (mobile e desktop), mediana, metas do desafio. Saída em `lighthouse/reports/` (`--no-fail` só relata) |

## Credenciais fictícias, cenários e reset

| Usuário | E-mail | Senha | Estado inicial |
| --- | --- | --- | --- |
| Kaique Feng | `kaique@dev.com` | `Senha@123` | Favorito no NFT 1, carteira principal MetaMask cadastrada |
| Bruno Lima | `bruno@kurio.test` | `Senha@123` | Sem carteiras (preencha em `/wallets`) |

Cupons: `KURIO10` (10%), `WELCOME5` (5%), `EXPIRED20` (expirado) — qualquer outro é inválido.
Conexão de carteira: **Coinbase Wallet + rede Solana é recusada**. Endereço terminado em `dead` gera pagamento recusado.
Senhas são guardadas só como hash (SHA-256) no estado simulado.

**Cenários** (`?scenario=<nome>` na URL; fica salvo no `localStorage`; também `VITE_MOCK_SCENARIO`):

| Cenário | Efeito |
| --- | --- |
| `default` | Sucesso, latência baixa |
| `empty` | Catálogo vazio |
| `slow` | 2,5 s de latência (skeletons) |
| `variable-latency` | Latência variável determinística (100–1500 ms) |
| `out-of-order` | Consultas filtradas respondem depois das sem filtro |
| `flaky` | Toda 2ª consulta de `/nfts` falha com 503 |
| `offline` | `/nfts` falha por queda de conexão |
| `server-error` | `/nfts` responde 500 |
| `order-timeout` | O pedido é criado mas a resposta demora 12 s (timeout do cliente → retentativa idempotente) |
| `payment-declined` | O pagamento é recusado |
| `favorites-fail` | Favoritar/desfavoritar falha (rollback) |
| `forbidden-profile` | `/profile` responde 403 |

**Reset:** abra `/?reset=1` (restaura usuários, estoque, carrinhos, pedidos e a sessão), ou `POST /api/__mocks/reset`,
ou `__kurioMocks.reset()` no console. Controles do servidor simulado no console (alteram o **servidor**, e a UI reage via REST/Socket.IO):
`__kurioMocks.updateNft('1', { price: '1.50' })`, `.updateNft('1', { editions: { '1/50': 0 } })`, `.disconnectSockets()`,
`.expireSessions()`, `.setScenario('slow')`.

Reproduzir os fluxos de falha: pagamento recusado → `/?scenario=payment-declined`, entre como Kaique, adicione um NFT, `/checkout`,
conecte a carteira e confirme. Timeout com recuperação → `/?scenario=order-timeout` (mesmo fluxo; a tela avisa da nova tentativa e o
pedido é o mesmo). Preço mudando no checkout → com o checkout aberto, rode `__kurioMocks.updateNft('1', { price: '1.50' })`.

## Deploy

**Dokploy (Nixpacks):** crie uma aplicação com o provider *Git*, build type **Nixpacks** e porta `3000`.
O `nixpacks.toml` instala com bun, roda `bun run build` e serve `dist/` com o Caddy (`Caddyfile`), com fallback de SPA
(refresh e acesso direto às rotas) e cache longo só para `/assets` e `/images`. As variáveis `VITE_*` são de build e já têm
os valores de demonstração (mocks ligados) no `nixpacks.toml`; para mudá-las, defina-as em *Environment* do Dokploy e faça novo deploy.
Teste local: `nixpacks build . --name kurio && docker run --rm -p 3000:3000 kurio`.

`vercel.json` já define o rewrite SPA (refresh e acesso direto às rotas). Importe o repositório na Vercel (preset Vite).
