"use client"

import { createContext, useCallback, useContext, useState, type ReactNode } from "react"
import { CircleAlert, CircleCheck, X } from "lucide-react"
import clsx from "clsx"

type ToastTone = "success" | "error" | "info"

interface ToastMessage {
  id: number
  tone: ToastTone
  title: string
  description?: string
}

interface ToastContextValue {
  showToast: (toast: Omit<ToastMessage, "id">) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

const toneIcon: Record<ToastTone, typeof CircleCheck> = {
  success: CircleCheck,
  error: CircleAlert,
  info: CircleAlert,
}

const toneClasses: Record<ToastTone, string> = {
  success: "border-secondary/30 bg-secondary-container text-on-secondary-container",
  error: "border-error/30 bg-error-container text-on-error-container",
  info: "border-primary/20 bg-primary-container text-on-primary-container",
}

let nextToastId = 1

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const dismissToast = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const showToast = useCallback(
    (toast: Omit<ToastMessage, "id">) => {
      const id = nextToastId++
      setToasts((current) => [...current, { ...toast, id }])
      setTimeout(() => dismissToast(id), 6000)
    },
    [dismissToast]
  )

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 top-4 z-[100] flex flex-col items-center gap-2 px-4">
        {toasts.map((toast) => {
          const Icon = toneIcon[toast.tone]
          return (
            <div
              key={toast.id}
              role="status"
              className={clsx(
                "pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border px-4 py-3 shadow-[0_12px_28px_-8px_rgba(24,28,30,0.3)]",
                toneClasses[toast.tone]
              )}
            >
              <Icon className="mt-0.5 h-5 w-5 shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-semibold">{toast.title}</p>
                {toast.description ? <p className="text-sm opacity-80">{toast.description}</p> : null}
              </div>
              <button
                type="button"
                onClick={() => dismissToast(toast.id)}
                aria-label="Cerrar notificación"
                className="opacity-60 hover:opacity-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast debe usarse dentro de ToastProvider")
  }
  return context
}
