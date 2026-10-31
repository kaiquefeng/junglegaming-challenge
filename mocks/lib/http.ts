import { delay, HttpResponse } from 'msw'
import type { ApiErrorBody } from '@/services/contracts'
import { type DbUser, db, save } from '../db/db'
import { getScenario } from '../scenarios'

export const SESSION_TTL_MS = 30 * 60 * 1000

export const errorResponse = (status: number, body: ApiErrorBody) =>
  HttpResponse.json(body, { status })

export const errors = {
  validation: (fields: Record<string, string>, message = 'Dados inválidos.') =>
    errorResponse(422, { code: 'validation', message, fields }),
  unauthorized: () =>
    errorResponse(401, {
      code: 'unauthorized',
      message: 'Faça login para continuar.',
    }),
  expired: () =>
    errorResponse(401, {
      code: 'session_expired',
      message: 'Sua sessão expirou.',
    }),
  forbidden: () =>
    errorResponse(403, {
      code: 'forbidden',
      message: 'Sem permissão para esta ação.',
    }),
  notFound: (message = 'Recurso não encontrado.') =>
    errorResponse(404, { code: 'not_found', message }),
  conflict: (message: string, fields?: Record<string, string>) =>
    errorResponse(409, { code: 'conflict', message, fields }),
  transient: () =>
    errorResponse(503, {
      code: 'transient',
      message: 'Serviço temporariamente indisponível.',
    }),
}

export function hash32(value: string) {
  let h = 0x811c9dc5
  for (let i = 0; i < value.length; i += 1) {
    h ^= value.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return h >>> 0
}

let requestCounter = 0

export async function simulateLatency(seed = String(requestCounter++)) {
  const { latency, jitter } = getScenario()
  const extra = jitter ? hash32(seed) % jitter : 0
  await delay(latency + extra)
}

export type AuthResult =
  | { ok: true; user: DbUser; token: string }
  | { ok: false; response: Response }

export function authenticate(request: Request): AuthResult {
  const header = request.headers.get('authorization')
  const token = header?.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) return { ok: false, response: errors.unauthorized() }

  const state = db()
  const session = state.sessions[token]
  if (!session) return { ok: false, response: errors.unauthorized() }
  if (session.expiresAt <= Date.now()) {
    delete state.sessions[token]
    save()
    return { ok: false, response: errors.expired() }
  }
  const user = state.users.find((candidate) => candidate.id === session.userId)
  if (!user) return { ok: false, response: errors.unauthorized() }
  return { ok: true, user, token }
}

export function cartOwner(request: Request) {
  const auth = authenticate(request)
  if (auth.ok) return auth.user.id
  const guest = request.headers.get('x-guest-id')
  return guest ? `guest:${guest}` : null
}

export async function readJson<T>(request: Request): Promise<T> {
  try {
    return (await request.json()) as T
  } catch {
    return {} as T
  }
}
