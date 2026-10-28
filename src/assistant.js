// AI assistant: "Haris, now caffeine-free" opens a window and starts a voice call with the ElevenLabs agent.
// Voice and typing share one conversation: the agent's words show as text, and typed messages get a spoken reply.
// The agent is public (no key needed); which websites may use it is set in the agent's allowlist.
import css from './assistant.css?inline'
import './booking.js' // every page that has the assistant also gets the "Book a meeting" popup

const AGENT_ID = 'agent_6301m5ybrrq8e38atjxp2hnt0t6d'
const EMAIL = 'hariswassan001@gmail.com'
const CHIPS = ['What do you build?', 'Show me a project', 'Book a meeting']

// the ElevenLabs SDK is large, so it only loads once someone opens the assistant
const sdk = () => import('@elevenlabs/client').then((m) => m.Conversation)

const icon = {
	mic: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0014 0M12 18v3"/></svg>',
	micOff: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 3l18 18M9 9v2a3 3 0 005.1 2.1M15 9.3V6a3 3 0 00-5.7-1.3M5 11a7 7 0 0011.9 5M19 11a7 7 0 01-.6 2.8M12 18v3"/></svg>',
	send: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
	sound: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16.5 8.5a5 5 0 010 7M19.5 5.5a9 9 0 010 13"/></svg>',
	soundOff: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9z"/><path d="M17 9l5 6M22 9l-5 6"/></svg>',
	end: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 15.5c5-4.6 13-4.6 18 0l-2.3 2.6-3.4-1.6v-2.3a10 10 0 00-6.6 0v2.3l-3.4 1.6z"/></svg>',
}

const style = document.createElement('style')
style.textContent = css
document.head.append(style)

const root = document.createElement('div')
root.className = 'ha'
root.innerHTML = `
	<button type="button" class="ha-launch" aria-expanded="false" aria-controls="ha-panel" aria-label="Haris, now caffeine-free: talk to Haris's AI assistant">Haris, now caffeine-free <span>${icon.mic}</span></button>
	<div class="ha-panel" id="ha-panel" role="dialog" aria-label="Haris's AI assistant">
		<div class="ha-head">
			<div class="ha-av" aria-hidden="true">MH</div>
			<div class="ha-who"><b>Haris AI</b><small><i aria-hidden="true"></i><span class="ha-status" aria-live="polite">Connecting…</span></small></div>
			<a class="ha-book" href="/#book">Book a meeting</a>
			<button type="button" class="ha-end">${icon.end}End call</button>
		</div>
		<div class="ha-log" aria-live="polite"></div>
		<form class="ha-input">
			<button type="button" class="ha-mic" aria-pressed="false"></button>
			<button type="button" class="ha-spk" aria-pressed="false"></button>
			<input type="text" placeholder="Type a message" aria-label="Message" maxlength="500" autocomplete="off" />
			<button type="submit" class="ha-send" aria-label="Send">${icon.send}</button>
		</form>
		<p class="ha-legal">AI assistant run by ElevenLabs. Please don't share sensitive details. <a href="/privacy.html#assistant">Privacy</a></p>
	</div>`
document.body.append(root)

const $ = (s) => root.querySelector(s)
const launch = $('.ha-launch'), log = $('.ha-log'), form = $('.ha-input'), input = $('.ha-input input')
const statusEl = $('.ha-status'), micBtn = $('.ha-mic'), spkBtn = $('.ha-spk')

const history = []        // everything said, so a new call can pick up where the last one stopped
const streams = new Map() // agent bubbles being filled word by word, by response id
const sentByMe = []       // typed messages, so their echo isn't shown twice
let session = null
let voice = false         // true when the call has a microphone; false for the typing-only fallback
let muted = true          // every call starts with the mic off; the visitor turns it on to talk
let silent = false        // agent's voice muted; replies still show as text
let hush = null           // a reopened call repeats the greeting: 'wait' for it, then 'play' it silently, hidden
let hushTimer = null
let micHint = false
let starting = null
let queued = []           // messages typed before the call connected
let typingEl = null
let timer = null
let speaking = false
let gen = 0               // bumps on every hang-up, so a call that connects late knows it was cancelled

// --- rendering ---------------------------------------------------------------

// Projects the agent can point to; a page link in its reply becomes a card with the project's cover image
const PROJECTS = {
	'signal-engine': ['Signal intelligence', 'Finding buyers at the exact moment they need help'],
	'research-cascade': ['Research and enrichment', 'Researching 80,000 leads without paying for 80,000 deep dives'],
	'growth-engine': ['Demand generation', 'Turning a product into its own growth engine'],
	'sell-side-buyers': ['Account intelligence, M&A', 'Finding every credible buyer for a sell-side deal'],
	'who-actually-buys': ['Signal-triggered outbound', 'Who actually buys'],
	'instant-quotes': ['Inbound conversion', 'A priced quote in 45 seconds, for eight brands'],
	'speed-to-quote': ['Inbound conversion', 'Speed to quote'],
	'voice-agents': ['Inbound conversion', 'Voice AI agents for service businesses'],
	'uk-broadband': ['Retention and expansion', 'Revenue agents for a UK broadband provider'],
	'household-investing': ['Product and platform', 'Financial operating system for household investing'],
	'marketplace-app': ['Product and platform', 'Two-sided marketplace app, shipped to both stores'],
	'compliance-ai-platform': ['Product and platform', 'Enterprise GRC and compliance AI platform'],
	'compliance-tooling': ['Product and platform', 'Compliance operations tooling and full-stack platform'],
}
// category pages: [title, the project whose image stands in for them]
const CATEGORIES = {
	'signal-intelligence': ['Signal intelligence', 'signal-engine'],
	'research-and-enrichment-agents': ['Research and enrichment agents', 'research-cascade'],
	'signal-triggered-outbound': ['Signal-triggered outbound', 'sell-side-buyers'],
	'inbound-conversion': ['Inbound conversion', 'instant-quotes'],
	'retention-and-expansion': ['Retention and expansion', 'uk-broadband'],
	'product-and-platform-engineering': ['Product and platform engineering', 'household-investing'],
	all: ['All projects', 'growth-engine'],
}
const PAGE = /\/(work|projects)\/([\w-]+)\.html/g

// the page links are taken out of the sentence (they show as cards instead); a sentence that only
// pointed at the link, like "You can see it at /work/x.html.", goes with it
const PAGE_LINK = /\s*[([]?(?:https?:\/\/[^\s/]+)?\/(?:work|projects)\/[\w-]+\.html[)\]]?/g
function stripPages(text) {
	text = text.replace(/\s*[—–]\s*/g, ', ') // the site never uses em or en dashes; the model sometimes does
	text = text.replace(/\[([^\]]+)\]\((?:https?:\/\/[^\s)]+)?\/(?:work|projects)\/[\w-]+\.html\)/g, '$1')
	return text
		.split(/(?<=[.!?])[ \t]+(?=\S)|(?=\n)/)
		.map((s) => {
			if (!PAGE_LINK.test(s)) return s
			PAGE_LINK.lastIndex = 0
			const left = s.replace(PAGE_LINK, '').replace(/\s+([.,!?;:])/g, '$1').replace(/:([.!?]|$)/, '$1')
			const words = left.replace(/[^\w\s']/g, ' ').trim().split(/\s+/).filter(Boolean)
			if (words.length <= 7) return ''
			return left.replace(/\s+(?:at|on|via|here|in|from|to)([.!?:]*)$/i, '$1')
		})
		.filter(Boolean)
		.join(' ')
		.replace(/[ \t]+(?=\n)|(?<=\n)[ \t]+/g, '')
		.replace(/[ \t]{2,}/g, ' ')
		.trim()
}

function card(kind, slug) {
	const [tag, title, img] = kind === 'work'
		? (PROJECTS[slug] ? [...PROJECTS[slug], slug] : [])
		: (CATEGORIES[slug] ? ['Selected work', CATEGORIES[slug][0], CATEGORIES[slug][1]] : [])
	if (!title) return null
	const a = document.createElement('a')
	a.className = 'ha-card'
	a.href = `/${kind}/${slug}.html`
	a.innerHTML = `<img src="/projects/img/p-${img}.webp" alt="" /><span><small></small><b></b><em>View project &rarr;</em></span>`
	a.querySelector('img').addEventListener('load', () => { log.scrollTop = log.scrollHeight }) // the card grows once its image is in
	a.querySelector('small').textContent = tag
	a.querySelector('b').textContent = title
	return a
}

// Agent text can mention the email and resume; turn those into links, never into raw HTML
const LINK = /(\/resume\.html|[\w.+-]+@[\w-]+\.[\w.]+)/g
function fill(el, text) {
	text = text.replace(/\*\*/g, '')
	el.textContent = ''
	stripPages(text).split(LINK).forEach((part, i) => {
		if (i % 2 === 0) { if (part) el.append(part); return }
		const a = document.createElement('a')
		a.textContent = part === '/resume.html' ? 'resume' : part
		a.href = part.includes('@') ? `mailto:${part}` : part
		el.append(a)
	})
	// project cards right under the message, one per page mentioned
	el.cards?.forEach((c) => c.remove())
	const seen = new Set()
	el.cards = [...text.matchAll(PAGE)].filter(([, k, s]) => !seen.has(k + s) && seen.add(k + s)).map(([, k, s]) => card(k, s)).filter(Boolean)
	if (el.cards.length) el.after(...el.cards)
	el.hidden = !el.textContent.trim() // a reply that was only a link shows just its card
}

function bubble(who, text) {
	const el = document.createElement('p')
	el.className = `ha-msg ${who}`
	log.append(el)
	fill(el, text)
	log.scrollTop = log.scrollHeight
	return el
}

function say(who, text) {
	hideTyping()
	if (who !== 'note') history.push({ who, text })
	return bubble(who, text)
}

function showTyping() {
	if (typingEl) return
	typingEl = document.createElement('div')
	typingEl.className = 'ha-msg ai typing'
	typingEl.setAttribute('aria-label', 'Thinking')
	typingEl.innerHTML = '<i></i><i></i><i></i>'
	log.append(typingEl)
	log.scrollTop = log.scrollHeight
}
function hideTyping() { typingEl?.remove(); typingEl = null }

function chips() {
	const box = document.createElement('div')
	box.className = 'ha-chips'
	CHIPS.forEach((c) => {
		const b = document.createElement('button')
		b.type = 'button'
		b.textContent = c
		b.addEventListener('click', () => { box.remove(); send(c) })
		box.append(b)
	})
	log.append(box)
}

function setStatus(text) { statusEl.textContent = text }
function liveStatus() {
	if (!session) return
	if (!voice) return setStatus('Typing only')
	setStatus(speaking ? 'Speaking' : muted ? 'Mic off' : 'Listening')
}

function renderMic() {
	micBtn.hidden = session ? !voice : false
	micBtn.setAttribute('aria-pressed', String(muted))
	micBtn.setAttribute('aria-label', muted ? 'Microphone is off. Turn it on' : 'Microphone is on. Turn it off')
	micBtn.innerHTML = muted ? `${icon.micOff}Mic off` : `${icon.mic}Mic on`
	root.classList.toggle('muted', muted && voice)
	spkBtn.hidden = micBtn.hidden
	spkBtn.setAttribute('aria-pressed', String(silent))
	spkBtn.setAttribute('aria-label', silent ? "Agent's voice is off. Turn it on" : "Agent's voice is on. Turn it off")
	spkBtn.title = silent ? 'Voice off' : 'Voice on'
	spkBtn.innerHTML = silent ? icon.soundOff : icon.sound
}

function applyVolume() {
	if (session && voice) session.setVolume({ volume: silent || hush ? 0 : 1 })
}

function endHush() {
	clearTimeout(hushTimer)
	if (!hush) return
	hush = null
	applyVolume()
}

// --- the call ----------------------------------------------------------------

function callbacks() {
	return {
		onAgentChatResponsePart: ({ text, type, response_id }) => {
			if (type !== 'delta' || !text || hush) return
			const id = response_id || 'reply'
			let el = streams.get(id)
			if (!el) { hideTyping(); el = bubble('ai', ''); streams.set(id, el) }
			el.raw = (el.raw || '') + text
			el.textContent = stripPages(el.raw) // page links never flash up while the reply streams in
			el.hidden = !el.textContent
			log.scrollTop = log.scrollHeight
		},
		onMessage: ({ message, role, response_id }) => {
			if (!message?.trim()) return
			if (role === 'agent') {
				if (hush === 'wait') { hush = 'play'; if (!voice) endHush(); return } // the repeated greeting: drop it
				const id = response_id || 'reply'
				const el = streams.get(id)
				streams.delete(id)
				if (el) { fill(el, message); history.push({ who: 'ai', text: message }); hideTyping(); log.scrollTop = log.scrollHeight }
				else say('ai', message)
				// quick replies under the greeting, until the visitor says anything
				if (!chipsShown && !history.some((m) => m.who === 'me')) { chipsShown = true; chips() }
				return
			}
			// spoken words arrive here as text; typed ones were already shown when sent
			const i = sentByMe.indexOf(message.trim())
			if (i !== -1) { sentByMe.splice(i, 1); return }
			say('me', message)
			showTyping()
		},
		onModeChange: ({ mode }) => {
			if (hush) { applyVolume(); if (hush === 'play' && mode === 'listening') endHush(); return }
			if (mode === 'speaking') applyVolume()
			speaking = mode === 'speaking'
			root.classList.toggle('speaking', speaking)
			liveStatus()
		},
		onDisconnect: () => {
			if (!session) return
			session = null
			afterCall('Call ended. Type a message or press "Haris, now caffeine-free" to start again.')
		},
		onError: (message) => {
			console.warn('[assistant]', message)
			hideTyping()
			say('note', `Something went wrong. Try again, or email ${EMAIL}.`)
		},
	}
}

function afterCall(note) {
	clearInterval(timer)
	clearTimeout(hushTimer)
	hush = null
	streams.clear()
	speaking = false
	root.classList.remove('live', 'speaking')
	hideTyping()
	setStatus('Not connected')
	renderMic()
	if (note) say('note', note)
}

// tell a fresh call what was already said, so it continues the same conversation
function shareHistory(pending) {
	const said = history.slice(0, history.length - pending).slice(-12) // queued messages are sent for real right after
	if (said.length) session.sendContextualUpdate('Earlier in this conversation:\n' + said.map((m) => `${m.who === 'me' ? 'Visitor' : 'You'}: ${m.text}`).join('\n'))
}

async function startCall() {
	if (session) return
	if (starting) return starting
	setStatus('Connecting…')
	const g = gen
	// reopening continues the conversation, so the agent's greeting isn't heard or shown a second time
	hush = history.some((m) => m.who === 'ai') ? 'wait' : null
	starting = (async () => {
		const [Conversation, mic] = await Promise.all([
			sdk(),
			navigator.mediaDevices?.getUserMedia({ audio: true }).then((s) => { s.getTracks().forEach((t) => t.stop()); return true }, () => false) ?? false,
		])
		voice = mic
		if (!voice && !micHint) { micHint = true; say('note', 'Microphone is off, so this is a typing-only chat. Allow the microphone in your browser to talk.') }
		const s = await Conversation.startSession({ agentId: AGENT_ID, connectionType: voice ? 'webrtc' : 'websocket', textOnly: !voice, ...callbacks() })
		if (g !== gen) { s.endSession(); return } // the window was closed while connecting
		session = s
		root.classList.add('live')
		applyVolume()
		if (hush) hushTimer = setTimeout(endHush, 12000) // never stay silent if no greeting comes
		if (voice && muted) {
			s.setMicMuted(true)
			if (!micHint) { micHint = true; say('note', 'Your mic is off. Click "Mic off" to turn it on and talk, or type below.') }
		}
		renderMic()
		liveStatus()
		shareHistory(queued.length)
		const t0 = Date.now()
		timer = setInterval(() => {
			const sec = Math.floor((Date.now() - t0) / 1000)
			if (!speaking && session) setStatus(`${voice ? (muted ? 'Mic off' : 'Listening') : 'Typing only'} · ${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`)
		}, 1000)
		queued.splice(0).forEach((t) => { sentByMe.push(t); s.sendUserMessage(t) })
	})()
	try { await starting }
	catch (e) {
		console.warn('[assistant]', e)
		queued = []
		afterCall(`Couldn't connect. Try again, or email ${EMAIL}.`)
	} finally { starting = null }
}

async function endCall() {
	gen++
	queued = []
	const s = session
	session = null
	if (s) await s.endSession().catch(() => {})
	afterCall()
}

function send(text) {
	text = text.trim()
	if (!text) return
	log.querySelector('.ha-chips')?.remove()
	say('me', text)
	showTyping()
	endHush() // the visitor spoke first, so the reply must be heard
	if (session) { sentByMe.push(text); session.sendUserMessage(text) }
	else { queued.push(text); startCall() }
}

// --- open and close ----------------------------------------------------------

let chipsShown = false
function open() {
	root.classList.add('open')
	launch.setAttribute('aria-expanded', 'true')
	if (!session && !starting) { muted = true; renderMic() }
	startCall()
	setTimeout(() => input.focus({ preventScroll: true }), 50)
}

async function close() {
	root.classList.remove('open')
	launch.setAttribute('aria-expanded', 'false')
	launch.focus({ preventScroll: true })
	await endCall()
}

renderMic()
launch.addEventListener('click', open)
$('.ha-end').addEventListener('click', close)
micBtn.addEventListener('click', () => {
	muted = !muted
	session?.setMicMuted(muted)
	renderMic()
	liveStatus()
})
spkBtn.addEventListener('click', () => {
	silent = !silent
	applyVolume()
	renderMic()
})
form.addEventListener('submit', (e) => {
	e.preventDefault()
	const text = input.value
	input.value = ''
	send(text)
})
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && root.classList.contains('open') && !document.querySelector('dialog[open]')) close() })
window.addEventListener('pagehide', () => { session?.endSession() })
