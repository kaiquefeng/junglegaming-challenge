import { ImageIcon } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { Button } from '@/components/button'
import { FormField } from '@/components/form-field'
import { Skeleton } from '@/components/skeleton'
import { announce } from '@/features/realtime'
import { useForm } from '@/hooks/use-form'
import { email, matches, minLength, required, validate } from '@/lib/validators'
import { isApiError, toApiError } from '@/services/api-error'
import { useProfile, useProfileMutations } from '../../hooks/use-profile'

const MAX_AVATAR_BYTES = 300 * 1024

const readAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })

export function ProfileForm() {
  const profile = useProfile()
  const mutations = useProfileMutations()
  const fileInput = useRef<HTMLInputElement>(null)
  const form = useForm({
    displayName: '',
    username: '',
    email: '',
    ensName: '',
    ensSuffix: '.eth',
    walletAlias: '',
  })
  const password = useForm({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const { setValues } = form
  useEffect(() => {
    if (!profile.data) return
    const {
      displayName,
      username,
      email: mail,
      ensName,
      ensSuffix,
      walletAlias,
    } = profile.data
    setValues({
      displayName,
      username,
      email: mail,
      ensName,
      ensSuffix: ensSuffix || '.eth',
      walletAlias,
    })
  }, [profile.data, setValues])

  async function saveProfile(event: React.FormEvent) {
    event.preventDefault()
    const errors = validate(form.values, {
      displayName: [required],
      username: [required, minLength(3)],
      email: [required, email],
      ensName: [required],
      walletAlias: [required],
    })
    form.setErrors(errors)
    form.setFormError(null)
    if (Object.keys(errors).length > 0) return
    try {
      await mutations.update.mutateAsync(form.values)
    } catch (error) {
      form.applyApiError(error)
    }
  }

  async function savePassword(event: React.FormEvent) {
    event.preventDefault()
    const { values } = password
    const errors = validate(values, {
      currentPassword: [required],
      newPassword: [minLength(8, 'A senha deve ter ao menos 8 caracteres.')],
      confirmPassword: [
        matches(() => values.newPassword, 'As senhas não conferem.'),
      ],
    })
    password.setErrors(errors)
    password.setFormError(null)
    if (Object.keys(errors).length > 0) return
    try {
      await mutations.changePassword.mutateAsync(values)
      password.setValues({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
    } catch (error) {
      password.applyApiError(error)
    }
  }

  async function pickAvatar(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    if (!file.type.startsWith('image/')) {
      announce('Envie um arquivo de imagem.', 'error')
      return
    }
    if (file.size > MAX_AVATAR_BYTES) {
      announce('A imagem deve ter no máximo 300 KB.', 'error')
      return
    }
    try {
      await mutations.uploadAvatar.mutateAsync(await readAsDataUrl(file))
    } catch (error) {
      announce(toApiError(error).message, 'error')
    }
  }

  if (profile.isPending) {
    return (
      <div className="flex min-w-0 flex-1 flex-col gap-6" aria-busy="true">
        <span role="status" className="sr-only">
          Carregando perfil
        </span>
        <Skeleton className="h-6 w-56" />
        {Array.from({ length: 4 }, (_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: placeholders estáticos
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    )
  }

  if (profile.isError) {
    return (
      <div role="alert" className="flex flex-1 flex-col items-start gap-3">
        <p>
          {isApiError(profile.error, 'forbidden')
            ? 'Você não tem permissão para ver este perfil.'
            : 'Não foi possível carregar o perfil.'}
        </p>
        <Button onClick={() => profile.refetch()}>Tentar novamente</Button>
      </div>
    )
  }

  const avatarUrl = profile.data?.avatarUrl

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-8">
      <form noValidate onSubmit={saveProfile} className="flex flex-col gap-8">
        <h1 className="text-base font-bold">Perfil do colecionador</h1>
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
            id="display-name"
            label="Nome de exibição"
            required
            {...form.bind('displayName')}
          />
          <FormField
            id="username"
            label="Nome de usuário"
            required
            {...form.bind('username')}
          />
          <FormField
            id="email"
            label="E-mail"
            type="email"
            required
            {...form.bind('email')}
          />
          <div className="flex gap-2.5">
            <FormField
              id="ens-suffix"
              label="Sufixo ENS"
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
          <FormField
            id="wallet-alias"
            label="Apelido da carteira"
            required
            {...form.bind('walletAlias')}
          />
          <div className="flex flex-col gap-2.5">
            <p id="avatar-label" className="text-[15px]">
              Avatar
            </p>
            <div className="flex items-center gap-6">
              <span className="flex size-[50px] items-center justify-center overflow-hidden rounded-full border border-border bg-[#2f1d15]">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Seu avatar"
                    className="size-full object-cover"
                  />
                ) : (
                  <ImageIcon
                    aria-hidden="true"
                    className="size-6 text-highlight"
                  />
                )}
              </span>
              <div className="flex items-center gap-5">
                <input
                  ref={fileInput}
                  type="file"
                  accept="image/*"
                  aria-labelledby="avatar-label"
                  onChange={pickAvatar}
                  className="sr-only"
                  tabIndex={-1}
                />
                <Button
                  type="button"
                  className="h-10 w-[98px] rounded-[3px] font-bold"
                  disabled={mutations.uploadAvatar.isPending}
                  onClick={() => fileInput.current?.click()}
                >
                  Alterar
                </Button>
                <button
                  type="button"
                  className="text-sm disabled:opacity-50"
                  disabled={!avatarUrl || mutations.removeAvatar.isPending}
                  onClick={() => mutations.removeAvatar.mutate()}
                >
                  Remover
                </button>
              </div>
            </div>
          </div>
        </div>
        <Button
          type="submit"
          disabled={mutations.update.isPending}
          className="h-10 w-[131px] rounded-[3px] font-bold"
        >
          {mutations.update.isPending ? 'Salvando…' : 'Salvar'}
        </Button>
      </form>

      <form noValidate onSubmit={savePassword} className="flex flex-col gap-6">
        <h2 className="text-base font-medium">Alterar senha</h2>
        {password.formError && (
          <p
            role="alert"
            className="rounded border border-destructive p-3 text-sm text-destructive"
          >
            {password.formError}
          </p>
        )}
        <div className="flex flex-col gap-6 md:max-w-[417px]">
          <FormField
            id="current-password"
            label="Senha atual"
            type="password"
            autoComplete="current-password"
            {...password.bind('currentPassword')}
          />
          <FormField
            id="new-password"
            label="Nova senha"
            type="password"
            autoComplete="new-password"
            {...password.bind('newPassword')}
          />
          <FormField
            id="confirm-password"
            label="Confirmar nova senha"
            type="password"
            autoComplete="new-password"
            {...password.bind('confirmPassword')}
          />
        </div>
        <Button
          type="submit"
          variant="outline"
          disabled={mutations.changePassword.isPending}
          className="h-10 w-[160px] rounded-[3px] font-bold"
        >
          Alterar senha
        </Button>
      </form>
    </div>
  )
}
