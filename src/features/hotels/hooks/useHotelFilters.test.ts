import { describe, expect, it } from "vitest"
import { act, renderHook } from "@testing-library/react"
import { useHotelFilters } from "./useHotelFilters"
import type { Hotel } from "@/types/hotel"

function makeHotel(overrides: Partial<Hotel>): Hotel {
  return {
    id: 1,
    name: "Decameron Cartagena",
    address: "Calle 23 58-25",
    city: "Cartagena",
    nit: "12345678-9",
    max_rooms: 42,
    created_at: "2026-06-06T17:07:29.000000Z",
    updated_at: "2026-06-06T17:07:29.000000Z",
    ...overrides,
  }
}

const hotels = [
  makeHotel({ id: 1, name: "Decameron Cartagena", city: "Cartagena", nit: "12345678-9" }),
  makeHotel({ id: 2, name: "Decameron Barú", city: "Cartagena", nit: "98765432-1" }),
  makeHotel({ id: 3, name: "Royal Decameron Bogotá", city: "Bogotá", nit: "55555555-5" }),
]

describe("useHotelFilters", () => {
  it("devuelve todos los hoteles cuando no hay filtros activos", () => {
    const { result } = renderHook(() => useHotelFilters(hotels))
    expect(result.current.filteredHotels).toHaveLength(3)
  })

  it("filtra por nombre sin importar mayúsculas", () => {
    const { result } = renderHook(() => useHotelFilters(hotels))
    act(() => result.current.setSearch("barú"))
    expect(result.current.filteredHotels.map((hotel) => hotel.id)).toEqual([2])
  })

  it("filtra por NIT", () => {
    const { result } = renderHook(() => useHotelFilters(hotels))
    act(() => result.current.setSearch("98765432"))
    expect(result.current.filteredHotels.map((hotel) => hotel.id)).toEqual([2])
  })

  it("filtra por ciudad", () => {
    const { result } = renderHook(() => useHotelFilters(hotels))
    act(() => result.current.setCity("Bogotá"))
    expect(result.current.filteredHotels.map((hotel) => hotel.id)).toEqual([3])
  })

  it("combina búsqueda y ciudad", () => {
    const { result } = renderHook(() => useHotelFilters(hotels))
    act(() => {
      result.current.setSearch("decameron")
      result.current.setCity("Cartagena")
    })
    expect(result.current.filteredHotels.map((hotel) => hotel.id)).toEqual([1, 2])
  })

  it("deriva las opciones de ciudad sin duplicados y ordenadas alfabéticamente", () => {
    const { result } = renderHook(() => useHotelFilters(hotels))
    expect(result.current.cityOptions).toEqual(["Bogotá", "Cartagena"])
  })
})
