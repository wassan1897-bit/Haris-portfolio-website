import { Link } from 'react-router-dom'
import FlowCanvas from '../../components/FlowCanvas.jsx'
import { CalendarLink, EmailLink } from '../../components/BookLinks.jsx'

export default function Hero() {
  return (
    <main>
      <section className="hero" aria-labelledby="hero-title">
        <div className="wrap">
          <div className="hero-in">
            <span className="eyebrow rise">AI GTM Engineer</span>
            <h1 id="hero-title" className="rise" style={{ '--i': 1 }}>Signals in. <em>Pipeline out.</em></h1>
            <p className="lede rise" style={{ '--i': 2 }}>I'm the engineer revenue leaders bring in when they want AI that produces pipeline, not a demo, built well enough to keep running after I've left.</p>
            <div className="ctas rise" style={{ '--i': 3 }}>
              <CalendarLink className="btn" arrow />
              <EmailLink className="btn btn--ghost" />
              <Link className="btn btn--ghost" to="/projects/all">Selected work <i aria-hidden="true">&rarr;</i></Link>
            </div>
          </div>
        </div>
        <FlowCanvas />
      </section>
    </main>
  )
}
