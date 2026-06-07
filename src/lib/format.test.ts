import { describe, expect, it } from "vitest"
import { formatHotelCode } from "./format"

describe("formatHotelCode", () => {
  it("rellena con ceros los ids de un dígito", () => {
    expect(formatHotelCode(1)).toBe("HOT-001")
  })

  it("rellena con ceros los ids de dos dígitos", () => {
    expect(formatHotelCode(42)).toBe("HOT-042")
  })

  it("no recorta los ids que ya tienen tres dígitos", () => {
    expect(formatHotelCode(247)).toBe("HOT-247")
  })

  it("no trunca los ids con más de tres dígitos", () => {
    expect(formatHotelCode(10342)).toBe("HOT-10342")
  })
})
