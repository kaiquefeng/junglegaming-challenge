import type { NftListParams } from '../../services/catalog.types'

export type CatalogSectionProps = {
  filters: NftListParams
  onFiltersChange: (patch: Partial<NftListParams>) => void
}
