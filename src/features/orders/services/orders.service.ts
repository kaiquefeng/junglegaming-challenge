import { api } from '@/services/api'
import type { CreateOrderBody, Order } from './orders.types'

export const createOrder = (body: CreateOrderBody, idempotencyKey: string) =>
  api
    .post<Order>('/orders', body, {
      headers: { 'Idempotency-Key': idempotencyKey },
    })
    .then((r) => r.data)

export const getOrder = (id: string, signal?: AbortSignal) =>
  api.get<Order>(`/orders/${id}`, { signal }).then((r) => r.data)

export const getLatestPendingOrder = (signal?: AbortSignal) =>
  api
    .get<{ order: Order | null }>('/orders/latest-pending', { signal })
    .then((r) => r.data.order)
