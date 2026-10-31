import { AspectRatio } from '@/components/aspect-ratio'
import { Card, CardContent } from '@/components/card'
import { cn } from '@/lib/utils'
import type { ArticleCardProps } from './article-card.types'

export function ArticleCard({
  title,
  excerpt,
  publishedAt,
  dateLabel,
  readingMinutes,
  image,
  imageAlt,
  href,
  className,
}: ArticleCardProps) {
  return (
    <Card
      className={cn(
        'gap-0 overflow-hidden rounded-xl border-0 py-0 shadow-none',
        className,
      )}
    >
      <AspectRatio ratio={268 / 195}>
        <img
          src={image}
          alt={imageAlt}
          loading="lazy"
          className="size-full object-cover"
        />
      </AspectRatio>
      <CardContent className="flex flex-1 flex-col gap-3 p-4">
        <p className="text-xs text-muted-foreground">
          <time dateTime={publishedAt}>{dateLabel}</time>
          <span aria-hidden="true">{'  |  '}</span>
          <span className="sr-only">, </span>
          Leitura de {readingMinutes} min
        </p>
        <h3 className="text-base font-bold leading-snug">{title}</h3>
        <p className="text-xs text-muted-foreground">{excerpt}</p>
        <a
          href={href}
          className="mt-auto text-xs font-bold text-highlight focus-visible:outline-2 focus-visible:outline-ring"
        >
          Ler mais <span aria-hidden="true">→</span>
          <span className="sr-only"> sobre {title}</span>
        </a>
      </CardContent>
    </Card>
  )
}
