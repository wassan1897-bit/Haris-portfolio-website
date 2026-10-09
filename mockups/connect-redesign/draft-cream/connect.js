/* Connect: entrance reveals, the Upwork record counting up, client review screenshots with a
   full-size view, Haris's local time, the tools band and Back to top. */

// ---------------------------------------------------------------------------
// CLIENT REVIEWS. Add a screenshot of each Upwork review to assets/img/reviews/ and list it here.
// The grid appears as soon as there is one entry; until then the section links to the profile.
//   src:     the screenshot file
//   client:  the client's name as it appears on Upwork (or their company)
//   project: the Upwork contract title
//   text:    the review text, for screen readers and search (optional but recommended)
// ---------------------------------------------------------------------------
const REVIEWS = [
	// { src: './assets/img/reviews/review-01.png', client: 'Client name', project: 'Contract title', text: 'What the client wrote.' },
]

const TOOLS = [
	['n8n', 'n8n.png'],
	['Make', 'make.png'],
	['Zapier', 'zapier.png'],
	['GoHighLevel', 'ghl.png'],
	['Retell AI', 'retell.png'],
	['Claude', 'claude.png'],
	['OpenAI', 'openai.svg'],
	['Python', 'python.svg'],
	['Node.js', 'nodejs.svg'],
	['PostgreSQL', 'postgresql.svg'],
	['Airtable', 'airtable.svg'],
	['Twilio', 'twilio.svg'],
	['Webflow', 'webflow.svg'],
	['Next.js', 'nextjs.svg'],
]
// what clients hire for, from the Upwork profile
const WORK = ['Workflow automation', 'Voice AI agents', 'AI chatbots and RAG', 'CRM automation', 'AI agent development', 'Lead generation', 'AI consulting']

;(function () {
	const section = document.getElementById('panel-scaling')
	if (!section || !section.classList.contains('cx')) return
	const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
	const flow = document.getElementById('site-flow')

	// ---------- tools band: two copies of each row, so the loop is seamless ----------
	const toolsEl = section.querySelector('[data-cx-tools]')
	const wordsEl = section.querySelector('[data-cx-words]')
	const tools = TOOLS.map(([name, file]) => `<li class="cx-band__tool"><img src="./assets/img/tools/${file}" alt="" height="24" loading="lazy" decoding="async" />${name}</li>`).join('')
	const words = WORK.map((w) => `<li class="cx-band__word">${w}</li>`).join('')
	toolsEl.innerHTML = tools + tools.replace(/<li /g, '<li aria-hidden="true" ')
	wordsEl.innerHTML = words + words.replace(/<li /g, '<li aria-hidden="true" ')

	// ---------- client reviews ----------
	const reviewsEl = section.querySelector('[data-cx-reviews]')
	const lightbox = section.querySelector('.cx-lightbox')
	if (REVIEWS.length && reviewsEl) {
		reviewsEl.classList.add('has-reviews')
		const zoom = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M9.5 2.5h4v4M13.5 2.5 9 7M6.5 13.5h-4v-4M2.5 13.5 7 9" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>'
		// a gentle, repeating set of tilts so the wall never looks machine-straight
		const tilts = [-1.1, 0.7, -0.4, 1, -0.8, 0.5]
		const cards = REVIEWS.map(
			(r, i) => `<button type="button" class="cx-review" style="--r:${tilts[i % tilts.length]}deg;--cx-d:${(0.08 * i).toFixed(2)}s" data-i="${i}" aria-label="Open review from ${r.client}">
				<figure style="margin:0"><img src="${r.src}" alt="${(r.text || 'Upwork review from ' + r.client).replace(/"/g, '&quot;')}" loading="lazy" decoding="async" />
				<figcaption><span><b>${r.client}</b><small>${r.project || ''}</small></span><span class="cx-review__zoom">${zoom}</span></figcaption></figure></button>`,
		).join('')
		reviewsEl.insertAdjacentHTML(
			'beforeend',
			`<div class="cx-reviews__bar"><h3>${REVIEWS.length} client review${REVIEWS.length > 1 ? 's' : ''} from Upwork</h3><a href="https://www.upwork.com/" target="_blank" rel="noopener noreferrer">All reviews on Upwork</a></div><div class="cx-reviews__grid">${cards}</div>`,
		)
		const img = lightbox.querySelector('img')
		const cap = lightbox.querySelector('.cx-lightbox__caption')
		let opener = null
		reviewsEl.addEventListener('click', (e) => {
			const card = e.target.closest('.cx-review')
			if (!card || typeof lightbox.showModal !== 'function') return
			const r = REVIEWS[+card.dataset.i]
			opener = card
			img.src = r.src
			img.alt = r.text || `Upwork review from ${r.client}`
			cap.textContent = [r.client, r.project].filter(Boolean).join(', ')
			lightbox.showModal()
			requestAnimationFrame(() => lightbox.classList.add('is-shown'))
		})
		const close = () => {
			lightbox.classList.remove('is-shown')
			setTimeout(() => lightbox.close(), reduceMotion ? 0 : 260)
		}
		lightbox.querySelector('.cx-lightbox__close').addEventListener('click', close)
		lightbox.addEventListener('click', (e) => e.target === lightbox && close())
		lightbox.addEventListener('cancel', (e) => {
			e.preventDefault()
			close()
		})
		lightbox.addEventListener('close', () => opener && opener.focus({ preventScroll: true }))
	}

	// ---------- Haris's local time (Karachi), next to his name ----------
	const clock = section.querySelector('[data-cx-clock]')
	let clockTimer = 0
	const tick = () => {
		try {
			clock.textContent = '· ' + new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'Asia/Karachi' })
		} catch (e) {
			clock.textContent = ''
		}
	}
	tick()

	const year = section.querySelector('[data-cx-year]')
	if (year) year.textContent = String(new Date().getFullYear())

	// ---------- Back to top: scrolls the page's own scroller ----------
	section.querySelector('[data-cx-top]')?.addEventListener('click', () => {
		const target = flow || document.scrollingElement
		target.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' })
	})

	// ---------- the record counts up once, the first time it is seen ----------
	function countUp(el) {
		const end = Number(el.dataset.count)
		const pre = el.dataset.prefix || ''
		const suf = el.dataset.suffix || ''
		if (reduceMotion || !end) return
		const t0 = performance.now()
		const dur = 1500
		const step = (now) => {
			const k = Math.min(1, (now - t0) / dur)
			const e = 1 - Math.pow(1 - k, 3)
			el.textContent = pre + Math.round(end * e).toLocaleString('en-US') + suf
			if (k < 1) requestAnimationFrame(step)
		}
		requestAnimationFrame(step)
	}

	// ---------- entrance: each block reveals as it comes into view ----------
	const blocks = [...section.querySelectorAll('[data-cx-reveal]')]
	section.querySelectorAll('.cx-ledger > div').forEach((d, i) => d.style.setProperty('--cx-i', i))
	// headline lines rise one after another
	section.querySelectorAll('.cx__title').forEach((t) => t.querySelectorAll('.cx__line').forEach((l, i) => l.style.setProperty('--cx-l', (0.09 * i).toFixed(2) + 's')))

	if (!('IntersectionObserver' in window)) return
	section.classList.add('cx--ready')
	const io = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (!entry.isIntersecting) return
				const el = entry.target
				el.classList.add('is-in')
				if (el.classList.contains('cx-ledger')) el.querySelectorAll('[data-count]').forEach(countUp)
				io.unobserve(el)
			})
		},
		{ root: flow || null, rootMargin: '0px 0px -12% 0px', threshold: 0.12 },
	)
	blocks.forEach((b) => io.observe(b))

	// the band only runs, and the clock only ticks, while the section is near the screen
	new IntersectionObserver(
		([entry]) => {
			section.classList.toggle('is-near', entry.isIntersecting)
			clearInterval(clockTimer)
			if (entry.isIntersecting) {
				tick()
				clockTimer = setInterval(tick, 30000)
			}
		},
		{ root: flow || null, rootMargin: '200px 0px' },
	).observe(section)
})()
