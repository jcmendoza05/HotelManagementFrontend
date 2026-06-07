import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { HotelFilters } from "./HotelFilters"

describe("HotelFilters", () => {
  const baseProps = {
    search: "",
    onSearchChange: vi.fn(),
    city: "",
    onCityChange: vi.fn(),
    cityOptions: ["Bogotá", "Cartagena"],
    view: "grid" as const,
    onViewChange: vi.fn(),
    total: 2,
  }

  it("notifica cambios en el campo de búsqueda", async () => {
    const onSearchChange = vi.fn()
    render(<HotelFilters {...baseProps} onSearchChange={onSearchChange} />)
    await userEvent.type(screen.getByLabelText("Buscar"), "a")
    expect(onSearchChange).toHaveBeenCalled()
  })

  it("lista las ciudades disponibles en el filtro", () => {
    render(<HotelFilters {...baseProps} />)
    expect(screen.getByRole("option", { name: "Bogotá" })).toBeInTheDocument()
    expect(screen.getByRole("option", { name: "Cartagena" })).toBeInTheDocument()
  })

  it("notifica el cambio de vista al presionar los botones de alternancia", async () => {
    const onViewChange = vi.fn()
    render(<HotelFilters {...baseProps} onViewChange={onViewChange} />)
    await userEvent.click(screen.getByRole("button", { name: "Ver en lista" }))
    expect(onViewChange).toHaveBeenCalledWith("list")
  })

  it("marca la vista activa con aria-pressed", () => {
    render(<HotelFilters {...baseProps} view="list" />)
    expect(screen.getByRole("button", { name: "Ver en lista" })).toHaveAttribute("aria-pressed", "true")
    expect(screen.getByRole("button", { name: "Ver en cuadrícula" })).toHaveAttribute("aria-pressed", "false")
  })
})
