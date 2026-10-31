import { redirect } from '@tanstack/react-router'
import { getToken } from './session'

export function safeRedirect(value: unknown, fallback = '/') {
  return typeof value === 'string' &&
    value.startsWith('/') &&
    !value.startsWith('//')
    ? value
    : fallback
}

export function requireAuth({ location }: { location: { href: string } }) {
  if (!getToken()) {
    throw redirect({ to: '/login', search: { redirect: location.href } })
  }
}
