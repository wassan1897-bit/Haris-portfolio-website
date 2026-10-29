import { Link, useLocation } from 'react-router-dom'
import { CATEGORIES } from '../data/projects.js'
import { EMAIL, GITHUB, LINKEDIN } from '../lib/site.js'
import { GitHubIcon, LinkedInIcon, MailIcon } from './Icons.jsx'

export default function EndFooter() {
  const { pathname } = useLocation()
  const [, area, current] = pathname.split('/')
  const onProjects = area === 'projects'
  return (
    <footer className="end">
      <div className="wrap">
        <div className="end-cols">
          <div className="end-card">
            <div className="who"><img src="/images/haris.webp" alt="" width="56" height="56" loading="lazy" /><Link className="logo" to="/"><b>Muhammad Haris</b><span>AI GTM Engineer</span></Link></div>
            <a className="btn" href="/#book">Book a meeting <i aria-hidden="true">&rarr;</i></a>
            <a className="mail" href={`mailto:${EMAIL}`}>{EMAIL}</a>
            <div className="social">
              <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><LinkedInIcon /></a>
              <a href={GITHUB} target="_blank" rel="noopener noreferrer" aria-label="GitHub"><GitHubIcon /></a>
              <a href={`mailto:${EMAIL}`} aria-label="Email"><MailIcon /></a>
            </div>
          </div>
          <div>
            <h3>Selected work</h3>
            <ul>
              {CATEGORIES.map((c) => {
                const here = onProjects && current === c.slug
                return <li key={c.slug}><Link to={`/projects/${c.slug}`} className={here ? 'cur' : undefined} aria-current={here ? 'page' : undefined}>{c.name}</Link></li>
              })}
              <li><Link className="all" to="/projects/all" aria-current={onProjects && current === 'all' ? 'page' : undefined}>All projects</Link></li>
            </ul>
          </div>
          <div>
            <h3>Contact</h3>
            <ul>
              <li><Link to="/#who-i-am">Who I am</Link></li>
              <li><Link to="/#how-i-work">How I work</Link></li>
              <li><a href="/#book">Book a meeting</a></li>
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/reviews">Client reviews</Link></li>
              <li><Link to="/resume">Resume</Link></li>
            </ul>
          </div>
        </div>
        <div className="end-legal"><span>&copy; Muhammad Haris · <Link to="/privacy">Privacy</Link></span><span>AI GTM Engineer</span></div>
      </div>
    </footer>
  )
}
