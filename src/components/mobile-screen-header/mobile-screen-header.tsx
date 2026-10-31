import { useRouter } from '@tanstack/react-router'
import { ChevronLeft } from 'lucide-react'
import type * as React from 'react'
import { cn } from '@/lib/utils'

export function MobileScreenHeader({
  title,
  centered = false,
  className,
}: {
  title: string
  centered?: boolean
  className?: string
}) {
  const router = useRouter()

  return (
    <div className={cn('flex h-11 items-center gap-6', className)}>
      <button
        type="button"
        aria-label="Voltar"
        onClick={() => router.history.back()}
        className="flex size-[35px] shrink-0 items-center justify-center rounded-full border border-border bg-[#2f1d15] text-highlight"
      >
        <ChevronLeft aria-hidden="true" className="size-5" />
      </button>
      <h1
        className={cn(
          'text-xl font-bold',
          centered && 'flex-1 pr-[59px] text-center',
        )}
      >
        {title}
      </h1>
    </div>
  )
}

export type MobileScreenHeaderProps = React.ComponentProps<
  typeof MobileScreenHeader
>
