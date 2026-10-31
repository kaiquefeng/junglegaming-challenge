import { useId, useState } from 'react'
import { Button } from '@/components/button'
import { Slider } from '@/components/slider'
import type { PriceFilterProps } from './price-filter.types'

const formatEth = (value: number) => value.toFixed(2).replace('.', ',')

export function PriceFilter({ range, value, onApply }: PriceFilterProps) {
  const labelId = useId()
  const [draft, setDraft] = useState<[number, number]>([
    value?.[0] ?? range.min,
    value?.[1] ?? range.max,
  ])

  return (
    <div className="flex flex-col gap-3">
      <Slider
        aria-labelledby={labelId}
        min={range.min}
        max={range.max}
        step={0.01}
        minStepsBetweenThumbs={1}
        value={draft}
        onValueChange={([min = range.min, max = range.max]) =>
          setDraft([min, max])
        }
        className="[&_[data-slot=slider-range]]:bg-primary [&_[data-slot=slider-thumb]]:border-primary [&_[data-slot=slider-thumb]]:bg-primary [&_[data-slot=slider-track]]:bg-primary/60"
      />
      <p id={labelId} className="px-3 text-sm text-muted-foreground">
        Preço: {formatEth(draft[0])} - {formatEth(draft[1])} {range.currency}
      </p>
      <Button
        size="sm"
        className="ml-3 w-fit font-bold"
        onClick={() => onApply(draft)}
      >
        Aplicar
      </Button>
    </div>
  )
}
