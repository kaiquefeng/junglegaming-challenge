import type { CountedOption } from '../../services/catalog.types'

export type CountedFilterListProps = {
  label: string
  options: CountedOption[]
  selected?: string
  onSelect: (id: string | undefined) => void
  isLoading?: boolean
  className?: string
}
