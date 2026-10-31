import { createFileRoute } from '@tanstack/react-router'
import { requireAuth } from '@/features/authentication'
import { ProfilePage } from '@/pages/profile'

export const Route = createFileRoute('/profile')({
  beforeLoad: requireAuth,
  component: ProfilePage,
})
