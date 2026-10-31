import type { NftSort, NftTab } from '../../services/catalog.types'

export type CatalogToolbarProps = {
  tab: NftTab
  sort: NftSort
  onTabChange: (tab: NftTab) => void
  onSortChange: (sort: NftSort) => void
}
