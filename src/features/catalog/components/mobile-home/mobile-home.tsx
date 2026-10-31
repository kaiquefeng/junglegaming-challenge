import { Link } from '@tanstack/react-router'
import { ArrowRight, Heart, Search, SlidersHorizontal } from 'lucide-react'
import { Skeleton } from '@/components/skeleton'
import { useFavorites } from '@/features/favorites'
import { formatEth } from '@/lib/eth'
import { cn } from '@/lib/utils'
import { useNfts } from '../../hooks/use-catalog'
import type { Nft, NftTab } from '../../services/catalog.types'

const tabs: { value: NftTab; label: string }[] = [
  { value: 'all', label: 'Todos os NFTs' },
  { value: 'new', label: 'Novos lançamentos' },
  { value: 'trending', label: 'Em alta' },
]

type MobileHomeProps = {
  tab: NftTab
  q?: string
  onChange: (patch: { tab?: NftTab; q?: string }) => void
}

function ProductCard({
  nft,
  favorite,
  onToggle,
}: {
  nft: Nft
  favorite: boolean
  onToggle: () => void
}) {
  return (
    <article className="flex flex-col gap-2">
      <div className="relative flex h-[200px] items-center justify-center overflow-hidden rounded-[20px] bg-[linear-gradient(140deg,#241612_12%,#2f1d15_107%)]">
        <Link
          to="/nft/$nftId"
          params={{ nftId: nft.id }}
          tabIndex={-1}
          aria-hidden="true"
        >
          <img
            src={nft.image}
            alt={nft.imageAlt}
            loading="lazy"
            className={cn(
              'size-[168px] rounded-2xl object-cover',
              nft.soldOut && 'opacity-50',
            )}
          />
        </Link>
        <button
          type="button"
          aria-pressed={favorite}
          aria-label={
            favorite
              ? `Remover ${nft.name} dos favoritos`
              : `Favoritar ${nft.name}`
          }
          onClick={onToggle}
          className="absolute top-3 right-3 flex size-7 items-center justify-center rounded-full bg-background/70 text-highlight"
        >
          <Heart
            aria-hidden="true"
            className={cn('size-3.5', favorite && 'fill-highlight')}
          />
        </button>
        {nft.previousPrice && (
          <span className="absolute top-4 left-0 bg-primary px-2 py-1.5 text-[13px] font-medium text-primary-foreground">
            OFERTA
          </span>
        )}
      </div>
      <div className="pl-2">
        <h3 className="text-[15px] font-normal">
          <Link to="/nft/$nftId" params={{ nftId: nft.id }}>
            {nft.name}
          </Link>
        </h3>
        <p className="font-bold text-highlight">
          {formatEth(nft.price)} ETH
          {nft.soldOut && (
            <span className="ml-2 text-xs font-normal text-muted-foreground">
              Esgotado
            </span>
          )}
        </p>
      </div>
    </article>
  )
}

export function MobileHome({ tab, q, onChange }: MobileHomeProps) {
  const { data, isPending, isError, refetch } = useNfts({
    tab,
    sort: 'recent',
    page: 1,
    q,
  })
  const favorites = useFavorites()
  const items = data?.items ?? []
  const columns: Nft[][] = [
    items.filter((_, i) => i % 2 === 0),
    items.filter((_, i) => i % 2 === 1),
  ]

  return (
    <div className="flex flex-col gap-4 px-6 pt-10">
      <div className="flex gap-2.5">
        <label className="flex h-[45px] flex-1 items-center gap-2 rounded-[10px] bg-card px-3 text-sm font-bold text-[#b39463]">
          <Search aria-hidden="true" className="size-[22px] shrink-0" />
          <input
            type="search"
            defaultValue={q}
            onChange={(event) =>
              onChange({ q: event.target.value.trim() || undefined })
            }
            placeholder="Explorar coleções"
            aria-label="Explorar coleções"
            className="w-full min-w-0 bg-transparent outline-none placeholder:text-[#b39463]"
          />
        </label>
        <button
          type="button"
          aria-label="Filtros"
          className="flex size-[45px] items-center justify-center rounded-[14px] bg-[linear-gradient(137deg,rgba(210,138,76,0.45)_25%,#d28a4c_100%)]"
        >
          <SlidersHorizontal aria-hidden="true" className="size-[22px]" />
        </button>
      </div>

      <section className="flex h-[190px] items-center gap-2 overflow-hidden rounded-xl bg-[linear-gradient(120deg,#38220f,#241612)] p-4">
        <div className="flex flex-1 flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <p className="text-xs font-medium">Bem-vindo à Kurio</p>
            <h1 className="text-lg leading-[29px] font-bold">
              SEJA DONO DA
              <br />
              CULTURA DIGITAL
            </h1>
            <p className="text-xs leading-[18px] text-muted-foreground">
              Descubra NFTs selecionados de criadores do mundo todo.
            </p>
          </div>
          <a
            href="#catalogo"
            className="flex items-center gap-2 text-xs font-bold text-highlight"
          >
            EXPLORAR
            <ArrowRight aria-hidden="true" className="size-4" />
          </a>
        </div>
        <div className="relative size-[138px] shrink-0">
          <img
            src="/images/nfts/emerald-ape.webp"
            alt=""
            className="size-[138px] rounded-2xl object-cover"
          />
          <img
            src="/images/nfts/sage-nomad.webp"
            alt=""
            className="absolute bottom-0 left-3.5 size-[58px] rounded-2xl border-2 border-card object-cover"
          />
        </div>
      </section>

      <div
        role="tablist"
        aria-label="Filtrar NFTs"
        className="flex items-start gap-4 text-sm"
      >
        {tabs.map((item) => (
          <button
            key={item.value}
            role="tab"
            type="button"
            aria-selected={item.value === tab}
            onClick={() => onChange({ tab: item.value })}
            className={cn(
              'pb-1',
              item.value === tab &&
                'border-b-2 border-highlight font-bold text-highlight',
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div id="catalogo" aria-busy={isPending}>
        {isPending && (
          <div className="flex justify-between gap-4">
            <span role="status" className="sr-only">
              Carregando NFTs
            </span>
            {[0, 1].map((column) => (
              <div
                key={column}
                className={cn(
                  'flex w-[175px] flex-col gap-6',
                  column === 1 && 'pt-8',
                )}
              >
                {[0, 1].map((row) => (
                  <Skeleton
                    key={row}
                    className="h-[250px] w-full rounded-[20px]"
                  />
                ))}
              </div>
            ))}
          </div>
        )}
        {isError && (
          <p role="alert" className="py-6 text-muted-foreground">
            Não foi possível carregar os NFTs.{' '}
            <button
              type="button"
              onClick={() => refetch()}
              className="text-highlight underline"
            >
              Tentar novamente
            </button>
          </p>
        )}
        {!isPending && !isError && items.length === 0 && (
          <p className="py-6 text-muted-foreground">Nenhum NFT encontrado.</p>
        )}
        {!isPending && !isError && items.length > 0 && (
          <div className="flex justify-between gap-4">
            {columns.map((column, index) => (
              <ul
                // biome-ignore lint/suspicious/noArrayIndexKey: duas colunas fixas
                key={index}
                className={cn(
                  'flex w-[175px] flex-col gap-6',
                  index === 1 && 'pt-8',
                )}
              >
                {column.map((nft) => (
                  <li key={nft.id}>
                    <ProductCard
                      nft={nft}
                      favorite={favorites.isFavorite(nft.id)}
                      onToggle={() => favorites.toggle(nft.id)}
                    />
                  </li>
                ))}
              </ul>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
