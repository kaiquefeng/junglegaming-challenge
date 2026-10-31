import { useEffect } from 'react'
import { Button } from '@/components/button'
import { FormField } from '@/components/form-field'
import { useForm } from '@/hooks/use-form'
import {
  email,
  optionalWalletAddress,
  required,
  validate,
  walletAddress,
} from '@/lib/validators'
import { useSaveWallet } from '../../hooks/use-wallets'
import type { Wallet, WalletKind } from '../../services/wallets.types'

const networks = [
  { value: 'ethereum', label: 'Ethereum' },
  { value: 'polygon', label: 'Polygon' },
  { value: 'solana', label: 'Solana' },
]
const walletTypes = ['MetaMask', 'WalletConnect', 'Coinbase Wallet']

const empty = {
  displayName: '',
  alias: '',
  network: '',
  profileName: '',
  address: '',
  secondaryAddress: '',
  walletType: '',
  referralCode: '',
  email: '',
  ensName: '',
  ensSuffix: '.eth',
}

type WalletFormProps = {
  kind: WalletKind
  wallet: Wallet | null

  seed?: Partial<typeof empty>
  idPrefix: string
}

export function WalletForm({ kind, wallet, seed, idPrefix }: WalletFormProps) {
  const save = useSaveWallet(kind)
  const form = useForm(empty)
  const { setValues } = form

  useEffect(() => {
    setValues({
      ...empty,
      ...seed,
      ...(wallet
        ? {
            displayName: wallet.displayName,
            alias: wallet.alias,
            network: wallet.network,
            profileName: wallet.profileName,
            address: wallet.address,
            secondaryAddress: wallet.secondaryAddress ?? '',
            walletType: wallet.walletType,
            referralCode: wallet.referralCode,
            email: wallet.email,
            ensName: wallet.ensName,
            ensSuffix: wallet.ensSuffix || '.eth',
          }
        : {}),
    })
  }, [wallet, seed, setValues])

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    const errors = validate(form.values, {
      displayName: [required],
      alias: [required],
      network: [required],
      profileName: [required],
      address: [required, walletAddress],
      secondaryAddress: [optionalWalletAddress],
      walletType: [required],
      referralCode: [required],
      email: [required, email],
      ensName: [required],
    })
    form.setErrors(errors)
    form.setFormError(null)
    if (Object.keys(errors).length > 0) return
    try {
      await save.mutateAsync({
        ...form.values,
        secondaryAddress: form.values.secondaryAddress || undefined,
      })
    } catch (error) {
      form.applyApiError(error)
    }
  }

  const id = (name: string) => `${idPrefix}-${name}`

  return (
    <form noValidate onSubmit={submit} className="flex flex-col gap-8">
      {form.formError && (
        <p
          role="alert"
          className="rounded border border-destructive p-3 text-sm text-destructive"
        >
          {form.formError}
        </p>
      )}
      <div className="grid gap-x-8 gap-y-6 md:grid-cols-2">
        <FormField
          id={id('display-name')}
          label="Nome de exibição"
          required
          {...form.bind('displayName')}
        />
        <FormField
          id={id('alias')}
          label="Apelido da carteira"
          required
          {...form.bind('alias')}
        />
        <FormField
          id={id('network')}
          label="Rede"
          required
          options={networks}
          placeholder="Selecione uma rede"
          {...form.bind('network')}
        />
        <FormField
          id={id('profile-name')}
          label="Nome do perfil"
          required
          {...form.bind('profileName')}
        />
        <FormField
          id={id('address')}
          label="Endereço da carteira"
          required
          placeholder="Endereço 0x da carteira"
          {...form.bind('address')}
        />
        <FormField
          id={id('secondary')}
          label="Carteira secundária"
          placeholder="ENS ou carteira secundária (opcional)"
          containerClassName="self-end [&>label]:sr-only"
          {...form.bind('secondaryAddress')}
        />
        <FormField
          id={id('wallet-type')}
          label="Tipo de carteira"
          required
          options={walletTypes}
          placeholder="Selecione uma carteira"
          {...form.bind('walletType')}
        />
        <FormField
          id={id('referral')}
          label="Código de indicação"
          required
          {...form.bind('referralCode')}
        />
        <FormField
          id={id('email')}
          label="E-mail"
          type="email"
          required
          {...form.bind('email')}
        />
        <div className="flex gap-2.5">
          <FormField
            id={id('ens-suffix')}
            label="Sufixo ENS"
            options={['.eth']}
            placeholder=".eth"
            containerClassName="w-[92px] [&>label]:sr-only"
            {...form.bind('ensSuffix')}
          />
          <FormField
            id={id('ens-name')}
            label="Nome ENS"
            required
            containerClassName="flex-1"
            {...form.bind('ensName')}
          />
        </div>
      </div>
      <Button
        type="submit"
        disabled={save.isPending}
        className="h-10 w-[160px] rounded-[3px] font-bold"
      >
        {save.isPending ? 'Salvando…' : 'Salvar carteira'}
      </Button>
    </form>
  )
}
