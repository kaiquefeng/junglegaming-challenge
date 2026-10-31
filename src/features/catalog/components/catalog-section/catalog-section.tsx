import { Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Input } from '@/components/input'
import { useFavorites } from '@/features/favorites'
import { useNfts } from '../../hooks/use-catalog'
import { CatalogPagination } from '../catalog-pagination/catalog-pagination'
import { CatalogSidebar } from '../catalog-sidebar/catalog-sidebar'
import { CatalogToolbar } from '../catalog-toolbar/catalog-toolbar'
import { NftGrid } from '../nft-grid/nft-grid'
import type { CatalogSectionProps } from './catalog-section.types'

export function CatalogSection({
  filters,
  onFiltersChange,
}: CatalogSectionProps) {
  const { data, isPending, isError, isPlaceholderData, refetch } =
    useNfts(filters)
  const { isFavorite, toggle } = useFavorites()

  const [search, setSearch] = useState(filters.q ?? '')
  useEffect(() => setSearch(filters.q ?? ''), [filters.q])
  useEffect(() => {
    const next = search.trim() || undefined
    if (next === filters.q) return
    const timer = window.setTimeout(() => onFiltersChange({ q: next }), 350)
    return () => window.clearTimeout(timer)
  }, [search, filters.q, onFiltersChange])

  return (
    <section
      id="mercado"
      aria-label="Catálogo de NFTs"
      className="grid gap-8 lg:grid-cols-[310px_1fr]"
    >
      <CatalogSidebar filters={filters} onChange={onFiltersChange} />

      <div className="flex flex-col gap-8" aria-busy={isPlaceholderData}>
        <div className="relative">
          <label htmlFor="catalog-search" className="sr-only">
            Buscar NFTs
          </label>
          <Search
            aria-hidden="true"
            className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            id="catalog-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar NFTs pelo nome"
            className="h-10 pl-9"
          />
        </div>
        <CatalogToolbar
          tab={filters.tab}
          sort={filters.sort}
          onTabChange={(tab) => onFiltersChange({ tab })}
          onSortChange={(sort) => onFiltersChange({ sort })}
        />
        <div
          className={
            isPlaceholderData ? 'opacity-60 transition-opacity' : undefined
          }
        >
          <NftGrid
            items={data?.items ?? []}
            isLoading={isPending}
            isError={isError}
            onRetry={() => refetch()}
            favorites={(nft) => ({
              active: isFavorite(nft.id),
              onToggle: () => toggle(nft.id),
            })}
          />
        </div>
        <CatalogPagination
          page={data?.page ?? filters.page}
          totalPages={data?.totalPages ?? 1}
          onPageChange={(page) => onFiltersChange({ page })}
        />
      </div>
    </section>
  )
}
