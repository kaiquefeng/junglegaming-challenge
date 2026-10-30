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
| `VITE_WS_URL` | `ws://localhost:5173` | Servidor Socket.IO |
| `VITE_ENABLE_MOCKS` | `true` | Liga o MSW (também no build de demonstração) |
| `VITE_MOCK_SCENARIO` | `default` | Cenário inicial dos mocks (ainda sem cenários além do padrão) |

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

Ainda não existem (sem autenticação nem cenários nesta etapa). Serão documentados aqui junto com os fixtures e o reset.

## Deploy

`vercel.json` já define o rewrite SPA (refresh e acesso direto às rotas). Importe o repositório na Vercel (preset Vite).
