"use client"

import { useEffect, type ReactNode } from "react"
import { createPortal } from "react-dom"
import { X } from "lucide-react"
import clsx from "clsx"

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  footer?: ReactNode
  size?: "md" | "lg"
}

export function Modal({ open, onClose, title, children, footer, size = "md" }: ModalProps) {
  useEffect(() => {
    if (!open) return

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose()
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/40 px-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={clsx(
          "max-h-[90vh] w-full overflow-y-auto rounded-2xl bg-surface-container-lowest shadow-[0_24px_48px_-12px_rgba(24,28,30,0.35)]",
          size === "lg" ? "max-w-2xl" : "max-w-md"
        )}
      >
        <div className="flex items-center justify-between border-b border-outline-variant/60 px-6 py-4">
          <h2 className="text-lg font-semibold text-on-surface">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="rounded-full p-1.5 text-on-surface-variant transition-colors hover:bg-surface-container-high"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
        {footer ? (
          <div className="flex justify-end gap-3 border-t border-outline-variant/60 px-6 py-4">{footer}</div>
        ) : null}
      </div>
    </div>,
    document.body
  )
}
