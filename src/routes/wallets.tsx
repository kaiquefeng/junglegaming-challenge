import { createFileRoute } from '@tanstack/react-router'
import { requireAuth } from '@/features/authentication'
import { WalletsPage } from '@/pages/wallets'

export const Route = createFileRoute('/wallets')({
  beforeLoad: requireAuth,
  component: WalletsPage,
})
