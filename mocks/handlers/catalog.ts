import { delay, HttpResponse, http } from 'msw'
import {
  collections,
  featuredNft,
  networks,
  nfts,
  priceRange,
} from '../fixtures/catalog'

const PAGE_SIZE = 6
const LATENCY_MS = 400

export const catalogHandlers = [
  http.get('/api/collections', async () => {
    await delay(LATENCY_MS)
    return HttpResponse.json(collections)
  }),

  http.get('/api/networks', async () => {
    await delay(LATENCY_MS)
    return HttpResponse.json(networks)
  }),

  http.get('/api/price-range', async () => {
    await delay(LATENCY_MS)
    return HttpResponse.json(priceRange)
  }),

  http.get('/api/nfts/featured', async () => {
    await delay(LATENCY_MS)
    return HttpResponse.json(featuredNft)
  }),

  http.get('/api/nfts', async ({ request }) => {
    const params = new URL(request.url).searchParams
    const tab = params.get('tab') ?? 'all'
    const sort = params.get('sort') ?? 'recent'
    const page = Math.max(1, Number(params.get('page') ?? 1))
    const collection = params.get('collection')
    const network = params.get('network')
    const minPrice = params.has('minPrice')
      ? Number(params.get('minPrice'))
      : undefined
    const maxPrice = params.has('maxPrice')
      ? Number(params.get('maxPrice'))
      : undefined

    const filtered = nfts
      .filter((nft) => tab !== 'new' || nft.isNew)
      .filter((nft) => tab !== 'trending' || nft.isTrending)
      .filter((nft) => !collection || nft.collection === collection)
      .filter((nft) => !network || nft.network === network)
      .filter((nft) => minPrice === undefined || nft.price >= minPrice)
      .filter((nft) => maxPrice === undefined || nft.price <= maxPrice)

    const sorted = [...filtered].sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price
      if (sort === 'price-desc') return b.price - a.price
      return b.listedAt.localeCompare(a.listedAt)
    })

    const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))
    const start = (page - 1) * PAGE_SIZE

    await delay(LATENCY_MS)
    return HttpResponse.json({
      items: sorted.slice(start, start + PAGE_SIZE),
      page,
      totalPages,
      total: sorted.length,
    })
  }),
]
