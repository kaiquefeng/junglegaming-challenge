import type { EditionId } from '@/features/nft-detail/services/nft-detail.types'
import type {
  BuyerData,
  OrderItem,
  OrderStatus,
  PaymentData,
} from '@/features/orders/services/orders.types'
import type { Wallet } from '@/features/wallets/services/wallets.types'
import { nfts } from '../fixtures/catalog'
import { seedEditions } from '../fixtures/nft-detail'

const STORAGE_KEY = 'kurio.mocks.db.v2'

export type DbUser = {
  id: string
  email: string
  username: string
  displayName: string
  passwordHash: string
  avatarUrl?: string
  ensName: string
  ensSuffix: string
  walletAlias: string
}

export type DbStock = {
  price: string
  previousPrice?: string
  version: number
  editions: Record<EditionId, number>
}

export type DbCartLine = {
  nftId: string
  edition: EditionId
  quantity: number

  seenPrice: string
}

export type DbCart = { lines: DbCartLine[]; couponCode: string | null }

export type DbOrder = {
  id: string
  userId: string
  status: OrderStatus
  version: number
  items: OrderItem[]
  couponCode: string | null
  subtotal: string
  discount: string
  networkFee: string
  total: string
  buyer: BuyerData
  payment: PaymentData
  txHash?: string
  declineReason?: string
  createdAt: string
  settleAt: number
  settledAt?: string

  outcome: 'confirm' | 'decline'
}

export type DbData = {
  users: DbUser[]

  sessions: Record<string, { userId: string; expiresAt: number }>
  favorites: Record<string, string[]>

  carts: Record<string, DbCart>
  wallets: Record<string, { primary: Wallet | null; secondary: Wallet | null }>
  walletSessions: Record<string, { userId: string; walletType: string }>
  orders: DbOrder[]
  stock: Record<string, DbStock>

  idempotency: Record<string, { hash: string; orderId: string }>

  delayedKeys: string[]
  sequence: number
}

export async function sha256(value: string) {
  const bytes = new TextEncoder().encode(value)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(digest), (b) =>
    b.toString(16).padStart(2, '0'),
  ).join('')
}

export const hashPassword = (password: string) => sha256(`kurio:${password}`)

export const DEMO_PASSWORD = 'Senha@123'

async function seed(): Promise<DbData> {
  const passwordHash = await hashPassword(DEMO_PASSWORD)
  const stock: Record<string, DbStock> = {}
  nfts.forEach((nft, index) => {
    stock[nft.id] = {
      price: nft.price,
      previousPrice: nft.previousPrice,
      version: 1,
      editions: seedEditions(index),
    }
  })

  return {
    users: [
      {
        id: 'u-kaique',
        email: 'kaique@dev.com',
        username: 'kaique.feng',
        displayName: 'Kaique Feng',
        passwordHash,
        ensName: 'kaique',
        ensSuffix: '.eth',
        walletAlias: 'Carteira do Kaique',
      },
      {
        id: 'u-bruno',
        email: 'bruno@kurio.test',
        username: 'bruno.lima',
        displayName: 'Bruno Lima',
        passwordHash,
        ensName: 'brunolima',
        ensSuffix: '.eth',
        walletAlias: 'Carteira do Bruno',
      },
    ],
    sessions: {},
    favorites: { 'u-kaique': ['1'] },
    carts: {},
    wallets: {
      'u-kaique': {
        primary: {
          id: 'w-kaique-1',
          kind: 'primary',
          displayName: 'Kaique Feng',
          alias: 'Principal',
          network: 'ethereum',
          profileName: 'kaique.feng',
          address: '0xA91F00000000000000000000000000000000E82C',
          walletType: 'MetaMask',
          referralCode: 'KURIO-KAIQUE',
          email: 'kaique@dev.com',
          ensName: 'kaique',
          ensSuffix: '.eth',
        },
        secondary: null,
      },
      'u-bruno': { primary: null, secondary: null },
    },
    walletSessions: {},
    orders: [],
    stock,
    idempotency: {},
    delayedKeys: [],
    sequence: 0,
  }
}

let data: DbData | null = null

export function db(): DbData {
  if (!data) throw new Error('Banco simulado não inicializado')
  return data
}

export function save() {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(db()))
}

export async function initDb() {
  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (raw) {
    try {
      data = JSON.parse(raw) as DbData
      return
    } catch {}
  }
  data = await seed()
  save()
}

export async function resetDb() {
  data = await seed()
  save()
}

export const nextId = (prefix: string) => {
  const state = db()
  state.sequence += 1
  return `${prefix}-${String(state.sequence).padStart(4, '0')}`
}
