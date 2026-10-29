import { useLayoutEffect } from 'react'

// Each page brings its own stylesheet (they reuse class names like .hero or .body with different rules),
// so a page's styles are only in the document while it is on screen. Layout styles use order 1 and
// page styles order 2, so a page can always override its layout. Added before paint: no unstyled flash.
const sheets = new Map()

export function useStylesheet(css, order) {
  useLayoutEffect(() => {
    let sheet = sheets.get(css)
    if (!sheet) {
      const el = document.createElement('style')
      el.dataset.order = String(order)
      el.textContent = css
      const later = [...document.head.querySelectorAll('style[data-order]')].find((s) => Number(s.dataset.order) > order)
      document.head.insertBefore(el, later ?? null)
      sheet = { el, users: 0 }
      sheets.set(css, sheet)
    }
    sheet.users++
    return () => {
      if (--sheet.users > 0) return
      sheet.el.remove()
      sheets.delete(css)
    }
  }, [css, order])
}
