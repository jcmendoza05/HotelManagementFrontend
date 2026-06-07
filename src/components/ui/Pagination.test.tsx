import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { buildPageList, Pagination } from "./Pagination"

describe("buildPageList", () => {
  it("lista todas las páginas cuando son pocas", () => {
    expect(buildPageList(1, 4)).toEqual([1, 2, 3, 4])
  })

  it("colapsa el rango central con puntos suspensivos cuando hay muchas páginas", () => {
    expect(buildPageList(5, 20)).toEqual([1, "ellipsis", 4, 5, 6, "ellipsis", 20])
  })

  it("no duplica los extremos cerca de los bordes", () => {
    expect(buildPageList(1, 10)).toEqual([1, 2, "ellipsis", 10])
    expect(buildPageList(10, 10)).toEqual([1, "ellipsis", 9, 10])
  })
})

describe("Pagination", () => {
  it("no renderiza nada cuando hay una sola página", () => {
    const { container } = render(<Pagination currentPage={1} lastPage={1} onPageChange={vi.fn()} />)
    expect(container).toBeEmptyDOMElement()
  })

  it("resalta la página actual", () => {
    render(<Pagination currentPage={2} lastPage={5} onPageChange={vi.fn()} />)
    expect(screen.getByRole("button", { name: "2" })).toHaveAttribute("aria-current", "page")
  })

  it("deshabilita el botón anterior en la primera página", () => {
    render(<Pagination currentPage={1} lastPage={5} onPageChange={vi.fn()} />)
    expect(screen.getByRole("button", { name: "Página anterior" })).toBeDisabled()
  })

  it("notifica el cambio de página al hacer clic en un número", async () => {
    const onPageChange = vi.fn()
    render(<Pagination currentPage={1} lastPage={5} onPageChange={onPageChange} />)
    await userEvent.click(screen.getByRole("button", { name: "3" }))
    expect(onPageChange).toHaveBeenCalledWith(3)
  })
})
