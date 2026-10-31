import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useSession } from '@/features/authentication'
import { announce } from '@/features/realtime'
import { toApiError } from '@/services/api-error'
import { privateKeys } from '@/services/query-keys'
import {
  acceptPrices,
  addCartItem,
  applyCoupon,
  getCart,
  removeCartItem,
  removeCoupon,
  updateCartItem,
} from '../services/cart.service'
import type { AddCartItemBody, Cart } from '../services/cart.types'

export function useCart() {
  const { user } = useSession()
  return useQuery({
    queryKey: privateKeys.cart(user?.id),
    queryFn: ({ signal }) => getCart(signal),
    staleTime: 5_000,
  })
}

export function useCartMutations() {
  const queryClient = useQueryClient()
  const { user } = useSession()
  const key = privateKeys.cart(user?.id)

  const onSuccess = (cart: Cart) => queryClient.setQueryData(key, cart)
  const onError = (error: unknown) =>
    announce(toApiError(error).message, 'error')

  return {
    add: useMutation({
      mutationFn: (body: AddCartItemBody) => addCartItem(body),
      onSuccess,
    }),

    update: useMutation({
      mutationFn: (body: AddCartItemBody) => updateCartItem(body),
      onMutate: async (body) => {
        await queryClient.cancelQueries({ queryKey: key })
        const previous = queryClient.getQueryData<Cart>(key)
        if (previous) {
          queryClient.setQueryData<Cart>(key, {
            ...previous,
            items: previous.items.map((item) =>
              item.nftId === body.nftId && item.edition === body.edition
                ? { ...item, quantity: body.quantity }
                : item,
            ),
          })
        }
        return { previous }
      },
      onError: (error, _body, context) => {
        queryClient.setQueryData(key, context?.previous)
        onError(error)
      },
      onSuccess,
      onSettled: () => queryClient.invalidateQueries({ queryKey: key }),
    }),
    remove: useMutation({
      mutationFn: ({ nftId, edition }: { nftId: string; edition: string }) =>
        removeCartItem(nftId, edition),
      onSuccess,
      onError,
    }),
    applyCoupon: useMutation({ mutationFn: applyCoupon, onSuccess }),
    removeCoupon: useMutation({ mutationFn: removeCoupon, onSuccess, onError }),
    acceptPrices: useMutation({ mutationFn: acceptPrices, onSuccess, onError }),
  }
}
