import { beforeEach, describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { RoomFormModal } from "./RoomFormModal"
import * as catalogsApi from "@/lib/api/catalogsApi"
import * as roomsApi from "@/lib/api/roomsApi"
import * as toastModule from "@/components/ui/Toast"

vi.mock("@/lib/api/catalogsApi", () => ({ useGetRoomTypesQuery: vi.fn() }))
vi.mock("@/lib/api/roomsApi", () => ({ useUpdateRoomMutation: vi.fn() }))
vi.mock("@/components/ui/Toast", () => ({ useToast: vi.fn() }))

const mockedUseGetRoomTypesQuery = vi.mocked(catalogsApi.useGetRoomTypesQuery)
const mockedUseUpdateRoomMutation = vi.mocked(roomsApi.useUpdateRoomMutation)
const mockedUseToast = vi.mocked(toastModule.useToast)

const roomTypes = [
  { value: "Estandar", allowed_accommodations: ["Sencilla", "Doble"] },
  { value: "Suite", allowed_accommodations: ["Triple", "Cuadruple"] },
]

const room = {
  id: 7,
  hotel_id: 1,
  room_type: "Estandar",
  accommodation: "Sencilla",
  quantity: 25,
  created_at: "2026-06-06T17:07:29.000000Z",
  updated_at: "2026-06-06T17:07:29.000000Z",
}

const showToast = vi.fn()

beforeEach(() => {
  vi.clearAllMocks()
  mockedUseGetRoomTypesQuery.mockReturnValue({
    data: roomTypes,
    isLoading: false,
    isError: false,
  } as unknown as ReturnType<typeof catalogsApi.useGetRoomTypesQuery>)
  mockedUseToast.mockReturnValue({ showToast })
})

describe("RoomFormModal", () => {
  it("no renderiza nada cuando no hay habitación seleccionada", () => {
    mockedUseUpdateRoomMutation.mockReturnValue([vi.fn(), { isLoading: false }] as unknown as ReturnType<
      typeof roomsApi.useUpdateRoomMutation
    >)
    render(<RoomFormModal hotelId={1} room={null} onClose={vi.fn()} />)
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
  })

  it("precarga los valores de la habitación seleccionada", () => {
    mockedUseUpdateRoomMutation.mockReturnValue([vi.fn(), { isLoading: false }] as unknown as ReturnType<
      typeof roomsApi.useUpdateRoomMutation
    >)
    render(<RoomFormModal hotelId={1} room={room} onClose={vi.fn()} />)
    expect(screen.getByLabelText("Tipo")).toHaveValue("Estandar")
    expect(screen.getByLabelText("Acomodación")).toHaveValue("Sencilla")
    expect(screen.getByLabelText("Cantidad")).toHaveValue(25)
  })

  it("envía la actualización, notifica y cierra el modal", async () => {
    const updateRoom = vi.fn().mockResolvedValue({ data: { ...room, quantity: 30 } })
    mockedUseUpdateRoomMutation.mockReturnValue([updateRoom, { isLoading: false }] as unknown as ReturnType<
      typeof roomsApi.useUpdateRoomMutation
    >)
    const onClose = vi.fn()
    render(<RoomFormModal hotelId={1} room={room} onClose={onClose} />)

    await userEvent.clear(screen.getByLabelText("Cantidad"))
    await userEvent.type(screen.getByLabelText("Cantidad"), "30")
    await userEvent.click(screen.getByRole("button", { name: "Guardar cambios" }))

    expect(updateRoom).toHaveBeenCalledWith({
      hotelId: 1,
      roomId: 7,
      body: { room_type: "Estandar", accommodation: "Sencilla", quantity: 30 },
    })
    expect(showToast).toHaveBeenCalledWith({ tone: "success", title: "Habitación actualizada correctamente" })
    expect(onClose).toHaveBeenCalledOnce()
  })

  it("muestra el error de campo que devuelve el servidor sin cerrar el modal", async () => {
    const updateRoom = vi.fn().mockResolvedValue({
      error: {
        status: 422,
        data: {
          message: "Ya existe la combinación 'Estandar - Sencilla' para este hotel.",
          errors: { accommodation: ["Ya existe la combinación 'Estandar - Sencilla' para este hotel."] },
        },
      },
    })
    mockedUseUpdateRoomMutation.mockReturnValue([updateRoom, { isLoading: false }] as unknown as ReturnType<
      typeof roomsApi.useUpdateRoomMutation
    >)
    const onClose = vi.fn()
    render(<RoomFormModal hotelId={1} room={room} onClose={onClose} />)

    await userEvent.click(screen.getByRole("button", { name: "Guardar cambios" }))

    expect(await screen.findByText("Ya existe la combinación 'Estandar - Sencilla' para este hotel.")).toBeInTheDocument()
    expect(onClose).not.toHaveBeenCalled()
  })
})
