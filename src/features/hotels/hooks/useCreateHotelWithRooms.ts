import { useState } from "react"
import { useCreateHotelMutation } from "@/lib/api/hotelsApi"
import { useCreateRoomMutation } from "@/lib/api/roomsApi"
import { mapApiError } from "@/lib/api/errors"
import type { HotelPayload } from "@/types/hotel"
import type { RoomPayload } from "@/types/room"

interface FailedRoom {
  row: RoomPayload
  message: string
}

interface SuccessOutcome {
  ok: true
  result: { hotelId: number; failedRooms: FailedRoom[] }
}

interface FailureOutcome {
  ok: false
  error: { stage: "hotel"; message: string; fieldErrors: Record<string, string[]> }
}

export function useCreateHotelWithRooms() {
  const [createHotel] = useCreateHotelMutation()
  const [createRoom] = useCreateRoomMutation()
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function submit(hotelPayload: HotelPayload, rooms: RoomPayload[]): Promise<SuccessOutcome | FailureOutcome> {
    setIsSubmitting(true)
    try {
      const hotelResult = await createHotel(hotelPayload)

      if ("error" in hotelResult) {
        const normalized = mapApiError(hotelResult.error)
        return {
          ok: false,
          error: { stage: "hotel", message: normalized.message, fieldErrors: normalized.fieldErrors },
        }
      }

      const hotelId = hotelResult.data.id
      const failedRooms: FailedRoom[] = []

      for (const room of rooms) {
        const roomResult = await createRoom({ hotelId, body: room })
        if ("error" in roomResult) {
          failedRooms.push({ row: room, message: mapApiError(roomResult.error).message })
        }
      }

      return { ok: true, result: { hotelId, failedRooms } }
    } finally {
      setIsSubmitting(false)
    }
  }

  return { submit, isSubmitting }
}
