import { useMemo, useState } from "react"
import type { Hotel } from "@/types/hotel"

export function useHotelFilters(hotels: Hotel[]) {
  const [search, setSearch] = useState("")
  const [city, setCity] = useState("")

  const cityOptions = useMemo(
    () => Array.from(new Set(hotels.map((hotel) => hotel.city))).sort((a, b) => a.localeCompare(b)),
    [hotels]
  )

  const filteredHotels = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()
    return hotels.filter((hotel) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        hotel.name.toLowerCase().includes(normalizedSearch) ||
        hotel.nit.toLowerCase().includes(normalizedSearch)
      const matchesCity = city.length === 0 || hotel.city === city
      return matchesSearch && matchesCity
    })
  }, [hotels, search, city])

  return { search, setSearch, city, setCity, cityOptions, filteredHotels }
}
