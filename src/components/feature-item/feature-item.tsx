import { Avatar, AvatarFallback } from '@/components/avatar'
import { cn } from '@/lib/utils'
import type { FeatureItemProps } from './feature-item.types'

export function FeatureItem({
  letter,
  title,
  description,
  className,
}: FeatureItemProps) {
  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <Avatar className="size-[74px]" aria-hidden="true">
        <AvatarFallback className="bg-primary text-3xl font-bold text-primary-foreground">
          {letter}
        </AvatarFallback>
      </Avatar>
      <h3 className="text-base font-bold">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}
