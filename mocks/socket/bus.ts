import type { RealtimeEvent } from '@/services/contracts'

export type ServerEvent = RealtimeEvent<string, unknown> & {
  userId?: string
}

type Listener = (event: ServerEvent) => void

const listeners = new Set<Listener>()

export function subscribe(listener: Listener) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function publish(event: ServerEvent) {
  for (const listener of listeners) listener(event)
}
