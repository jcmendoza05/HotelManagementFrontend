import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { ToastProvider, useToast } from "./Toast"

function Trigger() {
  const { showToast } = useToast()
  return (
    <button
      type="button"
      onClick={() =>
        showToast({ tone: "success", title: "Hotel creado", description: "Se guardó correctamente" })
      }
    >
      Disparar
    </button>
  )
}

describe("ToastProvider", () => {
  it("muestra un toast cuando se llama a showToast", async () => {
    render(
      <ToastProvider>
        <Trigger />
      </ToastProvider>
    )
    await userEvent.click(screen.getByRole("button", { name: "Disparar" }))
    expect(await screen.findByText("Hotel creado")).toBeInTheDocument()
    expect(screen.getByText("Se guardó correctamente")).toBeInTheDocument()
  })

  it("retira el toast al presionar su botón de cerrar", async () => {
    render(
      <ToastProvider>
        <Trigger />
      </ToastProvider>
    )
    await userEvent.click(screen.getByRole("button", { name: "Disparar" }))
    await screen.findByText("Hotel creado")
    await userEvent.click(screen.getByRole("button", { name: "Cerrar notificación" }))
    expect(screen.queryByText("Hotel creado")).not.toBeInTheDocument()
  })

  it("lanza un error si se usa fuera del proveedor", () => {
    function Lonely() {
      useToast()
      return null
    }
    expect(() => render(<Lonely />)).toThrow("useToast debe usarse dentro de ToastProvider")
  })
})
