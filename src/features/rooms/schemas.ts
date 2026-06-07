import { z } from "zod"

export const roomConfigRowSchema = z.object({
  room_type: z.string().min(1, "Selecciona un tipo de habitación"),
  accommodation: z.string().min(1, "Selecciona una acomodación"),
  quantity: z.coerce
    .number({ error: "Ingresa un número válido" })
    .int("Debe ser un número entero")
    .min(1, "Debe ser al menos 1"),
})

export type RoomConfigRowValues = z.infer<typeof roomConfigRowSchema>
