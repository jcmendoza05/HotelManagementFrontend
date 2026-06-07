import { Trash2 } from "lucide-react"
import clsx from "clsx"
import { Chip } from "@/components/ui/Chip"
import { roomTypeTone, sumRoomQuantities } from "../rules"
import type { RoomConfigRowValues } from "../schemas"

interface RoomSummaryRow extends RoomConfigRowValues {
  key: string
}

interface RoomSummaryTableProps {
  rows: RoomSummaryRow[]
  maxRooms: number
  onRemove: (key: string) => void
}

export function RoomSummaryTable({ rows, maxRooms, onRemove }: RoomSummaryTableProps) {
  const total = sumRoomQuantities(rows)
  const exceeded = total > maxRooms

  return (
    <div className="flex flex-col gap-3">
      {rows.length === 0 ? (
        <p className="rounded-xl border border-dashed border-outline-variant px-4 py-8 text-center text-sm text-on-surface-variant">
          Aún no has asignado combinaciones de habitaciones.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {rows.map((row) => (
            <li
              key={row.key}
              className="flex items-center justify-between gap-3 rounded-xl border border-outline-variant/60 px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <Chip label={row.room_type} tone={roomTypeTone(row.room_type)} />
                <span className="text-sm text-on-surface-variant">{row.accommodation}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-on-surface">{row.quantity} habitaciones</span>
                <button
                  type="button"
                  aria-label={`Eliminar ${row.room_type} ${row.accommodation}`}
                  onClick={() => onRemove(row.key)}
                  className="rounded-lg p-1.5 text-error transition-colors hover:bg-error-container/40"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div
        className={clsx(
          "flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold",
          exceeded ? "bg-error-container text-on-error-container" : "bg-secondary-container text-on-secondary-container"
        )}
      >
        <span>Total configurado</span>
        <span>
          {total} / {maxRooms} habitaciones
        </span>
      </div>
      {exceeded ? (
        <p className="text-sm text-error">
          El total supera la capacidad máxima del hotel. Ajusta las cantidades antes de continuar.
        </p>
      ) : null}
    </div>
  )
}
