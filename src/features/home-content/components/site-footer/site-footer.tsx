import { Card } from '@/components/card'
import { FeatureItem } from '@/components/feature-item'
import { Separator } from '@/components/separator'
import { Skeleton } from '@/components/skeleton'
import { SocialIcon } from '@/components/social-icon'
import { useFooter } from '../../hooks/use-home-content'
import { NewsletterForm } from '../newsletter-form/newsletter-form'

export function SiteFooter() {
  const { data, isPending, isError } = useFooter()

  if (isError) return null

  if (isPending) {
    return (
      <footer
        aria-busy="true"
        className="mx-auto w-full max-w-[1200px] px-4 pb-12 xl:px-0"
      >
        <Skeleton className="h-[640px] w-full rounded-none" />
      </footer>
    )
  }

  return (
    <footer className="mx-auto w-full max-w-[1200px] px-4 xl:px-0">
      <Card className="gap-0 rounded-none border-0 py-0 shadow-none">
        <div className="grid gap-8 p-8 md:grid-cols-2 xl:grid-cols-4 xl:gap-0 xl:p-0 xl:py-8">
          {data.highlights.map((item) => (
            <FeatureItem
              key={item.id}
              letter={item.letter}
              title={item.title}
              description={item.description}
              className="xl:border-r xl:border-primary xl:px-12 xl:py-0"
            />
          ))}
          <div className="xl:px-4">
            <NewsletterForm {...data.newsletter} />
          </div>
        </div>

        <div className="grid gap-4 bg-secondary p-8 text-sm md:grid-cols-2 xl:grid-cols-4">
          <strong className="font-bold tracking-wider">{data.brand}</strong>
          <p>{data.contact.tagline}</p>
          <a href={`mailto:${data.contact.email}`}>{data.contact.email}</a>
          <a href={`tel:${data.contact.phone.replace(/\s/g, '')}`}>
            {data.contact.phone}
          </a>
        </div>

        <nav
          aria-label="Rodapé"
          className="grid gap-8 p-8 md:grid-cols-2 xl:grid-cols-4"
        >
          {data.linkGroups.map((group) => (
            <section key={group.id} className="flex flex-col gap-3">
              <h2 className="text-lg font-bold">{group.title}</h2>
              <ul className="flex flex-col gap-2 text-sm">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="hover:text-highlight">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          ))}

          <section className="flex flex-col gap-4">
            <h2 className="text-lg font-bold">Redes sociais</h2>
            <ul className="flex gap-2">
              {data.social.map((item) => (
                <li key={item.network}>
                  <a
                    href={item.href}
                    aria-label={item.label}
                    className="flex size-8 items-center justify-center rounded-md border border-primary text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                  >
                    <SocialIcon network={item.network} className="size-4" />
                  </a>
                </li>
              ))}
            </ul>
            <h2 className="mt-2 text-lg font-bold">{data.wallets.title}</h2>
            <p className="rounded-md border border-border bg-secondary px-3 py-2 text-center text-[10px] font-bold uppercase text-primary">
              {data.wallets.names.join('  •  ')}
            </p>
          </section>
        </nav>
      </Card>
      <Separator className="bg-transparent" />
      <p className="py-5 text-center text-sm">{data.copyright}</p>
    </footer>
  )
}
