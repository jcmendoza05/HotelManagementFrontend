import type { SerializedError } from "@reduxjs/toolkit"
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query"

export interface NormalizedApiError {
  message: string
  fieldErrors: Record<string, string[]>
}

interface LaravelErrorBody {
  message: string
  errors?: Record<string, string[]>
}

const FALLBACK_MESSAGE = "Ocurrió un error inesperado. Intenta de nuevo."
const CONNECTION_MESSAGE = "No se pudo conectar con el servidor."

function isLaravelErrorBody(data: unknown): data is LaravelErrorBody {
  return (
    typeof data === "object" &&
    data !== null &&
    typeof (data as { message?: unknown }).message === "string"
  )
}

export function mapApiError(error: FetchBaseQueryError | SerializedError | undefined): NormalizedApiError {
  if (!error) {
    return { message: FALLBACK_MESSAGE, fieldErrors: {} }
  }

  if ("status" in error) {
    if (error.status === "FETCH_ERROR" || error.status === "TIMEOUT_ERROR") {
      return { message: CONNECTION_MESSAGE, fieldErrors: {} }
    }
    if (isLaravelErrorBody(error.data)) {
      return { message: error.data.message, fieldErrors: error.data.errors ?? {} }
    }
    return { message: FALLBACK_MESSAGE, fieldErrors: {} }
  }

  return { message: error.message ?? FALLBACK_MESSAGE, fieldErrors: {} }
}
