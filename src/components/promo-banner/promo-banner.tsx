import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/button'
import { Card, CardContent } from '@/components/card'
import { cn } from '@/lib/utils'
import type { PromoBannerProps } from './promo-banner.types'

export function PromoBanner({
  title,
  description,
  ctaLabel,
  ctaHref,
  image,
  imageAlt,
  className,
}: PromoBannerProps) {
  return (
    <Card
      className={cn(
        'flex-row gap-0 overflow-hidden rounded-xl border-0 py-0 shadow-none',
        className,
      )}
    >
      <img
        src={image}
        alt={imageAlt}
        loading="lazy"
        className="w-2/5 min-w-32 rounded-r-3xl object-cover object-top"
      />
      <CardContent className="flex flex-1 flex-col items-end gap-3 p-6 text-right">
        <h3 className="text-lg font-bold leading-snug">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
        <Button asChild size="sm" className="mt-auto">
          <a href={ctaHref}>
            {ctaLabel}
            <ArrowRight aria-hidden="true" className="size-4" />
          </a>
        </Button>
      </CardContent>
    </Card>
  )
}
