import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { sessionQueryKey, userKey, useSession } from '@/features/authentication'
import { announce } from '@/features/realtime'
import {
  changePassword,
  getProfile,
  removeAvatar,
  updateProfile,
  uploadAvatar,
} from '../services/profile.service'
import type { Profile } from '../services/profile.types'

export function useProfile() {
  const { user } = useSession()
  return useQuery({
    queryKey: userKey(user?.id, 'profile'),
    queryFn: ({ signal }) => getProfile(signal),
    enabled: Boolean(user),
    retry: false,
  })
}

export function useProfileMutations() {
  const queryClient = useQueryClient()
  const { user, token } = useSession()
  const key = userKey(user?.id, 'profile')

  const onProfile = (message: string) => (profile: Profile) => {
    queryClient.setQueryData(key, profile)

    queryClient.setQueryData(sessionQueryKey(token), (old: unknown) =>
      old && typeof old === 'object'
        ? {
            ...old,
            user: {
              ...(old as { user: object }).user,
              displayName: profile.displayName,
              username: profile.username,
              email: profile.email,
              avatarUrl: profile.avatarUrl,
            },
          }
        : old,
    )
    announce(message, 'success')
  }

  return {
    update: useMutation({
      mutationFn: updateProfile,
      onSuccess: onProfile('Perfil atualizado.'),
    }),
    uploadAvatar: useMutation({
      mutationFn: uploadAvatar,
      onSuccess: onProfile('Avatar atualizado.'),
    }),
    removeAvatar: useMutation({
      mutationFn: removeAvatar,
      onSuccess: onProfile('Avatar removido.'),
    }),
    changePassword: useMutation({
      mutationFn: changePassword,
      onSuccess: () => announce('Senha alterada.', 'success'),
    }),
  }
}
