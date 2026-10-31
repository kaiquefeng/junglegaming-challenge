import { createFileRoute } from '@tanstack/react-router'
import { requireAuth } from '@/features/authentication'
import { OrderPage } from '@/pages/order'

export const Route = createFileRoute('/orders/$orderId')({
  beforeLoad: requireAuth,
  component: OrderPage,
})
