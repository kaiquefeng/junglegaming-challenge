import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { useCallback, useMemo } from 'react'
import { userKey, useSession } from '@/features/authentication'
import { announce } from '@/features/realtime'
import { toApiError } from '@/services/api-error'
import {
  addFavorite,
  type FavoritesResponse,
  getFavorites,
  removeFavorite,
} from '../services/favorites.service'

export function useFavorites() {
  const { user, isAuthenticated } = useSession()
  const queryClient = useQueryClient()
  const router = useRouter()
  const queryKey = userKey(user?.id, 'favorites')

  const query = useQuery({
    queryKey,
    queryFn: ({ signal }) => getFavorites(signal),
    enabled: isAuthenticated && Boolean(user),
    staleTime: 10_000,
  })

  const mutation = useMutation({
    mutationFn: ({ nftId, active }: { nftId: string; active: boolean }) =>
      active ? addFavorite(nftId) : removeFavorite(nftId),
    onMutate: async ({ nftId, active }) => {
      await queryClient.cancelQueries({ queryKey })
      const previous = queryClient.getQueryData<FavoritesResponse>(queryKey)
      const ids = new Set(previous?.ids ?? [])
      if (active) ids.add(nftId)
      else ids.delete(nftId)
      queryClient.setQueryData<FavoritesResponse>(queryKey, { ids: [...ids] })
      return { previous }
    },
    onError: (error, _vars, context) => {
      queryClient.setQueryData(queryKey, context?.previous)
      announce(
        `Não foi possível atualizar os favoritos: ${toApiError(error).message}`,
        'error',
      )
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  })

  const ids = useMemo(() => new Set(query.data?.ids ?? []), [query.data])

  const toggle = useCallback(
    (nftId: string) => {
      if (!isAuthenticated) {
        router.navigate({
          to: '/login',
          search: { redirect: router.state.location.href },
        })
        return
      }
      mutation.mutate({ nftId, active: !ids.has(nftId) })
    },
    [ids, isAuthenticated, mutation, router],
  )

  return { ids, isFavorite: (nftId: string) => ids.has(nftId), toggle }
}
