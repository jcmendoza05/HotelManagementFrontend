import { forwardRef, type ButtonHTMLAttributes } from "react"
import clsx from "clsx"

type ButtonVariant = "primary" | "secondary" | "cta" | "ghost" | "danger"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-primary text-white hover:bg-primary-container focus-visible:ring-primary",
  secondary:
    "bg-transparent text-secondary border border-secondary hover:bg-secondary/10 focus-visible:ring-secondary",
  cta: "bg-tertiary-container text-primary hover:brightness-95 focus-visible:ring-tertiary-container",
  ghost: "bg-transparent text-on-surface-variant hover:bg-surface-container focus-visible:ring-outline",
  danger: "bg-error text-white hover:brightness-95 focus-visible:ring-error",
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", className, type = "button", ...props },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        variantClasses[variant],
        className
      )}
      {...props}
    />
  )
})
