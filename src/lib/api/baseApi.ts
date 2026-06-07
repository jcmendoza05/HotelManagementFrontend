import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    prepareHeaders: (headers) => {
      headers.set("Accept", "application/json")
      return headers
    },
  }),
  tagTypes: ["Hotel", "Room", "Catalog"],
  endpoints: () => ({}),
})
