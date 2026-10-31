import { Link, useRouter } from '@tanstack/react-router'
import { Button } from '@/components/button'
import { FormField } from '@/components/form-field'
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalTitle,
} from '@/components/modal'
import { SocialIcon } from '@/components/social-icon'
import { announce } from '@/features/realtime'
import { cn } from '@/lib/utils'
import { useAuthForm } from '../../hooks/use-auth-form'
import { GoogleMark } from '../google-mark/google-mark'
import type { AuthModalProps } from './auth-modal.types'

const copy = {
  login: {
    description:
      'Entre para gerenciar sua carteira, coleção e perfil de criador.',
    submit: 'Entrar',
  },
  signup: {
    description:
      'Crie seu perfil de colecionador e conecte uma carteira quando quiser.',
    submit: 'Criar conta',
  },
} as const

const socialNotice = () =>
  announce(
    'Login social indisponível nesta versão. Use e-mail e senha.',
    'info',
  )

export function AuthModal({ mode }: AuthModalProps) {
  const router = useRouter()
  const content = copy[mode]
  const { form, submit, pending, expired, closeTarget } = useAuthForm(mode)

  return (
    <Modal
      open
      onOpenChange={(open) => {
        if (!open) router.history.push(mode === 'login' ? '/' : closeTarget)
      }}
    >
      <ModalContent className="max-w-[500px] rounded-lg p-0">
        <div className="flex flex-col items-center gap-10 px-12 pt-12">
          <ModalTitle asChild>
            <nav
              aria-label="Autenticação"
              className="flex items-center gap-2 text-xl font-medium"
            >
              <Link
                to="/login"
                search={(prev) => prev}
                aria-current={mode === 'login' ? 'page' : undefined}
                className={cn(
                  mode === 'login' ? 'text-highlight' : 'text-foreground',
                )}
              >
                Entrar
              </Link>
              <span aria-hidden="true" className="h-5 w-px bg-[#f0805f]" />
              <Link
                to="/signup"
                search={(prev) => prev}
                aria-current={mode === 'signup' ? 'page' : undefined}
                className={cn(
                  mode === 'signup' ? 'text-highlight' : 'text-foreground',
                )}
              >
                Criar conta
              </Link>
            </nav>
          </ModalTitle>
          <ModalDescription className="text-center text-[13px] leading-4">
            {content.description}
          </ModalDescription>
        </div>

        <form
          noValidate
          onSubmit={submit}
          className="flex flex-col gap-3 px-6 pt-6 sm:px-20"
        >
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
              id="auth-username"
              label="Nome de usuário"
              placeholder="Nome de usuário"
              hideLabel
              autoComplete="username"
              {...form.bind('username')}
            />
          )}
          <FormField
            id="auth-email"
            label="E-mail"
            type="email"
            placeholder={
              mode === 'login' ? 'contato@email.com' : 'Digite seu e-mail'
            }
            hideLabel
            autoComplete="email"
            {...form.bind('email')}
          />
          <FormField
            id="auth-password"
            label="Senha"
            type="password"
            placeholder="Senha"
            hideLabel
            autoComplete={
              mode === 'login' ? 'current-password' : 'new-password'
            }
            {...form.bind('password')}
          />
          {mode === 'signup' && (
            <FormField
              id="auth-confirm"
              label="Confirmar senha"
              type="password"
              placeholder="Confirmar senha"
              hideLabel
              autoComplete="new-password"
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
          <Button
            type="submit"
            disabled={pending}
            aria-busy={pending}
            className="mt-3 h-[45px] rounded-[5px] text-base font-bold"
          >
            {pending ? 'Aguarde…' : content.submit}
          </Button>
        </form>

        <div className="flex flex-col gap-3 pt-6 pb-10">
          <div className="flex items-center gap-3">
            <span className="h-px flex-1 bg-border" />
            <span className="text-[13px]">Ou continue com</span>
            <span className="h-px flex-1 bg-border" />
          </div>
          <div className="flex flex-col gap-3 px-6 sm:px-20">
            <Button
              type="button"
              variant="outline"
              onClick={socialNotice}
              className="h-10 rounded-[5px] text-[13px] text-muted-foreground"
            >
              <GoogleMark />
              Continuar com Google
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={socialNotice}
              className="h-10 rounded-[5px] text-[13px] text-muted-foreground"
            >
              <SocialIcon
                network="facebook"
                className="size-5 text-[#3b5999]"
              />
              Continuar com Facebook
            </Button>
          </div>
        </div>
        <div className="h-2.5 bg-primary" />
      </ModalContent>
    </Modal>
  )
}
