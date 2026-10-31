import { ChevronRight } from 'lucide-react'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from '@/components/pagination'
import type { CatalogPaginationProps } from './catalog-pagination.types'

export function CatalogPagination({
  page,
  totalPages,
  onPageChange,
}: CatalogPaginationProps) {
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <Pagination
      aria-label="Paginação do catálogo"
      className="mx-0 w-auto justify-end"
    >
      <PaginationContent>
        {pages.map((n) => (
          <PaginationItem key={n}>
            <PaginationLink
              href={`?page=${n}`}
              isActive={n === page}
              aria-label={`Página ${n}`}
              onClick={(event) => {
                event.preventDefault()
                onPageChange(n)
              }}
            >
              {n}
            </PaginationLink>
          </PaginationItem>
        ))}
        {page < totalPages && (
          <PaginationItem>
            <PaginationLink
              href={`?page=${page + 1}`}
              aria-label="Próxima página"
              onClick={(event) => {
                event.preventDefault()
                onPageChange(page + 1)
              }}
            >
              <ChevronRight aria-hidden="true" className="size-4" />
            </PaginationLink>
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  )
}
