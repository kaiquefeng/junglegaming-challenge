import { useMemo, useState } from 'react'
import { Button } from '@/components/button'
import { Skeleton } from '@/components/skeleton'
import { useWallets } from '../../hooks/use-wallets'
import { WalletForm } from '../wallet-form/wallet-form'

export function WalletsForm() {
  const wallets = useWallets()
  const [addingSecondary, setAddingSecondary] = useState(false)
  const [copyPrimary, setCopyPrimary] = useState(false)

  const primary = wallets.data?.primary ?? null
  const secondary = wallets.data?.secondary ?? null

  const secondarySeed = useMemo(
    () =>
      copyPrimary && primary
        ? {
            displayName: primary.displayName,
            alias: `${primary.alias} (secundária)`,
            network: primary.network,
            profileName: primary.profileName,
            walletType: primary.walletType,
            referralCode: primary.referralCode,
            email: primary.email,
            ensName: primary.ensName,
            ensSuffix: primary.ensSuffix,
          }
        : undefined,
    [copyPrimary, primary],
  )

  if (wallets.isPending) {
    return (
      <div className="flex min-w-0 flex-1 flex-col gap-6" aria-busy="true">
        <span role="status" className="sr-only">
          Carregando carteiras
        </span>
        <Skeleton className="h-6 w-56" />
        {Array.from({ length: 4 }, (_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: placeholders estáticos
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    )
  }

  if (wallets.isError) {
    return (
      <div role="alert" className="flex flex-1 flex-col items-start gap-3">
        <p>Não foi possível carregar as carteiras.</p>
        <Button onClick={() => wallets.refetch()}>Tentar novamente</Button>
      </div>
    )
  }

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-8">
      <section className="flex flex-col gap-8" aria-labelledby="primary-title">
        <div className="flex flex-col gap-2">
          <h1 id="primary-title" className="text-[17px] font-bold">
            Carteira principal
          </h1>
          <p className="text-sm text-muted-foreground">
            Estas carteiras ficam disponíveis no pagamento e para receber NFTs
            comprados.
          </p>
        </div>
        <WalletForm kind="primary" wallet={primary} idPrefix="primary" />
      </section>

      <section
        className="flex flex-col gap-4"
        aria-labelledby="secondary-title"
      >
        <div className="flex flex-wrap items-start justify-between gap-2">
          <h2 id="secondary-title" className="text-[17px] font-bold">
            Carteira secundária
          </h2>
          {!secondary && !addingSecondary && (
            <button
              type="button"
              disabled={!primary}
              onClick={() => setAddingSecondary(true)}
              className="text-base font-medium text-highlight disabled:opacity-50"
            >
              Adicionar
            </button>
          )}
          {(addingSecondary || secondary) && primary && !secondary && (
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={copyPrimary}
                onChange={(event) => setCopyPrimary(event.target.checked)}
                className="size-4 accent-primary"
              />
              Igual à carteira principal
            </label>
          )}
        </div>
        {!primary && (
          <p className="text-sm text-muted-foreground">
            Cadastre a carteira principal para adicionar uma secundária.
          </p>
        )}
        {primary && !secondary && !addingSecondary && (
          <p className="text-sm text-muted-foreground">
            Você ainda não adicionou uma carteira secundária.
          </p>
        )}
        {primary && (secondary || addingSecondary) && (
          <WalletForm
            kind="secondary"
            wallet={secondary}
            seed={secondarySeed}
            idPrefix="secondary"
          />
        )}
      </section>
    </div>
  )
}
