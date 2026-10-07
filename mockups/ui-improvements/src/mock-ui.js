// UI improvement prototypes, injected over the live page for the mockup captures only.
;(function () {
	const REF = './workspace/ref/'
	const LOGO = './assets/img/tools/'
	const P = [
		['Inbox', 'Email triage, n8n', 'ref-1031.jpg', 'n8n.png'],
		['Support', 'Support agent, n8n', 'ref-1005.jpg', 'openai.svg'],
		['Compliance', 'FERPA platform, GHL', 'ref-1018.jpg', 'ghl.png'],
		['Ten Zaps', 'Event pipeline, Zapier', 'ref-1016.jpg', 'zapier.png'],
		['Voices', 'RAG chatbots, n8n', 'ref-1027.jpg', 'n8n.png'],
		['Caller', 'Voice agent, Retell AI', 'ref-26.jpg', 'retell.png'],
		['WhatsApp', 'WhatsApp agent, n8n', 'ref-1015.jpg', 'twilio.svg'],
		['Grocery', 'Vision pipeline, Make', 'ref-1060.jpg', 'make.png'],
		['Studio', 'Content pipeline, n8n', 'ref-1050.jpg', 'n8n.png'],
		['Scout', 'Lead qualifier, n8n', 'ref-1044.jpg', 'ghl.png'],
		['Icebreaker', 'AI outreach, n8n', 'ref-1036.jpg', 'n8n.png'],
		['Screener', 'Resume AI, n8n', 'ref-201.jpg', 'n8n.png'],
	]
	const section = document.getElementById('panel-works')
	const el = (html) => {
		const t = document.createElement('template')
		t.innerHTML = html.trim()
		return t.content.firstChild
	}
	const pad = (n) => String(n + 1).padStart(2, '0')

	window.__mock = {
		// 01: all twelve projects in a filmstrip at the bottom, the current one lifted and lit
		rail(active) {
			section.querySelector('.ws__controls').style.display = 'none'
			section.querySelector('.ws__hint').style.display = 'none'
			const items = P.map(([name, , img], i) => `<span class="mk-rail__item${i === active ? ' is-active' : ''}"><i style="background-image:url(${REF + img})"></i>${name}</span>`).join('')
			section.appendChild(el(`<div class="mk-rail"><span class="mk-rail__nav">&larr;</span>${items}<span class="mk-rail__nav">&rarr;</span><span class="mk-rail__count"><b>${pad(active)}</b> / 12</span></div>`))
			// the intro sits a little higher so the rail has room
			section.querySelector('.ws__intro').style.bottom = '190px'
		},
		// 02: a plaque under the hovered card, and a cursor that says what a click does
		plaque(i, box, fig, mouse) {
			const [name, sub, , logo] = P[i]
			const sr = section.getBoundingClientRect()
			const p = el(`<div class="mk-plaque"><img src="${LOGO + logo}" alt=""><b>${name}</b><small>${sub}</small><div class="mk-plaque__fig"><span><strong>${fig[0]}</strong>${fig[1]}</span><span>Click to open</span></div></div>`)
			p.style.left = (box[0] + box[2]) / 2 - sr.left + 'px'
			p.style.top = box[3] - sr.top + 26 + 'px'
			section.appendChild(p)
			const c = el(`<div class="mk-cursor">Open</div>`)
			c.style.left = mouse[0] - sr.left + 'px'
			c.style.top = mouse[1] - sr.top + 'px'
			section.appendChild(c)
			const sticky = document.querySelector('.sticky-cursor')
			if (sticky) sticky.style.display = 'none'
		},
		// 03: the opened project as a case file: headline result first, tools with their logos,
		// and the neighbouring projects one tap away
		caseFile(i, d) {
			const det = section.querySelector('.ws__detail')
			det.classList.add('mk-file')
			const logoOf = (s) => {
				const n = s.toLowerCase()
				const map = { n8n: 'n8n.png', openai: 'openai.svg', gpt: 'openai.svg', airtable: 'airtable.svg', zapier: 'zapier.png', make: 'make.png', gohighlevel: 'ghl.png', twilio: 'twilio.svg', retell: 'retell.png', webflow: 'webflow.svg', postgresql: 'postgresql.svg', 'next.js': 'nextjs.svg' }
				const k = Object.keys(map).find((key) => n.includes(key))
				return k ? `<img src="${LOGO + map[k]}" alt="">` : `<em>${s[0]}</em>`
			}
			const prev = P[(i + 11) % 12]
			const next = P[(i + 1) % 12]
			det.innerHTML = `
				<div class="mk-file__top"><span><b>${pad(i)}</b> / 12 &nbsp;&middot;&nbsp; ${d.tag}</span><span class="mk-file__x">&times;</span></div>
				<h3>${d.name}</h3>
				<p class="mk-file__lede">${d.copy}</p>
				<div class="mk-file__hero"><strong>${d.figs[0][0]}</strong><span>${d.figs[0][1]}</span>
					<div class="mk-file__more">${d.figs.slice(1).map((f) => `<span><b>${f[0]}</b>${f[1]}</span>`).join('')}</div></div>
				<p class="mk-file__label">Built with</p>
				<div class="mk-file__stack">${d.stack.map((s) => `<span>${logoOf(s)}${s}</span>`).join('')}</div>
				<div class="mk-file__acts"><span class="mk-file__cta">Start a similar project &rarr;</span><span class="mk-file__ghost">Back to the wall</span></div>
				<div class="mk-file__pager">
					<a><i style="background-image:url(${REF + prev[2]})"></i><small>Previous</small>${prev[0]}</a>
					<a><i style="background-image:url(${REF + next[2]})"></i><small>Next</small>${next[0]}</a>
				</div>`
		},
		// 04: where you are on the page, and a richer intro with live proof points
		index() {
			document.body.appendChild(el(`<div class="mk-index"><span>01 Intro</span><span class="is-on">02 Work</span><span>03 Connect</span></div>`))
			const intro = section.querySelector('.ws__intro')
			intro.insertBefore(el(`<p class="mk-eyebrow">02 / Selected work</p>`), intro.firstChild)
			intro.appendChild(el(`<div class="mk-chips"><span><i></i><b>12</b> systems live</span><span><b>6,700+</b> conversations</span><span><b>5</b> platforms</span></div>`))
		},
		// 05: the day/night control as a real wall switch, next to the visitor's own time
		switchPlate(time, place) {
			section.querySelector('.ws__corner').style.display = 'none'
			section.appendChild(el(`<div class="mk-switch"><span class="mk-switch__plate"><span class="mk-switch__rocker"></span></span>
				<span class="mk-switch__text"><b><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6"/></svg>Lights: day</b>
				<small>${place} &nbsp;<strong>${time}</strong></small></span></div>`))
		},
	}
})()
// 06: Connect in the same voice as the hero and the room: same type, a real portrait instead of
// empty tiles, the hero's proven numbers, and no em dashes
window.__mock.connect = function () {
	const s = document.getElementById('panel-scaling')
	s.classList.add('mk-connect')
	s.querySelector('.scaling__eyebrow').textContent = '03 / Connect'
	s.querySelector('.scaling__title').innerHTML = 'Let\u2019s build what <span>compounds</span>'
	s.querySelector('.scaling__lede').textContent = 'If the problem is real and the timing is right, we start with a clear diagnosis, then ship only what will keep working after the first win.'
	const team = s.querySelector('.scaling-card--team')
	team.querySelectorAll('.scaling-team__grid, .scaling-team__foot').forEach((n) => (n.style.visibility = 'hidden'))
	team.style.position = 'relative'
	team.insertAdjacentHTML('beforeend', `<div class="mk-portrait"><img src="./assets/img/haris-hero-wall.webp" alt="">
		<div class="mk-portrait__meta"><b>Muhammad Haris</b><small><i></i>Available for select work</small><br><span class="mk-portrait__cta">Chat with Haris &rarr;</span></div></div>`)
	const top = s.querySelector('.scaling-stats__top')
	top.innerHTML = `<div class="mk-stat"><strong>12</strong><span>systems running<br>in production</span>
		<ul><li><b>6,700+</b>conversations automated</li><li><b>21,000+</b>agent minutes saved</li><li><b>7</b>live client deployments</li></ul></div>`
	const meta = s.querySelector('.scaling-quote__meta')
	if (meta) meta.textContent = 'Muhammad Haris, AI systems'
}
