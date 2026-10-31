import { delay, HttpResponse, http } from 'msw'
import type { Nft } from '@/features/catalog/services/catalog.types'
import { db } from '../db/db'
import {
  collections,
  featuredNft,
  networks,
  nfts,
  priceRange,
} from '../fixtures/catalog'
import { getDetail } from '../lib/domain'
import { errors, hash32, simulateLatency } from '../lib/http'
import { getScenario } from '../scenarios'

const PAGE_SIZE = 6
let catalogCalls = 0

function liveNft(nft: Nft): Nft {
  const stock = db().stock[nft.id]
  if (!stock) return nft
  const available = Object.values(stock.editions).reduce((a, b) => a + b, 0)
  return {
    ...nft,
    price: stock.price,
    previousPrice: stock.previousPrice,
    version: stock.version,
    soldOut: available === 0,
  }
}

const normalize = (value: string) =>
  value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()

export const catalogHandlers = [
  http.get('/api/collections', async () => {
    await simulateLatency()
    return HttpResponse.json(collections)
  }),

  http.get('/api/networks', async () => {
    await simulateLatency()
    return HttpResponse.json(networks)
  }),

  http.get('/api/price-range', async () => {
    await simulateLatency()
    return HttpResponse.json(priceRange)
  }),

  http.get('/api/nfts/featured', async () => {
    await simulateLatency()
    return HttpResponse.json({ ...featuredNft, nft: liveNft(featuredNft.nft) })
  }),

  http.get('/api/nfts/:id', async ({ params }) => {
    await simulateLatency()
    const detail = getDetail(String(params.id))
    if (!detail) return errors.notFound('NFT não encontrado.')
    return HttpResponse.json(detail)
  }),

  http.get('/api/nfts', async ({ request }) => {
    const scenario = getScenario()
    const url = new URL(request.url)
    const params = url.searchParams

    catalogCalls += 1
    if (scenario.catalogFailure === 'network') return HttpResponse.error()
    if (typeof scenario.catalogFailure === 'number') {
      await simulateLatency()
      return HttpResponse.json(
        { code: 'transient', message: 'Falha no catálogo.' },
        { status: scenario.catalogFailure },
      )
    }
    if (
      scenario.catalogFailEveryN &&
      catalogCalls % scenario.catalogFailEveryN === 0
    ) {
      await simulateLatency()
      return errors.transient()
    }

    const tab = params.get('tab') ?? 'all'
    const sort = params.get('sort') ?? 'recent'
    const page = Math.max(1, Number(params.get('page') ?? 1))
    const q = params.get('q')?.trim()
    const collection = params.get('collection')
    const network = params.get('network')
    const minPrice = params.has('minPrice')
      ? Number(params.get('minPrice'))
      : undefined
    const maxPrice = params.has('maxPrice')
      ? Number(params.get('maxPrice'))
      : undefined

    const filtered = scenario.emptyCatalog
      ? []
      : nfts
          .map(liveNft)
          .filter((nft) => tab !== 'new' || nft.isNew)
          .filter((nft) => tab !== 'trending' || nft.isTrending)
          .filter((nft) => !q || normalize(nft.name).includes(normalize(q)))
          .filter((nft) => !collection || nft.collection === collection)
          .filter((nft) => !network || nft.network === network)
          .filter(
            (nft) => minPrice === undefined || Number(nft.price) >= minPrice,
          )
          .filter(
            (nft) => maxPrice === undefined || Number(nft.price) <= maxPrice,
          )

    const sorted = [...filtered].sort((a, b) => {
      if (sort === 'price-asc') return Number(a.price) - Number(b.price)
      if (sort === 'price-desc') return Number(b.price) - Number(a.price)
      return b.listedAt.localeCompare(a.listedAt)
    })

    const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))
    const start = (page - 1) * PAGE_SIZE

    if (scenario.outOfOrder) {
      await delay(q || collection || network ? 1600 : 200)
    } else {
      await simulateLatency(`${hash32(url.search)}`)
    }

    return HttpResponse.json({
      items: sorted.slice(start, start + PAGE_SIZE),
      page,
      totalPages,
      total: sorted.length,
    })
  }),
]
