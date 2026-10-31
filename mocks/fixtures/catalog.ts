import type {
  CountedOption,
  FeaturedNft,
  Nft,
  PriceRange,
} from '@/features/catalog/services/catalog.types'

const images = {
  emerald: {
    src: '/images/nfts/emerald-ape.webp',
    alt: 'Macaco com óculos escuros e jaqueta verde',
  },
  sage: {
    src: '/images/nfts/sage-nomad.webp',
    alt: 'Gorila com chapéu bucket e moletom roxo',
  },
  neon: {
    src: '/images/nfts/neon-vessel.webp',
    alt: 'Gorila escuro com blazer bege e gola verde',
  },
  golden: {
    src: '/images/nfts/golden-beat.webp',
    alt: 'Macaco laranja com fones de ouvido verdes',
  },
}

type Seed = [
  name: string,
  price: number,
  image: keyof typeof images,
  collection: string,
  network: string,
  previousPrice?: number,
]

const seeds: Seed[] = [
  ['Emerald Ape #042', 1.19, 'emerald', 'arte-digital', 'ethereum'],
  ['Sage Nomad #009', 1.69, 'sage', 'colecionaveis', 'polygon'],
  ['Neon Vessel #552', 1.99, 'neon', 'arte-3d', 'solana', 2.29],
  ['Cosmic Bloom #118', 1.29, 'sage', 'generativa', 'ethereum'],
  ['Violet Nomad #314', 1.39, 'sage', 'colecionaveis', 'polygon'],
  ['Ivory Baron #088', 1.79, 'neon', 'arte-digital', 'ethereum'],
  ['Golden Beat #207', 0.99, 'golden', 'musica', 'solana'],
  ['Golden Echo #411', 0.89, 'golden', 'musica', 'polygon'],
  ['Golden Signal #160', 0.39, 'golden', 'musica', 'ethereum'],
  ['Jade Syndicate #021', 2.49, 'emerald', 'jogos', 'ethereum'],
  ['Moss Drifter #276', 0.59, 'sage', 'fotografia', 'polygon'],
  ['Onyx Courier #330', 3.1, 'neon', 'utilidade', 'solana', 3.4],
  ['Amber Pulse #077', 0.69, 'golden', 'musica', 'ethereum'],
  ['Forest Ledger #190', 1.09, 'emerald', 'assinaturas', 'polygon'],
  ['Lilac Hermit #603', 2.19, 'sage', 'arte-3d', 'ethereum'],
  ['Slate Envoy #245', 0.49, 'neon', 'fotografia', 'solana'],
  ['Honey Cadence #512', 1.49, 'golden', 'generativa', 'polygon', 1.89],
  ['Verdant Guild #004', 4.2, 'emerald', 'jogos', 'ethereum'],
  ['Mist Wanderer #388', 0.79, 'sage', 'colecionaveis', 'solana'],
  ['Cobalt Regent #915', 2.89, 'neon', 'arte-digital', 'ethereum'],
  ['Saffron Loop #129', 0.29, 'golden', 'generativa', 'polygon'],
  ['Pine Oracle #066', 1.59, 'emerald', 'utilidade', 'solana'],
]

export const nfts: Nft[] = seeds.map(
  ([name, price, image, collection, network, previousPrice], i) => ({
    id: String(i + 1),
    name,
    price: price.toFixed(2),
    previousPrice: previousPrice?.toFixed(2),
    currency: 'ETH',
    image: images[image].src,
    imageAlt: images[image].alt,
    collection,
    network,
    isNew: i % 3 === 0 || i < 4,
    isTrending: i % 2 === 1,
    listedAt: new Date(Date.UTC(2026, 8, 30 - i)).toISOString(),
    version: 1,
    soldOut: false,
  }),
)

export const collections: CountedOption[] = [
  { id: 'arte-digital', label: 'Arte digital', count: 33 },
  { id: 'fotografia', label: 'Fotografia', count: 12 },
  { id: 'musica', label: 'Música', count: 65 },
  { id: 'arte-3d', label: 'Arte 3D', count: 39 },
  { id: 'colecionaveis', label: 'Colecionáveis', count: 23 },
  { id: 'generativa', label: 'Generativa', count: 17 },
  { id: 'jogos', label: 'Jogos', count: 19 },
  { id: 'assinaturas', label: 'Assinaturas', count: 13 },
  { id: 'utilidade', label: 'Utilidade', count: 18 },
]

export const networks: CountedOption[] = [
  { id: 'ethereum', label: 'Ethereum', count: 119 },
  { id: 'polygon', label: 'Polygon', count: 78 },
  { id: 'solana', label: 'Solana', count: 86 },
]

export const priceRange: PriceRange = { min: 0.02, max: 12.3, currency: 'ETH' }

const featuredSource = nfts.find((nft) => nft.name === 'Sage Nomad #009')
if (!featuredSource)
  throw new Error('Fixture do NFT em destaque não encontrada')

export const featuredNft: FeaturedNft = {
  eyebrow: 'NFT em destaque',
  badge: 'Oferta limitada',
  nft: featuredSource,
}
