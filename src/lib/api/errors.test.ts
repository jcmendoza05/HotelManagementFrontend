import { describe, expect, it } from "vitest"
import { mapApiError } from "./errors"

describe("mapApiError", () => {
  it("extrae mensaje y errores de campo de una respuesta de validación Laravel", () => {
    const result = mapApiError({
      status: 422,
      data: {
        message: "The nit has already been taken.",
        errors: { nit: ["The nit has already been taken."] },
      },
    })

    expect(result.message).toBe("The nit has already been taken.")
    expect(result.fieldErrors).toEqual({ nit: ["The nit has already been taken."] })
  })

  it("usa solo el mensaje cuando la respuesta no trae errores de campo", () => {
    const result = mapApiError({ status: 500, data: { message: "Error interno del servidor" } })

    expect(result.message).toBe("Error interno del servidor")
    expect(result.fieldErrors).toEqual({})
  })

  it("devuelve un mensaje de conexión cuando la petición no llega al servidor", () => {
    const result = mapApiError({ status: "FETCH_ERROR", error: "TypeError: Failed to fetch" })

    expect(result.message).toBe("No se pudo conectar con el servidor.")
  })

  it("devuelve un mensaje genérico cuando la forma de la respuesta es desconocida", () => {
    const result = mapApiError({ status: 500, data: { foo: "bar" } })

    expect(result.message).toBe("Ocurrió un error inesperado. Intenta de nuevo.")
    expect(result.fieldErrors).toEqual({})
  })

  it("maneja errores indefinidos", () => {
    expect(mapApiError(undefined).message).toBe("Ocurrió un error inesperado. Intenta de nuevo.")
  })
})
