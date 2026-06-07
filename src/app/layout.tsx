import type { Metadata } from "next"
import { Manrope, Hanken_Grotesk } from "next/font/google"
import "./globals.css"
import { ReduxProvider } from "@/lib/redux/provider"
import { ToastProvider } from "@/components/ui/Toast"
import { AppShell } from "@/components/layout/AppShell"

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
})

const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-hanken-grotesk",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Hoteles Decameron",
  description: "Panel de administración de propiedades y habitaciones",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`${manrope.variable} ${hankenGrotesk.variable} font-sans antialiased`}>
        <ReduxProvider>
          <ToastProvider>
            <AppShell>{children}</AppShell>
          </ToastProvider>
        </ReduxProvider>
      </body>
    </html>
  )
}
