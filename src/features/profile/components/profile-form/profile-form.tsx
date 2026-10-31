import { Eye, ImageIcon } from 'lucide-react'
import { Button } from '@/components/button'
import { FormField } from '@/components/form-field'
import { Input } from '@/components/input'

const passwordFields = [
  { id: 'current-password', label: 'Senha atual' },
  { id: 'new-password', label: 'Nova senha' },
  { id: 'confirm-password', label: 'Confirmar nova senha' },
]

export function ProfileForm() {
  return (
    <form className="flex min-w-0 flex-1 flex-col gap-8">
      <h1 className="text-base font-bold">Perfil do colecionador</h1>
      <div className="grid gap-x-8 gap-y-6 md:grid-cols-2">
        <FormField id="display-name" label="Nome de exibição" required />
        <FormField id="username" label="Nome de usuário" required />
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
        <FormField id="wallet-alias" label="Apelido da carteira" required />
        <div className="flex flex-col gap-2.5">
          <p className="text-[15px]">Avatar</p>
          <div className="flex items-center gap-6">
            <span className="flex size-[50px] items-center justify-center rounded-full border border-border bg-[#2f1d15]">
              <ImageIcon aria-hidden="true" className="size-6 text-highlight" />
            </span>
            <div className="flex items-center gap-5">
              <Button
                type="button"
                className="h-10 w-[98px] rounded-[3px] font-bold"
              >
                Alterar
              </Button>
              <button type="button" className="text-sm">
                Remover
              </button>
            </div>
          </div>
        </div>
      </div>

      <fieldset className="flex flex-col gap-6">
        <legend className="mb-6 text-base font-medium">Alterar senha</legend>
        {passwordFields.map((field) => (
          <div key={field.id} className="flex flex-col gap-3 md:max-w-[417px]">
            <label htmlFor={field.id} className="text-[15px]">
              {field.label}
            </label>
            <div className="relative">
              <Input
                id={field.id}
                type="password"
                className="h-10 rounded-[3px] border-border pr-11 shadow-none"
              />
              <Eye
                aria-hidden="true"
                className="absolute top-1/2 right-4 size-5 -translate-y-1/2 text-[#b39463]"
              />
            </div>
          </div>
        ))}
      </fieldset>

      <Button type="submit" className="h-10 w-[131px] rounded-[3px] font-bold">
        Salvar
      </Button>
    </form>
  )
}
