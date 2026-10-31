import { AccountSidebar, ProfileForm } from '@/features/profile'

export function ProfilePage() {
  return (
    <div className="flex flex-col gap-7 px-4 py-8 md:p-0 lg:flex-row">
      <AccountSidebar active="profile" />
      <ProfileForm />
    </div>
  )
}
