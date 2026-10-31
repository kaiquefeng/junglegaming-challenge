import { createFileRoute } from '@tanstack/react-router'
import type { NftSort, NftTab } from '@/features/catalog'
import { HomePage } from '@/pages/home'

const tabs: NftTab[] = ['all', 'new', 'trending']
const sorts: NftSort[] = ['recent', 'price-asc', 'price-desc']

const asNumber = (value: unknown) => {
  const parsed = Number(value)
  return value !== undefined && value !== '' && Number.isFinite(parsed)
    ? parsed
    : undefined
}

const asString = (value: unknown) =>
  typeof value === 'string' && value !== '' ? value : undefined

export type HomeSearch = {
  tab?: NftTab
  sort?: NftSort
  page?: number
  q?: string
  collection?: string
  network?: string
  minPrice?: number
  maxPrice?: number
}

export const Route = createFileRoute('/')({
  validateSearch: (search: Record<string, unknown>): HomeSearch => ({
    tab: tabs.find((tab) => tab === search.tab),
    sort: sorts.find((sort) => sort === search.sort),
    page: asNumber(search.page) && Math.max(1, Math.trunc(Number(search.page))),
    q: asString(search.q),
    collection: asString(search.collection),
    network: asString(search.network),
    minPrice: asNumber(search.minPrice),
    maxPrice: asNumber(search.maxPrice),
  }),
  component: HomePage,
})
