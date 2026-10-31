import { Link } from '@tanstack/react-router'
import { Button } from '@/components/button'
import { Skeleton } from '@/components/skeleton'
import { isApiError } from '@/services/api-error'

export function NftDetailSkeleton() {
  return (
    <div aria-busy="true" className="flex flex-col gap-3 px-4 md:px-0">
      <span role="status" className="sr-only">
        Carregando NFT
      </span>
      <Skeleton className="h-4 w-40" />
      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="flex gap-7 lg:w-[573px] lg:shrink-0">
          <div className="hidden w-[100px] shrink-0 flex-col gap-4 sm:flex">
            {Array.from({ length: 4 }, (_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: placeholders estáticos
              <Skeleton key={i} className="size-[100px] rounded-lg" />
            ))}
          </div>
          <Skeleton className="aspect-square w-full max-w-[444px] rounded-md" />
        </div>
        <div className="flex flex-1 flex-col gap-6">
          <Skeleton className="h-9 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </div>
  )
}

export function NftDetailError({
  error,
  onRetry,
}: {
  error: unknown
  onRetry: () => void
}) {
  const notFound = isApiError(error, 'not_found')

  return (
    <section
      role="alert"
      className="flex flex-col items-start gap-4 px-4 py-8 md:p-0"
    >
      <h1 className="text-2xl font-bold">
        {notFound ? 'NFT não encontrado' : 'Não foi possível carregar o NFT'}
      </h1>
      <p className="text-muted-foreground">
        {notFound
          ? 'O NFT que você procura não existe ou foi removido.'
          : 'Verifique sua conexão e tente novamente.'}
      </p>
      <div className="flex gap-3">
        {!notFound && <Button onClick={onRetry}>Tentar novamente</Button>}
        <Button asChild variant="outline">
          <Link to="/">Voltar ao catálogo</Link>
        </Button>
      </div>
    </section>
  )
}
