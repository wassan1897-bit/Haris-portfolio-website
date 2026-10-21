/* "Entering the portfolio" (see enter.css). Positions are read on resize only; each scroll frame is
   arithmetic plus a handful of attribute and transform writes.
   - the first part of the pin: the horizon line draws, "PORTFOLIO" rises from behind it, its reflection
     rises under it, then "Entering the" and the caption
   - the last screen of the pin (the projects' landing window): the camera flies through the second O
     while project 01 waits behind it */
;(function () {
	const flow = document.getElementById('site-flow')
	const ent = document.getElementById('panel-enter')
	const header = document.getElementById('js-site-header')
	if (!flow || !ent) return

	const motion = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
	const wide = window.matchMedia('(min-width: 1024px)')
	const clamp = (v) => Math.min(1, Math.max(0, v))
	const inOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
	const out = (t) => 1 - Math.pow(1 - t, 3)
	const pageTop = (el) => el.getBoundingClientRect().top - flow.getBoundingClientRect().top + flow.scrollTop

	const works = document.getElementById('panel-works')
	const svg = ent.querySelector('.ent__svg')
	const line = ent.querySelector('.ent__line')
	const cap = ent.querySelector('.ent__cap')
	const NS = 'http://www.w3.org/2000/svg'
	const WORD = 'PORTFOLIO'
	const FONT = 'font-family:Archivo,"Inter Tight",sans-serif;font-weight:800;font-stretch:78%;'

	svg.innerHTML = `
		<defs>
			<radialGradient id="ent-glow"><stop offset="0" stop-color="#fff" stop-opacity=".2"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
			<linearGradient id="ent-refl" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#f2efe8" stop-opacity=".22"/><stop offset="1" stop-color="#f2efe8" stop-opacity="0"/></linearGradient>
			<clipPath id="ent-above"><rect x="-100000" y="-100000" width="200000"/></clipPath>
			<clipPath id="ent-below"><rect x="-100000" width="200000" height="100000"/></clipPath>
		</defs>
		<g class="ent-zoom">
			<path class="ent-sheet" fill="#0a0a0a" fill-rule="evenodd"/>
			<ellipse class="ent-glow" fill="url(#ent-glow)"/>
			<g clip-path="url(#ent-above)"><text class="ent-word" text-anchor="middle" fill="#f2efe8" style='${FONT}'>${WORD}</text></g>
			<g clip-path="url(#ent-below)"><g class="ent-mirror"><text class="ent-refl" text-anchor="middle" fill="url(#ent-refl)" style='${FONT}'>${WORD}</text></g></g>
			<text class="ent-pre" text-anchor="middle" fill="#cfcac0" style='font-family:"Instrument Serif",Georgia,serif;font-style:italic;'>Entering the</text>
		</g>`
	const $ = (s) => svg.querySelector(s)
	const zoom = $('.ent-zoom')
	const sheet = $('.ent-sheet')
	const glow = $('.ent-glow')
	const word = $('.ent-word')
	const refl = $('.ent-refl')
	const mirror = $('.ent-mirror')
	const pre = $('.ent-pre')
	const refGrad = $('#ent-refl')

	let cine = false
	let vh = 1
	let W = 1
	let top = 0 // where the pin starts
	let hold = 1 // the rising part of the pin
	let land = 1 // where the projects land: the fly-through ends exactly there
	let fs = 200
	let L = 500 // the line
	let cx = 0
	let cy = 0
	let rx = 1
	let ry = 1
	let kEnd = 60
	let last = -1

	function measure() {
		cine = motion && wide.matches
		ent.classList.toggle('is-cine', cine)
		if (!cine) {
			ent.classList.remove('is-on')
			if (header) header.classList.remove('site-header--on-ent')
			return
		}
		vh = flow.clientHeight || window.innerHeight
		W = flow.clientWidth || window.innerWidth
		top = pageTop(ent)
		// the same rounded position the page scroll glides to, so the fly-through is complete when it lands
		land = works ? Math.round(pageTop(works)) : Math.round(top + ent.offsetHeight - vh)
		hold = Math.max(1, land - vh - top)
		svg.setAttribute('viewBox', `0 0 ${W} ${vh}`)

		fs = Math.min(W * 0.16, vh * 0.3)
		L = Math.round(vh * 0.6)
		ent.style.setProperty('--ent-line', L + 'px')
		const base = L - fs * 0.05
		;[word, refl].forEach((t) => {
			t.setAttribute('x', W / 2)
			t.setAttribute('y', base)
			t.style.fontSize = fs + 'px'
			t.style.letterSpacing = -fs * 0.01 + 'px'
		})
		mirror.setAttribute('transform', `translate(0 ${2 * L}) scale(1 -1)`)
		refGrad.setAttribute('x1', 0)
		refGrad.setAttribute('y1', base)
		refGrad.setAttribute('x2', 0)
		refGrad.setAttribute('y2', base - fs * 0.75)
		$('#ent-above rect').setAttribute('height', 100000 + L)
		$('#ent-below rect').setAttribute('y', L)
		pre.setAttribute('x', W / 2)
		pre.setAttribute('y', base - fs * 0.86)
		pre.style.fontSize = fs * 0.2 + 'px'
		glow.setAttribute('cx', W / 2)
		glow.setAttribute('cy', L)
		glow.setAttribute('rx', W * 0.38)
		glow.setAttribute('ry', fs * 0.55)

		// the second O: the camera flies through its counter
		let b = null
		try {
			b = word.getExtentOfChar(5)
		} catch (e) {}
		cx = b && b.width ? b.x + b.width / 2 : W * 0.62
		cy = base - fs * 0.36
		rx = (b && b.width ? b.width : fs * 0.55) * 0.22
		ry = fs * 0.26
		// far enough in that the hole covers the whole screen
		const reach = Math.max(cx, W - cx) / rx + Math.max(cy, vh - cy) / ry
		kEnd = Math.max(20, reach * 1.1)
		last = -1
		update()
	}

	function update() {
		if (!cine) return
		const st = flow.scrollTop
		if (st === last) return
		last = st
		const h = clamp((st - top) / hold)
		const z = clamp((st - (land - vh)) / vh)
		const on = st >= top - 1 && st < land - 0.5
		ent.classList.toggle('is-on', on)
		if (header) header.classList.toggle('site-header--on-ent', on)
		if (!on) return

		// the horizon: the line draws out from the middle, the word rises from behind it
		const draw = inOut(clamp(h / 0.28))
		const rise = out(clamp((h - 0.12) / 0.48))
		const after = clamp((h - 0.5) / 0.25)
		const leave = clamp(z / 0.16)
		line.style.transform = `scaleX(${draw.toFixed(4)})`
		line.style.opacity = (1 - leave).toFixed(3)
		const d = ((1 - rise) * fs * 0.85).toFixed(1)
		word.setAttribute('transform', `translate(0 ${d})`)
		refl.setAttribute('transform', `translate(0 ${d})`)
		refl.style.opacity = (1 - leave).toFixed(3)
		glow.style.opacity = (draw * (0.6 + 0.4 * rise) * (1 - leave)).toFixed(3)
		// the letters themselves fade on the last stretch of the zoom, so no edge of the O is ever left over
		// the projects, whatever the screen's proportions
		word.style.opacity = (1 - clamp((z - 0.55) / 0.3)).toFixed(3)
		pre.style.opacity = (after * (1 - clamp((z - 0.3) / 0.3))).toFixed(3)
		pre.setAttribute('transform', `translate(0 ${((1 - out(after)) * 14).toFixed(1)})`)
		cap.style.opacity = (clamp((h - 0.62) / 0.25) * (1 - leave)).toFixed(3)

		// through the O: the hole opens in the counter, then the camera flies through it
		const open = inOut(clamp(z / 0.2))
		const k = Math.pow(kEnd, z)
		const hx = rx * open
		const hy = ry * open
		const hole = open > 0.001 ? ` M${(cx - hx).toFixed(2)} ${cy.toFixed(2)} a${hx.toFixed(2)} ${hy.toFixed(2)} 0 1 0 ${(2 * hx).toFixed(2)} 0 a${hx.toFixed(2)} ${hy.toFixed(2)} 0 1 0 ${(-2 * hx).toFixed(2)} 0 Z` : ''
		sheet.setAttribute('d', `M-100000 -100000 H100000 V100000 H-100000 Z${hole}`)
		zoom.setAttribute('transform', k > 1.0001 ? `translate(${cx.toFixed(2)} ${cy.toFixed(2)}) scale(${k.toFixed(4)}) translate(${(-cx).toFixed(2)} ${(-cy).toFixed(2)})` : '')
	}

	flow.addEventListener('scroll', update, { passive: true })
	const ro = new ResizeObserver(measure)
	;[flow, ...flow.children].forEach((el) => ro.observe(el))
	wide.addEventListener('change', measure)
	window.addEventListener('load', measure)
	if (document.fonts) document.fonts.ready.then(measure)
	measure()
})()
