import { z } from "zod"

export const hotelFormSchema = z.object({
  name: z.string().trim().min(1, "El nombre es obligatorio"),
  city: z.string().trim().min(1, "La ciudad es obligatoria"),
  address: z.string().trim().min(1, "La dirección es obligatoria"),
  nit: z.string().trim().min(1, "El NIT es obligatorio"),
  max_rooms: z.coerce
    .number({ error: "Ingresa un número válido" })
    .int("Debe ser un número entero")
    .min(1, "Debe ser al menos 1"),
})

export type HotelFormValues = z.infer<typeof hotelFormSchema>
