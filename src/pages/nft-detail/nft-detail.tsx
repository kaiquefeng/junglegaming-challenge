import { getRouteApi } from '@tanstack/react-router'
import { MobileNftDetail, NftDetailView } from '@/features/nft-detail'
import { useIsDesktop } from '@/hooks/use-media-query'

const route = getRouteApi('/nft/$nftId')

export function NftDetailPage() {
  const { nftId } = route.useParams()
  return useIsDesktop() ? (
    <NftDetailView nftId={nftId} />
  ) : (
    <MobileNftDetail nftId={nftId} />
  )
}
