import { Link } from 'react-router-dom'
import { CATEGORIES } from '../data/projects.js'
import { usePageMeta } from '../hooks/usePageMeta.js'
import { useStylesheet } from '../hooks/useStylesheet.js'
import { BOOK_MAIL } from '../lib/site.js'
import css from '../styles/pages/work.css?inline'

const Steps = ({ steps }) => <ol>{steps.map((s) => <li key={s}><span>{s}</span></li>)}</ol>

function Block({ b }) {
  if (b.type === 'p') return <p>{b.text}</p>
  if (b.type === 'ul') return <ul>{b.items.map((t) => <li key={t}>{t}</li>)}</ul>
  if (b.type === 'fig') {
    return (
      <figure className="fig">
        <img src={b.src} alt="" width={b.width} height={b.height} loading="lazy" decoding="async" />
        {b.caption && <figcaption>{b.caption}</figcaption>}
      </figure>
    )
  }
  return (
    <div className="flow">
      <div className="main"><Steps steps={b.steps} /></div>
      {b.branches.map((br) => <div className="br" key={br.label}><b>{br.label}</b><Steps steps={br.steps} /></div>)}
    </div>
  )
}

export default function WorkCase({ work: w }) {
  usePageMeta(w.title, w.description)
  useStylesheet(css, 2)
  const category = CATEGORIES.find((c) => c.slug === w.category)
  return (
    <>
      <div className="wrap" data-kind={w.kind}>
        <Link className="back" to={`/projects/${category.slug}`}>&larr; {category.name}</Link>
        <header className="head">
          <span className="tag">{w.tag}</span>
          {w.client && <span className="client">{w.client}</span>}
          <h1>{w.title}</h1>
          <p className="sub">{w.sub}</p>
        </header>
        {w.stats.length > 0 && (
          <section className="stats" style={{ '--n': w.stats.length }} aria-label="Results">
            {w.stats.map(([v, l]) => <div key={l}><b>{v}</b><span>{l}</span></div>)}
          </section>
        )}
        {w.shot && <figure className="shot"><img src={w.shot.src} alt="" width={w.shot.width} height={w.shot.height} /></figure>}
        <section className="body">
          {w.sections.map((s) => [
            <h2 key={`h-${s.heading}`}>{s.heading}</h2>,
            <div className="txt" key={`t-${s.heading}`}>{s.blocks.map((b, i) => <Block key={i} b={b} />)}</div>,
          ])}
          <h2>Under the hood</h2><div className="txt"><p className="under">{w.under}</p></div>
        </section>
        <div className="more">
          <Link to={`/work/${w.prev.slug}`}><small>&larr; Selected work</small><b>{w.prev.title}</b></Link>
          <Link to={`/work/${w.next.slug}`}><small>Selected work &rarr;</small><b>{w.next.title}</b></Link>
        </div>
      </div>
      <section className="cta">
        <h2>If you're serious about building a revenue engine, let's talk.</h2>
        <a className="btn" href={BOOK_MAIL}>Book a meeting <i aria-hidden="true">&rarr;</i></a>
      </section>
    </>
  )
}
