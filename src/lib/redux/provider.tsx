"use client"

import { useRef } from "react"
import { Provider } from "react-redux"
import { setupListeners } from "@reduxjs/toolkit/query"
import { makeStore, type AppStore } from "./store"

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<AppStore | null>(null)

  if (!storeRef.current) {
    storeRef.current = makeStore()
    setupListeners(storeRef.current.dispatch)
  }

  return <Provider store={storeRef.current}>{children}</Provider>
}
