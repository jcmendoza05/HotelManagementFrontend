import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Button } from "./Button"

describe("Button", () => {
  it("renderiza su contenido", () => {
    render(<Button>Guardar</Button>)
    expect(screen.getByRole("button", { name: "Guardar" })).toBeInTheDocument()
  })

  it("llama a onClick al presionarlo", async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Guardar</Button>)
    await userEvent.click(screen.getByRole("button", { name: "Guardar" }))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it("no llama a onClick si está deshabilitado", async () => {
    const onClick = vi.fn()
    render(
      <Button onClick={onClick} disabled>
        Guardar
      </Button>
    )
    await userEvent.click(screen.getByRole("button", { name: "Guardar" }))
    expect(onClick).not.toHaveBeenCalled()
  })

  it("usa type=button por defecto para no enviar formularios sin querer", () => {
    render(<Button>Guardar</Button>)
    expect(screen.getByRole("button", { name: "Guardar" })).toHaveAttribute("type", "button")
  })
})
