import { useContext, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { SITE, SITE_URL } from '../lib/site.js'
import { HOME_DESCRIPTION, HOME_TITLE } from '../data/seo.js'
import { SsrContext } from '../lib/ssr.js'

function setMeta(attr, key, value) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.append(el)
  }
  el.setAttribute('content', value)
}

// Google shows about 60 characters of a title, so a long page name keeps the name and drops the role
export function pageTitle(title) {
  if (!title) return HOME_TITLE
  const full = `${title} | ${SITE}`
  return full.length <= 60 ? full : `${title} | Muhammad Haris`
}

export function usePageMeta(title, description = HOME_DESCRIPTION, { noindex = false } = {}) {
  const full = pageTitle(title)
  const { pathname } = useLocation()
  const ssr = useContext(SsrContext)
  if (ssr) ssr.meta = { title: full, description, noindex }
  useEffect(() => {
    document.title = full
    setMeta('property', 'og:title', full)
    setMeta('name', 'description', description)
    setMeta('property', 'og:description', description)
    // the one official address of the page, so the vercel.app copy or a trailing slash never competes with it
    const url = SITE_URL + pathname
    let canonical = document.head.querySelector('link[rel="canonical"]')
    if (noindex) {
      setMeta('name', 'robots', 'noindex')
      canonical?.remove()
      document.head.querySelector('meta[property="og:url"]')?.remove()
    } else {
      document.head.querySelector('meta[name="robots"]')?.remove()
      if (!canonical) {
        canonical = document.createElement('link')
        canonical.rel = 'canonical'
        document.head.append(canonical)
      }
      canonical.href = url
      setMeta('property', 'og:url', url)
    }
  }, [full, description, noindex, pathname])
}
