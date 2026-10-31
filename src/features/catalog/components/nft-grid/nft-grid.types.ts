import type { NftCardProps } from '@/components/nft-card'
import type { Nft } from '../../services/catalog.types'

export type NftGridProps = {
  items: Nft[]
  isLoading: boolean
  isError: boolean
  onRetry: () => void
  favorites?: (nft: Nft) => NftCardProps['favorite']
}
