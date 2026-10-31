import { HttpResponse, http } from 'msw'
import type {
  WalletInput,
  WalletKind,
} from '@/features/wallets/services/wallets.types'
import { db, nextId, save } from '../db/db'
import { authenticate, errors, readJson, simulateLatency } from '../lib/http'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const ADDRESS = /^0x[0-9a-fA-F]{40}$/

function validate(body: WalletInput) {
  const fields: Record<string, string> = {}
  const required: (keyof WalletInput)[] = [
    'displayName',
    'alias',
    'network',
    'profileName',
    'walletType',
    'referralCode',
    'ensName',
  ]
  for (const name of required) {
    if (!String(body[name] ?? '').trim()) fields[name] = 'Campo obrigatório.'
  }
  if (!EMAIL.test(body.email ?? '')) fields.email = 'Informe um e-mail válido.'
  if (!ADDRESS.test(body.address ?? '')) {
    fields.address = 'Endereço 0x inválido (42 caracteres hexadecimais).'
  }
  if (body.secondaryAddress && !ADDRESS.test(body.secondaryAddress)) {
    fields.secondaryAddress = 'Endereço 0x inválido.'
  }
  return fields
}

export const walletsHandlers = [
  http.get('/api/wallets', async ({ request }) => {
    await simulateLatency()
    const auth = authenticate(request)
    if (!auth.ok) return auth.response
    return HttpResponse.json(
      db().wallets[auth.user.id] ?? { primary: null, secondary: null },
    )
  }),

  http.put('/api/wallets/:kind', async ({ request, params }) => {
    await simulateLatency()
    const auth = authenticate(request)
    if (!auth.ok) return auth.response
    const kind = params.kind as WalletKind
    if (kind !== 'primary' && kind !== 'secondary') return errors.notFound()

    const body = await readJson<WalletInput>(request)
    const fields = validate(body)
    if (Object.keys(fields).length > 0) return errors.validation(fields)

    const state = db()
    const wallets = state.wallets[auth.user.id] ?? {
      primary: null,
      secondary: null,
    }
    state.wallets[auth.user.id] = wallets
    const other = kind === 'primary' ? wallets.secondary : wallets.primary
    if (other && other.address.toLowerCase() === body.address.toLowerCase()) {
      return errors.conflict(
        'Este endereço já está cadastrado em outra carteira.',
        {
          address: 'Este endereço já está cadastrado em outra carteira.',
        },
      )
    }
    if (kind === 'secondary' && !wallets.primary) {
      return errors.conflict('Cadastre a carteira principal primeiro.')
    }
    const current = wallets[kind]
    wallets[kind] = { ...body, id: current?.id ?? nextId('w'), kind }
    save()
    return HttpResponse.json(wallets)
  }),

  http.post('/api/wallets/connect', async ({ request }) => {
    await simulateLatency()
    const auth = authenticate(request)
    if (!auth.ok) return auth.response
    const body = await readJson<{ walletType?: string; network?: string }>(
      request,
    )
    if (!body.walletType || !body.network) {
      return errors.validation({ walletType: 'Selecione a carteira e a rede.' })
    }
    if (body.walletType === 'Coinbase Wallet' && body.network === 'solana') {
      return HttpResponse.json(
        {
          code: 'wallet_rejected',
          message: 'Coinbase Wallet recusou: rede Solana não suportada.',
        },
        { status: 403 },
      )
    }
    const sessionId = crypto.randomUUID()
    db().walletSessions[sessionId] = {
      userId: auth.user.id,
      walletType: body.walletType,
    }
    save()
    return HttpResponse.json(
      { sessionId, walletType: body.walletType },
      { status: 201 },
    )
  }),

  http.delete(
    '/api/wallets/connect/:sessionId',
    async ({ request, params }) => {
      await simulateLatency()
      const auth = authenticate(request)
      if (!auth.ok) return auth.response
      delete db().walletSessions[String(params.sessionId)]
      save()
      return new HttpResponse(null, { status: 204 })
    },
  ),
]
