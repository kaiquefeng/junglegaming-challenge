import { createFileRoute } from '@tanstack/react-router'
import { requireAuth } from '@/features/authentication'
import { CheckoutPage } from '@/pages/checkout'

export const Route = createFileRoute('/checkout')({
  beforeLoad: requireAuth,
  component: CheckoutPage,
})
