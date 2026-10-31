import { CheckoutView, MobileCheckout } from '@/features/checkout'
import { OrderConfirmationModal } from '@/features/order-confirmation'
import { useIsDesktop } from '@/hooks/use-media-query'

export function OrderConfirmationPage() {
  const isDesktop = useIsDesktop()

  return (
    <>
      {isDesktop ? <CheckoutView /> : <MobileCheckout />}
      <OrderConfirmationModal />
    </>
  )
}
