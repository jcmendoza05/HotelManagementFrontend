import { forwardRef, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes } from "react"
import clsx from "clsx"

interface FieldShellProps {
  label: string
  name: string
  hint?: string
  error?: string
  children: ReactNode
}

function FieldShell({ label, name, hint, error, children }: FieldShellProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-sm font-medium text-on-surface">
        {label}
      </label>
      {children}
      {error ? (
        <p className="text-sm text-error">{error}</p>
      ) : hint ? (
        <p className="text-sm text-on-surface-variant">{hint}</p>
      ) : null}
    </div>
  )
}

const fieldBaseClasses =
  "w-full rounded-xl border bg-surface-container-lowest px-3.5 py-2.5 text-sm text-on-surface outline-none transition focus:ring-2 focus:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-60"

interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "id"> {
  label: string
  name: string
  hint?: string
  error?: string
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { label, name, hint, error, className, ...rest },
  ref
) {
  return (
    <FieldShell label={label} name={name} hint={hint} error={error}>
      <input
        {...rest}
        ref={ref}
        id={name}
        name={name}
        className={clsx(
          fieldBaseClasses,
          error ? "border-error focus:ring-error/30" : "border-outline-variant focus:border-primary",
          className
        )}
      />
    </FieldShell>
  )
})

export interface SelectFieldOption {
  value: string
  label: string
}

interface SelectFieldProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "id"> {
  label: string
  name: string
  hint?: string
  error?: string
  options: SelectFieldOption[]
  placeholder?: string
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(function SelectField(
  { label, name, hint, error, className, options, placeholder, ...rest },
  ref
) {
  return (
    <FieldShell label={label} name={name} hint={hint} error={error}>
      <select
        {...rest}
        ref={ref}
        id={name}
        name={name}
        className={clsx(
          fieldBaseClasses,
          error ? "border-error focus:ring-error/30" : "border-outline-variant focus:border-primary",
          className
        )}
      >
        {placeholder ? (
          <option value="" disabled>
            {placeholder}
          </option>
        ) : null}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FieldShell>
  )
})
