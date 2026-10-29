import { Link } from 'react-router-dom'

// one dark line: the copyright on the left (children), a few page links on the right
export default function SlimFooter({ children, links }) {
  return (
    <footer className="ft">
      <div className="wrap">
        <span>{children}</span>
        <span>
          {links.map(({ to, href, label }) => (to ? <Link key={label} to={to}>{label}</Link> : <a key={label} href={href}>{label}</a>))}
        </span>
      </div>
    </footer>
  )
}
