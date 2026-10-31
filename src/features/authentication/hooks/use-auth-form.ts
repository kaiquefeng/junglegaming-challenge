import { useRouter, useSearch } from '@tanstack/react-router'
import { useForm } from '@/hooks/use-form'
import { email, matches, minLength, required, validate } from '@/lib/validators'
import type { AuthMode } from '../components/auth-modal/auth-modal.types'
import { safeRedirect } from '../guards'
import { useLogin, useRegister } from './use-authentication'

export function useAuthForm(mode: AuthMode) {
  const router = useRouter()
  const search = useSearch({ strict: false }) as {
    redirect?: string
    expired?: boolean
  }
  const login = useLogin()
  const register = useRegister()
  const form = useForm({ username: '', email: '', password: '', confirm: '' })
  const pending = login.isPending || register.isPending

  const target = safeRedirect(search.redirect)

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    if (pending) return
    const { values } = form
    const errors =
      mode === 'login'
        ? validate(values, { email: [required, email], password: [required] })
        : validate(values, {
            username: [required, minLength(3)],
            email: [required, email],
            password: [minLength(8, 'A senha deve ter ao menos 8 caracteres.')],
            confirm: [
              matches(() => values.password, 'As senhas não conferem.'),
            ],
          })
    form.setErrors(errors)
    form.setFormError(null)
    if (Object.keys(errors).length > 0) return

    try {
      if (mode === 'login') {
        await login.mutateAsync({
          email: values.email,
          password: values.password,
        })
      } else {
        await register.mutateAsync(values)
      }
      router.history.push(target)
    } catch (error) {
      if (mode === 'login' && (error as { status?: number }).status === 401) {
        form.setFormError('E-mail ou senha incorretos.')
      } else {
        form.applyApiError(error)
      }
    }
  }

  return {
    form,
    submit,
    pending,
    expired: Boolean(search.expired),
    closeTarget: target,
  }
}
