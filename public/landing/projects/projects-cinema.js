/* Projects, the cinema sequence (see projects-cinema.css). Desktop with motion allowed only.
   Each time a project becomes the one on screen it opens on its clip alone, full screen, with a small label and a
   progress line; after the clip's opening (INTRO ms), or as soon as you scroll, click or press a key, the clip
   glides into its stage on the right and the copy and the results rise in on the left. Leaving the project
   resets it, so coming back plays the opening again. A blurred copy of the clip's poster fills the screen behind
   the stage, so the settled page still reads as one full-screen scene. */
;(function () {
	const flow = document.getElementById('site-flow')
	const section = document.getElementById('panel-works')
	if (!flow || !section || !section.classList.contains('pj')) return
	const screens = [...section.querySelectorAll('.pj-case')]
	const cine = window.matchMedia('(min-width: 1024px) and (prefers-reduced-motion: no-preference)')
	const INTRO = 3600

	const NAMES = {
		'project-01': 'Two-sided marketplace app',
		'project-02': 'AI support for a UK broadband provider',
		'project-03': 'Multi-inbox email automation',
		'project-04': 'Multi-tenant AI compliance platform',
		'project-05': 'Autonomous Level 1 support agent',
	}

	screens.forEach((s, i) => {
		const media = s.querySelector('.pj-case__media')
		const v = s.querySelector('video')
		// absolute, because a url() inside a custom property resolves against the stylesheet that uses it
		if (media && v) media.style.setProperty('--pj-poster', `url("${new URL(v.getAttribute('poster'), location.href).href}")`)
		const tag = document.createElement('div')
		tag.className = 'pj-case__intro'
		tag.setAttribute('aria-hidden', 'true')
		tag.innerHTML = `<p><b>0${i + 1} / 0${screens.length}</b> Client project</p><p class="pj-case__intro-name">${NAMES[s.id] || ''}</p><span class="pj-case__intro-bar"><i></i></span>`
		s.querySelector('.pj-screen__in').appendChild(tag)
	})

	// how much the stage has to grow, and where to, to fill the screen during the opening
	function measure() {
		const W = flow.clientWidth || window.innerWidth
		const H = flow.clientHeight || window.innerHeight
		const w = W * 0.54
		const h = (w * 9) / 16
		section.style.setProperty('--pj-is', Math.max(W / w, H / h).toFixed(4))
	}

	const timers = new Map()
	function settle(s) {
		clearTimeout(timers.get(s))
		s.classList.remove('is-intro')
		s.classList.add('is-settled')
	}
	function open(s) {
		clearTimeout(timers.get(s))
		s.classList.remove('is-settled')
		s.classList.add('is-intro')
		// restart the progress line
		const bar = s.querySelector('.pj-case__intro-bar i')
		if (bar) {
			bar.style.transition = 'none'
			bar.style.transform = 'scaleX(0)'
			void bar.offsetWidth
			bar.style.transition = ''
			bar.style.transform = ''
		}
		timers.set(s, setTimeout(() => settle(s), INTRO))
	}
	function reset(s) {
		clearTimeout(timers.get(s))
		s.classList.remove('is-settled')
		s.classList.add('is-intro')
	}

	let current = null
	function sync() {
		if (!cine.matches) {
			// only touch classes that are there: even a no-op classList change is a mutation, and this function
			// runs on mutations, so an unconditional remove would loop forever
			screens.forEach((s) => {
				clearTimeout(timers.get(s))
				if (s.classList.contains('is-intro') || s.classList.contains('is-settled')) s.classList.remove('is-intro', 'is-settled')
			})
			current = null
			return
		}
		const seen = section.classList.contains('is-seen')
		const act = seen ? screens.find((s) => s.classList.contains('is-active')) || null : null
		if (act === current) return
		screens.forEach((s) => s !== act && reset(s))
		current = act
		if (act) open(act)
	}

	new MutationObserver(sync).observe(section, { subtree: true, attributes: true, attributeFilter: ['class'] })

	// the first scroll, click or key during an opening settles it instead of moving on
	const opening = () => current && current.classList.contains('is-intro') ? current : null
	flow.addEventListener(
		'wheel',
		(e) => {
			const s = opening()
			if (!s || e.ctrlKey || !e.deltaY) return
			e.preventDefault()
			e.stopPropagation()
			settle(s)
		},
		{ capture: true, passive: false },
	)
	document.addEventListener(
		'keydown',
		(e) => {
			const s = opening()
			if (!s || !['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', ' '].includes(e.key)) return
			if (e.target.closest && e.target.closest('input, textarea, select, [contenteditable]')) return
			e.preventDefault()
			e.stopPropagation()
			settle(s)
		},
		true,
	)
	section.addEventListener('pointerdown', () => {
		const s = opening()
		if (s) settle(s)
	})

	window.addEventListener('resize', measure)
	cine.addEventListener('change', () => {
		measure()
		sync()
	})
	measure()
	if (cine.matches) screens.forEach((s) => s.classList.add('is-intro'))
	sync()
})()
