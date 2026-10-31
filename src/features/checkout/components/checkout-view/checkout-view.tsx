import { Link } from '@tanstack/react-router'
import { Button } from '@/components/button'
import { FormField } from '@/components/form-field'
import { Separator } from '@/components/separator'
import { Skeleton } from '@/components/skeleton'
import { formatEth, formatEthWithSymbol } from '@/lib/eth'
import { cn } from '@/lib/utils'
import { useCheckout } from '../../hooks/use-checkout'
import { CheckoutAlerts } from '../checkout-alerts/checkout-alerts'
import { WalletConnection } from '../wallet-connection/wallet-connection'

const networks = [
  { value: 'ethereum', label: 'Ethereum' },
  { value: 'polygon', label: 'Polygon' },
  { value: 'solana', label: 'Solana' },
]
const walletOptions = [
  {
    value: 'WalletConnect',
    label: 'METAMASK  •  WALLETCONNECT  •  COINBASE',
    chip: true,
  },
  { value: 'MetaMask', label: 'MetaMask' },
  { value: 'Coinbase Wallet', label: 'Coinbase Wallet' },
]
const walletTypes = ['MetaMask', 'WalletConnect', 'Coinbase Wallet']

export function CheckoutView() {
  const checkout = useCheckout()
  const { form, cart } = checkout

  if (checkout.isCartError) {
    return (
      <section role="alert" className="flex flex-col items-start gap-3">
        <p>Não foi possível carregar o pedido.</p>
        <Button onClick={() => checkout.refetchCart()}>Tentar novamente</Button>
      </section>
    )
  }
  if (cart && cart.items.length === 0) {
    return (
      <section className="flex flex-col items-start gap-3">
        <h1 className="text-xl font-bold">Seu carrinho está vazio</h1>
        <Button asChild>
          <Link to="/">Explorar NFTs</Link>
        </Button>
      </section>
    )
  }

  return (
    <section className="flex flex-col gap-8" aria-busy={checkout.isCartLoading}>
      <p className="text-[15px] font-bold">Início / Mercado / Pagamento</p>
      <form
        noValidate
        onSubmit={checkout.submit}
        className="flex flex-col gap-8 lg:flex-row"
      >
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <h1 className="text-[17px] font-bold">Perfil do colecionador</h1>
          <div className="flex flex-col gap-6">
            <div className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
              <div className="flex flex-col gap-3">
                <FormField
                  id="display-name"
                  label="Nome de exibição"
                  required
                  {...form.bind('displayName')}
                />
                <FormField
                  id="network"
                  label="Rede"
                  required
                  options={networks}
                  placeholder="Selecione uma rede"
                  {...form.bind('network')}
                />
                <FormField
                  id="address"
                  label="Endereço da carteira"
                  required
                  placeholder="Endereço 0x da carteira"
                  {...form.bind('address')}
                />
                <FormField
                  id="wallet-type"
                  label="Tipo de carteira"
                  required
                  options={walletTypes}
                  placeholder="Selecione uma carteira"
                  {...form.bind('walletType')}
                />
                <FormField
                  id="email"
                  label="E-mail"
                  type="email"
                  required
                  {...form.bind('email')}
                />
              </div>
              <div className="flex flex-col gap-3">
                <FormField
                  id="username"
                  label="Nome de usuário"
                  required
                  {...form.bind('username')}
                />
                <FormField
                  id="profile-name"
                  label="Nome do perfil"
                  required
                  {...form.bind('profileName')}
                />
                <FormField
                  id="secondary"
                  label="Carteira secundária"
                  placeholder="ENS ou carteira secundária (opcional)"
                  containerClassName="[&>label]:sr-only"
                  {...form.bind('secondaryAddress')}
                />
                <FormField
                  id="referral"
                  label="Código de indicação"
                  required
                  {...form.bind('referralCode')}
                />
                <div className="flex gap-2.5">
                  <FormField
                    id="ens-suffix"
                    label="Sufixo"
                    options={['.eth']}
                    placeholder=".eth"
                    containerClassName="w-[92px] [&>label]:sr-only"
                    {...form.bind('ensSuffix')}
                  />
                  <FormField
                    id="ens-name"
                    label="Nome ENS"
                    required
                    containerClassName="flex-1"
                    {...form.bind('ensName')}
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:w-[350px]">
              <label htmlFor="note" className="text-[15px]">
                Observação do colecionador (opcional)
              </label>
              <textarea
                id="note"
                value={form.values.note}
                onChange={(event) => form.setValue('note', event.target.value)}
                className="h-[152px] rounded-[3px] border border-border bg-transparent p-3 text-sm outline-none focus-visible:border-ring"
              />
            </div>
          </div>
        </div>

        <aside
          className="flex w-full flex-col gap-3 lg:w-[405px] lg:shrink-0"
          aria-label="Resumo do pedido"
        >
          <h2 className="text-[17px] font-bold">Seus NFTs</h2>
          <div className="flex flex-col gap-3">
            <div className="flex justify-between text-base">
              <span className="font-bold">NFTs</span>
              <span className="font-medium">Subtotal</span>
            </div>
            <Separator />
            {cart ? (
              <ul className="flex flex-col gap-3">
                {cart.items.map((item) => (
                  <li
                    key={item.key}
                    className="flex h-[70px] items-center gap-2 bg-card pr-4 pl-1"
                  >
                    <img
                      src={item.image}
                      alt={item.imageAlt}
                      className="size-[66px] shrink-0 rounded-lg object-cover"
                    />
                    <div className="flex min-w-0 flex-1 flex-col gap-1.5 leading-4">
                      <p className="truncate font-bold">{item.name}</p>
                      <p className="text-sm text-[#b39463]">
                        ID do token: {item.tokenId}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      (x {item.quantity})
                    </p>
                    <p className="text-lg font-bold text-highlight">
                      {formatEth(item.lineTotal)} ETH
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex flex-col gap-3">
                <span role="status" className="sr-only">
                  Carregando pedido
                </span>
                {Array.from({ length: 3 }, (_, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: placeholders estáticos
                  <Skeleton key={i} className="h-[70px] w-full" />
                ))}
              </div>
            )}
            <p className="text-center text-sm">
              {cart?.coupon ? (
                `Cupom ${cart.coupon.code} aplicado.`
              ) : (
                <Link to="/cart" className="underline">
                  Tem um código promocional? Aplique aqui
                </Link>
              )}
            </p>
            {cart && (
              <dl
                className="flex flex-col gap-3 text-[15px]"
                aria-live="polite"
              >
                <div className="flex justify-between">
                  <dt>Subtotal</dt>
                  <dd className="text-lg">
                    {formatEthWithSymbol(cart.quote.subtotal)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt>Desconto do lançamento</dt>
                  <dd>(-) {formatEth(cart.quote.discount)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Taxa de rede</dt>
                  <dd className="text-lg">
                    {formatEthWithSymbol(cart.quote.networkFee, 3)}
                  </dd>
                </div>
              </dl>
            )}
            <p className="text-center text-xs text-highlight">Taxa estimada</p>
            <Separator />
            {cart && (
              <p className="flex justify-between font-bold">
                <span>Total</span>
                <span className="text-lg text-highlight">
                  {formatEthWithSymbol(cart.quote.total, 3)}
                </span>
              </p>
            )}

            <fieldset className="flex flex-col gap-5">
              <legend className="mb-5 w-full text-center text-[17px] font-bold">
                Carteira e rede
              </legend>
              <div className="flex flex-col gap-4">
                {walletOptions.map((item) => (
                  <label
                    key={item.value}
                    className={cn(
                      'flex h-[45px] cursor-pointer items-center gap-2.5 rounded-[3px] border border-border px-3 focus-within:outline-2 focus-within:outline-ring',
                      form.values.walletType === item.value && 'border-primary',
                    )}
                  >
                    <input
                      type="radio"
                      name="wallet"
                      value={item.value}
                      checked={form.values.walletType === item.value}
                      onChange={() => form.setValue('walletType', item.value)}
                      className="size-4 accent-primary"
                    />
                    {item.chip ? (
                      <span className="rounded-md border border-[#55321f] bg-secondary px-2 py-1.5 text-[9px] font-bold tracking-[0.1px] whitespace-pre text-highlight">
                        {item.label}
                      </span>
                    ) : (
                      <span className="text-[15px]">{item.label}</span>
                    )}
                  </label>
                ))}
              </div>
            </fieldset>

            <WalletConnection
              walletType={form.values.walletType}
              connection={checkout.connection}
              onConnect={checkout.connect}
              onDisconnect={checkout.disconnect}
            />
            <CheckoutAlerts checkout={checkout} />
            <Button
              type="submit"
              disabled={!checkout.canSubmit || checkout.isSubmitting}
              aria-busy={checkout.isSubmitting}
              className="h-[45px] w-full rounded-lg text-[15px] font-bold"
            >
              {checkout.isSubmitting
                ? checkout.isRetrying
                  ? 'Reenviando…'
                  : 'Enviando pedido…'
                : 'Confirmar compra'}
            </Button>
          </div>
        </aside>
      </form>
    </section>
  )
}
