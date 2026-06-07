"use client"

import Link from "next/link"
import { Hotel, LayoutGrid, Plus, X } from "lucide-react"

interface MobileNavProps {
  open: boolean
  onClose: () => void
}

export function MobileNav({ open, onClose }: MobileNavProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-40 lg:hidden">
      <button
        type="button"
        aria-label="Cerrar menú"
        onClick={onClose}
        className="absolute inset-0 bg-on-surface/40"
      />
      <div className="absolute inset-y-0 left-0 flex w-72 flex-col bg-primary px-5 py-6 text-on-primary shadow-[0_24px_48px_-12px_rgba(24,28,30,0.35)]">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-tertiary-container text-primary">
              <LayoutGrid className="h-5 w-5" />
            </span>
            <span className="text-lg font-bold tracking-tight">HotelManager</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="rounded-full p-1.5 text-white/70 hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-5 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-tertiary-container text-sm font-bold text-on-tertiary-container">
            DA
          </span>
          <div className="flex flex-col">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-white/60">Administrador</span>
            <span className="text-sm font-semibold text-white">Hoteles Decameron</span>
          </div>
        </div>

        <Link
          href="/hotels"
          onClick={onClose}
          className="flex items-center gap-3 rounded-xl bg-tertiary-container px-3.5 py-2.5 text-sm font-semibold text-on-tertiary-container"
        >
          <Hotel className="h-5 w-5" />
          Gestión de Hoteles
        </Link>
        <Link
          href="/hotels/new"
          onClick={onClose}
          className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-white/20 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
        >
          <Plus className="h-4 w-4" />
          Agregar Nuevo Hotel
        </Link>
      </div>
    </div>
  )
}
