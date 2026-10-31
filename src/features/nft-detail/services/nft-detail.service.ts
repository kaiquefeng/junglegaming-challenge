import { api } from '@/services/api'
import type { NftDetail } from './nft-detail.types'

export const getNftDetail = (id: string, signal?: AbortSignal) =>
  api.get<NftDetail>(`/nfts/${id}`, { signal }).then((r) => r.data)
