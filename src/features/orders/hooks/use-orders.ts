import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useSession } from '@/features/authentication'
import { ApiError } from '@/services/api-error'
import { privateKeys } from '@/services/query-keys'
import {
  createOrder,
  getLatestPendingOrder,
  getOrder,
} from '../services/orders.service'
import type { CreateOrderBody, Order } from '../services/orders.types'

export function useOrder(id: string) {
  const { user } = useSession()
  return useQuery({
    queryKey: privateKeys.order(user?.id, id),
    queryFn: ({ signal }) => getOrder(id, signal),
    enabled: Boolean(user),
    refetchInterval: (query) =>
      query.state.data?.status === 'pending' ? 3000 : false,
    retry: (count, error) =>
      !(error instanceof ApiError && error.status && error.status < 500) &&
      count < 2,
  })
}

export function usePendingOrder() {
  const { user } = useSession()
  return useQuery({
    queryKey: privateKeys.pendingOrder(user?.id),
    queryFn: ({ signal }) => getLatestPendingOrder(signal),
    enabled: Boolean(user),
    staleTime: 0,
  })
}

export function useCreateOrder() {
  const queryClient = useQueryClient()
  const { user } = useSession()
  return useMutation({
    mutationFn: ({ body, key }: { body: CreateOrderBody; key: string }) =>
      createOrder(body, key),
    onSuccess: (order: Order) => {
      queryClient.setQueryData(privateKeys.order(user?.id, order.id), order)
      queryClient.invalidateQueries({
        queryKey: privateKeys.pendingOrder(user?.id),
      })
    },
  })
}
