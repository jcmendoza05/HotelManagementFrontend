import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import { RoomCapacitySummary } from "./RoomCapacitySummary"

const rooms = [{ quantity: 20 }, { quantity: 12 }]

describe("RoomCapacitySummary", () => {
  it("muestra cuántas habitaciones hay configuradas frente al máximo del hotel", () => {
    render(<RoomCapacitySummary rooms={rooms} maxRooms={50} />)
    expect(screen.getByText("32")).toBeInTheDocument()
    expect(screen.getByText(/de 50 configuradas/)).toBeInTheDocument()
  })

  it("indica cuántas habitaciones quedan disponibles para seguir asignando", () => {
    render(<RoomCapacitySummary rooms={rooms} maxRooms={50} />)
    expect(screen.getByText("Te quedan 18 habitaciones disponibles para asignar.")).toBeInTheDocument()
  })

  it("avisa cuando ya se asignó toda la capacidad del hotel", () => {
    render(<RoomCapacitySummary rooms={[{ quantity: 50 }]} maxRooms={50} />)
    expect(
      screen.getByText("Ya asignaste toda la capacidad del hotel. No puedes agregar más habitaciones.")
    ).toBeInTheDocument()
  })

  it("marca cuando el total configurado supera la capacidad máxima", () => {
    render(<RoomCapacitySummary rooms={[{ quantity: 60 }]} maxRooms={50} />)
    expect(
      screen.getByText("Te pasaste por 10 habitaciones de la capacidad máxima del hotel.")
    ).toBeInTheDocument()
  })
})
