import type { Quote } from '@/features/cart/services/cart.types'
import type { EditionId } from '@/features/nft-detail/services/nft-detail.types'

export type OrderStatus = 'pending' | 'confirmed' | 'declined'

export type OrderItem = {
  nftId: string
  name: string
  tokenId: string
  image: string
  edition: EditionId
  quantity: number
  unitPrice: string
  lineTotal: string
}

export type BuyerData = {
  displayName: string
  username: string
  profileName: string
  email: string
  referralCode: string
  ensName: string
  ensSuffix: string
  note?: string
}

export type PaymentData = {
  network: string
  walletType: string
  address: string
  secondaryAddress?: string
}

export type CreateOrderBody = {
  quoteToken: string
  couponCode: string | null
  buyer: BuyerData
  payment: PaymentData
  walletSessionId: string
}

export type Order = {
  id: string
  status: OrderStatus
  version: number
  items: OrderItem[]
  couponCode: string | null
  subtotal: string
  discount: string
  networkFee: string
  total: string
  currency: 'ETH'
  buyer: BuyerData
  payment: PaymentData
  txHash?: string
  declineReason?: string
  createdAt: string
  settledAt?: string
}

export type QuoteChangedDetails = { quote: Quote }
