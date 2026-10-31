import { Link } from '@tanstack/react-router'
import {
  Download,
  Heart,
  LogOut,
  MapPin,
  ShoppingCart,
  TrendingUp,
  TriangleAlert,
  User,
} from 'lucide-react'
import { Separator } from '@/components/separator'
import { cn } from '@/lib/utils'
import type { AccountSidebarProps } from './account-sidebar.types'

const items = [
  { label: 'Dados do perfil', icon: User, section: 'profile', to: '/profile' },
  { label: 'Carteiras', icon: MapPin, section: 'wallets', to: '/wallets' },
  { label: 'Atividade', icon: ShoppingCart },
  { label: 'Lista de interesse', icon: Heart },
  { label: 'Ofertas', icon: TrendingUp },
  { label: 'Arquivos baixados', icon: Download },
  { label: 'Suporte', icon: TriangleAlert },
] as const

const rowClass =
  'flex h-[45px] items-center gap-3 border-l-[6px] border-transparent px-4 text-[15px] text-highlight'

export function AccountSidebar({ active }: AccountSidebarProps) {
  return (
    <nav
      aria-label="Minha conta"
      className="flex w-full flex-col bg-card py-2 lg:w-[310px] lg:shrink-0 lg:self-start"
    >
      <p className="p-2.5 text-lg font-bold">Meu perfil</p>
      {items.map((item) => {
        const content = (
          <>
            <item.icon aria-hidden="true" className="size-[18px] shrink-0" />
            {item.label}
          </>
        )

        if ('to' in item) {
          const isActive = item.section === active
          return (
            <Link
              key={item.label}
              to={item.to}
              aria-current={isActive ? 'page' : undefined}
              className={cn(rowClass, isActive && 'border-primary')}
            >
              {content}
            </Link>
          )
        }

        return (
          <button key={item.label} type="button" className={rowClass}>
            {content}
          </button>
        )
      })}
      <Separator />
      <button
        type="button"
        className="flex h-10 items-center gap-2 px-4 text-[15px] font-bold text-highlight"
      >
        <LogOut aria-hidden="true" className="size-5" />
        Sair
      </button>
    </nav>
  )
}
