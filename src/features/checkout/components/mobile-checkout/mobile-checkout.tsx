import { Link } from '@tanstack/react-router'
import { EllipsisVertical, Wallet } from 'lucide-react'
import { MobileScreenHeader } from '@/components/mobile-screen-header'
import { Skeleton } from '@/components/skeleton'
import { formatEthWithSymbol } from '@/lib/eth'
import { cn } from '@/lib/utils'
import { useCheckout } from '../../hooks/use-checkout'
import { CheckoutAlerts } from '../checkout-alerts/checkout-alerts'
import { WalletConnection } from '../wallet-connection/wallet-connection'

const options = [
  { id: 'WalletConnect', label: 'WalletConnect', mark: 'W' },
  { id: 'MetaMask', label: 'MetaMask', mark: 'M' },
  { id: 'Coinbase Wallet', label: 'Coinbase Wallet', mark: null },
]

const networkLabel: Record<string, string> = {
  ethereum: 'Rede principal Ethereum',
  polygon: 'Rede Polygon',
  solana: 'Rede Solana',
}

function Radio({ checked }: { checked: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'flex size-4 shrink-0 items-center justify-center rounded-full border border-border',
        checked && 'border-primary',
      )}
    >
      {checked && <span className="size-2 rounded-full bg-primary" />}
    </span>
  )
}

export function MobileCheckout() {
  const checkout = useCheckout()
  const { form, cart } = checkout
  const saved = [checkout.wallets?.primary, checkout.wallets?.secondary].filter(
    (wallet): wallet is NonNullable<typeof wallet> => Boolean(wallet),
  )
  const hasErrors = Object.values(form.errors).some(Boolean)

  return (
    <form
      noValidate
      onSubmit={checkout.submit}
      className="flex min-h-[calc(100vh-84px)] flex-col justify-between gap-8 px-7 py-8"
      aria-busy={checkout.isCartLoading}
    >
      <div className="flex flex-col gap-4">
        <MobileScreenHeader title="Pagamento com carteira" className="gap-6" />
        <div className="flex items-center justify-between font-bold">
          <h2 className="text-base">Carteira conectada</h2>
          <Link to="/wallets" className="text-sm text-highlight">
            Trocar carteira
          </Link>
        </div>

        {saved.length === 0 && (
          <p className="rounded-[14px] bg-card p-4 text-sm text-muted-foreground">
            Nenhuma carteira cadastrada.{' '}
            <Link to="/wallets" className="text-highlight underline">
              Cadastrar carteira
            </Link>
          </p>
        )}
        <fieldset className="flex flex-col gap-5">
          <legend className="sr-only">Carteiras cadastradas</legend>
          {saved.map((wallet) => {
            const active = form.values.address === wallet.address
            return (
              <label
                key={wallet.id}
                className="flex min-h-[93px] cursor-pointer items-center gap-4 rounded-[14px] bg-card px-[19px] py-4 shadow-[0_20px_20px_rgba(10,6,4,0.45)] focus-within:outline-2 focus-within:outline-ring"
              >
                <input
                  type="radio"
                  name="saved-wallet"
                  checked={active}
                  onChange={() => {
                    form.setValue('address', wallet.address)
                    form.setValue('network', wallet.network)
                    form.setValue('walletType', wallet.walletType)
                    form.setValue('profileName', wallet.profileName)
                    form.setValue('referralCode', wallet.referralCode)
                  }}
                  className="sr-only"
                />
                <Radio checked={active} />
                <div className="min-w-0 flex-1">
                  <p className="text-base font-bold">{wallet.alias}</p>
                  <p className="truncate text-sm leading-[22px] text-muted-foreground">
                    {`${wallet.address.slice(0, 6)}…${wallet.address.slice(-4)}`}
                  </p>
                  <p className="text-sm leading-[22px] text-muted-foreground">
                    {networkLabel[wallet.network] ?? wallet.network}
                  </p>
                </div>
                <EllipsisVertical
                  aria-hidden="true"
                  className="size-4 text-highlight"
                />
              </label>
            )
          })}
        </fieldset>

        <fieldset className="flex flex-col gap-4">
          <legend className="mb-4 text-base font-bold">Carteira e rede</legend>
          {options.map((item) => (
            <label
              key={item.id}
              className="flex h-[65px] cursor-pointer items-center gap-[11px] rounded-[15px] bg-card px-3.5 shadow-[0_0_20px_rgba(10,6,4,0.45)] focus-within:outline-2 focus-within:outline-ring"
            >
              <input
                type="radio"
                name="wallet-option"
                checked={form.values.walletType === item.id}
                onChange={() => form.setValue('walletType', item.id)}
                className="sr-only"
              />
              <span className="flex size-10 items-center justify-center rounded-full border border-border bg-[#2f1d15] text-sm font-bold text-highlight">
                {item.mark ?? <Wallet aria-hidden="true" className="size-5" />}
              </span>
              <span className="flex-1 text-sm">{item.label}</span>
              <Radio checked={form.values.walletType === item.id} />
            </label>
          ))}
        </fieldset>

        <WalletConnection
          walletType={form.values.walletType}
          connection={checkout.connection}
          onConnect={checkout.connect}
          onDisconnect={checkout.disconnect}
        />
        {hasErrors && (
          <p
            role="alert"
            className="rounded border border-destructive p-3 text-sm text-destructive"
          >
            Dados incompletos:{' '}
            {Object.values(form.errors).filter(Boolean).join(' ')}{' '}
            <Link to="/profile" className="underline">
              Completar perfil
            </Link>
          </p>
        )}
        <CheckoutAlerts checkout={checkout} />

        <p className="flex items-center justify-end gap-7 font-bold">
          <span>Total:</span>
          {cart ? (
            <span className="text-lg text-highlight" aria-live="polite">
              {formatEthWithSymbol(cart.quote.total, 3)}
            </span>
          ) : (
            <Skeleton className="h-6 w-24" />
          )}
        </p>
      </div>
      <button
        type="submit"
        disabled={!checkout.canSubmit || checkout.isSubmitting}
        aria-busy={checkout.isSubmitting}
        className="flex h-[60px] items-center justify-center rounded-[40px] bg-[linear-gradient(108deg,#d28a4c_4%,rgba(210,138,76,0.8)_122%)] text-[15px] font-bold text-primary-foreground disabled:opacity-60"
      >
        {checkout.isSubmitting
          ? checkout.isRetrying
            ? 'Reenviando…'
            : 'Enviando pedido…'
          : 'Confirmar compra'}
      </button>
    </form>
  )
}
