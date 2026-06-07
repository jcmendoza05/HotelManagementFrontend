"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Pencil, Trash2 } from "lucide-react"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Modal } from "@/components/ui/Modal"
import { Chip } from "@/components/ui/Chip"
import { Skeleton } from "@/components/ui/Skeleton"
import { EmptyState } from "@/components/ui/EmptyState"
import { Pagination } from "@/components/ui/Pagination"
import { useToast } from "@/components/ui/Toast"
import { HotelForm } from "@/features/hotels/components/HotelForm"
import { RoomCapacitySummary } from "@/features/rooms/components/RoomCapacitySummary"
import { RoomConfigurator } from "@/features/rooms/components/RoomConfigurator"
import { RoomFormModal } from "@/features/rooms/components/RoomFormModal"
import { roomTypeTone } from "@/features/rooms/rules"
import { mapApiError } from "@/lib/api/errors"
import { formatHotelCode } from "@/lib/format"
import { useGetHotelQuery, useUpdateHotelMutation, useDeleteHotelMutation } from "@/lib/api/hotelsApi"
import { useGetHotelRoomsQuery, useCreateRoomMutation, useDeleteRoomMutation } from "@/lib/api/roomsApi"
import type { HotelFormValues } from "@/features/hotels/schemas"
import type { RoomConfigRowValues } from "@/features/rooms/schemas"
import type { Room } from "@/types/room"

export default function ManageHotelPage() {
  const params = useParams<{ id: string }>()
  const hotelId = Number(params.id)
  const router = useRouter()
  const { showToast } = useToast()

  const [roomsPage, setRoomsPage] = useState(1)
  const [editingRoom, setEditingRoom] = useState<Room | null>(null)
  const [deletingRoom, setDeletingRoom] = useState<Room | null>(null)
  const [isDeleteHotelOpen, setIsDeleteHotelOpen] = useState(false)
  const [hotelFieldErrors, setHotelFieldErrors] = useState<Record<string, string[]>>({})

  const { data: hotel, isLoading: isLoadingHotel, isError: isHotelError } = useGetHotelQuery(hotelId)
  const {
    data: roomsData,
    isLoading: isLoadingRooms,
    isError: isRoomsError,
  } = useGetHotelRoomsQuery({ hotelId, page: roomsPage })
  const [updateHotel, { isLoading: isUpdatingHotel }] = useUpdateHotelMutation()
  const [deleteHotel, { isLoading: isDeletingHotel }] = useDeleteHotelMutation()
  const [createRoom] = useCreateRoomMutation()
  const [deleteRoom, { isLoading: isDeletingRoom }] = useDeleteRoomMutation()

  const rooms = roomsData?.data ?? []

  async function handleHotelSubmit(values: HotelFormValues) {
    setHotelFieldErrors({})
    const result = await updateHotel({ id: hotelId, body: values })
    if ("error" in result) {
      setHotelFieldErrors(mapApiError(result.error).fieldErrors)
      return
    }
    showToast({ tone: "success", title: "Datos del hotel actualizados" })
  }

  async function handleAddRoom(row: RoomConfigRowValues) {
    const result = await createRoom({ hotelId, body: row })
    if ("error" in result) {
      showToast({
        tone: "error",
        title: "No se pudo agregar la habitación",
        description: mapApiError(result.error).message,
      })
      return
    }
    showToast({ tone: "success", title: "Habitación agregada correctamente" })
  }

  async function confirmDeleteRoom() {
    if (!deletingRoom) return
    const result = await deleteRoom({ hotelId, roomId: deletingRoom.id })
    setDeletingRoom(null)
    if ("error" in result) {
      showToast({
        tone: "error",
        title: "No se pudo eliminar la habitación",
        description: mapApiError(result.error).message,
      })
      return
    }
    showToast({ tone: "success", title: "Habitación eliminada correctamente" })
  }

  async function confirmDeleteHotel() {
    const result = await deleteHotel(hotelId)
    if ("error" in result) {
      setIsDeleteHotelOpen(false)
      showToast({
        tone: "error",
        title: "No se pudo eliminar el hotel",
        description: mapApiError(result.error).message,
      })
      return
    }
    showToast({ tone: "success", title: "Hotel eliminado correctamente" })
    router.push("/hotels")
  }

  if (isLoadingHotel) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-12 w-72" />
        <Skeleton className="h-72 w-full" />
      </div>
    )
  }

  if (isHotelError || !hotel) {
    return (
      <EmptyState
        title="No se pudo cargar el hotel"
        description="Revisa la conexión con el servidor o vuelve al portafolio para intentarlo de nuevo."
        actionLabel="Volver a Hoteles"
        onAction={() => router.push("/hotels")}
      />
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-secondary">{formatHotelCode(hotel.id)}</p>
          <h1 className="text-3xl font-semibold text-on-surface">{hotel.name}</h1>
          <p className="text-on-surface-variant">
            {hotel.address}, {hotel.city}
          </p>
        </div>
        <Button variant="danger" onClick={() => setIsDeleteHotelOpen(true)}>
          <Trash2 className="h-4 w-4" />
          Eliminar hotel
        </Button>
      </div>

      <Card className="p-6">
        <h2 className="mb-4 text-xl font-semibold text-on-surface">Información básica</h2>
        <HotelForm
          defaultValues={hotel}
          fieldErrors={hotelFieldErrors}
          isSubmitting={isUpdatingHotel}
          submitLabel="Guardar cambios"
          onSubmit={handleHotelSubmit}
        />
      </Card>

      <Card className="p-6">
        <h2 className="mb-4 text-xl font-semibold text-on-surface">Habitaciones configuradas</h2>
        {isLoadingRooms ? (
          <div className="flex flex-col gap-2">
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
          </div>
        ) : isRoomsError ? (
          <EmptyState
            title="No se pudieron cargar las habitaciones"
            description="Ocurrió un problema al consultar el listado. Intenta recargar la página en unos minutos."
          />
        ) : rooms.length === 0 ? (
          <EmptyState
            title="Sin habitaciones configuradas"
            description="Agrega tipos y acomodaciones desde el formulario de abajo."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                  <th className="px-4 py-3">Tipo</th>
                  <th className="px-4 py-3">Acomodación</th>
                  <th className="px-4 py-3">Cantidad</th>
                  <th className="px-4 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((room, index) => (
                  <tr key={room.id} className={index % 2 === 1 ? "bg-surface-container-low" : undefined}>
                    <td className="px-4 py-3">
                      <Chip label={room.room_type} tone={roomTypeTone(room.room_type)} />
                    </td>
                    <td className="px-4 py-3 text-on-surface-variant">{room.accommodation}</td>
                    <td className="px-4 py-3 font-semibold text-on-surface">{room.quantity}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          aria-label={`Editar ${room.room_type} ${room.accommodation}`}
                          onClick={() => setEditingRoom(room)}
                          className="rounded-lg p-1.5 text-secondary transition-colors hover:bg-secondary/10"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          aria-label={`Eliminar ${room.room_type} ${room.accommodation}`}
                          onClick={() => setDeletingRoom(room)}
                          className="rounded-lg p-1.5 text-error transition-colors hover:bg-error-container/40"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {roomsData && roomsData.last_page > 1 ? (
          <div className="mt-6">
            <Pagination currentPage={roomsData.current_page} lastPage={roomsData.last_page} onPageChange={setRoomsPage} />
          </div>
        ) : null}
      </Card>

      <Card className="p-6">
        <h2 className="mb-4 text-xl font-semibold text-on-surface">Agregar nueva combinación</h2>
        <div className="mb-6">
          <RoomCapacitySummary rooms={rooms} maxRooms={hotel.max_rooms} />
        </div>
        <RoomConfigurator onAddRow={handleAddRoom} />
      </Card>

      <RoomFormModal hotelId={hotelId} room={editingRoom} onClose={() => setEditingRoom(null)} />

      <Modal
        open={deletingRoom !== null}
        onClose={() => setDeletingRoom(null)}
        title="Eliminar habitación"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeletingRoom(null)}>
              Cancelar
            </Button>
            <Button variant="danger" disabled={isDeletingRoom} onClick={confirmDeleteRoom}>
              <Trash2 className="h-4 w-4" />
              Eliminar
            </Button>
          </>
        }
      >
        {deletingRoom ? (
          <p className="text-on-surface-variant">
            ¿Seguro que deseas eliminar la combinación{" "}
            <strong>
              {deletingRoom.room_type} - {deletingRoom.accommodation}
            </strong>
            ? Esta acción no se puede deshacer.
          </p>
        ) : null}
      </Modal>

      <Modal
        open={isDeleteHotelOpen}
        onClose={() => setIsDeleteHotelOpen(false)}
        title="Eliminar hotel"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsDeleteHotelOpen(false)}>
              Cancelar
            </Button>
            <Button variant="danger" disabled={isDeletingHotel} onClick={confirmDeleteHotel}>
              <Trash2 className="h-4 w-4" />
              Eliminar hotel
            </Button>
          </>
        }
      >
        <p className="text-on-surface-variant">
          Esta acción eliminará <strong>{hotel.name}</strong> junto con toda su configuración de habitaciones. Esta
          operación no se puede deshacer.
        </p>
      </Modal>
    </div>
  )
}
