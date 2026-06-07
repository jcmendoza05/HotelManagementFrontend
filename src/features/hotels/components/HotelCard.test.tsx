import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { HotelCard } from "./HotelCard"
import type { Hotel } from "@/types/hotel"

const hotel: Hotel = {
  id: 7,
  name: "Decameron Cartagena",
  address: "Calle 23 58-25",
  city: "Cartagena",
  nit: "12345678-9",
  max_rooms: 42,
  created_at: "2026-06-06T17:07:29.000000Z",
  updated_at: "2026-06-06T17:07:29.000000Z",
}

describe("HotelCard", () => {
  it("muestra el código derivado del id y los datos del hotel", () => {
    render(<HotelCard hotel={hotel} onQuickView={vi.fn()} />)
    expect(screen.getByText("HOT-007")).toBeInTheDocument()
    expect(screen.getByText("Decameron Cartagena")).toBeInTheDocument()
    expect(screen.getByText(/Calle 23 58-25, Cartagena/)).toBeInTheDocument()
    expect(screen.getByText("NIT")).toBeInTheDocument()
    expect(screen.getByText("12345678-9")).toBeInTheDocument()
    expect(screen.getByText("Capacidad")).toBeInTheDocument()
    expect(screen.getByText(/42 habitaciones/)).toBeInTheDocument()
  })

  it("enlaza el botón Administrar a la página del hotel", () => {
    render(<HotelCard hotel={hotel} onQuickView={vi.fn()} />)
    expect(screen.getByRole("link", { name: "Administrar" })).toHaveAttribute("href", "/hotels/7")
  })

  it("llama a onQuickView con el hotel al presionar el ícono de ojo", async () => {
    const onQuickView = vi.fn()
    render(<HotelCard hotel={hotel} onQuickView={onQuickView} />)
    await userEvent.click(screen.getByRole("button", { name: "Vista rápida de Decameron Cartagena" }))
    expect(onQuickView).toHaveBeenCalledWith(hotel)
  })
})
