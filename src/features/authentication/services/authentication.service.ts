import { api } from '@/services/api'
import type {
  AuthResponse,
  LoginBody,
  RegisterBody,
  Session,
} from './authentication.types'

export const login = (body: LoginBody) =>
  api.post<AuthResponse>('/auth/login', body).then((r) => r.data)

export const register = (body: RegisterBody) =>
  api.post<AuthResponse>('/auth/register', body).then((r) => r.data)

export const getSession = (signal?: AbortSignal) =>
  api.get<Session>('/auth/me', { signal }).then((r) => r.data)

export const logout = () => api.post('/auth/logout').then(() => undefined)
