import { Link } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/button'
import { Skeleton } from '@/components/skeleton'
import { isApiError } from '@/services/api-error'
import { useOrder } from '../../hooks/use-orders'
import { OrderReceiptModal } from '../order-receipt-modal/order-receipt-modal'

export function OrderStatus({ orderId }: { orderId: string }) {
  const { data: order, isPending, isError, error, refetch } = useOrder(orderId)

  if (isPending) {
    return (
      <section
        aria-busy="true"
        className="flex flex-col gap-4 px-4 py-8 md:p-0"
      >
        <span role="status" className="sr-only">
          Carregando pedido
        </span>
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-24 w-full max-w-lg" />
      </section>
    )
  }

  if (isError || !order) {
    const notFound = isApiError(error, 'not_found')
    return (
      <section
        role="alert"
        className="flex flex-col items-start gap-4 px-4 py-8 md:p-0"
      >
        <h1 className="text-2xl font-bold">
          {notFound
            ? 'Pedido não encontrado'
            : 'Não foi possível carregar o pedido'}
        </h1>
        <div className="flex gap-3">
          {!notFound && (
            <Button onClick={() => refetch()}>Tentar novamente</Button>
          )}
          <Button asChild variant="outline">
            <Link to="/">Voltar ao início</Link>
          </Button>
        </div>
      </section>
    )
  }

  if (order.status === 'confirmed') return <OrderReceiptModal order={order} />

  if (order.status === 'declined') {
    return (
      <section
        role="alert"
        className="flex flex-col items-start gap-4 px-4 py-8 md:p-0"
      >
        <h1 className="text-2xl font-bold">Pagamento recusado</h1>
        <p className="text-muted-foreground">
          {order.declineReason ?? 'A carteira recusou o pagamento.'} Nada foi
          cobrado e seus itens continuam no carrinho.
        </p>
        <div className="flex gap-3">
          <Button asChild>
            <Link to="/checkout">Tentar novamente</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/cart">Voltar ao carrinho</Link>
          </Button>
        </div>
      </section>
    )
  }

  return (
    <section
      className="flex flex-col items-start gap-4 px-4 py-8 md:p-0"
      aria-busy="true"
    >
      <h1 className="text-2xl font-bold">Processando pagamento</h1>
      <p
        role="status"
        className="flex items-center gap-2 text-muted-foreground"
      >
        <Loader2
          aria-hidden="true"
          className="size-4 animate-spin motion-reduce:animate-none"
        />
        Aguardando a confirmação da rede. Você pode recarregar a página: o
        pedido será retomado, sem nova compra.
      </p>
      <p className="text-sm text-muted-foreground">Pedido {order.id}</p>
    </section>
  )
}
