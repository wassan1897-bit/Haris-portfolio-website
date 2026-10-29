import { Link } from 'react-router-dom'
import { EMAIL, GITHUB, LINKEDIN } from '../lib/site.js'

// the light one-line footer under the project pages
export default function MinimalFooter() {
  return (
    <footer>
      <div className="wrap">
        <Link className="logo" to="/"><b>Muhammad Haris</b><span>AI GTM Engineer</span></Link>
        <div className="c">
          <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
          <a href={LINKEDIN} target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href={GITHUB} target="_blank" rel="noopener noreferrer">GitHub</a>
          <Link to="/privacy">Privacy</Link>
        </div>
      </div>
    </footer>
  )
}
