import { ArticleCard } from '@/components/article-card'
import { Skeleton } from '@/components/skeleton'
import { useJournal } from '../../hooks/use-home-content'

export function JournalSection() {
  const { data, isPending, isError } = useJournal()

  if (isError) return null

  return (
    <section
      id="diario"
      aria-labelledby="journal-title"
      className="flex flex-col gap-8"
    >
      <header className="flex flex-col items-center gap-3 text-center">
        {isPending ? (
          <>
            <Skeleton className="h-8 w-72" />
            <Skeleton className="h-4 w-96 max-w-full" />
          </>
        ) : (
          <>
            <h2 id="journal-title" className="text-3xl font-bold">
              {data.title}
            </h2>
            <p className="text-sm text-muted-foreground">{data.subtitle}</p>
          </>
        )}
      </header>

      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {isPending
          ? Array.from({ length: 4 }, (_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: placeholders estáticos
              <li key={i}>
                <Skeleton className="h-[368px] rounded-xl" />
              </li>
            ))
          : data.articles.map((article) => (
              <li key={article.id} className="flex">
                <ArticleCard className="w-full" {...article} />
              </li>
            ))}
      </ul>
    </section>
  )
}
