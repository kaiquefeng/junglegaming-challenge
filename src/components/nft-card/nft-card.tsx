import { AspectRatio } from '@/components/aspect-ratio'
import { Card } from '@/components/card'
import { cn } from '@/lib/utils'
import type { NftCardProps } from './nft-card.types'

const formatPrice = (value: number, currency: string) =>
  `${value.toFixed(2)} ${currency}`

export function NftCard({
  name,
  price,
  previousPrice,
  currency,
  image,
  imageAlt,
  className,
}: NftCardProps) {
  return (
    <article className={cn('flex flex-col gap-2', className)}>
      <Card className="gap-0 rounded-none border-0 p-1 shadow-none">
        <AspectRatio ratio={1}>
          <img
            src={image}
            alt={imageAlt}
            loading="lazy"
            className="size-full rounded-2xl object-cover"
          />
        </AspectRatio>
      </Card>
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-normal">{name}</h3>
        <p className="flex items-baseline gap-2 text-base">
          <span className="font-bold text-highlight">
            {formatPrice(price, currency)}
          </span>
          {previousPrice !== undefined && (
            <s className="text-muted-foreground/70">
              <span className="sr-only">Preço anterior: </span>
              {formatPrice(previousPrice, currency)}
            </s>
          )}
        </p>
      </div>
    </article>
  )
}
