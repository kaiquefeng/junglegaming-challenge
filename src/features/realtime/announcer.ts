import { useSyncExternalStore } from 'react'

export type Announcement = {
  id: number
  text: string
  tone: 'info' | 'error' | 'success'
}

let announcements: Announcement[] = []
let counter = 0
const listeners = new Set<() => void>()

const emit = () => {
  for (const listener of listeners) listener()
}

export function dismiss(id: number) {
  announcements = announcements.filter((item) => item.id !== id)
  emit()
}

export function announce(text: string, tone: Announcement['tone'] = 'info') {
  counter += 1
  const id = counter
  announcements = [...announcements.slice(-3), { id, text, tone }]
  emit()
  window.setTimeout(() => dismiss(id), 6000)
}

export const useAnnouncements = () =>
  useSyncExternalStore(
    (listener) => {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },
    () => announcements,
    () => announcements,
  )
