import { useEffect } from 'react'
import { DESCRIPTION, SITE } from '../lib/site.js'

function setMeta(attr, key, value) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.append(el)
  }
  el.setAttribute('content', value)
}

export function usePageMeta(title, description = DESCRIPTION, { noindex = false } = {}) {
  useEffect(() => {
    const full = title ? `${title} | ${SITE}` : SITE
    document.title = full
    setMeta('property', 'og:title', full)
    setMeta('name', 'description', description)
    setMeta('property', 'og:description', description)
    if (noindex) setMeta('name', 'robots', 'noindex')
    else document.head.querySelector('meta[name="robots"]')?.remove()
  }, [title, description, noindex])
}
