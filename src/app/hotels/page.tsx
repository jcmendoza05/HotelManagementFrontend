"use client"

import { useState } from "react"
import { TriangleAlert } from "lucide-react"
import { useGetHotelsQuery } from "@/lib/api/hotelsApi"
import { useHotelFilters } from "@/features/hotels/hooks/useHotelFilters"
import { HotelFilters } from "@/features/hotels/components/HotelFilters"
import { HotelGrid } from "@/features/hotels/components/HotelGrid"
import { HotelQuickViewModal } from "@/features/hotels/components/HotelQuickViewModal"
import { Button } from "@/components/ui/Button"
import { Pagination } from "@/components/ui/Pagination"
import { mapApiError } from "@/lib/api/errors"
import type { Hotel } from "@/types/hotel"

type ViewMode = "grid" | "list"

export default function HotelsPage() {
  const [page, setPage] = useState(1)
  const [view, setView] = useState<ViewMode>("grid")
  const [quickViewHotel, setQuickViewHotel] = useState<Hotel | null>(null)

  const { data, isLoading, isFetching, isError, error, refetch } = useGetHotelsQuery(page)
  const hotels = data?.data ?? []
  const { search, setSearch, city, setCity, cityOptions, filteredHotels } = useHotelFilters(hotels)
  const hasActiveFilters = search.trim().length > 0 || city.length > 0

  function clearFilters() {
    setSearch("")
    setCity("")
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-semibold text-on-surface">Portafolio de Hoteles</h1>
        <p className="text-on-surface-variant">
          Administra las propiedades registradas y su capacidad de habitaciones.
        </p>
      </div>

      <HotelFilters
        search={search}
        onSearchChange={setSearch}
        city={city}
        onCityChange={setCity}
        cityOptions={cityOptions}
        view={view}
        onViewChange={setView}
        total={data?.total ?? hotels.length}
      />

      {isError ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-error-container bg-error-container/40 px-6 py-12 text-center">
          <TriangleAlert className="h-8 w-8 text-error" />
          <p className="font-semibold text-on-error-container">{mapApiError(error).message}</p>
          <Button variant="danger" onClick={() => refetch()}>
            Reintentar
          </Button>
        </div>
      ) : (
        <>
          <HotelGrid
            hotels={filteredHotels}
            view={view}
            isLoading={isLoading || isFetching}
            hasActiveFilters={hasActiveFilters}
            onQuickView={setQuickViewHotel}
            onClearFilters={clearFilters}
          />
          {data ? (
            <Pagination currentPage={data.current_page} lastPage={data.last_page} onPageChange={setPage} />
          ) : null}
        </>
      )}

      <HotelQuickViewModal hotel={quickViewHotel} onClose={() => setQuickViewHotel(null)} />
    </div>
  )
}
