import { keepPreviousData, useQuery } from '@tanstack/react-query'
import {
  getCollections,
  getFeaturedNft,
  getNetworks,
  getNfts,
  getPriceRange,
} from '../services/catalog.service'
import type { NftListParams } from '../services/catalog.types'

export const catalogQueryKeys = {
  nfts: (params: NftListParams) => ['catalog', 'nfts', params] as const,
  featured: ['catalog', 'featured'] as const,
  collections: ['catalog', 'collections'] as const,
  networks: ['catalog', 'networks'] as const,
  priceRange: ['catalog', 'price-range'] as const,
}

export function useNfts(params: NftListParams) {
  return useQuery({
    queryKey: catalogQueryKeys.nfts(params),
    queryFn: ({ signal }) => getNfts(params, signal),
    placeholderData: keepPreviousData,
  })
}

export function useFeaturedNft() {
  return useQuery({
    queryKey: catalogQueryKeys.featured,
    queryFn: ({ signal }) => getFeaturedNft(signal),
  })
}

export function useCollections() {
  return useQuery({
    queryKey: catalogQueryKeys.collections,
    queryFn: ({ signal }) => getCollections(signal),
  })
}

export function useNetworks() {
  return useQuery({
    queryKey: catalogQueryKeys.networks,
    queryFn: ({ signal }) => getNetworks(signal),
  })
}

export function usePriceRange() {
  return useQuery({
    queryKey: catalogQueryKeys.priceRange,
    queryFn: ({ signal }) => getPriceRange(signal),
  })
}
