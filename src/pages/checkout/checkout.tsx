import { CheckoutView, MobileCheckout } from '@/features/checkout'
import { useIsDesktop } from '@/hooks/use-media-query'

export function CheckoutPage() {
  return useIsDesktop() ? <CheckoutView /> : <MobileCheckout />
}
