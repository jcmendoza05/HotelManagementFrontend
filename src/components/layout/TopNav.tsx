"use client"

import Link from "next/link"
import { Bell, Building2, Menu, Search, Settings } from "lucide-react"

interface TopNavProps {
  onOpenMobileNav: () => void
}

export function TopNav({ onOpenMobileNav }: TopNavProps) {
  return (
    <header className="sticky top-0 z-30 flex items-center gap-4 border-b border-outline-variant/60 bg-surface-container-lowest px-4 py-3 lg:px-8">
      <button
        type="button"
        onClick={onOpenMobileNav}
        aria-label="Abrir menú"
        className="rounded-lg p-2 text-on-surface-variant hover:bg-surface-container lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      <Link href="/hotels" className="flex items-center gap-2 text-primary lg:hidden">
        <Building2 className="h-6 w-6" />
        <span className="text-lg font-bold tracking-tight">HotelManager</span>
      </Link>

      <div className="relative hidden flex-1 max-w-md lg:block">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
        <input
          type="text"
          placeholder="Buscar operaciones..."
          className="w-full rounded-full border border-outline-variant/60 bg-surface-container-low py-2.5 pl-10 pr-4 text-sm text-on-surface outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        <button
          type="button"
          aria-label="Notificaciones"
          className="relative hidden rounded-full p-2.5 text-on-surface-variant transition-colors hover:bg-surface-container sm:block"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-error" />
        </button>
        <button
          type="button"
          aria-label="Configuración"
          className="hidden rounded-full p-2.5 text-on-surface-variant transition-colors hover:bg-surface-container sm:block"
        >
          <Settings className="h-5 w-5" />
        </button>
        <div className="ml-1 flex items-center gap-2.5 rounded-full border border-outline-variant/60 py-1 pl-1 pr-3.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
            AD
          </span>
          <span className="hidden text-sm font-semibold text-on-surface sm:inline">Panel Admin</span>
        </div>
      </div>
    </header>
  )
}
