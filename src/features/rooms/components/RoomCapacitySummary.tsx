import clsx from "clsx"
import { sumRoomQuantities } from "../rules"

interface RoomCapacitySummaryProps {
  rooms: { quantity: number }[]
  maxRooms: number
}

export function RoomCapacitySummary({ rooms, maxRooms }: RoomCapacitySummaryProps) {
  const configured = sumRoomQuantities(rooms)
  const available = Math.max(maxRooms - configured, 0)
  const exceeded = configured > maxRooms
  const fillPercentage = maxRooms > 0 ? Math.min((configured / maxRooms) * 100, 100) : 0

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-outline-variant/60 bg-surface-container-low px-5 py-4">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-semibold text-on-surface">Capacidad de habitaciones</p>
        <p className="text-sm text-on-surface-variant">
          <span className="text-base font-semibold text-on-surface">{configured}</span> de {maxRooms} configuradas
        </p>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-surface-container">
        <div
          className={clsx("h-full rounded-full transition-[width]", exceeded ? "bg-error" : "bg-tertiary-container")}
          style={{ width: `${fillPercentage}%` }}
        />
      </div>
      <p className={clsx("text-sm font-medium", exceeded ? "text-error" : "text-on-surface-variant")}>
        {exceeded
          ? `Te pasaste por ${configured - maxRooms} habitaciones de la capacidad máxima del hotel.`
          : available === 0
            ? "Ya asignaste toda la capacidad del hotel. No puedes agregar más habitaciones."
            : `Te quedan ${available} habitaciones disponibles para asignar.`}
      </p>
    </div>
  )
}
