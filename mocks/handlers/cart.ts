import { HttpResponse, http } from 'msw'
import type { AddCartItemBody } from '@/features/cart/services/cart.types'
import type { EditionId } from '@/features/nft-detail/services/nft-detail.types'
import { db, save } from '../db/db'
import { EDITION_IDS } from '../fixtures/nft-detail'
import { buildCart, COUPONS, getCartState, getDetail } from '../lib/domain'
import {
  cartOwner,
  errorResponse,
  errors,
  readJson,
  simulateLatency,
} from '../lib/http'

const noOwner = () =>
  errorResponse(400, {
    code: 'validation',
    message: 'Identificação do carrinho ausente.',
  })

export const cartHandlers = [
  http.get('/api/cart', async ({ request }) => {
    await simulateLatency()
    const owner = cartOwner(request)
    if (!owner) return noOwner()
    return HttpResponse.json(buildCart(owner))
  }),

  http.post('/api/cart/items', async ({ request }) => {
    await simulateLatency()
    const owner = cartOwner(request)
    if (!owner) return noOwner()
    const body = await readJson<AddCartItemBody>(request)

    const detail = getDetail(String(body.nftId))
    if (!detail) return errors.notFound('NFT não encontrado.')
    if (!EDITION_IDS.includes(body.edition)) {
      return errors.validation({ edition: 'Edição inválida.' })
    }
    if (!Number.isInteger(body.quantity) || body.quantity < 1) {
      return errors.validation({
        quantity: 'A quantidade deve ser um inteiro positivo.',
      })
    }

    const edition = detail.editions.find((e) => e.id === body.edition)
    const cart = getCartState(owner)
    const existing = cart.lines.find(
      (l) => l.nftId === detail.id && l.edition === body.edition,
    )
    const next = (existing?.quantity ?? 0) + body.quantity
    if (!edition || edition.available === 0) {
      return errorResponse(409, {
        code: 'unavailable',
        message: 'Edição esgotada.',
      })
    }
    if (next > edition.maxPerOrder) {
      return errorResponse(409, {
        code: 'unavailable',
        message: `Limite de ${edition.maxPerOrder} unidades para esta edição.`,
      })
    }

    if (existing) existing.quantity = next
    else
      cart.lines.push({
        nftId: detail.id,
        edition: body.edition,
        quantity: body.quantity,
        seenPrice: detail.price,
      })
    save()
    return HttpResponse.json(buildCart(owner), { status: 201 })
  }),

  http.patch('/api/cart/items', async ({ request }) => {
    await simulateLatency()
    const owner = cartOwner(request)
    if (!owner) return noOwner()
    const body = await readJson<AddCartItemBody>(request)
    const cart = getCartState(owner)
    const line = cart.lines.find(
      (l) => l.nftId === body.nftId && l.edition === body.edition,
    )
    if (!line) return errors.notFound('Item não está no carrinho.')
    if (!Number.isInteger(body.quantity) || body.quantity < 1) {
      return errors.validation({
        quantity: 'A quantidade deve ser um inteiro positivo.',
      })
    }
    const edition = getDetail(line.nftId)?.editions.find(
      (e) => e.id === line.edition,
    )
    if (!edition || body.quantity > edition.maxPerOrder) {
      return errorResponse(409, {
        code: 'unavailable',
        message: `Limite de ${edition?.maxPerOrder ?? 0} unidades para esta edição.`,
      })
    }
    line.quantity = body.quantity
    save()
    return HttpResponse.json(buildCart(owner))
  }),

  http.delete('/api/cart/items', async ({ request }) => {
    await simulateLatency()
    const owner = cartOwner(request)
    if (!owner) return noOwner()
    const params = new URL(request.url).searchParams
    const nftId = params.get('nftId')
    const edition = params.get('edition') as EditionId | null
    const cart = getCartState(owner)
    cart.lines = cart.lines.filter(
      (l) => !(l.nftId === nftId && l.edition === edition),
    )
    save()
    return HttpResponse.json(buildCart(owner))
  }),

  http.post('/api/cart/coupon', async ({ request }) => {
    await simulateLatency()
    const owner = cartOwner(request)
    if (!owner) return noOwner()
    const { code } = await readJson<{ code?: string }>(request)
    const normalized = (code ?? '').trim().toUpperCase()
    if (!normalized)
      return errors.validation({ code: 'Informe o código promocional.' })

    const coupon = COUPONS[normalized as keyof typeof COUPONS]
    if (!coupon) {
      return errorResponse(422, {
        code: 'coupon_invalid',
        message: 'Código promocional inválido.',
        fields: { code: 'Código promocional inválido.' },
      })
    }
    if (coupon.expired) {
      return errorResponse(410, {
        code: 'coupon_expired',
        message: 'Este código promocional expirou.',
        fields: { code: 'Este código promocional expirou.' },
      })
    }
    getCartState(owner).couponCode = normalized
    save()
    return HttpResponse.json(buildCart(owner))
  }),

  http.delete('/api/cart/coupon', async ({ request }) => {
    await simulateLatency()
    const owner = cartOwner(request)
    if (!owner) return noOwner()
    getCartState(owner).couponCode = null
    save()
    return HttpResponse.json(buildCart(owner))
  }),

  http.post('/api/cart/accept-prices', async ({ request }) => {
    await simulateLatency()
    const owner = cartOwner(request)
    if (!owner) return noOwner()
    const stock = db().stock
    for (const line of getCartState(owner).lines) {
      line.seenPrice = stock[line.nftId]?.price ?? line.seenPrice
    }
    save()
    return HttpResponse.json(buildCart(owner))
  }),
]
