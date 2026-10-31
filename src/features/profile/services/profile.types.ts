export type Profile = {
  id: string
  displayName: string
  username: string
  email: string
  ensName: string
  ensSuffix: string
  walletAlias: string
  avatarUrl?: string
}

export type UpdateProfileBody = Omit<Profile, 'id' | 'avatarUrl'>

export type ChangePasswordBody = {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}
