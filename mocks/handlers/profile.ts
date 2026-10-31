import { HttpResponse, http } from 'msw'
import type {
  ChangePasswordBody,
  UpdateProfileBody,
} from '@/features/profile/services/profile.types'
import { type DbUser, db, hashPassword, save } from '../db/db'
import { authenticate, errors, readJson, simulateLatency } from '../lib/http'
import { getScenario } from '../scenarios'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MAX_AVATAR = 400_000

const toProfile = (user: DbUser) => ({
  id: user.id,
  displayName: user.displayName,
  username: user.username,
  email: user.email,
  ensName: user.ensName,
  ensSuffix: user.ensSuffix,
  walletAlias: user.walletAlias,
  avatarUrl: user.avatarUrl,
})

export const profileHandlers = [
  http.get('/api/profile', async ({ request }) => {
    await simulateLatency()
    const auth = authenticate(request)
    if (!auth.ok) return auth.response
    if (getScenario().forbidProfile) return errors.forbidden()
    return HttpResponse.json(toProfile(auth.user))
  }),

  http.patch('/api/profile', async ({ request }) => {
    await simulateLatency()
    const auth = authenticate(request)
    if (!auth.ok) return auth.response
    if (getScenario().forbidProfile) return errors.forbidden()

    const body = await readJson<UpdateProfileBody>(request)
    const fields: Record<string, string> = {}
    if (!body.displayName?.trim()) fields.displayName = 'Campo obrigatório.'
    if ((body.username ?? '').trim().length < 3)
      fields.username = 'Use ao menos 3 caracteres.'
    if (!EMAIL.test(body.email ?? ''))
      fields.email = 'Informe um e-mail válido.'
    if (!body.ensName?.trim()) fields.ensName = 'Campo obrigatório.'
    if (!body.walletAlias?.trim()) fields.walletAlias = 'Campo obrigatório.'
    if (Object.keys(fields).length > 0) return errors.validation(fields)

    const state = db()
    const email = body.email.trim().toLowerCase()
    const username = body.username.trim()
    const clash: Record<string, string> = {}
    if (state.users.some((u) => u.id !== auth.user.id && u.email === email)) {
      clash.email = 'Este e-mail já está em uso.'
    }
    if (
      state.users.some((u) => u.id !== auth.user.id && u.username === username)
    ) {
      clash.username = 'Este nome de usuário já existe.'
    }
    if (Object.keys(clash).length > 0)
      return errors.conflict('Dados já em uso.', clash)

    Object.assign(auth.user, {
      displayName: body.displayName.trim(),
      username,
      email,
      ensName: body.ensName.trim(),
      ensSuffix: body.ensSuffix || '.eth',
      walletAlias: body.walletAlias.trim(),
    })
    save()
    return HttpResponse.json(toProfile(auth.user))
  }),

  http.post('/api/profile/avatar', async ({ request }) => {
    await simulateLatency()
    const auth = authenticate(request)
    if (!auth.ok) return auth.response
    const { dataUrl } = await readJson<{ dataUrl?: string }>(request)
    if (!dataUrl?.startsWith('data:image/')) {
      return errors.validation({ avatar: 'Envie um arquivo de imagem.' })
    }
    if (dataUrl.length > MAX_AVATAR) {
      return errors.validation({
        avatar: 'A imagem deve ter no máximo 300 KB.',
      })
    }
    auth.user.avatarUrl = dataUrl
    save()
    return HttpResponse.json(toProfile(auth.user))
  }),

  http.delete('/api/profile/avatar', async ({ request }) => {
    await simulateLatency()
    const auth = authenticate(request)
    if (!auth.ok) return auth.response
    auth.user.avatarUrl = undefined
    save()
    return HttpResponse.json(toProfile(auth.user))
  }),

  http.post('/api/profile/password', async ({ request }) => {
    await simulateLatency()
    const auth = authenticate(request)
    if (!auth.ok) return auth.response
    const body = await readJson<ChangePasswordBody>(request)
    const fields: Record<string, string> = {}
    if (!body.currentPassword) fields.currentPassword = 'Informe a senha atual.'
    if ((body.newPassword ?? '').length < 8)
      fields.newPassword = 'A senha deve ter ao menos 8 caracteres.'
    if (body.newPassword !== body.confirmPassword)
      fields.confirmPassword = 'As senhas não conferem.'
    if (Object.keys(fields).length > 0) return errors.validation(fields)

    if (auth.user.passwordHash !== (await hashPassword(body.currentPassword))) {
      return errors.validation({ currentPassword: 'Senha atual incorreta.' })
    }
    auth.user.passwordHash = await hashPassword(body.newPassword)
    save()
    return new HttpResponse(null, { status: 204 })
  }),
]
