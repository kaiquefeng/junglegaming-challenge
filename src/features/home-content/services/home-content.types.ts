export type NavItem = {
  label: string
  href: string
}

export type SiteHeaderData = {
  brand: string
  nav: NavItem[]
  cartCount: number
}

export type Hero = {
  eyebrow: string
  title: string
  description: string
  cta: { label: string; href: string }
  image: string
  imageAlt: string
  slides: number
}

export type Promo = {
  id: string
  title: string
  description: string
  cta: { label: string; href: string }
  image: string
  imageAlt: string
}

export type Article = {
  id: string
  title: string
  excerpt: string
  publishedAt: string
  dateLabel: string
  readingMinutes: number
  image: string
  imageAlt: string
  href: string
}

export type JournalData = {
  title: string
  subtitle: string
  articles: Article[]
}

export type FooterHighlight = {
  id: string
  letter: string
  title: string
  description: string
}

export type FooterLinkGroup = {
  id: string
  title: string
  links: NavItem[]
}

export type SocialNetwork =
  | 'facebook'
  | 'instagram'
  | 'twitter'
  | 'linkedin'
  | 'youtube'

export type FooterData = {
  brand: string
  highlights: FooterHighlight[]
  newsletter: {
    title: string
    placeholder: string
    submitLabel: string
    description: string
  }
  contact: { tagline: string; email: string; phone: string }
  linkGroups: FooterLinkGroup[]
  social: { network: SocialNetwork; label: string; href: string }[]
  wallets: { title: string; names: string[] }
  copyright: string
}

export type NewsletterPayload = {
  email: string
}

export type NewsletterResponse = {
  message: string
}
