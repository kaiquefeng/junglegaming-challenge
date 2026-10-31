import { CartView, MobileCart } from '@/features/cart'
import { useIsDesktop } from '@/hooks/use-media-query'

export function CartPage() {
  return useIsDesktop() ? <CartView /> : <MobileCart />
}
