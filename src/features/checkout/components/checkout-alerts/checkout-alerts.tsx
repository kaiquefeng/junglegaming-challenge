import { Button } from '@/components/button'
import type { useCheckout } from '../../hooks/use-checkout'

type Checkout = ReturnType<typeof useCheckout>

export function CheckoutAlerts({ checkout }: { checkout: Checkout }) {
  return (
    <>
      {checkout.needsReview && (
        <div
          role="alert"
          className="flex flex-col gap-2 rounded border border-primary bg-card p-3 text-sm"
        >
          <p className="font-bold">Os valores do pedido mudaram</p>
          <p>
            {checkout.notice ??
              'Preço, disponibilidade, cupom ou taxa foram atualizados. Revise o resumo antes de confirmar.'}
          </p>
          <Button
            size="sm"
            className="self-start"
            onClick={checkout.acceptNewQuote}
          >
            Aceitar novos valores
          </Button>
        </div>
      )}
      {!checkout.needsReview && checkout.notice && (
        <p role="alert" className="rounded border border-primary p-3 text-sm">
          {checkout.notice}
        </p>
      )}
      {checkout.form.formError && (
        <p
          role="alert"
          className="rounded border border-destructive p-3 text-sm text-destructive"
        >
          {checkout.form.formError}
        </p>
      )}
    </>
  )
}
