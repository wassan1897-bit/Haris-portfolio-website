import { useLayoutEffect, useRef } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'

// New page: start at the top, or at its #section. Same page with a #section: go there the way the page's
// CSS says (pages with scroll-behavior: smooth glide). Back and forward: return to where the visitor was.
const positions = new Map()

export default function ScrollManager() {
  const location = useLocation()
  const type = useNavigationType()
  const page = useRef(null)

  useLayoutEffect(() => {
    window.history.scrollRestoration = 'manual'
  }, [])

  useLayoutEffect(() => {
    const samePage = page.current === location.pathname
    page.current = location.pathname
    const target = location.hash && document.getElementById(decodeURIComponent(location.hash.slice(1)))
    if (type === 'POP' && positions.has(location.key)) window.scrollTo({ top: positions.get(location.key), behavior: 'instant' })
    else if (target) target.scrollIntoView({ behavior: samePage ? 'auto' : 'instant' })
    else if (!samePage) window.scrollTo({ top: 0, behavior: 'instant' })

    const save = () => positions.set(location.key, window.scrollY)
    window.addEventListener('scroll', save, { passive: true })
    return () => window.removeEventListener('scroll', save)
  }, [location, type])

  return null
}
