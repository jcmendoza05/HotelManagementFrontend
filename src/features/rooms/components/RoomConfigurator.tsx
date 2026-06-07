"use client"

import { useEffect, useMemo } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { z } from "zod"
import { PlusCircle } from "lucide-react"
import { useGetRoomTypesQuery } from "@/lib/api/catalogsApi"
import { SelectField, TextField } from "@/components/ui/FormField"
import { Button } from "@/components/ui/Button"
import { Skeleton } from "@/components/ui/Skeleton"
import { allowedAccommodationsFor } from "../rules"
import { roomConfigRowSchema, type RoomConfigRowValues } from "../schemas"

interface RoomConfiguratorProps {
  onAddRow: (row: RoomConfigRowValues) => void
}

export function RoomConfigurator({ onAddRow }: RoomConfiguratorProps) {
  const { data: roomTypes, isLoading, isError } = useGetRoomTypesQuery()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<z.input<typeof roomConfigRowSchema>, unknown, RoomConfigRowValues>({
    resolver: zodResolver(roomConfigRowSchema),
    defaultValues: { room_type: "", accommodation: "", quantity: 1 },
  })

  const selectedType = watch("room_type")

  const accommodationOptions = useMemo(
    () => allowedAccommodationsFor(selectedType, roomTypes ?? []),
    [selectedType, roomTypes]
  )

  useEffect(() => {
    setValue("accommodation", "")
  }, [selectedType, setValue])

  function submit(values: RoomConfigRowValues) {
    onAddRow(values)
    reset({ room_type: values.room_type, accommodation: "", quantity: 1 })
  }

  if (isLoading) {
    return <Skeleton className="h-44 w-full" />
  }

  if (isError || !roomTypes) {
    return <p className="text-sm text-error">No se pudo cargar el catálogo de tipos de habitación.</p>
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SelectField
          label="Tipo"
          placeholder="Selecciona un tipo"
          error={errors.room_type?.message}
          options={roomTypes.map((entry) => ({ value: entry.value, label: entry.value }))}
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
      </div>
      <Button type="submit" variant="secondary" className="self-start">
        <PlusCircle className="h-4 w-4" />
        Asignar a configuración
      </Button>
    </form>
  )
}
