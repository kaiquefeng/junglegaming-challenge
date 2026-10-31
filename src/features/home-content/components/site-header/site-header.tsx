import { Link, useRouter } from '@tanstack/react-router'
import { LogIn, LogOut, Menu, Search, ShoppingCart } from 'lucide-react'
import { Badge } from '@/components/badge'
import { Button } from '@/components/button'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/navigation-menu'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/sheet'
import { Skeleton } from '@/components/skeleton'
import { useLogout, useSession } from '@/features/authentication'
import { useCart } from '@/features/cart'
import { useSiteHeader } from '../../hooks/use-home-content'

const navLinkClass =
  'rounded-none border-b-2 border-transparent px-0 py-3 text-base font-medium hover:bg-transparent focus:bg-transparent data-[active=true]:border-primary data-[active=true]:bg-transparent data-[active=true]:text-highlight'

export function SiteHeader() {
  const { data } = useSiteHeader()
  const router = useRouter()
  const { user, isAuthenticated } = useSession()
  const { data: cart } = useCart()
  const logout = useLogout()
  const cartCount = cart?.count ?? 0

  const here = router.state.location
  const loginRedirect = /^\/(login|signup)/.test(here.pathname)
    ? undefined
    : here.href

  function focusSearch() {
    router.navigate({ to: '/' }).then(() => {
      document.getElementById('catalog-search')?.focus()
    })
  }

  return (
    <header className="border-b">
      <div className="mx-auto flex h-[68px] w-full max-w-[1200px] items-center justify-between gap-4 px-4 xl:px-0">
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Abrir menu"
              >
                <Menu aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-background">
              <SheetTitle className="px-4 pt-4 font-bold">
                {data?.brand ?? 'KURIO'}
              </SheetTitle>
              <nav
                aria-label="Principal (mobile)"
                className="flex flex-col px-4"
              >
                {data?.nav.map((item, index) => (
                  <SheetClose asChild key={item.href}>
                    <a
                      href={item.href}
                      aria-current={index === 0 ? 'page' : undefined}
                      className="py-3 text-base aria-[current=page]:text-highlight"
                    >
                      {item.label}
                    </a>
                  </SheetClose>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
          <a href="/" className="text-sm font-bold tracking-wider">
            {data?.brand ?? 'KURIO'}
          </a>
        </div>

        {!data ? (
          <Skeleton className="hidden h-6 w-80 md:block" />
        ) : (
          <NavigationMenu
            viewport={false}
            className="hidden md:flex"
            aria-label="Principal"
          >
            <NavigationMenuList className="gap-10">
              {data.nav.map((item, index) => (
                <NavigationMenuItem key={item.href}>
                  <NavigationMenuLink
                    asChild
                    active={index === 0}
                    className={navLinkClass}
                  >
                    <a
                      href={item.href}
                      aria-current={index === 0 ? 'page' : undefined}
                    >
                      {item.label}
                    </a>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        )}

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Buscar"
            onClick={focusSearch}
          >
            <Search aria-hidden="true" />
          </Button>
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="relative"
            aria-label={`Carrinho, ${cartCount} itens`}
          >
            <Link to="/cart">
              <ShoppingCart aria-hidden="true" />
              {cartCount > 0 && (
                <Badge
                  aria-hidden="true"
                  className="absolute -top-0.5 -right-0.5 h-4 min-w-4 rounded-full px-1 text-[10px]"
                >
                  {cartCount}
                </Badge>
              )}
            </Link>
          </Button>
          {isAuthenticated ? (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link to="/profile" aria-label="Meu perfil">
                  {user?.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt=""
                      className="size-6 rounded-full object-cover"
                    />
                  ) : null}
                  <span className="max-w-[120px] truncate">
                    {user?.displayName ?? 'Perfil'}
                  </span>
                </Link>
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => logout.mutate()}
                disabled={logout.isPending}
              >
                <LogOut aria-hidden="true" />
                Sair
              </Button>
            </>
          ) : (
            <Button asChild size="sm" className="font-bold">
              <Link to="/login" search={{ redirect: loginRedirect }}>
                <LogIn aria-hidden="true" />
                Entrar
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
