import { ChevronLeft, ChevronRight } from "lucide-react"
import clsx from "clsx"

interface PaginationProps {
  currentPage: number
  lastPage: number
  onPageChange: (page: number) => void
}

export function buildPageList(currentPage: number, lastPage: number): (number | "ellipsis")[] {
  if (lastPage <= 7) {
    return Array.from({ length: lastPage }, (_, index) => index + 1)
  }

  const visible = new Set<number>([
    1,
    lastPage,
    currentPage,
    Math.max(1, currentPage - 1),
    Math.min(lastPage, currentPage + 1),
  ])

  const sorted = [...visible].sort((a, b) => a - b)
  const result: (number | "ellipsis")[] = []

  sorted.forEach((page, index) => {
    if (index > 0 && page - sorted[index - 1] > 1) {
      result.push("ellipsis")
    }
    result.push(page)
  })

  return result
}

export function Pagination({ currentPage, lastPage, onPageChange }: PaginationProps) {
  if (lastPage <= 1) return null

  const pages = buildPageList(currentPage, lastPage)

  return (
    <nav aria-label="Paginación" className="flex items-center justify-center gap-1.5">
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Página anterior"
        className="rounded-lg p-2 text-on-surface-variant transition-colors hover:bg-surface-container disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      {pages.map((page, index) =>
        page === "ellipsis" ? (
          <span key={`ellipsis-${index}`} className="px-2 text-sm text-on-surface-variant">
            …
          </span>
        ) : (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            aria-current={page === currentPage ? "page" : undefined}
            className={clsx(
              "min-w-9 rounded-lg px-3 py-2 text-sm font-semibold transition-colors",
              page === currentPage ? "bg-primary text-white" : "text-on-surface-variant hover:bg-surface-container"
            )}
          >
            {page}
          </button>
        )
      )}
      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === lastPage}
        aria-label="Página siguiente"
        className="rounded-lg p-2 text-on-surface-variant transition-colors hover:bg-surface-container disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  )
}
