import axios from 'axios'
import {
  getGuestId,
  getToken,
  notifySessionExpired,
} from '@/features/authentication/session'
import { ApiError, toApiError } from './api-error'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
  headers: { 'Content-Type': 'application/json' },

  timeout: 6000,
})

api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) config.headers.set('Authorization', `Bearer ${token}`)
  config.headers.set('X-Guest-Id', getGuestId())
  return config
})

api.interceptors.response.use(
  (response) => {
    const contentType = String(response.headers['content-type'] ?? '')
    if (contentType.includes('text/html')) {
      return Promise.reject(
        new ApiError({
          code: 'transient',
          message:
            'A API respondeu HTML em vez de JSON. Verifique se os mocks (VITE_ENABLE_MOCKS=true) ou o backend estão ativos.',
        }),
      )
    }
    return response
  },
  (error: unknown) => {
    const apiError = toApiError(error)

    if (apiError.status === 401 && getToken()) notifySessionExpired()
    return Promise.reject(apiError)
  },
)
