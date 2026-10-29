import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { CATEGORIES } from '../data/projects.js'
import { WORK } from '../data/work.js'
import { LINKEDIN } from '../lib/site.js'
import { Caret, LinkedInIcon } from './Icons.jsx'

// the five revenue stages; product and platform engineering is work, not a stage
const STAGES = CATEGORIES.slice(0, 5)

// In the projects area "Selected work" stays underlined, and a category or project page marks its category.
function useSection(pathname) {
  const [, area, slug] = pathname.split('/')
  if (area === 'projects') return { here: true, current: slug }
  if (area === 'work') return { here: true, current: WORK.find((w) => w.slug === slug)?.category }
  return { here: false, current: null }
}

// Dropdowns open on hover (CSS) and on click or keyboard; Escape, a click outside or leaving them closes them.
function Menu({ id, label, here, open, onToggle, onClose, children }) {
  const isOpen = open === id
  return (
    <li
      className={'has-drop' + (here ? ' here' : '') + (isOpen ? ' open' : '')}
      onMouseLeave={(e) => { if (!e.currentTarget.contains(document.activeElement)) onClose() }}
      onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) onClose() }}
    >
      <button type="button" aria-expanded={isOpen} aria-controls={`drop-${id}`} onClick={() => onToggle(id)}>{label} <Caret /></button>
      <div className="drop" id={`drop-${id}`}>{children}</div>
    </li>
  )
}

export default function Topbar() {
  const { pathname, hash } = useLocation()
  const { here, current } = useSection(pathname)
  const [open, setOpen] = useState(null)
  const nav = useRef(null)
  const close = () => setOpen(null)

  useEffect(close, [pathname, hash])

  useEffect(() => {
    if (!open) return
    nav.current.querySelector(`#drop-${open} a`).focus({ preventScroll: true })
    const onClick = (e) => { if (!e.target.closest('.has-drop')) setOpen(null) }
    const onKey = (e) => {
      if (e.key !== 'Escape') return
      nav.current.querySelector(`[aria-controls="drop-${open}"]`).focus()
      setOpen(null)
    }
    document.addEventListener('click', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('click', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const toggle = (id) => setOpen((o) => (o === id ? null : id))

  return (
    <header className="topbar">
      <nav className="wrap top" aria-label="Main" ref={nav}>
        <Link className="logo" to="/"><b>Muhammad Haris</b><span>AI GTM Engineer</span></Link>
        <ul className="links">
          <Menu id="work" label="Selected work" here={here} open={open} onToggle={toggle} onClose={close}>
            {CATEGORIES.map((c) => (
              <Link key={c.slug} to={`/projects/${c.slug}`} className={c.slug === current ? 'cur' : undefined}>{c.name}</Link>
            ))}
            <Link to="/projects/all">All projects</Link>
          </Menu>
          <Menu id="build" label="What I build" open={open} onToggle={toggle} onClose={close}>
            {STAGES.map((c) => <Link key={c.slug} to={`/projects/${c.slug}`}>{c.name}</Link>)}
          </Menu>
          <li><Link to="/#how-i-work">How I work</Link></li>
          <li><Link to="/#who-i-am">Who I am</Link></li>
          <li><Link to="/reviews">Client reviews</Link></li>
        </ul>
        <div className="top-right">
          <a className="icon-btn" href={LINKEDIN} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><LinkedInIcon size={19} /></a>
          <a className="book" href="/#book">Book a meeting</a>
        </div>
      </nav>
    </header>
  )
}
