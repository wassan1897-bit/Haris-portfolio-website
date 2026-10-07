/* Scaling panel — project photo columns + JS marquees + ticker */

;(function () {
	const TARGET = 23
	let played = false
	const runners = []

	const PLATFORM_LOGOS = [
		{ name: 'n8n', domain: 'n8n.io' },
		{ name: 'Make', domain: 'make.com' },
		{ name: 'Zapier', domain: 'zapier.com' },
		{ name: 'GoHighLevel', domain: 'gohighlevel.com' },
		{ name: 'Retell', domain: 'retellai.com' },
		{ name: 'Claude', domain: 'claude.ai' },
		{ name: 'OpenAI', domain: 'openai.com' },
	]

	/* Bottom row — Aceternity squircle + soft brand wash; icons via Google favicons */
	const TECH_ICONS = [
		{ name: 'n8n', domain: 'n8n.io', glow: '#ea4b71' },
		{ name: 'Make', domain: 'make.com', glow: '#6e00ff' },
		{ name: 'Zapier', domain: 'zapier.com', glow: '#ff4a00' },
		{ name: 'GoHighLevel', domain: 'gohighlevel.com', glow: '#ffc34e' },
		{ name: 'Retell', domain: 'retellai.com', glow: '#6ea8ff' },
		{ name: 'Claude', domain: 'claude.ai', glow: '#d4a27f' },
		{ name: 'OpenAI', domain: 'openai.com', glow: '#10a37f' },
		{ name: 'Python', domain: 'python.org', glow: '#3776ab' },
		{ name: 'Node.js', domain: 'nodejs.org', glow: '#5fa04e' },
		{ name: 'PostgreSQL', domain: 'postgresql.org', glow: '#4169e1' },
		{ name: 'Airtable', domain: 'airtable.com', glow: '#18bfff' },
		{ name: 'Twilio', domain: 'twilio.com', glow: '#f22f46' },
	]

	function googleIcon(domain) {
		return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=128`
	}

	function digitsOf(n) {
		return String(n).split('').map(Number)
	}

	function buildTicker(root, value) {
		if (!root) return
		root.innerHTML = ''
		const wrap = document.createElement('span')
		wrap.className = 'scaling-stats__number'
		wrap.setAttribute('aria-label', `${value}+ systems shipped`)

		digitsOf(value).forEach((digit) => {
			const col = document.createElement('span')
			col.className = 'scaling-ticker'
			col.setAttribute('aria-hidden', 'true')

			const wheel = document.createElement('span')
			wheel.className = 'scaling-ticker__wheel'
			for (let i = 0; i < 10; i++) {
				const s = document.createElement('span')
				s.textContent = String(i)
				wheel.appendChild(s)
			}
			col.appendChild(wheel)
			wrap.appendChild(col)
			wheel.dataset.target = String(digit)
		})

		const plus = document.createElement('span')
		plus.className = 'scaling-stats__plus'
		plus.textContent = '+'
		wrap.appendChild(plus)
		root.appendChild(wrap)
	}

	function animateTicker() {
		const wheels = document.querySelectorAll('.scaling-ticker__wheel')
		if (!wheels.length || typeof gsap === 'undefined') {
			wheels.forEach((w) => {
				const d = Number(w.dataset.target || 0)
				w.style.transform = `translateY(${-d * 0.95}em)`
			})
			return
		}

		wheels.forEach((wheel, i) => {
			const digit = Number(wheel.dataset.target || 0)
			gsap.fromTo(
				wheel,
				{ y: '0em' },
				{
					y: `${-digit * 0.95}em`,
					duration: 1.15 + i * 0.12,
					ease: 'expo.out',
					delay: 0.08 * i,
				},
			)
		})
	}

	function makeChip(logo) {
		const el = document.createElement('span')
		el.className = 'scaling-chip'

		const img = document.createElement('img')
		img.src = googleIcon(logo.domain)
		img.alt = ''
		img.width = 18
		img.height = 18
		img.loading = 'eager'
		img.decoding = 'async'
		img.referrerPolicy = 'no-referrer'

		el.append(img, document.createTextNode(logo.name))
		return el
	}

	function fillChipTrack(root) {
		if (!root) return
		root.innerHTML = ''
		PLATFORM_LOGOS.forEach((logo) => root.appendChild(makeChip(logo)))
		PLATFORM_LOGOS.forEach((logo) => root.appendChild(makeChip(logo)))
	}

	function makeTechIcon(logo) {
		const el = document.createElement('span')
		el.className = 'scaling-tech-icon'
		el.title = logo.name
		el.style.setProperty('--glow', logo.glow)

		const wash = document.createElement('span')
		wash.className = 'scaling-tech-icon__wash'
		wash.setAttribute('aria-hidden', 'true')

		const glowA = document.createElement('span')
		glowA.className = 'scaling-tech-icon__glow scaling-tech-icon__glow--a'
		glowA.setAttribute('aria-hidden', 'true')

		const glowB = document.createElement('span')
		glowB.className = 'scaling-tech-icon__glow scaling-tech-icon__glow--b'
		glowB.setAttribute('aria-hidden', 'true')

		const img = document.createElement('img')
		img.src = googleIcon(logo.domain)
		img.alt = logo.name
		img.width = 32
		img.height = 32
		img.loading = 'eager'
		img.decoding = 'async'
		img.referrerPolicy = 'no-referrer'

		el.append(wash, glowA, glowB, img)
		return el
	}

	function fillTechTrack(root) {
		if (!root) return
		root.innerHTML = ''
		TECH_ICONS.forEach((logo) => root.appendChild(makeTechIcon(logo)))
		TECH_ICONS.forEach((logo) => root.appendChild(makeTechIcon(logo)))
	}

	/** Continuous seamless loop as a CSS animation: it runs on the compositor, so the main
	 *  thread does no work per frame (the old 16 ms timer restyled the track 60 times a second). */
	function startLoop(track, { speed = 32, reverse = false } = {}) {
		if (!track) return

		if (track._scalingStop) track._scalingStop()

		track.dataset.loopOn = '1'
		track.style.willChange = 'transform'

		let lastHalf = 0
		const measure = () => {
			const half = track.scrollWidth / 2
			if (!(half > 8)) return
			if (Math.abs(half - lastHalf) > 1) {
				lastHalf = half
				// half the gap closes the seam between the two copies of the logos
				const gap = parseFloat(getComputedStyle(track).columnGap) || 0
				track.style.setProperty('--loop-gap', gap + 'px')
				track.style.animation = `scaling-loop-x ${(half / speed).toFixed(2)}s linear infinite${reverse ? ' reverse' : ''}`
			}
			// marquees stay on for reduced motion too, as the stylesheet notes for this section
			track.style.animationPlayState = 'running'
		}

		measure()

		const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null
		ro?.observe(track)
		if (track.parentElement) ro?.observe(track.parentElement)
		;[...track.querySelectorAll('img')].forEach((img) => {
			if (!img.complete) img.addEventListener('load', measure, { once: true })
		})

		const stop = () => {
			track.style.animationPlayState = 'paused'
			ro?.disconnect()
			track.dataset.loopOn = '0'
			track._scalingStop = null
		}

		track._scalingRemeasure = measure
		track._scalingStop = stop
		runners.push({ stop, remeasure: measure })
	}

	function startAllLoops() {
		document.querySelectorAll('.scaling-marquee__track').forEach((track, i) => {
			startLoop(track, { axis: 'x', speed: i === 0 ? 38 : 46 })
		})
	}

	function playScalingEnter(force) {
		const panel = document.getElementById('panel-scaling')
		if (!panel) return
		if (played && !force) return
		played = true

		const headerBits = [...panel.querySelectorAll('.scaling__eyebrow, .scaling__title, .scaling__lede')]
		const cards = [...panel.querySelectorAll('.scaling-card')]
		const close = panel.querySelector('.scaling__close')
		const motionTargets = [...headerBits, ...cards, close].filter(Boolean)

		if (typeof gsap === 'undefined') {
			animateTicker()
			return
		}

		gsap.killTweensOf(motionTargets)
		gsap.set(headerBits, { opacity: 0, y: 16 })
		gsap.set(cards, { opacity: 0, y: 28 })
		if (close) gsap.set(close, { opacity: 0, y: 14 })

		const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
		tl.to(headerBits, { opacity: 1, y: 0, duration: 0.65, stagger: 0.05 }, 0)
			.to(
				cards,
				{
					opacity: 1,
					y: 0,
					duration: 0.75,
					stagger: 0.07,
				},
				0.1,
			)
		if (close) tl.to(close, { opacity: 1, y: 0, duration: 0.6 }, 0.35)
		tl.add(() => animateTicker(), 0.2).add(() => {
			runners.forEach((r) => r.remeasure?.())
		}, 0.05)
	}

	window.playScalingEnter = playScalingEnter

	function boot() {
		buildTicker(document.getElementById('scaling-ticker-mount'), TARGET)

		const logoTrack =
			document.getElementById('scaling-logos-track') ||
			document.querySelector('.scaling-card--logos .scaling-marquee__track')
		const techTrack = document.getElementById('scaling-tech-track')
		fillChipTrack(logoTrack)
		fillTechTrack(techTrack)

		const panel = document.getElementById('panel-scaling')
		if (!panel) return

		const kickLoops = () => {
			try {
				startAllLoops()
				runners.forEach((r) => r.remeasure?.())
			} catch (err) {
				console.error('[scaling] marquee failed', err)
			}
		}

		const stopLoops = () => {
			runners.splice(0).forEach((r) => r.stop?.())
			document.querySelectorAll('.scaling-marquee__track').forEach((track) => {
				if (track._scalingStop) track._scalingStop()
			})
		}

		const io = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting && entry.intersectionRatio > 0.15) {
						kickLoops()
						playScalingEnter(false)
					} else if (!entry.isIntersecting) {
						stopLoops()
					}
				})
			},
			{ threshold: [0.05, 0.15, 0.35, 0.5] },
		)
		io.observe(panel)

		/* Don't burn CPU while user is still on About/Works. */
		const alreadyVisible =
			panel.getBoundingClientRect().top < window.innerHeight * 0.85 &&
			panel.getBoundingClientRect().bottom > window.innerHeight * 0.15
		if (alreadyVisible || location.hash === '#scaling') {
			kickLoops()
		}

		if (location.hash === '#scaling') {
			requestAnimationFrame(() => playScalingEnter(true))
		}

		window.addEventListener('resize', () => {
			runners.forEach((r) => r.remeasure?.())
		})
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', boot)
	} else {
		boot()
	}
})()
