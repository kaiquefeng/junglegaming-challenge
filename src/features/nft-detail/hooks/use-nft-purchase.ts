import { useRouter } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import { useCartMutations } from '@/features/cart'
import { useFavorites } from '@/features/favorites'
import { announce } from '@/features/realtime'
import { toApiError } from '@/services/api-error'
import type { EditionId, NftDetail } from '../services/nft-detail.types'
import { useNftDetail } from './use-nft-detail'

export function useNftPurchase(nftId: string) {
  const router = useRouter()
  const query = useNftDetail(nftId)
  const detail: NftDetail | undefined = query.data
  const cart = useCartMutations()
  const favorites = useFavorites()

  const firstAvailable = useMemo(() => {
    const available = detail?.editions.filter(
      (edition) => edition.available > 0,
    )
    return (
      available?.find((edition) => edition.id === '1/50') ?? available?.[0]
    )?.id
  }, [detail])
  const [chosen, setChosen] = useState<EditionId | null>(null)
  const [quantity, setQuantity] = useState(1)

  const edition =
    detail?.editions.find((e) => e.id === chosen && e.available > 0) ??
    detail?.editions.find((e) => e.id === firstAvailable)
  const maxQuantity = edition?.maxPerOrder ?? 0
  const effectiveQuantity = Math.min(quantity, Math.max(1, maxQuantity))

  useEffect(() => {
    if (quantity > Math.max(1, maxQuantity))
      setQuantity(Math.max(1, maxQuantity))
  }, [maxQuantity, quantity])

  const canBuy = Boolean(detail && edition && maxQuantity > 0)

  async function addToCart(goToCart: boolean) {
    if (!detail || !edition) return
    try {
      await cart.add.mutateAsync({
        nftId: detail.id,
        edition: edition.id,
        quantity: effectiveQuantity,
      })
      if (goToCart) await router.navigate({ to: '/cart' })
      else announce(`${detail.name} adicionado ao carrinho.`, 'success')
    } catch (error) {
      announce(toApiError(error).message, 'error')
    }
  }

  return {
    query,
    detail,
    edition,
    selectEdition: (id: EditionId) => {
      setChosen(id)
      setQuantity(1)
    },
    quantity: effectiveQuantity,
    maxQuantity,
    increase: () => setQuantity(Math.min(maxQuantity, effectiveQuantity + 1)),
    decrease: () => setQuantity(Math.max(1, effectiveQuantity - 1)),
    canBuy,
    isAdding: cart.add.isPending,
    buyNow: () => addToCart(true),
    addToCart: () => addToCart(false),
    isFavorite: favorites.isFavorite(nftId),
    toggleFavorite: () => favorites.toggle(nftId),
  }
}
