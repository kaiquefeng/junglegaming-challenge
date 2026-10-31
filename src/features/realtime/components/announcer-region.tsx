import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { dismiss, useAnnouncements } from '../announcer'

export function AnnouncerRegion() {
  const items = useAnnouncements()

  return (
    <div
      className="pointer-events-none fixed right-4 bottom-24 z-[60] flex w-[min(360px,calc(100vw-2rem))] flex-col gap-2 md:bottom-4"
      aria-live="polite"
      aria-atomic="false"
    >
      {items.map((item) => (
        <div
          key={item.id}
          role={item.tone === 'error' ? 'alert' : 'status'}
          className={cn(
            'pointer-events-auto flex items-start gap-3 rounded-md border bg-card p-3 text-sm shadow-lg',
            item.tone === 'error' ? 'border-destructive' : 'border-primary',
          )}
        >
          <p className="flex-1">{item.text}</p>
          <button
            type="button"
            aria-label="Dispensar aviso"
            onClick={() => dismiss(item.id)}
            className="text-muted-foreground hover:text-foreground"
          >
            <X aria-hidden="true" className="size-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
