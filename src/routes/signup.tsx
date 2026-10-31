import { createFileRoute } from '@tanstack/react-router'
import { SignupPage } from '@/pages/signup'
import { validateAuthSearch } from './login'

export const Route = createFileRoute('/signup')({
  validateSearch: validateAuthSearch,
  component: SignupPage,
})
