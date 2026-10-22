/* The project case files ("View the project"), first screen: a results board for each project, opened by a
   cinematic intro. The project's clip plays full screen behind its title for a moment, then flies into the
   board's video tile while the rest of the board rises in. Any scroll, click or key skips the intro. The
   original case-file content stays below the board as "The full story".
   Built from DATA at load; projects.js still owns opening and closing the panels (case-board.css). */
;(function () {
	const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
	const small = window.matchMedia('(max-width: 767px)')
	const INTRO = 4200

	const DATA = {
		'01': {
			kick: ['Mobile app', 'Live on both stores'],
			title: 'One web app, <em>two app stores.</em>',
			desc: 'A homeowner-and-contractor marketplace taken from the web to native iOS and Android, built solo with no Mac anywhere in the pipeline.',
			stats: [['1st', 'Approved by Apple', 'submission, after earlier rejections'], ['2', 'Stores live', 'App Store and Google Play'], ['0', 'Macs used', 'to build, sign and ship it']],
			steps: ['Web app wrapped in a native shell', 'Cloud macOS CI builds and signs', 'Shipped to both app stores'],
			film: 'From the web app to two app stores.',
		},
		'02': {
			kick: ['AI support', 'Live in production'],
			title: 'One chat agent, <em>six workflows behind it.</em>',
			desc: 'End-to-end AI customer support for a UK fibre broadband provider: the agent talks to customers, six single-purpose workflows do the work.',
			stats: [['6,700+', 'Conversations', 'automated so far'], ['2,400+', 'Tickets', 'routed across 7 departments'], ['21,000+', 'Agent minutes', 'saved, estimated']],
			steps: ['The chat agent talks to the customer', 'Six single-purpose workflows do the work', 'Tickets routed across 7 departments'],
			film: 'The six workflows and the numbers they move.',
		},
		'03': {
			kick: ['Email automation', 'Live in production'],
			title: 'Every enquiry filed, logged <em>and answered.</em>',
			desc: 'Classifies email and web-form enquiries, files attachments, updates a live CRM ledger and drafts replies for a human to approve.',
			stats: [['224', 'Node pipeline', 'for email, plus a 38-node intake'], ['8', 'Reasoning paths', 'one tightly scoped job each'], ['1', 'Rules document', 'staff edit it, no redeploys']],
			steps: ['Classify every email and web form', 'File attachments and update the CRM', 'Draft a reply for human review'],
			film: 'An enquiry, from the inbox to a reviewed draft.',
		},
		'04': {
			kick: ['AI platform', 'Multi-tenant, English and Arabic'],
			title: 'Many tenants, one platform. <em>Data never mixes.</em>',
			desc: 'A bilingual compliance platform where 16 AI consultant personas advise many organisations without ever mixing their data.',
			stats: [['16', 'AI personas', 'each with its own knowledge'], ['2', 'Languages', 'English and Arabic'], ['80 → 8', 'Reranked', 'candidates for every answer']],
			steps: ['Access filter inside the search query', 'Hybrid retrieval, reranked to 8', 'Answer with citations, per persona'],
			film: 'One question, five stages, every answer cited.',
		},
		'05': {
			kick: ['AI agent', 'Live, 24/7'],
			title: 'The night shift, <em>handled.</em>',
			desc: 'A Level 1 support agent for a broadband provider: triage, live outage checks and tickets, out of hours, with no human involved.',
			stats: [['790+', 'Tickets resolved', 'end to end, no person touched them'], ['7,101', 'Support time saved', 'minutes handed back to the team'], ['0', 'Out of hours', 'humans needed overnight']],
			steps: ['Triage: customer or prospect', 'Live outage check', 'Ticket to the right team'],
			film: 'A flight through the outage check and the five routing lanes.',
		},
		'06': {
			kick: ["Retention", "Live on real switch events"],
			title: "A reply within minutes, <em>a reason every time.</em>",
			desc: "When a customer starts switching away, an AI agent reaches them on WhatsApp with an offer from their own account, then hands them to a person.",
			stats: [["Minutes", "To first message", "from the switch-away event"], ["Live", "In production", "on real switch events"], ["Why", "Reason captured", "the insight the business never had"]],
			steps: ["Switch-away event passes the opt-out gate", "Offer from their account, on WhatsApp", "AI agent replies, a person takes over"],
			film: "From the switch event to the handover.",
		},
		'07': {
			kick: ["Ops tooling", "Regulated nonprofit"],
			title: "No version control? <em>Now there is.</em>",
			desc: "A CLI that pulls automations out of a GUI-only platform for review in git, and a compliance app with seven role-based access levels.",
			stats: [["7", "Staff roles", "each with its own access"], ["Git", "Reviewed changes", "on every automation"], ["PKCE", "Secure sign-in", "Azure AD OAuth2 to the API"]],
			steps: ["Sign in with OAuth2 and PKCE", "Pull the flow as JSON, review in git", "Push it back to the live automation"],
			film: "From a locked editor to a reviewed push.",
		},
		'08': {
			kick: ["Data pipeline", "Live, per campaign"],
			title: "Two fields in, <em>twenty-nine out.</em>",
			desc: "A name and a website become 29 structured fields, through four sources that each fire only for the gaps the cheaper one left.",
			stats: [["29", "Fields per lead", "from just a name and a website"], ["~96%", "Accuracy", "field level, null-safe"], ["4", "Source tiers", "cheapest sufficient source wins"]],
			steps: ["Tier 1 and 2: data APIs, then a waterfall", "Tier 3 and 4: agentic crawl, then AI", "Weighted merge into the outbound loop"],
			film: "Four tiers, filling 29 fields.",
		},
		// Selected work (selected/selected-detail.js opens these; their clips are portrait, 4:5)
		sw01: {
			kick: ['Voice AI', 'Live phone agent'],
			title: 'Every call answered, <em>every caller routed.</em>',
			desc: 'A Retell AI phone agent for a UK broadband provider: it triages the caller, checks live outages through n8n and hands over to the right team with the context kept.',
			stats: [['0', 'Wait time', 'every call is picked up straight away'], ['7', 'Departments', 'each handoff keeps the context'], ['Live', 'Outage check', 'before any technical escalation']],
			steps: ['Answer and work out who is calling', 'Classify the issue, sync the CRM', 'Check outages, route to the right team'],
			film: 'A flight through the call flow and the outage check.',
		},
		sw02: {
			kick: ['Fintech AI', 'Live, onboarding beta customers'],
			title: 'Your money, answered <em>with evidence.</em>',
			desc: 'A household investing platform where a tool-using AI agent answers from your real accounts and shows where each number comes from.',
			stats: [['2', 'Separate databases', 'private and public, split by a lint rule'], ['2', 'AI dev agents', 'shipping to one production codebase'], ['100s', 'Pull requests', 'and migrations shipped to a live system']],
			steps: ['Ask a question in plain English', 'The agent reads your real accounts', 'The answer shows its evidence'],
			film: 'A question, the trust boundary, and how it ships.',
		},
		sw03: {
			kick: ['Vision AI', 'Live across seven tenants'],
			title: 'Photo in, <em>price out.</em>',
			desc: 'A white-label estimation tool: a vision model reads the photo, a fixed rubric sets the price, and the range goes back by SMS and email.',
			stats: [['7', 'Paying tenants', 'one core, configured per business'], ['17', 'Workflows', 'on one n8n instance'], ['1', 'Pricing rubric', 'fixed, so the model never invents a price']],
			steps: ['A usability gate checks the photo', 'Vision model plus a fixed rubric', 'Price by SMS and email, quote into the CRM'],
			film: 'From a photo to a price, then seven tenants.',
		},
		sw04: {
			kick: ['Monitoring', 'Live, weekly cadence'],
			title: 'Every flag rechecked <em>before it is a lead.</em>',
			desc: 'A weekly sweep over a very large set of public listings, where a change only becomes a sales lead after a delayed, independently corroborated recheck.',
			stats: [['42k', 'Checks a week', 'in every weekly sweep'], ['2', 'Stage check', 'a first flag never triggers outreach'], ['Weekly', 'Live cadence', 'latest milestone signed off and paid']],
			steps: ['Weekly sweep and presence check', 'Stage 1 flag, then a delayed recheck', 'Corroborated, scored, on the case board'],
			film: 'A sweep, a recheck, and the one flag that holds.',
		},
	}

	const BARS = [22, 34, 30, 48, 44, 60, 70, 66, 82, 100]

	document.querySelectorAll('.pj-detail').forEach((panel) => {
		const n = (panel.id.match(/(\d\d)$/) || [])[1]
		// a panel can carry its own clip (data-poster, data-webm, data-mp4, data-mp4-small) and board key;
		// otherwise it borrows the clip of its project screen
		const key = panel.dataset.board || n
		const d = DATA[key]
		const caseVideo = panel.dataset.mp4 ? panel : document.querySelector(`#project-${n} video`)
		if (!d || !caseVideo) return
		const poster = caseVideo.getAttribute(caseVideo === panel ? 'data-poster' : 'poster')
		if (caseVideo === panel) panel.style.setProperty('--pjb-poster', `url("${new URL(poster, location.href).href}")`)
		const body = panel.querySelector('.pj-detail__body')
		const top = panel.querySelector('.pj-detail__top')
		const head = panel.querySelector('.pj-detail__head')

		// ---- the board ----
		const board = document.createElement('section')
		board.className = 'pjb'
		board.innerHTML = `
			<div class="pjb__head">
				<div class="pjb__in">
					<p class="pjb__kick"><b>${d.kick[0]}</b> · ${d.kick[1]}</p>
					<h3 class="pjb__title" id="pjb-${key}-title">${d.title}</h3>
				</div>
				<p class="pjb__desc pjb__in">${d.desc}</p>
			</div>
			<div class="pjb__grid">
				<div class="pjb__tile pjb__tile--video">
					<div class="pjb__slot"></div>
					<p class="pjb__cap pjb__in"><span><b>▶ Watch again</b> · 12 s</span>${d.film}</p>
				</div>
				<div class="pjb__tile pjb__in"><p class="pjb__lab">${d.stats[0][1]}</p><p class="pjb__big">${d.stats[0][0]}</p><p class="pjb__sub">${d.stats[0][2]}</p>
					<div class="pjb__bars" aria-hidden="true">${BARS.map((h, i) => `<i style="height:${h}%;--i:${i}"></i>`).join('')}</div></div>
				<div class="pjb__tile pjb__in"><p class="pjb__lab">${d.stats[1][1]}</p><p class="pjb__big">${d.stats[1][0]}</p><p class="pjb__sub">${d.stats[1][2]}</p></div>
				<div class="pjb__tile pjb__tile--accent pjb__in"><p class="pjb__lab">${d.stats[2][1]}</p><p class="pjb__big">${d.stats[2][0]}</p><p class="pjb__sub">${d.stats[2][2]}</p></div>
				<div class="pjb__tile pjb__in"><p class="pjb__lab">How it works</p><ol class="pjb__steps">${d.steps.map((s) => `<li>${s}</li>`).join('')}</ol></div>
			</div>
			<p class="pjb__more pjb__in" aria-hidden="true">The full story ↓</p>`
		top.after(board)
		panel.setAttribute('aria-labelledby', `pjb-${key}-title`)
		// the old heading becomes the start of "the full story"
		if (head) {
			head.classList.add('pjb-story')
			const h = head.querySelector('.pj-detail__title')
			if (h) h.remove()
			head.insertAdjacentHTML('afterbegin', '<h4 class="pjb-story__h">The full story</h4>')
		}

		// ---- the film: the project's own clip, one element from full screen to the tile ----
		const film = document.createElement('div')
		film.className = 'pjb__film'
		const v = document.createElement('video')
		v.muted = true
		v.playsInline = true
		v.loop = true
		v.preload = 'none'
		v.poster = poster
		v.setAttribute('aria-hidden', 'true')
		film.appendChild(v)
		const titles = document.createElement('div')
		titles.className = 'pjb__titles'
		titles.setAttribute('aria-hidden', 'true')
		titles.innerHTML = `<div><p class="pjb__kick"><b>Case study ${panel.dataset.no || n}</b> · ${d.kick[0]}</p>
			<p class="pjb__ttl">${d.title.replace(/<em>/, '<span><i><em>').replace('</em>', '</em></i></span>').replace(/^([^<]+?)(\s*)(?=<)/, '<span><i>$1</i></span>$2')}</p>
			<div class="pjb__meta">${d.stats.map((s) => `<div><b>${s[0]}</b><span>${s[1]}</span></div>`).join('')}</div></div>`
		const bars = '<i class="pjb__bar pjb__bar--t" aria-hidden="true"></i><i class="pjb__bar pjb__bar--b" aria-hidden="true"></i>'
		const skip = document.createElement('button')
		skip.type = 'button'
		skip.className = 'pjb__skip'
		skip.textContent = 'Skip intro →'
		const slot = board.querySelector('.pjb__slot')
		const scroll = panel.querySelector('.pj-detail__scroll')

		const src = () => (small.matches && caseVideo.dataset.mp4Small) || (v.canPlayType('video/webm; codecs="vp9"') && caseVideo.dataset.webm) || caseVideo.dataset.mp4

		let timer = 0
		let state = 'idle' // idle, intro, landing, landed
		function landNow(instant) {
			if (state !== 'intro') return
			clearTimeout(timer)
			state = 'landing'
			const p = panel.getBoundingClientRect()
			const r = slot.getBoundingClientRect()
			panel.classList.add('pjb-landing')
			const done = () => {
				if (state !== 'landing') return
				state = 'landed'
				// moving it in the same task keeps it playing
				film.removeAttribute('style')
				slot.appendChild(film)
				panel.classList.remove('pjb-intro', 'pjb-landing')
				panel.classList.add('pjb-landed')
				scroll.style.overflowY = ''
			}
			if (instant) return done()
			// The film never changes its box (that would move the layout): it is scaled and clipped onto the tile.
			// Where its picture sits now (C, in the film's own pixels) is mapped onto where the picture sits once it
			// is in the tile (D, contained), and the clip trims the film to the tile's rounded rectangle.
			const W = film.offsetWidth || p.width
			const H = film.offsetHeight || p.height
			const nw = v.videoWidth || 16
			const nh = v.videoHeight || 9
			const cs = getComputedStyle(v)
			const bw = v.offsetWidth || W
			const bh = v.offsetHeight || H
			const fit = cs.objectFit === 'contain' ? Math.min(bw / nw, bh / nh) : Math.max(bw / nw, bh / nh)
			const pos = cs.objectPosition.split(' ').map((x) => (parseFloat(x) || 50) / 100)
			const C = { x: v.offsetLeft + (bw - nw * fit) * pos[0], y: v.offsetTop + (bh - nh * fit) * (pos[1] ?? 0.5), w: nw * fit }
			const S = { x: r.left - p.left, y: r.top - p.top, w: r.width, h: r.height }
			const kt = Math.min(S.w / nw, S.h / nh)
			const D = { x: S.x + (S.w - nw * kt) / 2, y: S.y + (S.h - nh * kt) / 2, w: nw * kt }
			const sc = D.w / C.w
			const tx = D.x - C.x * sc
			const ty = D.y - C.y * sc
			const L = (S.x - tx) / sc
			const T = (S.y - ty) / sc
			const R = W - (S.x + S.w - tx) / sc
			const B = H - (S.y + S.h - ty) / sc
			film.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0) scale(${sc.toFixed(5)})`
			film.style.clipPath = `inset(${T.toFixed(2)}px ${R.toFixed(2)}px ${B.toFixed(2)}px ${L.toFixed(2)}px round ${(20 / sc).toFixed(2)}px)`
			setTimeout(done, 1350)
		}
		function start() {
			clearTimeout(timer)
			if (!v.src) v.src = src()
			v.currentTime = 0
			v.play().catch(() => {})
			panel.classList.remove('pjb-landed', 'pjb-landing')
			if (reduce) {
				slot.appendChild(film)
				panel.classList.add('pjb-landed')
				state = 'landed'
				return
			}
			film.removeAttribute('style')
			film.style.transform = 'translate3d(0px, 0px, 0) scale(1)'
			film.style.clipPath = 'inset(0px 0px 0px 0px round 0px)'
			panel.appendChild(film)
			panel.appendChild(titles)
			panel.insertAdjacentHTML('beforeend', bars)
			panel.appendChild(skip)
			scroll.scrollTop = 0
			scroll.style.overflowY = 'hidden'
			state = 'intro'
			void film.offsetWidth
			panel.classList.add('pjb-intro')
			requestAnimationFrame(() => panel.classList.add('pjb-go'))
			timer = setTimeout(() => landNow(false), INTRO)
		}
		function stop() {
			clearTimeout(timer)
			state = 'idle'
			v.pause()
			scroll.style.overflowY = ''
			panel.classList.remove('pjb-intro', 'pjb-landing', 'pjb-landed', 'pjb-go')
			panel.querySelectorAll(':scope > .pjb__bar').forEach((b) => b.remove())
		}
		skip.addEventListener('click', (e) => {
			e.stopPropagation()
			landNow(false)
		})
		;['wheel', 'pointerdown', 'touchstart'].forEach((t) => panel.addEventListener(t, () => state === 'intro' && landNow(false), { passive: true }))
		document.addEventListener('keydown', (e) => {
			if (state === 'intro' && e.key !== 'Escape') landNow(false)
		})
		// the "watch again" caption replays the intro
		board.querySelector('.pjb__cap').addEventListener('click', () => state === 'landed' && start())

		new MutationObserver(() => {
			const open = panel.classList.contains('is-open')
			if (open && state === 'idle') start()
			else if (!open && state !== 'idle') stop()
		}).observe(panel, { attributes: true, attributeFilter: ['class'] })
	})
})()
