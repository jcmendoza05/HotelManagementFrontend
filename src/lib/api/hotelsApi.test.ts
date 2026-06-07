import { describe, expect, it } from "vitest"
import { hotelListTags } from "./hotelsApi"
import type { Hotel } from "@/types/hotel"

const hotel: Hotel = {
  id: 1,
  name: "Decameron Cartagena",
  address: "Calle 23 58-25",
  city: "Cartagena",
  nit: "12345678-9",
  max_rooms: 42,
  created_at: "2026-06-06T17:07:29.000000Z",
  updated_at: "2026-06-06T17:07:29.000000Z",
}

describe("hotelListTags", () => {
  it("etiqueta cada hotel de la página y la lista", () => {
    expect(hotelListTags([hotel, { ...hotel, id: 2 }])).toEqual([
      { type: "Hotel", id: 1 },
      { type: "Hotel", id: 2 },
      { type: "Hotel", id: "LIST" },
    ])
  })

  it("solo etiqueta la lista mientras no hay datos", () => {
    expect(hotelListTags(undefined)).toEqual([{ type: "Hotel", id: "LIST" }])
  })

  it("también etiqueta la lista cuando la página llega vacía", () => {
    expect(hotelListTags([])).toEqual([{ type: "Hotel", id: "LIST" }])
  })
})
