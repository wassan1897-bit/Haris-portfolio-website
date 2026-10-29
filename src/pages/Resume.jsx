import { useLayoutEffect, useRef } from 'react'
import { DownloadIcon, GitHubIcon, LinkedInIcon, MailIcon } from '../components/Icons.jsx'
import { usePageMeta } from '../hooks/usePageMeta.js'
import { useStylesheet } from '../hooks/useStylesheet.js'
import { EMAIL, GITHUB, LINKEDIN, RESUME_PDF } from '../lib/site.js'
import css from '../styles/pages/resume.css?inline'

const RAIL = 'M60 76 H300 V206 H60 V336 H372'
const NODES = [
  [60, 76, '0.0s', '01', 'Signal intelligence'],
  [300, 76, '0.75s', '02', 'Research and enrichment agents'],
  [300, 206, '1.5s', '03', 'Signal-triggered outbound'],
  [60, 206, '2.25s', '04', 'Inbound conversion'],
  [60, 336, '3.0s', '05', 'Retention and expansion'],
]

// the five stages on one rail, with pulses running towards "Pipeline out."
function EngineDiagram() {
  return (
    <svg className="dia" viewBox="0 0 520 400" role="img" aria-label="Five stages of the revenue engine">
      <path d={RAIL} className="rail-bg" /><path d={RAIL} className="rail" />
      {['0s', '-1.27s', '-2.53s'].map((begin) => (
        <circle key={begin} r="4.5" className="pulse"><animateMotion dur="3.8s" begin={begin} repeatCount="indefinite" path={RAIL} /></circle>
      ))}
      {NODES.map(([x, y, d, num, label]) => (
        <g key={num} className="nd" style={{ '--d': d }}>
          <circle className="halo" cx={x} cy={y} r="17" />
          <circle cx={x} cy={y} r="17" className="core" />
          <text x={x} y={y + 4} className="num">{num}</text>
          <text x={x - 14} y={y - 28} className="lbl">{label}</text>
        </g>
      ))}
      <g className="out"><circle cx="404" cy="336" r="34" className="halo2" /><circle cx="404" cy="336" r="32" /><text x="404" y="331" className="o1">Pipeline</text><text x="404" y="348" className="o2">out.</text></g>
    </svg>
  )
}

const STAGES = [
  ['01', 'Signal intelligence', 'Know who is in market before your competitors do. Systems that watch for the moments that make a company ready to buy, confirm them before anyone picks up the phone, and rank who is likely to be next.', '51', 'qualified leads in the first four days'],
  ['02', 'Research and enrichment agents', "Every account researched to the field, verified at the source, never guessed. The cheapest source that can answer goes first, and the expensive ones only run when they're needed.", '29', 'data points researched per lead'],
  ['03', 'Signal-triggered outbound', 'Outreach that starts because something happened, not because a list was due. Replies, opens and bounces flow straight back, so nobody is chased twice and nobody is forgotten.', '530', 'potential acquirers mapped'],
  ['04', 'Inbound conversion', 'Speed to lead and speed to quote. Every inquiry qualified, priced and routed in seconds, on the web, in the inbox and on the phone.', '~45 sec', 'from photo to priced quote'],
  ['05', 'Retention and expansion', 'Agents that catch customers on the way out, make the right offer and hand warm conversations to the team, while recording why people leave so the product gets better.', '731', 'new prospects captured'],
]

// the stage line draws across when the five stages come into view (stays drawn with reduced motion)
function Stages() {
  const ref = useRef(null)
  useLayoutEffect(() => {
    const s = ref.current
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    s.classList.add('pre')
    const io = new IntersectionObserver(([e], o) => { if (e.isIntersecting) { s.classList.remove('pre'); o.disconnect() } }, { threshold: 0.3 })
    io.observe(s)
    return () => io.disconnect()
  }, [])
  return (
    <div className="stg" ref={ref}>
      {STAGES.map(([n, h, p, b, span]) => <div key={n}><i>{n}</i><h3>{h}</h3><p>{p}</p><div className="pr"><b>{b}</b><span>{span}</span></div></div>)}
    </div>
  )
}

const BRING = [
  ['I speak revenue and code.', 'I can sit in a pipeline review in the morning and ship the fix in the afternoon. Nobody has to translate between the business and the build.'],
  ['I learn the job before I automate it.', 'I sit with the people doing the manual work and map how a lead really moves, not how the playbook says it does.'],
  ['I build the whole system.', 'Signal, research, outreach, conversion, retention and the data underneath, wired together so every stage hands clean data to the next.'],
  ['Agents where judgment helps. Plain code where mistakes cost money.', 'AI reads, researches and decides what deserves attention. Deterministic logic handles prices, sends and customer records.'],
  ['Production or nothing.', 'Real data from the first week, evaluations, guardrails, monitoring, and a person in the loop wherever a mistake would reach a customer.'],
]

const TOOLKIT = [
  ['AI and agents', ['Claude and OpenAI APIs', 'Perplexity']],
  ['Signal, research and outbound', ['Apollo', 'Clay', 'HeyReach', 'Sales Navigator', 'La Growth Machine', 'Firecrawl', 'Apify', 'Browserless', 'Serper', 'NeverBounce', 'Instantly']],
  ['Product and platform engineering', ['Python and FastAPI', 'TypeScript, Next.js and React', '.NET', 'Supabase and Postgres with row-level security']],
  ['Revenue systems and data', ['HubSpot', 'Jobber', 'GoHighLevel', 'Webflow CMS']],
  ['Voice agents', ['Vapi', 'ElevenLabs', 'Voiceflow']],
  ['Orchestration', ['n8n', 'Zapier', 'Make', 'Power Automate']],
  ['Engineering practice', ['Claude Code', 'Cursor', 'Antigravity', 'CI security gates', 'Sentry monitoring', 'secret scanning']],
]

// in-app browsers (LinkedIn, Instagram) ignore `download`; the new tab still shows the PDF there
const Download = ({ className }) => (
  <a className={className} href={RESUME_PDF} download="Muhammad-Haris-AI-GTM-Engineer-Resume.pdf" target="_blank" rel="noopener"><DownloadIcon /> Download resume</a>
)

export default function Resume() {
  usePageMeta('Resume', "I'm Muhammad Haris, an AI GTM engineer. I build the AI systems that find your buyers, research them, reach them at the right moment and keep them.")
  useStylesheet(css, 2)
  return (
    <main>
      <section className="rh"><div className="wrap">
        <div>
          <div className="who"><img src="/images/haris.webp" alt="Muhammad Haris" /><div><b>Muhammad Haris</b><span>AI GTM Engineer</span></div></div>
          <span className="eb">Resume</span>
          <h1>I build revenue systems that <em>run without me.</em></h1>
          <p className="lede">I'm Muhammad Haris, an AI GTM engineer. I build the AI systems that find your buyers, research them, reach them at the right moment and keep them.</p>
          <div className="acts"><Download className="pri" /><a href="/#book">Book a meeting</a></div>
          <div className="ct">
            <a href={`mailto:${EMAIL}`}><MailIcon size={17} /> {EMAIL}</a>
            <a href={LINKEDIN} target="_blank" rel="noopener noreferrer"><LinkedInIcon size={16} /> linkedin.com/in/muhammad-haris-wassan</a>
            <a href={GITHUB} target="_blank" rel="noopener noreferrer"><GitHubIcon size={16} /> github.com/Haris001-bit</a>
          </div>
        </div>
        <EngineDiagram />
      </div></section>

      <section className="wrap eng">
        <span className="eb">What I build</span>
        <h2>Five stages of the revenue engine.</h2>
        <Stages />
        <div className="infra"><i>+</i><div><b>The infrastructure underneath</b><span>CRM, enrichment, sequencing and reporting wired together as one system, so every stage hands clean data to the next and the dashboard tells the truth.</span></div><em>9 production pipelines, one connected system</em></div>
      </section>

      <section className="wrap exp">
        <div className="head"><span className="eb">Who I am</span><h2>Experience.</h2><p>Two roles where I built AI products under the hardest constraints there are: money, regulation and multiple tenants. They are why companies trust me with agents near their revenue.</p>
          <h4>What I bring to every engagement</h4>
          <dl className="bring">{BRING.map(([dt, dd]) => [<dt key={`t-${dt}`}>{dt}</dt>, <dd key={`d-${dt}`}>{dd}</dd>])}</dl>
        </div>
        <div>
          <article><h3>AI GTM Engineer</h3><span className="org">Working directly with founders and revenue leaders</span><div className="txt">
            <p>I build the AI systems behind every stage of the revenue engine: signal detection, account research and enrichment, outbound, inbound conversion and retention. I understand what the number has to do, and I build the machine that does it, to a standard where you can let it run.</p>
            <h4>The systems revenue teams run on</h4>
            <ul>
              <li>A signal engine that watches 38,548 businesses and tells sales the moment one of them needs help. 51 qualified leads in its first four days.</li>
              <li>A research cascade that took more than 80,000 leads to 29 verified data points each without guessing a single field.</li>
              <li>An estimator that prices a job from a photo in about 45 seconds, across eight brands.</li>
              <li>Revenue agents that captured 731 prospects for a national broadband provider while handling more than 8,700 customer conversations.</li>
              <li>A universe of 530 potential acquirers for an investment bank's sell-side deal, delivered the day of the brief.</li>
            </ul>
            <h4>Who I work with</h4>
            <ul>
              <li>B2B SaaS and technology companies, usually growth stage, that want pipeline without simply hiring more SDRs.</li>
              <li>Revenue leaders: founders, CROs, heads of growth, sales and marketing leaders, and RevOps.</li>
              <li>Firms with a high-value sales motion: investment banks and M&amp;A advisors, lead-generation businesses, and companies with heavy inbound demand.</li>
            </ul>
          </div><div className="tags"><span>revenue</span></div></article>
          <article><h3>Founding AI Engineer</h3><span className="org">RevAll AI (Pyle Ventures)</span><div className="txt">
            <p>Founding AI engineer on an early-stage fintech building a read-only investing platform. I built the AI layer: a research agent with guardrails and a streaming safety filter, and an MCP server with hashed, revocable access tokens so a user's own AI assistant can query their data.</p>
            <p>I also built the security programme for bank-data access: two-step sign-in enforced in the database, versioned consent records, rate limits, row-level security, monitoring and a CI security gate.</p>
            <p>Read-only by design. It never moves money.</p>
          </div><div className="tags"><span>money</span></div></article>
          <article><h3>AI Automation Lead</h3><span className="org">Solidrange</span><div className="txt">
            <p>Led AI on a multi-tenant compliance platform for a Riyadh-based company, in English and Arabic.</p>
            <p>Hybrid retrieval with reranking and per-tenant access control enforced at the retrieval layer, 16 specialised AI personas, graph memory, browser automation, and an evaluation pipeline with RAGAS and Arize Phoenix.</p>
            <p>Full-stack delivery in .NET and React with a Python retrieval service, with retrieval, evaluation and tenant isolation designed in from the first commit.</p>
          </div><div className="tags"><span>regulation</span><span>multiple tenants</span></div></article>
        </div>
      </section>

      <section className="tk"><div className="wrap">
        <span className="eb">Under the hood</span>
        <h2>Toolkit.</h2>
        <div className="mods">
          {TOOLKIT.map(([h, items]) => <div key={h}><h4>{h}</h4><ul>{items.map((t) => <li key={t}>{t}</li>)}</ul></div>)}
          <div className="edu"><h4>Education</h4><b>Management Sciences</b><span>Lahore University of Management Sciences (LUMS)</span></div>
        </div>
      </div></section>

      <section className="wrap cl">
        <div className="q"><p>Working with Muhammad was a great experience. He takes the time to thoroughly understand the project before diving in, communicates clearly, and consistently shows strong attention to detail.</p><small>Client</small></div>
        <div className="go"><h3>If you're serious about building a revenue engine, let's talk.</h3><div className="acts"><a href="/#book">Book a meeting &rarr;</a><Download /></div></div>
      </section>
    </main>
  )
}
