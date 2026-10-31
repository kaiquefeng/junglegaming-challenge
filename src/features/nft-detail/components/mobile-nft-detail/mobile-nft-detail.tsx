import { useRouter } from '@tanstack/react-router'
import {
  ChevronLeft,
  Heart,
  Minus,
  Plus,
  ShoppingCart,
  Star,
} from 'lucide-react'
import { Skeleton } from '@/components/skeleton'
import { formatEth, mulEth } from '@/lib/eth'
import { cn } from '@/lib/utils'
import { useNftPurchase } from '../../hooks/use-nft-purchase'
import { NftDetailError } from '../nft-detail-state/nft-detail-state'

export function MobileNftDetail({ nftId }: { nftId: string }) {
  const router = useRouter()
  const purchase = useNftPurchase(nftId)
  const { detail, query } = purchase

  if (query.isError)
    return (
      <NftDetailError error={query.error} onRetry={() => query.refetch()} />
    )

  const total = detail ? mulEth(detail.price, purchase.quantity) : '0'

  return (
    <div
      className="relative flex min-h-screen flex-col pb-[164px]"
      aria-busy={query.isPending}
    >
      <div className="relative z-0 -mb-[114px] flex h-[506px] flex-col gap-2 bg-[linear-gradient(138deg,#241612_12%,#2f1d15_107%)] px-7 pt-6">
        <div className="flex items-center justify-between">
          <button
            type="button"
            aria-label="Voltar"
            onClick={() => router.history.back()}
            className="flex size-[35px] items-center justify-center rounded-full border border-border bg-[#2f1d15] text-highlight"
          >
            <ChevronLeft aria-hidden="true" className="size-5" />
          </button>
          <button
            type="button"
            aria-label={
              purchase.isFavorite ? 'Remover dos favoritos' : 'Favoritar'
            }
            aria-pressed={purchase.isFavorite}
            onClick={purchase.toggleFavorite}
            className="flex size-[35px] items-center justify-center rounded-full border border-border bg-[#2f1d15] text-highlight"
          >
            <Heart
              aria-hidden="true"
              className={cn('size-4', purchase.isFavorite && 'fill-highlight')}
            />
          </button>
        </div>
        {detail ? (
          <img
            src={detail.images[0]?.src}
            alt={detail.images[0]?.alt ?? detail.name}
            className="h-[356px] w-full rounded-3xl object-cover"
          />
        ) : (
          <Skeleton className="h-[356px] w-full rounded-3xl" />
        )}
      </div>

      <section className="relative z-10 flex flex-col gap-3 rounded-t-[31px] bg-card px-6 pt-8 pb-6">
        {detail ? (
          <>
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold">{detail.name}</h1>
              <p className="flex items-center gap-1.5 rounded-full border border-primary px-2 py-[5px] text-sm">
                <Star
                  aria-hidden="true"
                  className="size-3.5 fill-highlight text-highlight"
                />
                <span className="font-medium">4.8</span>
                <span className="text-muted-foreground">
                  ({detail.reviews})
                </span>
              </p>
            </div>
            <p className="text-sm leading-6 text-muted-foreground">
              {detail.summary}
            </p>
            <div className="flex flex-col gap-2">
              <h2 id="m-edition" className="text-[15px] font-bold">
                Edição:
              </h2>
              <ul aria-labelledby="m-edition" className="flex flex-wrap gap-3">
                {detail.editions.map((edition) => {
                  const active = edition.id === purchase.edition?.id
                  return (
                    <li key={edition.id}>
                      <button
                        type="button"
                        disabled={edition.available === 0}
                        aria-pressed={active}
                        onClick={() => purchase.selectEdition(edition.id)}
                        className={cn(
                          'flex h-7 items-center justify-center rounded-full border border-border px-2 text-sm text-muted-foreground disabled:line-through disabled:opacity-50',
                          active && 'border-primary font-medium text-highlight',
                        )}
                      >
                        {edition.id}
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
            <div className="flex flex-col gap-3 text-[15px] text-[#b39463]">
              <p>ID do token: {detail.tokenId}</p>
              <p>Coleção: {detail.collectionName}</p>
              <p>Atributos: {detail.attributes}</p>
            </div>
          </>
        ) : (
          <div className="flex flex-col gap-3">
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-8 w-1/2" />
          </div>
        )}
      </section>

      <div className="fixed inset-x-0 bottom-0 z-40 flex flex-col gap-5 rounded-t-[40px] bg-card px-6 pt-5 pb-9 shadow-[0_0_10px_rgba(10,6,4,0.45)]">
        <div className="flex items-center justify-between">
          <fieldset className="flex items-center gap-2 min-w-0 border-0 p-0">
            <legend className="sr-only">Quantidade</legend>
            <span className="text-[15px] font-medium text-muted-foreground">
              Qtd.
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label="Diminuir quantidade"
                disabled={purchase.quantity <= 1}
                onClick={purchase.decrease}
                className="flex h-[30px] w-5 items-center justify-center rounded-full bg-primary text-primary-foreground disabled:opacity-50"
              >
                <Minus aria-hidden="true" className="size-4" />
              </button>
              <span className="text-lg font-medium" aria-live="polite">
                {purchase.quantity}
              </span>
              <button
                type="button"
                aria-label="Aumentar quantidade"
                disabled={purchase.quantity >= purchase.maxQuantity}
                onClick={purchase.increase}
                className="flex h-[30px] w-5 items-center justify-center rounded-full bg-primary text-primary-foreground disabled:opacity-50"
              >
                <Plus aria-hidden="true" className="size-4" />
              </button>
            </div>
          </fieldset>
          <p className="text-xl font-bold text-highlight" aria-live="polite">
            {formatEth(total)} ETH
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            disabled={!purchase.canBuy || purchase.isAdding}
            onClick={purchase.buyNow}
            className="h-[60px] w-[196px] rounded-[40px] bg-[linear-gradient(100deg,#d28a4c_4%,rgba(210,138,76,0.8)_122%)] text-base font-bold text-primary-foreground disabled:opacity-50"
          >
            Comprar NFT
          </button>
          <button
            type="button"
            aria-label="Adicionar ao carrinho"
            disabled={!purchase.canBuy || purchase.isAdding}
            onClick={purchase.addToCart}
            className="flex size-[60px] items-center justify-center rounded-full border border-border bg-[#2f1d15] text-highlight disabled:opacity-50"
          >
            <ShoppingCart aria-hidden="true" className="size-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
