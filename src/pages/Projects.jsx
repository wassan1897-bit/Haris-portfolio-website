import { useLayoutEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ALL_PROJECTS_LEDE, CATEGORIES } from '../data/projects.js'
import { usePageMeta } from '../hooks/usePageMeta.js'
import { useStylesheet } from '../hooks/useStylesheet.js'
import css from '../styles/pages/projects.css?inline'

const TOTAL = CATEGORIES.reduce((n, c) => n + c.projects.length, 0)

function ProjectCard({ p }) {
  const cover = <div className="cov"><img src={`/projects/img/p-${p.cover}.webp`} alt="" width="1600" height="900" loading="lazy" decoding="async" /></div>
  const head = <>{p.meta && <span className="meta">{p.meta}</span>}<h3>{p.title}</h3><p>{p.text}</p></>
  if (!p.slug) return <div className="pc">{cover}<div className="bd">{head}</div></div>
  return (
    <Link className="pc" to={`/work/${p.slug}`}>
      {cover}
      <div className="bd">
        {head}
        <div className="ft"><small>{p.figure && <><b>{p.figure}</b> {p.figureLabel}</>}</small><em>View project &rarr;</em></div>
      </div>
    </Link>
  )
}

const Grid = ({ projects }) => <div className="grid">{projects.map((p) => <ProjectCard key={p.title} p={p} />)}</div>

function Chips({ current }) {
  const chip = (slug, label, n) => (
    <Link key={slug} to={`/projects/${slug}`} aria-current={slug === current ? 'page' : undefined}>{label} <i>{n}</i></Link>
  )
  return (
    <nav className="chips" aria-label="Project categories">
      <div className="wrap">
        {chip('all', 'All projects', TOTAL)}
        {CATEGORIES.map((c) => chip(c.slug, c.name, c.projects.length))}
      </div>
    </nav>
  )
}

function AllProjects() {
  return (
    <>
      <section className="ph"><div className="wrap">
        <div className="crumb"><b>Selected work</b></div>
        <div className="row"><div className="num">{TOTAL}</div><div><h1>Selected work</h1><p>{ALL_PROJECTS_LEDE}</p></div><div /></div>
      </div></section>
      <Chips current="all" />
      <div className="wrap body">
        {CATEGORIES.map((c) => (
          <section className="sec" key={c.slug} aria-labelledby={`sec-${c.slug}`}>
            <h2 id={`sec-${c.slug}`}><i>{c.num}</i>{c.name}<Link to={`/projects/${c.slug}`}>View all {c.projects.length} &rarr;</Link></h2>
            <p>{c.line}</p>
            <Grid projects={c.projects} />
          </section>
        ))}
        <div className="next" />
      </div>
    </>
  )
}

function Category({ c }) {
  const i = CATEGORIES.indexOf(c)
  const prev = CATEGORIES[(i + CATEGORIES.length - 1) % CATEGORIES.length]
  const next = CATEGORIES[(i + 1) % CATEGORIES.length]
  const n = c.projects.length
  return (
    <>
      <section className="ph"><div className="wrap">
        <div className="crumb"><Link to="/projects/all">Selected work</Link> / <b>{c.name}</b></div>
        <div className="row"><div className="num">{c.num}</div><div><h1>{c.name}</h1><p>{c.line}</p></div><div className="cnt"><b>{n}</b>{n === 1 ? 'project' : 'projects'}</div></div>
      </div></section>
      <Chips current={c.slug} />
      <div className="wrap body">
        <Grid projects={c.projects} />
        <nav className="next" aria-label="More categories">
          <Link to={`/projects/${prev.slug}`}><small>&larr; {prev.num}</small><b>{prev.name}</b></Link>
          <Link to={`/projects/${next.slug}`}><small>{next.num} &rarr;</small><b>{next.name}</b></Link>
        </nav>
      </div>
    </>
  )
}

export default function Projects({ category }) {
  const c = CATEGORIES.find((x) => x.slug === category)
  usePageMeta(c ? c.name : 'Selected work', c ? c.line : ALL_PROJECTS_LEDE)
  useStylesheet(css, 2)
  const main = useRef(null)
  // Category strip: on narrow screens, start scrolled to the current category. Measured here, after
  // useStylesheet, because a child's layout effect would run before the page styles are in the document.
  useLayoutEffect(() => {
    const a = main.current.querySelector('.chips [aria-current]')
    a.parentElement.scrollLeft = a.offsetLeft - a.parentElement.offsetLeft
  }, [category])
  return <main ref={main}>{c ? <Category c={c} /> : <AllProjects />}</main>
}
