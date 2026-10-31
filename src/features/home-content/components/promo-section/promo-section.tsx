import { PromoBanner } from '@/components/promo-banner'
import { Skeleton } from '@/components/skeleton'
import { usePromos } from '../../hooks/use-home-content'

export function PromoSection() {
  const { data, isPending, isError } = usePromos()

  if (isError) return null

  return (
    <section aria-label="Destaques" className="grid gap-8 md:grid-cols-2">
      {isPending
        ? Array.from({ length: 2 }, (_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: placeholders estáticos
            <Skeleton key={i} className="h-[220px] rounded-xl" />
          ))
        : data.map((promo) => (
            <PromoBanner
              key={promo.id}
              title={promo.title}
              description={promo.description}
              ctaLabel={promo.cta.label}
              ctaHref={promo.cta.href}
              image={promo.image}
              imageAlt={promo.imageAlt}
              className="min-h-[220px]"
            />
          ))}
    </section>
  )
}
