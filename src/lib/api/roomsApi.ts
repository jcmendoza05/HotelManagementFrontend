import { baseApi } from "./baseApi"
import type { PaginatedResponse } from "@/types/api"
import type { Room, RoomPayload } from "@/types/room"

export function roomListTags(hotelId: number, rooms?: Room[]) {
  const listTag = { type: "Room" as const, id: `LIST-${hotelId}` }
  if (!rooms) {
    return [listTag]
  }
  return [...rooms.map((room) => ({ type: "Room" as const, id: room.id })), listTag]
}

export const roomsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getHotelRooms: builder.query<PaginatedResponse<Room>, { hotelId: number; page?: number }>({
      query: ({ hotelId, page }) => `/hotels/${hotelId}/rooms?page=${page ?? 1}`,
      providesTags: (result, _error, { hotelId }) => roomListTags(hotelId, result?.data),
    }),
    createRoom: builder.mutation<Room, { hotelId: number; body: RoomPayload }>({
      query: ({ hotelId, body }) => ({ url: `/hotels/${hotelId}/rooms`, method: "POST", body }),
      invalidatesTags: (_result, _error, { hotelId }) => [{ type: "Room", id: `LIST-${hotelId}` }],
    }),
    updateRoom: builder.mutation<Room, { hotelId: number; roomId: number; body: RoomPayload }>({
      query: ({ hotelId, roomId, body }) => ({
        url: `/hotels/${hotelId}/rooms/${roomId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { hotelId, roomId }) => [
        { type: "Room", id: roomId },
        { type: "Room", id: `LIST-${hotelId}` },
      ],
    }),
    deleteRoom: builder.mutation<{ message: string }, { hotelId: number; roomId: number }>({
      query: ({ hotelId, roomId }) => ({ url: `/hotels/${hotelId}/rooms/${roomId}`, method: "DELETE" }),
      invalidatesTags: (_result, _error, { hotelId, roomId }) => [
        { type: "Room", id: roomId },
        { type: "Room", id: `LIST-${hotelId}` },
      ],
    }),
  }),
  overrideExisting: false,
})

export const {
  useGetHotelRoomsQuery,
  useCreateRoomMutation,
  useUpdateRoomMutation,
  useDeleteRoomMutation,
} = roomsApi
