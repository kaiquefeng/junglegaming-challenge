import axios from 'axios'
import {
  getGuestId,
  getToken,
  notifySessionExpired,
} from '@/features/authentication/session'
import { toApiError } from './api-error'

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
  (response) => response,
  (error: unknown) => {
    const apiError = toApiError(error)

    if (apiError.status === 401 && getToken()) notifySessionExpired()
    return Promise.reject(apiError)
  },
)
