import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { SelectField, TextField } from "./FormField"

describe("TextField", () => {
  it("asocia la etiqueta con el campo", () => {
    render(<TextField label="Nombre del hotel" name="name" />)
    expect(screen.getByLabelText("Nombre del hotel")).toBeInTheDocument()
  })

  it("muestra el error en lugar de la pista", () => {
    render(
      <TextField
        label="NIT"
        name="nit"
        hint="Incluye el dígito de verificación"
        error="El NIT ya está registrado"
      />
    )
    expect(screen.getByText("El NIT ya está registrado")).toBeInTheDocument()
    expect(screen.queryByText("Incluye el dígito de verificación")).not.toBeInTheDocument()
  })

  it("propaga lo que el usuario escribe", async () => {
    const onChange = vi.fn()
    render(<TextField label="Ciudad" name="city" onChange={onChange} />)
    await userEvent.type(screen.getByLabelText("Ciudad"), "Cartagena")
    expect(onChange).toHaveBeenCalled()
  })
})

describe("SelectField", () => {
  const options = [
    { value: "Sencilla", label: "Sencilla" },
    { value: "Doble", label: "Doble" },
  ]

  it("renderiza cada opción y un placeholder opcional", () => {
    render(
      <SelectField label="Acomodación" name="accommodation" options={options} placeholder="Selecciona una opción" />
    )
    expect(screen.getByLabelText("Acomodación")).toBeInTheDocument()
    expect(screen.getByRole("option", { name: "Selecciona una opción" })).toBeInTheDocument()
    expect(screen.getByRole("option", { name: "Sencilla" })).toBeInTheDocument()
    expect(screen.getByRole("option", { name: "Doble" })).toBeInTheDocument()
  })

  it("permite elegir una opción", async () => {
    render(<SelectField label="Acomodación" name="accommodation" options={options} />)
    const select = screen.getByLabelText("Acomodación") as HTMLSelectElement
    await userEvent.selectOptions(select, "Doble")
    expect(select.value).toBe("Doble")
  })
})
