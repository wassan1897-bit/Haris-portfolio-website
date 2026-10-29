import { createContext, useContext, useLayoutEffect } from 'react'

// A bare page (the 404) has no top bar, footer or assistant.
export const BareContext = createContext(() => {})

export function useBare() {
  const setBare = useContext(BareContext)
  useLayoutEffect(() => {
    setBare(true)
    return () => setBare(false)
  }, [setBare])
}
