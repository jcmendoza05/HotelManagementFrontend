"use client"

import { BedDouble, Landmark, MapPin } from "lucide-react"
import { Modal } from "@/components/ui/Modal"
import { Skeleton } from "@/components/ui/Skeleton"
import { Chip } from "@/components/ui/Chip"
import { useGetHotelQuery } from "@/lib/api/hotelsApi"
import { useGetHotelRoomsQuery } from "@/lib/api/roomsApi"
import { formatHotelCode } from "@/lib/format"
import { roomTypeTone } from "@/features/rooms/rules"
import type { Hotel } from "@/types/hotel"

interface HotelQuickViewModalProps {
  hotel: Hotel | null
  onClose: () => void
}

export function HotelQuickViewModal({ hotel, onClose }: HotelQuickViewModalProps) {
  const skip = hotel === null
  const { data: freshHotel, isLoading: isLoadingHotel } = useGetHotelQuery(hotel?.id ?? 0, { skip })
  const { data: roomsPage, isLoading: isLoadingRooms } = useGetHotelRoomsQuery({ hotelId: hotel?.id ?? 0 }, { skip })

  const displayedHotel = freshHotel ?? hotel
  const rooms = roomsPage?.data ?? []

  return (
    <Modal open={hotel !== null} onClose={onClose} title="Vista rápida del hotel" size="lg">
      {displayedHotel ? (
        <div className="flex flex-col gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-secondary">
              {formatHotelCode(displayedHotel.id)}
            </p>
            <h3 className="text-xl font-semibold text-on-surface">{displayedHotel.name}</h3>
            <div className="mt-3 flex flex-col gap-2 text-sm text-on-surface-variant">
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                {displayedHotel.address}, {displayedHotel.city}
              </p>
              <p className="flex items-center gap-2">
                <Landmark className="h-4 w-4 text-primary" />
                NIT {displayedHotel.nit}
              </p>
              <p className="flex items-center gap-2">
                <BedDouble className="h-4 w-4 text-primary" />
                Capacidad para {displayedHotel.max_rooms} habitaciones
              </p>
            </div>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-on-surface-variant">
              Habitaciones configuradas
            </h4>
            {isLoadingRooms ? (
              <div className="flex flex-col gap-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : rooms.length === 0 ? (
              <p className="text-sm text-on-surface-variant">Este hotel todavía no tiene habitaciones configuradas.</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {rooms.map((room) => (
                  <li
                    key={room.id}
                    className="flex items-center justify-between rounded-xl border border-outline-variant/60 px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <Chip label={room.room_type} tone={roomTypeTone(room.room_type)} />
                      <span className="text-sm text-on-surface-variant">{room.accommodation}</span>
                    </div>
                    <span className="text-sm font-semibold text-on-surface">{room.quantity} habitaciones</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ) : isLoadingHotel ? (
        <Skeleton className="h-40 w-full" />
      ) : null}
    </Modal>
  )
}
