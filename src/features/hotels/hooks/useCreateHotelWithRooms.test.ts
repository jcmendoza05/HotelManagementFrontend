import { beforeEach, describe, expect, it, vi } from "vitest"
import { act, renderHook } from "@testing-library/react"
import { useCreateHotelWithRooms } from "./useCreateHotelWithRooms"
import * as hotelsApi from "@/lib/api/hotelsApi"
import * as roomsApi from "@/lib/api/roomsApi"

vi.mock("@/lib/api/hotelsApi", () => ({ useCreateHotelMutation: vi.fn() }))
vi.mock("@/lib/api/roomsApi", () => ({ useCreateRoomMutation: vi.fn() }))

const mockedUseCreateHotelMutation = vi.mocked(hotelsApi.useCreateHotelMutation)
const mockedUseCreateRoomMutation = vi.mocked(roomsApi.useCreateRoomMutation)

const hotelPayload = { name: "Decameron", address: "Calle 1", city: "Cali", nit: "123", max_rooms: 10 }
const rooms = [
  { room_type: "Estandar", accommodation: "Sencilla", quantity: 5 },
  { room_type: "Suite", accommodation: "Triple", quantity: 3 },
]
const createdHotel = { id: 9, ...hotelPayload, created_at: "", updated_at: "" }

beforeEach(() => {
  vi.clearAllMocks()
})

describe("useCreateHotelWithRooms", () => {
  it("crea el hotel y luego cada habitación en secuencia", async () => {
    const createHotel = vi.fn().mockResolvedValue({ data: createdHotel })
    const createRoom = vi.fn().mockResolvedValue({ data: {} })
    mockedUseCreateHotelMutation.mockReturnValue([createHotel, {}] as unknown as ReturnType<typeof hotelsApi.useCreateHotelMutation>)
    mockedUseCreateRoomMutation.mockReturnValue([createRoom, {}] as unknown as ReturnType<typeof roomsApi.useCreateRoomMutation>)

    const { result } = renderHook(() => useCreateHotelWithRooms())

    let outcome: Awaited<ReturnType<typeof result.current.submit>> | undefined
    await act(async () => {
      outcome = await result.current.submit(hotelPayload, rooms)
    })

    expect(createHotel).toHaveBeenCalledWith(hotelPayload)
    expect(createRoom).toHaveBeenNthCalledWith(1, { hotelId: 9, body: rooms[0] })
    expect(createRoom).toHaveBeenNthCalledWith(2, { hotelId: 9, body: rooms[1] })
    expect(outcome).toEqual({ ok: true, result: { hotelId: 9, failedRooms: [] } })
  })

  it("no intenta crear habitaciones cuando falla la creación del hotel", async () => {
    const createHotel = vi.fn().mockResolvedValue({
      error: {
        status: 422,
        data: { message: "El NIT ya está registrado", errors: { nit: ["El NIT ya está registrado"] } },
      },
    })
    const createRoom = vi.fn()
    mockedUseCreateHotelMutation.mockReturnValue([createHotel, {}] as unknown as ReturnType<typeof hotelsApi.useCreateHotelMutation>)
    mockedUseCreateRoomMutation.mockReturnValue([createRoom, {}] as unknown as ReturnType<typeof roomsApi.useCreateRoomMutation>)

    const { result } = renderHook(() => useCreateHotelWithRooms())

    let outcome: Awaited<ReturnType<typeof result.current.submit>> | undefined
    await act(async () => {
      outcome = await result.current.submit(hotelPayload, rooms)
    })

    expect(createRoom).not.toHaveBeenCalled()
    expect(outcome).toEqual({
      ok: false,
      error: {
        stage: "hotel",
        message: "El NIT ya está registrado",
        fieldErrors: { nit: ["El NIT ya está registrado"] },
      },
    })
  })

  it("reporta qué habitaciones fallaron sin perder el hotel ya creado", async () => {
    const createHotel = vi.fn().mockResolvedValue({ data: createdHotel })
    const createRoom = vi
      .fn()
      .mockResolvedValueOnce({ data: {} })
      .mockResolvedValueOnce({ error: { status: 422, data: { message: "Combinación no permitida", errors: {} } } })
    mockedUseCreateHotelMutation.mockReturnValue([createHotel, {}] as unknown as ReturnType<typeof hotelsApi.useCreateHotelMutation>)
    mockedUseCreateRoomMutation.mockReturnValue([createRoom, {}] as unknown as ReturnType<typeof roomsApi.useCreateRoomMutation>)

    const { result } = renderHook(() => useCreateHotelWithRooms())

    let outcome: Awaited<ReturnType<typeof result.current.submit>> | undefined
    await act(async () => {
      outcome = await result.current.submit(hotelPayload, rooms)
    })

    expect(outcome).toEqual({
      ok: true,
      result: { hotelId: 9, failedRooms: [{ row: rooms[1], message: "Combinación no permitida" }] },
    })
  })
})
