import { Heart, Minus, Plus, Search, Star } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/button'
import { NftCard } from '@/components/nft-card'
import { Separator } from '@/components/separator'
import { SocialIcon } from '@/components/social-icon'
import { Tabs, TabsList, TabsTrigger } from '@/components/tabs'
import { cn } from '@/lib/utils'
import type { NftDetailData } from './nft-detail-view.types'

const nft: NftDetailData = {
  name: 'Emerald Ape #042',
  price: 1.19,
  currency: 'ETH',
  rating: 4,
  reviews: 19,
  summary:
    'Um colecionável digital finalizado à mão da coleção Kurio Editions, verificado na Ethereum, com arte desbloqueável e acesso para colecionadores.',
  images: Array.from({ length: 4 }, () => '/images/nfts/emerald-ape.webp'),
  editions: ['1/1', '1/10', '1/50', 'ABERTA'],
  activeEdition: '1/50',
  tokenId: '#0042',
  collection: 'Kurio Apes',
  attributes: 'Óculos, Esmeralda, Raro',
  description: [
    'Emerald Ape #042 é uma obra digital 1/50 finalizada à mão da coleção Kurio Editions. Cada atributo fica armazenado nos metadados do token e verificado na Ethereum. A obra explora identidade, movimento e luz em um mundo digital sem fronteiras.',
    'A propriedade inclui a arte em alta resolução, lançamentos exclusivos para colecionadores e um registro permanente de procedência registrada na rede. Nova Sato recebe 5% de direitos autorais nas vendas secundárias, apoiando novos trabalhos e lançamentos da comunidade.',
  ],
  network:
    'Cunhado na Ethereum com procedência imutável e metadados armazenados no IPFS.',
  contract:
    'Direitos autorais do criador: 5% nas vendas secundárias, pagos automaticamente pelos mercados compatíveis.',
  royalties: 'Direitos autorais:',
  address: '0x7A42...19E8 • Contrato inteligente ERC-721 verificado.',
}

const related = [
  { name: 'Cosmic Bloom #118', price: 1.29, image: 'sage-nomad' },
  { name: 'Violet Nomad #314', price: 1.39, image: 'sage-nomad' },
  { name: 'Ivory Baron #088', price: 1.79, image: 'neon-vessel' },
  { name: 'Golden Beat #207', price: 0.99, image: 'golden-beat' },
  { name: 'Golden Signal #160', price: 0.39, image: 'golden-beat' },
]

const socials = ['linkedin', 'facebook', 'twitter'] as const

function SectionHeading({ children }: { children: string }) {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-[17px] font-bold text-highlight">{children}</h2>
      <Separator />
    </div>
  )
}

export function NftDetailView() {
  const [quantity, setQuantity] = useState(1)
  const [selected, setSelected] = useState(1)

  return (
    <>
      <section className="flex flex-col gap-3">
        <p className="text-[15px] font-bold">Início / Mercado</p>
        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="flex gap-7 lg:w-[573px] lg:shrink-0">
            <ul className="hidden w-[100px] shrink-0 flex-col gap-4 sm:flex">
              {nft.images.map((src, index) => (
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
                    <img src={src} alt="" className="size-full object-cover" />
                  </button>
                </li>
              ))}
            </ul>
            <div className="relative flex aspect-square w-full max-w-[444px] items-center justify-center rounded-md bg-card p-4">
              <img
                src={nft.images[selected]}
                alt={nft.name}
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
              <h1 className="text-[28px] font-bold">{nft.name}</h1>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-[22px] font-bold text-highlight">
                  {nft.price.toFixed(2)} {nft.currency}
                </p>
                <p className="flex items-center gap-1 text-[15px]">
                  <span
                    role="img"
                    aria-label={`${nft.rating} de 5 estrelas`}
                    className="flex"
                  >
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        // biome-ignore lint/suspicious/noArrayIndexKey: lista estática
                        key={i}
                        aria-hidden="true"
                        className={cn(
                          'size-[15px]',
                          i < nft.rating
                            ? 'fill-highlight text-highlight'
                            : 'fill-muted-foreground/40 text-muted-foreground/40',
                        )}
                      />
                    ))}
                  </span>
                  {nft.reviews} avaliações de colecionadores
                </p>
              </div>
              <Separator />
            </div>

            <div className="flex flex-col gap-3">
              <h2 className="text-[15px] font-bold">Sobre este NFT:</h2>
              <p className="text-sm leading-6 text-muted-foreground">
                {nft.summary}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <h2 className="text-[15px] font-bold">Edição:</h2>
              <ul className="flex items-center gap-1.5">
                {nft.editions.map((edition) => (
                  <li
                    key={edition}
                    aria-current={edition === nft.activeEdition}
                    className={cn(
                      'rounded-full border border-transparent px-2 py-1 text-sm text-muted-foreground',
                      edition === nft.activeEdition &&
                        'border-highlight font-medium text-highlight',
                    )}
                  >
                    {edition}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Button
                  size="icon"
                  className="rounded-full"
                  aria-label="Diminuir quantidade"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                >
                  <Minus aria-hidden="true" />
                </Button>
                <span className="w-4 text-center text-xl">{quantity}</span>
                <Button
                  size="icon"
                  className="rounded-full"
                  aria-label="Aumentar quantidade"
                  onClick={() => setQuantity((q) => q + 1)}
                >
                  <Plus aria-hidden="true" />
                </Button>
              </div>
              <div className="flex gap-2">
                <Button className="h-10 w-[130px] font-bold">COMPRAR</Button>
                <Button
                  variant="outline"
                  className="h-10 w-[130px] border-primary text-highlight"
                >
                  <Heart aria-hidden="true" className="size-5" />
                  Favoritar
                </Button>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <dl className="flex flex-col gap-3 text-[15px] text-[#b39463]">
                <p>ID do token: {nft.tokenId}</p>
                <p>Coleção: {nft.collection}</p>
                <p>Atributos: {nft.attributes}</p>
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
              Avaliações de colecionadores ({nft.reviews})
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          {nft.description.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <h3 className="font-bold text-foreground">Rede:</h3>
          <p>{nft.network}</p>
          <h3 className="font-bold text-foreground">Contrato:</h3>
          <p>{nft.contract}</p>
          <h3 className="font-bold text-foreground">{nft.royalties}</h3>
          <p>{nft.address}</p>
        </div>
      </section>

      <section className="flex flex-col gap-8">
        <SectionHeading>Mais desta coleção</SectionHeading>
        <ul className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-5">
          {related.map((item) => (
            <li key={item.name}>
              <NftCard
                name={item.name}
                price={item.price}
                currency="ETH"
                image={`/images/nfts/${item.image}.webp`}
                imageAlt={item.name}
              />
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
