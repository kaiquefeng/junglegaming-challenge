import { HttpResponse, http } from 'msw'
import type {
  LoginBody,
  RegisterBody,
} from '@/features/authentication/services/authentication.types'
import { db, hashPassword, nextId, save } from '../db/db'
import { emptyCart, getCartState } from '../lib/domain'
import {
  authenticate,
  errors,
  readJson,
  SESSION_TTL_MS,
  simulateLatency,
} from '../lib/http'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function publicUser(user: ReturnType<typeof db>['users'][number]) {
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    displayName: user.displayName,
    avatarUrl: user.avatarUrl,
  }
}

function openSession(userId: string) {
  const token = crypto.randomUUID()
  const expiresAt = Date.now() + SESSION_TTL_MS
  db().sessions[token] = { userId, expiresAt }
  save()
  return { token, expiresAt: new Date(expiresAt).toISOString() }
}

function mergeGuestCart(guestId: string | null, userId: string) {
  if (!guestId) return
  const state = db()
  const guest = state.carts[`guest:${guestId}`]
  if (!guest || guest.lines.length === 0) return
  const cart = getCartState(userId)
  for (const line of guest.lines) {
    const existing = cart.lines.find(
      (l) => l.nftId === line.nftId && l.edition === line.edition,
    )
    if (existing) existing.quantity += line.quantity
    else cart.lines.push({ ...line })
  }
  if (!cart.couponCode) cart.couponCode = guest.couponCode
  state.carts[`guest:${guestId}`] = emptyCart()
  save()
}

export const authHandlers = [
  http.post('/api/auth/register', async ({ request }) => {
    await simulateLatency()
    const body = await readJson<RegisterBody>(request)
    const fields: Record<string, string> = {}
    const email = body.email?.trim().toLowerCase() ?? ''
    const username = body.username?.trim() ?? ''

    if (username.length < 3) fields.username = 'Use ao menos 3 caracteres.'
    if (!EMAIL.test(email)) fields.email = 'Informe um e-mail válido.'
    if ((body.password ?? '').length < 8)
      fields.password = 'A senha deve ter ao menos 8 caracteres.'
    if (body.password !== body.confirm)
      fields.confirm = 'As senhas não conferem.'
    if (Object.keys(fields).length > 0) return errors.validation(fields)

    const state = db()
    const conflict: Record<string, string> = {}
    if (state.users.some((u) => u.email === email))
      conflict.email = 'Este e-mail já está cadastrado.'
    if (state.users.some((u) => u.username === username))
      conflict.username = 'Este nome de usuário já existe.'
    if (Object.keys(conflict).length > 0) {
      return errors.conflict('Já existe uma conta com estes dados.', conflict)
    }

    const user = {
      id: nextId('u'),
      email,
      username,
      displayName: username,
      passwordHash: await hashPassword(body.password),
      ensName: '',
      ensSuffix: '.eth',
      walletAlias: '',
    }
    state.users.push(user)
    state.wallets[user.id] = { primary: null, secondary: null }
    state.favorites[user.id] = []
    mergeGuestCart(request.headers.get('x-guest-id'), user.id)
    const session = openSession(user.id)
    save()
    return HttpResponse.json(
      { ...session, user: publicUser(user) },
      { status: 201 },
    )
  }),

  http.post('/api/auth/login', async ({ request }) => {
    await simulateLatency()
    const body = await readJson<LoginBody>(request)
    const email = body.email?.trim().toLowerCase() ?? ''
    const fields: Record<string, string> = {}
    if (!EMAIL.test(email)) fields.email = 'Informe um e-mail válido.'
    if (!body.password) fields.password = 'Informe a senha.'
    if (Object.keys(fields).length > 0) return errors.validation(fields)

    const user = db().users.find((candidate) => candidate.email === email)
    if (!user || user.passwordHash !== (await hashPassword(body.password))) {
      return errors.unauthorized()
    }
    mergeGuestCart(request.headers.get('x-guest-id'), user.id)
    const session = openSession(user.id)
    return HttpResponse.json({ ...session, user: publicUser(user) })
  }),

  http.get('/api/auth/me', async ({ request }) => {
    await simulateLatency()
    const auth = authenticate(request)
    if (!auth.ok) return auth.response
    const session = db().sessions[auth.token]
    return HttpResponse.json({
      user: publicUser(auth.user),
      expiresAt: new Date(session?.expiresAt ?? Date.now()).toISOString(),
    })
  }),

  http.post('/api/auth/logout', async ({ request }) => {
    await simulateLatency()
    const auth = authenticate(request)
    if (auth.ok) {
      delete db().sessions[auth.token]
      save()
    }
    return new HttpResponse(null, { status: 204 })
  }),
]
