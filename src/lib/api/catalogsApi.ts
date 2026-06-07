import { baseApi } from "./baseApi"
import type { RoomTypeCatalogEntry } from "@/types/catalog"

export const catalogsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRoomTypes: builder.query<RoomTypeCatalogEntry[], void>({
      query: () => "/catalogs/room-types",
      providesTags: [{ type: "Catalog", id: "ROOM-TYPES" }],
    }),
    getAccommodations: builder.query<string[], void>({
      query: () => "/catalogs/accommodations",
      providesTags: [{ type: "Catalog", id: "ACCOMMODATIONS" }],
    }),
  }),
  overrideExisting: false,
})

export const { useGetRoomTypesQuery, useGetAccommodationsQuery } = catalogsApi
