import { Button } from '@/components/button'
import { Skeleton } from '@/components/skeleton'
import { useHero } from '../../hooks/use-home-content'

export function HeroSection() {
  const { data, isPending, isError } = useHero()

  if (isPending) {
    return (
      <section
        aria-busy="true"
        aria-label="Carregando destaque"
        className="grid gap-8 md:grid-cols-[1fr_450px]"
      >
        <div className="flex flex-col justify-center gap-4 md:px-10">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-16 w-4/5" />
          <Skeleton className="h-10 w-36" />
        </div>
        <Skeleton className="aspect-square w-full rounded-3xl" />
      </section>
    )
  }

  if (isError) return null

  return (
    <section
      aria-labelledby="hero-title"
      className="grid items-center gap-8 md:grid-cols-[1fr_450px]"
    >
      <div className="flex flex-col items-start gap-5 md:px-10">
        <p className="text-sm font-medium">{data.eyebrow}</p>
        <h1
          id="hero-title"
          className="text-4xl font-bold uppercase leading-[1.4] tracking-wide md:text-5xl"
        >
          {data.title}
        </h1>
        <p className="max-w-xl text-sm leading-6 text-muted-foreground">
          {data.description}
        </p>
        <Button
          asChild
          size="lg"
          className="mt-3 h-10 px-7 font-bold uppercase"
        >
          <a href={data.cta.href}>{data.cta.label}</a>
        </Button>
        <div
          aria-hidden="true"
          className="mt-10 flex gap-2 self-center md:self-start"
        >
          {Array.from({ length: data.slides }, (_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: indicadores decorativos
            <span key={i} className="size-2 rounded-full bg-primary" />
          ))}
        </div>
      </div>
      <img
        src={data.image}
        alt={data.imageAlt}
        fetchPriority="high"
        className="aspect-square w-full rounded-3xl object-cover"
      />
    </section>
  )
}
