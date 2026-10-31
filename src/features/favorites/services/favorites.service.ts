import { api } from '@/services/api'

export type FavoritesResponse = { ids: string[] }

export const getFavorites = (signal?: AbortSignal) =>
  api.get<FavoritesResponse>('/favorites', { signal }).then((r) => r.data)

export const addFavorite = (nftId: string) =>
  api.put<FavoritesResponse>(`/favorites/${nftId}`).then((r) => r.data)

export const removeFavorite = (nftId: string) =>
  api.delete<FavoritesResponse>(`/favorites/${nftId}`).then((r) => r.data)
