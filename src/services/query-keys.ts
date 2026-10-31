import type { NftListParams } from '@/features/catalog/services/catalog.types'

export const publicKeys = {
  nftList: (params: NftListParams) => ['catalog', 'nfts', params] as const,
  nftListAll: ['catalog', 'nfts'] as const,
  featured: ['catalog', 'featured'] as const,
  nft: (id: string) => ['catalog', 'nft', id] as const,
}

export const privateKeys = {
  cart: (userId: string | undefined) =>
    ['user', userId ?? 'anonymous', 'cart'] as const,
  order: (userId: string | undefined, id: string) =>
    ['user', userId ?? 'anonymous', 'order', id] as const,
  pendingOrder: (userId: string | undefined) =>
    ['user', userId ?? 'anonymous', 'pending-order'] as const,
}
