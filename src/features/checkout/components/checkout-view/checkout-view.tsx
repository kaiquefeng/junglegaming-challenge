import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { Button } from '@/components/button'
import { FormField } from '@/components/form-field'
import { Separator } from '@/components/separator'
import { cn } from '@/lib/utils'

const order = [
  {
    name: 'Emerald Ape #042',
    tokenId: '#0042',
    quantity: 2,
    total: 2.38,
    image: 'emerald-ape',
  },
  {
    name: 'Violet Nomad #314',
    tokenId: '#0314',
    quantity: 6,
    total: 8.34,
    image: 'sage-nomad',
  },
  {
    name: 'Ivory Baron #088',
    tokenId: '#0088',
    quantity: 9,
    total: 16.11,
    image: 'neon-vessel',
  },
]

const wallets = [
  { id: 'multi', label: 'METAMASK  •  WALLETCONNECT  •  COINBASE' },
  { id: 'metamask', label: 'MetaMask' },
  { id: 'coinbase', label: 'Coinbase Wallet' },
]

const networks = ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism']
const walletTypes = ['MetaMask', 'WalletConnect', 'Coinbase Wallet']

export function CheckoutView() {
  const [wallet, setWallet] = useState('coinbase')

  return (
    <section className="flex flex-col gap-8">
      <p className="text-[15px] font-bold">Início / Mercado / Pagamento</p>
      <div className="flex flex-col gap-8 lg:flex-row">
        <form className="flex min-w-0 flex-1 flex-col gap-3">
          <h1 className="text-[17px] font-bold">Perfil do colecionador</h1>
          <div className="flex flex-col gap-6">
            <div className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
              <div className="flex flex-col gap-3">
                <FormField
                  id="display-name"
                  label="Nome de exibição"
                  required
                />
                <FormField
                  id="network"
                  label="Rede"
                  required
                  options={networks}
                  placeholder="Selecione uma rede"
                />
                <FormField
                  id="address"
                  label="Endereço da carteira"
                  required
                  placeholder="Endereço 0x da carteira"
                />
                <FormField
                  id="wallet-type"
                  label="Tipo de carteira"
                  required
                  options={walletTypes}
                  placeholder="Selecione uma carteira"
                />
                <FormField id="email" label="E-mail" type="email" required />
              </div>
              <div className="flex flex-col gap-3">
                <FormField id="username" label="Nome de usuário" required />
                <FormField id="profile-name" label="Nome do perfil" required />
                <FormField
                  id="ens-wallet"
                  label="Carteira secundária"
                  placeholder="ENS ou carteira secundária (opcional)"
                  containerClassName="[&>label]:sr-only"
                />
                <FormField id="referral" label="Código de indicação" required />
                <FormField
                  id="ens"
                  label="Nome ENS"
                  required
                  options={['.eth']}
                  placeholder=".eth"
                  containerClassName="w-[92px]"
                />
              </div>
            </div>
            <label className="flex items-center gap-2 text-[15px]">
              <input
                type="radio"
                name="other-wallet"
                className="size-[15px] accent-primary"
              />
              Usar outra carteira?
            </label>
            <div className="flex flex-col gap-3 sm:w-[350px]">
              <label htmlFor="note" className="text-[15px]">
                Observação do colecionador (opcional)
              </label>
              <textarea
                id="note"
                className="h-[152px] rounded-[3px] border border-border bg-transparent p-3 text-sm outline-none focus-visible:border-ring"
              />
            </div>
          </div>
        </form>

        <aside className="flex w-full flex-col gap-3 lg:w-[405px] lg:shrink-0">
          <h2 className="text-[17px] font-bold">Seus NFTs</h2>
          <div className="flex flex-col gap-3">
            <div className="flex justify-between text-base">
              <span className="font-bold">NFTs</span>
              <span className="font-medium">Subtotal</span>
            </div>
            <Separator />
            <ul className="flex flex-col gap-3">
              {order.map((item) => (
                <li
                  key={item.name}
                  className="flex h-[70px] items-center gap-2 bg-card pr-4 pl-1"
                >
                  <img
                    src={`/images/nfts/${item.image}.webp`}
                    alt=""
                    className="size-[66px] shrink-0 rounded-lg object-cover"
                  />
                  <div className="flex min-w-0 flex-1 flex-col gap-1.5 leading-4">
                    <p className="font-bold">{item.name}</p>
                    <p className="text-sm text-[#b39463]">
                      ID do token: {item.tokenId}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    (x {item.quantity})
                  </p>
                  <p className="text-lg font-bold text-highlight">
                    {item.total.toFixed(2)} ETH
                  </p>
                </li>
              ))}
            </ul>
            <p className="text-center text-sm">
              Tem um código promocional? Aplique aqui
            </p>
            <dl className="flex flex-col gap-3 text-[15px]">
              <div className="flex justify-between">
                <dt>Subtotal</dt>
                <dd className="text-lg">26.83 ETH</dd>
              </div>
              <div className="flex justify-between">
                <dt>Desconto do lançamento</dt>
                <dd>(-) 00.00</dd>
              </div>
              <div className="flex justify-between">
                <dt>Taxa de rede</dt>
                <dd className="text-lg">0.016 ETH</dd>
              </div>
            </dl>
            <p className="text-center text-xs text-highlight">Taxa estimada</p>
            <Separator />
            <p className="flex justify-between font-bold">
              <span>Total</span>
              <span className="text-lg text-highlight">26.846 ETH</span>
            </p>
            <fieldset className="flex flex-col gap-5">
              <legend className="mb-5 w-full text-center text-[17px] font-bold">
                Carteira e rede
              </legend>
              <div className="flex flex-col gap-4">
                {wallets.map((item) => (
                  <label
                    key={item.id}
                    className={cn(
                      'flex h-[45px] cursor-pointer items-center gap-2.5 rounded-[3px] border border-border px-3',
                      wallet === item.id && 'border-primary',
                    )}
                  >
                    <input
                      type="radio"
                      name="wallet"
                      value={item.id}
                      checked={wallet === item.id}
                      onChange={() => setWallet(item.id)}
                      className="size-4 accent-primary"
                    />
                    {item.id === 'multi' ? (
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
            <Button
              asChild
              className="h-[45px] w-full rounded-lg text-[15px] font-bold"
            >
              <Link to="/order-confirmation">Confirmar compra</Link>
            </Button>
          </div>
        </aside>
      </div>
    </section>
  )
}
