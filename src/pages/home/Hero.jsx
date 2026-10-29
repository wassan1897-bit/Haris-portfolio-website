import { Link } from 'react-router-dom'
import FlowCanvas from '../../components/FlowCanvas.jsx'
import { BOOK_MAIL } from '../../lib/site.js'

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
              <a className="btn" href={BOOK_MAIL}>Book a meeting <i aria-hidden="true">&rarr;</i></a>
              <Link className="btn btn--ghost" to="/projects/all">Selected work <i aria-hidden="true">&rarr;</i></Link>
            </div>
          </div>
        </div>
        <FlowCanvas />
      </section>
    </main>
  )
}
