import Link from "next/link"
import { BedDouble, Eye, Hotel as HotelIcon, Landmark, MapPin } from "lucide-react"
import { Card } from "@/components/ui/Card"
import { formatHotelCode } from "@/lib/format"
import type { Hotel } from "@/types/hotel"

interface HotelCardProps {
  hotel: Hotel
  onQuickView: (hotel: Hotel) => void
}

export function HotelCard({ hotel, onQuickView }: HotelCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden">
      <div className="flex items-start justify-between gap-3 bg-primary px-5 py-4 text-white">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-on-primary-container">
            {formatHotelCode(hotel.id)}
          </p>
          <h3 className="text-lg font-semibold">{hotel.name}</h3>
        </div>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-tertiary-container">
          <HotelIcon className="h-4 w-4" />
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-4 px-5 py-5 text-sm">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-container/15 text-primary">
            <MapPin className="h-4 w-4" />
          </span>
          <div className="flex flex-col">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant/70">
              Dirección
            </span>
            <span className="font-medium text-on-surface">
              {hotel.address}, {hotel.city}
            </span>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-container/15 text-primary">
            <Landmark className="h-4 w-4" />
          </span>
          <div className="flex flex-col">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant/70">NIT</span>
            <span className="font-medium text-on-surface">{hotel.nit}</span>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-container/15 text-primary">
            <BedDouble className="h-4 w-4" />
          </span>
          <div className="flex flex-col">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant/70">
              Capacidad
            </span>
            <span className="font-medium text-on-surface">{hotel.max_rooms} habitaciones</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 border-t border-outline-variant/60 px-5 py-4">
        <Link
          href={`/hotels/${hotel.id}`}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-primary-container"
        >
          Administrar
        </Link>
        <button
          type="button"
          aria-label={`Vista rápida de ${hotel.name}`}
          onClick={() => onQuickView(hotel)}
          className="rounded-lg border border-outline-variant px-3 py-2.5 text-on-surface-variant transition-colors hover:bg-surface-container"
        >
          <Eye className="h-4 w-4" />
        </button>
      </div>
    </Card>
  )
}
