export type User = {
  id: string
  email: string
  username: string
  displayName: string
  avatarUrl?: string
}

export type Session = {
  user: User
  expiresAt: string
}

export type AuthResponse = Session & { token: string }

export type LoginBody = { email: string; password: string }

export type RegisterBody = {
  username: string
  email: string
  password: string
  confirm: string
}
