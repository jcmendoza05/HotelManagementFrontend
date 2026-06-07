import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Modal } from "./Modal"

describe("Modal", () => {
  it("no renderiza nada cuando está cerrado", () => {
    render(
      <Modal open={false} onClose={vi.fn()} title="Detalle del hotel">
        Contenido
      </Modal>
    )
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
  })

  it("muestra título y contenido cuando está abierto", () => {
    render(
      <Modal open onClose={vi.fn()} title="Detalle del hotel">
        Contenido
      </Modal>
    )
    expect(screen.getByRole("dialog", { name: "Detalle del hotel" })).toBeInTheDocument()
    expect(screen.getByText("Contenido")).toBeInTheDocument()
  })

  it("llama a onClose al presionar el botón de cerrar", async () => {
    const onClose = vi.fn()
    render(
      <Modal open onClose={onClose} title="Detalle del hotel">
        Contenido
      </Modal>
    )
    await userEvent.click(screen.getByRole("button", { name: "Cerrar" }))
    expect(onClose).toHaveBeenCalledOnce()
  })

  it("llama a onClose al presionar Escape", async () => {
    const onClose = vi.fn()
    render(
      <Modal open onClose={onClose} title="Detalle del hotel">
        Contenido
      </Modal>
    )
    await userEvent.keyboard("{Escape}")
    expect(onClose).toHaveBeenCalledOnce()
  })
})
