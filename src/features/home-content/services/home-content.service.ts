import { api } from '@/services/api'
import type {
  FooterData,
  Hero,
  JournalData,
  NewsletterPayload,
  NewsletterResponse,
  Promo,
  SiteHeaderData,
} from './home-content.types'

export async function getSiteHeader(signal?: AbortSignal) {
  const { data } = await api.get<SiteHeaderData>('/site-header', { signal })
  return data
}

export async function getHero(signal?: AbortSignal) {
  const { data } = await api.get<Hero>('/home/hero', { signal })
  return data
}

export async function getPromos(signal?: AbortSignal) {
  const { data } = await api.get<Promo[]>('/promos', { signal })
  return data
}

export async function getJournal(signal?: AbortSignal) {
  const { data } = await api.get<JournalData>('/articles', { signal })
  return data
}

export async function getFooter(signal?: AbortSignal) {
  const { data } = await api.get<FooterData>('/footer', { signal })
  return data
}

export async function subscribeToNewsletter(payload: NewsletterPayload) {
  const { data } = await api.post<NewsletterResponse>('/newsletter', payload)
  return data
}
