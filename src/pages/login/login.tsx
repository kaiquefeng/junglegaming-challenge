import { AuthModal, MobileAuth } from '@/features/authentication'
import { useIsDesktop } from '@/hooks/use-media-query'

export function LoginPage() {
  return useIsDesktop() ? (
    <AuthModal mode="login" />
  ) : (
    <MobileAuth mode="login" />
  )
}
