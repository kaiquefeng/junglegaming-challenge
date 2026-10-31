import { Outlet, useRouter, useRouterState } from '@tanstack/react-router'
import { useEffect } from 'react'
import { MobileTabBar } from '@/components/mobile-tab-bar'
import { onSessionExpired, useResetSession } from '@/features/authentication'
import { SiteFooter, SiteHeader } from '@/features/home-content'
import { AnnouncerRegion, useRealtime } from '@/features/realtime'
import { useIsDesktop } from '@/hooks/use-media-query'
import { cn } from '@/lib/utils'

const TAB_BAR_PATHS = ['/', '/profile', '/wallets']

export function AppShell() {
  const isDesktop = useIsDesktop()
  const router = useRouter()
  const reset = useResetSession()
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })

  const showTabBar = !isDesktop && TAB_BAR_PATHS.includes(pathname)

  useRealtime()

  useEffect(() => {
    onSessionExpired(() => {
      const from = router.state.location.href
      reset(null).then(() =>
        router.navigate({
          to: '/login',
          search: {
            redirect: from.startsWith('/login') ? undefined : from,
            expired: true,
          },
        }),
      )
    })
    return () => onSessionExpired(null)
  }, [reset, router])

  return (
    <div className="flex min-h-screen flex-col">
      {isDesktop && <SiteHeader />}
      <main
        className={cn(
          'mx-auto flex w-full max-w-[1200px] flex-1 flex-col gap-0 md:gap-24 md:px-4 md:py-8 md:pb-8 xl:px-0',
          showTabBar && 'pb-[84px]',
        )}
      >
        <Outlet />
      </main>
      {isDesktop ? <SiteFooter /> : showTabBar && <MobileTabBar />}
      <AnnouncerRegion />
    </div>
  )
}
