export type NftTab = 'all' | 'new' | 'trending'

export type NftSort = 'recent' | 'price-asc' | 'price-desc'

export type Nft = {
  id: string
  name: string

  price: string
  previousPrice?: string
  currency: 'ETH'
  image: string
  imageAlt: string
  collection: string
  network: string
  isNew: boolean
  isTrending: boolean
  listedAt: string

  version: number
  soldOut: boolean
}

export type NftListParams = {
  tab: NftTab
  sort: NftSort
  page: number
  q?: string
  collection?: string
  network?: string
  minPrice?: number
  maxPrice?: number
}

export type NftListResponse = {
  items: Nft[]
  page: number
  totalPages: number
  total: number
}

export type CountedOption = {
  id: string
  label: string
  count: number
}

export type PriceRange = {
  min: number
  max: number
  currency: 'ETH'
}

export type FeaturedNft = {
  eyebrow: string
  badge: string
  nft: Nft
}
