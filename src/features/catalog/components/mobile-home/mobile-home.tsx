import { ArrowRight, Heart, Search, SlidersHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'

const tabs = ['Todos os NFTs', 'Novos lançamentos', 'Em alta']

const columns = [
  [
    {
      name: 'Emerald Ape #042',
      price: '1.19',
      image: 'emerald-ape',
      favorite: false,
    },
    {
      name: 'Ivory Baron #088',
      price: '1.79',
      image: 'neon-vessel',
      tag: 'RARO',
    },
  ],
  [
    {
      name: 'Sage Nomad #009',
      price: '1.69',
      image: 'sage-nomad',
      favorite: true,
    },
    {
      name: 'Golden Beat #207',
      price: '0.99',
      image: 'golden-beat',
      favorite: true,
    },
  ],
] as const

type Product = {
  name: string
  price: string
  image: string
  favorite?: boolean
  tag?: string
}

function ProductCard({ product }: { product: Product }) {
  return (
    <article className="flex flex-col gap-2">
      <div className="relative flex h-[200px] items-center justify-center overflow-hidden rounded-[20px] bg-[linear-gradient(140deg,#241612_12%,#2f1d15_107%)]">
        <img
          src={`/images/nfts/${product.image}.webp`}
          alt=""
          loading="lazy"
          className="size-[168px] rounded-2xl object-cover"
        />
        {product.favorite !== undefined && (
          <button
            type="button"
            aria-label={`Favoritar ${product.name}`}
            className="absolute top-3 right-3 flex size-7 items-center justify-center rounded-full bg-background/70 text-highlight"
          >
            <Heart aria-hidden="true" className="size-3.5" />
          </button>
        )}
        {product.tag && (
          <span className="absolute top-4 left-0 bg-primary px-2 py-1.5 text-[13px] font-medium text-primary-foreground">
            {product.tag}
          </span>
        )}
      </div>
      <div className="pl-2">
        <h3 className="text-[15px] font-normal">{product.name}</h3>
        <p className="font-bold text-highlight">{product.price} ETH</p>
      </div>
    </article>
  )
}

export function MobileHome() {
  return (
    <div className="flex flex-col gap-4 px-6 pt-10">
      <div className="flex gap-2.5">
        <label className="flex h-[45px] flex-1 items-center gap-2 rounded-[10px] bg-card px-3 text-sm font-bold text-[#b39463]">
          <Search aria-hidden="true" className="size-[22px] shrink-0" />
          <input
            placeholder="Explorar coleções"
            aria-label="Explorar coleções"
            className="w-full min-w-0 bg-transparent outline-none placeholder:text-[#b39463]"
          />
        </label>
        <button
          type="button"
          aria-label="Filtros"
          className="flex size-[45px] items-center justify-center rounded-[14px] bg-[linear-gradient(137deg,rgba(210,138,76,0.45)_25%,#d28a4c_100%)]"
        >
          <SlidersHorizontal aria-hidden="true" className="size-[22px]" />
        </button>
      </div>

      <section className="flex h-[190px] items-center gap-2 overflow-hidden rounded-xl bg-[linear-gradient(120deg,#38220f,#241612)] p-4">
        <div className="flex flex-1 flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <p className="text-xs font-medium">Bem-vindo à Kurio</p>
            <h1 className="text-lg leading-[29px] font-bold">
              SEJA DONO DA
              <br />
              CULTURA DIGITAL
            </h1>
            <p className="text-xs leading-[18px] text-muted-foreground">
              Descubra NFTs selecionados de criadores do mundo todo.
            </p>
          </div>
          <a
            href="#catalogo"
            className="flex items-center gap-2 text-xs font-bold text-highlight"
          >
            EXPLORAR
            <ArrowRight aria-hidden="true" className="size-4" />
          </a>
        </div>
        <div className="relative size-[138px] shrink-0">
          <img
            src="/images/nfts/emerald-ape.webp"
            alt=""
            className="size-[138px] rounded-2xl object-cover"
          />
          <img
            src="/images/nfts/sage-nomad.webp"
            alt=""
            className="absolute bottom-0 left-3.5 size-[58px] rounded-2xl border-2 border-card object-cover"
          />
        </div>
      </section>

      <div role="tablist" className="flex items-start gap-4 text-sm">
        {tabs.map((tab, index) => (
          <button
            key={tab}
            role="tab"
            type="button"
            aria-selected={index === 0}
            className={cn(
              'pb-1',
              index === 0 &&
                'border-b-2 border-highlight font-bold text-highlight',
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      <div id="catalogo" className="flex justify-between gap-4">
        {columns.map((column, index) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: colunas estáticas
            key={index}
            className={cn(
              'flex w-[175px] flex-col gap-6',
              index === 1 && 'pt-8',
            )}
          >
            {column.map((product) => (
              <ProductCard key={product.name} product={product} />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
