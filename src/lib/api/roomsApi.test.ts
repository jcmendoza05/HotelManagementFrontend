import { describe, expect, it } from "vitest"
import { roomListTags } from "./roomsApi"
import type { Room } from "@/types/room"

const room: Room = {
  id: 1,
  hotel_id: 1,
  room_type: "Estandar",
  accommodation: "Sencilla",
  quantity: 25,
  created_at: "2026-06-06T17:07:29.000000Z",
  updated_at: "2026-06-06T17:07:29.000000Z",
}

describe("roomListTags", () => {
  it("etiqueta cada habitación del hotel y una etiqueta de lista por hotel", () => {
    expect(roomListTags(1, [room, { ...room, id: 2 }])).toEqual([
      { type: "Room", id: 1 },
      { type: "Room", id: 2 },
      { type: "Room", id: "LIST-1" },
    ])
  })

  it("solo etiqueta la lista del hotel mientras no hay datos", () => {
    expect(roomListTags(1, undefined)).toEqual([{ type: "Room", id: "LIST-1" }])
  })

  it("usa una etiqueta de lista distinta por cada hotel", () => {
    expect(roomListTags(2, undefined)).toEqual([{ type: "Room", id: "LIST-2" }])
  })
})
