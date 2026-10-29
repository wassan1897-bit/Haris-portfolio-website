import { Link } from 'react-router-dom'
import { PersonIcon } from '../components/Icons.jsx'
import SlimFooter from '../components/SlimFooter.jsx'
import { usePageMeta } from '../hooks/usePageMeta.js'
import { useStylesheet } from '../hooks/useStylesheet.js'
import css from '../styles/pages/reviews.css?inline'

// Square brackets mark a word changed for clarity, and an ellipsis marks where a review is shortened.
const REVIEWS = [
  'Haris is one of the best developers [I] have worked with, incredibly responsive and managed to help guide me to the most efficient workflows and techniques to deliver my project. I would recommend him to any other mid-market or enterprise companies as he has been very reliable and effective.',
  'Muhammad was a pleasure to work with. He communicates clearly, works efficiently, and consistently delivers high-quality results. He is responsive, proactive, and easy to collaborate with... I appreciated his professionalism, technical ability, and willingness to solve problems without unnecessary back-and-forth.',
  'Working with Muhammad was a great experience. He takes the time to thoroughly understand the project before diving in, communicates clearly, and consistently shows strong attention to detail.',
  'It was such a pleasure working with Muhammad H. He is very talented, courteous, and provides exceptional service. I will rehire him for my next project.',
  'Muhammad was incredibly efficient and once again helped me with whatever my request was, taking time to understand my requirment in depth and go above and beyond to deliver.',
  'It was a pleasure to work with Muhammad, he always completed work before any deadlines. He also went the extra mile to make sure everything was working as it should\u2026',
  'An excellent experience. Muhammad is very knowledgeable on the advance applications of AI and automation systems like n8n\u2026',
  'Haris is an exceptional [engineer] skilled in n8n automations and API integrations. He is resourceful and excited to learn new things, and I love that about working with him\u2026',
  'Fantastic [engineer], technically sound know his stuff.',
  'Thank you for all your [hard] work and will be working with you again in the future',
]

const WHY = [
  ['Responsive', 'Answers fast, and the person you talk to is the person who builds it.'],
  ['Clear communication', 'No translating between the business and the build.'],
  ['Understands the project first', 'Learns the job before automating it.'],
  ['Reliable and effective', 'Built to a standard where you can let it run.'],
]

export default function Reviews() {
  usePageMeta('Client reviews', 'What clients say about working with Muhammad Haris, AI GTM engineer. In their words.')
  useStylesheet(css, 2)
  return (
    <>
      <section className="hd"><div className="wrap in">
        <div>
          <span className="eb">What clients say</span>
          <h1>In their <em>words.</em></h1>
          <p>Clients on what it was like to work together, in their own words. Square brackets mark a word changed for clarity, and &hellip; marks where a review is shortened.</p>
        </div>
      </div></section>

      <main><div className="wrap">
        <div className="grid">
          {REVIEWS.map((text, i) => (
            <figure key={i} className={i === 0 ? 'rv lead' : 'rv'}>
              <span className="mark" aria-hidden="true">&ldquo;</span>
              <blockquote>{text}</blockquote>
              <footer><i aria-hidden="true"><PersonIcon /></i><div><b>Client</b></div></footer>
            </figure>
          ))}
        </div>

        <section className="why" aria-labelledby="why-title">
          <h2 id="why-title">What they kept coming back to.</h2>
          <ul>{WHY.map(([b, s]) => <li key={b}><b>{b}</b><span>{s}</span></li>)}</ul>
        </section>

        <section className="go">
          <h2>If you're serious about building a revenue engine, let's talk.</h2>
          <div className="acts"><a className="pri" href="/#book">Book a meeting</a><Link className="sec" to="/projects/all">See the work</Link></div>
        </section>
      </div></main>

      <SlimFooter links={[{ to: '/', label: 'Home' }, { to: '/projects/all', label: 'Selected work' }, { to: '/faq', label: 'FAQ' }, { to: '/resume', label: 'Resume' }]}>
        &copy; Muhammad Haris · <Link to="/privacy" style={{ margin: 0 }}>Privacy</Link>
      </SlimFooter>
    </>
  )
}
