import { Heart, Minus, Plus, Search, Star } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/button'
import { NftCard } from '@/components/nft-card'
import { Separator } from '@/components/separator'
import { SocialIcon } from '@/components/social-icon'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/tabs'
import { useNfts } from '@/features/catalog/hooks/use-catalog'
import { useFavorites } from '@/features/favorites'
import { formatEth } from '@/lib/eth'
import { cn } from '@/lib/utils'
import { useNftPurchase } from '../../hooks/use-nft-purchase'
import {
  NftDetailError,
  NftDetailSkeleton,
} from '../nft-detail-state/nft-detail-state'
import type { NftDetailViewProps } from './nft-detail-view.types'

const socials = ['linkedin', 'facebook', 'twitter'] as const

function SectionHeading({ children }: { children: string }) {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-[17px] font-bold text-highlight">{children}</h2>
      <Separator />
    </div>
  )
}

export function NftDetailView({ nftId }: NftDetailViewProps) {
  const purchase = useNftPurchase(nftId)
  const { detail, query } = purchase
  const [selected, setSelected] = useState(0)
  const favorites = useFavorites()
  const related = useNfts({
    tab: 'all',
    sort: 'recent',
    page: 1,
    collection: detail?.collection,
  })

  if (query.isPending) return <NftDetailSkeleton />
  if (query.isError || !detail) {
    return (
      <NftDetailError error={query.error} onRetry={() => query.refetch()} />
    )
  }

  const relatedItems = (related.data?.items ?? [])
    .filter((item) => item.id !== detail.id)
    .slice(0, 5)

  return (
    <>
      <section className="flex flex-col gap-3" aria-label={detail.name}>
        <p className="text-[15px] font-bold">Início / Mercado</p>
        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="flex gap-7 lg:w-[573px] lg:shrink-0">
            <ul className="hidden w-[100px] shrink-0 flex-col gap-4 sm:flex">
              {detail.images.map((image, index) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: miniaturas repetidas no layout
                <li key={index}>
                  <button
                    type="button"
                    aria-label={`Ver imagem ${index + 1}`}
                    aria-current={selected === index}
                    onClick={() => setSelected(index)}
                    className={cn(
                      'block size-[100px] overflow-hidden rounded-lg border border-transparent',
                      selected === index && 'border-primary',
                    )}
                  >
                    <img
                      src={image.src}
                      alt=""
                      className="size-full object-cover"
                    />
                  </button>
                </li>
              ))}
            </ul>
            <div className="relative flex aspect-square w-full max-w-[444px] items-center justify-center rounded-md bg-card p-4">
              <img
                src={detail.images[selected]?.src}
                alt={detail.images[selected]?.alt ?? detail.name}
                className="size-full rounded-3xl object-cover"
              />
              <Search
                aria-hidden="true"
                className="absolute top-4 right-4 size-[30px] rounded-full bg-background/70 p-1.5"
              />
            </div>
          </div>

          <div className="flex min-w-0 flex-1 flex-col justify-between gap-6">
            <div className="flex flex-col gap-3">
              <h1 className="text-[28px] font-bold">{detail.name}</h1>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p
                  className="text-[22px] font-bold text-highlight"
                  aria-live="polite"
                >
                  {formatEth(detail.price)} {detail.currency}
                  {detail.previousPrice && (
                    <s className="ml-3 text-base font-normal text-muted-foreground/70">
                      <span className="sr-only">Preço anterior: </span>
                      {formatEth(detail.previousPrice)}
                    </s>
                  )}
                </p>
                <p className="flex items-center gap-1 text-[15px]">
                  <span
                    role="img"
                    aria-label={`${detail.rating} de 5 estrelas`}
                    className="flex"
                  >
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        // biome-ignore lint/suspicious/noArrayIndexKey: lista estática
                        key={i}
                        aria-hidden="true"
                        className={cn(
                          'size-[15px]',
                          i < detail.rating
                            ? 'fill-highlight text-highlight'
                            : 'fill-muted-foreground/40 text-muted-foreground/40',
                        )}
                      />
                    ))}
                  </span>
                  {detail.reviews} avaliações de colecionadores
                </p>
              </div>
              <Separator />
            </div>

            <div className="flex flex-col gap-3">
              <h2 className="text-[15px] font-bold">Sobre este NFT:</h2>
              <p className="text-sm leading-6 text-muted-foreground">
                {detail.summary}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <h2 id="edition-label" className="text-[15px] font-bold">
                Edição:
              </h2>
              <ul
                aria-labelledby="edition-label"
                className="flex flex-wrap items-center gap-1.5"
              >
                {detail.editions.map((edition) => {
                  const active = edition.id === purchase.edition?.id
                  const soldOut = edition.available === 0
                  return (
                    <li key={edition.id}>
                      <button
                        type="button"
                        disabled={soldOut}
                        aria-pressed={active}
                        onClick={() => purchase.selectEdition(edition.id)}
                        className={cn(
                          'rounded-full border border-transparent px-2 py-1 text-sm text-muted-foreground outline-none focus-visible:outline-2 focus-visible:outline-ring disabled:line-through disabled:opacity-50',
                          active &&
                            'border-highlight font-medium text-highlight',
                        )}
                      >
                        {edition.id}
                        {soldOut && (
                          <span className="sr-only"> (esgotada)</span>
                        )}
                      </button>
                    </li>
                  )
                })}
              </ul>
              {!purchase.canBuy && (
                <p role="status" className="text-sm text-destructive">
                  Todas as edições deste NFT estão esgotadas.
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <fieldset className="flex items-center gap-3 min-w-0 border-0 p-0">
                <legend className="sr-only">Quantidade</legend>
                <Button
                  size="icon"
                  className="rounded-full"
                  aria-label="Diminuir quantidade"
                  disabled={purchase.quantity <= 1}
                  onClick={purchase.decrease}
                >
                  <Minus aria-hidden="true" />
                </Button>
                <span className="w-6 text-center text-xl" aria-live="polite">
                  {purchase.quantity}
                </span>
                <Button
                  size="icon"
                  className="rounded-full"
                  aria-label="Aumentar quantidade"
                  disabled={purchase.quantity >= purchase.maxQuantity}
                  onClick={purchase.increase}
                >
                  <Plus aria-hidden="true" />
                </Button>
                {purchase.canBuy &&
                  purchase.quantity >= purchase.maxQuantity && (
                    <span className="text-xs text-muted-foreground">
                      Limite por pedido
                    </span>
                  )}
              </fieldset>
              <div className="flex gap-2">
                <Button
                  className="h-10 w-[130px] font-bold"
                  disabled={!purchase.canBuy || purchase.isAdding}
                  onClick={purchase.buyNow}
                >
                  COMPRAR
                </Button>
                <Button
                  variant="outline"
                  aria-pressed={purchase.isFavorite}
                  className="h-10 w-[130px] border-primary text-highlight"
                  onClick={purchase.toggleFavorite}
                >
                  <Heart
                    aria-hidden="true"
                    className={cn(
                      'size-5',
                      purchase.isFavorite && 'fill-highlight',
                    )}
                  />
                  {purchase.isFavorite ? 'Favorito' : 'Favoritar'}
                </Button>
              </div>
            </div>
            {purchase.canBuy && (
              <Button
                variant="ghost"
                className="self-start"
                onClick={purchase.addToCart}
              >
                Adicionar ao carrinho
              </Button>
            )}

            <div className="flex flex-col gap-3">
              <dl className="flex flex-col gap-3 text-[15px] text-[#b39463]">
                <p>ID do token: {detail.tokenId}</p>
                <p>Coleção: {detail.collectionName}</p>
                <p>Atributos: {detail.attributes}</p>
              </dl>
              <div className="flex items-center gap-2">
                <p className="text-[15px] font-bold">Compartilhar este NFT:</p>
                {socials.map((network) => (
                  <SocialIcon
                    key={network}
                    network={network}
                    className="size-4"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <Tabs defaultValue="details">
          <TabsList variant="line" className="h-auto justify-start gap-8 p-0">
            <TabsTrigger value="details" className="text-[17px]">
              Detalhes do NFT
            </TabsTrigger>
            <TabsTrigger value="reviews" className="text-[17px]">
              Avaliações de colecionadores ({detail.reviews})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="details">
            <div className="flex flex-col gap-3 pt-3 text-sm leading-6 text-muted-foreground">
              {detail.description.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              <h3 className="font-bold text-foreground">Rede:</h3>
              <p>{detail.network}</p>
              <h3 className="font-bold text-foreground">Contrato:</h3>
              <p>{detail.contract}</p>
              <h3 className="font-bold text-foreground">{detail.royalties}</h3>
              <p>{detail.address}</p>
            </div>
          </TabsContent>
          <TabsContent value="reviews">
            <p className="pt-3 text-sm text-muted-foreground">
              As avaliações detalhadas ainda não estão disponíveis nesta versão.
            </p>
          </TabsContent>
        </Tabs>
      </section>

      {relatedItems.length > 0 && (
        <section className="flex flex-col gap-8">
          <SectionHeading>Mais desta coleção</SectionHeading>
          <ul className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-5">
            {relatedItems.map((item) => (
              <li key={item.id}>
                <NftCard
                  id={item.id}
                  name={item.name}
                  price={item.price}
                  currency="ETH"
                  image={item.image}
                  imageAlt={item.imageAlt}
                  soldOut={item.soldOut}
                  favorite={{
                    active: favorites.isFavorite(item.id),
                    onToggle: () => favorites.toggle(item.id),
                  }}
                />
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  )
}
