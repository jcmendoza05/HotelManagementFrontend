import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { RoomSummaryTable } from "./RoomSummaryTable"

const rows = [
  { key: "1", room_type: "Estandar", accommodation: "Sencilla", quantity: 25 },
  { key: "2", room_type: "Suite", accommodation: "Triple", quantity: 10 },
]

describe("RoomSummaryTable", () => {
  it("muestra el total configurado frente a la capacidad del hotel", () => {
    render(<RoomSummaryTable rows={rows} maxRooms={42} onRemove={vi.fn()} />)
    expect(screen.getByText("35 / 42 habitaciones")).toBeInTheDocument()
  })

  it("marca visualmente cuando el total supera la capacidad", () => {
    render(<RoomSummaryTable rows={rows} maxRooms={30} onRemove={vi.fn()} />)
    expect(screen.getByText(/supera la capacidad máxima/)).toBeInTheDocument()
  })

  it("llama a onRemove con la fila correcta", async () => {
    const onRemove = vi.fn()
    render(<RoomSummaryTable rows={rows} maxRooms={42} onRemove={onRemove} />)
    await userEvent.click(screen.getByRole("button", { name: "Eliminar Estandar Sencilla" }))
    expect(onRemove).toHaveBeenCalledWith("1")
  })

  it("muestra un mensaje cuando no hay filas configuradas", () => {
    render(<RoomSummaryTable rows={[]} maxRooms={42} onRemove={vi.fn()} />)
    expect(screen.getByText("Aún no has asignado combinaciones de habitaciones.")).toBeInTheDocument()
  })
})
