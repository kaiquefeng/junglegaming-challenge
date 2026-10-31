import { cn } from '@/lib/utils'
import type { CountedFilterListProps } from './counted-filter-list.types'

export function CountedFilterList({
  label,
  options,
  selected,
  onSelect,
  isLoading,
  className,
}: CountedFilterListProps) {
  if (isLoading) {
    return (
      <ul className={cn('flex flex-col gap-2', className)} aria-busy="true">
        {Array.from({ length: 4 }, (_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: placeholders estáticos
          <li key={i} className="skeleton-shimmer h-6 rounded bg-accent" />
        ))}
      </ul>
    )
  }

  return (
    <ul aria-label={label} className={cn('flex flex-col', className)}>
      {options.map((option) => {
        const isSelected = selected === option.id
        return (
          <li key={option.id}>
            <button
              type="button"
              aria-pressed={isSelected}
              onClick={() => onSelect(isSelected ? undefined : option.id)}
              className="flex w-full items-center justify-between rounded px-3 py-2 text-left text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring aria-pressed:text-highlight"
            >
              <span>{option.label}</span>
              <span className="font-bold">({option.count})</span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}
