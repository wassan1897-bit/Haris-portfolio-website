import { createContext, useLayoutEffect, useSyncExternalStore } from 'react'

// Every page is also rendered to static HTML at build time (scripts/prerender.mjs), so search engines and
// AI crawlers get the full page without running JavaScript. While that happens, this context collects
// what the page needs in <head>: its title and description, and the stylesheets it uses. In the browser it is null.
export const SsrContext = createContext(null)

// A short, stable id for a stylesheet, so the browser can take over the copy that came with the HTML.
export function sheetId(css) {
  let h = 2166136261
  for (let i = 0; i < css.length; i++) h = Math.imul(h ^ css.charCodeAt(i), 16777619)
  return (h >>> 0).toString(36)
}

const subscribe = () => () => {}
// false while rendering at build time and while the browser takes over that HTML, true right after.
// Anything that depends on today's date waits for it, so the build day and the visit day never clash.
export const useHydrated = () => useSyncExternalStore(subscribe, () => true, () => false)

// Once the app has taken over, drop any build-time stylesheet no page claimed (the page's own effects run first).
export function useDropUnclaimedSheets() {
  useLayoutEffect(() => {
    document.head.querySelectorAll('style[data-ssr]').forEach((s) => s.remove())
  }, [])
}
