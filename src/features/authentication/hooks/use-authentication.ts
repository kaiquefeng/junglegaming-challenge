import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { useCallback } from 'react'
import {
  getSession,
  login,
  logout,
  register,
} from '../services/authentication.service'
import type { AuthResponse } from '../services/authentication.types'
import { setToken, useToken } from '../session'

export const sessionQueryKey = (token: string | null) =>
  ['session', token] as const

export const userKey = (userId: string | undefined, ...parts: unknown[]) =>
  ['user', userId ?? 'anonymous', ...parts] as const

export function useSession() {
  const token = useToken()
  const query = useQuery({
    queryKey: sessionQueryKey(token),
    queryFn: ({ signal }) => getSession(signal),
    enabled: Boolean(token),
    staleTime: 60_000,
    retry: false,
  })
  return {
    token,
    user: token ? query.data?.user : undefined,
    isAuthenticated: Boolean(token),
    isLoading: Boolean(token) && query.isPending,
    expiresAt: query.data?.expiresAt,
  }
}

export function useResetSession() {
  const queryClient = useQueryClient()
  return useCallback(
    async (token: string | null) => {
      await queryClient.cancelQueries()
      queryClient.clear()
      setToken(token)
    },
    [queryClient],
  )
}

function useAuthSuccess() {
  const queryClient = useQueryClient()
  const reset = useResetSession()
  return async (data: AuthResponse) => {
    await reset(data.token)
    queryClient.setQueryData(sessionQueryKey(data.token), {
      user: data.user,
      expiresAt: data.expiresAt,
    })
  }
}

export function useLogin() {
  const onSuccess = useAuthSuccess()
  return useMutation({ mutationFn: login, onSuccess })
}

export function useRegister() {
  const onSuccess = useAuthSuccess()
  return useMutation({ mutationFn: register, onSuccess })
}

export function useLogout() {
  const reset = useResetSession()
  const router = useRouter()
  return useMutation({
    mutationFn: logout,

    onSettled: async () => {
      await reset(null)
      await router.navigate({ to: '/' })
    },
  })
}
