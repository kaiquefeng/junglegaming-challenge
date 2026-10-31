import { Link, useNavigate } from '@tanstack/react-router'
import { Eye } from 'lucide-react'
import { Button } from '@/components/button'
import { Input } from '@/components/input'
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalTitle,
} from '@/components/modal'
import { SocialIcon } from '@/components/social-icon'
import { cn } from '@/lib/utils'
import { GoogleMark } from '../google-mark/google-mark'
import type { AuthModalProps } from './auth-modal.types'

const copy = {
  login: {
    description:
      'Entre para gerenciar sua carteira, coleção e perfil de criador.',
    submit: 'Entrar',
    fields: [
      {
        name: 'email',
        type: 'email',
        placeholder: 'contato@email.com',
        autoComplete: 'email',
      },
      {
        name: 'password',
        type: 'password',
        placeholder: 'Senha',
        autoComplete: 'current-password',
        toggle: true,
      },
    ],
  },
  signup: {
    description:
      'Crie seu perfil de colecionador e conecte uma carteira quando quiser.',
    submit: 'Criar conta',
    fields: [
      {
        name: 'username',
        type: 'text',
        placeholder: 'Nome de usuário',
        autoComplete: 'username',
      },
      {
        name: 'email',
        type: 'email',
        placeholder: 'Digite seu e-mail',
        autoComplete: 'email',
      },
      {
        name: 'password',
        type: 'password',
        placeholder: 'Senha',
        autoComplete: 'new-password',
        toggle: true,
      },
      {
        name: 'confirm',
        type: 'password',
        placeholder: 'Confirmar senha',
        autoComplete: 'new-password',
      },
    ],
  },
} as const

export function AuthModal({ mode }: AuthModalProps) {
  const navigate = useNavigate()
  const content = copy[mode]

  return (
    <Modal
      open
      onOpenChange={(open) => {
        if (!open) navigate({ to: '/' })
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

        <form className="flex flex-col gap-3 px-6 pt-6 sm:px-20">
          {content.fields.map((field) => (
            <div key={field.name} className="relative">
              <Input
                name={field.name}
                type={field.type}
                placeholder={field.placeholder}
                autoComplete={field.autoComplete}
                aria-label={field.placeholder}
                className="h-10 rounded-[5px] border-border px-4 pr-12 text-sm shadow-none placeholder:text-[#b39463]"
              />
              {'toggle' in field && (
                <Eye
                  aria-hidden="true"
                  className="absolute top-1/2 right-3 size-5 -translate-y-1/2 text-[#b39463]"
                />
              )}
            </div>
          ))}
          {mode === 'login' && (
            <a href="/login" className="self-end text-sm text-highlight">
              Esqueceu a senha?
            </a>
          )}
          <Button
            type="submit"
            className="mt-3 h-[45px] rounded-[5px] text-base font-bold"
          >
            {content.submit}
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
              variant="outline"
              className="h-10 rounded-[5px] text-[13px] text-muted-foreground"
            >
              <GoogleMark />
              Continuar com Google
            </Button>
            <Button
              variant="outline"
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
