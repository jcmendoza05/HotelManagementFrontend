"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Hotel, LayoutGrid, Plus } from "lucide-react"
import clsx from "clsx"

export function Sidebar() {
  const pathname = usePathname()
  const hotelManagementActive = pathname.startsWith("/hotels")

  return (
    <aside className="hidden w-72 shrink-0 flex-col bg-primary px-5 py-6 text-on-primary lg:flex">
      <div className="flex items-center gap-2.5 px-1">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-tertiary-container text-primary">
          <LayoutGrid className="h-5 w-5" />
        </span>
        <span className="text-lg font-bold tracking-tight">HotelManager</span>
      </div>

      <div className="mt-6 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-tertiary-container text-sm font-bold text-on-tertiary-container">
          DA
        </span>
        <div className="flex flex-col">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-white/60">Administrador</span>
          <span className="text-sm font-semibold text-white">Hoteles Decameron</span>
        </div>
      </div>

      <nav className="mt-6 flex flex-1 flex-col gap-1">
        <Link
          href="/hotels"
          className={clsx(
            "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors",
            hotelManagementActive
              ? "bg-tertiary-container text-on-tertiary-container"
              : "text-white/70 hover:bg-white/10 hover:text-white"
          )}
        >
          <Hotel className="h-5 w-5" />
          Gestión de Hoteles
        </Link>
      </nav>

      <Link
        href="/hotels/new"
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-tertiary-container px-4 py-2.5 text-sm font-semibold text-on-tertiary-container transition-colors hover:brightness-95"
      >
        <Plus className="h-4 w-4" />
        Agregar Nuevo Hotel
      </Link>
    </aside>
  )
}
