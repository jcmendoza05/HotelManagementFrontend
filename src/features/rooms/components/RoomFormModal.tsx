"use client"

import { useEffect, useMemo } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { z } from "zod"
import { Save } from "lucide-react"
import { Modal } from "@/components/ui/Modal"
import { SelectField, TextField } from "@/components/ui/FormField"
import { Button } from "@/components/ui/Button"
import { useToast } from "@/components/ui/Toast"
import { useGetRoomTypesQuery } from "@/lib/api/catalogsApi"
import { useUpdateRoomMutation } from "@/lib/api/roomsApi"
import { mapApiError } from "@/lib/api/errors"
import { allowedAccommodationsFor } from "../rules"
import { roomConfigRowSchema, type RoomConfigRowValues } from "../schemas"
import type { Room } from "@/types/room"

interface RoomFormModalProps {
  hotelId: number
  room: Room | null
  onClose: () => void
}

export function RoomFormModal({ hotelId, room, onClose }: RoomFormModalProps) {
  const { data: roomTypes } = useGetRoomTypesQuery()
  const [updateRoom, { isLoading }] = useUpdateRoomMutation()
  const { showToast } = useToast()

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setError,
    formState: { errors },
  } = useForm<z.input<typeof roomConfigRowSchema>, unknown, RoomConfigRowValues>({
    resolver: zodResolver(roomConfigRowSchema),
    defaultValues: { room_type: "", accommodation: "", quantity: 1 },
  })

  useEffect(() => {
    if (room) {
      reset({ room_type: room.room_type, accommodation: room.accommodation, quantity: room.quantity })
    }
  }, [room, reset])

  const selectedType = watch("room_type")

  const accommodationOptions = useMemo(
    () => allowedAccommodationsFor(selectedType, roomTypes ?? []),
    [selectedType, roomTypes]
  )

  async function submit(values: RoomConfigRowValues) {
    if (!room) return

    const result = await updateRoom({ hotelId, roomId: room.id, body: values })

    if ("error" in result) {
      const normalized = mapApiError(result.error)
      const fields = Object.keys(normalized.fieldErrors)
      if (fields.length > 0) {
        fields.forEach((field) => {
          if (field in roomConfigRowSchema.shape) {
            setError(field as keyof RoomConfigRowValues, { type: "server", message: normalized.fieldErrors[field][0] })
          }
        })
      } else {
        setError("accommodation", { type: "server", message: normalized.message })
      }
      return
    }

    showToast({ tone: "success", title: "Habitación actualizada correctamente" })
    onClose()
  }

  return (
    <Modal open={room !== null} onClose={onClose} title="Editar habitación">
      <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-4">
        <SelectField
          label="Tipo"
          placeholder="Selecciona un tipo"
          error={errors.room_type?.message}
          options={(roomTypes ?? []).map((entry) => ({ value: entry.value, label: entry.value }))}
          {...register("room_type")}
        />
        <SelectField
          label="Acomodación"
          placeholder={selectedType ? "Selecciona una acomodación" : "Primero elige un tipo"}
          error={errors.accommodation?.message}
          disabled={accommodationOptions.length === 0}
          options={accommodationOptions.map((option) => ({ value: option, label: option }))}
          {...register("accommodation")}
        />
        <TextField label="Cantidad" type="number" min={1} error={errors.quantity?.message} {...register("quantity")} />
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="cta" disabled={isLoading}>
            <Save className="h-4 w-4" />
            Guardar cambios
          </Button>
        </div>
      </form>
    </Modal>
  )
}
