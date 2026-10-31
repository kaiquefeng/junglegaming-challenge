import { useRouter } from '@tanstack/react-router'
import {
  ChevronLeft,
  Heart,
  Minus,
  Plus,
  ShoppingCart,
  Star,
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const editions = ['1/10', '1/10', '1/50', 'ABERTA']

export function MobileNftDetail() {
  const router = useRouter()
  const [quantity, setQuantity] = useState(1)

  return (
    <div className="relative flex min-h-screen flex-col pb-[164px]">
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
            aria-label="Favoritar"
            className="flex size-[35px] items-center justify-center rounded-full border border-border bg-[#2f1d15] text-highlight"
          >
            <Heart aria-hidden="true" className="size-4" />
          </button>
        </div>
        <img
          src="/images/nfts/emerald-ape.webp"
          alt="Emerald Ape #042"
          className="h-[356px] w-full rounded-3xl object-cover"
        />
      </div>

      <section className="relative z-10 flex flex-col gap-3 rounded-t-[31px] bg-card px-6 pt-8 pb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Emerald Ape #042</h1>
          <p className="flex items-center gap-1.5 rounded-full border border-primary px-2 py-[5px] text-sm">
            <Star
              aria-hidden="true"
              className="size-3.5 fill-highlight text-highlight"
            />
            <span className="font-medium">4.8</span>
            <span className="text-muted-foreground">(19)</span>
          </p>
        </div>
        <p className="text-sm leading-6 text-muted-foreground">
          Um colecionável digital 1/50 finalizado à mão da coleção Kurio
          Editions, verificado na Ethereum.
        </p>
        <div className="flex flex-col gap-2">
          <h2 className="text-[15px] font-bold">Edição:</h2>
          <ul className="flex gap-3">
            {editions.map((edition, index) => (
              <li
                // biome-ignore lint/suspicious/noArrayIndexKey: o Figma repete "1/10"
                key={index}
                aria-current={edition === '1/50'}
                className={cn(
                  'flex h-7 items-center justify-center rounded-full border border-border px-2 text-sm text-muted-foreground',
                  edition === '1/50' &&
                    'border-primary font-medium text-highlight',
                )}
              >
                {edition}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-3 text-[15px] text-[#b39463]">
          <p>ID do token: #0042</p>
          <p>Coleção: Kurio Apes</p>
          <p>Atributos: Óculos, Esmeralda, Raro</p>
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-40 flex flex-col gap-5 rounded-t-[40px] bg-card px-6 pt-5 pb-9 shadow-[0_0_10px_rgba(10,6,4,0.45)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[15px] font-medium text-muted-foreground">
              Qtd.
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label="Diminuir quantidade"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="flex h-[30px] w-5 items-center justify-center rounded-full bg-primary text-primary-foreground"
              >
                <Minus aria-hidden="true" className="size-4" />
              </button>
              <span className="text-lg font-medium">{quantity}</span>
              <button
                type="button"
                aria-label="Aumentar quantidade"
                onClick={() => setQuantity((q) => q + 1)}
                className="flex h-[30px] w-5 items-center justify-center rounded-full bg-primary text-primary-foreground"
              >
                <Plus aria-hidden="true" className="size-4" />
              </button>
            </div>
          </div>
          <p className="text-xl font-bold text-highlight">
            {(1.19 * quantity).toFixed(2)} ETH
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="h-[60px] w-[196px] rounded-[40px] bg-[linear-gradient(100deg,#d28a4c_4%,rgba(210,138,76,0.8)_122%)] text-base font-bold text-primary-foreground"
          >
            Comprar NFT
          </button>
          <button
            type="button"
            aria-label="Adicionar ao carrinho"
            className="flex size-[60px] items-center justify-center rounded-full border border-border bg-[#2f1d15] text-highlight"
          >
            <ShoppingCart aria-hidden="true" className="size-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
