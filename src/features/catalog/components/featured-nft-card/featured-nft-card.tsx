import { Card } from '@/components/card'
import { Skeleton } from '@/components/skeleton'
import { useFeaturedNft } from '../../hooks/use-catalog'

export function FeaturedNftCard() {
  const { data, isPending, isError } = useFeaturedNft()

  if (isPending) return <Skeleton className="h-[430px] w-full rounded-3xl" />
  if (isError) return null

  return (
    <Card className="relative gap-0 overflow-hidden rounded-3xl border-0 bg-secondary py-0 shadow-none">
      <div className="flex flex-col items-center gap-1 px-4 pt-4 pb-3">
        <p className="self-start text-xl font-bold uppercase text-highlight">
          {data.eyebrow}
        </p>
        <p className="text-lg font-bold uppercase">{data.badge}</p>
      </div>
      <img
        src={data.nft.image}
        alt={data.nft.imageAlt}
        loading="lazy"
        className="aspect-[310/366] w-full rounded-3xl object-cover"
      />
    </Card>
  )
}
