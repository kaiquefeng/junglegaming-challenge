const STORAGE_KEY = 'kurio.order-attempt'

type Attempt = { signature: string; key: string }

function read(): Attempt | null {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Attempt) : null
  } catch {
    return null
  }
}

export function keyFor(signature: string) {
  const current = read()
  if (current?.signature === signature) return current.key
  const next: Attempt = { signature, key: crypto.randomUUID() }
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {}
  return next.key
}

export function clearAttempt() {
  try {
    window.sessionStorage.removeItem(STORAGE_KEY)
  } catch {}
}
