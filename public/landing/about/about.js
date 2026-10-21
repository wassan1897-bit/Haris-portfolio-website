/* Page 2, About Haris (see about.css).
   Desktop: the hero and About share a pinned stage. The first screen of scrolling is the transition, and
   its progress (0 at the top of the page, 1 when About has landed) drives everything:
     0.00 to 0.38   About wipes up over the hero; the hero dims and eases back
     0.22 to 0.70   the text, line by line: top bar, headline, rule, paragraph, button, links, panel
     0.56 to 0.86   then the photo is revealed inside its panel
     0.80 to 0.98   then the details on the photo: 02, its line, the dots, the plus, 6,700+
   Positions are read on resize only. Phones and reduced motion: About reveals once when it comes into view. */
;(function () {
	const flow = document.getElementById('site-flow')
	const stage = document.getElementById('h2a')
	const ah = document.getElementById('panel-about')
	const hero = document.getElementById('panel-hero')
	const header = document.getElementById('js-site-header')
	if (!flow || !stage || !ah) return

	const pinned = window.matchMedia('(min-width: 1024px) and (prefers-reduced-motion: no-preference)')
	const clamp = (v) => Math.min(1, Math.max(0, v))
	const out = (t) => 1 - Math.pow(1 - t, 3)
	const inOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
	const pageTop = (el) => el.getBoundingClientRect().top - flow.getBoundingClientRect().top + flow.scrollTop
	const dim = stage.querySelector('.h2a__dim')
	const stat = ah.querySelector('.ah__stat b')
	const STAT = 6700

	let top = 0
	let vh = 1
	let span = 1
	let last = -1

	const VARS = ['--a-wipe', '--a-top', '--a-h1', '--a-h2', '--a-rule', '--a-para', '--a-btn', '--a-soc', '--a-dark', '--a-photo', '--a-ov']
	function setAll(p) {
		const v = {
			'--a-wipe': inOut(clamp(p / 0.38)),
			'--a-top': out(clamp((p - 0.22) / 0.18)),
			'--a-h1': out(clamp((p - 0.26) / 0.2)),
			'--a-h2': out(clamp((p - 0.31) / 0.2)),
			'--a-rule': inOut(clamp((p - 0.38) / 0.16)),
			'--a-para': out(clamp((p - 0.42) / 0.2)),
			'--a-btn': out(clamp((p - 0.48) / 0.16)),
			'--a-soc': out(clamp((p - 0.44) / 0.2)),
			'--a-dark': inOut(clamp((p - 0.46) / 0.24)),
			'--a-photo': inOut(clamp((p - 0.56) / 0.3)),
			'--a-ov': out(clamp((p - 0.8) / 0.18)),
		}
		for (const k in v) ah.style.setProperty(k, v[k].toFixed(4))
		const w = v['--a-wipe']
		if (dim) dim.style.opacity = (w * 0.45).toFixed(3)
		if (hero) hero.style.transform = w > 0 && w < 1 ? `scale(${(1 - 0.035 * w).toFixed(4)})` : w >= 1 ? 'scale(0.965)' : ''
		count(v['--a-ov'])
	}
	function count(k) {
		const n = Math.round((STAT * k) / 100) * 100
		const text = n.toLocaleString('en-US') + '+'
		if (stat.textContent !== text) stat.textContent = text
	}

	// phones: the site header turns light while it sits over the dark photo
	const photoEl = ah.querySelector('.ah__photo')
	let photoTop = 0
	let photoBot = 0
	function headerOnPhoto() {
		if (!header) return
		const y = flow.scrollTop + 32
		header.classList.toggle('site-header--on-photo', !pinned.matches && y > photoTop && y < photoBot)
	}

	function update() {
		headerOnPhoto()
		if (!pinned.matches) return
		const st = flow.scrollTop
		const p = clamp((st - top) / vh)
		if (p !== last) {
			last = p
			setAll(p)
			stage.classList.toggle('is-moving', p > 0 && p < 1)
		}
		// About has its own top bar, so the site header stays hidden while the stage covers the top
		if (header) header.classList.toggle('site-header--over-hero', st < top + span - 64)
	}

	function measure() {
		vh = flow.clientHeight || window.innerHeight
		top = pageTop(stage)
		// the stage covers the top of the screen until its last screen has scrolled past
		span = stage.offsetHeight
		window.__heroHeaderEnd = pinned.matches ? top + span : 0
		photoTop = pageTop(photoEl)
		photoBot = photoTop + photoEl.offsetHeight
		headerOnPhoto()
		if (pinned.matches) {
			ah.classList.remove('is-waiting')
			last = -1
			update()
		} else {
			VARS.forEach((k) => ah.style.removeProperty(k))
			if (hero) hero.style.transform = ''
			if (dim) dim.style.opacity = ''
			count(1)
		}
	}

	// ---------------- phones, tablets, reduced motion: reveal once ----------------
	if (!pinned.matches && 'IntersectionObserver' in window) {
		ah.classList.add('is-waiting')
		count(1)
		const io = new IntersectionObserver(
			([e]) => {
				if (!e.isIntersecting) return
				ah.classList.remove('is-waiting')
				io.disconnect()
			},
			{ root: flow, threshold: 0.18 },
		)
		io.observe(ah)
	}

	// ---------------- links ----------------
	ah.querySelectorAll('[data-ah-go]').forEach((a) => {
		a.addEventListener('click', (e) => {
			const to = a.getAttribute('data-ah-go')
			const el = to === 'about' ? document.getElementById('about-land') : document.querySelector(to)
			if (!el) return
			e.preventDefault()
			flow.scrollTo({ top: to === '#panel-hero' ? 0 : pageTop(el), behavior: 'smooth' })
		})
	})
	const menu = ah.querySelector('.ah__menu')
	const toggle = document.getElementById('js-menu-btn')
	if (menu && toggle) menu.addEventListener('click', () => toggle.click())

	flow.addEventListener('scroll', update, { passive: true })
	const ro = new ResizeObserver(measure)
	;[flow, stage].forEach((el) => ro.observe(el))
	pinned.addEventListener('change', measure)
	window.addEventListener('load', measure)
	measure()
})()
