import { createFileRoute } from '@tanstack/react-router'
import { OrderConfirmationPage } from '@/pages/order-confirmation'

export const Route = createFileRoute('/order-confirmation')({
  component: OrderConfirmationPage,
})
