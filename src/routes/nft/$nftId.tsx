import { createFileRoute } from '@tanstack/react-router'
import { NftDetailPage } from '@/pages/nft-detail'

export const Route = createFileRoute('/nft/$nftId')({
  component: NftDetailPage,
})
