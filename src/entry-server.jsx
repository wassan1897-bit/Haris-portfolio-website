import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import App from './App.jsx'
import { SsrContext } from './lib/ssr.js'

export { sheetId } from './lib/ssr.js'
export { WORK } from './data/work.js'
export { CATEGORIES, ALL_PROJECTS_LEDE } from './data/projects.js'
export * as site from './lib/site.js'
export * as seo from './data/seo.js'

// Renders one page at build time: its HTML, plus the title, description and stylesheets it asked for.
export function render(url) {
  const ctx = { sheets: new Map(), meta: null }
  const html = renderToString(
    <SsrContext.Provider value={ctx}>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </SsrContext.Provider>,
  )
  return { html, meta: ctx.meta, sheets: [...ctx.sheets].map(([css, order]) => ({ css, order })) }
}
