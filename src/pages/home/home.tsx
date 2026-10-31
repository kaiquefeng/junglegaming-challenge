import { getRouteApi } from '@tanstack/react-router'
import {
  CatalogSection,
  MobileHome,
  type NftListParams,
} from '@/features/catalog'
import {
  HeroSection,
  JournalSection,
  PromoSection,
} from '@/features/home-content'
import { useIsDesktop } from '@/hooks/use-media-query'

const route = getRouteApi('/')

export function HomePage() {
  const isDesktop = useIsDesktop()
  const search = route.useSearch()
  const filters: NftListParams = {
    ...search,
    tab: search.tab ?? 'all',
    sort: search.sort ?? 'recent',
    page: search.page ?? 1,
  }
  const navigate = route.useNavigate()

  function handleFiltersChange(patch: Partial<NftListParams>) {
    // Mudar qualquer filtro (exceto a própria página) volta para a primeira página.
    const resetsPage = Object.keys(patch).some((key) => key !== 'page')
    navigate({
      search: (prev) => ({ ...prev, ...patch, ...(resetsPage && { page: 1 }) }),
    })
  }

  if (!isDesktop) return <MobileHome />

  return (
    <>
      <HeroSection />
      <CatalogSection filters={filters} onFiltersChange={handleFiltersChange} />
      <PromoSection />
      <JournalSection />
    </>
  )
}
