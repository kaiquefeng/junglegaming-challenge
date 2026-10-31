import type { PriceRange } from '../../services/catalog.types'

export type PriceFilterProps = {
  range: PriceRange
  value?: [number, number]
  onApply: (value: [number, number]) => void
}
