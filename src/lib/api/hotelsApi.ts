import { baseApi } from "./baseApi"
import type { PaginatedResponse } from "@/types/api"
import type { Hotel, HotelPayload } from "@/types/hotel"

export function hotelListTags(hotels?: Hotel[]) {
  const listTag = { type: "Hotel" as const, id: "LIST" as const }
  if (!hotels) {
    return [listTag]
  }
  return [...hotels.map((hotel) => ({ type: "Hotel" as const, id: hotel.id })), listTag]
}

export const hotelsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getHotels: builder.query<PaginatedResponse<Hotel>, number | void>({
      query: (page) => `/hotels?page=${page ?? 1}`,
      providesTags: (result) => hotelListTags(result?.data),
    }),
    getHotel: builder.query<Hotel, number>({
      query: (id) => `/hotels/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Hotel", id }],
    }),
    createHotel: builder.mutation<Hotel, HotelPayload>({
      query: (body) => ({ url: "/hotels", method: "POST", body }),
      invalidatesTags: [{ type: "Hotel", id: "LIST" }],
    }),
    updateHotel: builder.mutation<Hotel, { id: number; body: HotelPayload }>({
      query: ({ id, body }) => ({ url: `/hotels/${id}`, method: "PUT", body }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Hotel", id },
        { type: "Hotel", id: "LIST" },
      ],
    }),
    deleteHotel: builder.mutation<{ message: string }, number>({
      query: (id) => ({ url: `/hotels/${id}`, method: "DELETE" }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Hotel", id },
        { type: "Hotel", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: false,
})

export const {
  useGetHotelsQuery,
  useGetHotelQuery,
  useCreateHotelMutation,
  useUpdateHotelMutation,
  useDeleteHotelMutation,
} = hotelsApi
