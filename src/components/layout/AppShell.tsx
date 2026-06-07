"use client"

import { useState, type ReactNode } from "react"
import { Sidebar } from "./Sidebar"
import { TopNav } from "./TopNav"
import { MobileNav } from "./MobileNav"

export function AppShell({ children }: { children: ReactNode }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar />
      <MobileNav open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopNav onOpenMobileNav={() => setMobileNavOpen(true)} />
        <main className="min-w-0 flex-1 px-4 py-6 sm:px-8 sm:py-8">{children}</main>
        <footer className="border-t border-outline-variant/60 px-4 py-5 text-xs text-on-surface-variant sm:px-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 HotelManager — Sistema de Gestión Hotelera</p>
            <p>Términos | Privacidad | Soporte Técnico</p>
          </div>
        </footer>
      </div>
    </div>
  )
}
