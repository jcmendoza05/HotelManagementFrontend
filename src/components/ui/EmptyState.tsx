import type { LucideIcon } from "lucide-react"
import { PackageSearch } from "lucide-react"
import { Button } from "./Button"

interface EmptyStateProps {
  title: string
  description?: string
  icon?: LucideIcon
  actionLabel?: string
  onAction?: () => void
}

export function EmptyState({
  title,
  description,
  icon: Icon = PackageSearch,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-outline-variant px-6 py-16 text-center">
      <Icon className="h-10 w-10 text-on-surface-variant" />
      <p className="text-lg font-semibold text-on-surface">{title}</p>
      {description ? <p className="max-w-sm text-sm text-on-surface-variant">{description}</p> : null}
      {actionLabel && onAction ? (
        <Button variant="secondary" onClick={onAction} className="mt-2">
          {actionLabel}
        </Button>
      ) : null}
    </div>
  )
}
