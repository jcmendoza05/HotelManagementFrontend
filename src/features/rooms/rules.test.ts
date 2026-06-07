import { describe, expect, it } from "vitest"
import {
  allowedAccommodationsFor,
  exceedsCapacity,
  isAllowedCombination,
  roomTypeTone,
  sumRoomQuantities,
} from "./rules"
import type { RoomTypeCatalogEntry } from "@/types/catalog"

const catalog: RoomTypeCatalogEntry[] = [
  { value: "Estandar", allowed_accommodations: ["Sencilla", "Doble"] },
  { value: "Junior", allowed_accommodations: ["Triple", "Cuadruple"] },
  { value: "Suite", allowed_accommodations: ["Sencilla", "Doble", "Triple"] },
]

describe("roomTypeTone", () => {
  it("asigna un tono conocido a cada tipo del catálogo", () => {
    expect(roomTypeTone("Estandar")).toBe("secondary")
    expect(roomTypeTone("Junior")).toBe("primary")
    expect(roomTypeTone("Suite")).toBe("tertiary")
  })

  it("usa un tono neutral para tipos desconocidos", () => {
    expect(roomTypeTone("Penthouse")).toBe("neutral")
  })
})

describe("allowedAccommodationsFor", () => {
  it("devuelve las acomodaciones permitidas para el tipo", () => {
    expect(allowedAccommodationsFor("Junior", catalog)).toEqual(["Triple", "Cuadruple"])
  })

  it("devuelve un arreglo vacío si el tipo no existe en el catálogo", () => {
    expect(allowedAccommodationsFor("Penthouse", catalog)).toEqual([])
  })
})

describe("isAllowedCombination", () => {
  it("acepta combinaciones presentes en el catálogo", () => {
    expect(isAllowedCombination("Suite", "Triple", catalog)).toBe(true)
  })

  it("rechaza combinaciones no permitidas", () => {
    expect(isAllowedCombination("Estandar", "Triple", catalog)).toBe(false)
  })
})

describe("sumRoomQuantities", () => {
  it("suma las cantidades de todas las filas", () => {
    expect(sumRoomQuantities([{ quantity: 10 }, { quantity: 5 }, { quantity: 2 }])).toBe(17)
  })

  it("devuelve cero para una lista vacía", () => {
    expect(sumRoomQuantities([])).toBe(0)
  })
})

describe("exceedsCapacity", () => {
  it("detecta cuando la suma supera el máximo del hotel", () => {
    expect(exceedsCapacity([{ quantity: 30 }, { quantity: 20 }], 42)).toBe(true)
  })

  it("no marca exceso cuando la suma es igual o menor al máximo", () => {
    expect(exceedsCapacity([{ quantity: 30 }, { quantity: 12 }], 42)).toBe(false)
  })
})
