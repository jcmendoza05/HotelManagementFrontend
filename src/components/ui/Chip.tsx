import clsx from "clsx"

type ChipTone = "primary" | "secondary" | "tertiary" | "neutral"

interface ChipProps {
  label: string
  tone?: ChipTone
  className?: string
}

const toneClasses: Record<ChipTone, string> = {
  primary: "bg-primary-container text-on-primary-container",
  secondary: "bg-secondary-container text-on-secondary-container",
  tertiary: "bg-tertiary-container text-on-tertiary-container",
  neutral: "bg-surface-container-high text-on-surface-variant",
}

export function Chip({ label, tone = "neutral", className }: ChipProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide",
        toneClasses[tone],
        className
      )}
    >
      {label}
    </span>
  )
}
