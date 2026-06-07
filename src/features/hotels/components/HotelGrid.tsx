import { Building2 } from "lucide-react"
import { EmptyState } from "@/components/ui/EmptyState"
import { Skeleton } from "@/components/ui/Skeleton"
import { AddPropertyCard } from "./AddPropertyCard"
import { HotelCard } from "./HotelCard"
import type { Hotel } from "@/types/hotel"

type ViewMode = "grid" | "list"

interface HotelGridProps {
  hotels: Hotel[]
  view: ViewMode
  isLoading: boolean
  hasActiveFilters: boolean
  onQuickView: (hotel: Hotel) => void
  onClearFilters: () => void
}

const layoutClasses: Record<ViewMode, string> = {
  grid: "grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3",
  list: "flex flex-col gap-4",
}

export function HotelGrid({ hotels, view, isLoading, hasActiveFilters, onQuickView, onClearFilters }: HotelGridProps) {
  if (isLoading) {
    return (
      <div className={layoutClasses[view]}>
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-56 w-full" />
        ))}
      </div>
    )
  }

  if (hotels.length === 0) {
    return (
      <EmptyState
        icon={Building2}
        title={hasActiveFilters ? "Ningún hotel coincide con tu búsqueda" : "Aún no hay hoteles registrados"}
        description={
          hasActiveFilters
            ? "Ajusta los filtros o límpialos para ver el resto del portafolio cargado."
            : "Registra tu primer hotel para empezar a administrar habitaciones."
        }
        actionLabel={hasActiveFilters ? "Limpiar filtros" : undefined}
        onAction={hasActiveFilters ? onClearFilters : undefined}
      />
    )
  }

  return (
    <div className={layoutClasses[view]}>
      {hotels.map((hotel) => (
        <HotelCard key={hotel.id} hotel={hotel} onQuickView={onQuickView} />
      ))}
      {view === "grid" ? <AddPropertyCard /> : null}
    </div>
  )
}
