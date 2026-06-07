import { LayoutGrid, List, SlidersHorizontal } from "lucide-react"
import clsx from "clsx"
import { SelectField, TextField } from "@/components/ui/FormField"

type ViewMode = "grid" | "list"

interface HotelFiltersProps {
  search: string
  onSearchChange: (value: string) => void
  city: string
  onCityChange: (value: string) => void
  cityOptions: string[]
  view: ViewMode
  onViewChange: (view: ViewMode) => void
  total: number
}

export function HotelFilters({
  search,
  onSearchChange,
  city,
  onCityChange,
  cityOptions,
  view,
  onViewChange,
  total,
}: HotelFiltersProps) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-outline-variant/60 bg-surface-container-lowest p-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex flex-1 flex-col gap-4 sm:flex-row">
        <div className="flex-1">
          <TextField
            label="Buscar"
            name="search"
            placeholder="Filtrar por nombre o NIT..."
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </div>
        <div className="sm:w-56">
          <SelectField
            label="Ciudad"
            name="city"
            placeholder="Todas las Ciudades"
            value={city}
            onChange={(event) => onCityChange(event.target.value)}
            options={cityOptions.map((option) => ({ value: option, label: option }))}
          />
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3 self-start sm:flex-nowrap sm:self-auto">
        <span className="whitespace-nowrap rounded-full border border-outline-variant bg-surface-container-low px-4 py-2 text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
          Total: {total} Hoteles
        </span>
        <SlidersHorizontal className="hidden h-4 w-4 shrink-0 text-on-surface-variant sm:block" />
        <div className="flex shrink-0 overflow-hidden rounded-lg border border-outline-variant">
          <button
            type="button"
            aria-label="Ver en cuadrícula"
            aria-pressed={view === "grid"}
            onClick={() => onViewChange("grid")}
            className={clsx(
              "p-2.5 transition-colors",
              view === "grid" ? "bg-primary text-white" : "text-on-surface-variant hover:bg-surface-container"
            )}
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Ver en lista"
            aria-pressed={view === "list"}
            onClick={() => onViewChange("list")}
            className={clsx(
              "p-2.5 transition-colors",
              view === "list" ? "bg-primary text-white" : "text-on-surface-variant hover:bg-surface-container"
            )}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
