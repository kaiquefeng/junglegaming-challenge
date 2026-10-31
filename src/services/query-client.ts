import { QueryClient } from '@tanstack/react-query'
import { ApiError } from './api-error'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        if (error instanceof ApiError && error.status && error.status < 500)
          return false
        return failureCount < 2
      },
      retryDelay: (attempt) => Math.min(500 * 2 ** attempt, 4000),
    },
    mutations: { retry: false },
  },
})
