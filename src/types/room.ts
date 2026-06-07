export interface Room {
  id: number
  hotel_id: number
  room_type: string
  accommodation: string
  quantity: number
  created_at: string
  updated_at: string
}

export interface RoomPayload {
  room_type: string
  accommodation: string
  quantity: number
}
