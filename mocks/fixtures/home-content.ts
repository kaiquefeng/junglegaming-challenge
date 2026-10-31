import type {
  FooterData,
  Hero,
  JournalData,
  Promo,
  SiteHeaderData,
} from '@/features/home-content/services/home-content.types'

export const siteHeader: SiteHeaderData = {
  brand: 'KURIO',
  cartCount: 6,
  nav: [
    { label: 'Início', href: '/' },
    { label: 'Mercado', href: '/#mercado' },
    { label: 'Criadores', href: '/#criadores' },
    { label: 'Aprenda', href: '/#diario' },
  ],
}

export const hero: Hero = {
  eyebrow: 'Bem-vindo à Kurio',
  title: 'Seja dono do futuro da arte digital',
  description:
    'Descubra NFTs selecionados de criadores emergentes e consagrados. Colecione arte digital rara, apoie artistas e tenha uma parte da cultura da internet.',
  cta: { label: 'Explorar', href: '/#mercado' },
  image: '/images/nfts/emerald-ape.webp',
  imageAlt: 'Macaco com óculos escuros e jaqueta verde',
  slides: 3,
}

export const promos: Promo[] = [
  {
    id: 'genesis',
    title: 'Lançamentos gênesis de edição limitada',
    description:
      'Colecione edições escassas diretamente dos criadores antes da revelação pública.',
    cta: { label: 'Explorar', href: '/#mercado' },
    image: '/images/nfts/emerald-ape.webp',
    imageAlt: 'Macaco com óculos escuros e jaqueta verde',
  },
  {
    id: 'curated',
    title: 'Arte digital selecionada e muito mais',
    description:
      'Explore novos artistas, coleções verificadas e obras digitais que definem a cultura.',
    cta: { label: 'Explorar', href: '/#mercado' },
    image: '/images/nfts/neon-vessel.webp',
    imageAlt: 'Gorila escuro com blazer bege e gola verde',
  },
]

export const journal: JournalData = {
  title: 'Diário da Cunhagem',
  subtitle:
    'Histórias, guias e insights para colecionadores sobre o universo da propriedade digital.',
  articles: [
    {
      id: 'ownership',
      title: 'Como funciona a propriedade de NFTs',
      excerpt: 'Aprenda a colecionar, negociar e verificar ativos digitais.',
      publishedAt: '2026-09-12',
      dateLabel: '12 de setembro',
      readingMinutes: 6,
      image: '/images/nfts/neon-vessel.webp',
      imageAlt: 'Gorila escuro com blazer bege e gola verde',
      href: '#',
    },
    {
      id: 'artists',
      title: '10 artistas digitais para acompanhar',
      excerpt: 'Conheça criadores que moldam a cultura digital.',
      publishedAt: '2026-09-13',
      dateLabel: '13 de setembro',
      readingMinutes: 2,
      image: '/images/nfts/emerald-ape.webp',
      imageAlt: 'Macaco com óculos escuros e jaqueta verde',
      href: '#',
    },
    {
      id: 'rarity',
      title: 'Raridade, atributos e procedência',
      excerpt: 'Entenda raridade, procedência, direitos autorais e utilidade.',
      publishedAt: '2026-09-15',
      dateLabel: '15 de setembro',
      readingMinutes: 3,
      image: '/images/nfts/sage-nomad.webp',
      imageAlt: 'Gorila com chapéu bucket e moletom roxo',
      href: '#',
    },
    {
      id: 'wallet',
      title: 'Como proteger sua carteira',
      excerpt: 'Proteja sua carteira, seus ativos e sua identidade.',
      publishedAt: '2026-09-15',
      dateLabel: '15 de setembro',
      readingMinutes: 2,
      image: '/images/nfts/golden-beat.webp',
      imageAlt: 'Macaco laranja com fones de ouvido verdes',
      href: '#',
    },
  ],
}

export const footer: FooterData = {
  brand: 'KURIO',
  highlights: [
    {
      id: 'security',
      letter: 'W',
      title: 'Segurança da carteira',
      description:
        'Proteja sua carteira e colecione arte digital verificada com confiança.',
    },
    {
      id: 'creators',
      letter: 'C',
      title: 'Criadores em destaque',
      description:
        'Conheça artistas, estúdios e comunidades que moldam a cultura digital na rede.',
    },
    {
      id: 'alerts',
      letter: 'D',
      title: 'Alertas de lançamentos',
      description:
        'Receba calendários de cunhagem, novidades de listas de acesso e análises do mercado.',
    },
  ],
  newsletter: {
    title: 'Antecipe-se ao próximo lançamento',
    placeholder: 'digite seu e-mail...',
    submitLabel: 'Enviar',
    description:
      'Receba lançamentos selecionados, histórias de criadores e novidades do mercado.',
  },
  contact: {
    tagline: 'Feito para colecionadores, criadores e cultura',
    email: 'contato@email.com',
    phone: '+55 11 4002 8922',
  },
  linkGroups: [
    {
      id: 'profile',
      title: 'Meu perfil',
      links: [
        { label: 'Meu perfil', href: '#' },
        { label: 'Minha coleção', href: '#' },
        { label: 'Atividade', href: '#' },
        { label: 'Estúdio do criador', href: '#' },
        { label: 'Lista de interesse', href: '#' },
      ],
    },
    {
      id: 'help',
      title: 'Central de ajuda',
      links: [
        { label: 'Central de ajuda', href: '#' },
        { label: 'Como comprar NFTs', href: '#' },
        { label: 'Carteira e segurança', href: '#' },
        { label: 'Política do mercado', href: '#' },
        { label: 'Denunciar item', href: '#' },
      ],
    },
    {
      id: 'collections',
      title: 'Coleções',
      links: [
        { label: 'Arte digital', href: '#' },
        { label: 'Fotografia', href: '#' },
        { label: 'Música', href: '#' },
        { label: 'Arte 3D', href: '#' },
        { label: 'Utilidade', href: '#' },
      ],
    },
  ],
  social: [
    { network: 'facebook', label: 'Facebook', href: '#' },
    { network: 'instagram', label: 'Instagram', href: '#' },
    { network: 'twitter', label: 'Twitter', href: '#' },
    { network: 'linkedin', label: 'LinkedIn', href: '#' },
    { network: 'youtube', label: 'YouTube', href: '#' },
  ],
  wallets: {
    title: 'Carteiras compatíveis',
    names: ['MetaMask', 'WalletConnect', 'Coinbase'],
  },
  copyright: '© 2026 Kurio. Propriedade digital para todos.',
}
