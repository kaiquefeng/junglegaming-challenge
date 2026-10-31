import { useSyncExternalStore } from 'react'

const TOKEN_KEY = 'kurio.token'
const GUEST_KEY = 'kurio.guest'

type Listener = () => void
const listeners = new Set<Listener>()

function read(key: string) {
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

function write(key: string, value: string | null) {
  try {
    if (value === null) window.localStorage.removeItem(key)
    else window.localStorage.setItem(key, value)
  } catch {}
}

let token = read(TOKEN_KEY)

export const getToken = () => token

export function setToken(next: string | null) {
  if (next === token) return
  token = next
  write(TOKEN_KEY, next)
  for (const listener of listeners) listener()
}

export function subscribeToken(listener: Listener) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export const useToken = () =>
  useSyncExternalStore(subscribeToken, getToken, () => null)

export function getGuestId() {
  let id = read(GUEST_KEY)
  if (!id) {
    id = crypto.randomUUID()
    write(GUEST_KEY, id)
  }
  return id
}

type ExpiryHandler = () => void
let expiryHandler: ExpiryHandler | null = null

export const onSessionExpired = (handler: ExpiryHandler | null) => {
  expiryHandler = handler
}

export const notifySessionExpired = () => expiryHandler?.()
