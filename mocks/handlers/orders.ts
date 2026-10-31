import { delay, HttpResponse, http } from 'msw'
import type { CreateOrderBody } from '@/features/orders/services/orders.types'
import { type DbOrder, db, save, sha256 } from '../db/db'
import { buildCart, newOrderId, settleOrder, toOrderDto } from '../lib/domain'
import {
  authenticate,
  errorResponse,
  errors,
  readJson,
  simulateLatency,
} from '../lib/http'
import { getScenario } from '../scenarios'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const ADDRESS = /^0x[0-9a-fA-F]{40}$/

function validate(body: CreateOrderBody) {
  const fields: Record<string, string> = {}
  const { buyer, payment } = body
  const required: [string, string | undefined][] = [
    ['displayName', buyer?.displayName],
    ['username', buyer?.username],
    ['profileName', buyer?.profileName],
    ['referralCode', buyer?.referralCode],
    ['ensName', buyer?.ensName],
    ['network', payment?.network],
    ['walletType', payment?.walletType],
  ]
  for (const [name, value] of required) {
    if (!value?.trim()) fields[name] = 'Campo obrigatório.'
  }
  if (!EMAIL.test(buyer?.email ?? ''))
    fields.email = 'Informe um e-mail válido.'
  if (!ADDRESS.test(payment?.address ?? '')) {
    fields.address = 'Endereço 0x inválido (42 caracteres hexadecimais).'
  }
  return fields
}

function scheduleSettlement(order: DbOrder) {
  window.setTimeout(
    () => {
      const fresh = db().orders.find((o) => o.id === order.id)
      if (fresh) settleOrder(fresh)
    },
    Math.max(0, order.settleAt - Date.now()) + 20,
  )
}

export const ordersHandlers = [
  http.post('/api/orders', async ({ request }) => {
    const scenario = getScenario()
    await simulateLatency()
    const auth = authenticate(request)
    if (!auth.ok) return auth.response

    const key = request.headers.get('idempotency-key')
    if (!key) {
      return errors.validation({
        'idempotency-key': 'Cabeçalho Idempotency-Key obrigatório.',
      })
    }
    const body = await readJson<CreateOrderBody>(request)
    const state = db()
    const bodyHash = await sha256(JSON.stringify(body))
    const scopedKey = `${auth.user.id}:${key}`
    const previous = state.idempotency[scopedKey]

    if (previous) {
      if (previous.hash !== bodyHash) {
        return errorResponse(409, {
          code: 'idempotency_conflict',
          message:
            'Esta chave de idempotência já foi usada com outro conteúdo.',
        })
      }
      const existing = state.orders.find(
        (order) => order.id === previous.orderId,
      )
      if (existing)
        return HttpResponse.json(toOrderDto(settleOrder(existing)), {
          status: 200,
        })
    }

    const fields = validate(body)
    if (Object.keys(fields).length > 0) return errors.validation(fields)
    if (!state.walletSessions[body.walletSessionId]) {
      return errorResponse(403, {
        code: 'wallet_rejected',
        message: 'Conecte uma carteira antes de confirmar a compra.',
      })
    }

    const cart = buildCart(auth.user.id)
    if (cart.items.length === 0)
      return errors.validation({}, 'O carrinho está vazio.')
    const unavailable = cart.issues.find(
      (issue) => issue.type === 'unavailable',
    )
    if (unavailable) {
      return errorResponse(409, {
        code: 'unavailable',
        message: 'Um item ficou indisponível. Revise o carrinho.',
        details: { cart },
      })
    }

    if (cart.quote.token !== body.quoteToken) {
      return errorResponse(409, {
        code: 'quote_changed',
        message: 'Os valores mudaram. Revise e confirme novamente.',
        details: { cart },
      })
    }

    const order: DbOrder = {
      id: newOrderId(),
      userId: auth.user.id,
      status: 'pending',
      version: 1,
      items: cart.items.map((item) => ({
        nftId: item.nftId,
        name: item.name,
        tokenId: item.tokenId,
        image: item.image,
        edition: item.edition,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        lineTotal: item.lineTotal,
      })),
      couponCode: cart.coupon?.code ?? null,
      subtotal: cart.quote.subtotal,
      discount: cart.quote.discount,
      networkFee: cart.quote.networkFee,
      total: cart.quote.total,
      buyer: body.buyer,
      payment: body.payment,
      createdAt: new Date().toISOString(),
      settleAt: Date.now() + scenario.orderSettleMs,
      outcome:
        scenario.orderOutcome === 'decline' ||
        body.payment.address.toLowerCase().endsWith('dead')
          ? 'decline'
          : 'confirm',
    }
    state.orders.push(order)
    state.idempotency[scopedKey] = { hash: bodyHash, orderId: order.id }
    save()
    scheduleSettlement(order)

    if (scenario.orderResponseDelay && !state.delayedKeys.includes(scopedKey)) {
      state.delayedKeys.push(scopedKey)
      save()
      await delay(scenario.orderResponseDelay)
    }
    return HttpResponse.json(toOrderDto(order), { status: 202 })
  }),

  http.get('/api/orders/latest-pending', async ({ request }) => {
    await simulateLatency()
    const auth = authenticate(request)
    if (!auth.ok) return auth.response
    const order = [...db().orders]
      .reverse()
      .map((candidate) =>
        candidate.userId === auth.user.id ? settleOrder(candidate) : candidate,
      )
      .find(
        (candidate) =>
          candidate.userId === auth.user.id && candidate.status === 'pending',
      )
    return HttpResponse.json({ order: order ? toOrderDto(order) : null })
  }),

  http.get('/api/orders/:id', async ({ request, params }) => {
    await simulateLatency()
    const auth = authenticate(request)
    if (!auth.ok) return auth.response
    const order = db().orders.find((o) => o.id === params.id)

    if (!order || order.userId !== auth.user.id)
      return errors.notFound('Pedido não encontrado.')
    return HttpResponse.json(toOrderDto(settleOrder(order)))
  }),
]
