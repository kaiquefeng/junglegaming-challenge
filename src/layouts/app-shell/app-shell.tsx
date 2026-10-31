import { Outlet } from '@tanstack/react-router'
import { MobileTabBar } from '@/components/mobile-tab-bar'
import { SiteFooter, SiteHeader } from '@/features/home-content'
import { useIsDesktop } from '@/hooks/use-media-query'

export function AppShell() {
  const isDesktop = useIsDesktop()

  // Abaixo de `md` o Figma usa telas próprias (tab bar, sem header/rodapé):
  // as views mobile ocupam a largura toda e cuidam do próprio espaçamento.
  return (
    <div className="flex min-h-screen flex-col">
      {isDesktop && <SiteHeader />}
      <main className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col gap-0 pb-[84px] md:gap-24 md:px-4 md:py-8 md:pb-8 xl:px-0">
        <Outlet />
      </main>
      {isDesktop ? <SiteFooter /> : <MobileTabBar />}
    </div>
  )
}
