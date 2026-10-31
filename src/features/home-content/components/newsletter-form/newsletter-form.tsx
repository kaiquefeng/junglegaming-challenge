import { type FormEvent, useId, useState } from 'react'
import { Button } from '@/components/button'
import { Input } from '@/components/input'
import { ApiError } from '@/services/api-error'
import { useNewsletterSubscription } from '../../hooks/use-home-content'
import type { NewsletterFormProps } from './newsletter-form.types'

export function NewsletterForm({
  title,
  placeholder,
  submitLabel,
  description,
}: NewsletterFormProps) {
  const inputId = useId()
  const feedbackId = useId()
  const [email, setEmail] = useState('')
  const { mutate, isPending, isSuccess, isError, data, error, reset } =
    useNewsletterSubscription()

  const errorMessage =
    error instanceof ApiError && error.code === 'validation'
      ? error.message
      : 'Não foi possível concluir a inscrição.'

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    mutate({ email }, { onSuccess: () => setEmail('') })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3" noValidate>
      <label htmlFor={inputId} className="text-base font-bold leading-tight">
        {title}
      </label>
      <div className="flex">
        <Input
          id={inputId}
          type="email"
          value={email}
          placeholder={placeholder}
          aria-invalid={isError}
          aria-describedby={feedbackId}
          onChange={(event) => {
            if (isError || isSuccess) reset()
            setEmail(event.target.value)
          }}
          className="h-10 rounded-r-none border-0 bg-secondary text-sm"
        />
        <Button
          type="submit"
          disabled={isPending}
          className="h-10 rounded-l-none font-bold"
        >
          {submitLabel}
        </Button>
      </div>
      <p
        id={feedbackId}
        role="status"
        aria-live="polite"
        className="text-sm text-muted-foreground"
      >
        {isSuccess && data.message}
        {isError && <span className="text-destructive">{errorMessage}</span>}
        {!isSuccess && !isError && description}
      </p>
    </form>
  )
}
