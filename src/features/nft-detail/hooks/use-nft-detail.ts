import { useQuery } from '@tanstack/react-query'
import { ApiError } from '@/services/api-error'
import { publicKeys } from '@/services/query-keys'
import { getNftDetail } from '../services/nft-detail.service'

export function useNftDetail(id: string) {
  return useQuery({
    queryKey: publicKeys.nft(id),
    queryFn: ({ signal }) => getNftDetail(id, signal),

    retry: (count, error) =>
      !(error instanceof ApiError && error.status && error.status < 500) &&
      count < 2,
  })
}
