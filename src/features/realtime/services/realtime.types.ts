import type { Edition } from '@/features/nft-detail/services/nft-detail.types'
import type { OrderStatus } from '@/features/orders/services/orders.types'
import type { RealtimeEvent } from '@/services/contracts'

export type NftUpdatedEvent = RealtimeEvent<
  'nft.updated',
  {
    price: string
    previousPrice?: string
    soldOut: boolean
    editions: Edition[]
  }
>

export type OrderUpdatedEvent = RealtimeEvent<
  'order.updated',
  { status: OrderStatus; txHash?: string; declineReason?: string }
>
