/* Page 2, About Haris (see about-v.css). Every frame comes from the scroll position:
   - hero to About (the first screen of scrolling): the cream page rises on a curved edge that flattens as it
     lands, while the hero drifts up at about half speed and dims
   - after landing: "MUHAMMAD HARIS" shrinks to a small title at the top and stays there
   Positions are read on resize only. */
;(function () {
	const flow = document.getElementById('site-flow')
	const vb = document.getElementById('panel-about')
	const hero = document.getElementById('panel-hero')
	const header = document.getElementById('js-site-header')
	if (!flow || !vb) return

	const motion = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
	const desk = window.matchMedia('(min-width: 1024px)')
	const clamp = (v) => Math.min(1, Math.max(0, v))
	const lerp = (a, b, t) => a + (b - a) * t
	const inOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
	const pageTop = (el) => el.getBoundingClientRect().top - flow.getBoundingClientRect().top + flow.scrollTop
	const title = vb.querySelector('.vb__title')
	const dim = hero && hero.appendChild(Object.assign(document.createElement('span'), { className: 'ph-vdim' }))
	if (dim) dim.setAttribute('aria-hidden', 'true')

	let top = 1
	let end = Infinity
	let vh = 1
	let fs = 1
	let last = -1

	function update() {
		const st = flow.scrollTop
		// header: hidden over the hero, shown once the cream page has landed
		if (header) header.classList.toggle('site-header--over-hero', st < top - 64)
		if (hero) hero.classList.toggle('is-offscreen', st >= top)
		// the pinned name leaves with the page once the reel has run out
		vb.classList.toggle('is-past', st > end)
		if (!motion || st === last) return
		last = st

		// the rise
		const p = clamp(st / top)
		// the curve only shows while the page is moving: flat at rest, flat once landed
		vb.style.setProperty('--vb-curve', (Math.min(1, p * 6) * (1 - inOut(p))).toFixed(4))
		if (hero) {
			const on = desk.matches && p > 0 && p < 1
			hero.style.transform = on ? `translate3d(0, ${(st * 0.45).toFixed(1)}px, 0)` : ''
			if (dim) dim.style.opacity = (p * 0.35).toFixed(3)
		}

		// the name shrinks to the top
		const k = inOut(clamp((st - top) / (vh * (desk.matches ? 0.6 : 0.3))))
		vb.style.setProperty('--vb-k', k.toFixed(3))
		const topPx = vh * 0.13
		// small title: 74px under the header on desktop, 28px on phones
		const target = Math.min(1, (desk.matches ? 74 : 28) / fs)
		vb.style.setProperty('--vb-s', lerp(1, target, k).toFixed(4))
		vb.style.setProperty('--vb-ty', lerp(0, (desk.matches ? 72 : 58) - topPx, k).toFixed(1) + 'px')
	}

	function measure() {
		vh = flow.clientHeight || window.innerHeight
		top = Math.max(1, pageTop(vb))
		fs = parseFloat(getComputedStyle(title).fontSize) || 200
		window.__heroHeaderEnd = top
		// the reel page rises over the end of About and covers the name; it goes once About has scrolled away
		end = pageTop(vb) + vb.offsetHeight
		last = -1
		update()
	}

	flow.addEventListener('scroll', update, { passive: true })
	const ro = new ResizeObserver(measure)
	;[flow, ...flow.children].forEach((el) => ro.observe(el))
	desk.addEventListener('change', measure)
	window.addEventListener('load', measure)
	if (document.fonts) document.fonts.ready.then(measure)
	measure()
})()
