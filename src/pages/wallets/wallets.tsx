import { AccountSidebar } from '@/features/profile'
import { WalletsForm } from '@/features/wallets'

export function WalletsPage() {
  return (
    <div className="flex flex-col gap-7 px-4 py-8 md:p-0 lg:flex-row">
      <AccountSidebar active="wallets" />
      <WalletsForm />
    </div>
  )
}
