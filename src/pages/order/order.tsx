import { getRouteApi } from '@tanstack/react-router'
import { OrderStatus } from '@/features/orders'

const route = getRouteApi('/orders/$orderId')

export function OrderPage() {
  const { orderId } = route.useParams()
  return <OrderStatus orderId={orderId} />
}
