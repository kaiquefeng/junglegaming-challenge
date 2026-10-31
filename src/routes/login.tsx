import { createFileRoute } from '@tanstack/react-router'
import { LoginPage } from '@/pages/login'

export type AuthSearch = { redirect?: string; expired?: boolean }

export const validateAuthSearch = (
  search: Record<string, unknown>,
): AuthSearch => ({
  redirect: typeof search.redirect === 'string' ? search.redirect : undefined,
  expired:
    search.expired === true || search.expired === 'true' ? true : undefined,
})

export const Route = createFileRoute('/login')({
  validateSearch: validateAuthSearch,
  component: LoginPage,
})
