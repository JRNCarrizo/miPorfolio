import { createContext, useEffect, useState } from 'react'

export const PanelsContext = createContext(null)

export function usePanelQuery(px) {
  const [match, setMatch] = useState(false)

  useEffect(() => {
    const query = window.matchMedia(`(max-width: ${px}px)`)
    const update = () => setMatch(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [px])

  return match
}
