import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useSession } from '@/features/authentication'
import type { Cart } from '@/features/cart/services/cart.types'
import type {
  Nft,
  NftListResponse,
} from '@/features/catalog/services/catalog.types'
import type { NftDetail } from '@/features/nft-detail/services/nft-detail.types'
import { formatEth } from '@/lib/eth'
import { publicKeys } from '@/services/query-keys'
import { getSocket } from '@/services/socket'
import { announce } from '../announcer'
import type {
  NftUpdatedEvent,
  OrderUpdatedEvent,
} from '../services/realtime.types'

const SEEN_LIMIT = 200

export function useRealtime() {
  const queryClient = useQueryClient()
  const { token, user } = useSession()

  useEffect(() => {
    const seenIds = new Set<string>()
    const versions = new Map<string, number>()
    let hasConnected = false

    const remember = (id: string) => {
      seenIds.add(id)
      if (seenIds.size > SEEN_LIMIT) {
        const [oldest] = seenIds
        if (oldest) seenIds.delete(oldest)
      }
    }

    const accept = (
      event: {
        id: string
        resource: string
        resourceId: string
        version: number
      },
      cachedVersion = 0,
    ) => {
      if (seenIds.has(event.id)) return false
      remember(event.id)
      const key = `${event.resource}:${event.resourceId}`
      const known = Math.max(versions.get(key) ?? 0, cachedVersion)
      if (event.version <= known) return false
      versions.set(key, event.version)
      return true
    }

    const onNftUpdated = (event: NftUpdatedEvent) => {
      const cachedDetail = queryClient.getQueryData<NftDetail>(
        publicKeys.nft(event.resourceId),
      )
      const cachedItem = queryClient
        .getQueriesData<NftListResponse>({ queryKey: publicKeys.nftListAll })
        .flatMap(([, data]) => data?.items ?? [])
        .find((item) => item.id === event.resourceId)
      const cachedVersion = Math.max(
        cachedDetail?.version ?? 0,
        cachedItem?.version ?? 0,
      )
      if (!accept(event, cachedVersion)) return

      const { price, previousPrice, soldOut, editions } = event.data

      queryClient.setQueryData<NftDetail>(
        publicKeys.nft(event.resourceId),
        (old) =>
          old
            ? {
                ...old,
                price,
                previousPrice,
                soldOut,
                editions,
                version: event.version,
              }
            : old,
      )
      queryClient.setQueriesData<NftListResponse>(
        { queryKey: publicKeys.nftListAll },
        (old) =>
          old
            ? {
                ...old,
                items: old.items.map(
                  (item): Nft =>
                    item.id === event.resourceId
                      ? {
                          ...item,
                          price,
                          previousPrice,
                          soldOut,
                          version: event.version,
                        }
                      : item,
                ),
              }
            : old,
      )
      queryClient.invalidateQueries({ queryKey: publicKeys.featured })

      const carts = queryClient.getQueriesData<Cart>({
        predicate: (query) => query.queryKey[2] === 'cart',
      })
      const inCart = carts
        .flatMap(([, cart]) => cart?.items ?? [])
        .find((item) => item.nftId === event.resourceId)
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[2] === 'cart',
      })

      const previous =
        inCart?.unitPrice ?? cachedDetail?.price ?? cachedItem?.price

      if (inCart) {
        const name = cachedDetail?.name ?? inCart.name
        if (previous && previous !== price) {
          announce(
            `O preço de ${name} mudou de ${formatEth(previous)} para ${formatEth(price)} ETH. O resumo foi atualizado.`,
          )
        } else {
          announce(
            `A disponibilidade de ${name} mudou. O resumo foi atualizado.`,
          )
        }
      }
    }

    const onOrderUpdated = (event: OrderUpdatedEvent) => {
      if (!accept(event)) return

      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[2] === 'order',
      })
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[2] === 'pending-order',
      })
      if (event.data.status === 'confirmed') {
        announce('Pedido confirmado.', 'success')
        queryClient.invalidateQueries({
          predicate: (query) => query.queryKey[2] === 'cart',
        })
      } else if (event.data.status === 'declined') {
        announce(
          'Pagamento recusado. Seus itens continuam no carrinho.',
          'error',
        )
      }
    }

    const onConnect = () => {
      if (hasConnected) queryClient.invalidateQueries()
      hasConnected = true
    }

    let cancelled = false
    let release = () => {}

    getSocket().then((socket) => {
      if (cancelled) return
      socket.on('connect', onConnect)
      socket.on('nft.updated', onNftUpdated)
      socket.on('order.updated', onOrderUpdated)
      socket.connect()
      release = () => {
        socket.off('connect', onConnect)
        socket.off('nft.updated', onNftUpdated)
        socket.off('order.updated', onOrderUpdated)
        socket.disconnect()
      }
    })

    return () => {
      cancelled = true
      release()
    }
  }, [queryClient])

  // biome-ignore lint/correctness/useExhaustiveDependencies: `user?.id` reidentifica ao trocar de usuário
  useEffect(() => {
    let cancelled = false
    let release = () => {}

    getSocket().then((socket) => {
      if (cancelled) return
      const identify = () => socket.emit('session', token)
      if (socket.connected) identify()
      socket.on('connect', identify)
      release = () => {
        socket.off('connect', identify)
      }
    })

    return () => {
      cancelled = true
      release()
    }
  }, [token, user?.id])
}
