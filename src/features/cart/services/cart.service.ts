import { api } from '@/services/api'
import type { AddCartItemBody, Cart } from './cart.types'

export const getCart = (signal?: AbortSignal) =>
  api.get<Cart>('/cart', { signal }).then((r) => r.data)

export const addCartItem = (body: AddCartItemBody) =>
  api.post<Cart>('/cart/items', body).then((r) => r.data)

export const updateCartItem = (body: AddCartItemBody) =>
  api.patch<Cart>('/cart/items', body).then((r) => r.data)

export const removeCartItem = (nftId: string, edition: string) =>
  api
    .delete<Cart>('/cart/items', { params: { nftId, edition } })
    .then((r) => r.data)

export const applyCoupon = (code: string) =>
  api.post<Cart>('/cart/coupon', { code }).then((r) => r.data)

export const removeCoupon = () =>
  api.delete<Cart>('/cart/coupon').then((r) => r.data)

export const acceptPrices = () =>
  api.post<Cart>('/cart/accept-prices').then((r) => r.data)
