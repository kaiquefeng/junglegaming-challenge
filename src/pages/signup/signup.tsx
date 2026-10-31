import { AuthModal, MobileAuth } from '@/features/authentication'
import { useIsDesktop } from '@/hooks/use-media-query'

export function SignupPage() {
  return useIsDesktop() ? (
    <AuthModal mode="signup" />
  ) : (
    <MobileAuth mode="signup" />
  )
}
