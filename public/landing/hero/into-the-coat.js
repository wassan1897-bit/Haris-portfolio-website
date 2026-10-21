/* Hero to projects, "into the coat". While the hero is pinned, scroll progress (0 to 1) sets a few CSS
   variables on it; into-the-coat.css turns them into the panel opening, the push into the jacket and the
   fade to the projects page colour. Reads layout only on resize, never during scroll. */
;(function () {
	const run = document.getElementById('h2p')
	const hero = document.getElementById('panel-hero')
	const flow = document.getElementById('site-flow')
	if (!run || !hero || !flow) return

	const on = window.matchMedia('(min-width: 1024px) and (prefers-reduced-motion: no-preference)')
	const clamp = (v) => Math.min(1, Math.max(0, v))
	const inOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
	const easeIn = (t) => t * t * t
	const VARS = ['--h2p-ui', '--h2p-open', '--h2p-zoom', '--h2p-title', '--h2p-dark']

	let top = 0
	let len = 1
	let last = -1

	function update() {
		if (!on.matches) return
		const p = clamp((flow.scrollTop - top) / len)
		if (p === last) return
		last = p
		const set = (k, v) => hero.style.setProperty(k, v.toFixed(4))
		const open = inOut(clamp((p - 0.04) / 0.5))
		set('--h2p-ui', clamp(p / 0.2))
		set('--h2p-open', open)
		// 1 + 2.4 x open keeps the right-anchored photo covering the opening window; the rest is the push in
		set('--h2p-zoom', (1 + 2.4 * open) * (1 + 1.3 * easeIn(clamp((p - 0.3) / 0.7))))
		set('--h2p-title', clamp((p - 0.3) / 0.3))
		set('--h2p-dark', inOut(clamp((p - 0.58) / 0.4)))
		run.classList.toggle('is-running', p > 0 && p < 1)
		run.classList.toggle('is-on', p > 0)
	}

	function measure() {
		if (!on.matches) {
			VARS.forEach((k) => hero.style.removeProperty(k))
			run.classList.remove('is-running', 'is-on')
			last = -1
			return
		}
		top = run.offsetTop
		len = Math.max(1, run.offsetHeight - hero.offsetHeight)
		last = -1
		update()
	}

	flow.addEventListener('scroll', update, { passive: true })
	new ResizeObserver(measure).observe(run)
	on.addEventListener('change', measure)
	window.addEventListener('load', measure)
	measure()
})()
