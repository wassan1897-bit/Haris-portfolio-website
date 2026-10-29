import { Link } from 'react-router-dom'
import SlimFooter from '../components/SlimFooter.jsx'
import { usePageMeta } from '../hooks/usePageMeta.js'
import { useStylesheet } from '../hooks/useStylesheet.js'
import { EMAIL } from '../lib/site.js'
import css from '../styles/pages/privacy.css?inline'

const TOC = [
  ['who', 'Who I am'], ['collect', 'What I collect and why'], ['assistant', 'The AI assistant'], ['not', "What I don't do"],
  ['who-else', 'Who else handles it'], ['keep', 'How long I keep it'], ['rights', 'Your rights'], ['other', 'Everything else'],
]

export default function Privacy() {
  usePageMeta('Privacy', 'What this website collects, why, who handles it and how to ask for it to be deleted.')
  useStylesheet(css, 2)
  return (
    <>
      <section className="hd"><div className="wrap">
        <span className="eb">Privacy</span>
        <h1>Your data, in plain words.</h1>
        <p>This site is a portfolio. It doesn't track you, and it only handles personal data when you choose to email me, book a meeting or talk to the AI assistant.</p>
        <small>Last updated 28 October 2026</small>
      </div></section>

      <main><div className="wrap doc">
        <nav className="toc" aria-label="On this page">
          <b>On this page</b>
          {TOC.map(([id, label]) => <a key={id} href={`#${id}`}>{label}</a>)}
        </nav>

        <article>
          <div className="short">
            <h2>The short version</h2>
            <ul>
              <li>No cookies, no analytics, no ads and no tracking pixels.</li>
              <li>The microphone stays off until you turn it on, and your browser asks first.</li>
              <li>Booking requests go from your own email app to my inbox. This site stores nothing.</li>
              <li>I never sell your data. Email me and I'll delete it.</li>
            </ul>
          </div>

          <h2 id="who">Who I am</h2>
          <p>This website belongs to Muhammad Haris, an AI GTM engineer. I decide what happens to the personal data described here. You can reach me at <a href={`mailto:${EMAIL}`}>{EMAIL}</a> about anything on this page.</p>

          <h2 id="collect">What I collect and why</h2>
          <table>
            <thead><tr><th>When you</th><th>What I get</th><th>Why</th></tr></thead>
            <tbody>
              <tr><td>Email me or use a "Book a meeting" button</td><td>Your name, email address and whatever you write, including the time you picked</td><td>To reply and set up the meeting you asked for</td></tr>
              <tr><td>Talk to or type to the AI assistant</td><td>What you type, what you say while the microphone is on, and the written transcript</td><td>To answer your questions and, if you ask, to arrange a meeting</td></tr>
              <tr><td>Visit any page</td><td>Standard server logs kept by the hosting provider: IP address, browser, pages requested and time</td><td>To keep the site secure and running</td></tr>
            </tbody>
          </table>
          <p>The legal basis is your request (you asked me to reply or to meet) and my legitimate interest in running a secure website and answering enquiries.</p>

          <h2 id="assistant">The AI assistant</h2>
          <p>"Haris, now caffeine-free", the button in the corner, is an AI assistant built on ElevenLabs. It knows about my work and can help you book a meeting. It isn't me, and it can make mistakes.</p>
          <h3>The microphone</h3>
          <ul>
            <li>Opening the assistant starts a call with the microphone off. Your browser asks for permission before anything can be heard.</li>
            <li>Your voice is only sent while the button says "Mic on". It stops when you turn it off, end the call or close the window.</li>
            <li>If you block the microphone, the assistant works as a typing-only chat.</li>
          </ul>
          <h3>What happens to the conversation</h3>
          <ul>
            <li>ElevenLabs processes your words, and your voice if the mic is on, to produce each reply. Behind the scenes it uses an AI language model to write the answers.</li>
            <li>The transcript is kept for 30 days so I can see what visitors ask and improve the answers, then it's deleted.</li>
            <li>Please don't share passwords, payment details, health information or anything else sensitive. The assistant will never ask for them.</li>
          </ul>

          <h2 id="not">What I don't do</h2>
          <ul>
            <li>I don't use cookies, analytics, advertising or tracking of any kind.</li>
            <li>I don't sell, rent or trade personal data.</li>
            <li>I don't build profiles or make automated decisions about you.</li>
            <li>Fonts, images and code are served from this site itself, so visiting doesn't ping a font service or ad network.</li>
          </ul>

          <h2 id="who-else">Who else handles it</h2>
          <p>A small number of services handle data on my behalf, each under its own privacy terms:</p>
          <ul>
            <li><b>ElevenLabs</b> runs the AI assistant: text, voice and transcripts.</li>
            <li><b>Google (Gmail)</b> receives the emails you send me.</li>
            <li><b>The hosting provider</b> serves the website and keeps the server logs described above.</li>
          </ul>
          <p>Some of these companies process data outside your country. When they do, they use the safeguards the law requires, such as standard contractual clauses.</p>

          <h2 id="keep">How long I keep it</h2>
          <ul>
            <li><b>Emails and meeting requests:</b> for as long as we're talking or working together, then deleted unless I need to keep something for legal or accounting reasons.</li>
            <li><b>Assistant transcripts:</b> 30 days, then deleted.</li>
            <li><b>Server logs:</b> for the short period the hosting provider keeps them, usually a few weeks.</li>
          </ul>

          <h2 id="rights">Your rights</h2>
          <p>You can ask me to show you the personal data I hold about you, correct it, delete it, send you a copy, or stop using it. Email <a href={`mailto:${EMAIL}?subject=Privacy%20request`}>{EMAIL}</a> and I'll reply within 30 days. You don't need to explain why.</p>
          <p>If you're unhappy with how I've handled your data, you can complain to the data protection authority where you live. In the UK that's the Information Commissioner's Office.</p>

          <h2 id="other">Everything else</h2>
          <h3>Links to other sites</h3>
          <p>Links to LinkedIn, GitHub and other sites take you somewhere with its own privacy policy. I don't control what they collect.</p>
          <h3>Children</h3>
          <p>This site is meant for businesses and isn't aimed at anyone under 16.</p>
          <h3>Changes</h3>
          <p>If anything here changes, I'll update this page and the date at the top.</p>
        </article>
      </div></main>

      <SlimFooter links={[{ to: '/', label: 'Home' }, { to: '/resume', label: 'Resume' }, { href: `mailto:${EMAIL}`, label: 'Email' }]}>&copy; Muhammad Haris</SlimFooter>
    </>
  )
}
