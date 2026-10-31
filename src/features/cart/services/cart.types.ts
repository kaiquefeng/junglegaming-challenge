import type { EditionId } from '@/features/nft-detail/services/nft-detail.types'

export type CartIssue =
  | {
      type: 'price_changed'
      nftId: string
      edition: EditionId
      from: string
      to: string
    }
  | {
      type: 'unavailable'
      nftId: string
      edition: EditionId
      available: number
    }

export type CartItem = {
  key: string
  nftId: string
  edition: EditionId
  quantity: number
  name: string
  tokenId: string
  image: string
  imageAlt: string
  unitPrice: string
  lineTotal: string
  available: number
  maxPerOrder: number
}

export type Quote = {
  subtotal: string
  discount: string
  networkFee: string
  total: string
  currency: 'ETH'

  token: string
}

export type Cart = {
  items: CartItem[]
  coupon: { code: string; percent: number } | null
  quote: Quote
  issues: CartIssue[]
  count: number
}

export type AddCartItemBody = {
  nftId: string
  edition: EditionId
  quantity: number
}
