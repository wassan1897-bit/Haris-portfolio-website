import { Link } from 'react-router-dom'
import { LINKEDIN } from '../lib/site.js'
import { LinkedInIcon } from './Icons.jsx'

export default function SlimTopbar({ icons = false }) {
  const book = <a className="book" href="/#book">Book a meeting</a>
  return (
    <header className="topbar">
      <nav className="wrap" aria-label="Main">
        <Link className="logo" to="/"><b>Muhammad Haris</b><span>AI GTM Engineer</span></Link>
        {icons ? (
          <div className="top-right">
            <a className="icon-btn" href={LINKEDIN} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><LinkedInIcon size={19} /></a>
            {book}
          </div>
        ) : book}
      </nav>
    </header>
  )
}
