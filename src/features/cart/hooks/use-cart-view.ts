import { useState } from 'react'
import { announce } from '@/features/realtime'
import { toApiError } from '@/services/api-error'
import type { CartItem } from '../services/cart.types'
import { useCart, useCartMutations } from './use-cart'

export function useCartView() {
  const query = useCart()
  const mutations = useCartMutations()
  const [code, setCode] = useState('')
  const [couponError, setCouponError] = useState<string | null>(null)

  async function submitCoupon(event?: React.FormEvent) {
    event?.preventDefault()
    setCouponError(null)
    try {
      await mutations.applyCoupon.mutateAsync(code)
      announce('Cupom aplicado.', 'success')
      setCode('')
    } catch (error) {
      const apiError = toApiError(error)
      setCouponError(apiError.fields.code ?? apiError.message)
    }
  }

  const changeQuantity = (item: CartItem, quantity: number) => {
    if (quantity < 1 || quantity > item.maxPerOrder) return
    mutations.update.mutate({
      nftId: item.nftId,
      edition: item.edition,
      quantity,
    })
  }

  const remove = (item: CartItem) =>
    mutations.remove.mutate({ nftId: item.nftId, edition: item.edition })

  return {
    cart: query.data,
    isLoading: query.isPending,
    isError: query.isError,
    isRefreshing: query.isFetching && !query.isPending,
    refetch: query.refetch,
    code,
    setCode: (value: string) => {
      setCode(value)
      setCouponError(null)
    },
    couponError,
    isApplyingCoupon: mutations.applyCoupon.isPending,
    submitCoupon,
    removeCoupon: () => mutations.removeCoupon.mutate(),
    acceptPrices: () => mutations.acceptPrices.mutate(),
    isAcceptingPrices: mutations.acceptPrices.isPending,
    changeQuantity,
    remove,
  }
}
