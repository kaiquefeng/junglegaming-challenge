import type {
  Edition,
  EditionId,
  NftDetail,
} from '@/features/nft-detail/services/nft-detail.types'
import { nfts } from './catalog'

export const EDITION_IDS: EditionId[] = ['1/1', '1/10', '1/50', 'ABERTA']

export function seedEditions(index: number): Record<EditionId, number> {
  return {
    '1/1': index % 5 === 2 ? 0 : 1,
    '1/10': 10,
    '1/50': 50,
    ABERTA: 999,
  }
}

export function toEditions(available: Record<EditionId, number>): Edition[] {
  return EDITION_IDS.map((id) => ({
    id,
    available: available[id],
    maxPerOrder: Math.min(available[id], id === 'ABERTA' ? 20 : 10),
  }))
}

const descriptions = (name: string): string[] => [
  `${name} é uma obra digital finalizada à mão da coleção Kurio Editions. Cada atributo fica armazenado nos metadados do token e verificado na Ethereum. A obra explora identidade, movimento e luz em um mundo digital sem fronteiras.`,
  'A propriedade inclui a arte em alta resolução, lançamentos exclusivos para colecionadores e um registro permanente de procedência registrada na rede. Nova Sato recebe 5% de direitos autorais nas vendas secundárias, apoiando novos trabalhos e lançamentos da comunidade.',
]

export function buildDetail(
  nftIndex: number,
  stock: { price: string; previousPrice?: string; version: number },
  available: Record<EditionId, number>,
): NftDetail {
  const base = nfts[nftIndex]
  if (!base) throw new Error(`NFT ${nftIndex} inexistente nas fixtures`)
  const tokenId = `#${String(base.id).padStart(4, '0')}`
  const totalAvailable = Object.values(available).reduce((a, b) => a + b, 0)

  return {
    ...base,
    price: stock.price,
    previousPrice: stock.previousPrice,
    version: stock.version,
    soldOut: totalAvailable === 0,
    tokenId,
    collectionName: 'Kurio Apes',
    attributes: 'Óculos, Esmeralda, Raro',
    summary:
      'Um colecionável digital finalizado à mão da coleção Kurio Editions, verificado na Ethereum, com arte desbloqueável e acesso para colecionadores.',
    description: descriptions(base.name),
    network:
      'Cunhado na Ethereum com procedência imutável e metadados armazenados no IPFS.',
    networkNote: 'Rede',
    contract:
      'Direitos autorais do criador: 5% nas vendas secundárias, pagos automaticamente pelos mercados compatíveis.',
    royalties: 'Direitos autorais:',
    address: '0x7A42...19E8 • Contrato inteligente ERC-721 verificado.',
    rating: 4,
    reviews: 19,
    images: Array.from({ length: 4 }, () => ({
      src: base.image,
      alt: base.imageAlt,
    })),
    editions: toEditions(available),
  }
}
