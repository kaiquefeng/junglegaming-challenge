import { api } from '@/services/api'
import type { HealthResponse } from './get-health.types'

export async function getHealth(signal?: AbortSignal) {
  const { data } = await api.get<HealthResponse>('/health', { signal })
  return data
}
