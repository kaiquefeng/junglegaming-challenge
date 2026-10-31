import type { NftListParams } from '../../services/catalog.types'

export type CatalogSidebarProps = {
  filters: NftListParams
  onChange: (patch: Partial<NftListParams>) => void
}
