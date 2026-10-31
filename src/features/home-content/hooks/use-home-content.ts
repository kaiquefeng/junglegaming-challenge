import { useMutation, useQuery } from '@tanstack/react-query'
import {
  getFooter,
  getHero,
  getJournal,
  getPromos,
  getSiteHeader,
  subscribeToNewsletter,
} from '../services/home-content.service'

export const homeContentQueryKeys = {
  header: ['home-content', 'header'] as const,
  hero: ['home-content', 'hero'] as const,
  promos: ['home-content', 'promos'] as const,
  journal: ['home-content', 'journal'] as const,
  footer: ['home-content', 'footer'] as const,
}

export function useSiteHeader() {
  return useQuery({
    queryKey: homeContentQueryKeys.header,
    queryFn: ({ signal }) => getSiteHeader(signal),
  })
}

export function useHero() {
  return useQuery({
    queryKey: homeContentQueryKeys.hero,
    queryFn: ({ signal }) => getHero(signal),
  })
}

export function usePromos() {
  return useQuery({
    queryKey: homeContentQueryKeys.promos,
    queryFn: ({ signal }) => getPromos(signal),
  })
}

export function useJournal() {
  return useQuery({
    queryKey: homeContentQueryKeys.journal,
    queryFn: ({ signal }) => getJournal(signal),
  })
}

export function useFooter() {
  return useQuery({
    queryKey: homeContentQueryKeys.footer,
    queryFn: ({ signal }) => getFooter(signal),
  })
}

export function useNewsletterSubscription() {
  return useMutation({ mutationFn: subscribeToNewsletter })
}
