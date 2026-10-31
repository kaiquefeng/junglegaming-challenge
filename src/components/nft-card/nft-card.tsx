import { Link } from '@tanstack/react-router'
import { Heart } from 'lucide-react'
import { AspectRatio } from '@/components/aspect-ratio'
import { Card } from '@/components/card'
import { formatEth } from '@/lib/eth'
import { cn } from '@/lib/utils'
import type { NftCardProps } from './nft-card.types'

export function NftCard({
  id,
  name,
  price,
  previousPrice,
  currency,
  image,
  imageAlt,
  soldOut,
  favorite,
  className,
}: NftCardProps) {
  return (
    <article className={cn('relative flex flex-col gap-2', className)}>
      <Card className="gap-0 rounded-none border-0 p-1 shadow-none">
        <Link
          to="/nft/$nftId"
          params={{ nftId: id }}
          tabIndex={-1}
          aria-hidden="true"
        >
          <AspectRatio ratio={1}>
            <img
              src={image}
              alt={imageAlt}
              loading="lazy"
              className={cn(
                'size-full rounded-2xl object-cover',
                soldOut && 'opacity-50',
              )}
            />
          </AspectRatio>
        </Link>
      </Card>
      {favorite && (
        <button
          type="button"
          aria-pressed={favorite.active}
          aria-label={
            favorite.active
              ? `Remover ${name} dos favoritos`
              : `Favoritar ${name}`
          }
          onClick={favorite.onToggle}
          className="absolute top-3 right-3 flex size-8 items-center justify-center rounded-full bg-background/70 text-highlight"
        >
          <Heart
            aria-hidden="true"
            className={cn('size-4', favorite.active && 'fill-highlight')}
          />
        </button>
      )}
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-normal">
          <Link
            to="/nft/$nftId"
            params={{ nftId: id }}
            className="hover:underline focus-visible:underline"
          >
            {name}
          </Link>
        </h3>
        <p className="flex items-baseline gap-2 text-base">
          <span className="font-bold text-highlight">
            {formatEth(price)} {currency}
          </span>
          {previousPrice !== undefined && (
            <s className="text-muted-foreground/70">
              <span className="sr-only">Preço anterior: </span>
              {formatEth(previousPrice)} {currency}
            </s>
          )}
          {soldOut && (
            <span className="text-xs text-muted-foreground">Esgotado</span>
          )}
        </p>
      </div>
    </article>
  )
}
