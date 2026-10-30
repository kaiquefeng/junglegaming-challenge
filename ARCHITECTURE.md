# Arquitetura

Organização segundo o pacote [`architecture-core`](https://www.npmjs.com/package/architecture-core) (React).

## Camadas (`src/`)

| Pasta | Responsabilidade |
| --- | --- |
| `pages/<nome>/` | Uma pasta por página: `nome.tsx`, `nome.types.ts`, `index.ts` (barrel). Hoje: `home` |
| `routes/` | Rotas file-based do TanStack Router; apenas ligam URL → página. `routeTree.gen.ts` é gerado e versionado |
| `features/<nome>/` | Código usado só pela feature: `components`, `hooks`, `adapters`, `contexts`, `services`, `layouts`. O `index.ts` exporta somente a API pública |
| `components/<nome>/` | Componentes puros, sem integração (inclui os do shadcn/ui, ex.: `button`) |
| `layouts/` | Composição e integração com back-end (ex.: `app-shell`) |
| `services/` | Infra compartilhada: `api.ts` (Axios), `query-client.ts`, `socket.ts` (Socket.IO, `autoConnect: false`) |
| `enums/` | Constantes compartilhadas (`http-status-code.ts`) |

Features criadas como esqueleto (vazias): `authentication`, `catalog`, `nft-detail`, `favorites`, `cart`, `checkout`,
`orders`, `profile`, `wallets`, `realtime`. A feature `health` é o exemplo funcional (service → hook → página).

Mocks (`mocks/`), E2E (`e2e/`) e auditoria (`lighthouse/`) ficam fora de `src/`.

## Desvios e decisões
- `src/lib/utils.ts` (`cn`) existe por convenção do shadcn/ui; `components.json` aponta o alias `ui` para `@/components`.
- Enum de status HTTP implementado como objeto `as const` (TS 7 + `erasableSyntaxOnly`).
- Mocks no nível de rede: `mocks/browser.ts` registra os handlers REST (`mocks/handlers`) e o handler WebSocket (`mocks/socket`, `@mswjs/socket.io-binding`). **O handler de Socket.IO é um stub ainda não exercitado** (nenhum evento implementado).

## A documentar quando implementado

Contratos REST e eventos · política de sessão · estado do carrinho · estratégia de cache/retries · reconciliação REST × Socket.IO · limitações do transporte Socket.IO no MSW · decisões de UX e desvios do Figma · análise dos resultados do Lighthouse.

## Lighthouse (Hello World)

Mediana de 3 execuções, build otimizado com mocks (`lighthouse/reports/summary.md`): Performance 100, Accessibility 100,
Best Practices 100, SEO 91 (mobile e desktop); LCP 755 ms mobile / 203 ms desktop, CLS 0, TBT 0.
