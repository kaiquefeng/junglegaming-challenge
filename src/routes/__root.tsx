import { createRootRoute, Link } from '@tanstack/react-router'
import { AppShell } from '@/layouts/app-shell'

export const Route = createRootRoute({
  component: AppShell,
  notFoundComponent: () => (
    <section className="flex flex-col items-start gap-4 px-4 py-8 md:p-0">
      <h1 className="text-3xl font-bold">Página não encontrada</h1>
      <Link to="/" className="underline">
        Voltar ao início
      </Link>
    </section>
  ),
})
