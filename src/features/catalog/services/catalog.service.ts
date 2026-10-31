import { api } from '@/services/api'
import type {
  CountedOption,
  FeaturedNft,
  NftListParams,
  NftListResponse,
  PriceRange,
} from './catalog.types'

export async function getNfts(params: NftListParams, signal?: AbortSignal) {
  const { data } = await api.get<NftListResponse>('/nfts', { params, signal })
  return data
}

export async function getFeaturedNft(signal?: AbortSignal) {
  const { data } = await api.get<FeaturedNft>('/nfts/featured', { signal })
  return data
}

export async function getCollections(signal?: AbortSignal) {
  const { data } = await api.get<CountedOption[]>('/collections', { signal })
  return data
}

export async function getNetworks(signal?: AbortSignal) {
  const { data } = await api.get<CountedOption[]>('/networks', { signal })
  return data
}

export async function getPriceRange(signal?: AbortSignal) {
  const { data } = await api.get<PriceRange>('/price-range', { signal })
  return data
}
