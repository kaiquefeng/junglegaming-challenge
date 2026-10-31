import { Button } from '@/components/button'
import { FormField } from '@/components/form-field'
import { Input } from '@/components/input'

const networks = ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism']
const walletTypes = ['MetaMask', 'WalletConnect', 'Coinbase Wallet']

export function WalletsForm() {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-8">
      <form className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <div className="flex items-start justify-between">
            <h1 className="text-[17px] font-bold">Carteira principal</h1>
            <button
              type="button"
              className="text-base font-medium text-highlight"
            >
              Adicionar
            </button>
          </div>
          <p className="text-sm text-muted-foreground">
            Estas carteiras ficam disponíveis no pagamento e para receber NFTs
            comprados.
          </p>
        </div>

        <div className="grid gap-x-8 gap-y-6 md:grid-cols-2">
          <FormField id="display-name" label="Nome de exibição" required />
          <FormField id="wallet-alias" label="Apelido da carteira" required />
          <FormField
            id="network"
            label="Rede"
            required
            options={networks}
            placeholder="Selecione uma rede"
          />
          <FormField id="profile-name" label="Nome do perfil" required />
          <FormField
            id="address"
            label="Endereço da carteira"
            required
            placeholder="Endereço 0x da carteira"
          />
          <FormField
            id="secondary"
            label="Carteira secundária"
            placeholder="ENS ou carteira secundária (opcional)"
            containerClassName="self-end [&>label]:sr-only"
          />
          <FormField
            id="wallet-type"
            label="Tipo de carteira"
            required
            options={walletTypes}
            placeholder="Selecione uma carteira"
          />
          <FormField id="referral" label="Código de indicação" required />
          <FormField id="email" label="E-mail" type="email" required />
          <div className="flex flex-col gap-1">
            <label htmlFor="ens-name" className="flex items-center text-[15px]">
              Nome ENS
              <span
                aria-hidden="true"
                className="text-[22px] leading-none text-[#f0805f]"
              >
                *
              </span>
            </label>
            <div className="flex gap-2.5">
              <FormField
                id="ens-suffix"
                label="Sufixo ENS"
                options={['.eth']}
                placeholder=".eth"
                defaultValue=".eth"
                containerClassName="w-[78px] [&>label]:sr-only"
              />
              <Input
                id="ens-name"
                className="h-10 flex-1 rounded-[3px] border-border shadow-none"
              />
            </div>
          </div>
        </div>

        <Button
          type="submit"
          className="h-10 w-[131px] rounded-[3px] font-bold"
        >
          Salvar carteira
        </Button>
      </form>

      <section className="flex flex-col gap-3">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <h2 className="text-[17px] font-bold">Carteira secundária</h2>
          <div className="flex items-center gap-2 text-sm">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="same-wallet"
                className="size-4 accent-primary"
              />
              Igual à carteira principal
            </label>
            <button
              type="button"
              className="ml-6 text-base font-medium text-highlight"
            >
              Adicionar
            </button>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Você ainda não adicionou uma carteira secundária.
        </p>
      </section>
    </div>
  )
}
