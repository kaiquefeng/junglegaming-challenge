export type ApiErrorCode =
  | 'validation'
  | 'unauthorized'
  | 'session_expired'
  | 'forbidden'
  | 'not_found'
  | 'conflict'
  | 'quote_changed'
  | 'unavailable'
  | 'coupon_invalid'
  | 'coupon_expired'
  | 'wallet_rejected'
  | 'idempotency_conflict'
  | 'transient'

export type ApiErrorBody = {
  code: ApiErrorCode
  message: string

  fields?: Record<string, string>

  details?: unknown
}

export type RealtimeEvent<TName extends string, TData> = {
  id: string
  name: TName
  resource: 'nft' | 'order'
  resourceId: string
  version: number
  at: string
  data: TData
}
