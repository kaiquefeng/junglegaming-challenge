import { api } from '@/services/api'
import type {
  ChangePasswordBody,
  Profile,
  UpdateProfileBody,
} from './profile.types'

export const getProfile = (signal?: AbortSignal) =>
  api.get<Profile>('/profile', { signal }).then((r) => r.data)

export const updateProfile = (body: UpdateProfileBody) =>
  api.patch<Profile>('/profile', body).then((r) => r.data)

export const uploadAvatar = (dataUrl: string) =>
  api.post<Profile>('/profile/avatar', { dataUrl }).then((r) => r.data)

export const removeAvatar = () =>
  api.delete<Profile>('/profile/avatar').then((r) => r.data)

export const changePassword = (body: ChangePasswordBody) =>
  api.post('/profile/password', body).then(() => undefined)
