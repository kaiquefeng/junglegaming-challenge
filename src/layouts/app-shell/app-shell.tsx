import { Link, Outlet } from '@tanstack/react-router'

export function AppShell() {
  return (
    <div className="min-h-screen">
      <header className="border-b px-4 py-4 md:px-8">
        <nav aria-label="Principal">
          <Link to="/" className="text-lg font-semibold">
            NFT Marketplace
          </Link>
        </nav>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-10 md:px-8">
        <Outlet />
      </main>
    </div>
  )
}
