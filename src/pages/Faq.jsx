import { Link } from 'react-router-dom'
import SlimFooter from '../components/SlimFooter.jsx'
import { usePageMeta } from '../hooks/usePageMeta.js'
import { useStylesheet } from '../hooks/useStylesheet.js'
import css from '../styles/pages/faq.css?inline'

const FAQ = [
  ['What does an AI GTM engineer actually do?', 'I build the AI systems behind every stage of the revenue engine: finding accounts that are in market, researching them, reaching them at the right moment, converting inbound demand and keeping customers. Then I wire it all together so every stage hands clean data to the next.'],
  ['Who do you usually work with?', 'B2B SaaS and technology companies, usually growth stage, that want pipeline without simply hiring more SDRs. Day to day that means founders, CROs, heads of growth, sales and marketing leaders and RevOps. I also work with firms that have a high-value sales motion, like investment banks, M&A advisors and lead-generation businesses.'],
  ['Are you an agency?', "No. The person you talk to is the person who builds it, and the person who answers when it needs attention. I don't hand work to juniors."],
  ['How does a project start?', 'I sit with the people doing the work and watch how a lead really moves through the company. Then I find where revenue leaks and start the build there, on real data from the first week, not on a demo.'],
  ['How do you stop an AI agent from saying the wrong thing to a prospect?', 'No agent talks to a prospect without a guardrail. AI does the reading and research, plain code handles anything that touches a price, a send or a customer record, and a person approves anything sensitive before it reaches a customer.'],
  ['What happens when the project is finished?', "Your team owns it. I hand it over documented, explained and understood by the people who will live with it. I stay close until it runs without me, and I'm a message away when it matters."],
  ['Which tools do you use?', <>Whatever fits the problem. I start from where pipeline leaks and pick the stack after. That usually means Claude and OpenAI, Clay, Apollo, HubSpot, n8n, Python and Postgres. The full list is on my <Link to="/resume">resume</Link>.</>],
  ['How much does it cost?', "It depends on what the system has to do. Tell me where pipeline is leaking and I'll tell you what I'd build and what it would take."],
  ['Can you work with sensitive data?', "Yes. I've built around bank data and regulated compliance, with row-level security, consent records, monitoring and human approval designed in from the first commit. Your pipeline gets the same standard."],
]

// structured data for search engines: six of the questions, with shorter answers
const LD = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    ['What does an AI GTM engineer actually do?', 'I build the AI systems behind every stage of the revenue engine: finding accounts that are in market, researching them, reaching them at the right moment, converting inbound demand and keeping customers. Then I wire it all together so every stage hands clean data to the next.'],
    ['Who do you usually work with?', 'B2B SaaS and technology companies, usually growth stage, that want pipeline without simply hiring more SDRs, plus firms with a high-value sales motion like investment banks, M&A advisors and lead-generation businesses.'],
    ['Are you an agency?', 'No. The person you talk to is the person who builds it, and the person who answers when it needs attention.'],
    ['How does a project start?', 'I sit with the people doing the work, find where revenue leaks and start the build there, on real data from the first week.'],
    ['What happens when the project is finished?', 'Your team owns it. I hand it over documented and explained, and stay close until it runs without me.'],
    ['How much does it cost?', "It depends on what the system has to do. Tell me where pipeline is leaking and I'll tell you what I'd build and what it would take."],
  ].map(([name, text]) => ({ '@type': 'Question', name, acceptedAnswer: { '@type': 'Answer', text } })),
}

export default function Faq() {
  usePageMeta('FAQ', 'Questions revenue leaders ask before a first meeting: what an AI GTM engineer does, who I work with, how a project starts and what it costs.')
  useStylesheet(css, 2)
  return (
    <>
      <section className="hd"><div className="wrap">
        <span className="eb">FAQ</span>
        <h1>Questions <em>before we talk.</em></h1>
        <p>The things revenue leaders usually ask before a first meeting.</p>
      </div></section>

      <main><div className="wrap">
        <div className="faq-list">
          {FAQ.map(([q, a], i) => <details key={q} open={i === 0}><summary>{q}</summary><p>{a}</p></details>)}
        </div>
        <div className="more"><div><b>Still have a question?</b><span>Ask Haris, now caffeine-free, in the corner, or put it on the calendar.</span></div><a className="btn" href="/#book">Book a meeting</a></div>
      </div></main>

      <SlimFooter links={[{ to: '/', label: 'Home' }, { to: '/resume', label: 'Resume' }, { to: '/privacy', label: 'Privacy' }]}>&copy; Muhammad Haris</SlimFooter>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(LD) }} />
    </>
  )
}
