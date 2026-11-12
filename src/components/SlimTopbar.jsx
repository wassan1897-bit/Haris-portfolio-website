import { Link } from 'react-router-dom'
import { LINKEDIN } from '../lib/site.js'
import { LinkedInIcon } from './Icons.jsx'
import { CalendarLink, EmailIconLink } from './BookLinks.jsx'

export default function SlimTopbar({ icons = false }) {
  return (
    <header className="topbar">
      <nav className="wrap" aria-label="Main">
        <Link className="logo" to="/"><b>Muhammad Haris</b><span>AI GTM Engineer</span></Link>
        <div className="top-right">
          {icons && <a className="icon-btn" href={LINKEDIN} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><LinkedInIcon size={19} /></a>}
          <EmailIconLink />
          <CalendarLink className="book" />
        </div>
      </nav>
    </header>
  )
}
