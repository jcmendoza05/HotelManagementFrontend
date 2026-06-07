export function formatHotelCode(id: number): string {
  return `HOT-${String(id).padStart(3, "0")}`
}
