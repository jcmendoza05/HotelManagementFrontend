import Link from "next/link"
import { Plus } from "lucide-react"

export function AddPropertyCard() {
  return (
    <Link
      href="/hotels/new"
      className="flex min-h-[260px] flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-outline-variant px-6 py-10 text-center text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-container/15 text-primary">
        <Plus className="h-6 w-6" />
      </span>
      <span className="text-sm font-semibold">Añadir Nueva Propiedad</span>
    </Link>
  )
}
