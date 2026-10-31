import { Link } from '@tanstack/react-router'
import { FormField } from '@/components/form-field'
import { SocialIcon } from '@/components/social-icon'
import { announce } from '@/features/realtime'
import { useAuthForm } from '../../hooks/use-auth-form'
import type { AuthMode } from '../auth-modal/auth-modal.types'
import { GoogleMark } from '../google-mark/google-mark'

const copy = {
  login: { title: 'Entrar', submit: 'Entrar' },
  signup: { title: 'Criar perfil de colecionador', submit: 'Criar perfil' },
} as const

const socialButton =
  'flex h-10 items-center justify-center gap-3 rounded-[5px] border border-border text-[13px] font-medium text-muted-foreground'

const socialNotice = () =>
  announce(
    'Login social indisponível nesta versão. Use e-mail e senha.',
    'info',
  )

const fieldClass = 'h-[50px] rounded-[10px] text-sm'

export function MobileAuth({ mode }: { mode: AuthMode }) {
  const content = copy[mode]
  const { form, submit, pending, expired } = useAuthForm(mode)

  return (
    <div className="flex min-h-screen flex-col gap-10 px-7 pt-20 pb-6">
      <p className="flex h-[136px] items-center justify-center text-[32px] font-bold tracking-[3.2px]">
        KURIO
      </p>
      <h1
        className={
          mode === 'login'
            ? 'text-center text-xl font-bold'
            : 'text-center text-lg font-bold'
        }
      >
        {content.title}
      </h1>
      <form noValidate onSubmit={submit} className="flex flex-col gap-10">
        <div className="flex flex-col gap-3">
          {expired && (
            <p
              role="alert"
              className="rounded border border-primary p-2 text-sm"
            >
              Sua sessão expirou. Entre novamente para continuar de onde parou.
            </p>
          )}
          {form.formError && (
            <p
              role="alert"
              className="rounded border border-destructive p-2 text-sm text-destructive"
            >
              {form.formError}
            </p>
          )}
          {mode === 'signup' && (
            <FormField
              id="m-username"
              label="Nome de usuário"
              placeholder="Nome de usuário"
              hideLabel
              autoComplete="username"
              className={fieldClass}
              {...form.bind('username')}
            />
          )}
          <FormField
            id="m-email"
            label="E-mail"
            type="email"
            placeholder={
              mode === 'login' ? 'contato@email.com' : 'Digite seu e-mail'
            }
            hideLabel
            autoComplete="email"
            className={fieldClass}
            {...form.bind('email')}
          />
          <FormField
            id="m-password"
            label="Senha"
            type="password"
            placeholder="Senha"
            hideLabel
            autoComplete={
              mode === 'login' ? 'current-password' : 'new-password'
            }
            className={fieldClass}
            {...form.bind('password')}
          />
          {mode === 'signup' && (
            <FormField
              id="m-confirm"
              label="Confirmar senha"
              type="password"
              placeholder="Confirmar senha"
              hideLabel
              autoComplete="new-password"
              className={fieldClass}
              {...form.bind('confirm')}
            />
          )}
          {mode === 'login' && (
            <button
              type="button"
              onClick={() =>
                announce('Recuperação de senha indisponível nesta versão.')
              }
              className="self-end text-sm text-highlight"
            >
              Esqueceu a senha?
            </button>
          )}
        </div>
        <button
          type="submit"
          disabled={pending}
          aria-busy={pending}
          className="h-[60px] rounded-[10px] bg-primary text-base font-bold text-primary-foreground disabled:opacity-60"
        >
          {pending ? 'Aguarde…' : content.submit}
        </button>
      </form>
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2.5 text-[13px]">
          <span className="h-px flex-1 bg-border" />
          Ou continue com
          <span className="h-px flex-1 bg-border" />
        </div>
        <div className="flex flex-col gap-4">
          <button type="button" className={socialButton} onClick={socialNotice}>
            <GoogleMark />
            Continuar com Google
          </button>
          <button type="button" className={socialButton} onClick={socialNotice}>
            <SocialIcon network="facebook" className="size-5 text-[#3b5999]" />
            Continuar com Facebook
          </button>
        </div>
      </div>
      <p className="text-center text-[15px] text-muted-foreground">
        {mode === 'login' ? (
          <>
            Novo na Kurio?{' '}
            <Link
              to="/signup"
              search={(prev) => prev}
              className="text-highlight underline"
            >
              Crie uma conta
            </Link>
          </>
        ) : (
          <>
            Já tem uma conta?{' '}
            <Link
              to="/login"
              search={(prev) => prev}
              className="text-highlight underline"
            >
              Entre
            </Link>
          </>
        )}
      </p>
    </div>
  )
}
