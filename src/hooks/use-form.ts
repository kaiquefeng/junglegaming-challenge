import { useCallback, useState } from 'react'
import { ApiError } from '@/services/api-error'

export function useForm<T extends Record<string, string>>(initial: T) {
  const [values, setValues] = useState<T>(initial)
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({})
  const [formError, setFormError] = useState<string | null>(null)

  const setValue = useCallback(<K extends keyof T>(name: K, value: T[K]) => {
    setValues((current) => ({ ...current, [name]: value }))

    setErrors((current) =>
      current[name] ? { ...current, [name]: undefined } : current,
    )
  }, [])

  const bind = <K extends keyof T>(name: K) => ({
    value: values[name],
    onValueChange: (value: string) => setValue(name, value as T[K]),
    error: errors[name],
  })

  const applyApiError = useCallback((error: unknown) => {
    if (error instanceof ApiError) {
      const fields = error.fields as Partial<Record<keyof T, string>>
      setErrors(fields)
      setFormError(Object.keys(fields).length > 0 ? null : error.message)
      return
    }
    setFormError('Erro inesperado. Tente novamente.')
  }, [])

  return {
    values,
    setValues,
    setValue,
    errors,
    setErrors,
    formError,
    setFormError,
    bind,
    applyApiError,
  }
}
