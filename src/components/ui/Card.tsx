import type { ReactNode } from "react"
import clsx from "clsx"

interface CardProps {
  className?: string
  children: ReactNode
}

export function Card({ className, children }: CardProps) {
  return (
    <div
      className={clsx(
        "rounded-2xl border border-outline-variant/60 bg-surface-container-lowest shadow-[0_8px_20px_-4px_rgba(24,28,30,0.15)]",
        className
      )}
    >
      {children}
    </div>
  )
}
