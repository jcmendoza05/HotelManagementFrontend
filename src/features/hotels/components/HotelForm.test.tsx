import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { HotelForm } from "./HotelForm"

describe("HotelForm", () => {
  it("muestra errores de validación cuando se envía vacío", async () => {
    const onSubmit = vi.fn()
    render(<HotelForm isSubmitting={false} submitLabel="Guardar" onSubmit={onSubmit} />)
    await userEvent.click(screen.getByRole("button", { name: /Guardar/ }))
    expect(await screen.findByText("El nombre es obligatorio")).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it("envía los valores capturados cuando son válidos", async () => {
    const onSubmit = vi.fn()
    render(<HotelForm isSubmitting={false} submitLabel="Guardar" onSubmit={onSubmit} />)

    await userEvent.type(screen.getByLabelText("Nombre del hotel"), "Decameron Cartagena")
    await userEvent.type(screen.getByLabelText("Ciudad"), "Cartagena")
    await userEvent.type(screen.getByLabelText("NIT"), "12345678-9")
    await userEvent.type(screen.getByLabelText("Dirección"), "Calle 23 58-25")
    await userEvent.clear(screen.getByLabelText("Número máximo de habitaciones"))
    await userEvent.type(screen.getByLabelText("Número máximo de habitaciones"), "42")
    await userEvent.click(screen.getByRole("button", { name: /Guardar/ }))

    expect(onSubmit).toHaveBeenCalledWith(
      {
        name: "Decameron Cartagena",
        city: "Cartagena",
        nit: "12345678-9",
        address: "Calle 23 58-25",
        max_rooms: 42,
      },
      expect.anything()
    )
  })

  it("muestra los errores de validación enviados por el servidor", async () => {
    render(
      <HotelForm
        isSubmitting={false}
        submitLabel="Guardar"
        fieldErrors={{ nit: ["El NIT ya está registrado"] }}
        onSubmit={vi.fn()}
      />
    )
    expect(await screen.findByText("El NIT ya está registrado")).toBeInTheDocument()
  })
})
