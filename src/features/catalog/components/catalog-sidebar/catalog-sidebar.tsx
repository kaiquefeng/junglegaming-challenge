import { Card } from '@/components/card'
import {
  useCollections,
  useNetworks,
  usePriceRange,
} from '../../hooks/use-catalog'
import { CountedFilterList } from '../counted-filter-list/counted-filter-list'
import { FeaturedNftCard } from '../featured-nft-card/featured-nft-card'
import { PriceFilter } from '../price-filter/price-filter'
import type { CatalogSidebarProps } from './catalog-sidebar.types'

const headingClass = 'px-3 text-base font-bold'

export function CatalogSidebar({ filters, onChange }: CatalogSidebarProps) {
  const collections = useCollections()
  const networks = useNetworks()
  const priceRange = usePriceRange()

  const priceValue =
    filters.minPrice !== undefined && filters.maxPrice !== undefined
      ? ([filters.minPrice, filters.maxPrice] as [number, number])
      : undefined

  return (
    <aside aria-label="Filtros do catálogo" className="flex flex-col gap-6">
      <Card className="gap-6 rounded-none border-0 p-5 shadow-none">
        <section className="flex flex-col gap-2">
          <h2 className={headingClass}>Coleções</h2>
          <CountedFilterList
            label="Coleções"
            options={collections.data ?? []}
            isLoading={collections.isPending}
            selected={filters.collection}
            onSelect={(collection) => onChange({ collection })}
          />
        </section>

        <section className="flex flex-col gap-3">
          <h2 className={headingClass}>Faixa de preço</h2>
          {priceRange.data ? (
            <PriceFilter
              key={`${filters.minPrice}-${filters.maxPrice}`}
              range={priceRange.data}
              value={priceValue}
              onApply={([minPrice, maxPrice]) =>
                onChange({ minPrice, maxPrice })
              }
            />
          ) : (
            <div
              className="skeleton-shimmer h-24 rounded bg-accent"
              aria-busy="true"
            />
          )}
        </section>

        <section className="flex flex-col gap-2">
          <h2 className={headingClass}>Rede</h2>
          <CountedFilterList
            label="Rede"
            options={networks.data ?? []}
            isLoading={networks.isPending}
            selected={filters.network}
            onSelect={(network) => onChange({ network })}
          />
        </section>
      </Card>

      <FeaturedNftCard />
    </aside>
  )
}
