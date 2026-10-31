import { Link } from '@tanstack/react-router'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/button'
import { Input } from '@/components/input'
import { Separator } from '@/components/separator'
import { Skeleton } from '@/components/skeleton'
import { formatEth, formatEthWithSymbol } from '@/lib/eth'
import { useCartView } from '../../hooks/use-cart-view'
import { CartIssues } from '../cart-issues/cart-issues'

const columns = 'sm:grid-cols-[1fr_96px_96px_96px_24px]'

export function CartView() {
  const view = useCartView()
  const { cart } = view

  if (view.isError) {
    return (
      <section role="alert" className="flex flex-col items-start gap-3">
        <p>Não foi possível carregar o carrinho.</p>
        <Button onClick={() => view.refetch()}>Tentar novamente</Button>
      </section>
    )
  }

  const isEmpty = !view.isLoading && (cart?.items.length ?? 0) === 0

  return (
    <section className="flex flex-col gap-3" aria-busy={view.isLoading}>
      <p className="text-[15px] font-bold">Início / Mercado / Carrinho</p>
      <div className="flex flex-col gap-10 lg:flex-row lg:justify-between">
        <div className="flex min-w-0 flex-col gap-3 lg:w-[782px]">
          {cart && (
            <CartIssues
              cart={cart}
              onAcceptPrices={view.acceptPrices}
              isAccepting={view.isAcceptingPrices}
            />
          )}
          <div
            className={`hidden items-center gap-4 pr-6 text-base sm:grid ${columns}`}
          >
            <span className="font-bold">NFTs</span>
            <span className="font-medium">Preço</span>
            <span className="font-bold">Edições</span>
            <span className="font-medium">Total</span>
            <span />
          </div>
          <Separator />

          {view.isLoading && (
            <div className="flex flex-col gap-3">
              <span role="status" className="sr-only">
                Carregando carrinho
              </span>
              {Array.from({ length: 3 }, (_, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: placeholders estáticos
                <Skeleton key={i} className="h-[70px] w-full" />
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

          <ul className="flex flex-col gap-3">
            {cart?.items.map((item) => (
              <li
                key={item.key}
                className={`grid grid-cols-[1fr_auto] items-center gap-4 bg-card pr-6 sm:min-h-[70px] ${columns}`}
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.imageAlt}
                    className="size-[70px] shrink-0 rounded-md object-cover"
                  />
                  <div className="flex flex-col gap-1.5 leading-4">
                    <Link
                      to="/nft/$nftId"
                      params={{ nftId: item.nftId }}
                      className="font-bold hover:underline"
                    >
                      {item.name}
                    </Link>
                    <p className="text-sm text-[#b39463]">
                      ID do token: {item.tokenId}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Edição: {item.edition}
                    </p>
                  </div>
                </div>
                <p className="font-bold text-muted-foreground">
                  {formatEthWithSymbol(item.unitPrice)}
                </p>
                <fieldset className="flex min-w-0 items-center justify-between border-0 p-0">
                  <legend className="sr-only">{`Quantidade de ${item.name}`}</legend>
                  <Button
                    size="icon"
                    className="h-[30px] w-5 rounded-full"
                    aria-label={`Diminuir quantidade de ${item.name}`}
                    disabled={item.quantity <= 1}
                    onClick={() => view.changeQuantity(item, item.quantity - 1)}
                  >
                    <Minus aria-hidden="true" className="size-4" />
                  </Button>
                  <span className="text-[17px]">{item.quantity}</span>
                  <Button
                    size="icon"
                    className="h-[30px] w-5 rounded-full"
                    aria-label={`Aumentar quantidade de ${item.name}`}
                    disabled={item.quantity >= item.maxPerOrder}
                    onClick={() => view.changeQuantity(item, item.quantity + 1)}
                  >
                    <Plus aria-hidden="true" className="size-4" />
                  </Button>
                </fieldset>
                <p className="font-bold text-highlight">
                  {formatEthWithSymbol(item.lineTotal)}
                </p>
                <button
                  type="button"
                  aria-label={`Remover ${item.name}`}
                  onClick={() => view.remove(item)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Trash2 aria-hidden="true" className="size-6" />
                </button>
              </li>
            ))}
          </ul>
        </div>

        <aside
          className="flex w-full flex-col gap-6 lg:w-[332px]"
          aria-label="Resumo da carteira"
        >
          <div className="flex flex-col gap-3">
            <h2 className="text-lg font-bold">Resumo da carteira</h2>
            <Separator />
          </div>

          <form
            onSubmit={view.submitCoupon}
            className="flex flex-col gap-2"
            noValidate
          >
            <label htmlFor="promo" className="text-sm font-bold">
              Código promocional
            </label>
            {cart?.coupon ? (
              <div className="flex items-center justify-between rounded-[3px] border border-primary p-2 text-sm">
                <span>
                  {cart.coupon.code} (-{cart.coupon.percent}%)
                </span>
                <button
                  type="button"
                  onClick={view.removeCoupon}
                  className="text-highlight underline"
                >
                  Remover cupom
                </button>
              </div>
            ) : (
              <div
                className={`flex h-10 items-center rounded-[3px] border pl-2 ${view.couponError ? 'border-destructive' : 'border-primary'}`}
              >
                <Input
                  id="promo"
                  value={view.code}
                  onChange={(event) => view.setCode(event.target.value)}
                  placeholder="Digite o código promocional..."
                  aria-invalid={view.couponError ? true : undefined}
                  aria-describedby={
                    view.couponError ? 'promo-error' : undefined
                  }
                  className="h-full flex-1 border-0 bg-transparent px-0 text-xs shadow-none focus-visible:ring-0"
                />
                <Button
                  type="submit"
                  disabled={!view.code.trim() || view.isApplyingCoupon}
                  className="h-10 w-[102px] rounded-l-none rounded-r-[3px] font-bold"
                >
                  Aplicar
                </Button>
              </div>
            )}
            {view.couponError && (
              <p
                id="promo-error"
                role="alert"
                className="text-xs text-destructive"
              >
                {view.couponError}
              </p>
            )}
          </form>

          {view.isLoading || !cart ? (
            <div className="flex flex-col gap-3">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-6 w-full" />
            </div>
          ) : (
            <>
              <dl className="flex flex-col gap-3" aria-live="polite">
                <div className="flex justify-between text-[15px]">
                  <dt>Subtotal</dt>
                  <dd className="text-lg">
                    {formatEthWithSymbol(cart.quote.subtotal)}
                  </dd>
                </div>
                <div className="flex justify-between text-[15px]">
                  <dt>Desconto do lançamento</dt>
                  <dd>(-) {formatEth(cart.quote.discount)}</dd>
                </div>
                <div className="flex flex-col items-end gap-3">
                  <div className="flex w-full justify-between text-[15px]">
                    <dt>Taxa de rede</dt>
                    <dd className="text-lg">
                      {formatEthWithSymbol(cart.quote.networkFee, 3)}
                    </dd>
                  </div>
                  <p className="text-xs text-highlight">Taxa estimada</p>
                </div>
              </dl>
              <p className="flex justify-between font-bold">
                <span>Total</span>
                <span className="text-lg text-highlight">
                  {formatEthWithSymbol(cart.quote.total, 3)}
                </span>
              </p>
            </>
          )}

          <div className="flex flex-col items-center gap-3">
            {isEmpty ||
            !cart ||
            cart.issues.some((i) => i.type === 'unavailable') ? (
              <Button disabled className="h-10 w-full rounded-[3px] font-bold">
                Conectar e finalizar
              </Button>
            ) : (
              <Button asChild className="h-10 w-full rounded-[3px] font-bold">
                <Link to="/checkout">Conectar e finalizar</Link>
              </Button>
            )}
            <Link to="/" className="text-[15px] text-highlight">
              Continuar explorando
            </Link>
          </div>
        </aside>
      </div>
    </section>
  )
}
