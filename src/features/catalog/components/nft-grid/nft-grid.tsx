import { NftCard } from '@/components/nft-card'
import { Skeleton } from '@/components/skeleton'
import type { NftGridProps } from './nft-grid.types'

const gridClass =
  'grid grid-cols-1 gap-x-8 gap-y-10 min-[480px]:grid-cols-2 xl:grid-cols-3'

export function NftGrid({ items, isLoading, isError, onRetry }: NftGridProps) {
  if (isLoading) {
    return (
      <div className={gridClass} aria-busy="true">
        <span className="sr-only" role="status">
          Carregando NFTs
        </span>
        {Array.from({ length: 6 }, (_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: placeholders estáticos
          <div key={i} className="flex flex-col gap-2">
            <Skeleton className="aspect-square w-full rounded-none" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-5 w-1/3" />
          </div>
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <p role="alert" className="py-10 text-muted-foreground">
        Não foi possível carregar os NFTs.{' '}
        <button
          type="button"
          onClick={onRetry}
          className="text-highlight underline"
        >
          Tentar novamente
        </button>
      </p>
    )
  }

  if (items.length === 0) {
    return (
      <p className="py-10 text-muted-foreground">
        Nenhum NFT encontrado para os filtros selecionados.
      </p>
    )
  }

  return (
    <ul className={gridClass}>
      {items.map((nft) => (
        <li key={nft.id}>
          <NftCard
            name={nft.name}
            price={nft.price}
            previousPrice={nft.previousPrice}
            currency={nft.currency}
            image={nft.image}
            imageAlt={nft.imageAlt}
          />
        </li>
      ))}
    </ul>
  )
}
