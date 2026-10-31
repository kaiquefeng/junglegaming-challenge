import { Link } from '@tanstack/react-router'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/button'
import { MobileScreenHeader } from '@/components/mobile-screen-header'
import { Skeleton } from '@/components/skeleton'
import { formatEth, formatEthWithSymbol } from '@/lib/eth'
import { useCartView } from '../../hooks/use-cart-view'
import { CartIssues } from '../cart-issues/cart-issues'

export function MobileCart() {
  const view = useCartView()
  const { cart } = view
  const isEmpty = !view.isLoading && (cart?.items.length ?? 0) === 0
  const blocked =
    isEmpty || !cart || cart.issues.some((i) => i.type === 'unavailable')

  return (
    <div
      className="flex min-h-[calc(100vh-84px)] flex-col gap-1 pt-8"
      aria-busy={view.isLoading}
    >
      <div className="flex flex-col gap-3 px-7">
        <MobileScreenHeader title="Carrinho de NFTs" centered />
        {view.isError && (
          <div role="alert" className="flex flex-col items-start gap-2">
            <p>Não foi possível carregar o carrinho.</p>
            <Button onClick={() => view.refetch()}>Tentar novamente</Button>
          </div>
        )}
        {cart && (
          <CartIssues
            cart={cart}
            onAcceptPrices={view.acceptPrices}
            isAccepting={view.isAcceptingPrices}
          />
        )}
        {view.isLoading && (
          <div className="flex flex-col gap-5">
            <span role="status" className="sr-only">
              Carregando carrinho
            </span>
            {Array.from({ length: 3 }, (_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: placeholders estáticos
              <Skeleton key={i} className="h-[100px] w-full rounded-[14px]" />
            ))}
          </div>
        )}
        {isEmpty && (
          <div className="flex flex-col items-start gap-3 py-6">
            <p className="text-muted-foreground">Seu carrinho está vazio.</p>
            <Button asChild>
              <Link to="/">Explorar NFTs</Link>
            </Button>
          </div>
        )}
        <ul className="flex flex-col gap-5">
          {cart?.items.map((item) => (
            <li
              key={item.key}
              className="flex h-[100px] overflow-hidden rounded-[14px] bg-card shadow-[0_6px_20px_rgba(10,6,4,0.45)]"
            >
              <img
                src={item.image}
                alt={item.imageAlt}
                className="size-[100px] shrink-0 object-cover"
              />
              <div className="relative flex flex-1 flex-col justify-between py-3 pr-3 pl-2.5">
                <div className="flex flex-col gap-1.5">
                  <h2 className="text-[15px] font-bold">{item.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    Edição: {item.edition}
                  </p>
                </div>
                <p className="text-lg font-bold text-highlight">
                  {formatEthWithSymbol(item.lineTotal)}
                </p>
                <div className="absolute right-3 bottom-4 flex items-center gap-2.5">
                  <button
                    type="button"
                    aria-label={
                      item.quantity === 1
                        ? `Remover ${item.name}`
                        : `Diminuir ${item.name}`
                    }
                    onClick={() =>
                      item.quantity === 1
                        ? view.remove(item)
                        : view.changeQuantity(item, item.quantity - 1)
                    }
                    className="flex size-6 items-center justify-center rounded-full border border-border bg-[#2f1d15] text-foreground"
                  >
                    {item.quantity === 1 ? (
                      <Trash2
                        aria-hidden="true"
                        className="size-3.5 text-highlight"
                      />
                    ) : (
                      <Minus aria-hidden="true" className="size-3.5" />
                    )}
                  </button>
                  <span className="w-3 text-center">{item.quantity}</span>
                  <button
                    type="button"
                    aria-label={`Aumentar ${item.name}`}
                    disabled={item.quantity >= item.maxPerOrder}
                    onClick={() => view.changeQuantity(item, item.quantity + 1)}
                    className="flex size-6 items-center justify-center rounded-full border border-border bg-[#2f1d15] text-foreground disabled:opacity-50"
                  >
                    <Plus aria-hidden="true" className="size-3.5" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-auto flex flex-col gap-6 rounded-t-[40px] bg-card px-6 pt-6 pb-9">
        <div className="flex flex-col gap-3">
          <form
            onSubmit={view.submitCoupon}
            noValidate
            className="flex flex-col gap-1"
          >
            {cart?.coupon ? (
              <div className="flex h-[50px] items-center justify-between rounded-[40px] border border-primary px-4 text-sm">
                <span>
                  {cart.coupon.code} (-{cart.coupon.percent}%)
                </span>
                <button
                  type="button"
                  onClick={view.removeCoupon}
                  className="text-highlight underline"
                >
                  Remover
                </button>
              </div>
            ) : (
              <div className="flex h-[50px] items-center rounded-[40px] border border-border pl-4 shadow-[0_6px_10px_rgba(10,6,4,0.45)]">
                <input
                  aria-label="Código promocional"
                  value={view.code}
                  onChange={(event) => view.setCode(event.target.value)}
                  aria-invalid={view.couponError ? true : undefined}
                  aria-describedby={
                    view.couponError ? 'm-promo-error' : undefined
                  }
                  placeholder="Digite o código promocional..."
                  className="min-w-0 flex-1 bg-transparent text-[13px] outline-none placeholder:text-[#b39463]"
                />
                <button
                  type="submit"
                  disabled={!view.code.trim() || view.isApplyingCoupon}
                  className="h-[50px] w-[97px] rounded-[40px] bg-[linear-gradient(96deg,rgba(210,138,76,0.54)_1%,#d28a4c_105%)] text-[15px] font-bold disabled:opacity-60"
                >
                  Aplicar
                </button>
              </div>
            )}
            {view.couponError && (
              <p
                id="m-promo-error"
                role="alert"
                className="px-4 text-xs text-destructive"
              >
                {view.couponError}
              </p>
            )}
          </form>
          {cart ? (
            <dl className="flex flex-col gap-3" aria-live="polite">
              <div className="flex justify-between text-[15px]">
                <dt>Subtotal</dt>
                <dd className="text-base">
                  {formatEthWithSymbol(cart.quote.subtotal)}
                </dd>
              </div>
              <div className="flex justify-between text-[15px]">
                <dt>Desconto do lançamento</dt>
                <dd>(-) {formatEth(cart.quote.discount)}</dd>
              </div>
              <div className="flex flex-col items-end">
                <div className="flex w-full justify-between text-[15px]">
                  <dt>Taxa de rede</dt>
                  <dd className="text-base">
                    {formatEthWithSymbol(cart.quote.networkFee, 3)}
                  </dd>
                </div>
                <p className="text-xs text-highlight">Taxa estimada</p>
              </div>
              <div className="flex justify-between font-bold">
                <dt>Total</dt>
                <dd className="text-lg text-highlight">
                  {formatEthWithSymbol(cart.quote.total, 3)}
                </dd>
              </div>
            </dl>
          ) : (
            <Skeleton className="h-24 w-full" />
          )}
        </div>
        {blocked ? (
          <button
            type="button"
            disabled
            className="flex h-[60px] items-center justify-center rounded-[40px] bg-primary text-base font-bold text-primary-foreground opacity-50"
          >
            Conectar e finalizar
          </button>
        ) : (
          <Link
            to="/checkout"
            className="flex h-[60px] items-center justify-center rounded-[40px] bg-[linear-gradient(109deg,#d28a4c_4%,rgba(210,138,76,0.8)_122%)] text-base font-bold text-primary-foreground"
          >
            Conectar e finalizar
          </Link>
        )}
      </div>
    </div>
  )
}
