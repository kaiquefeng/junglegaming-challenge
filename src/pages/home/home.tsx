import { Button } from '@/components/button'
import { useHealth } from '@/features/health'

export function HomePage() {
  const { data, status, refetch, isFetching } = useHealth()

  return (
    <section className="flex flex-col items-start gap-4">
      <h1 className="text-4xl font-bold tracking-tight">Hello World</h1>
      <p className="text-muted-foreground" aria-live="polite">
        {status === 'pending' && 'Carregando a API simulada…'}
        {status === 'error' && 'Não foi possível falar com a API.'}
        {status === 'success' && `API simulada (MSW): ${data.message}`}
      </p>
      <Button onClick={() => refetch()} disabled={isFetching}>
        Verificar API novamente
      </Button>
    </section>
  )
}
