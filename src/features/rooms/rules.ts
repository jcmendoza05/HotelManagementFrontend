import type { RoomTypeCatalogEntry } from "@/types/catalog"
import type { RoomPayload } from "@/types/room"

export type ChipTone = "primary" | "secondary" | "tertiary" | "neutral"

const roomTypeTones: Record<string, ChipTone> = {
  Estandar: "secondary",
  Junior: "primary",
  Suite: "tertiary",
}

export function roomTypeTone(roomType: string): ChipTone {
  return roomTypeTones[roomType] ?? "neutral"
}

export function allowedAccommodationsFor(roomType: string, catalog: RoomTypeCatalogEntry[]): string[] {
  return catalog.find((entry) => entry.value === roomType)?.allowed_accommodations ?? []
}

export function isAllowedCombination(
  roomType: string,
  accommodation: string,
  catalog: RoomTypeCatalogEntry[]
): boolean {
  return allowedAccommodationsFor(roomType, catalog).includes(accommodation)
}

export function sumRoomQuantities(rows: Pick<RoomPayload, "quantity">[]): number {
  return rows.reduce((total, row) => total + row.quantity, 0)
}

export function exceedsCapacity(rows: Pick<RoomPayload, "quantity">[], maxRooms: number): boolean {
  return sumRoomQuantities(rows) > maxRooms
}
