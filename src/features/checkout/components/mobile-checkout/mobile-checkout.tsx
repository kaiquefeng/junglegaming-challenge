import { Link } from '@tanstack/react-router'
import { EllipsisVertical, Wallet } from 'lucide-react'
import { useState } from 'react'
import { MobileScreenHeader } from '@/components/mobile-screen-header'
import { cn } from '@/lib/utils'

const savedWallets = [
  { id: 'reserve', name: 'Reserva', lines: ['nova.kurio.eth', 'Rede Polygon'] },
  {
    id: 'main',
    name: 'Principal',
    lines: ['0xA91F…E82C', 'Rede principal Ethereum'],
  },
]

const options = [
  { id: 'walletconnect', label: 'WalletConnect', mark: 'W' },
  { id: 'metamask', label: 'MetaMask', mark: 'M' },
  { id: 'coinbase', label: 'Coinbase Wallet', mark: null },
]

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
  const [saved, setSaved] = useState('reserve')
  const [option, setOption] = useState('coinbase')

  return (
    <div className="flex min-h-[calc(100vh-84px)] flex-col justify-between gap-8 px-7 py-8">
      <div className="flex flex-col gap-4">
        <MobileScreenHeader title="Pagamento com carteira" className="gap-6" />
        <div className="flex items-center justify-between font-bold">
          <h2 className="text-base">Carteira conectada</h2>
          <button type="button" className="text-sm text-highlight">
            Trocar carteira
          </button>
        </div>

        <fieldset className="flex flex-col gap-5">
          <legend className="sr-only">Carteira conectada</legend>
          {savedWallets.map((wallet) => (
            <label
              key={wallet.id}
              className="flex min-h-[93px] cursor-pointer items-center gap-4 rounded-[14px] bg-card px-[19px] py-4 shadow-[0_20px_20px_rgba(10,6,4,0.45)]"
            >
              <input
                type="radio"
                name="saved-wallet"
                checked={saved === wallet.id}
                onChange={() => setSaved(wallet.id)}
                className="sr-only"
              />
              <Radio checked={saved === wallet.id} />
              <div className="flex-1">
                <p className="text-base font-bold">{wallet.name}</p>
                {wallet.lines.map((line) => (
                  <p
                    key={line}
                    className="text-sm leading-[22px] text-muted-foreground"
                  >
                    {line}
                  </p>
                ))}
              </div>
              <EllipsisVertical
                aria-hidden="true"
                className="size-4 text-highlight"
              />
            </label>
          ))}
        </fieldset>

        <fieldset className="flex flex-col gap-4">
          <legend className="mb-4 text-base font-bold">Carteira e rede</legend>
          {options.map((item) => (
            <label
              key={item.id}
              className="flex h-[65px] cursor-pointer items-center gap-[11px] rounded-[15px] bg-card px-3.5 shadow-[0_0_20px_rgba(10,6,4,0.45)]"
            >
              <input
                type="radio"
                name="wallet-option"
                checked={option === item.id}
                onChange={() => setOption(item.id)}
                className="sr-only"
              />
              <span className="flex size-10 items-center justify-center rounded-full border border-border bg-[#2f1d15] text-sm font-bold text-highlight">
                {item.mark ?? <Wallet aria-hidden="true" className="size-5" />}
              </span>
              <span className="flex-1 text-sm">{item.label}</span>
              <Radio checked={option === item.id} />
            </label>
          ))}
        </fieldset>

        <p className="flex items-center justify-end gap-7 font-bold">
          <span>Total:</span>
          <span className="text-lg text-highlight">8.936 ETH</span>
        </p>
      </div>
      <Link
        to="/order-confirmation"
        className="flex h-[60px] items-center justify-center rounded-[40px] bg-[linear-gradient(108deg,#d28a4c_4%,rgba(210,138,76,0.8)_122%)] text-[15px] font-bold text-primary-foreground"
      >
        Confirmar compra
      </Link>
    </div>
  )
}
