import type {
  Cart,
  CartIssue,
  CartItem,
} from '@/features/cart/services/cart.types'
import type { EditionId } from '@/features/nft-detail/services/nft-detail.types'
import type { Order } from '@/features/orders/services/orders.types'
import { addEth, compareEth, mulEth, percentOfEth, subEth } from '@/lib/eth'
import { type DbCart, type DbOrder, db, nextId, save } from '../db/db'
import { nfts } from '../fixtures/catalog'
import { buildDetail } from '../fixtures/nft-detail'
import { publish } from '../socket/bus'
import { hash32 } from './http'

export const NETWORK_FEE = '0.016'

export const COUPONS = {
  KURIO10: { percent: 10, expired: false },
  WELCOME5: { percent: 5, expired: false },
  EXPIRED20: { percent: 20, expired: true },
} as const

export const nftIndex = (id: string) => nfts.findIndex((nft) => nft.id === id)

export function getDetail(id: string) {
  const index = nftIndex(id)
  const stock = db().stock[id]
  if (index < 0 || !stock) return null
  return buildDetail(index, stock, stock.editions)
}

export function emptyCart(): DbCart {
  return { lines: [], couponCode: null }
}

export function getCartState(owner: string) {
  const state = db()
  let cart = state.carts[owner]
  if (!cart) {
    cart = emptyCart()
    state.carts[owner] = cart
  }
  return cart
}

export function quoteToken(parts: string[]) {
  return hash32(parts.join('|')).toString(16)
}

export function buildCart(owner: string): Cart {
  const state = db()
  const cart = getCartState(owner)
  const items: CartItem[] = []
  const issues: CartIssue[] = []

  for (const line of cart.lines) {
    const detail = getDetail(line.nftId)
    const stock = state.stock[line.nftId]
    if (!detail || !stock) continue
    const edition = detail.editions.find(
      (candidate) => candidate.id === line.edition,
    )
    const available = edition?.available ?? 0

    items.push({
      key: `${line.nftId}:${line.edition}`,
      nftId: line.nftId,
      edition: line.edition,
      quantity: line.quantity,
      name: detail.name,
      tokenId: detail.tokenId,
      image: detail.image,
      imageAlt: detail.imageAlt,
      unitPrice: stock.price,
      lineTotal: mulEth(stock.price, line.quantity),
      available,
      maxPerOrder: edition?.maxPerOrder ?? 0,
    })

    if (compareEth(line.seenPrice, stock.price) !== 0) {
      issues.push({
        type: 'price_changed',
        nftId: line.nftId,
        edition: line.edition,
        from: line.seenPrice,
        to: stock.price,
      })
    }
    if (line.quantity > available) {
      issues.push({
        type: 'unavailable',
        nftId: line.nftId,
        edition: line.edition,
        available,
      })
    }
  }

  const subtotal = items.reduce((sum, item) => addEth(sum, item.lineTotal), '0')
  const coupon = cart.couponCode
    ? COUPONS[cart.couponCode as keyof typeof COUPONS]
    : undefined
  const discount =
    coupon && !coupon.expired ? percentOfEth(subtotal, coupon.percent) : '0'
  const networkFee = items.length > 0 ? NETWORK_FEE : '0'
  const total =
    items.length > 0 ? addEth(subEth(subtotal, discount), networkFee) : '0'

  return {
    items,
    coupon:
      cart.couponCode && coupon && !coupon.expired
        ? { code: cart.couponCode, percent: coupon.percent }
        : null,
    quote: {
      subtotal,
      discount,
      networkFee,
      total,
      currency: 'ETH',
      token: quoteToken([
        ...items.map(
          (i) => `${i.key}:${i.quantity}:${i.unitPrice}:${i.available}`,
        ),
        cart.couponCode ?? '-',
        discount,
        networkFee,
      ]),
    },
    issues,
    count: items.reduce((sum, item) => sum + item.quantity, 0),
  }
}

export function toOrderDto(order: DbOrder): Order {
  return {
    id: order.id,
    status: order.status,
    version: order.version,
    items: order.items,
    couponCode: order.couponCode,
    subtotal: order.subtotal,
    discount: order.discount,
    networkFee: order.networkFee,
    total: order.total,
    currency: 'ETH',
    buyer: order.buyer,
    payment: order.payment,
    txHash: order.txHash,
    declineReason: order.declineReason,
    createdAt: order.createdAt,
    settledAt: order.settledAt,
  }
}

let eventSequence = 0
const eventId = (prefix: string) =>
  `${prefix}-${Date.now().toString(36)}-${eventSequence++}`

export function publishNftUpdated(nftId: string) {
  const detail = getDetail(nftId)
  const stock = db().stock[nftId]
  if (!detail || !stock) return
  publish({
    id: eventId('evt-nft'),
    name: 'nft.updated',
    resource: 'nft',
    resourceId: nftId,
    version: stock.version,
    at: new Date().toISOString(),
    data: {
      price: stock.price,
      previousPrice: stock.previousPrice,
      soldOut: detail.soldOut,
      editions: detail.editions,
    },
  })
}

export function updateNft(
  nftId: string,
  patch: { price?: string; editions?: Partial<Record<EditionId, number>> },
) {
  const stock = db().stock[nftId]
  if (!stock) return false
  if (patch.price && patch.price !== stock.price) {
    stock.previousPrice = stock.price
    stock.price = patch.price
  }
  if (patch.editions) Object.assign(stock.editions, patch.editions)
  stock.version += 1
  save()
  publishNftUpdated(nftId)
  return true
}

export function publishOrderUpdated(order: DbOrder) {
  publish({
    id: eventId('evt-order'),
    name: 'order.updated',
    resource: 'order',
    resourceId: order.id,
    version: order.version,
    at: new Date().toISOString(),
    userId: order.userId,
    data: {
      status: order.status,
      txHash: order.txHash,
      declineReason: order.declineReason,
    },
  })
}

export function settleOrder(order: DbOrder, force = false) {
  if (order.status !== 'pending') return order
  if (!force && order.settleAt > Date.now()) return order

  const state = db()
  order.version += 1
  order.settledAt = new Date().toISOString()

  if (order.outcome === 'decline') {
    order.status = 'declined'
    order.declineReason = 'Pagamento recusado pela carteira.'
    save()
    publishOrderUpdated(order)
    return order
  }

  order.status = 'confirmed'
  order.txHash = `0x${hash32(order.id).toString(16).padStart(8, '0')}${hash32(
    order.createdAt,
  )
    .toString(16)
    .padStart(8, '0')}…E82C`
  const cart = getCartState(order.userId)
  const touched = new Set<string>()

  for (const item of order.items) {
    const stock = state.stock[item.nftId]
    if (stock) {
      stock.editions[item.edition] = Math.max(
        0,
        stock.editions[item.edition] - item.quantity,
      )
      stock.version += 1
      touched.add(item.nftId)
    }
    const line = cart.lines.find(
      (l) => l.nftId === item.nftId && l.edition === item.edition,
    )
    if (line) {
      line.quantity -= item.quantity
      if (line.quantity <= 0) cart.lines = cart.lines.filter((l) => l !== line)
    }
  }
  save()
  publishOrderUpdated(order)
  for (const nftId of touched) publishNftUpdated(nftId)
  return order
}

export const newOrderId = () => nextId('ord')
