import { Link } from 'react-router-dom'
import { usePageMeta } from '../hooks/usePageMeta.js'
import { useStylesheet } from '../hooks/useStylesheet.js'
import { useBare } from '../lib/bare.js'
import css from '../styles/pages/not-found.css?inline'

export default function NotFound() {
  usePageMeta('Page not found', undefined, { noindex: true })
  useStylesheet(css, 2)
  useBare()
  return (
    <main>
      <small>404</small>
      <h1>Signal lost. <em>Pipeline intact.</em></h1>
      <p>This page doesn't exist, or it moved. Everything else is right where you left it.</p>
      <div className="acts"><Link className="pri" to="/">Back to home</Link><Link to="/projects/all">See the work</Link></div>
    </main>
  )
}
