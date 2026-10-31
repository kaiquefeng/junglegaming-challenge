export const PORT = 4173
export const BASE_URL = `http://localhost:${PORT}`

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

export const TARGETS: Record<Category, number> = {
  performance: 90,
  accessibility: 95,
  'best-practices': 95,
  seo: 90,
}
