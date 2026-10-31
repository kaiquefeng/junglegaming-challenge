import { MobileNftDetail, NftDetailView } from '@/features/nft-detail'
import { useIsDesktop } from '@/hooks/use-media-query'

export function NftDetailPage() {
  return useIsDesktop() ? <NftDetailView /> : <MobileNftDetail />
}
