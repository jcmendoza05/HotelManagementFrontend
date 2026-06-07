export interface Hotel {
  id: number
  name: string
  address: string
  city: string
  nit: string
  max_rooms: number
  created_at: string
  updated_at: string
}

export interface HotelPayload {
  name: string
  address: string
  city: string
  nit: string
  max_rooms: number
}
