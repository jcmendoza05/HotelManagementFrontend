"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { z } from "zod"
import { Save } from "lucide-react"
import { TextField } from "@/components/ui/FormField"
import { Button } from "@/components/ui/Button"
import { hotelFormSchema, type HotelFormValues } from "../schemas"
import type { Hotel } from "@/types/hotel"

interface HotelFormProps {
  defaultValues?: Hotel
  fieldErrors?: Record<string, string[]>
  isSubmitting: boolean
  submitLabel: string
  onSubmit: (values: HotelFormValues) => void
}

export function HotelForm({ defaultValues, fieldErrors, isSubmitting, submitLabel, onSubmit }: HotelFormProps) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<z.input<typeof hotelFormSchema>, unknown, HotelFormValues>({
    resolver: zodResolver(hotelFormSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      city: defaultValues?.city ?? "",
      address: defaultValues?.address ?? "",
      nit: defaultValues?.nit ?? "",
      max_rooms: defaultValues?.max_rooms ?? 1,
    },
  })

  useEffect(() => {
    if (!fieldErrors) return
    Object.entries(fieldErrors).forEach(([field, messages]) => {
      if (field in hotelFormSchema.shape) {
        setError(field as keyof HotelFormValues, { type: "server", message: messages[0] })
      }
    })
  }, [fieldErrors, setError])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
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
      <Button type="submit" variant="cta" disabled={isSubmitting} className="self-start">
        <Save className="h-4 w-4" />
        {submitLabel}
      </Button>
    </form>
  )
}
