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

## Home (layout `figma/home.svg`)
- Todos os dados da home vêm de handlers MSW (`mocks/handlers/catalog.ts`, `home-content.ts`; fixtures em `mocks/fixtures/`) via Axios + TanStack Query. Endpoints: `/api/site-header`, `/api/home/hero`, `/api/nfts` (tab, sort, page, collection, network, minPrice, maxPrice), `/api/nfts/featured`, `/api/collections`, `/api/networks`, `/api/price-range`, `/api/promos`, `/api/articles`, `/api/footer`, `POST /api/newsletter`. Latência simulada de 400 ms para exibir skeletons com shimmer.
- Features: `catalog` (sidebar, toolbar, grid, paginação) e `home-content` (header, hero, promos, diário, footer, newsletter). Filtros/aba/ordenação/página ficam na URL (`validateSearch` em `routes/index.tsx`), o que permite restaurar pelo histórico.
- Primitivos shadcn/ui em `src/components/<nome>/` (tabs, select, slider, badge, card, input, separator, pagination, skeleton, navigation-menu, avatar, aspect-ratio, sheet). A CLI grava em `@/components/*.tsx` neste setup; os arquivos foram movidos para o padrão de pasta do projeto e o import `cn` ajustado para `@/lib/utils`.
- Tema escuro único com a paleta extraída do SVG e fonte Roboto Mono (`@fontsource-variable/roboto-mono`, servida localmente).
- Desvios do Figma: as 4 imagens embutidas no SVG foram extraídas para `public/images/nfts/*.webp` (720 px) e reutilizadas por vários NFTs/artigos; o card vazio do grid (Golden Beat duplicado, sem texto) foi preenchido com dados completos; ícones de redes sociais são SVGs próprios (lucide v1 não traz marcas); indicadores do hero são decorativos (`aria-hidden`), pois há um único slide; no mobile o menu vira `Sheet` e a sidebar de filtros passa a ficar acima do grid.
- E2E: `E2E_PORT` permite rodar o Playwright em outra porta (útil se já houver um dev server na 5173).

## Fluxo de telas desktop (somente layout)
- Rotas: `/nft/$nftId` (detalhes), `/cart`, `/checkout`, `/order-confirmation` (modal sobre o checkout), `/login` e `/signup` (modal), `/profile` e `/wallets` (compartilham `AccountSidebar`). Header e rodapé vêm do `AppShell`.
- Dados ainda estáticos dentro de cada `*-view` (sem MSW/service): serão ligados na etapa de comportamento. Os botões já navegam: header → `/cart` e `/login`; carrinho → `/checkout`; checkout → `/order-confirmation`.
- Novos primitivos: `components/modal` (Radix Dialog) e `components/form-field` (rótulo + `*` + input/select nativo).
- Desvios do Figma: login/cadastro e confirmação não renderizam a Home por trás do scrim (só header/rodapé do shell); marca do Google em SVG próprio; imagens do Figma substituídas pelas 4 já existentes em `public/images/nfts/`; só o ícone "thank you" foi baixado (`public/images/icons/thank-you.svg`).
- Mobile (<768 px, breakpoint `md`): o Figma tem telas próprias (Início, Detalhes, Carrinho, Pagamento, Login, Cadastro). Cada página escolhe a view com `useIsDesktop()` (`src/hooks/use-media-query.ts`) em vez de esconder por CSS. No mobile o `AppShell` remove header e rodapé e mostra `MobileTabBar`; as views `mobile-*` vivem em cada feature. Profile, Carteiras e a confirmação de pedido não têm tela mobile no Figma (reaproveitam o desktop, com o checkout mobile por trás da confirmação).
- Desvio: o responsivo anterior da Home (menu em `Sheet`, sidebar de filtros acima do grid) foi substituído pelo layout mobile do Figma; a Home mobile usa dados estáticos (sem MSW) e os testes E2E da Home desktop são pulados no projeto `mobile`, que ganhou um teste próprio.

## Camada funcional (mocks MSW, sessão, carrinho, pedidos, tempo real)

### Servidor simulado (`mocks/`)
- Estado único em `mocks/db/db.ts`, persistido em `localStorage` (`kurio.mocks.db.v2`); `?reset=1`/`resetDb()` restaura o cenário conhecido.
  Catálogo, favoritos, carrinho, perfil, carteiras e pedidos leem/escrevem o mesmo estado, que também alimenta os eventos Socket.IO.
- `mocks/lib/domain.ts` concentra as regras (cotação, cupom, liquidação do pedido). Componentes/hooks/Axios não contêm respostas falsas.
- Cenários em `mocks/scenarios` (tabela no README): latência, falhas HTTP/rede, atraso na resposta do pedido, recusa de pagamento.

### Contratos REST (`/api`)
| Recurso | Endpoints |
| --- | --- |
| Sessão | `POST /auth/register`, `POST /auth/login`, `GET /auth/me`, `POST /auth/logout` (Bearer; `X-Guest-Id` migra o carrinho do visitante) |
| NFTs | `GET /nfts?tab&sort&page&q&collection&network&minPrice&maxPrice`, `GET /nfts/:id` |
| Favoritos | `GET /favorites`, `PUT /favorites/:nftId`, `DELETE /favorites/:nftId` |
| Carrinho/cotação | `GET /cart`, `POST|PATCH|DELETE /cart/items`, `POST|DELETE /cart/coupon`, `POST /cart/accept-prices` — toda resposta traz `quote {subtotal, discount, networkFee, total, token}` e `issues` |
| Pedidos | `POST /orders` (`Idempotency-Key`, 202 pendente), `GET /orders/:id`, `GET /orders/latest-pending` |
| Perfil | `GET|PATCH /profile`, `POST|DELETE /profile/avatar`, `POST /profile/password` |
| Carteiras | `GET /wallets`, `PUT /wallets/:primary|secondary`, `POST /wallets/connect`, `DELETE /wallets/connect/:id` |

Erros: `{ code, message, fields?, details? }` com `validation` (422), `unauthorized`/`session_expired` (401), `forbidden` (403), `not_found` (404),
`conflict`/`unavailable`/`quote_changed`/`idempotency_conflict` (409), `coupon_invalid` (422), `coupon_expired` (410), `transient` (503).
Valores em ETH trafegam como **strings decimais** e são calculados com `BigInt` (18 casas) em `src/lib/eth.ts`; quantidades são inteiras.

### Sessão
Token opaco em `localStorage` (`kurio.token`; sem senha em claro), validade 30 min no servidor. Sessão recuperável via `GET /auth/me`. Rotas privadas usam
`beforeLoad: requireAuth` (redireciona a `/login?redirect=…`, aceitando só caminhos internos). 401 com token → o interceptor Axios dispara a expiração:
cache e token são limpos, o usuário vai ao login (`expired=true`) e retorna ao destino original (inclusive o checkout). Logout e troca de usuário chamam
`queryClient.clear()` e reidentificam o socket; dados privados vivem sob `['user', userId, …]`.

### Carrinho
Vive no servidor (usuário ou visitante por `X-Guest-Id`) e sobrevive a refresh; ao autenticar, os itens do visitante são somados ao carrinho do usuário.
O cliente nunca recalcula valores: apresenta a `quote` da API. Disponibilidade e limite por edição são validados no servidor; quantidade usa atualização otimista com rollback.

### Pedido, idempotência e revalidação
O checkout envia o `quoteToken` visto pelo usuário; se preço, disponibilidade, cupom ou taxa mudaram, o servidor responde `409 quote_changed` e o cliente exige
"Aceitar novos valores" antes de reenviar (a mudança também é detectada em tempo real). A chave `Idempotency-Key` é estável por conteúdo
(`src/features/orders/idempotency.ts`): clique repetido e retentativa após timeout recuperam o mesmo pedido; mesma chave com corpo diferente → `409`.
O pedido nasce `pending` e é liquidado por `settleAt` (também após refresh); só `confirmed` exibe o recibo (snapshot), `declined` preserva o carrinho,
e na confirmação o servidor baixa só o que foi comprado. Pedido de outro usuário responde 404.

### Cache e retries (TanStack Query)
`staleTime` 30 s (público) / 5 s (carrinho) / 0 (pedido pendente, com `refetchInterval` de 3 s como rede de segurança). Retry só para falhas transitórias
(rede/5xx), até 2 vezes com backoff exponencial; 4xx nunca é repetido; mutations não repetem sozinhas (o checkout repete explicitamente com a mesma chave).
Consultas usam `AbortSignal` (respostas obsoletas são descartadas) e chaves incluem os parâmetros; listas usam `keepPreviousData`.

### Tempo real e reconciliação
`socket.io-client` real conecta a um servidor simulado pelo MSW (`@mswjs/socket.io-binding`). Eventos `nft.updated` e `order.updated` carregam `id`, recurso,
`version` e `at`. O cliente (`useRealtime`) descarta duplicatas (`id`) e eventos antigos (`version` ≤ conhecida), atualiza detalhe/listas via cache e invalida o
carrinho (aviso em região `aria-live`). `order.updated` invalida a leitura do pedido. Após reconexão, `queryClient.invalidateQueries()` reconcilia tudo com a API;
a identidade da sessão é reenviada a cada (re)conexão e eventos privados só vão ao dono.
Limitações do transporte simulado: só `websocket` (sem long-polling), sem rooms/namespaces/broadcast nativos, servidor vive na aba. Dois detalhes do ambiente:
(1) o `engine.io-client` captura `globalThis.WebSocket` no import, por isso o cliente é carregado sob demanda com um transporte que resolve o `WebSocket` ao conectar
(`src/services/socket.ts`); (2) nesta versão do MSW `ws.link()` só casa com o curinga `*`, então o handler filtra por `/socket.io`.

### Decisões de UX e desvios do Figma (funcional)
- Pagamento: o Figma não tem a etapa de conexão; foi adicionado um bloco "Conectar carteira" (conectar/recusar/desconectar) acima de "Confirmar compra".
  Erros de validação ficam sob cada campo; o botão só habilita depois do pré-preenchimento e com a cotação aceita.
- Login social e "Esqueceu a senha?" estão fora do escopo: o clique só informa isso (não aparenta sucesso).
- Edição padrão no detalhe é a `1/50` (destaque do Figma) quando há estoque. Perfil/Carteiras ganharam estados de carregamento, erro e permissão.
- Pendente: regressão visual (baselines) e auditoria Lighthouse da versão funcional.

## Lighthouse (Hello World)

Mediana de 3 execuções, build otimizado com mocks (`lighthouse/reports/summary.md`): Performance 100, Accessibility 100,
Best Practices 100, SEO 91 (mobile e desktop); LCP 755 ms mobile / 203 ms desktop, CLS 0, TBT 0.
