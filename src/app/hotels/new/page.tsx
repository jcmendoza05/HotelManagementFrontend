"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { z } from "zod"
import { Save } from "lucide-react"
import { Card } from "@/components/ui/Card"
import { TextField } from "@/components/ui/FormField"
import { Button } from "@/components/ui/Button"
import { useToast } from "@/components/ui/Toast"
import { RoomConfigurator } from "@/features/rooms/components/RoomConfigurator"
import { RoomSummaryTable } from "@/features/rooms/components/RoomSummaryTable"
import { exceedsCapacity } from "@/features/rooms/rules"
import { useCreateHotelWithRooms } from "@/features/hotels/hooks/useCreateHotelWithRooms"
import { hotelFormSchema, type HotelFormValues } from "@/features/hotels/schemas"
import type { RoomConfigRowValues } from "@/features/rooms/schemas"

interface ConfiguredRoom extends RoomConfigRowValues {
  key: string
}

let nextRowKey = 1

export default function NewHotelPage() {
  const router = useRouter()
  const { showToast } = useToast()
  const { submit, isSubmitting } = useCreateHotelWithRooms()

  const [rows, setRows] = useState<ConfiguredRoom[]>([])
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm<z.input<typeof hotelFormSchema>, unknown, HotelFormValues>({
    resolver: zodResolver(hotelFormSchema),
    defaultValues: { name: "", city: "", address: "", nit: "", max_rooms: 1 },
  })

  const maxRooms = Number(watch("max_rooms")) || 0

  function addRow(row: RoomConfigRowValues) {
    setRows((current) => [...current, { ...row, key: String(nextRowKey++) }])
  }

  function removeRow(key: string) {
    setRows((current) => current.filter((row) => row.key !== key))
  }

  async function onSubmit(values: HotelFormValues) {
    setSubmitError(null)

    if (rows.length === 0) {
      setSubmitError("Configura al menos una combinación de tipo y acomodación antes de continuar.")
      return
    }

    if (exceedsCapacity(rows, values.max_rooms)) {
      setSubmitError("El total de habitaciones configuradas supera el número máximo permitido para este hotel.")
      return
    }

    const outcome = await submit(values, rows)

    if (!outcome.ok) {
      setSubmitError(outcome.error.message)
      Object.entries(outcome.error.fieldErrors).forEach(([field, messages]) => {
        if (field in hotelFormSchema.shape) {
          setError(field as keyof HotelFormValues, { type: "server", message: messages[0] })
        }
      })
      return
    }

    if (outcome.result.failedRooms.length > 0) {
      showToast({
        tone: "error",
        title: "Hotel creado con habitaciones pendientes",
        description: `${outcome.result.failedRooms.length} combinación(es) no se guardaron. Complétalas desde "Administrar".`,
      })
    } else {
      showToast({ tone: "success", title: "Hotel registrado correctamente" })
    }

    router.push(`/hotels/${outcome.result.hotelId}`)
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-semibold text-on-surface">Registro de Propiedad</h1>
        <p className="text-on-surface-variant">Completa los tres pasos para dar de alta un nuevo hotel Decameron.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[2fr_1fr] xl:items-start">
          <div className="flex flex-col gap-6">
            <Card className="p-6">
              <h2 className="mb-4 text-xl font-semibold text-on-surface">1. Información básica</h2>
              <div className="flex flex-col gap-5">
                <TextField label="Nombre del hotel" error={errors.name?.message} {...register("name")} />
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <TextField label="Ciudad" error={errors.city?.message} {...register("city")} />
                  <TextField label="NIT" error={errors.nit?.message} {...register("nit")} />
                </div>
                <TextField label="Dirección" error={errors.address?.message} {...register("address")} />
                <TextField
                  label="Número máximo de habitaciones"
                  type="number"
                  min={1}
                  error={errors.max_rooms?.message}
                  {...register("max_rooms")}
                />
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="mb-4 text-xl font-semibold text-on-surface">2. Configurar tipos de habitación</h2>
              <RoomConfigurator onAddRow={addRow} />
            </Card>
          </div>

          <Card className="flex flex-col p-6 xl:sticky xl:top-24">
            <h2 className="mb-4 text-xl font-semibold text-on-surface">3. Resumen de habitaciones</h2>
            <RoomSummaryTable rows={rows} maxRooms={maxRooms} onRemove={removeRow} />
          </Card>
        </div>

        {submitError ? (
          <p className="rounded-xl bg-error-container px-4 py-3 text-sm text-on-error-container">{submitError}</p>
        ) : null}

        <Button type="submit" variant="cta" disabled={isSubmitting} className="self-start">
          <Save className="h-4 w-4" />
          Finalizar y Registrar Hotel
        </Button>
      </form>
    </div>
  )
}
