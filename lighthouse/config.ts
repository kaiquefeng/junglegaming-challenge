export const PORT = 4173
export const BASE_URL = `http://localhost:${PORT}`

// Páginas auditadas. Adicione `/nfts/<id>` quando o detalhe existir.
export const PAGES = [{ name: 'home', path: '/' }]

export const PROFILES = ['mobile', 'desktop'] as const
export type Profile = (typeof PROFILES)[number]

export const RUNS_PER_PAGE_PROFILE = 3

export const CATEGORIES = [
  'performance',
  'accessibility',
  'best-practices',
  'seo',
] as const
export type Category = (typeof CATEGORIES)[number]

// Metas da seção 10 do desafio (escala 0–100).
export const TARGETS: Record<Category, number> = {
  performance: 90,
  accessibility: 95,
  'best-practices': 95,
  seo: 90,
}
