import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

// Plain <a> links to this site (the assistant's project cards, in-page anchors) navigate inside the app
// instead of reloading it, so an assistant call keeps going from page to page. Router <Link>s handle
// their own clicks first and mark them as handled.
export function useLinkInterceptor() {
  const navigate = useNavigate()
  useEffect(() => {
    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const a = e.target.closest?.('a[href]')
      if (!a || (a.target && a.target !== '_self') || a.hasAttribute('download')) return
      const url = new URL(a.href, window.location.href)
      if (url.origin !== window.location.origin || /\.(pdf|webp|png|jpe?g|svg|mp4|webm)$/i.test(url.pathname)) return
      e.preventDefault()
      navigate(url.pathname + url.search + url.hash)
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [navigate])
}
