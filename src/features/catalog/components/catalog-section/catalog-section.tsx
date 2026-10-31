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

  return (
    <section
      id="mercado"
      aria-label="Catálogo de NFTs"
      className="grid gap-8 lg:grid-cols-[310px_1fr]"
    >
      <CatalogSidebar filters={filters} onChange={onFiltersChange} />

      <div className="flex flex-col gap-8" aria-busy={isPlaceholderData}>
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
