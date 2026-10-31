import { Link } from '@tanstack/react-router'
import { Eye } from 'lucide-react'
import { Input } from '@/components/input'
import { SocialIcon } from '@/components/social-icon'
import type { AuthMode } from '../auth-modal/auth-modal.types'
import { GoogleMark } from '../google-mark/google-mark'

const copy = {
  login: {
    title: 'Entrar',
    submit: 'Entrar',
    fields: [
      { name: 'email', type: 'email', placeholder: 'contato@email.com' },
      {
        name: 'password',
        type: 'password',
        placeholder: 'Senha',
        toggle: true,
      },
    ],
  },
  signup: {
    title: 'Criar perfil de colecionador',
    submit: 'Criar perfil',
    fields: [
      { name: 'username', type: 'text', placeholder: 'Nome de usuário' },
      { name: 'email', type: 'email', placeholder: 'Digite seu e-mail' },
      {
        name: 'password',
        type: 'password',
        placeholder: 'Senha',
        toggle: true,
      },
      {
        name: 'confirm',
        type: 'password',
        placeholder: 'Confirmar senha',
        toggle: true,
      },
    ],
  },
} as const

const socialButton =
  'flex h-10 items-center justify-center gap-3 rounded-[5px] border border-border text-[13px] font-medium text-muted-foreground'

export function MobileAuth({ mode }: { mode: AuthMode }) {
  const content = copy[mode]

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
      <form className="flex flex-col gap-10">
        <div className="flex flex-col gap-3">
          {content.fields.map((field) => (
            <div key={field.name} className="relative">
              <Input
                name={field.name}
                type={field.type}
                placeholder={field.placeholder}
                aria-label={field.placeholder}
                className="h-[50px] rounded-[10px] border-border px-4 pr-12 text-sm shadow-none placeholder:text-[#b39463]"
              />
              {'toggle' in field && (
                <Eye
                  aria-hidden="true"
                  className="absolute top-1/2 right-4 size-[18px] -translate-y-1/2 text-[#b39463]"
                />
              )}
            </div>
          ))}
          {mode === 'login' && (
            <a href="/login" className="self-end text-sm text-highlight">
              Esqueceu a senha?
            </a>
          )}
        </div>
        <button
          type="submit"
          className="h-[60px] rounded-[10px] bg-primary text-base font-bold text-primary-foreground"
        >
          {content.submit}
        </button>
      </form>
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2.5 text-[13px]">
          <span className="h-px flex-1 bg-border" />
          Ou continue com
          <span className="h-px flex-1 bg-border" />
        </div>
        <div className="flex flex-col gap-4">
          <button type="button" className={socialButton}>
            <GoogleMark />
            Continuar com Google
          </button>
          <button type="button" className={socialButton}>
            <SocialIcon network="facebook" className="size-5 text-[#3b5999]" />
            Continuar com Facebook
          </button>
        </div>
      </div>
      <p className="text-center text-[15px] text-muted-foreground">
        {mode === 'login' ? (
          <>
            Novo na Kurio? <Link to="/signup">Crie uma conta</Link>
          </>
        ) : (
          <>
            Já tem uma conta? <Link to="/login">Entre</Link>
          </>
        )}
      </p>
    </div>
  )
}
