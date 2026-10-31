import type { Nft } from '@/features/catalog/services/catalog.types'

export type EditionId = '1/1' | '1/10' | '1/50' | 'ABERTA'

export type Edition = {
  id: EditionId

  available: number

  maxPerOrder: number
}

export type NftDetail = Nft & {
  tokenId: string
  collectionName: string
  attributes: string
  summary: string
  description: string[]
  network: string
  networkNote: string
  contract: string
  royalties: string
  address: string
  rating: number
  reviews: number
  images: { src: string; alt: string }[]
  editions: Edition[]
}
