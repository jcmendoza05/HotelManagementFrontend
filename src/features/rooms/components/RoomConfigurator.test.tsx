import { beforeEach, describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { RoomConfigurator } from "./RoomConfigurator"
import * as catalogsApi from "@/lib/api/catalogsApi"

vi.mock("@/lib/api/catalogsApi", () => ({
  useGetRoomTypesQuery: vi.fn(),
}))

const mockedUseGetRoomTypesQuery = vi.mocked(catalogsApi.useGetRoomTypesQuery)

const roomTypes = [
  { value: "Estandar", allowed_accommodations: ["Sencilla", "Doble"] },
  { value: "Junior", allowed_accommodations: ["Triple", "Cuadruple"] },
]

beforeEach(() => {
  mockedUseGetRoomTypesQuery.mockReturnValue({
    data: roomTypes,
    isLoading: false,
    isError: false,
  } as unknown as ReturnType<typeof catalogsApi.useGetRoomTypesQuery>)
})

describe("RoomConfigurator", () => {
  it("limita las acomodaciones a las permitidas por el tipo elegido", async () => {
    render(<RoomConfigurator onAddRow={vi.fn()} />)
    await userEvent.selectOptions(screen.getByLabelText("Tipo"), "Junior")
    expect(screen.getByRole("option", { name: "Triple" })).toBeInTheDocument()
    expect(screen.queryByRole("option", { name: "Sencilla" })).not.toBeInTheDocument()
  })

  it("agrega la fila y limpia acomodación y cantidad al enviar", async () => {
    const onAddRow = vi.fn()
    render(<RoomConfigurator onAddRow={onAddRow} />)

    await userEvent.selectOptions(screen.getByLabelText("Tipo"), "Estandar")
    await userEvent.selectOptions(screen.getByLabelText("Acomodación"), "Doble")
    await userEvent.clear(screen.getByLabelText("Cantidad"))
    await userEvent.type(screen.getByLabelText("Cantidad"), "10")
    await userEvent.click(screen.getByRole("button", { name: /Asignar a configuración/ }))

    expect(onAddRow).toHaveBeenCalledWith({ room_type: "Estandar", accommodation: "Doble", quantity: 10 })
  })

  it("muestra un error si se intenta asignar sin elegir tipo", async () => {
    render(<RoomConfigurator onAddRow={vi.fn()} />)
    await userEvent.click(screen.getByRole("button", { name: /Asignar a configuración/ }))
    expect(await screen.findByText("Selecciona un tipo de habitación")).toBeInTheDocument()
  })
})
