import { Link } from '@tanstack/react-router'
import { Heart, Home, ScanLine, ShoppingCart, User } from 'lucide-react'

const iconClass = 'size-6'
const itemClass =
  'flex size-11 items-center justify-center text-[#7a5030] aria-[current=page]:text-primary'

export function MobileTabBar() {
  return (
    <nav
      aria-label="Navegação principal"
      className="fixed inset-x-0 bottom-0 z-40 flex h-[84px] items-start justify-between rounded-t-[32px] bg-card px-8 pt-6 shadow-[0_0_10px_rgba(10,6,4,0.45)] md:hidden"
    >
      <div className="flex gap-6">
        <Link to="/" aria-label="Início" className={itemClass}>
          <Home aria-hidden="true" className={iconClass} />
        </Link>
        <button type="button" aria-label="Favoritos" className={itemClass}>
          <Heart aria-hidden="true" className={iconClass} />
        </button>
      </div>
      <button
        type="button"
        aria-label="Escanear"
        className="absolute -top-8 left-1/2 flex size-16 -translate-x-1/2 items-center justify-center rounded-full border-[6px] border-background bg-[linear-gradient(137deg,#d28a4c_25%,rgba(210,138,76,0.6)_100%)] text-background"
      >
        <ScanLine aria-hidden="true" className="size-6" />
      </button>
      <div className="flex gap-6">
        <Link to="/cart" aria-label="Carrinho" className={itemClass}>
          <ShoppingCart aria-hidden="true" className={iconClass} />
        </Link>
        <Link to="/profile" aria-label="Perfil" className={itemClass}>
          <User aria-hidden="true" className={iconClass} />
        </Link>
      </div>
    </nav>
  )
}
